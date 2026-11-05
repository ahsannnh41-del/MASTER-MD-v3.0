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

const handler = async (m, { conn }) => {

  if (!m.isGroup) {
    return m.reply(
      `╭━━━〔 🌓 𝙉𝙊𝙓 〕━━━╮
┃
┃ ❌ هذا الأمر للمجموعات فقط.
┃
╰━━━━━━━━━━━━━━━━╯`
    )
  }

  

  let who = null

  if (
    Array.isArray(m.mentionedJid) &&
    m.mentionedJid.length
  ) {
    who = m.mentionedJid[0]
  }

  if (!who && m.quoted?.sender) {
    who = m.quoted.sender
  }

  if (
    !who &&
    m.message?.extendedTextMessage?.contextInfo
  ) {
    const ctx =
      m.message.extendedTextMessage.contextInfo

    if (
      Array.isArray(ctx.mentionedJid) &&
      ctx.mentionedJid.length
    ) {
      who = ctx.mentionedJid[0]
    }

    if (!who && ctx.participant) {
      who = ctx.participant
    }
  }

  if (!who) {
    return m.reply(
      `╭━━━〔 ⚠️ 𝙉𝙊𝙓 𝙐𝙉𝙒𝘼𝙍𝙉 〕━━━╮
┃
┃ ❌ لم يتم تحديد العضو.
┃
┃ 🎯 استخدم:
┃
┃ • .unwarn @العضو
┃ • أو قم بالرد على رسالته
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
    )
  }

  

  const normalizeJid = jid => {
    if (!jid) return ''

    return String(jid)
      .replace(/:\d+(?=@)/, '')
      .trim()
  }

  const targetJid = normalizeJid(who)

  const botJid = normalizeJid(
    conn.user?.id ||
    conn.user?.jid
  )

  const senderJid = normalizeJid(m.sender)

  const targetNumber =
    targetJid
      .split('@')[0]
      .replace(/\D/g, '')

  

  if (
    targetJid === botJid ||
    targetNumber ===
      botJid.split('@')[0].replace(/\D/g, '')
  ) {
    return m.reply(
      `╭━━━〔 🤖 𝙉𝙊𝙓 𝙋𝙍𝙊𝙏𝙀𝘾𝙏 〕━━━╮
┃
┃ ❌ لا يمكن إلغاء تحذيرات البوت.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
    )
  }

  

  const owners = []

  for (const owner of global.owner || []) {

    const value =
      Array.isArray(owner)
        ? owner[0]
        : owner

    if (!value) continue

    const number =
      String(value)
        .split('@')[0]
        .replace(/\D/g, '')

    if (number) {
      owners.push(number)
    }
  }

  if (owners.includes(targetNumber)) {
    return m.reply(
      `╭━━━〔 👑 𝙉𝙊𝙓 𝙋𝙍𝙊𝙏𝙀𝘾𝙏 〕━━━╮
┃
┃ 🔒 هذا العضو محمي.
┃
┃ 👑 الصلاحية: 𝙊𝙒𝙉𝙀𝙍
┃
┃ لا يمكن تعديل تحذيراته.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
    )
  }

  

  if (
    targetJid === senderJid ||
    targetNumber ===
      senderJid.split('@')[0].replace(/\D/g, '')
  ) {
    return m.reply(
      `╭━━━〔 🌓 𝙉𝙊𝙓 〕━━━╮
┃
┃ ❌ لا يمكنك إلغاء تحذير
┃    نفسك.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
    )
  }

  

  global.db.data.users[targetJid] =
    global.db.data.users[targetJid] || {}

  const user =
    global.db.data.users[targetJid]

  user.warn =
    Number(user.warn || 0)

  if (user.warn <= 0) {
    return m.reply(
      `╭━━━〔 🔰 𝙉𝙊𝙓 𝙐𝙉𝙒𝘼𝙍𝙉 〕━━━╮
┃
┃ ⚠️ لا يوجد على العضو
┃    أي تحذير حاليًا.
┃
┃ 👤 العضو:
┃ @${targetNumber}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`,
      null,
      { mentions: [targetJid] }
    )
  }

  user.warn -= 1

  await conn.sendMessage(m.chat, {
    react: {
      text: '🔰',
      key: m.key
    }
  })

  

  await conn.sendMessage(
    m.chat,
    {
      text:
        `╭━━━〔 🔰 𝙉𝙊𝙓 𝙐𝙉𝙒𝘼𝙍𝙉 〕━━━╮\n\n` +
        `┃ 👤 العضو:\n` +
        `┃ @${targetNumber}\n\n` +
        `┃ ✅ تم إلغاء تحذير واحد.\n\n` +
        `┃ ⚠️ التحذيرات المتبقية:\n` +
        `┃ ${user.warn} / 3\n\n` +
        `┃ 🌓 النظام: 𝙉𝙊𝙓\n` +
        `┃ 🔱 الحالة: 𝙐𝙉𝙒𝘼𝙍𝙉 𝘼𝘾𝙏𝙄𝙑𝙀\n\n` +
        `╰━━━━━━━━━━━━━━━━━━━━╯`,
      mentions: [targetJid]
    },
    {
      quoted: m
    }
  )

  return true
}

handler.help = [
  'unwarn',
  'delwarn',
  'الغاء_انذار',
  'إلغاء_إنذار'
]

handler.tags = [
  'group'
]

handler.command =
  /^(unwarn|delwarn|الغاء_انذار|إلغاء_إنذار|الغاء-انذار|إلغاء-إنذار)$/i

handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler