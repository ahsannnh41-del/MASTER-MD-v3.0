/*
⚡ MASTER MD ⚡
AHSAN (03107260507)

「 𝐂𝐫𝐞𝐝𝐢𝐭𝐬 𝐛𝐲 AHSAN (03107260507) 」
「 لا تحذف الحقوق 🖤 」
𝐍𝐎𝐗 channel
https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
𝙎𝙃𝘼𝙉𝙆𝙎 channel
https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
 📜 𝙏𝙝𝙞𝙨 𝙞𝙨 𝙩𝙝𝙚 𝙍𝙀𝙋𝙊 𝙡𝙞𝙣𝙠 𝙬𝙞𝙩𝙝 𝙖𝙡𝙡 𝙩𝙝𝙚 𝙘𝙤𝙙𝙚𝙨:
⚡ https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
*/

import { delay } from '@whiskeysockets/baileys';

const handler = async (m, { conn }) => {
    if (!m.quoted) return m.reply('📌 رد على رسالة');

    try {
        const chatId = m.chat;
        const stanzaId = m.quoted.id;

        const tempId = await conn.relayMessage(chatId, {
            groupStatusMessageV2: {
                message: {
                    extendedTextMessage: {
                        text: '',
                        contextInfo: { isGroupStatus: true }
                    }
                }
            }
        }, {});

        await conn.relayMessage(chatId, {
            protocolMessage: {
                key: { jid: chatId, fromMe: true, id: tempId },
                type: 14,
                editedMessage: {
                    extendedTextMessage: {
                        text: '\0',
                        contextInfo: { isGroupStatus: false }
                    }
                }
            }
        }, { messageId: stanzaId });

        await delay(100);

        await Promise.allSettled([
            conn.sendMessage(chatId, { delete: { remoteJid: chatId, id: tempId, fromMe: true } }),
            conn.sendMessage(chatId, { delete: { remoteJid: chatId, id: stanzaId, fromMe: false } })
        ]);
    } catch (e) {
        console.error('[dmsg]', e);
        m.reply('❌ ' + (e?.message || e));
    }
};

handler.command = /^(dmsg|حذف|مسح)$/i;
handler.tags = ['owner'];
handler.owner = true;
handler.group = true;
export default handler;