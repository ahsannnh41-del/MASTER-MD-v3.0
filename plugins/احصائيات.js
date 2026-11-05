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

import fs from 'fs'
import path from 'path'
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
    await m.react('📊')

    let pluginsDir = path.join(process.cwd(), 'plugins')
    let totalCommands = 0

    try {
        if (fs.existsSync(pluginsDir)) {
            let files = fs.readdirSync(pluginsDir)
            totalCommands = files.filter(f => f.endsWith('.js')).length
        }
    } catch (e) {
        totalCommands = 158
    }

    let uptimeMs = process.uptime() * 1000

    let hours = Math.floor(
        uptimeMs / (1000 * 60 * 60)
    )

    let minutes = Math.floor(
        (uptimeMs % (1000 * 60 * 60)) / (1000 * 60)
    )

    let seconds = Math.floor(
        (uptimeMs % (1000 * 60)) / 1000
    )

    let uptimeString = `${hours}س ${minutes}د ${seconds}ث`

    let submessages = [
        {
            messageType: 2,
            messageText:
`⚡ MASTER MD ⚡

📊 معلومات وإحصائيات النظام`
        },

        {
            messageType: 4,

            tableMetadata: {
                rows: [
                    {
                        items: [
                            '🤖 اسم البوت',
                            '𝐍𝐎𝐗'
                        ],
                        isHeading: false
                    },

                    {
                        items: [
                            '⚙️ عدد الأوامر',
                            `${totalCommands} أمر`
                        ],
                        isHeading: false
                    },

                    {
                        items: [
                            '⏳ وقت التشغيل',
                            uptimeString
                        ],
                        isHeading: false
                    },

                    {
                        items: [
                            '👑 المطور',
                            'AHSAN (03107260507)'
                        ],
                        isHeading: false
                    },

                    {
                        items: [
                            '📞 رقم المطور',
                            '+923107260507'
                        ],
                        isHeading: false
                    }
                ],

                title: '⌁ 𝐍𝐎𝐗 • 𝐒𝐘𝐒𝐓𝐄𝐌 ⌁'
            }
        },

        {
            messageType: 2,
            messageText:
`🖤 شكراً لاستخدامك 𝐍𝐎𝐗

⌁ AHSAN (03107260507) ⌁`
        }
    ]

    let richMsg = generateWAMessageFromContent(
        m.chat,
        {
            botForwardedMessage: {
                message: {
                    richResponseMessage: {
                        messageType: 1,
                        submessages: submessages,

                        contextInfo: {
                            forwardingScore: 99999,
                            isForwarded: true,

                            forwardedAiBotMessageInfo: {
                                botJid:
                                    conn.user.id.split(':')[0] + '@bot'
                            },

                            forwardOrigin: 4
                        }
                    }
                }
            }
        },
        {}
    )

    await conn.relayMessage(
        m.chat,
        richMsg.message,
        {
            messageId: richMsg.key.id,

            additionalNodes: [
                {
                    tag: 'biz',
                    attrs: {},

                    content: [
                        {
                            tag: 'interactive',

                            attrs: {
                                type: 'native_flow',
                                v: '1'
                            },

                            content: [
                                {
                                    tag: 'native_flow',

                                    attrs: {
                                        v: '9',
                                        name: 'mixed'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    )
}

handler.help = [
    'stats',
    'البوت'
]

handler.tags = ['main']

handler.command =
    /^(stats|الاحصائيات|إحصائيات|البوت)$/i

export default handler