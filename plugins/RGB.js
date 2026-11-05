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

import { generateWAMessageFromContent } from "@whiskeysockets/baileys";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let inputText = text || (m.quoted && (m.quoted.text || m.quoted.body)) || "RGB text with animation lmaooo";
    
    try {
        const generateUUID = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0;
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        };

       
        const htmlPayload = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @keyframes moveRGB {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }
  body {
    margin: 0;
    padding: 0;
    background: transparent;
  }
  pre {
    font-family: monospace;
    font-size: 15px;
    font-weight: bold;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-x: hidden;
  }
  .rgb-anim {
    background: linear-gradient(90deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: moveRGB 3s linear infinite;
    display: inline-block;
  }
</style>
</head>
<body>
<pre><code class="rgb-anim">${inputText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
</body>
</html>`;

        const sectionsData = [
            {
                view_model: {
                    primitive: {
                        __typename: "GenAIaeacdsnwHtmlPrimitive",
                        payload: htmlPayload,
                        trusted_sources: ["shanks.dev"]
                    },
                    __typename: "GenAISingleLayoutViewModel"
                }
            }
        ];

        const richMessage = {
            richResponseMessage: {
                messageType: 1,
                submessages: [
                    {
                        messageType: 2,
                        messageText: `\n✨ *التأثير المتحرك تماماً *\n`,
                    }
                ],
                unifiedResponse: {
                    data: Buffer.from(
                        JSON.stringify({
                            response_id: generateUUID(),
                            sections: sectionsData
                        })
                    ).toString("base64")
                },
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedAiBotMessageInfo: { 
                        botJid: "867051314767696@bot"
                    },
                    forwardOrigin: 4
                }
            }
        };

        const msg = await generateWAMessageFromContent(m.chat, { 
            botForwardedMessage: { message: richMessage } 
        }, {
            quoted: m
        });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (e) {
        console.error(e);
        m.reply("❌ حدث خطأ أثناء إرسال الكود!");
    }
};

handler.help = ["rgb <النص>"];
handler.tags = ["tools", "قسم الأدوات🛠️"];
handler.command = /^(rgb|رينبو)$/i;

export default handler;