// ═══════════════════════════════════════════════════════════════════
//  ADMINCOMMANDS6.JS — Advanced Group Management:
//    1) Bulk Operations  2) Activity Tracker
//    3) Task Assignment  4) Maintenance Mode
//  Developer: AHSAN (03107260507)
// ═══════════════════════════════════════════════════════════════════

import { store, save } from '../lib/db.js';
import { fmtNum } from '../lib/utils.js';

function requireAdmin(ctx) {
    if (!ctx.isAdmin) { ctx.reply('❌ Group Admins only.'); return false; }
    return true;
}

function extractAllMentioned(ctx) {
    return ctx.mentioned || [];
}

// ═══════════════════════════════════════════════════════════════════
//  1) BULK OPERATIONS
// ═══════════════════════════════════════════════════════════════════
export async function bulkPromote(ctx) {
    if (!requireAdmin(ctx)) return;
    const targets = extractAllMentioned(ctx);
    if (!targets.length) return ctx.reply('⚠️ Usage: `.bulkpromote @user1 @user2 @user3 ...`');
    try {
        await ctx.sock.groupParticipantsUpdate(ctx.jid, targets, 'promote');
        return ctx.reply(`✅ ${targets.length} members successfully promoted to admin.`);
    } catch (err) {
        return ctx.reply(`❌ Failed: ${err.message}`);
    }
}

export async function bulkDemote(ctx) {
    if (!requireAdmin(ctx)) return;
    const targets = extractAllMentioned(ctx);
    if (!targets.length) return ctx.reply('⚠️ Usage: `.bulkdemote @user1 @user2 @user3 ...`');
    try {
        await ctx.sock.groupParticipantsUpdate(ctx.jid, targets, 'demote');
        return ctx.reply(`✅ ${targets.length} admins demoted to regular members.`);
    } catch (err) {
        return ctx.reply(`❌ Failed: ${err.message}`);
    }
}

export async function bulkKick(ctx) {
    if (!requireAdmin(ctx)) return;
    const targets = extractAllMentioned(ctx);
    if (!targets.length) return ctx.reply('⚠️ Usage: `.bulkkick @user1 @user2 @user3 ...`');
    if (targets.length > 15) return ctx.reply('❌ Maximum 15 members per command (to prevent WhatsApp rate limits).');
    try {
        await ctx.sock.groupParticipantsUpdate(ctx.jid, targets, 'remove');
        return ctx.reply(`✅ ${targets.length} members successfully removed from group.`);
    } catch (err) {
        return ctx.reply(`❌ Failed: ${err.message}`);
    }
}

// ═══════════════════════════════════════════════════════════════════
//  2) ACTIVITY TRACKER
// ═══════════════════════════════════════════════════════════════════
function activityStore() { return store('memberActivity', {}); }
function activityKey(jid, sender) { return `${jid}:${sender}`; }

export function trackActivity(jid, sender) {
    const data = activityStore();
    const key = activityKey(jid, sender);
    const entry = data[key] || { messageCount: 0 };
    entry.messageCount += 1;
    entry.lastMessageAt = Date.now();
    data[key] = entry;
    save('memberActivity');
}

export async function listInactive(ctx) {
    if (!requireAdmin(ctx)) return;
    const days = parseInt(ctx.args[0], 10) || 7;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const data = activityStore();
    const meta = await ctx.sock.groupMetadata(ctx.jid).catch(() => null);
    if (!meta) return ctx.reply('❌ Failed to fetch group members.');

    const inactive = [];
    for (const p of meta.participants) {
        if (p.admin) continue;
        const entry = data[activityKey(ctx.jid, p.id)];
        if (!entry || entry.lastMessageAt < cutoff) inactive.push(p.id);
    }
    if (!inactive.length) return ctx.reply(`✅ No inactive non-admin members found in the last ${days}+ days.`);
    let txt = `😴 *INACTIVE MEMBERS (${days}+ days)* — Total ${inactive.length}\n\n`;
    inactive.slice(0, 40).forEach((jid, i) => { txt += `${i + 1}. \`${jid.split('@')[0]}\`\n`; });
    if (inactive.length > 40) txt += `\n_...and ${inactive.length - 40} more._`;
    return ctx.reply(txt);
}

