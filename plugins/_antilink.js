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

const linkRegex = /(chat\.whatsapp\.com\/[0-9A-Za-z]{20,24})|(z?https:\/\/whatsapp\.com\/channel\/[0-9A-Za-z]{20,24})/i

const allowedLinks = [
  'https://whatsapp.com/channel/0029Vb78EOTC1FuLAqNdNr2p'
]

export async function before(m, { conn, isAdmin, isBotAdmin, isMods }) {
  if (!m.isGroup) return
  if (!m?.text) return

  const chat = global?.db?.data?.chats?.[m.chat]
  if (!chat) return

  const isGroupLink = linkRegex.test(m.text)
  const isChannelLink = /whatsapp\.com\/channel\//i.test(m.text)

  const hasAllowedLink = allowedLinks.some(link =>
    m.text.includes(link)
  )

  if (hasAllowedLink) return

  if ((isGroupLink || isChannelLink) && !isAdmin) {

    if (isBotAdmin) {
      const groupCode = await conn.groupInviteCode(m.chat)
      const linkThisGroup = `https://chat.whatsapp.com/${groupCode}`

      if (isGroupLink && m.text.includes(linkThisGroup)) return
    }

    if (
      chat.antilink &&
      isGroupLink &&
      !isAdmin &&
      isBotAdmin &&
      !isMods &&
      m.key.participant !== conn.user.jid
    ) {

      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant
        }
      })

      const user = global.db.data.users[m.key.participant]

      await conn.reply(
        m.chat,
        `> ⏤͟͟͞͞☆ تم حذف الرابط بنجاح من *${user?.name || 'المستخدم'}* 🗑️

> ⚠️ ممنوع إرسال روابط المجموعات داخل المجموعة.

> 𓆩𝐍𝐎𝐗 𝐁𝐎𝐓𓆪 🖤`,
        null
      )

      await conn.groupParticipantsUpdate(
        m.chat,
        [m.key.participant],
        'remove'
      )
    }
  }
}