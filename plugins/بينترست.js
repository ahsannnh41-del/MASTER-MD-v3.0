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

import axios from 'axios'
import {
  generateWAMessageContent,
  generateWAMessageFromContent,
  proto
} from '@whiskeysockets/baileys'



async function pinterestScraper(query, limit = 10) {
  const url = `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(query)}%26rs%3Dtyped&data=%7B%22options%22%3A%7B%22query%22%3A%22${encodeURIComponent(query)}%22%2C%22scope%22%3A%22pins%22%2C%22rs%22%3A%22typed%22%7D%2C%22context%22%3A%7B%7D%7D`

  const headers = {
    accept: 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'ar-SA,ar;q=0.9,en;q=0.8',
    referer: 'https://id.pinterest.com/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
    'x-app-version': 'c056fb7',
    'x-pinterest-appstate': 'active',
    'x-pinterest-pws-handler': 'www/index.js',
    'x-pinterest-source-url': '/',
    'x-requested-with': 'XMLHttpRequest'
  }

  try {
    const res = await axios.get(url, {
      headers,
      timeout: 30000
    })

    const results =
      res.data?.resource_response?.data?.results

    if (!Array.isArray(results)) return []

    return results
      .map(item => {
        if (!item?.images) return null

        return {
          title:
            item.grid_title ||
            item.title ||
            '𝙽𝙾𝚇 𝙿𝙸𝙽',

          image_large_url:
            item.images?.orig?.url ||
            item.images?.['736x']?.url ||
            item.images?.['564x']?.url ||
            null
        }
      })
      .filter(item => item?.image_large_url)
      .slice(0, limit)

  } catch (error) {
    console.error(
      '[NOX PINTEREST ERROR]',
      error?.response?.status ||
      error?.message
    )

    return []
  }
}

