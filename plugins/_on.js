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

import baileys from '@whiskeysockets/baileys'

const {
  generateWAMessageFromContent,
  proto,
  prepareWAMessageMedia
} = baileys

const linkRegex = /chat\.whatsapp\.com\/[0-9A-Za-z]{20,24}/i
const linkRegex1 = /whatsapp\.com\/channel\/[0-9A-Za-z]{20,24}/i

const defaultImage = 'https://files.catbox.moe/l78472.jpg'

const handler = async (m, { conn, command, args, isAdmin, isOwner }) => {

  if (!m.isGroup) {
    return m.reply(
`╭─〔 𝐍𝐎𝐗 〕─╮
│ 🔒 هذا الأمر مخصص للمجموعات فقط.
╰────────────╯`
    )
  }

  if (!global.db.data.chats[m.chat]) {
    global.db.data.chats[m.chat] = {}
  }

  const chat = global.db.data.chats[m.chat]

  const list = {
    welcome: '👋 الترحيب',
    antilink: '🚫 مضاد الروابط',
    antitoxic: '💢 مضاد الإساءة',
    antispam: '⚠️ مضاد السبام',
    antibot: '🤖 مضاد البوتات',
    antiarab: '🌍 الحماية التلقائية'
  }

  const cmd = String(command || '').toLowerCase()
  const type = String(args[0] || '').toLowerCase()

  

  if (cmd === 'on' || cmd === 'off') {

    if (!(isAdmin || isOwner)) {
      return m.reply(
`╭─〔 𝐍𝐎𝐗 𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘 〕─╮
│ ❌ هذا الأمر مخصص للمشرفين.
╰────────────────╯`
      )
    }

    if (!type || !list[type]) {
      return m.reply(
`╭─〔 𝐍𝐎𝐗 𝐒𝐘𝐒𝐓𝐄𝐌 〕─╮
│ طريقة الاستخدام:
│
│ .on antilink
│ .off antilink
│
│ الأنظمة:
│ • welcome
│ • antilink
│ • antitoxic
│ • antispam
│ • antibot
│ • antiarab
╰────────────────╯`
      )
    }

    const status = cmd === 'on'

    chat[type] = status

    return m.reply(
`╭─〔 𝐍𝐎𝐗 𝐒𝐘𝐒𝐓𝐄𝐌 〕─╮
│ النظام › ${list[type]}
│ الحالة › ${status ? '🟢 مفعّل' : '🔴 متوقف'}
╰────────────────╯`
    )
  }

  

  if (cmd === 'التفعيلات') {

    let pp

    try {
      pp = await conn.profilePictureUrl(m.chat, 'image')
    } catch {
      pp = defaultImage
    }

    const media = await prepareWAMessageMedia(
      { image: { url: pp } },
      { upload: conn.waUploadToServer }
    )

    const rows = Object.keys(list).map(v => ({
      title: list[v],
      description: `الحالة › ${chat[v] ? '🟢 مفعّل' : '🔴 متوقف'}`,
      id: `.التفعيلات ${v}`
    }))

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage:
              proto.Message.InteractiveMessage.create({

                body: {
                  text:
`╭─〔 𝐍𝐎𝐗 𝐒𝐘𝐒𝐓𝐄𝐌 〕─╮
│ إدارة أنظمة حماية المجموعة
│ اختر النظام المطلوب من القائمة.
╰────────────────╯`
                },

                footer: {
                  text: '⚡ MASTER MD ⚡'
                },

                header: {
                  hasMediaAttachment: true,
                  imageMessage: media.imageMessage
                },

                nativeFlowMessage: {
                  buttons: [
                    {
                      name: 'single_select',

                      buttonParamsJson: JSON.stringify({
                        title: '⌁ الأنظمة',

                        sections: [
                          {
                            title: '𝐍𝐎𝐗 𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘',
                            rows
                          }
                        ]
                      })
                    }
                  ]
                }

              })
          }
        }
      },
      { quoted: m }
    )

    return conn.relayMessage(
      m.chat,
      msg.message,
      {
        messageId: msg.key.id
      }
    )
  }

  return m.reply(
`╭─〔 𝐍𝐎𝐗 〕─╮
│ ❌ أمر غير معروف.
│
│ استخدم:
│ .التفعيلات
│ .on اسم_النظام
│ .off اسم_النظام
╰────────────╯`
  )
}

handler.command = [
  'on',
  'off',
  'التفعيلات'
]

handler.help = [
  'التفعيلات',
  'on',
  'off'
]

handler.group = true
handler.register = true
handler.tags = ['nable']



