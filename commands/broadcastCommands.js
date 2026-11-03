// ─── BROADCAST (OWNER ONLY) ────────────────────────────────────────────────
// Kirim pesan ke semua grup yang bot ikuti, atau ke semua kontak yang pernah
// chat dengan bot. Hanya bisa dipakai oleh Owner/Creator (lihat lib/roles.js).

import { allUsers } from '../lib/db.js';

function isOwnerCheck(isOwner, reply) {
    if (!isOwner) {
        reply('❌ Command ini hanya bisa dipakai oleh owner bot.');
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

    // ─── BROADCAST KE SEMUA GRUP ────────────────────────────────────────
    async broadcastToGroups(sock, reply, args, isOwner) {
        if (!isOwnerCheck(isOwner, reply)) return;
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.broadcast [pesan]*\nMengirim pesan ke semua grup yang bot ikuti.');

        const groupJids = await getAllGroupJids(sock);
        if (!groupJids.length) return reply('❌ Bot belum tergabung di grup manapun, atau gagal mengambil daftar grup.');

        let success = 0, failed = 0;
        for (const gid of groupJids) {
            try {
                await sock.sendMessage(gid, { text: `📢 *BROADCAST DARI OWNER*\n\n${text}` });
                success++;
            } catch {
                failed++;
            }
            // v3.1.1: jeda 800ms antar kirim (dulu di sini demi menghindari
            // deteksi spam WhatsApp) DIHAPUS atas permintaan — prioritas
            // kecepatan, risiko ban diterima.
        }
        await reply(`✅ Broadcast selesai!\n📤 Berhasil: ${success} grup\n❌ Gagal: ${failed} grup`);
    },

    // ─── BROADCAST KE SEMUA USER YANG PERNAH TERCATAT (RPG) ─────────────
    async broadcastToUsers(sock, reply, args, isOwner) {
        if (!isOwnerCheck(isOwner, reply)) return;
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.broadcastuser [pesan]*\nMengirim pesan pribadi ke semua user yang tercatat di database RPG.');

        const users = allUsers();
        const jids = Object.keys(users || {}).filter(jid => users[jid]);
        if (!jids.length) return reply('❌ Belum ada user yang tercatat di database.');

        let success = 0, failed = 0;
        for (const jid of jids) {
            try {
                await sock.sendMessage(jid, { text: `📢 *PESAN DARI OWNER BOT*\n\n${text}` });
                success++;
            } catch {
                failed++;
            }
            // v3.1.1: jeda 800ms dihapus, sama seperti broadcastToGroups di atas.
        }
        await reply(`✅ Broadcast ke user selesai!\n📤 Berhasil: ${success}\n❌ Gagal: ${failed}`);
    },

    // ─── INFO JUMLAH GRUP YANG DIIKUTI BOT ──────────────────────────────
    async listGroupsCount(sock, reply, isOwner) {
        if (!isOwnerCheck(isOwner, reply)) return;
        const groupJids = await getAllGroupJids(sock);
        await reply(`📋 Bot saat ini tergabung di *${groupJids.length}* grup.`);
    },
};