const handler = async (m, { conn, text }) => {
  const query = text?.trim()

  if (!query) {
    return conn.reply(
      m.chat,
      `╭━━〔 𝙽𝙾𝚇 〢 𝙿𝙸𝙽𝚃𝙴𝚁𝙴𝚂𝚃 〕━━╮
│
│ 🖼️ أرسل اسم الشيء الذي تريد البحث عنه.
│
│ مثال:
│ .بنترست لوفي
│
│ 🔎 ابحث عن صورك بسهولة
│ بواسطة نظام NOX.
│
╰━━━━━━━━━━━━━━━━╯
ㅤㅤㅤAHSAN (03107260507)`,
      m
    )
  }

  await m.react('🔎')

  await conn.reply(
    m.chat,
    `╭━━〔 𝙽𝙾𝚇 〢 𝚂𝙴𝙰𝚁𝙲𝙷 〕━━╮
│
│ 🔎 جاري البحث في Pinterest...
│
│ ◈ البحث:
│ ${query}
│
│ ⏳ انتظر قليلاً...
│
╰━━━━━━━━━━━━━━━━╯
ㅤㅤㅤAHSAN (03107260507)`,
    m
  )

  try {
    const searchQuery = `${query} hd`

    const results = await pinterestScraper(
      searchQuery,
      10
    )

    if (!results.length) {
      await m.react('❌')

      return conn.reply(
        m.chat,
        `╭━━〔 𝙽𝙾𝚇 〢 𝙽𝙾 𝚁𝙴𝚂𝚄𝙻𝚃𝚂 〕━━╮
│
│ ❌ لم يتم العثور على نتائج.
│
│ 🔎 البحث:
│ ${query}
│
│ جرّب كلمة بحث مختلفة.
│
╰━━━━━━━━━━━━━━━━╯
ㅤㅤㅤAHSAN (03107260507)`,
        m
      )
    }

    const cards = []
    let counter = 1

    for (const item of results) {
      try {
        const { imageMessage } =
          await generateWAMessageContent(
            {
              image: {
                url: item.image_large_url
              }
            },
            {
              upload: conn.waUploadToServer
            }
          )

        cards.push({
          body:
            proto.Message.InteractiveMessage.Body.fromObject({
              text:
                `╭━━〔 𝙽𝙾𝚇 〢 𝙿𝙸𝙽 〕━━╮
│
│ 🖼️ النتيجة رقم ${counter++}
│
│ 🔎 ${query}
│
╰━━━━━━━━━━━━━━━━╯`
            }),

          footer:
            proto.Message.InteractiveMessage.Footer.fromObject({
              text:
                '𝙽𝙾𝚇 〢 AHSAN (03107260507)'
            }),

          header:
            proto.Message.InteractiveMessage.Header.fromObject({
              title: item.title,
              subtitle: '𝙽𝙾𝚇 〢 𝙿𝙸𝙽𝚃𝙴𝚁𝙴𝚂𝚃',
              hasMediaAttachment: true,
              imageMessage
            }),

          nativeFlowMessage:
            proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
              buttons: [
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: '🔗 فتح Pinterest',
                    url:
                      `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchQuery)}`,
                    merchant_url:
                      `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchQuery)}`
                  })
                }
              ]
            })
        })

      } catch (error) {
        console.error(
          '[NOX PIN CARD ERROR]',
          error?.message
        )
      }
    }

    if (!cards.length) {
      await m.react('❌')

      return conn.reply(
        m.chat,
        `╭━━〔 𝙽𝙾𝚇 〢 𝙴𝚁𝚁𝙾𝚁 〕━━╮
│
│ ⚠️ تعذر تجهيز الصور.
│
│ حاول مرة أخرى بعد قليل.
│
╰━━━━━━━━━━━━━━━━╯
ㅤㅤㅤAHSAN (03107260507)`,
        m
      )
    }

    const messageContent =
      generateWAMessageFromContent(
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
                    proto.Message.InteractiveMessage.Body.fromObject({
                      text:
                        `╭━━〔 𝙽𝙾𝚇 〢 𝙿𝙸𝙽𝚃𝙴𝚁𝙴𝚂𝚃 〕━━╮
│
│ 🖼️ نتائج البحث جاهزة
│
│ 🔎 البحث:
│ ${query}
│
│ 📊 النتائج:
│ ${cards.length}
│
│ ✦ تصفح الصور من الكاروسيل
│
╰━━━━━━━━━━━━━━━━╯
ㅤㅤㅤAHSAN (03107260507)`
                    }),

                  footer:
                    proto.Message.InteractiveMessage.Footer.fromObject({
                      text:
                        '𝙽𝙾𝚇 〢 𝙿𝙸𝙽𝚃𝙴𝚁𝙴𝚂𝚃'
                    }),

                  header:
                    proto.Message.InteractiveMessage.Header.fromObject({
                      title: '𝙽𝙾𝚇 𝙿𝙸𝙽𝚃𝙴𝚁𝙴𝚂𝚃',
                      subtitle:
                        'AHSAN (03107260507)',
                      hasMediaAttachment: false
                    }),

                  carouselMessage:
                    proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                      cards
                    })
                })
            }
          }
        },
        {
          quoted: m
        }
      )

    await conn.relayMessage(
      m.chat,
      messageContent.message,
      {
        messageId: messageContent.key.id
      }
    )

    await m.react('✅')

  } catch (error) {
    console.error(
      '[NOX PINTEREST ERROR]',
      error?.response?.status ||
      error?.message ||
      error
    )

    await m.react('❌')

    return conn.reply(
      m.chat,
      `╭━━〔 𝙽𝙾𝚇 〢 𝙴𝚁𝚁𝙾𝚁 〕━━╮
│
│ ⚠️ حدث خطأ أثناء البحث.
│
│ تعذر الاتصال بخدمة Pinterest.
│
│ حاول مرة أخرى بعد قليل.
│
╰━━━━━━━━━━━━━━━━╯
ㅤㅤㅤAHSAN (03107260507)`,
      m
    )
  }
}

handler.help = [
  'بنترست <بحث>',
  'صور <بحث>'
]

handler.tags = [
  'downloader'
]

handler.command = /^(بنترست|صور)$/i

export default handler