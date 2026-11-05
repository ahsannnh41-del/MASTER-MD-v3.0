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

import fetch from 'node-fetch'

const handler = async (
  m,
  { conn, command, isAdmin }
) => {

  if (!m.isGroup) {
    return m.reply(
      `╭━━━〔 🌓 𝙉𝙊𝙓 〕━━━╮
┃
┃ ❌ هذا الأمر يعمل داخل
┃    المجموعات فقط.
┃
╰━━━━━━━━━━━━━━━━╯`
    )
  }

  if (!isAdmin) {
    return m.reply(
      `╭━━━〔 🚫 𝙉𝙊𝙓 𝘼𝘾𝘾𝙀𝙎𝙎 〕━━━╮
┃
┃ ❌ هذا الأمر مخصص
┃    لمشرفي المجموعة فقط.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
    )
  }

  const chatId = m.chat
  const action = String(command).toLowerCase()

  const isClose = [
    'قفل-شات',
    'قفل_شات'
  ].includes(action)

  const isOpen = [
    'فتح-شات',
    'فتح_شات'
  ].includes(action)

  if (!isClose && !isOpen) {
    return m.reply(
      `╭━━━〔 ⚠️ 𝙉𝙊𝙓 〕━━━╮
┃
┃ ❌ أمر غير معروف.
┃
╰━━━━━━━━━━━━━━━━╯`
    )
  }

  const imgClose =
    'https://files.catbox.moe/nnnyne.jpg'

  const imgOpen =
    'https://files.catbox.moe/guofgb.jpg'

  const selectedImage =
    isClose
      ? imgClose
      : imgOpen

  let thumb = null

  try {
    thumb =
      await (
        await fetch(selectedImage)
      ).buffer()
  } catch {}

  const businessHeader = {
    key: {
      participants:
        '0@s.whatsapp.net',
      fromMe: false,
      id: 'NOX-GROUP-CONTROL'
    },

    message: {
      locationMessage: {
        name:
          isClose
            ? '🔐 𝙉𝙊𝙓 — 𝙂𝙍𝙊𝙐𝙋 𝙇𝙊𝘾𝙆'
            : '🔓 𝙉𝙊𝙓 — 𝙂𝙍𝙊𝙐𝙋 𝙐𝙉𝙇𝙊𝘾𝙆',

        ...(thumb
          ? { jpegThumbnail: thumb }
          : {}),

        vcard:
          'BEGIN:VCARD\n' +
          'VERSION:3.0\n' +
          'N:;NOX BOT;;;\n' +
          'FN:NOX BOT\n' +
          'ORG:NOX GROUP SYSTEM\n' +
          'TITLE:Group Control\n' +
          'item1.TEL;waid=000000000000:+00 0000 000000\n' +
          'item1.X-ABLabel:NOX\n' +
          'X-WA-BIZ-DESCRIPTION:NOX Group Management System\n' +
          'X-WA-BIZ-NAME:NOX BOT\n' +
          'END:VCARD'
      }
    },

    participant:
      '0@s.whatsapp.net'
  }

  if (isClose) {

    try {
      await conn.groupSettingUpdate(
        chatId,
        'announcement'
      )
    } catch {
      return m.reply(
        `╭━━━〔 ❌ 𝙉𝙊𝙓 𝙀𝙍𝙍𝙊𝙍 〕━━━╮
┃
┃ ⚠️ تعذر قفل المجموعة.
┃
┃ تأكد أن البوت مشرف.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
      )
    }

    await conn.sendMessage(
      chatId,
      {
        text:
          `╭━━━〔 🔐 𝙉𝙊𝙓 𝙂𝙍𝙊𝙐𝙋 〕━━━╮\n\n` +
          `┃ 🔒 تم قفل الشات بنجاح.\n\n` +
          `┃ 🛡️ الآن يمكن للمشرفين\n` +
          `┃    فقط إرسال الرسائل.\n\n` +
          `┃ ⚡ النظام: 𝙉𝙊𝙓\n` +
          `┃ 🔐 الحالة: 𝙇𝙊𝘾𝙆𝙀𝘿\n\n` +
          `╰━━━━━━━━━━━━━━━━━━━━╯`
      },
      {
        quoted: businessHeader
      }
    )

    return true
  }

  if (isOpen) {

    try {
      await conn.groupSettingUpdate(
        chatId,
        'not_announcement'
      )
    } catch {
      return m.reply(
        `╭━━━〔 ❌ 𝙉𝙊𝙓 𝙀𝙍𝙍𝙊𝙍 〕━━━╮
┃
┃ ⚠️ تعذر فتح المجموعة.
┃
┃ تأكد أن البوت مشرف.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
      )
    }

    await conn.sendMessage(
      chatId,
      {
        text:
          `╭━━━〔 🔓 𝙉𝙊𝙓 𝙂𝙍𝙊𝙐𝙋 〕━━━╮\n\n` +
          `┃ 🔓 تم فتح الشات بنجاح.\n\n` +
          `┃ 👥 أصبح بإمكان جميع\n` +
          `┃    الأعضاء إرسال الرسائل.\n\n` +
          `┃ ⚡ النظام: 𝙉𝙊𝙓\n` +
          `┃ 🔓 الحالة: 𝙐𝙉𝙇𝙊𝘾𝙆𝙀𝘿\n\n` +
          `╰━━━━━━━━━━━━━━━━━━━━╯`
      },
      {
        quoted: businessHeader
      }
    )

    return true
  }
}

handler.help = [
  'قفل-شات',
  'فتح-شات'
]

handler.tags = [
  'group'
]

handler.command = [
  'قفل-شات',
  'فتح-شات',
  'قفل_شات',
  'فتح_شات'
]

handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler