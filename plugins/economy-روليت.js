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

const handler = async (m, { conn, text, command, usedPrefix }) => {

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
            health: 100
        }

        user = global.db.data.users[m.sender]
    }

    user.coin = Number(user.coin) || 0
    user.exp = Number(user.exp) || 0

    if (!text) {
        return conn.reply(
            m.chat,
            `ꕥ لازم تدخل مبلغ من *${currency}* وتراهن على لون.

> مثال:
*${usedPrefix + command} 2500 احمر* 🎯`,
            m
        )
    }

    const args = text.trim().split(/\s+/)

    if (args.length !== 2) {
        return conn.reply(
            m.chat,
            `❗ꕥ صيغة غير صحيحة.

لازم تدخل المبلغ واللون.

> مثال:
*${usedPrefix + command} 2500 احمر* 🎯`,
            m
        )
    }

    const coin = parseInt(args[0])
    const color = args[1].toLowerCase()

    if (isNaN(coin) || coin <= 0) {
        return conn.reply(
            m.chat,
            `⚠️ ꕥ من فضلك أدخل مبلغ صحيح للمراهنة 💰`,
            m
        )
    }

    if (color !== 'اسود' && color !== 'احمر') {
        return conn.reply(
            m.chat,
            `🎯 ꕥ لازم تراهن على لون صحيح:

*اسود* ⚫
*احمر* 🔴`,
            m
        )
    }

    if (coin > user.coin) {
        return conn.reply(
            m.chat,
            `💸 ꕥ معندكش عملات كفاية من *${currency}* عشان تعمل الرهان ده 😢

رصيدك الحالي:
*${user.coin.toLocaleString()} ${currency}*`,
            m
        )
    }

    const resultColor =
        Math.random() < 0.5
            ? 'اسود'
            : 'احمر'

    const win = color === resultColor

    if (win) {

        user.coin += coin

        return conn.reply(
            m.chat,
            `「✿」 *الروليت* 🎰

🎯 اللون الفائز:
*${resultColor}*

🎉 مبروك! لقد ربحت:
*+${coin.toLocaleString()} ${currency}* 💰

💳 رصيدك:
*${user.coin.toLocaleString()} ${currency}*`,
            m
        )

    } else {

        user.coin -= coin

        if (user.coin < 0) {
            user.coin = 0
        }

        return conn.reply(
            m.chat,
            `「✿」 *الروليت* 🎰

🎯 اللون الفائز:
*${resultColor}*

😢 للأسف خسرت:
*-${coin.toLocaleString()} ${currency}* 💸

💳 رصيدك:
*${user.coin.toLocaleString()} ${currency}*`,
            m
        )
    }
}

handler.tags = ['economy']
handler.help = ['روليت']
handler.command = ['روليت', 'roulette', 'الروليت']
handler.group = true

export default handler