handler.before = async (
  m,
  {
    conn,
    isAdmin,
    isBotAdmin
  }
) => {

  if (!m.isGroup) return

  if (!global.db.data.chats[m.chat]) {
    global.db.data.chats[m.chat] = {}
  }

  const chat = global.db.data.chats[m.chat]

  

  if (
    chat.antispam &&
    m.text &&
    m.text.length > 5000
  ) {

    const participant = m.key.participant
    const messageId = m.key.id
    const userTag = `@${m.sender.split('@')[0]}`

    const fakeMessage = {
      key: {
        participant: '0@s.whatsapp.net',
        remoteJid: '0@s.whatsapp.net'
      },

      message: {
        groupInviteMessage: {
          groupJid: '51995386439-1616969743@g.us',
          inviteCode: 'm',
          groupName: '𝐍𝐎𝐗',
          caption: '⌁ 𝐍𝐎𝐗 𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘 ⌁',
          jpegThumbnail: null
        }
      }
    }

    if (!isBotAdmin) {

      await conn.sendMessage(
        m.chat,
        {
          text:
`╭─〔 𝐍𝐎𝐗 𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘 〕─╮
│ ⚠️ تم اكتشاف رسالة طويلة جدًا.
│ العضو › ${userTag}
│
│ لا أملك صلاحية حذف الرسالة.
╰────────────────╯`,
          mentions: [m.sender]
        },
        {
          quoted: fakeMessage
        }
      )

      return false
    }

    try {

      await conn.sendMessage(
        m.chat,
        {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: messageId,
            participant
          }
        }
      )

      await conn.sendMessage(
        m.chat,
        {
          text:
`╭─〔 𝐍𝐎𝐗 𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘 〕─╮
│ 🚫 تم حذف رسالة طويلة جدًا.
│ العضو › ${userTag}
╰────────────────╯`,
          mentions: [m.sender]
        },
        {
          quoted: fakeMessage
        }
      )

    } catch (error) {

      console.error('NOX AntiSpam Error:', error)

      await conn.sendMessage(
        m.chat,
        {
          text:
`╭─〔 𝐍𝐎𝐗 〕─╮
│ ⚠️ تعذر حذف الرسالة.
│ تحقق من صلاحيات البوت.
╰────────────╯`
        },
        {
          quoted: fakeMessage
        }
      )
    }

    return false
  }

  

  if (
    chat.antiarab &&
    m.messageStubType === 27
  ) {

    const newJid =
      m.messageStubParameters?.[0]

    if (!newJid) return

    const number =
      newJid
        .split('@')[0]
        .replace(/\D/g, '')

    const arabicPrefixes = [
      '20',
      '971',
      '965',
      '966',
      '974',
      '973',
      '962'
    ]

    const isArab =
      arabicPrefixes.some(
        prefix => number.startsWith(prefix)
      )

    if (isArab) {

      await conn.sendMessage(
        m.chat,
        {
          text:
`╭─〔 𝐍𝐎𝐗 𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘 〕─╮
│ 🚫 تم رفض العضو تلقائيًا.
│ السبب › ANTI-ARABE
╰────────────────╯`
        }
      )

      if (isBotAdmin) {
        try {
          await conn.groupParticipantsUpdate(
            m.chat,
            [newJid],
            'remove'
          )
        } catch (e) {
          console.log(
            'NOX AntiArabe Error:',
            e
          )
        }
      }

      return true
    }
  }

  

  if (chat.antilink) {

    const text = m?.text || ''

    if (isAdmin) return
    if (!isBotAdmin) return

    if (
      linkRegex.test(text) ||
      linkRegex1.test(text)
    ) {

      const userTag =
        `@${m.sender.split('@')[0]}`

      const participant =
        m.key.participant

      const messageId =
        m.key.id

      try {

        const ownGroupLink =
          `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`

        if (
          text.includes(ownGroupLink)
        ) {
          return
        }

      } catch {}

      try {

        await conn.sendMessage(
          m.chat,
          {
            text:
`╭─〔 𝐍𝐎𝐗 𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘 〕─╮
│ 🚫 يمنع نشر الروابط داخل المجموعة.
│ العضو › ${userTag}
│ الإجراء › حذف الرسالة + إزالة العضو
╰────────────────╯`,
            mentions: [m.sender]
          },
          {
            quoted: m
          }
        )

        await conn.sendMessage(
          m.chat,
          {
            delete: {
              remoteJid: m.chat,
              fromMe: false,
              id: messageId,
              participant
            }
          }
        )

        await conn.groupParticipantsUpdate(
          m.chat,
          [m.sender],
          'remove'
        )

      } catch (e) {

        console.log(
          'NOX AntiLink Error:',
          e
        )
      }

      return true
    }
  }

  

  if (
    chat.antitoxic &&
    m.text
  ) {

    const toxicRegex =
      /(^|\s)(كسمك|كسم|كسمين|كسمكو|كس|كسك|كسها|كسهم|كسكو|كس امك|كس اختك|كس ابوك|زبي|زبيك|زبك|زبه|زبها|زبو|زبهم|زبالة عرض|منيوك|منيوكة|منيوكين|منيوكات|متناك|متناكة|متناكين|متناكات|شرموطة|شراميط|شرمط|شرمطة|قحبة|قحبه|قحاب|قحب|ابن المتناكة|ابن القحبة|ابن الزنا|ابن الحرام|يلعن امك|يلعن اختك|يلعن ابوك|يلعن اهلك|يلعن عيلتك|يا منيوك|يا متناك|يا ابن المتناكة|يا ابن القحبة|يا ولد القحبة|يا ولد الزنا|يا ولد الحرام|ديوث|قواد|زاني|فاجر|عرص|عرصة|عرصات|لوطي|شاذ|شذوذ|نجس|قذر|وسخ قوي|وسخ نجس|ملعون|ملعون ابوكم|ملعون اهلك|نجس العرض|قذر العرض)(\s|$)/i

    const participant =
      m.key.participant

    const messageId =
      m.key.id

    const fakeMessage = {
      key: {
        participant: '0@s.whatsapp.net',
        remoteJid: '0@s.whatsapp.net'
      },

      message: {
        groupInviteMessage: {
          groupJid: '51995386439-1616969743@g.us',
          inviteCode: 'm',
          groupName: '𝐍𝐎𝐗',
          caption: '⌁ 𝐍𝐎𝐗 𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘 ⌁',
          jpegThumbnail: null
        }
      }
    }

    const textLower =
      m.text.toLowerCase()

    const isToxic =
      toxicRegex.exec(textLower)

    const owners =
      global.db.data.settings?.[
        conn.user.id
      ]?.owners || []

    const isSenderOwner =
      owners.includes(m.sender) ||
      m.sender === conn.user.id

    if (
      isToxic &&
      !isSenderOwner &&
      !isAdmin
    ) {

      if (!isBotAdmin) {

        await conn.sendMessage(
          m.chat,
          {
            text:
`╭─〔 𝐍𝐎𝐗 〕─╮
│ ⚠️ تم اكتشاف كلمة مخالفة.
│ لا أملك صلاحية حذف الرسالة.
╰────────────╯`,
            mentions: [m.sender]
          },
          {
            quoted: fakeMessage
          }
        )

        return false
      }

      try {

        await conn.sendMessage(
          m.chat,
          {
            delete: {
              remoteJid: m.chat,
              fromMe: false,
              id: messageId,
              participant
            }
          }
        )

      } catch (e) {

        console.log(
          'NOX AntiToxic Delete Error:',
          e
        )
      }

      if (!global.db.data.users) {
        global.db.data.users = {}
      }

      const user =
        global.db.data.users[m.sender] ||
        {
          warn: 0
        }

      user.warn =
        (user.warn || 0) + 1

      global.db.data.users[m.sender] =
        user

      if (user.warn < 4) {

        await conn.sendMessage(
          m.chat,
          {
            text:
`╭─〔 𝐍𝐎𝐗 𝐌𝐎𝐃𝐄𝐑𝐀𝐓𝐈𝐎𝐍 〕─╮
│ 👤 العضو › @${m.sender.split('@')[0]}
│ 🚫 تم حذف رسالة مخالفة.
│ ⚠️ التحذيرات › ${user.warn}/4
╰────────────────╯`,
            mentions: [m.sender]
          },
          {
            quoted: fakeMessage
          }
        )

      } else {

        user.warn = 0
        user.banned = true

        global.db.data.users[m.sender] =
          user

        await conn.sendMessage(
          m.chat,
          {
            text:
`╭─〔 𝐍𝐎𝐗 𝐌𝐎𝐃𝐄𝐑𝐀𝐓𝐈𝐎𝐍 〕─╮
│ 🚫 تم استنفاد عدد التحذيرات.
│ 👤 العضو › @${m.sender.split('@')[0]}
│ ⚠️ الإجراء › إزالة من المجموعة
╰────────────────╯`,
            mentions: [m.sender]
          },
          {
            quoted: fakeMessage
          }
        )

        try {

          await conn.groupParticipantsUpdate(
            m.chat,
            [m.sender],
            'remove'
          )

        } catch (e) {

          console.log(
            'NOX AntiToxic Kick Error:',
            e
          )
        }
      }

      return false
    }
  }
}

export default handler