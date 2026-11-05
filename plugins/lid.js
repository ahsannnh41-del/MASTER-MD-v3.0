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

import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text }) => {
    const number = String(text || '').replace(/\D/g, '')

    if (!number) {
        return m.reply(
`╭━━━〔 𝐍𝐎𝐗 〕━━━╮
┃ 🆔 استخراج LID
┃
┃ 📱 اكتب رقم الشخص
┃
┃ مثال:
┃ .lid 923107260507
╰━━━━━━━━━━━━━━╯`
        )
    }

    try {
        const jid = `${number}@s.whatsapp.net`
        let lid = null

        const map = conn?.signalRepository?.lidMapping

        if (map?.getLIDForPN) {
            lid = await map.getLIDForPN(jid)
        }

        if (!lid && m.chat?.endsWith('@g.us')) {
            const metadata = await conn.groupMetadata(m.chat)
            const participants = metadata?.participants || []

            const participant = participants.find(p => {
                const ids = [
                    p.id,
                    p.jid,
                    p.phoneNumber,
                    p.pn,
                    p.user
                ].filter(Boolean)

                return ids.some(id =>
                    String(id).split('@')[0].replace(/\D/g, '') === number
                )
            })

            lid = participant?.lid || null
        }

        if (!lid) {
            return m.reply(
`╭━━━〔 𝐍𝐎𝐗 〕━━━╮
┃ ⚠️ لم يتم العثور على LID
┃
┃ 📱 الرقم:
┃ ${number}
╰━━━━━━━━━━━━━━╯`
        )
        }

        let nox = "𝙽𝙾𝚇 〢 AHSAN (03107260507)";
        let teks = `╭━━━〔 𝐍𝐎𝐗 〕━━━╮
┃ 🆔 تم استخراج LID
┃
┃ 📱 الرقم:
┃ ${number}
┃
┃ 🔑 LID:
┃ ${lid}
╰━━━━━━━━━━━━━━╯`;

        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: nox }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [
                                {
                                    name: "cta_copy",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "📋 نسخ LID",
                                        id: "copy_lid_action",
                                        copy_code: String(lid)
                                    })
                                }
                            ]
                        })
                    })
                }
            }
        }, { quoted: m });

        return await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (e) {
        console.error('LID ERROR:', e)

        return m.reply(
`╭━━━〔 𝐍𝐎𝐗 〕━━━╮
┃ ❌ حدث خطأ
┃
┃ ${e?.message || e}
╰━━━━━━━━━━━━━━╯`
        )
    }
}

handler.help = ['lid']
handler.tags = ['owner']
handler.command = ['lid']

export default handler