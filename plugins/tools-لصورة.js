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

let handler = async (m, { conn }) => {
  if (!m.quoted) {
    return conn.reply(
      m.chat,
      `> MASTER MD 〢 𝙸𝙼𝙰𝙶𝙴
>
> 🖼️ قم بالرد على ملصق
> لتحويله إلى صورة.
>
> 𝚆𝙸𝙻𝙻𝙸𝙰𝙼 × 𝚂𝙷𝙰𝙽𝙺𝚂`,
      m
    )
  }

  try {
    await m.react('🕒')

    let imgBuffer = await m.quoted.download()

    if (!imgBuffer) {
      await m.react('✖️')

      return conn.reply(
        m.chat,
        `> MASTER MD 〢 𝙴𝚁𝚁𝙾𝚁
>
> ⚠️ تعذّر قراءة الملصق.
> جرّب ملصقاً آخر.
>
> 𝚆𝙸𝙻𝙻𝙸𝙰𝙼 × 𝚂𝙷𝙰𝙽𝙺𝚂`,
        m
      )
    }

    await conn.sendMessage(
      m.chat,
      {
        image: imgBuffer,
        caption: `> MASTER MD 〢 𝙸𝙼𝙰𝙶𝙴
>
> ✦ تم تحويل الملصق
> إلى صورة بنجاح.
>
> 🖼️ 𝙵𝙾𝚁𝙼𝙰𝚃 : 𝙹𝙿𝙶
>
> 𝚆𝙸𝙻𝙻𝙸𝙰𝙼 × 𝚂𝙷𝙰𝙽𝙺𝚂`
      },
      { quoted: m }
    )

    await m.react('✔️')

  } catch (e) {
    await m.react('✖️')

    await conn.reply(
      m.chat,
      `> MASTER MD 〢 𝙴𝚁𝚁𝙾𝚁
>
> ⚠️ حدث خطأ أثناء التحويل.
> حاول مرة أخرى لاحقاً.
>
> 𝚆𝙸𝙻𝙻𝙸𝙰𝙼 × 𝚂𝙷𝙰𝙽𝙺𝚂`,
      m
    )

    console.error(e)
  }
}

handler.help = ['لصورة']
handler.tags = ['tools']
handler.command = ['لصورة', 'jpg', 'img']

export default handler