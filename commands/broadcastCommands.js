// ═══════════════════════════════════════════════════════════════════
//  BROADCASTCOMMANDS.JS — Group & User Broadcast Engine (Owner Only)
//  Developer: AHSAN (03107260507)
// ═══════════════════════════════════════════════════════════════════

import { allUsers } from '../lib/db.js';

function isOwnerCheck(isOwner, reply) {
    if (!isOwner) {
        reply('❌ This command can only be used by the Bot Owner/Creator.');
        return false;
    }
    return true;
}

async function getAllGroupJids(sock) {
    try {
        const groups = await sock.groupFetchAllParticipating();
        return Object.keys(groups || {});
    } catch {
        return [];
    }
}

export const broadcastCommands = {

    // ─── BROADCAST TO ALL GROUPS ─────────────────────────────────────────
    async broadcastToGroups(sock, reply, args, isOwner) {
        if (!isOwnerCheck(isOwner, reply)) return;
        const text = args.join(' ');
        if (!text) return reply('📌 Usage: *.broadcast [message]*\nSends an announcement to all groups where the bot is present.');

        const groupJids = await getAllGroupJids(sock);
        if (!groupJids.length) return reply('❌ Bot is not currently in any groups or failed to retrieve group list.');

        let success = 0, failed = 0;
        for (const gid of groupJids) {
            try {
                await sock.sendMessage(gid, {
                    text: `📢 *OFFICIAL DEVELOPER ANNOUNCEMENT*\n👑 *Developer:* AHSAN (03107260507)\n\n${text}\n\n📢 Official Channel: https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46`
                });
                success++;
            } catch {
                failed++;
            }
        }
        await reply(`✅ Group broadcast complete!\n📤 Delivered: ${success} groups\n❌ Failed: ${failed} groups`);
    },

    // ─── BROADCAST TO ALL REGISTERED USERS ───────────────────────────────
    async broadcastToUsers(sock, reply, args, isOwner) {
        if (!isOwnerCheck(isOwner, reply)) return;
        const text = args.join(' ');
        if (!text) return reply('📌 Usage: *.broadcastuser [message]*\nSends a direct message to all users in the bot database.');

        const users = allUsers();
        const jids = Object.keys(users || {}).filter(jid => users[jid]);
        if (!jids.length) return reply('❌ No registered users found in the database.');

        let success = 0, failed = 0;
        for (const jid of jids) {
            try {
                await sock.sendMessage(jid, {
                    text: `📢 *OFFICIAL MESSAGE FROM DEVELOPER AHSAN*\n\n${text}\n\n📢 Official Channel: https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46`
                });
                success++;
            } catch {
                failed++;
            }
        }
        await reply(`✅ User broadcast complete!\n📤 Delivered: ${success}\n❌ Failed: ${failed}`);
    },

    // ─── PARTICIPATING GROUPS COUNT ──────────────────────────────────────
    async listGroupsCount(sock, reply, isOwner) {
        if (!isOwnerCheck(isOwner, reply)) return;
        const groupJids = await getAllGroupJids(sock);
        await reply(`📋 Bot is currently active in *${groupJids.length}* groups.`);
    },
};
