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

import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const REPORTS_GROUP = '120363413167609310@g.us'

let handler = async (m, { conn, text, command, pushName }) => {
    const isReport = command === 'إبلاغ' || command === 'ابلاغ'

    if (!text || !text.trim()) {
        return conn.reply(
            m.chat,
            isReport
                ? `> MASTER MD 〢 𝙸𝙱𝙻𝙰𝙶
>
> 🚨 اكتب المشكلة بعد الأمر.
>
> ✦ مثال:
> .إبلاغ البوت مش بيرد على أوامر الجروب
>
> 𝚆𝙸𝙻𝙻𝙸𝙰𝙼 × 𝚂𝙷𝙰𝙽𝙺𝚂`
                : `> MASTER MD 〢 𝙸𝙺𝚃𝙸𝚁𝙰𝙷
>
> 💡 اكتب اقتراحك بعد الأمر.
>
> ✦ مثال:
> .اقتراح ضيفوا أمر تحويل العملات
>
> 𝚆𝙸𝙻𝙻𝙸𝙰𝙼 × 𝚂𝙷𝙰𝙽𝙺𝚂`,
            m
        )
    }

    await m.react('🕒')

    const senderName = pushName || m.pushName || 'غير معروف'
    const senderNumber = m.sender.split('@')[0]
    const chatType = m.isGroup ? 'داخل جروب' : 'دردشة خاصة'

    let groupName = ''

    if (m.isGroup) {
        try {
            const meta = await conn.groupMetadata(m.chat, false)
            groupName = meta.subject || m.chat
        } catch {
            groupName = m.chat
        }
    }

    const typeTitle = isReport ? '🚨 إبلاغ عن مشكلة' : '💡 اقتراح جديد'

    
    const htmlPayload = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>NOX Report Card</title>
<style>
html,body{margin:0;background:transparent;font-family:'Segoe UI',Arial}
*{box-sizing:border-box}
.wrap{max-width:620px;margin:auto;padding:12px}
.card{width:100%;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;border-radius:20px;padding:18px;box-shadow:0 10px 30px rgba(102,126,234,.4);position:relative;overflow:hidden}
.header{font-size:16px;font-weight:900;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,.2);padding-bottom:8px}
.info-row{font-size:12px;margin-bottom:6px;display:flex;gap:6px}
.info-label{opacity:.8;font-weight:bold}
.info-val{font-weight:600}
.message-box{background:rgba(0,0,0,.25);border-radius:10px;padding:10px;margin-top:10px;font-size:12px;line-height:1.5;word-break:break-word}
.footer-credit{font-size:9px;text-align:center;margin-top:10px;opacity:.75;letter-spacing:1px}
.spark{position:absolute;width:4px;height:4px;background:#fff;border-radius:50%;animation:sparkle 2s linear infinite}
@keyframes sparkle{0%{opacity:0;transform:scale(0)}50%{opacity:1;transform:scale(1.5)}100%{opacity:0;transform:scale(0)}}
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="header">
      <span>${typeTitle}</span>
      <span style="font-size:11px;background:rgba(0,0,0,.3);padding:3px 8px;border-radius:6px">𝐍𝐎𝐗 𝐁𝐎𝐓</span>
    </div>
    <div class="info-row"><span class="info-label">👤 الاسم:</span> <span class="info-val">${senderName}</span></div>
    <div class="info-row"><span class="info-label">🪪 الرقم:</span> <span class="info-val">+${senderNumber}</span></div>
    <div class="info-row"><span class="info-label">📍 المصدر:</span> <span class="info-val">${chatType} ${groupName ? '• ' + groupName : ''}</span></div>
    <div class="message-box"><b>📝 المحتوى:</b><br>${text.trim()}</div>
    <div class="footer-credit">⌁ 𝐍𝐎𝐗 • AHSAN (03107260507) ⌁</div>
    <div class="spark" style="top:20px;left:30px;animation-delay:0s"></div>
    <div class="spark" style="top:50px;right:40px;animation-delay:0.5s"></div>
    <div class="spark" style="bottom:30px;left:50px;animation-delay:1s"></div>
  </div>
</div>
</body>
</html>`

    const submessages = [
        {
            messageType: 2,
            messageText: `⚡ MASTER MD ⚡\n\n${isReport ? '🚨 بلاغ جديد' : '💡 اقتراح جديد'}`
        },
        {
            messageType: 2,
            messageText: `🖤 تم استقبال ${isReport ? 'البلاغ' : 'الاقتراح'} بنجاح\n\n⌁ 𝚆𝙸𝙻𝙻𝙸𝙰𝙼 × 𝚂𝙷𝙰𝙽𝙺𝚂 ⌁`
        }
    ]

    const sections = [
        {
            __typename: 'GenAIUnifiedResponseSection',
            view_model: {
                __typename: 'GenAISingleLayoutViewModel',
                primitive: {
                    __typename: 'GenAIaeacdsnwHtmlPrimitive',
                    payload: htmlPayload
                }
            }
        }
    ]

    try {
        const richMsg = generateWAMessageFromContent(
            REPORTS_GROUP,
            {
                botForwardedMessage: {
                    message: {
                        richResponseMessage: {
                            messageType: 1,
                            submessages,
                            unifiedResponse: {
                                data: Buffer.from(JSON.stringify({
                                    "__typename": "GenAIUnifiedResponse",
                                    "response_id": "nox-report-response",
                                    "sections": sections
                                })).toString("base64")
                            },
                            contextInfo: {
                                forwardingScore: 99999,
                                isForwarded: true,
                                forwardedAiBotMessageInfo: {
                                    botJid: conn.user.id.split(':')[0] + '@bot'
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
            REPORTS_GROUP,
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

        await m.react('✔️')

        
        const successTitle = isReport ? '🚨 تم إرسال بلاغك بنجاح' : '💡 تم إرسال اقتراحك بنجاح'
        
        const successHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Gradient Success Card</title>
<style>
html,body{margin:0;background:transparent;font-family:'Segoe UI',Arial}
.wrap{max-width:620px;margin:auto;padding:12px}
.card{background:#0f0f0f;border-radius:20px;padding:22px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.08)}
.title{font-size:20px;font-weight:900;background:linear-gradient(90deg,#ff0080,#ff8c00,#40e0d0,#ff0080);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:gradient 3s linear infinite;margin-bottom:6px}
.sub{color:#aaa;font-size:12px;margin-top:6px;line-height:1.4}
.credit{color:#fff;font-size:11px;font-weight:bold;margin-top:12px;letter-spacing:1px;opacity:.9}
@keyframes gradient{0%{background-position:0%}100%{background-position:300%}}
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="title">MASTER MD 〢 𝚂𝚄𝙲𝙲𝙴𝚂𝚂</div>
    <div class="sub">${successTitle}<br>🖤 شكرًا لمساعدتك في تطوير 𝐍𝐎𝐗</div>
    <div class="credit">𝚆𝙸𝙻𝙻𝙸𝙰𝙼 × 𝚂𝙷𝙰𝙽𝙺𝚂</div>
  </div>
</div>
</body>
</html>`

        const successSubmessages = [
            {
                messageType: 2,
                messageText: `⚡ MASTER MD ⚡`
            },
            {
                messageType: 2,
                messageText: `⌁ 𝚆𝙸𝙻𝙻𝙸𝙰𝙼 × 𝚂𝙷𝙰𝙽𝙺𝚂 ⌁`
            }
        ]

        const successSections = [
            {
                __typename: 'GenAIUnifiedResponseSection',
                view_model: {
                    __typename: 'GenAISingleLayoutViewModel',
                    primitive: {
                        __typename: 'GenAIaeacdsnwHtmlPrimitive',
                        payload: successHtml
                    }
                }
            }
        ]

        const successRichMsg = generateWAMessageFromContent(
            m.chat,
            {
                botForwardedMessage: {
                    message: {
                        richResponseMessage: {
                            messageType: 1,
                            submessages: successSubmessages,
                            unifiedResponse: {
                                data: Buffer.from(JSON.stringify({
                                    "__typename": "GenAIUnifiedResponse",
                                    "response_id": "nox-success-response",
                                    "sections": successSections
                                })).toString("base64")
                            },
                            contextInfo: {
                                forwardingScore: 99999,
                                isForwarded: true,
                                forwardedAiBotMessageInfo: {
                                    botJid: conn.user.id.split(':')[0] + '@bot'
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
            successRichMsg.message,
            {
                messageId: successRichMsg.key.id,
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

    } catch (e) {
        console.error(e)

        await m.react('✖️')

        await conn.reply(
            m.chat,
            `> MASTER MD 〢 𝙴𝚁𝚁𝙾𝚁
>
> ❌ تعذر إرسال ${isReport ? 'البلاغ' : 'الاقتراح'}.
>
> ✦ حاول مرة أخرى بعد قليل.
>
> 𝚆𝙸𝙻𝙻𝙸𝙰𝙼 × 𝚂𝙷𝙰𝙽𝙺𝚂`,
            m
        )
    }
}

handler.help = ['إبلاغ', 'اقتراح']
handler.tags = ['tools']
handler.command = ['إبلاغ', 'ابلاغ', 'اقتراح']

export default handler