import { jidNum } from '../lib/utils.js';
import { checkMediaLimit, consumeMediaLimit, limitStatusText } from '../lib/mediaLimit.js';

// Helper: cek limit sebelum jalankan command media
// Kembalikan false jika blocked (sudah kirim pesan error ke user)
async function guardLimit(sender, reply) {
    const info = checkMediaLimit(sender);
    if (info.allowed) return true;
    await reply(
        `⏳ *Limit media harian habis!*\n\n` +
        `${limitStatusText(sender)}\n\n` +
        `💡 Upgrade ke Premium untuk dapat *6x/hari* & harga gold lebih murah!`
    );
    return false;
}

// Tracks the last media message per chat so "!save" / "!repost" can reuse it
const lastMedia = new Map(); // jid -> { type, message, caption }

export function trackMedia(jid, msg) {
    const m = msg.message;
    if (!m) return;
    if (m.imageMessage) lastMedia.set(jid, { type: 'image', msg, caption: m.imageMessage.caption });
    else if (m.videoMessage) lastMedia.set(jid, { type: 'video', msg, caption: m.videoMessage.caption });
    else if (m.audioMessage) lastMedia.set(jid, { type: 'audio', msg });
    else if (m.stickerMessage) lastMedia.set(jid, { type: 'sticker', msg });
    else if (m.documentMessage) lastMedia.set(jid, { type: 'document', msg });
}

export const mediaCommands = {
    async repostLast(sock, reply, jid, sender) {
        if (!await guardLimit(sender, reply)) return;
        const entry = lastMedia.get(jid);
        if (!entry) return reply('❌ Tidak ada media terakhir yang tersimpan di chat ini.');
        try {
            await sock.sendMessage(jid, { forward: entry.msg });
            consumeMediaLimit(sender);
        } catch {
            await reply('❌ Gagal mengirim ulang media.');
        }
    },

    async mediaInfo(reply, jid) {
        const entry = lastMedia.get(jid);
        if (!entry) return reply('❌ Belum ada media yang terdeteksi di chat ini.');
        await reply(`📎 Media terakhir terdeteksi: *${entry.type}*${entry.caption ? `\nCaption: ${entry.caption}` : ''}`);
    },

    async quoteAsSticker(reply) {
        await reply('ℹ️ Fitur konversi gambar→stiker membutuhkan modul tambahan (sharp/webp) yang belum aktif di build ini agar instalasi di Pterodactyl tetap ringan dan stabil. Kirim gambar sebagai stiker langsung dari WhatsApp untuk hasil instan.');
    },

    async profilePicInfo(sock, reply, jid, mentioned, sender) {
        if (!await guardLimit(sender, reply)) return;
        const target = mentioned?.[0] || sender;
        try {
            const url = await sock.profilePictureUrl(target, 'image');
            await sock.sendMessage(jid, { image: { url }, caption: `📸 Foto profil @${jidNum(target)}`, mentions: [target] });
            consumeMediaLimit(sender);
        } catch {
            await reply('❌ Tidak bisa mengambil foto profil (mungkin privasi dibatasi atau tidak ada foto).');
        }
    },

    async getGroupPic(sock, reply, jid, sender) {
        if (!await guardLimit(sender, reply)) return;
        try {
            const url = await sock.profilePictureUrl(jid, 'image');
            await sock.sendMessage(jid, { image: { url }, caption: '📸 Foto profil grup ini' });
            consumeMediaLimit(sender);
        } catch {
            await reply('❌ Grup ini tidak punya foto profil.');
        }
    },
};
