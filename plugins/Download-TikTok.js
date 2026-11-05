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

const APIs = [
   {
      name: 'tikwm',
      fn: async (url) => {
         const params = new URLSearchParams();
         params.set('url', url);
         params.set('hd', '1');

         const { data } = await axios({
            method: 'POST',
            url: 'https://www.tikwm.com/api/',
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
               'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'
            },
            data: params,
            timeout: 15000
         });

         if (!data?.data?.play) throw new Error('tikwm: no video');

         const rawTags = data.data.hashtag || data.data.challenges || [];

         const apiHashtags = Array.isArray(rawTags)
            ? rawTags
                 .map(h =>
                    typeof h === 'string'
                       ? h
                       : h?.title || h?.name || h?.hashtagName
                 )
                 .filter(Boolean)
                 .map(h => h.startsWith('#') ? h : `#${h}`)
            : [];

         return {
            video: data.data.play,
            title: data.data.title || 'TikTok Video',
            cover: data.data.cover,
            duration: data.data.duration || 0,
            author: data.data.author?.nickname || 'Unknown',
            music: data.data.music,
            hashtags: apiHashtags
         };
      }
   },

   {
      name: 'ssstik',
      fn: async (url) => {
         const { data } = await axios({
            method: 'GET',
            url: `https://api.ssstik.io/v1/download?url=${encodeURIComponent(url)}`,
            headers: {
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 15000
         });

         if (!data?.video) throw new Error('ssstik: no video');

         return {
            video: data.video,
            title: data.title || 'TikTok Video',
            cover: data.thumbnail,
            duration: data.duration || 0,
            author: data.author || 'Unknown',
            music: data.music,
            hashtags: []
         };
      }
   }
];

async function tiktokDL(url) {
   let lastErr = null;

   for (const api of APIs) {
      try {
         const result = await api.fn(url);
         return result;
      } catch (e) {
         lastErr = e;
         console.log(`[Nox TikTok] ${api.name} failed: ${e.message}`);
      }
   }

   throw lastErr || new Error('كل الـ APIs فشلت');
}

function extractHashtags(text = '') {
   const matches = text.match(/#[\w\u0600-\u06FF]+/g) || [];
   return [...new Set(matches)];
}

function cleanTitle(text = '') {
   return text.replace(/#[\w\u0600-\u06FF]+/g, '').trim();
}

const handler = async (m, { conn, text, usedPrefix, command }) => {

   if (!text || !text.includes('http')) {
      return conn.sendMessage(
         m.chat,
         {
            text:
`╭━━━〔 𝐍𝐎𝐗 𝐁𝐎𝐓 〕━━━╮

❗ أرسل رابط TikTok لتحميله.

╭─〔 مثال 〕
│ ${usedPrefix}${command} https://vm.tiktok.com/...
╰───────────────╯

⚡ 𝐍𝐎𝐗 𝐓𝐈𝐊𝐓𝐎𝐊`
         },
         { quoted: m }
      );
   }

   try {

      await conn.sendMessage(
         m.chat,
         { react: { text: '⏳', key: m.key } }
      );

      const result = await tiktokDL(text.trim());

      const videoTitle =
         cleanTitle(result.title) || 'TikTok Video';

      const hashtags = result.hashtags?.length
         ? result.hashtags
         : (
            extractHashtags(result.title).length
               ? extractHashtags(result.title)
               : ['#NoxBot', '#TikTok']
         );

      const hashtagPills = hashtags.slice(0, 5).map(tag => ({
         prompt_text: tag,
         prompt_type: "SUGGESTED_PROMPT",
         __typename: "GenAIFollowUpSuggestionPillPrimitive"
      }));

      const interactivePayload = {
         response_id: `nox-tiktok-${Date.now()}`,

         sections: [
            {
               view_model: {
                  primitive: {
                     text:
`✦ **${videoTitle}**

👤 **الناشر:** ${result.author}

⚡ **𝐍𝐎𝐗 𝐁𝐎𝐓**`,
                     __typename: "GenAIMarkdownTextUXPrimitive"
                  },
                  __typename: "GenAISingleLayoutViewModel"
               }
            },

            {
               view_model: {
                  primitive: {
                     media: {
                        url: result.video,
                        mime_type: "video/mp4",
                        duration: result.duration || 10
                     },
                     imagine_type: "ANIMATE",
                     status: {
                        status: "READY"
                     },
                     __typename: "GenAIImaginePrimitive"
                  },
                  __typename: "GenAISingleLayoutViewModel"
               }
            },

            {
               view_model: {
                  primitive: {
                     text: "🏷️ **الهاشتاجات**",
                     __typename: "GenAIMetadataTextPrimitive"
                  },
                  __typename: "GenAISingleLayoutViewModel"
               }
            },

            {
               view_model: {
                  primitives: hashtagPills,
                  __typename: "GenAIActionRowLayoutViewModel"
               }
            },

            {
               view_model: {
                  primitive: {
                     text:
                        "✦ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐃 𝐁𝐘 𝐍𝐎𝐗 𝐁𝐎𝐓 ✦",
                     __typename: "GenAIMetadataTextPrimitive"
                  },
                  __typename: "GenAISingleLayoutViewModel"
               }
            }
         ]
      };

      await conn.relayMessage(
         m.chat,
         {
            messageContextInfo: {
               threadId: [],
               deviceListMetadata: {
                  senderKeyIndexes: [],
                  recipientKeyIndexes: []
               },
               deviceListMetadataVersion: 2,

               botMetadata: {
                  messageDisclaimerText: "",
                  richResponseSourcesMetadata: {
                     sources: []
                  }
               }
            },

            botForwardedMessage: {
               message: {
                  richResponseMessage: {
                     submessages: [
                        {
                           messageType: 2,
                           messageText: videoTitle
                        },
                        {
                           messageType: 2,
                           messageText:
                              `⚡ Nox Bot • ${result.author}`
                        }
                     ],

                     messageType: 1,

                     unifiedResponse: {
                        data: Buffer
                           .from(JSON.stringify(interactivePayload))
                           .toString('base64')
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

                        forwardedAiBotMessageInfo: {
                           botJid: "0@bot"
                        },

                        forwardOrigin: 4
                     }
                  }
               }
            }
         },
         {}
      );

      await conn.sendMessage(
         m.chat,
         { react: { text: '✔️', key: m.key } }
      );

   } catch (e) {

      console.error('Nox TikTok Handler Error:', e);

      await conn.sendMessage(
         m.chat,
         { react: { text: '❌', key: m.key } }
      );

      await conn.sendMessage(
         m.chat,
         {
            text:
`╭━━━〔 ❌ 𝐍𝐎𝐗 𝐁𝐎𝐓 〕━━━╮

تعذر تحميل فيديو TikTok.

✦ السبب:
${e.message || 'خطأ غير معروف'}

╰━━━━━━━━━━━━━━━━━━━━╯`
         },
         { quoted: m }
      );
   }
};

handler.help = ['تيك <رابط>'];
handler.tags = ['downloader'];
handler.command = [
   'تيك',
   'tiktok',
   'تيك_توك',
   'tt'
];

export default handler;