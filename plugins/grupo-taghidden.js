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

import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import axios from 'axios'

const handler = async (m, { conn, args }) => {
  try {
    const chatId = m.chat

    if (!chatId.endsWith('@g.us')) {
      return await conn.sendMessage(chatId, {
        text: `╭━━━〔 ⚠️ 𝐍𝐎𝐗 𝐁𝐎𝐓 〕━━━╮

  هذا الأمر متاح داخل المجموعات فقط.

╰━━━━━━━━━━━━━━━━━━━━━━╯`,
        quoted: m
      })
    }

    const metadata = await conn.groupMetadata(chatId)
    const allMentions = metadata.participants.map(p => p.id)

    let messageToForward = null

    const streamToBuffer = async (stream) => {
      const chunks = []
      for await (const chunk of stream) chunks.push(chunk)
      return Buffer.concat(chunks)
    }

    const getQuotedMessage =
      m.quoted?.message ||
      m.message?.extendedTextMessage?.contextInfo?.quotedMessage

    if (getQuotedMessage) {
      const quoted = getQuotedMessage

      if (quoted.imageMessage) {
        const buffer = await streamToBuffer(
          await downloadContentFromMessage(quoted.imageMessage, 'image')
        )

        messageToForward = {
          image: buffer,
          mimetype: quoted.imageMessage.mimetype || 'image/jpeg',
          caption: quoted.imageMessage.caption || ''
        }

      } else if (quoted.videoMessage) {
        const buffer = await streamToBuffer(
          await downloadContentFromMessage(quoted.videoMessage, 'video')
        )

        messageToForward = {
          video: buffer,
          mimetype: quoted.videoMessage.mimetype || 'video/mp4',
          caption: quoted.videoMessage.caption || ''
        }

      } else if (quoted.audioMessage) {
        const buffer = await streamToBuffer(
          await downloadContentFromMessage(quoted.audioMessage, 'audio')
        )

        messageToForward = {
          audio: buffer,
          mimetype: quoted.audioMessage.mimetype || 'audio/mpeg'
        }

      } else if (quoted.stickerMessage) {
        const buffer = await streamToBuffer(
          await downloadContentFromMessage(quoted.stickerMessage, 'sticker')
        )

        messageToForward = {
          sticker: buffer
        }

      } else if (quoted.documentMessage) {
        const buffer = await streamToBuffer(
          await downloadContentFromMessage(quoted.documentMessage, 'document')
        )

        messageToForward = {
          document: buffer,
          mimetype: quoted.documentMessage.mimetype || 'application/octet-stream',
          caption: quoted.documentMessage.caption || ''
        }

      } else if (
        quoted.conversation ||
        quoted.extendedTextMessage?.text
      ) {
        messageToForward = {
          text:
            quoted.conversation ||
            quoted.extendedTextMessage.text
        }
      }
    }

    if (!messageToForward && args.join(' ').trim()) {
      messageToForward = {
        text: args.join(' ')
      }
    }

    if (!messageToForward) {
      return await conn.sendMessage(chatId, {
        text: `╭━━━〔 📢 𝐍𝐎𝐗 〕━━━╮

✦ قم بالرد على رسالة
✦ أو اكتب النص الذي تريد إرساله

مثال:
┃ .مخفي أهلاً بالجميع

╰━━━━━━━━━━━━━━━━━━━━╯`,
        quoted: m
      })
    }

    const getThumbnail = async () => {
      try {
        const res = await axios.get(
          'https://i.postimg.cc/rFfVL8Ps/image.jpg',
          { responseType: 'arraybuffer' }
        )

        return Buffer.from(res.data)
      } catch {
        return null
      }
    }

    const thumbnail = await getThumbnail()

    const fakeProduct = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast'
      },

      message: {
        productMessage: {
          product: {
            productImage: {
              mimetype: 'image/jpeg',
              jpegThumbnail: thumbnail
            },

            title: `⚡ ${global.botname || 'Ｎｏｘ Ｂｏｔ'}`,

            description:
              'إشعار من نظام Nox • تم استدعاء جميع أعضاء المجموعة',

            currencyCode: 'USD',

            priceAmount1000: 0,

            retailerId:
              global.botname || 'Nox Bot',

            productImageCount: 1
          },

          businessOwnerJid: '0@s.whatsapp.net'
        }
      }
    }

    await conn.sendMessage(
      chatId,
      {
        ...messageToForward,
        mentions: allMentions
      },
      {
        quoted: fakeProduct
      }
    )

  } catch (error) {
    console.error(error)

    await conn.sendMessage(m.chat, {
      text: `╭━━━〔 ❌ 𝐍𝐎𝐗 𝐁𝐎𝐓 〕━━━╮

حدث خطأ أثناء تنفيذ العملية.

╰━━━━━━━━━━━━━━━━━━━━━━╯`,
      quoted: m
    })
  }
}

handler.help = ['مخفي']
handler.tags = ['grupo']
handler.command = ['مخفي', 'hidden']
handler.group = true
handler.admin = true
handler.botAdmin = false

export default handler