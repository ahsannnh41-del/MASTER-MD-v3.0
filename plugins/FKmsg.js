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

const handler = async (m, { conn, text }) => {
    if (!m.quoted) return m.reply('📌 رد على رسالة + اكتب النص الجديد');
    if (!text) return m.reply('📌 اكتب النص البديل');

    const stanzaId = m.quoted.id;

    try {
        const tempId = await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: '',
                contextInfo: { isGroupStatus: true }
            }
        }, {});

        const tempId2 = await conn.relayMessage(m.chat, {
            protocolMessage: {
                key: { jid: m.chat, fromMe: true, id: tempId },
                type: 14,
                editedMessage: {
                    extendedTextMessage: {
                        text,
                        contextInfo: { isGroupStatus: false }
                    }
                }
            }
        }, { messageId: stanzaId });

        await delay(100);

        await Promise.allSettled([
            conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: tempId, fromMe: true } }),
            conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, id: tempId2, fromMe: true } })
        ]);

        await m.react('✅');
    } catch (e) {
        console.error('[fakemsg]', e);
        m.reply('❌ ' + (e?.message || e));
    }
};

handler.command = /^فيك$/i;
handler.tags = ['owner'];
handler.owner = true;
handler.group = true;

export default handler;