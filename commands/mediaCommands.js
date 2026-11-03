import { jidNum } from '../lib/utils.js';
import { checkMediaLimit, consumeMediaLimit, limitStatusText } from '../lib/mediaLimit.js';

async function guardLimit(sender, reply) {
    const info = checkMediaLimit(sender);
    if (info.allowed) return true;
    await reply(
        `⏳ *Daily Media Limit Reached!*\n\n` +
        `${limitStatusText(sender)}\n\n` +
        `💡 Upgrade to Premium for *6x/day* & discounted gold prices!`
    );
    return false;
}

const lastMedia = new Map();

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
        if (!entry) return reply('❌ No recent media detected in this chat.');
        try {
            await sock.sendMessage(jid, { forward: entry.msg });
            consumeMediaLimit(sender);
        } catch {
            await reply('❌ Failed to repost media.');
        }
    },

    async mediaInfo(reply, jid) {
        const entry = lastMedia.get(jid);
        if (!entry) return reply('❌ No recent media detected in this chat.');
        await reply(`📎 Last detected media: *${entry.type}*${entry.caption ? `\nCaption: ${entry.caption}` : ''}`);
    },

    async quoteAsSticker(reply) {
        await reply('ℹ️ Image to sticker converter is active. Reply to an image or send with caption `.s` or `.sticker`.');
    },

    async profilePicInfo(sock, reply, jid, mentioned, sender) {
        if (!await guardLimit(sender, reply)) return;
        const target = mentioned?.[0] || sender;
        try {
            const url = await sock.profilePictureUrl(target, 'image');
            await sock.sendMessage(jid, { image: { url }, caption: `📸 Profile picture of @${jidNum(target)}`, mentions: [target] });
            consumeMediaLimit(sender);
        } catch {
            await reply('❌ Unable to retrieve profile picture (user privacy settings or no picture set).');
        }
    },

    async getGroupPic(sock, reply, jid, sender) {
        if (!await guardLimit(sender, reply)) return;
        try {
            const url = await sock.profilePictureUrl(jid, 'image');
            await sock.sendMessage(jid, { image: { url }, caption: '📸 Group profile picture' });
            consumeMediaLimit(sender);
        } catch {
            await reply('❌ This group does not have a profile picture.');
        }
    },
};
