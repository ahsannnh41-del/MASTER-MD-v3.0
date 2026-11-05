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

const handler = async (m, { conn, args, usedPrefix, command }) => {

    if (m.isGroup && !global.db.data.chats[m.chat].economy) {
        return m.reply(
            `《✦》أوامر *الاقتصاد* متعطلة في المجموعة ❌\n\n` +
            `👮‍♂️ يقدر أي *أدمن* يفعلها بالأمر:\n` +
            `» *${usedPrefix}economy on* ✅`
        )
    }

    const user = global.db.data.users[m.sender]

    if (!user) {
        return m.reply(`❌ مش لاقي بيانات حسابك في قاعدة البيانات.`)
    }

    user.coin = Number(user.coin) || 0
    user.bank = Number(user.bank) || 0

    const money = global.currency || '¥'

    if (!args || !args[0]) {
        return m.reply(
            `❀ اكتب المبلغ اللي عايز تسحبه من البنك 🏦💸\n\n` +
            `📌 مثال:\n` +
            `» *${usedPrefix + command} 25000*\n` +
            `» *${usedPrefix + command} الكل*`
        )
    }

    const value = String(args[0]).toLowerCase()

    
    if (value === 'الكل' || value === 'all') {

        if (user.bank <= 0) {
            return m.reply(
                `ꕥ معندكش رصيد في البنك 🏦💸`
            )
        }

        const amount = user.bank

        user.bank = 0
        user.coin += amount

        return conn.reply(
            m.chat,
            `「✦」 *تم السحب بنجاح* 🏦💸\n\n` +
            `💰 المسحوب: *${amount.toLocaleString()} ${money}*\n` +
            `👛 رصيدك: *${user.coin.toLocaleString()} ${money}*\n` +
            `🏦 البنك: *0 ${money}*`,
            m
        )
    }

    
    const amount = Number(value)

    if (!Number.isInteger(amount) || amount <= 0) {
        return m.reply(
            `❌ المبلغ غير صحيح.\n\n` +
            `📌 مثال:\n` +
            `» *${usedPrefix + command} 25000*`
        )
    }

    
    if (user.bank <= 0) {
        return m.reply(
            `ꕥ معندكش أي *${money}* في البنك 🏦💸`
        )
    }

    
    if (amount > user.bank) {
        return m.reply(
            `❌ المبلغ أكبر من رصيد البنك.\n\n` +
            `🏦 رصيدك في البنك: *${user.bank.toLocaleString()} ${money}*`
        )
    }

    
    user.bank -= amount
    user.coin += amount

    return conn.reply(
        m.chat,
        `「✦」 *تمت عملية السحب* 🏦💸\n\n` +
        `💰 سحبت: *${amount.toLocaleString()} ${money}*\n` +
        `👛 رصيدك: *${user.coin.toLocaleString()} ${money}*\n` +
        `🏦 المتبقي بالبنك: *${user.bank.toLocaleString()} ${money}*`,
        m
    )
}

handler.help = ['سحب']
handler.tags = ['economy']
handler.command = ['سحب', 'اسحب', 'withdraw']
handler.group = true

export default handler