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

const handler = async (m, { conn, usedPrefix, command }) => {

    
    if (m.isGroup && !global.db.data.chats[m.chat]?.economy) {
        return m.reply(
`《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة ❌

يمكن لأحد المشرفين تفعيلها باستخدام الأمر:
» *${usedPrefix}economy on* ✅`
        )
    }

    
    const user = global.db.data.users[m.sender]

    if (!user) {
        return m.reply('❌ لم يتم العثور على بيانات حسابك في الاقتصاد.')
    }

    
    user.coin = Number(user.coin) || 0
    user.lastrob = Number(user.lastrob) || 0

    
    const now = Date.now()

    if (now < user.lastrob) {

        const remaining = user.lastrob - now

        return conn.reply(
            m.chat,
`⏳ ꕥ لازم تنتظر *${formatTime(remaining)}* قبل ما تستخدم الأمر *${usedPrefix + command}* مرة ثانية 🔁`,
            m
        )
    }

    
    const who =
        m.mentionedJid?.[0] ||
        m.quoted?.sender ||
        null

    if (!who) {
        return conn.reply(
            m.chat,
`❗ ꕥ لازم تعمل منشن لشخص عشان تحاول تسرق منه 🕵️‍♂️💰

مثال:
*${usedPrefix + command} @الشخص*`,
            m
        )
    }

    
    if (who === m.sender) {
        return conn.reply(
            m.chat,
            '😂 ꕥ ما ينفعش تسرق نفسك يا حرامي!',
            m
        )
    }

    
    if (!(who in global.db.data.users)) {
        return conn.reply(
            m.chat,
            '❌ ꕥ المستخدم مش موجود في قاعدة بياناتي 📂',
            m
        )
    }

    
    const target = global.db.data.users[who]

    target.coin = Number(target.coin) || 0
    target.lastwork = Number(target.lastwork) || 0

    
    let name = target.name

    if (!name) {
        try {
            name = await conn.getName(who)
        } catch {
            name = who.split('@')[0]
        }
    }

    if (!name || typeof name !== 'string') {
        name = who.split('@')[0]
    }

    
    const inactiveTime = now - target.lastwork

    if (inactiveTime < 60 * 60 * 1000) {
        return conn.reply(
            m.chat,
`⏳ ꕥ ما تقدرش تسرق *${name}* دلوقتي.

لازم يكون غير نشط لأكثر من *ساعة* 🕒`,
            m,
            { mentions: [who] }
        )
    }

    
    const rob = Math.floor(Math.random() * 1001) + 2000

    
    if (target.coin < rob) {
        return conn.reply(
            m.chat,
`💸 ꕥ *${name}* معندوش عملات كفاية خارج البنك عشان تسرقه 😅`,
            m,
            { mentions: [who] }
        )
    }

    
    user.coin += rob
    target.coin -= rob

    
    user.lastrob = now + (2 * 60 * 60 * 1000)

    return conn.reply(
        m.chat,
`💰 ❀ تمت السرقة بنجاح!

👤 الضحية: *${name}*
💵 المبلغ المسروق:
*¥${rob.toLocaleString()} ${currency}*

💳 رصيدك الآن:
*¥${user.coin.toLocaleString()} ${currency}* 😎`,
        m,
        { mentions: [who] }
    )
}

handler.help = ['اسرق @tag']
handler.tags = ['economy']
handler.command = ['اسرق', 'steal', 'rob', 'سرقه']
handler.group = true

export default handler

function formatTime(ms) {

    const totalSec = Math.ceil(ms / 1000)

    const hours = Math.floor(totalSec / 3600)

    const minutes = Math.floor(
        (totalSec % 3600) / 60
    )

    const seconds = totalSec % 60

    const parts = []

    if (hours > 0)
        parts.push(`${hours} ساعة`)

    if (minutes > 0)
        parts.push(`${minutes} دقيقة`)

    if (seconds > 0 || parts.length === 0)
        parts.push(`${seconds} ثانية`)

    return parts.join(' ')
}