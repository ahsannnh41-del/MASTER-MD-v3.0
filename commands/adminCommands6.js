// ═══════════════════════════════════════════════════════════════════
//  ADMINCOMMANDS6.JS — Batch admin baru:
//    1) Bulk operations  2) Activity tracker
//    3) Task assignment  4) Maintenance mode
//
//  (Awalnya juga rencana nambah "Group Rules", tapi ternyata .setrules/
//  .rules SUDAH ADA lewat adminCommands2.js — dilewati supaya tidak
//  duplikat fitur yang sama persis.)
// ═══════════════════════════════════════════════════════════════════

import { store, save } from '../lib/db.js';
import { fmtNum } from '../lib/utils.js';

function requireAdmin(ctx) {
    if (!ctx.isAdmin) { ctx.reply('❌ Khusus Admin grup.'); return false; }
    return true;
}

function extractAllMentioned(ctx) {
    // Bulk operations pakai SEMUA yang di-mention dalam 1 pesan (bukan
    // cuma yang pertama seperti extractTarget di file lain).
    return ctx.mentioned || [];
}

// ═══════════════════════════════════════════════════════════════════
//  1) BULK OPERATIONS
// ═══════════════════════════════════════════════════════════════════
export async function bulkPromote(ctx) {
    if (!requireAdmin(ctx)) return;
    const targets = extractAllMentioned(ctx);
    if (!targets.length) return ctx.reply('⚠️ Cara pakai: `.bulkpromote @user1 @user2 @user3 ...`');
    try {
        await ctx.sock.groupParticipantsUpdate(ctx.jid, targets, 'promote');
        return ctx.reply(`✅ ${targets.length} member berhasil dipromote jadi admin.`);
    } catch (err) {
        return ctx.reply(`❌ Gagal: ${err.message}`);
    }
}

export async function bulkDemote(ctx) {
    if (!requireAdmin(ctx)) return;
    const targets = extractAllMentioned(ctx);
    if (!targets.length) return ctx.reply('⚠️ Cara pakai: `.bulkdemote @user1 @user2 @user3 ...`');
    try {
        await ctx.sock.groupParticipantsUpdate(ctx.jid, targets, 'demote');
        return ctx.reply(`✅ ${targets.length} admin berhasil diturunkan jadi member biasa.`);
    } catch (err) {
        return ctx.reply(`❌ Gagal: ${err.message}`);
    }
}

export async function bulkKick(ctx) {
    if (!requireAdmin(ctx)) return;
    const targets = extractAllMentioned(ctx);
    if (!targets.length) return ctx.reply('⚠️ Cara pakai: `.bulkkick @user1 @user2 @user3 ...`');
    if (targets.length > 15) return ctx.reply('❌ Maksimal 15 orang sekaligus (biar tidak kena rate-limit WhatsApp).');
    try {
        await ctx.sock.groupParticipantsUpdate(ctx.jid, targets, 'remove');
        return ctx.reply(`✅ ${targets.length} member berhasil dikeluarkan dari grup.`);
    } catch (err) {
        return ctx.reply(`❌ Gagal: ${err.message}`);
    }
}

