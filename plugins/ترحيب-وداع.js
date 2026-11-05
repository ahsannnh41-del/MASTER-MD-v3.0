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

import {
    rememberParticipants,
    isMentionableJid,
    normalizeJid,
    extractJidFromParam
} from '../lib/identity.js'

const WELCOME_IMAGE = 'https://i.ibb.co/v6y6PNc3/nox-image.jpg'
const GOODBYE_IMAGE = 'https://i.ibb.co/zTGHzvCd/nox-image.jpg'

const handler = m => m

const processedWelcome = new Map()

function wasProcessed(key) {
    const now = Date.now()

    for (const [id, time] of processedWelcome) {
        if (now - time > 10000) {
            processedWelcome.delete(id)
        }
    }

    if (processedWelcome.has(key)) return true

    processedWelcome.set(key, now)
    return false
}

handler.before = async function (m, { conn, participants, groupMetadata }) {
    try {
        if (!m?.isGroup) return true

        if (m.messageStubType !== 27 && m.messageStubType !== 28) {
            return true
        }

        const params =
            Array.isArray(m.messageStubParametersRaw) &&
            m.messageStubParametersRaw.length
                ? m.messageStubParametersRaw
                : Array.isArray(m.messageStubParameters)
                    ? m.messageStubParameters
                    : []

        if (!params.length) return true

        rememberParticipants(
            participants || groupMetadata?.participants || []
        )

        const rawTarget = params[0]

        const extracted = extractJidFromParam(rawTarget)

        if (!extracted) return true

        const target = normalizeJid(extracted)

        if (!target || !isMentionableJid(target)) {
            return true
        }

        const eventId =
            m.key?.id ||
            `${m.chat}:${m.messageStubType}:${target}`

        if (wasProcessed(eventId)) return true

        let metadata = groupMetadata

        if (!metadata) {
            try {
                metadata = await conn.groupMetadata(m.chat)
            } catch {
                metadata = null
            }
        }

        const groupName =
            metadata?.subject ||
            'المجموعة'

        const memberCount =
            metadata?.participants?.length ||
            0

        const mention =
            target.endsWith('@lid')
                ? `@${target.split('@')[0]}`
                : `@${target.split('@')[0]}`

        if (m.messageStubType === 27) {

            const text = `╭━━━━━━〔 ⭐ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 〕━━━━━━╮
┃
┃ 👋 أهلاً وسهلاً بـ ${mention}
┃
┃ 🎉 نورت مجموعتنا وأصبحت واحدًا منا!
┃
┃ 🏠 المجموعة:
┃ 『 ${groupName} 』
┃
┃ 👥 عدد الأعضاء:
┃ 『 ${memberCount} 』
┃
┃ 🏛️ نتمنى لك وقتًا ممتعًا معنا.
┃
┃ ⚠️ يرجى الالتزام بقوانين المجموعة
┃ واحترام جميع الأعضاء.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
⚡ MASTER MD ⚡`

            try {
                await conn.sendMessage(
                    m.chat,
                    {
                        image: { url: WELCOME_IMAGE },
                        caption: text,
                        mentions: [target]
                    }
                )
            } catch {
                await conn.sendMessage(
                    m.chat,
                    {
                        text,
                        mentions: [target]
                    }
                )
            }
        }

        if (m.messageStubType === 28) {

            const text = `╭━━━━━━〔 👋 𝐆𝐎𝐎𝐃𝐁𝐘𝐄 〕━━━━━━╮
┃
┃ 🚪 غادر ${mention} المجموعة.
┃
┃ 🏠 المجموعة:
┃ 『 ${groupName} 』
┃
┃ 👥 عدد الأعضاء:
┃ 『 ${Math.max(memberCount - 1, 0)} 』
┃
┃ 🏛️ نتمنى لك التوفيق أينما كنت.
┃
┃ 👋 إلى اللقاء!
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
⚡ MASTER MD ⚡`

            try {
                await conn.sendMessage(
                    m.chat,
                    {
                        image: { url: GOODBYE_IMAGE },
                        caption: text,
                        mentions: [target]
                    }
                )
            } catch {
                await conn.sendMessage(
                    m.chat,
                    {
                        text,
                        mentions: [target]
                    }
                )
            }
        }

    } catch (error) {
        console.error('NOX Welcome/Goodbye Error:', error)
    }

    return true
}

export default handler