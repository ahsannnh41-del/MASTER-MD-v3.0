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

const userSpamData = {}

let handler = m => m

handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, isPrems }) {
  const chat = global.db?.data?.chats?.[m.chat] || {}
  const bot = global.db?.data?.settings?.[conn.user.jid] || {}

  if (!bot.antiSpam) return
  if (m.isGroup && chat.modoadmin) return

  if (isOwner || isROwner || isAdmin || isPrems) return

  const sender = m.sender
  if (!sender) return

  const currentTime = Date.now()
  const timeWindow = 5000
  const messageLimit = 10

  if (!userSpamData[sender]) {
    userSpamData[sender] = {
      lastMessageTime: currentTime,
      messageCount: 1,
      antiBan: 0
    }

    return
  }

  const userData = userSpamData[sender]
  const timeDifference = currentTime - userData.lastMessageTime

  if (timeDifference <= timeWindow) {
    userData.messageCount++

    if (userData.messageCount >= messageLimit) {
      userData.antiBan++

      if (userData.antiBan === 1) {
        await conn.reply(
          m.chat,
          `⟡ تنبيه أول لـ @${sender.split('@')[0]}\n\nلا ترسل الرسائل بشكل متكرر.`,
          m,
          { mentions: [sender] }
        )

      } else if (userData.antiBan === 2) {
        await conn.reply(
          m.chat,
          `⚡ التنبيه الثاني لـ @${sender.split('@')[0]}\n\nإذا استمر السبام سيتم إخراجك من المجموعة.`,
          m,
          { mentions: [sender] }
        )

      } else if (userData.antiBan >= 3) {

        if (isBotAdmin) {
          try {
            await conn.reply(
              m.chat,
              `⛔ تم إخراج @${sender.split('@')[0]} بسبب السبام.`,
              m,
              { mentions: [sender] }
            )

            await conn.groupParticipantsUpdate(
              m.chat,
              [sender],
              'remove'
            )

            delete userSpamData[sender]

          } catch (err) {
            console.error('حدث خطأ أثناء إخراج المستخدم:', err)

            await conn.reply(
              m.chat,
              `⚠️ تعذر إخراج @${sender.split('@')[0]} رغم أن البوت مشرف.`,
              m,
              { mentions: [sender] }
            )
          }

        } else {
          await conn.reply(
            m.chat,
            `⚠️ لا أستطيع إخراج @${sender.split('@')[0]} لأن البوت ليس مشرفاً.`,
            m,
            { mentions: [sender] }
          )
        }
      }

      userData.messageCount = 1
    }

  } else {
    userData.messageCount = 1
    userData.antiBan = 0
  }

  userData.lastMessageTime = currentTime
}

export default handler