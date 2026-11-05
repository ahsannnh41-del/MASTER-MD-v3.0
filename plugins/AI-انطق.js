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

import fetch from 'node-fetch'
import { spawn } from 'child_process'

function toOpus(buffer) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', 'pipe:0',
      '-vn',
      '-c:a', 'libopus',
      '-b:a', '128k',
      '-f', 'ogg',
      'pipe:1'
    ])

    let data = []

    ffmpeg.stdout.on('data', chunk => data.push(chunk))
    ffmpeg.stderr.on('data', () => {})
    ffmpeg.on('close', () => resolve(Buffer.concat(data)))
    ffmpeg.on('error', reject)

    ffmpeg.stdin.write(buffer)
    ffmpeg.stdin.end()
  })
}

let handler = async (m, { conn, text }) => {

  if (!text)
    return m.reply('MASTER MD 〢 اكتب الكلام بعد كلمة "انطق" 🎙️')

  try {

    const channelId =
      global.config?.cenel?.id ||
      '120363406191527808@newsletter'

    const channelName =
      global.config?.cenel?.name ||
      'MASTER MD 〢 𝙲𝙷𝙰𝙽𝙽𝙴𝙻'

    const thumbnailUrl =
      global.config?.img?.nekobot ||
      'https://files.catbox.moe/nrxlve.jpg'

    const senderId = m.sender.split('@')[0]

    const fk = {
      key: {
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
        id: 'Nox'
      },
      message: {
        contactMessage: {
          displayName: '𝙽𝙾𝚇 𝙱𝙾𝚃',
          vcard: `BEGIN:VCARD
VERSION:3.0
FN=Nox Bot
item1.TEL;waid=${senderId}:${senderId}
END:VCARD`
        }
      }
    }

    const url =
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ar&client=tw-ob`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    const buff = await res.buffer()
    const opus = await toOpus(buff)

    await conn.sendMessage(
      m.chat,
      {
        audio: opus,
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true,

        contextInfo: {
          mentionedJid: [m.sender],
          isForwarded: true,
          forwardingScore: 9999,

          forwardedNewsletterMessageInfo: {
            newsletterJid: channelId,
            serverMessageId: 20,
            newsletterName: channelName
          },

          externalAdReply: {
            title: '⚡ MASTER MD ⚡',
            body: 'AHSAN (03107260507)',
            thumbnailUrl: thumbnailUrl,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: fk }
    )

  } catch (e) {

    console.log(e)

    m.reply('MASTER MD 〢 ❌ حصل خطأ أثناء تحويل النص إلى صوت.')
  }
}

handler.command = ['انطق', 'speak']
handler.help = ['انطق']
handler.tags = ['ai']

export default handler