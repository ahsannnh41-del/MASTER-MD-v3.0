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

import axios from 'axios';

const API_BASE = 'https://engez.a7a.online/api/v1';

async function generateVideo(prompt, aiSound = false) {
    try {
        const params = new URLSearchParams();
        params.append('prompt', prompt);
        if (aiSound) params.append('aiSound', 'true');

        const response = await axios.get(`${API_BASE}/ai/video-gen?${params.toString()}`, {
            timeout: 300000
        });
        if (!response.data?.success) throw new Error(response.data?.error || 'فشل توليد الفيديو');
        return response.data.response;
    } catch (error) {
        throw new Error(error.message || 'فشل الاتصال بـ API التوليد');
    }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            '🎬 *توليد فيديو بالذكاء الاصطناعي - N O X*\n\n' +
            '📌 *الاستخدام:*\n' +
            `• ${usedPrefix}${command} <وصف الفيديو>\n` +
            `• ${usedPrefix}${command} -صوت <وصف الفيديو> (بدون صوت)\n\n` +
            '📌 *مثال:*\n' +
            `• ${usedPrefix}${command} قط يرقص\n` +
            `• ${usedPrefix}${command} -صوت رجل يركض في الغابة`
        );
    }

    await m.react('⏳');

    try {
        let prompt = text;
        let aiSound = true;

        if (prompt.includes('-صوت') || prompt.includes('-noaudio')) {
            aiSound = false;
            prompt = prompt.replace(/-صوت|-noaudio/g, '').trim();
        }

        const result = await generateVideo(prompt, aiSound);

        if (!result?.url) throw new Error('لم يتم العثور على رابط الفيديو');

        
        const interactivePayload = {
            response_id: `ai-video-${Date.now()}`,
            sections: [
                {
                    view_model: {
                        primitive: { 
                            text: `🎬 **AI Video Generated**\n📝 **الوصف:** ${prompt}\n🔊 **الصوت:** ${aiSound ? 'مفعل' : 'معطل'}`, 
                            __typename: "GenAIMarkdownTextUXPrimitive" 
                        },
                        __typename: "GenAISingleLayoutViewModel"
                    }
                },
                {
                    view_model: {
                        primitive: {
                            media: { 
                                url: result.url, 
                                mime_type: "video/mp4", 
                                duration: 10 
                            }, 
                            imagine_type: "ANIMATE", 
                            status: { status: "READY" }, 
                            __typename: "GenAIImaginePrimitive" 
                        },
                        __typename: "GenAISingleLayoutViewModel"
                    }
                },
                {
                    view_model: {
                        primitives: [
                            { prompt_text: "⚡WILLIAM", prompt_type: "SUGGESTED_PROMPT", __typename: "GenAIFollowUpSuggestionPillPrimitive" },
                            { prompt_text: "🎬 إعادة التوليد", prompt_type: "SUGGESTED_PROMPT", __typename: "GenAIFollowUpSuggestionPillPrimitive" },
                            { prompt_text: "👑 N O X", prompt_type: "SUGGESTED_PROMPT", __typename: "GenAIFollowUpSuggestionPillPrimitive" }
                        ],
                        __typename: "GenAIActionRowLayoutViewModel"
                    }
                },
                {
                    view_model: {
                        primitive: { text: "⚡ DEVELOPED BY WILLIAM", __typename: "GenAIMetadataTextPrimitive" },
                        __typename: "GenAISingleLayoutViewModel"
                    }
                }
            ]
        };

        
        await conn.relayMessage(m.chat, {
            messageContextInfo: {
                threadId: [],
                deviceListMetadata: { senderKeyIndexes: [], recipientKeyIndexes: [] },
                deviceListMetadataVersion: 2,
                botMetadata: { messageDisclaimerText: "", richResponseSourcesMetadata: { sources: [] } }
            },
            botForwardedMessage: {
                message: {
                    richResponseMessage: {
                        submessages: [
                            { messageType: 2, messageText: `Prompt: ${prompt}` },
                            { messageType: 2, messageText: `Audio: ${aiSound ? 'ON' : 'OFF'}` }
                        ],
                        messageType: 1,
                        unifiedResponse: {
                            data: Buffer.from(JSON.stringify(interactivePayload)).toString('base64')
                        },
                        contextInfo: {
                            mentionedJid: [],
                            groupMentions: [],
                            statusAttributions: [],
                            stanzaId: m.id,
                            participant: m.sender,
                            remoteJid: m.chat,
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedAiBotMessageInfo: { botJid: "0@bot" },
                            forwardOrigin: 4
                        }
                    }
                }
            }
        }, {});

        await m.react('✅');

    } catch (error) {
        await m.react('❌');
        return m.reply(`❌ *خطأ:* ${error.message || 'فشل توليد الفيديو'}`);
    }
};

handler.command = ['فيديو-ذكاء', 'ai-video', 'فيديو-ai'];
handler.help = ['فيديو-ذكاء <وصف>'];
handler.tags = ['ai'];

export default handler;