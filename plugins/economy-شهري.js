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

let handler = async (m, { conn, usedPrefix }) => {

    if (m.isGroup && !global.db.data.chats[m.chat]?.economy) {
        return m.reply(
            `《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة ❌

يمكن لأحد المشرفين تفعيلها باستخدام الأمر:
» *${usedPrefix}economy on* ✅`
        )
    }

    let user = global.db.data.users[m.sender]

    if (!user) {
        global.db.data.users[m.sender] = {
            exp: 0,
            coin: 0,
            monthlyStreak: 0,
            lastMonthly: 0
        }

        user = global.db.data.users[m.sender]
    }

    user.exp = Number(user.exp) || 0
    user.coin = Number(user.coin) || 0
    user.monthlyStreak = Number(user.monthlyStreak) || 0
    user.lastMonthly = Number(user.lastMonthly) || 0

    const now = Date.now()
    const cooldown = 30 * 24 * 60 * 60 * 1000

    if (now < user.lastMonthly) {

        const remaining = Math.ceil(
            (user.lastMonthly - now) / 1000
        )

        return conn.reply(
            m.chat,
            `ꕥ لقد استلمت مكافأتك الشهرية بالفعل 🎁

« يمكنك استلامها مرة أخرى بعد:
*${formatTime(remaining)}* ⏳ »`,
            m
        )
    }

    if (
        user.lastMonthly > 0 &&
        now - user.lastMonthly > cooldown * 1.5
    ) {
        user.monthlyStreak = 0
    }

    user.monthlyStreak = Math.min(
        user.monthlyStreak + 1,
        8
    )

    const coins = Math.min(
        60000 + ((user.monthlyStreak - 1) * 5000),
        95000
    )

    const exp = Math.floor(
        Math.random() * 401
    ) + 100

    user.coin += coins
    user.exp += exp
    user.lastMonthly = now + cooldown

    const nextCoins = Math.min(
        60000 + (user.monthlyStreak * 5000),
        95000
    )

    return conn.reply(
        m.chat,
        `「❁」 *المكافأة الشهرية* 🎁

💰 العملات:
*+${coins.toLocaleString()} ${currency}*

✨ الخبرة:
*+${exp} XP*

🔥 سلسلة الأشهر:
*${user.monthlyStreak}*

📅 المكافأة القادمة:
*${nextCoins.toLocaleString()} ${currency}*

« ارجع بعد 30 يومًا لاستلام مكافأتك القادمة ⏳ »`,
        m
    )
}

handler.help = ['شهري']
handler.tags = ['economy']
handler.command = ['شهري', 'monthly']
handler.group = true

export default handler

function formatTime(seconds) {

    const days = Math.floor(seconds / 86400)

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