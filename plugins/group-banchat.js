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

import fs from 'fs'
import path from 'path'

const handler = async (m, { isAdmin, isROwner }) => {

  const senderNumber =
    String(m.sender || '')
      .replace(/\D/g, '')

  const botPath =
    path.join(
      './Sessions/SubBot',
      senderNumber
    )

  

  const isSocketUser =
    fs.existsSync(botPath)

  if (!(isAdmin || isROwner || isSocketUser)) {
    return m.reply(
      `╭━━━〔 🚫 𝙉𝙊𝙓 𝘼𝘾𝘾𝙀𝙎𝙎 〕━━━╮
┃
┃ ❌ لا تملك صلاحية استخدام
┃    هذا الأمر.
┃
┃ 🛡️ المسموح لهم:
┃
┃ • مشرف المجموعة
┃ • مالك البوت
┃ • مستخدمو الـ SubBot
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
    )
  }

  

  global.db.data.chats[m.chat] =
    global.db.data.chats[m.chat] || {}

  global.db.data.chats[m.chat].isBanned =
    true

  

  return m.reply(
    `╭━━━〔 🌓 𝙉𝙊𝙓 〕━━━╮
┃
┃ 🔒 تم تعطيل البوت في هذه
┃    المجموعة بنجاح.
┃
┃ 🛡️ الحالة: 𝘽𝘼𝙉𝙉𝙀𝘿
┃ 🌑 النظام: 𝙉𝙊𝙓 𝘾𝙊𝙉𝙏𝙍𝙊𝙇
┃
┃ 💡 لإعادة التفعيل استخدم
┃    أمر فك الحظر الخاص بالبوت.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
  )
}

handler.help = [
  'بانشات',
  'حظر_البوت',
  'banchat'
]

handler.tags = [
  'group'
]

handler.command = [
  'بانشات',
  'حظر_البوت',
  'banchat'
]

handler.group = true

export default handler