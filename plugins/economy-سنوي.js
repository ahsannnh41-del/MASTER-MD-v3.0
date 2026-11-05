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

    const chat = global.db.data.chats[m.chat]

    if (m.isGroup && !chat?.economy) {
        return m.reply(`《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة ❌

يمكن *لأحد المشرفين* تفعيلها باستخدام الأمر:
» *${usedPrefix}economy on* ✅`)
    }

    const users = global.db.data.users

    if (!users[m.sender]) {
        users[m.sender] = {
            exp: 0,
            coin: 0,
            yearlyStreak: 0,
            lastYearlyGlobal: 0,
            lastyearly: 0
        }
    }

    const user = users[m.sender]

    user.coin = Number(user.coin) || 0
    user.exp = Number(user.exp) || 0
    user.yearlyStreak = Number(user.yearlyStreak) || 0
    user.lastYearlyGlobal = Number(user.lastYearlyGlobal) || 0
    user.lastyearly = Number(user.lastyearly) || 0

    const gap = 365 * 24 * 60 * 60 * 1000
    const now = Date.now()

    
    if (now < user.lastyearly) {
        const wait = formatTime(
            Math.ceil((user.lastyearly - now) / 1000)
        )

        return conn.reply(
            m.chat,
            `🎁 أنت بالفعل استلمت جائزتك السنوية.

> يمكنك استلامها مرة أخرى بعد *${wait}* ⏳`,
            m
        )
    }

    
    const lost =
        user.yearlyStreak >= 1 &&
        user.lastYearlyGlobal > 0 &&
        now - user.lastYearlyGlobal > gap * 1.5

    if (lost) {
        user.yearlyStreak = 0
    }

    
    const canClaim =
        user.lastYearlyGlobal === 0 ||
        now - user.lastYearlyGlobal >= gap

    if (canClaim) {
        user.yearlyStreak = Math.min(
            user.yearlyStreak + 1,
            30
        )

        user.lastYearlyGlobal = now
    }

    
    const coins = Math.min(
        500000 + ((user.yearlyStreak - 1) * 100000),
        5000000
    )

    const expRandom =
        Math.floor(Math.random() * 301) + 200

    user.coin += coins
    user.exp += expRandom
    user.lastyearly = now + gap

    
    const nextReward = Math.min(
        500000 + (user.yearlyStreak * 100000),
        5000000
    )

    let nextMessage =
        `> سنة *${user.yearlyStreak + 1}* » *+¥${nextReward.toLocaleString()}*`

    if (lost) {
        nextMessage += `\n> ☆ لقد خسرت سلسلة السنوات! 💔`
    }

    return conn.reply(
        m.chat,
        `「❁」 *المكافأة السنوية* 🎁

💰 العملات:
+¥${coins.toLocaleString()} ${currency}

✨ الخبرة:
+${expRandom} XP

🔥 سلسلة السنوات:
${user.yearlyStreak}

📅 المكافأة القادمة:
¥${nextReward.toLocaleString()} ${currency}

${nextMessage}

> ارجع بعد سنة لاستلام مكافأتك القادمة ⏳`,
        m
    )
}

handler.help = ['سنوي']
handler.tags = ['economy']
handler.command = ['yearly', 'سنوي']
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