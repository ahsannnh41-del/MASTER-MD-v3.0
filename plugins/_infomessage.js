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
import {
  rememberParticipants,
  isMentionableJid,
  normalizeJid,
  extractJidFromParam,
  asText
} from '../lib/identity.js'

const { WAMessageStubType } = baileys

const handler = m => m

const processedStubs = new Map()
const DEDUPE_WINDOW_MS = 15000

function alreadyProcessed(id) {

  if (!id) return false

  const now = Date.now()

  for (const [key, ts] of processedStubs) {
    if (now - ts > DEDUPE_WINDOW_MS) processedStubs.delete(key)
  }

  if (processedStubs.has(id)) return true

  processedStubs.set(id, now)
  return false
}

const pendingMemberStubs = new Map()
const MERGE_WINDOW_MS = 1800

function scheduleMemberStubSend(key, sender, target, finalize) {

  const existing = pendingMemberStubs.get(key)

  if (existing) {

    if (!isMentionableJid(existing.sender) && isMentionableJid(sender)) {
      existing.sender = sender
    }

    if (!isMentionableJid(existing.target) && isMentionableJid(target)) {
      existing.target = target
    }

    return
  }

  const entry = { sender, target }

  entry.timer = setTimeout(() => {
    pendingMemberStubs.delete(key)
    finalize(entry.sender, entry.target)
  }, MERGE_WINDOW_MS)

  pendingMemberStubs.set(key, entry)
}

