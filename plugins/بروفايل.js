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

let handler = async (m, { conn, text }) => {
    try {
        let target = m.sender
        let dbKey = m.sender

        let rawDigits = null

        if (m.mentionedJid && Array.isArray(m.mentionedJid) && m.mentionedJid.length > 0) {
            rawDigits = m.mentionedJid[0].split('@')[0]
        } else if (m.quoted) {
            target = m.quoted.sender
            dbKey = m.quoted.sender
        } else if (text) {
            const match = text.replace(/[^0-9]/g, '').match(/(\d{7,15})/)
            if (match) rawDigits = match[1]
        }

        if (rawDigits) {
            target = `${rawDigits}@s.whatsapp.net`
            dbKey = target

            if (m.isGroup) {
                try {
                    const freshMeta = await conn.groupMetadata(m.chat, false)
                    const matched = freshMeta.participants.find(p =>
                        p.id.split('@')[0] === rawDigits ||
                        p.phoneNumber?.split('@')[0] === rawDigits
                    )
                    if (matched) {
                        target = matched.id
                        dbKey = matched.phoneNumber || matched.id
                    }
                } catch {}
            }
        }

        const user = global.db.data.users[dbKey] || global.db.data.users[target] || {}

        const number = dbKey.split('@')[0]

        let name =
            user.name ||
            (target === m.sender ? m.pushName : null) ||
            'غير معروف'

        if (target !== m.sender) {
            try {
                const contact = await conn.onWhatsApp(dbKey)
                if (contact?.[0]?.name) {
                    name = contact[0].name
                }
            } catch {}
        }

        let role = 'عضو'

        const owners = global.owner || []

        if (
            owners.some(owner => {
                const ownerId =
                    typeof owner === 'string'
                        ? owner
                        : String(owner)

                return ownerId === dbKey || ownerId === target
            })
        ) {
            role = 'مطور NOX'
        } else if (user.admin) {
            role = 'مشرف'
        }

        const level = user.level || 0
        const exp = user.exp || 0
        const money = user.money || user.coin || 0
        const limit = user.limit || 0

        const registered = user.registered
            ? 'مسجل'
            : 'غير مسجل'

        let pp = null

        try {
            pp = await conn.profilePictureUrl(target, 'image')
        } catch {}

        const text2 = `
╭━━━〔 𝐍𝐎𝐗 〕━━━╮
┃
┃ 👤 الاسم
┃ ${name}
┃
┃ 🪪 الرقم
┃ +${number}
┃
┃ 🎖️ الرتبة
┃ ${role}
┃
┃ 🆙 المستوى
┃ ${level}
┃
┃ ⭐ الخبرة
┃ ${exp}
┃
┃ 💰 الرصيد
┃ ${money}
┃
┃ 🎟️ المحاولات
┃ ${limit}
┃
┃ 📋 التسجيل
┃ ${registered}
┃
╰━━〔 𝐍𝐎𝐗 × 𝚆𝙸𝙻𝙻𝙸𝙰𝙼 × 𝚂𝙷𝙰𝙽𝙺𝚂 〕━━╯
`.trim()

        if (pp) {
            await conn.sendMessage(
                m.chat,
                {
                    image: { url: pp },
                    caption: text2,
                    mentions: [target]
                },
                { quoted: m }
            )
        } else {
            await conn.sendMessage(
                m.chat,
                {
                    text: text2,
                    mentions: [target]
                },
                { quoted: m }
            )
        }

    } catch (e) {
        console.error(e)
        await m.reply('❌ حدث خطأ أثناء جلب بيانات البروفايل.')
    }
}

handler.help = ['بروفايل', 'profile']
handler.tags = ['main']
handler.command = ['بروفايل', 'profile', 'me']

export default handler