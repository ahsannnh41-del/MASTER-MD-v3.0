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

import {
    generateWAMessageContent,
    generateWAMessageFromContent,
    proto
} from '@whiskeysockets/baileys'

const fkontak = {
    key: {
        participants: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
        fromMe: false,
        id: 'NOX'
    },
    message: {
        contactMessage: {
            vcard: `BEGIN:VCARD
VERSION:3.0
N:Ｎｏｘ;Ｂｏｔ;;;
FN:Ｎｏｘ Ｂｏｔ
item1.TEL;waid=5219991234567:5219991234567
item1.X-ABLabel:Ponsel
END:VCARD`
        }
    },
    participant: '0@s.whatsapp.net'
}

const handler = async (m, { conn }) => {
    const group = m.chat

    try {
        const image = 'https://files.catbox.moe/xm4gan.jpg'

        const inviteCode = await conn.groupInviteCode(group)
        const link = `https://chat.whatsapp.com/${inviteCode}`

        const title = '╭━━━〔 🔗 𝐍𝐎𝐗 𝐋𝐈𝐍𝐊 〕━━━╮'

        const bodyText = `╭━━━〔 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐍𝐊 〕━━━╮

│ 🔗 *رابط دعوة المجموعة*
│
│ \`${link}\`
│
╰━━━━━━━━━━━━━━━━━━━━╯`

        const footerText =
            '⌁ AHSAN (03107260507) • Ｎｏｘ Ｂｏｔ ⌁'

        const buttons = [
            {
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                    display_text: '📋 نسخ اللينك',
                    copy_code: link
                })
            },
            {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                    display_text: '🌐 فتح اللينك',
                    url: link
                })
            }
        ]

        const { imageMessage } = await generateWAMessageContent(
            {
                image: { url: image }
            },
            {
                upload: conn.waUploadToServer
            }
        )

        const interactive = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },

                        interactiveMessage:
                            proto.Message.InteractiveMessage.fromObject({

                                body:
                                    proto.Message.InteractiveMessage.Body.create({
                                        text: bodyText
                                    }),

                                footer:
                                    proto.Message.InteractiveMessage.Footer.create({
                                        text: footerText
                                    }),

                                header:
                                    proto.Message.InteractiveMessage.Header.fromObject({
                                        title: title,
                                        hasMediaAttachment: true,
                                        imageMessage
                                    }),

                                nativeFlowMessage:
                                    proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                                        buttons: buttons,
                                        messageParamsJson: ''
                                    })
                            })
                    }
                }
            },
            {
                quoted: fkontak
            }
        )

        await conn.relayMessage(
            m.chat,
            interactive.message,
            {
                messageId: interactive.key.id
            }
        )

    } catch (error) {

        console.error(
            '╭━━〔 𝐍𝐎𝐗 𝐄𝐑𝐑𝐎𝐑 〕━━╮\n',
            error,
            '\n╰━━━━━━━━━━━━━━━━━━━━╯'
        )

        const fallbackCode = await conn
            .groupInviteCode(group)
            .catch(() => '')

        const fallbackLink =
            `https://chat.whatsapp.com/${fallbackCode}`

        const fallbackMessage = `╭━━━〔 ❌ 𝐍𝐎𝐗 𝐁𝐎𝐓 〕━━━╮

│ ⚠️ *تعذر إرسال الرسالة التفاعلية.*
│
│ 🔗 *رابط المجموعة:*
│
│ ${fallbackLink}
│
╰━━━━━━━━━━━━━━━━━━━━╯

> AHSAN (03107260507)
> Ｎｏｘ Ｂｏｔ`

        await conn.sendMessage(
            group,
            {
                image: {
                    url: image
                },
                caption: fallbackMessage
            },
            {
                quoted: m
            }
        )
    }
}

handler.help = ['لينك']
handler.tags = ['grupo']
handler.command = ['link', 'enlace', 'لينك']
handler.group = true
handler.botAdmin = true

export default handler