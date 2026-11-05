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

let { downloadContentFromMessage } = await import('@whiskeysockets/baileys')

let handler = async (m, { conn, usedPrefix }) => {
  let quoted = m.quoted

  if (!quoted) {
    return conn.reply(
      m.chat,
      `> MASTER MD 〢 𝚅𝙸𝙴𝚆 𝙾𝙽𝙲𝙴
>
> ❐ قم بالرد على رسالة
> من نوع "عرض لمرة واحدة"
> لعرض محتواها.
>
> 𝚆𝙸𝙻𝙻𝙸𝙰𝙼 × 𝚂𝙷𝙰𝙽𝙺𝚂`,
      m
    )
  }

  try {
    await m.react('🕒')

    let viewOnceMessage =
      quoted.viewOnce
        ? quoted
        : quoted.mediaMessage?.imageMessage ||
          quoted.mediaMessage?.videoMessage ||
          quoted.mediaMessage?.audioMessage

    if (!viewOnceMessage) {
      await m.react('✖️')

      return conn.reply(
        m.chat,
        `> MASTER MD 〢 𝙴𝚁𝚁𝙾𝚁
>
> ⚠️ لم يتم العثور على محتوى
> من نوع ViewOnce.
>
> ✦ تأكد من الرد على الرسالة الصحيحة.`,
        m
      )
    }

    let messageType = viewOnceMessage.mimetype || quoted.mtype

    let stream = await downloadContentFromMessage(
      viewOnceMessage,
      messageType.split('/')[0]
    )

    if (!stream) {
      await m.react('✖️')

      return conn.reply(
        m.chat,
        `> MASTER MD 〢 𝙴𝚁𝚁𝙾𝚁
>
> ⚠️ تعذر تحميل المحتوى.
> حاول مرة أخرى.`,
        m
      )
    }

    let buffer = Buffer.alloc(0)

    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }

    if (messageType.includes('video')) {
      await conn.sendMessage(
        m.chat,
        {
          video: buffer,
          caption: viewOnceMessage.caption || '',
          mimetype: 'video/mp4'
        },
        { quoted: m }
      )

    } else if (messageType.includes('image')) {
      await conn.sendMessage(
        m.chat,
        {
          image: buffer,
          caption: viewOnceMessage.caption || ''
        },
        { quoted: m }
      )

    } else if (messageType.includes('audio')) {
      await conn.sendMessage(
        m.chat,
        {
          audio: buffer,
          mimetype: 'audio/ogg; codecs=opus',
          ptt: viewOnceMessage.ptt || false
        },
        { quoted: m }
      )

    } else {
      await m.react('✖️')

      return conn.reply(
        m.chat,
        `> MASTER MD 〢 𝚄𝙽𝙺𝙽𝙾𝚆𝙽
>
> ⚠️ نوع المحتوى غير مدعوم.
>
> ✦ جرّب صورة أو فيديو أو تسجيل صوتي.`,
        m
      )
    }

    await m.react('✔️')

  } catch (e) {
    await m.react('✖️')

    return conn.reply(
      m.chat,
      `> MASTER MD 〢 𝙴𝚁𝚁𝙾𝚁
>
> ⚠️ حدث خطأ أثناء معالجة المحتوى.
>
> ✦ يمكنك استخدام:
> ${usedPrefix}report
> للإبلاغ عن المشكلة.
>
> 𝚆𝙸𝙻𝙻𝙸𝙰𝙼 × 𝚂𝙷𝙰𝙽𝙺𝚂`,
      m
    )
  }
}

handler.help = ['فضح']
handler.tags = ['tools']
handler.command = ['افضحو', 'افضحوهم', 'افضحهم', 'فضح']

export default handler