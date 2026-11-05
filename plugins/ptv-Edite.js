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
import { theme } from '../lib/theme.js';

const API_URL = 'https://2b.hidenfree.com';

const DEFAULT_KEYWORDS = [
    'anime edit',
    'naruto edit',
    'jjk edit',
    'demon slayer edit',
    'chainsaw man edit',
    'solo leveling edit',
    'bleach edit',
    'guts edit'
];

const CHANNELS = [
    {
        jid: '120363426042842162@newsletter',
        name: 'MASTER MD'
    },
    {
        jid: '120363426042842162@newsletter',
        name: 'MASTER MD •'
    }
];

const handler = async (m, { conn, text }) => {
    try {
        await conn.sendMessage(m.chat, {
            react: {
                text: '🎬',
                key: m.key
            }
        });

        const randomChannel =
            CHANNELS[Math.floor(Math.random() * CHANNELS.length)];

        const searchQuery = text?.trim()
            ? `${text.trim()} edit`
            : DEFAULT_KEYWORDS[
                Math.floor(Math.random() * DEFAULT_KEYWORDS.length)
            ];

        const searchRes = await axios.get(
            `${API_URL}/api/pinterest/search`,
            {
                params: {
                    q: searchQuery,
                    type: 'video',
                    limit: 5
                },
                timeout: 30000,
                validateStatus: () => true
            }
        );

        const videos = searchRes.data?.results || [];

        if (!videos.length) {
            throw new Error('لا توجد فيديوهات');
        }

        const randomVideo =
            videos[Math.floor(Math.random() * videos.length)];

        if (!randomVideo?.url) {
            throw new Error('رابط الفيديو غير موجود');
        }

        const downloadRes = await axios.get(
            `${API_URL}/api/pinterest/public`,
            {
                params: {
                    api_key: 'free_key',
                    url: randomVideo.url,
                    type: 'video'
                },
                timeout: 300000,
                validateStatus: () => true
            }
        );

        const downloadData = downloadRes.data;

        if (!downloadData?.success || !downloadData?.fileKey) {
            throw new Error('فشل التحميل');
        }

        const fileRes = await axios.get(
            `${API_URL}/api/pinterest/download?file=${encodeURIComponent(downloadData.fileKey)}`,
            {
                responseType: 'arraybuffer',
                timeout: 300000,
                validateStatus: () => true
            }
        );

        const videoBuffer = Buffer.from(fileRes.data);

        if (!videoBuffer.length) {
            throw new Error('ملف فارغ');
        }

        await conn.sendMessage(
            m.chat,
            {
                video: videoBuffer,
                ptv: true,
                caption: theme.build([
                    {
                        type: 'title',
                        text: `🎬 إيـديـت: ${text?.trim() || 'أنـمـي'}`
                    },
                    {
                        type: 'divider'
                    },
                    {
                        type: 'info',
                        label: 'الـمـطـور',
                        value: "I'm MASTER MD"
                    }
                ]),
                contextInfo: {
                    isForwarded: true,
                    forwardingScore: 999,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: randomChannel.jid,
                        newsletterName: randomChannel.name,
                        serverMessageId: '0'
                    }
                }
            },
            {
                quoted: m
            }
        );

        await conn.sendMessage(m.chat, {
            react: {
                text: '✅',
                key: m.key
            }
        });

    } catch (e) {
        console.error('خطأ في ptv-Edit:', e);

        try {
            await conn.sendMessage(m.chat, {
                react: {
                    text: '❌',
                    key: m.key
                }
            });

            await conn.reply(
                m.chat,
                theme.build([
                    {
                        type: 'title',
                        text: '❌ فـشـل الـتـحـمـيـل'
                    },
                    {
                        type: 'subtitle',
                        text: 'حدث خطأ أثناء جلب الفيديو'
                    },
                    {
                        type: 'divider'
                    },
                    {
                        type: 'line',
                        text: 'حاول مرة أخرى لاحقاً'
                    }
                ]),
                m
            );
        } catch (replyError) {
            console.error('خطأ أثناء إرسال رسالة الخطأ:', replyError);
        }
    }
};

handler.help = ['انمي'];
handler.tags = ['anime'];
handler.command = /^(بوتي|بوت|انم)$/i;

export default handler;