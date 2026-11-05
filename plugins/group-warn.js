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

import axios from 'axios'
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, text }) => {

  const maxWarn = 3

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
      `╭━━━〔 ⚠️ 𝙉𝙊𝙓 𝙒𝘼𝙍𝙉 〕━━━╮
┃
┃ ❌ لم يتم تحديد العضو.
┃
┃ 🎯 استخدم:
┃
┃ • .warn @العضو
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

  

  if (
    targetJid === botJid ||
    targetJid.split('@')[0] === botJid.split('@')[0]
  ) {
    return m.reply(
      `╭━━━〔 🤖 𝙉𝙊𝙓 𝙋𝙍𝙊𝙏𝙀𝘾𝙏 〕━━━╮
┃
┃ ❌ لا يمكن تحذير البوت.
┃
┃ 🌓 𝙉𝙊𝙓 𝙎𝙔𝙎𝙏𝙀𝙈
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
    )
  }

  

  if (
    targetJid === senderJid ||
    targetJid.split('@')[0] === senderJid.split('@')[0]
  ) {
    return m.reply(
      `╭━━━〔 🌓 𝙉𝙊𝙓 〕━━━╮
┃
┃ ❌ لا يمكنك تحذير نفسك.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
    )
  }

  

  const targetNumber =
    targetJid
      .split('@')[0]
      .replace(/\D/g, '')

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
┃ 🛡️ لا يمكن استخدام نظام
┃    التحذيرات عليه.
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

  user.warn += 1

  const reason =
    text?.trim() ||
    'لم يتم تحديد سبب'

  const cleanReason =
    reason
      .replace(/@\d{5,}[^\s]*/g, '')
      .trim() ||
      'لم يتم تحديد سبب'

  

  await conn.sendMessage(
    m.chat,
    {
      react: {
        text: '🌑',
        key: m.key
      }
    }
  )

  

  const img =
    'https://files.catbox.moe/gq9zc6.jpg'

  try {

    const res =
      await axios.get(img, {
        responseType: 'arraybuffer'
      })

    const imgBuffer =
      Buffer.from(res.data)

    const orderMessage = {

      orderId:
        'NOX-WARN-' +
        Date.now(),

      thumbnail:
        imgBuffer,

      itemCount: 1,

      status: 1,

      surface: 1,

      message:
        `╭━━━〔 ⚠️ 𝙉𝙊𝙓 𝙒𝘼𝙍𝙉 〕━━━╮\n\n` +
        `┃ 👤 العضو:\n` +
        `┃ @${targetNumber}\n\n` +
        `┃ 📝 السبب:\n` +
        `┃ ${cleanReason}\n\n` +
        `┃ ⚠️ التحذيرات:\n` +
        `┃ ${user.warn} / ${maxWarn}\n\n` +
        `┃ 🌓 النظام: 𝙉𝙊𝙓\n` +
        `┃ 🔱 الحالة: 𝘼𝘾𝙏𝙄𝙑𝙀\n\n` +
        `╰━━━━━━━━━━━━━━━━━━━━╯`,

      orderTitle:
        '⚠️ NOX Warning System',

      token: null,

      sellerJid: null,

      totalAmount1000:
        '0',

      totalCurrencyCode:
        'USD',

      contextInfo: {

        mentionedJid:
          [targetJid],

        externalAdReply: {

          title:
            '🌓 NOX BOT',

          body:
            `⚠️ WARNING ${user.warn}/${maxWarn}`,

          thumbnailUrl:
            img,

          mediaType: 1,

          renderLargerThumbnail:
            true
        }
      }
    }

    const msg =
      generateWAMessageFromContent(
        m.chat,
        { orderMessage },
        { quoted: m }
      )

    await conn.relayMessage(
      m.chat,
      msg.message,
      {
        messageId:
          msg.key.id
      }
    )

  } catch (e) {

    await conn.sendMessage(
      m.chat,
      {
        text:
          `╭━━━〔 ⚠️ 𝙉𝙊𝙓 𝙒𝘼𝙍𝙉 〕━━━╮\n\n` +
          `┃ 👤 العضو:\n` +
          `┃ @${targetNumber}\n\n` +
          `┃ 📝 السبب:\n` +
          `┃ ${cleanReason}\n\n` +
          `┃ ⚠️ التحذيرات:\n` +
          `┃ ${user.warn}/${maxWarn}\n\n` +
          `╰━━━━━━━━━━━━━━━━━━━━╯`,

        mentions:
          [targetJid]

      },
      {
        quoted: m
      }
    )
  }

  

  if (user.warn >= maxWarn) {

    user.warn = 0

    await conn.sendMessage(
      m.chat,
      {
        text:
          `╭━━━〔 🚫 𝙉𝙊𝙓 𝙎𝙔𝙎𝙏𝙀𝙈 〕━━━╮\n\n` +
          `┃ ⚠️ تم استنفاد جميع التحذيرات.\n\n` +
          `┃ 👤 العضو:\n` +
          `┃ @${targetNumber}\n\n` +
          `┃ 🔥 الحد الأقصى:\n` +
          `┃ ${maxWarn} تحذيرات\n\n` +
          `┃ 🚪 الإجراء:\n` +
          `┃ تم إخراج العضو من المجموعة.\n\n` +
          `╰━━━━━━━━━━━━━━━━━━━━╯`,

        mentions:
          [targetJid]

      },
      {
        quoted: m
      }
    )

    await conn.groupParticipantsUpdate(
      m.chat,
      [targetJid],
      'remove'
    )
  }

  return true
}

handler.help = [
  'warn',
  'warning',
  'تحذير',
  'انذار'
]

handler.tags = [
  'group'
]

handler.command =
  /^(warn|warning|تحذير|انذار|إنذار)$/i

handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler