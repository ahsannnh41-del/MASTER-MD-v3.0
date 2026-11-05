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

import { prepareWAMessageMedia, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

const timeout = 60000
const poin = 2000


async function sendEndButtonMessage(conn, m, text, buttonText = 'اللعب مرة أخرى', commandTrigger = '.احزر') {
  const interactiveMessage = {
    body: { text },
    footer: { text: '𝐍𝐎𝐗 𝐁𝐎𝐓 • 𝙒𝙄𝙇𝙇𝙄𝘼𝙈 𝙓 𝙍𝙄𝙉𝙑' },
    nativeFlowMessage: {
      buttons: [
        {
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({
            display_text: buttonText,
            id: commandTrigger
          })
        }
      ]
    }
  }

  const msg = generateWAMessageFromContent(
    m.chat,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.fromObject(interactiveMessage)
        }
      }
    },
    { userJid: conn.user.jid, quoted: m }
  )

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

let handler = async (m, { conn, command }) => {
  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = { exp: 0 }
  }

  let user = global.db.data.users[m.sender]

  
  if (command.startsWith('answer_')) {
    let id = m.chat
    let Ruby = conn.Ruby?.[id]

    if (!Ruby) {
      return conn.reply(
        m.chat,
        `╭━━〔 𝐍𝐎𝐗 〕━━╮
│
│ ⚠️ لا يوجد تحدي نشط حالياً.
│
│ ✦ اكتب *.احزر* لبدء تحدي جديد.
│
╰━━━━━━━━━━━━╯`,
        m
      )
    }

    let selectedAnswer = command.replace('answer_', '')
    let isCorrect = Ruby.correctAnswer === selectedAnswer

    if (isCorrect) {
      user.exp += poin

      clearTimeout(Ruby.timer)
      delete conn.Ruby[id]

      const text = `╭━━〔 𝐍𝐎𝐗 • 𝐂𝐎𝐑𝐑𝐄𝐂𝐓 〕━━╮
│
│ ✓ إجابة صحيحة!
│
│ ✦ المكافأة : +${poin} XP
│ ✦ الإجابة : ${selectedAnswer}
│
│ 𝐍𝐎𝐗 𝐁𝐎𝐓 🖤
│
╰━━━━━━━━━━━━━━━━╯`

      await sendEndButtonMessage(conn, m, text)

    } else {
      Ruby.attempts -= 1

      if (Ruby.attempts > 0) {
        await conn.reply(
          m.chat,
          `╭━━〔 𝐍𝐎𝐗 • 𝐖𝐑𝐎𝐍Ghost 〕━━╮
│
│ ✕ إجابة غير صحيحة.
│
│ ✦ المحاولات المتبقية : ${Ruby.attempts}
│
│ حاول مرة أخرى.
│
╰━━━━━━━━━━━━━━━━╯`,
          m
        )

      } else {
        const text = `╭━━〔 𝐍𝐎𝐗 • 𝐄𝐍𝐃 〕━━╮
│
│ ✕ انتهت جميع المحاولات.
│
│ ✦ الإجابة الصحيحة :
│ 「 ${Ruby.correctAnswer} 」
│
╰━━━━━━━━━━━━━━━━╯`

        clearTimeout(Ruby.timer)
        delete conn.Ruby[id]

        await sendEndButtonMessage(conn, m, text)
      }
    }
  }

  
  else {
    try {
      conn.Ruby = conn.Ruby || {}

      let id = m.chat

      if (conn.Ruby[id]) {
        return conn.reply(
          m.chat,
          `╭━━〔 𝐍𝐎𝐗 • 𝐀𝐋𝐄𝐑𝐓 〕━━╮
│
│ ⚠️ يوجد تحدي نشط بالفعل.
│
│ ✦ أكمل التحدي الحالي أولاً.
│
╰━━━━━━━━━━━━━━━━╯`,
          m
        )
      }

      const res = await fetch(
        'https://gist.githubusercontent.com/Kyutaka101/98d564d49cbf9b539fee19f744de7b26/raw/f2a3e68bbcdd2b06f9dbd5f30d70b9fda42fec14/guessflag'
      )

      if (!res.ok) {
        throw new Error('فشل جلب بيانات التحدي')
      }

      const flagsData = await res.json()
      const flagItem = flagsData[Math.floor(Math.random() * flagsData.length)]
      const { img, name } = flagItem

      let options = [name]

      while (options.length < 4) {
        let randomName = flagsData[Math.floor(Math.random() * flagsData.length)].name
        if (!options.includes(randomName)) {
          options.push(randomName)
        }
      }

      options.sort(() => Math.random() - 0.5)

      const media = await prepareWAMessageMedia(
        { image: { url: img } },
        { upload: conn.waUploadToServer }
      )

      const interactiveMessage = {
        body: {
          text: `╭━━〔 𝐍𝐎𝐗 • 𝐆𝐔𝐄𝐒𝐒 〕━━╮
│
│ ✦ تحدي تخمين الشخصية
│
│ اختر الإجابة الصحيحة من الخيارات.
│
│ ⏱ الوقت : 60 ثانية
│ 🪙 الجائزة : ${poin} XP
│ ⚔ المحاولات : 2
│
│ ✦ اكتب *.لفل* لمعرفة مستواك.
│
╰━━━━━━━━━━━━━━━━╯`
        },

        footer: {
          text: '𝐍𝐎𝐗 𝐁𝐎𝐓 • 𝙒𝙄𝙇𝙇𝙄𝘼𝙈 𝙓 𝙍𝙄𝙉𝙑'
        },

        header: {
          hasMediaAttachment: true,
          subtitle: '✦ اختر الإجابة الصحيحة',
          imageMessage: media.imageMessage
        },

        nativeFlowMessage: {
          buttons: options.map((option) => ({
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({
              display_text: `⌁ ${option}`,
              id: `.answer_${option}`
            })
          }))
        }
      }

      const msg = generateWAMessageFromContent(
        m.chat,
        {
          viewOnceMessage: {
            message: {
              interactiveMessage: proto.Message.InteractiveMessage.fromObject(interactiveMessage)
            }
          }
        },
        { userJid: conn.user.jid, quoted: m }
      )

      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

      conn.Ruby[id] = {
        correctAnswer: name,
        options,

        timer: setTimeout(async () => {
          if (conn.Ruby[id]) {
            const timeText = `╭━━〔 𝐍𝐎𝐗 • 𝐓𝐈𝐌𝐄 〕━━╮
│
│ ⌛ انتهى وقت التحدي.
│
│ ✦ الإجابة الصحيحة :
│ 「 ${name} 」
│
╰━━━━━━━━━━━━━━━━╯`

            delete conn.Ruby[id]
            await sendEndButtonMessage(conn, m, timeText)
          }
        }, timeout),

        attempts: 2
      }

    } catch (e) {
      console.error('Error in Nox guess plugin:', e)

      conn.reply(
        m.chat,
        `╭━━〔 𝐍𝐎𝐗 • 𝐄𝐑𝐑𝐎𝐑 〕━━╮
│
│ ✕ حدث خطأ أثناء تحميل التحدي.
│
│ ✦ السبب :
│ ${e.message || 'خطأ في الاتصال أو تحميل الصورة'}
│
╰━━━━━━━━━━━━━━━━╯`,
        m
      )
    }
  }
}

handler.help = ['احزر']
handler.tags = ['game']
handler.command = /^(احزر|answer_.+)$/i

export default handler