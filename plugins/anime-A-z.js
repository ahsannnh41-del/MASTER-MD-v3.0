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

import axios from "axios"

let handler = async (m, { command, conn }) => {
  try {
    let { data } = await axios.get(
      `https://raw.githubusercontent.com/davidprospero123/api-anime/main/BOT-JSON/anime-${command}.json`
    )

    if (!Array.isArray(data) || !data.length) {
      throw new Error("No images found")
    }

    let image = data[Math.floor(Math.random() * data.length)]

    let captions = [
      `╭━━━〔 MASTER MD 〕━━━╮
┃ 🎴 𝙰𝙽𝙸𝙼𝙴
┃ ✦ ${command}
╰━━━━━━━━━━━━━━━━╯

┏━━〔 𝙽𝙾𝚇 𝙶𝙰𝙻𝙻𝙴𝚁𝚈 〕━━┓
┃ ✧ صورة أنمي عشوائية
┃ ✧ تم اختيارها لك بعناية
┗━━━━━━━━━━━━━━━━━━┛

⌁ AHSAN (03107260507) ⌁`,

      `╭─〔 MASTER MD 〢 𝙰𝙽𝙸𝙼𝙴 〕─╮
│
│ 🎌 𝙲𝙷𝙰𝚁𝙰𝙲𝚃𝙴𝚁
│ ${command}
│
│ ✦ لقطة من عالم الأنمي
│ ✦ استمتع بالصورة 🤍
│
╰────────────────╯
      AHSAN (03107260507)`,

      `╭━━〔 🎴 ${command} 〕━━╮
┃
┃ MASTER MD 〢 𝙰𝙽𝙸𝙼𝙴
┃
┃ ✦ صورة جديدة وصلت إليك
┃ ✦ من عالم الأنمي
┃ ✦ استمتع بالمشهد ✨
┃
╰━━━━━━━━━━━━━━━━╯

『 AHSAN (03107260507) 』`,

      `╭━━━━━━━━━━━━━━━━╮
┃ MASTER MD 〢 𝙰𝙽𝙸𝙼𝙴
╰━━━━━━━━━━━━━━━━╯

🎴 𝙽𝙰𝙼𝙴 : ${command}

✧ مشهد عشوائي
✧ اختيار مميز
✧ من عالم الأنمي 🤍

╭────────────────╮
│ AHSAN (03107260507)
╰────────────────╯`,

      `『 MASTER MD 』

╭─〔 𝙰𝙽𝙸𝙼𝙴 〕─╮
│ 🎴 ${command}
│
│ ✦ لقطة عشوائية
│ ✦ عالم من الخيال
│ ✦ صورة مختارة لك
╰──────────────╯

╰─『 AHSAN (03107260507) 』─╯`
    ]

    let caption = captions[Math.floor(Math.random() * captions.length)]

    await conn.sendMessage(
      m.chat,
      {
        image: { url: image },
        caption
      },
      { quoted: m }
    )

  } catch (e) {
    await conn.sendMessage(
      m.chat,
      {
        text: `╭━━━〔 MASTER MD 〕━━━╮
┃ ⚠️ 𝙴𝚁𝚁𝙾𝚁
╰━━━━━━━━━━━━━━━━╯

✦ تعذّر جلب صور *${command}*
✦ حاول مرة أخرى بعد قليل.

『 AHSAN (03107260507) 』`
      },
      { quoted: m }
    )

    console.error(e)
  }
}

handler.command = handler.help = [
  "alisa",
  "aihoshino",
  "remcham",
  "akira",
  "akiyama",
  "anna",
  "asuna",
  "ayuzawa",
  "boruto",
  "chiho",
  "chitoge",
  "deidara",
  "erza",
  "elaina",
  "eba",
  "emilia",
  "hestia",
  "hinata",
  "inori",
  "isuzu",
  "itachi",
  "itori",
  "kaga",
  "kagura",
  "kaori",
  "keneki",
  "kotori",
  "kurumitokisaki",
  "madara",
  "mikasa",
  "miku",
  "minato",
  "naruto",
  "nezuko",
  "sagiri",
  "sasuke",
  "sakura"
]

handler.tags = ["anime"]

handler.register = true

export default handler