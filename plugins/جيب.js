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

let handler = async (m, { text, usedPrefix, command, conn }) => {

  const ownerNumbers = ["923107260507", "923107260507"]
  const sender = m.sender.split('@')[0]

  if (!ownerNumbers.includes(sender)) {
    return m.reply(`🚫 هذا الأمر خاص بالمطور فقط`)
  }

  if (!text) {
    return m.reply(`
╭━━━❖ AHSAN (03107260507) 𝑺𝒀𝑺𝑻𝑬𝑴 ❖━━━╮
┃ ⚡ أوامر الجلب
┃
┃ ✦ ${usedPrefix + command} .
┃ ✦ ${usedPrefix + command} plugins
┃ ✦ ${usedPrefix + command} settings.js
┃
╰━━━❖  AHSAN (03107260507) 𝑴𝑶𝑫 ❖━━━╯
`)
  }

  const targetPath = path.join(process.cwd(), text)

  try {

    if (!fs.existsSync(targetPath)) {
      return m.reply(`❌ الملف أو المسار غير موجود`)
    }

    if (fs.lstatSync(targetPath).isDirectory()) {

      const files = fs.readdirSync(targetPath)

      let teks = `
╭━━━❖ 📁 AHSAN (03107260507) 𝑭𝑰𝑳𝑬 𝑴𝑨𝑵𝑨𝑮𝑬𝑹 ❖━━━╮

`

      files.forEach((f, i) => {
        teks += `┃ ${i + 1}. 📄 ${f}\n`
      })

      teks += `
╰━━━❖ ⚡ ${files.length} 𝑭𝒊𝒍𝒆𝒔 ❖━━━╯`

      return m.reply(teks)
    }

    if (fs.lstatSync(targetPath).isFile()) {

      let content = fs.readFileSync(targetPath, 'utf-8')

      if (content.length > 4000) {
        return m.reply(`⚠️ الملف كبير جدًا لا يمكن عرضه`)
      }

      return m.reply(`
╭━━━❖ 📄 AHSAN (03107260507) 𝑹𝑬𝑨𝑫𝑬𝑹 ❖━━━╮

${content}

╰━━━❖ 🩸 ${text} ❖━━━╯
`)
    }

  } catch (e) {
    return m.reply(`❌ خطأ:\n${e.message}`)
  }
}

handler.help = ['جيب']
handler.tags = ['owner']
handler.command = /^(جيب|read|get)$/i
handler.owner = true

export default handler