export async function topActive(ctx) {
    const data = activityStore();
    const prefix = `${ctx.jid}:`;
    const entries = Object.entries(data)
        .filter(([key]) => key.startsWith(prefix))
        .map(([key, val]) => ({ jid: key.slice(prefix.length), ...val }))
        .sort((a, b) => b.messageCount - a.messageCount)
        .slice(0, 15);
    if (!entries.length) return ctx.reply('ℹ️ No chat activity recorded yet for this group.');
    let txt = `🏆 *MOST ACTIVE GROUP MEMBERS*\n\n`;
    entries.forEach((e, i) => {
        const medal = ['🥇', '🥈', '🥉'][i] || `${i + 1}.`;
        txt += `${medal} \`${e.jid.split('@')[0]}\` — ${fmtNum(e.messageCount)} messages\n`;
    });
    return ctx.reply(txt);
}

// ═══════════════════════════════════════════════════════════════════
//  3) TASK ASSIGNMENT
// ═══════════════════════════════════════════════════════════════════
function taskStore() { return store('groupTasks', {}); }

export async function taskAssign(ctx) {
    if (!requireAdmin(ctx)) return;
    const quotedParticipant = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant;
    const target = quotedParticipant || ctx.mentioned?.[0];
    const text = ctx.body.replace(/@\d+/, '').split(' ').slice(1).join(' ').trim();
    if (!target || !text) return ctx.reply('⚠️ Usage: `.assigntask @user [task description]` or reply to user message.');

    const data = taskStore();
    const list = data[ctx.jid] || [];
    list.push({ id: list.length + 1, target, text, assignedBy: ctx.sender, assignedAt: Date.now(), done: false });
    data[ctx.jid] = list;
    save('groupTasks');
    try {
        await ctx.sock.sendMessage(target, { text: `📋 *New task assigned in group!*\n\n${text}\n\nMark complete with \`.donetask ${list.length}\` in the group.` });
    } catch {}
    return ctx.reply(`✅ Task #${list.length} assigned to \`${target.split('@')[0]}\`.`);
}

export async function taskMine(ctx) {
    const data = taskStore();
    const list = data[ctx.jid] || [];
    const mine = list.filter(t => t.target === ctx.sender && !t.done);
    if (!mine.length) return ctx.reply('✅ No active tasks assigned to you in this group.');
    let txt = `📋 *YOUR ASSIGNED TASKS*\n\n`;
    mine.forEach(t => { txt += `#${t.id} — ${t.text}\n`; });
    txt += `\nMark complete: \`.donetask [number]\``;
    return ctx.reply(txt);
}

export async function taskList(ctx) {
    if (!requireAdmin(ctx)) return;
    const data = taskStore();
    const list = (data[ctx.jid] || []).filter(t => !t.done);
    if (!list.length) return ctx.reply('✅ No pending tasks in this group.');
    let txt = `📋 *ACTIVE GROUP TASKS* — Total ${list.length}\n\n`;
    list.forEach(t => { txt += `#${t.id} — \`${t.target.split('@')[0]}\`: ${t.text}\n`; });
    return ctx.reply(txt);
}

export async function taskDone(ctx) {
    const id = parseInt(ctx.args[0], 10);
    if (!id) return ctx.reply('⚠️ Usage: `.donetask [task_number]`');
    const data = taskStore();
    const list = data[ctx.jid] || [];
    const task = list.find(t => t.id === id);
    if (!task) return ctx.reply('❌ Task with that number was not found.');
    if (task.target !== ctx.sender && !ctx.isAdmin) return ctx.reply('❌ Only the assigned member (or admin) can mark this task complete.');
    task.done = true;
    save('groupTasks');
    return ctx.reply(`✅ Task #${id} marked as completed!`);
}

// ═══════════════════════════════════════════════════════════════════
//  4) MAINTENANCE MODE
// ═══════════════════════════════════════════════════════════════════
function maintenanceStore() { return store('groupMaintenance', {}); }

export function isMaintenanceMode(jid) {
    return !!maintenanceStore()[jid];
}

export async function maintenanceToggle(ctx) {
    if (!ctx.isAdmin && !ctx.isOwner && !ctx.isCreator) {
        return ctx.reply('❌ Only Group Admins, Owner, or Creator can change maintenance mode.');
    }
    const arg = (ctx.args[0] || '').toLowerCase();
    if (!['on', 'off'].includes(arg)) {
        return ctx.reply(`📌 *Maintenance Mode* — When active, the bot only responds to Owner/Creator in this group.\n\nStatus: *${isMaintenanceMode(ctx.jid) ? '✅ ON' : '❌ OFF'}*\n\nType \`.maintenancemode on\` or \`.maintenancemode off\``);
    }
    const data = maintenanceStore();
    data[ctx.jid] = arg === 'on';
    save('groupMaintenance');
    return ctx.reply(`${arg === 'on' ? '🛠️ Maintenance mode ACTIVATED' : '✅ Maintenance mode DEACTIVATED'} for this group.`);
}
