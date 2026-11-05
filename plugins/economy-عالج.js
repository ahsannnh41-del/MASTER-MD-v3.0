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
    const db = global.db

    
    if (m.isGroup) {
        if (!db.data.chats[m.chat]) {
            db.data.chats[m.chat] = {}
        }

        if (!db.data.chats[m.chat].economy) {
            return m.reply(
                `《✦》أوامر *الاقتصاد* متعطلة في المجموعة دي ❌\n\n` +
                `👮‍♂️ ممكن *حد من الأدمنز* يفعلها بالأمر ده:\n` +
                `» *${usedPrefix}economy on* ✅`
            )
        }
    }

    
    if (!db.data.users[m.sender]) {
        db.data.users[m.sender] = {
            coin: 0,
            exp: 0,
            health: 100,
            lastHeal: 0
        }
    }

    const user = db.data.users[m.sender]

    
    if (typeof user.coin !== 'number' || isNaN(user.coin)) {
        user.coin = 0
    }

    if (typeof user.health !== 'number' || isNaN(user.health)) {
        user.health = 100
    }

    if (typeof user.lastHeal !== 'number' || isNaN(user.lastHeal)) {
        user.lastHeal = 0
    }

    
    if (user.health > 100) {
        user.health = 100
    }

    if (user.health < 0) {
        user.health = 0
    }

    if (user.coin < 0) {
        user.coin = 0
    }

    
    if (user.health >= 100) {
        return conn.reply(
            m.chat,
            `❀ صحتك دلوقتي على أقصى حد ❤️`,
            m
        )
    }

    
    if (user.coin < 50) {
        return conn.reply(
            m.chat,
            `ꕥ معندكش كفاية من *${global.currency || 'كوين'}* عشان تعالج نفسك 💸🩹\n\n` +
            `💰 تكلفة كل نقطة صحة: *50 ${global.currency || 'كوين'}*`,
            m
        )
    }

    
    const missingHealth = 100 - user.health
    const availableHealth = Math.floor(user.coin / 50)
    const healed = Math.min(missingHealth, availableHealth)

    if (healed <= 0) {
        return conn.reply(
            m.chat,
            `ꕥ معندكش رصيد كافي للعلاج 💸🩹`,
            m
        )
    }

    
    user.health += healed
    user.coin -= healed * 50
    user.lastHeal = Date.now()

    
    if (user.health > 100) {
        user.health = 100
    }

    if (user.coin < 0) {
        user.coin = 0
    }

    const currencyName = global.currency || 'كوين'

    const info =
        `❀ *Ｎｏｘ Ｂｏｔ* ❤️‍🩹\n\n` +
        `✦ تم علاج *${healed}* نقطة من الصحة ❤️‍🩹\n` +
        `♡ صحتك الحالية: *${user.health}/100* 🩺\n` +
        `⛁ رصيدك المتبقي: *¥${user.coin.toLocaleString()} ${currencyName}* 💰\n\n` +
        `> تكلفة العلاج: *${(healed * 50).toLocaleString()} ${currencyName}*`

    await conn.reply(m.chat, info, m)

    
    if (typeof db.write === 'function') {
        await db.write()
    }
}

handler.help = ['عالج']
handler.tags = ['economy']
handler.command = ['heal', 'عالج']
handler.group = true

export default handler