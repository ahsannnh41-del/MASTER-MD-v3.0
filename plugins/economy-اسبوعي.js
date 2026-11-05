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

const handler = async (m, { conn, usedPrefix }) => {

    
    if (m.isGroup && !global.db.data.chats[m.chat]?.economy) {
        return m.reply(
`《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة ❌

يمكن لأحد المشرفين تفعيلها باستخدام الأمر:
» *${usedPrefix}economy on* ✅`
        )
    }

    
    const user = global.db.data.users[m.sender]

    if (!user) {
        return m.reply(
            '❌ لم يتم العثور على بيانات حسابك في نظام الاقتصاد.'
        )
    }

    
    user.weeklyStreak = Number(user.weeklyStreak) || 0
    user.lastWeeklyGlobal = Number(user.lastWeeklyGlobal) || 0
    user.lastweekly = Number(user.lastweekly) || 0
    user.coin = Number(user.coin) || 0
    user.exp = Number(user.exp) || 0

    const now = Date.now()

    
    const gap = 7 * 24 * 60 * 60 * 1000

    
    if (now < user.lastweekly) {

        const remaining =
            Math.ceil((user.lastweekly - now) / 1000)

        return conn.reply(
            m.chat,
`🎁 أنت بالفعل استلمت جائزتك الأسبوعية.

> يمكنك استلامها مرة أخرى بعد:
*${formatTime(remaining)}* ⏳`,
            m
        )
    }

    
    const lost =
        user.weeklyStreak >= 1 &&
        now - user.lastWeeklyGlobal > gap * 1.5

    if (lost) {
        user.weeklyStreak = 0
    }

    
    const canClaimWeeklyGlobal =
        now - user.lastWeeklyGlobal >= gap

    if (canClaimWeeklyGlobal) {
        user.weeklyStreak = Math.min(
            user.weeklyStreak + 1,
            30
        )

        user.lastWeeklyGlobal = now
    }

    
    const coins = Math.min(
        40000 + ((user.weeklyStreak - 1) * 5000),
        185000
    )

    
    const expRandom =
        Math.floor(Math.random() * 151) + 50

    
    user.coin += coins
    user.exp += expRandom

    
    user.lastweekly = now + gap

    const nextReward = Math.min(
        40000 + (user.weeklyStreak * 5000),
        185000
    )

    let nextMessage =
`> الأسبوع القادم » *+¥${nextReward.toLocaleString()} ${currency}*`

    if (lost) {
        nextMessage +=
`\n> ☆ لقد خسرت سلسلة أسابيعك! 💔`
    }

    
    return conn.reply(
        m.chat,
`「❁」 *المكافأة الأسبوعية* 🎁

💰 العملات:
*+¥${coins.toLocaleString()} ${currency}*

✨ الخبرة:
*+${expRandom} XP*

🔥 سلسلة الأسابيع:
*${user.weeklyStreak}*

${nextMessage}

📅 عد بعد أسبوع لاستلام مكافأتك القادمة ⏳`,
        m
    )
}

handler.help = ['اسبوعي']
handler.tags = ['economy']

handler.command = [
    'weekly',
    'اسبوعي'
]

handler.group = true

export default handler

function formatTime(seconds) {

    const days = Math.floor(
        seconds / 86400
    )

    const hours = Math.floor(
        (seconds % 86400) / 3600
    )

    const minutes = Math.floor(
        (seconds % 3600) / 60
    )

    const secs = seconds % 60

    if (days > 0) {
        return `${days} يوم ${hours} ساعة ${minutes} دقيقة`
    }

    if (hours > 0) {
        return `${hours} ساعة ${minutes} دقيقة ${secs} ثانية`
    }

    if (minutes > 0) {
        return `${minutes} دقيقة ${secs} ثانية`
    }

    return `${secs} ثانية`
}