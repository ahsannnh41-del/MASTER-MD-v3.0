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

import { areJidsSameUser } from '@whiskeysockets/baileys'

export async function before(m, { participants, conn }) {
    if (!m.isGroup) return

    const chat = global?.db?.data?.chats?.[m.chat]
    if (!chat || !chat.antiBot2) return
    if (chat.__antiBot2Leaving) return

    const mainConn = (global.mainBot && global.mainBot.user?.jid) ? global.mainBot : global.conn
    if (!mainConn?.user?.jid) return

    const mainJid = mainConn.user.jid
    const thisJid = conn.user.jid

    if (areJidsSameUser(mainJid, thisJid)) return

    async function getLidFromJid(id) {
        if (!id) return id
        if (id.endsWith('@lid')) return id

        const res = await conn.onWhatsApp(id).catch(() => [])
        return res?.[0]?.lid || id
    }

    const [mainLid, thisLid] = await Promise.all([
        getLidFromJid(mainJid),
        getLidFromJid(thisJid)
    ])

    const groupMetadata = m.isGroup
        ? ((conn.chats[m.chat] || {}).metadata || await conn.groupMetadata?.(m.chat).catch(() => null))
        : null

    const list = (Array.isArray(participants) && participants.length)
        ? participants
        : (groupMetadata?.participants || [])

    const isBotPresent = list.some(p => {
        const pid = p?.id || p?.jid

        if (!pid) return false

        return areJidsSameUser(pid, mainJid) || areJidsSameUser(pid, mainLid)
    })

    if (!isBotPresent) return

    chat.__antiBot2Leaving = true

    setTimeout(async () => {
        try {
            await conn.reply(
                m.chat,
                '✦ البوت الرئيسي موجود بالفعل في هذه المجموعة، لذلك سأغادر تلقائياً لتجنب تكرار البوتات والرسائل المزعجة.\n\n⌁ إلى اللقاء 🖤',
                m
            )

            await conn.groupLeave(m.chat)

        } catch (err) {
            console.error('حدث خطأ أثناء مغادرة المجموعة:', err)

            setTimeout(() => {
                chat.__antiBot2Leaving = false
            }, 5000)
        }
    }, 5000)
}