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

export async function before(m, { conn, isAdmin, isMods, isROwner }) {
  if (!m.isGroup) return
  if (!m || !m.text) return

  const chat = global.db.data.chats[m.chat] || {}

  if (chat.modoadmin) {
    if (!isAdmin && !isMods && !isROwner) {
      return true
    }
  }

  return false
}

export async function modoadmin(m, { args }) {
  const chat = global.db.data.chats[m.chat] || {}

  if (!args[0]) return

  if (args[0].toLowerCase() === "on") {
    chat.modoadmin = true
    global.db.data.chats[m.chat] = chat
  }

  if (args[0].toLowerCase() === "off") {
    chat.modoadmin = false
    global.db.data.chats[m.chat] = chat
  }
}