handler.before = async function (m, { conn, participants, groupMetadata }) {

  if (!m.isGroup) return

  rememberParticipants(participants || groupMetadata?.participants)

  if (!m.messageStubType) return

  const stubId = m.key?.id || m.id

  if (alreadyProcessed(stubId)) return

  if (!global.db.data.chats[m.chat]) {
    global.db.data.chats[m.chat] = {}
  }

  const chat = global.db.data.chats[m.chat]

  if (!chat.detect) return

  if (conn.isZarfRunning) return

  const botName = global.botname || '⚡ MASTER MD ⚡'
  const dev = global.dev || 'AHSAN (03107260507)'
  const textbot = global.textbot || '𝐍𝐎𝐗 𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘'

  const rawSender = normalizeJid(m.sender)
  const sender = (rawSender && rawSender === m.chat) ? null : rawSender

  const params =
    Array.isArray(m.messageStubParametersRaw) && m.messageStubParametersRaw.length
      ? m.messageStubParametersRaw
      : (Array.isArray(m.messageStubParameters) ? m.messageStubParameters : [])

  const targetRaw = params[0]

  const target = normalizeJid(extractJidFromParam(targetRaw))

  const senderMention =
    isMentionableJid(sender)
      ? `@${sender.split('@')[0]}`
      : 'المنفذ'

  const targetMention =
    isMentionableJid(target)
      ? `@${target.split('@')[0]}`
      : 'العضو'

  const mentions = []

  if (isMentionableJid(sender)) {
    mentions.push(sender)
  }

  if (
    isMentionableJid(target) &&
    target !== sender
  ) {
    mentions.push(target)
  }

  const send = async (text, extra = {}) => {

    const msg = {
      text: [
        `╭─〔 ${botName} 〕─╮`,
        `│ ${textbot}`,
        `╰────────────────╯`,
        ``,
        text,
        ``,
        `╭─〔 𝐍𝐎𝐗 〕─╮`,
        `│ المطور › ${dev}`,
        `╰────────────────╯`
      ].join('\n'),
      mentions,
      ...extra
    }

    return conn.sendMessage(m.chat, msg, { quoted: null })
  }

  switch (m.messageStubType) {

    case 21: {
      const newName = asText(targetRaw) || asText(params[1]) || 'غير معروف'

      await send(
`✦ تم تغيير اسم المجموعة.

> الاسم الجديد:
> 『 ${newName} 』

> بواسطة:
> 『 ${senderMention} 』`
      )

      break
    }

    case 22: {

      await send(
`✦ تم تغيير صورة المجموعة.

> تم التغيير بواسطة:
> 『 ${senderMention} 』`
      )

      break
    }

    case 23: {

      let invite = null

      try {
        const code = await conn.groupInviteCode(m.chat)

        if (code) {
          invite = `https://chat.whatsapp.com/${code}`
        }
      } catch {}

      await send(
invite
? `✦ تم إعادة ضبط رابط المجموعة.

> الرابط الجديد:
> ${invite}

> بواسطة:
> 『 ${senderMention} 』`
: `✦ تم إعادة ضبط رابط المجموعة.

> تعذر الحصول على الرابط الجديد.

> بواسطة:
> 『 ${senderMention} 』`
      )

      break
    }

    case 24: {

      const description = asText(targetRaw) || asText(params[1]) || 'لا يوجد وصف'

      await send(
`✦ تم تغيير وصف المجموعة.

> الوصف الجديد:
> 『 ${description} 』

> بواسطة:
> 『 ${senderMention} 』`
      )

      break
    }

    case 25: {

      const mode =
        String(targetRaw).toLowerCase() === 'on'
          ? 'المشرفين فقط'
          : 'الجميع'

      await send(
`✦ تم تعديل صلاحيات معلومات المجموعة.

> يمكن الآن التعديل بواسطة:
> 『 ${mode} 』

> بواسطة:
> 『 ${senderMention} 』`
      )

      break
    }

    case 26: {

      const closed = String(targetRaw).toLowerCase() === 'on'

      await send(
`✦ تم ${closed ? 'إغلاق' : 'فتح'} المجموعة.

> إرسال الرسائل:
> 『 ${closed ? 'المشرفين فقط' : 'الجميع'} 』

> بواسطة:
> 『 ${senderMention} 』`
      )

      break
    }

    case 28: {

      const key = `${m.chat}:28`

      scheduleMemberStubSend(key, sender, target, (finalSender, finalTarget) => {

        const finalSenderMention =
          isMentionableJid(finalSender)
            ? `@${finalSender.split('@')[0]}`
            : 'المنفذ'

        const finalTargetMention =
          isMentionableJid(finalTarget)
            ? `@${finalTarget.split('@')[0]}`
            : 'العضو'

        const finalMentions = []

        if (isMentionableJid(finalSender)) finalMentions.push(finalSender)
        if (isMentionableJid(finalTarget) && finalTarget !== finalSender) finalMentions.push(finalTarget)

        if (!isMentionableJid(finalTarget)) {

          send(
`✦ تم رصد إزالة عضو من المجموعة.

> تعذّر تحديد هوية العضو.

> بواسطة:
> 『 ${finalSenderMention} 』`,
            { mentions: finalMentions }
          )

          return
        }

        send(
`✦ تم إزالة عضو من المجموعة.

> العضو:
> 『 ${finalTargetMention} 』

> بواسطة:
> 『 ${finalSenderMention} 』`,
          { mentions: finalMentions }
        )
      })

      break
    }

    case 29: {

      const key = `${m.chat}:29`

      scheduleMemberStubSend(key, sender, target, (finalSender, finalTarget) => {

        const finalSenderMention =
          isMentionableJid(finalSender)
            ? `@${finalSender.split('@')[0]}`
            : 'المنفذ'

        const finalTargetMention =
          isMentionableJid(finalTarget)
            ? `@${finalTarget.split('@')[0]}`
            : 'العضو'

        const finalMentions = []

        if (isMentionableJid(finalSender)) finalMentions.push(finalSender)
        if (isMentionableJid(finalTarget) && finalTarget !== finalSender) finalMentions.push(finalTarget)

        if (!isMentionableJid(finalTarget)) {

          send(
`✦ تم تنفيذ ترقية إدارية.

> تعذّر تحديد هوية العضو.

> بواسطة:
> 『 ${finalSenderMention} 』`,
            { mentions: finalMentions }
          )

          return
        }

        send(
`✦ تمت ترقية عضو إلى مشرف.

> العضو:
> 『 ${finalTargetMention} 』

> بواسطة:
> 『 ${finalSenderMention} 』`,
          { mentions: finalMentions }
        )
      })

      break
    }

    case 30: {

      const key = `${m.chat}:30`

      scheduleMemberStubSend(key, sender, target, (finalSender, finalTarget) => {

        const finalSenderMention =
          isMentionableJid(finalSender)
            ? `@${finalSender.split('@')[0]}`
            : 'المنفذ'

        const finalTargetMention =
          isMentionableJid(finalTarget)
            ? `@${finalTarget.split('@')[0]}`
            : 'العضو'

        const finalMentions = []

        if (isMentionableJid(finalSender)) finalMentions.push(finalSender)
        if (isMentionableJid(finalTarget) && finalTarget !== finalSender) finalMentions.push(finalTarget)

        if (!isMentionableJid(finalTarget)) {

          send(
`✦ تم تنفيذ سحب صلاحيات إدارية.

> تعذّر تحديد هوية العضو.

> بواسطة:
> 『 ${finalSenderMention} 』`,
            { mentions: finalMentions }
          )

          return
        }

        send(
`✦ تم سحب صلاحيات المشرف.

> العضو:
> 『 ${finalTargetMention} 』

> بواسطة:
> 『 ${finalSenderMention} 』`,
          { mentions: finalMentions }
        )
      })

      break
    }

    default: {

      if (m.messageStubType === 2) return

      console.log({
        messageStubType: m.messageStubType,
        messageStubParameters: params,
        type: WAMessageStubType?.[m.messageStubType]
      })

      break
    }
  }
}

export default handler