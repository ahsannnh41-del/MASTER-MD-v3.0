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

const { proto, generateWAMessage, areJidsSameUser } = (await import('@whiskeysockets/baileys')).default

export async function all(m, chatUpdate) {
  if (m.isBaileys) return
  if (!m.message) return
  if (!m.msg.fileSha256) return

  if (!(Buffer.from(m.msg.fileSha256).toString('base64') in global.db.data.sticker)) return

  let hash = global.db.data.sticker[
    Buffer.from(m.msg.fileSha256).toString('base64')
  ]

  let { text, mentionedJid } = hash

  let messages = await generateWAMessage(
    m.chat,
    {
      text: text,
      mentions: mentionedJid
    },
    {
      userJid: this.user.id,
      quoted: m.quoted && m.quoted.fakeObj
    }
  )

  messages.key.fromMe = areJidsSameUser(m.sender, this.user.id)
  messages.key.id = m.key.id
  messages.pushName = m.pushName

  if (m.isGroup) messages.participant = m.sender

  let msg = {
    ...chatUpdate,
    messages: [
      proto.WebMessageInfo.fromObject(messages)
    ],
    type: 'append'
  }

  this.ev.emit('messages.upsert', msg)
}