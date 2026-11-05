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

import fetch from "node-fetch"

let handler = async (m, { conn, text }) => {
  let link = text ? text.trim() : (m.quoted && m.quoted.text ? m.quoted.text.trim() : "")

  if (!link)
    return m.reply("⟢ اكتب رابط الجروب يا زعيم أو اعمل ريبلاي على الرابط 🪄")

  let match = link.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/)

  if (!match)
    return m.reply("⟢ الرابط ده مش رابط جروب واتساب صالح ❌")

  let inviteCode = match[1]

  try {
    const res = await conn.groupAcceptInvite(inviteCode)

    if (res) {
      await conn.sendMessage(m.chat, {
        react: {
          text: "✅",
          key: m.key
        }
      })

      await m.reply(
        `╭━━━〔 𝐍𝐎𝐗 𝐁𝐎𝐓 〕━━━╮
┃
┃  ✦ تم الدخول للجروب بنجاح
┃
┃  🔗 الرابط:
┃  ${link}
┃
╰━━━━━━━━━━━━━━━━╯`
      )
    } else {
      await conn.sendMessage(m.chat, {
        react: {
          text: "🕓",
          key: m.key
        }
      })

      await m.reply(
        `╭━━━〔 𝐍𝐎𝐗 𝐁𝐎𝐓 〕━━━╮
┃
┃  ✦ تعذر الدخول المباشر
┃  ✦ تم إرسال طلب انضمام
┃
┃  🔗 الرابط:
┃  ${link}
┃
╰━━━━━━━━━━━━━━━━╯`
      )
    }

  } catch (err) {
    console.log("❌ خطأ أثناء الدخول:", err)

    await m.reply(
      `╭━━━〔 𝐍𝐎𝐗 𝐁𝐎𝐓 〕━━━╮
┃
┃  ✦ فشل الدخول للجروب
┃
┃  ❌ قد يكون الرابط منتهي
┃  ❌ أو البوت غير قادر على الانضمام
┃
╰━━━━━━━━━━━━━━━━╯`
    )
  }
}

handler.help = ["خش <لينك>"]
handler.tags = ["owner"]
handler.command = /^خش$/i
handler.owner = true

export default handler