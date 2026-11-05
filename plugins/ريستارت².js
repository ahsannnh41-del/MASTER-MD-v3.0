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

let handler = async (m, { conn }) => {
  try {
    m.reply(`╭─╼⃝🔁 *إعادة تشغيل البوت* 🔧
┃
┃ ⚙️ جاري إعادة تشغيل النظام...
┃ 🕐 انتظر بضع ثوانٍ من فضلك.
╰━⬣`)

    fs.writeFileSync('./restarting.txt', m.chat)

    setTimeout(() => {
      process.exit(0)
    }, 3000)

  } catch (error) {
    console.error(error)
    conn.reply(m.chat, `❌ حدث خطأ: ${error}`, m)
  }
}

setTimeout(async () => {
  const fs = await import('fs')
  const path = './restarting.txt'
  if (fs.existsSync(path)) {
    const chatId = fs.readFileSync(path, 'utf-8')
    global.conn?.sendMessage?.(chatId, {
      text: '✅ *تم تشغيل البوت من جديد، شكراً على انتظارك!*',
    }).catch(console.error)
    fs.unlinkSync(path)
  }
}, 3000)

handler.help = ['restart']
handler.tags = ['owner']
handler.command = ['ريستارت', 'احا', 'إعادة']
handler.rowner = true

export default handler