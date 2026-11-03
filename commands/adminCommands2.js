import { updateGroupSettings, store, save } from '../lib/db.js';
import { jidNum } from '../lib/utils.js';

function isAdminCheck(isAdmin, reply) {
    if (!isAdmin) {
        reply('❌ Only group admins can use this command!');
        return false;
    }
    return true;
}

// Simple per-group note/rules storage
function getGroupExtra(jid) {
    const extras = store('groupExtras');
    if (!extras[jid]) {
        extras[jid] = { rules: null, notes: [], polls: [], banned: [] };
        save('groupExtras');
    }
    return extras[jid];
}
function saveExtra(jid) {
    save('groupExtras');
}

export const adminCommands2 = {
    // ─── RULES ────────────────────────────────────────────────────────────
    async setRules(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const text = args.join(' ');
        if (!text) return reply('📌 Usage: *!setrules [group rules text]*');
        const extra = getGroupExtra(jid);
        extra.rules = text;
        saveExtra(jid);
        await reply('✅ Group rules saved successfully.');
    },

    async showRules(reply, jid) {
        const extra = getGroupExtra(jid);
        await reply(extra.rules ? `📋 *GROUP RULES*\n\n${extra.rules}` : '❌ No rules set for this group yet. Admins can use *!setrules*.');
    },

    // ─── NOTES (sticky info admins can save) ──────────────────────────────
    async addNote(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const text = args.join(' ');
        if (!text) return reply('📌 Usage: *!addnote [note text]*');
        const extra = getGroupExtra(jid);
        extra.notes.push({ text, ts: Date.now() });
        saveExtra(jid);
        await reply(`✅ Note added (#${extra.notes.length}).`);
    },

    async listNotes(reply, jid) {
        const extra = getGroupExtra(jid);
        if (!extra.notes.length) return reply('📝 No notes saved yet.');
        const lines = extra.notes.map((n, i) => `${i + 1}. ${n.text}`).join('\n');
        await reply(`📝 *GROUP NOTES*\n\n${lines}`);
    },

    async deleteNote(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const idx = parseInt(args?.[0]) - 1;
        const extra = getGroupExtra(jid);
        if (isNaN(idx) || !extra.notes[idx]) return reply('📌 Usage: *!delnote [note number]*');
        extra.notes.splice(idx, 1);
        saveExtra(jid);
        await reply('✅ Note deleted successfully.');
    },

    // ─── SIMPLE POLLS ─────────────────────────────────────────────────────
    async createPoll(sock, reply, jid, msg, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Usage: *!poll [question]*\nMembers can vote by picking an option.');
        try {
            await sock.sendMessage(jid, {
                poll: { name: text, values: ['Agree', 'Disagree'], selectableCount: 1 },
            });
        } catch {
            await reply(`📊 *POLL*\n\n${text}\n\n1️⃣ Agree\n2️⃣ Disagree\n\n(Reply with your choice number)`);
        }
    },

    // ─── ANTI-DELETE NOTICE ────────────────────────────────────────────────
    async antidelete(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const status = (args[0] || '').toLowerCase();
        updateGroupSettings(jid, { antidelete: status === 'on' });
        await reply(status === 'on'
            ? '✅ Anti-delete activated. Bot will notify when messages are deleted by senders.'
            : '❌ Anti-delete disabled.');
    },

    // ─── GROUP STATISTIC ────────────────────────────────────────────────────
    async groupActivity(sock, reply, jid) {
        try {
            const metadata = await sock.groupMetadata(jid);
            const admins = metadata.participants.filter(p => p.admin).length;
            await reply(`📊 *GROUP STATISTICS*\n\n👥 Total members: ${metadata.participants.length}\n👑 Admins: ${admins}\n📛 Name: ${metadata.subject}\n🆔 ID: ${jid}`);
        } catch {
            await reply('❌ Failed to retrieve group statistics.');
        }
    },

    // ─── BLOCK / UNBLOCK (bot-level) ───────────────────────────────────────
    async banUser(reply, jid, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if (!mentioned?.[0]) return reply('📌 Usage: *!ban @tag* — bans user from using bot in this group.');
        const extra = getGroupExtra(jid);
        if (!extra.banned.includes(mentioned[0])) extra.banned.push(mentioned[0]);
        saveExtra(jid);
        await reply(`🚫 @${jidNum(mentioned[0])} has been banned from using bot commands in this group.`);
    },

    async unbanUser(reply, jid, mentioned, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        if (!mentioned?.[0]) return reply('📌 Usage: *!unban @tag*');
        const extra = getGroupExtra(jid);
        extra.banned = extra.banned.filter(id => id !== mentioned[0]);
        saveExtra(jid);
        await reply(`✅ @${jidNum(mentioned[0])} has been unbanned.`);
    },

    isBanned(jid, sender) {
        const extra = getGroupExtra(jid);
        return extra.banned.includes(sender);
    },

    async listBanned(reply, jid) {
        const extra = getGroupExtra(jid);
        if (!extra.banned.length) return reply('✅ No users currently banned from the bot in this group.');
        const lines = extra.banned.map((id, i) => `${i + 1}. @${jidNum(id)}`).join('\n');
        await reply(`🚫 *BANNED BOT USERS*\n━━━━━━━━━━━━━━━━━━\n${lines}\n━━━━━━━━━━━━━━━━━━\n💡 Users on this list will be prevented from running commands.`);
    },

    async unbanAll(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const extra = getGroupExtra(jid);
        const total = extra.banned.length;
        extra.banned = [];
        saveExtra(jid);
        await reply(total ? `✅ ${total} user(s) unbanned successfully.` : '✅ No banned users found.');
    },

    // ─── AUTO-RESPONSE CONFIG ───────────────────────────────────────────────
    async setAutoReply(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const [trigger, ...replyParts] = args;
        const replyText = replyParts.join(' ');
        if (!trigger || !replyText) return reply('📌 Usage: *!autoreply [trigger] [response text]*');

        const extra = getGroupExtra(jid);
        if (!extra.autoReplies) extra.autoReplies = {};
        extra.autoReplies[trigger.toLowerCase()] = replyText;
        saveExtra(jid);
        await reply(`✅ Auto-reply for "${trigger}" configured successfully.`);
    },

    async listAutoReply(reply, jid) {
        const extra = getGroupExtra(jid);
        const entries = Object.entries(extra.autoReplies || {});
        if (!entries.length) return reply('📝 No auto-replies configured yet.');
        const lines = entries.map(([k, v]) => `• "${k}" → ${v}`).join('\n');
        await reply(`🤖 *AUTO-REPLY LIST*\n\n${lines}`);
    },

    checkAutoReply(jid, body) {
        const extra = getGroupExtra(jid);
        const entries = Object.entries(extra.autoReplies || {});
        const lower = body.toLowerCase();
        const match = entries.find(([k]) => lower.includes(k));
        return match ? match[1] : null;
    },
};