// ═══════════════════════════════════════════════════════════════════
//  2) ACTIVITY TRACKER — hook-nya ada di lib/messagePipeline.js
//     (trackActivity dipanggil di sana tiap ada pesan masuk dari grup)
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
    if (!meta) return ctx.reply('❌ Gagal ambil data member grup.');

    const inactive = [];
    for (const p of meta.participants) {
        if (p.admin) continue; // skip admin dari daftar inaktif
        const entry = data[activityKey(ctx.jid, p.id)];
        if (!entry || entry.lastMessageAt < cutoff) inactive.push(p.id);
    }
    if (!inactive.length) return ctx.reply(`✅ Tidak ada member (non-admin) yang inaktif ${days}+ hari.`);
    let txt = `😴 *MEMBER INAKTIF (${days}+ hari)* — ${inactive.length} orang\n\n`;
    inactive.slice(0, 40).forEach((jid, i) => { txt += `${i + 1}. \`${jid.split('@')[0]}\`\n`; });
    if (inactive.length > 40) txt += `\n_...dan ${inactive.length - 40} lainnya._`;
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
    if (!entries.length) return ctx.reply('ℹ️ Belum ada data aktivitas untuk grup ini.');
    let txt = `🏆 *TOP MEMBER PALING AKTIF*\n\n`;
    entries.forEach((e, i) => {
        const medal = ['🥇', '🥈', '🥉'][i] || `${i + 1}.`;
        txt += `${medal} \`${e.jid.split('@')[0]}\` — ${fmtNum(e.messageCount)} pesan\n`;
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
    if (!target || !text) return ctx.reply('⚠️ Cara pakai: `.assigntask @user [deskripsi tugas]` atau reply pesan target + tulis tugasnya.');

    const data = taskStore();
    const list = data[ctx.jid] || [];
    list.push({ id: list.length + 1, target, text, assignedBy: ctx.sender, assignedAt: Date.now(), done: false });
    data[ctx.jid] = list;
    save('groupTasks');
    try {
        await ctx.sock.sendMessage(target, { text: `📋 *Tugas baru dari grup!*\n\n${text}\n\nTandai selesai lewat \`.donetask ${list.length}\` di grup terkait.` });
    } catch {}
    return ctx.reply(`✅ Tugas #${list.length} diberikan ke \`${target.split('@')[0]}\`.`);
}

export async function taskMine(ctx) {
    const data = taskStore();
    const list = data[ctx.jid] || [];
    const mine = list.filter(t => t.target === ctx.sender && !t.done);
    if (!mine.length) return ctx.reply('✅ Tidak ada tugas aktif untuk kamu di grup ini.');
    let txt = `📋 *TUGAS KAMU*\n\n`;
    mine.forEach(t => { txt += `#${t.id} — ${t.text}\n`; });
    txt += `\nTandai selesai: \`.donetask [nomor]\``;
    return ctx.reply(txt);
}

export async function taskList(ctx) {
    if (!requireAdmin(ctx)) return;
    const data = taskStore();
    const list = (data[ctx.jid] || []).filter(t => !t.done);
    if (!list.length) return ctx.reply('✅ Tidak ada tugas aktif di grup ini.');
    let txt = `📋 *SEMUA TUGAS AKTIF* — ${list.length}\n\n`;
    list.forEach(t => { txt += `#${t.id} — \`${t.target.split('@')[0]}\`: ${t.text}\n`; });
    return ctx.reply(txt);
}

export async function taskDone(ctx) {
    const id = parseInt(ctx.args[0], 10);
    if (!id) return ctx.reply('⚠️ Cara pakai: `.donetask [nomor]`');
    const data = taskStore();
    const list = data[ctx.jid] || [];
    const task = list.find(t => t.id === id);
    if (!task) return ctx.reply('❌ Tugas dengan nomor itu tidak ditemukan.');
    if (task.target !== ctx.sender && !ctx.isAdmin) return ctx.reply('❌ Cuma yang ditugaskan (atau admin) yang bisa tandai tugas ini selesai.');
    task.done = true;
    save('groupTasks');
    return ctx.reply(`✅ Tugas #${id} ditandai selesai.`);
}

// ═══════════════════════════════════════════════════════════════════
//  5) MAINTENANCE MODE — hook-nya ada di lib/messagePipeline.js
// ═══════════════════════════════════════════════════════════════════
function maintenanceStore() { return store('groupMaintenance', {}); }

export function isMaintenanceMode(jid) {
    return !!maintenanceStore()[jid];
}

export async function maintenanceToggle(ctx) {
    if (!ctx.isAdmin && !ctx.isOwner && !ctx.isCreator) {
        return ctx.reply('❌ Hanya Admin grup, Owner, atau Creator yang bisa mengubah mode ini.');
    }
    const arg = (ctx.args[0] || '').toLowerCase();
    if (!['on', 'off'].includes(arg)) {
        return ctx.reply(`📌 *Maintenance Mode* — saat ON, bot cuma respon Owner/Creator (member lain diabaikan sementara)\n\nStatus: *${isMaintenanceMode(ctx.jid) ? '✅ ON' : '❌ OFF'}*\n\nKetik \`.maintenancemode on\` atau \`.maintenancemode off\``);
    }
    const data = maintenanceStore();
    data[ctx.jid] = arg === 'on';
    save('groupMaintenance');
    return ctx.reply(`${arg === 'on' ? '🛠️ Maintenance mode AKTIF' : '✅ Maintenance mode NONAKTIF'} untuk grup ini.`);
}
