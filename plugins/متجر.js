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

const handler = async (m, { conn, command, args }) => {
    const user = global.db.data.users[m.sender]

    user.coin = Number(user.coin) || 0
    user.exp = Number(user.exp) || 0
    user.limit = Number(user.limit) || 0

    const products = {
        1: {
            name: '🎟️ زيادة المحاولات',
            price: 5000,
            action: () => {
                user.limit += 10
            },
            result: 'تمت إضافة *10 محاولات* إلى حسابك.'
        },
        2: {
            name: '⭐ حزمة خبرة',
            price: 7500,
            action: () => {
                user.exp += 1000
            },
            result: 'تمت إضافة *1000 XP* إلى حسابك.'
        },
        3: {
            name: '💰 حزمة العملات',
            price: 10000,
            action: () => {
                user.coin += 15000
            },
            result: 'حصلت على *15,000 عملة*.'
        },
        4: {
            name: '🎁 صندوق VIP',
            price: 25000,
            action: () => {
                user.coin += 35000
                user.exp += 2500
                user.limit += 20
            },
            result: 'حصلت على *35,000 عملة + 2,500 XP + 20 محاولة*.'
        },
        5: {
            name: '👑 صندوق النخبة',
            price: 50000,
            action: () => {
                user.coin += 75000
                user.exp += 5000
                user.limit += 50
            },
            result: 'حصلت على *75,000 عملة + 5,000 XP + 50 محاولة*.'
        }
    }

    if (!args[0]) {
        let text = `╭━━━〔 🛒 𝐍𝐎𝐗 𝐒𝐓𝐎𝐑𝐄 〕━━━╮
┃
┃ 🪙 رصيدك: *${user.coin.toLocaleString()}*
┃
┃ اختر المنتج الذي تريد شراءه:
┃
┃ 1 ┃ 🎟️ زيادة المحاولات
┃     💰 السعر: *5,000*
┃
┃ 2 ┃ ⭐ حزمة خبرة
┃     💰 السعر: *7,500*
┃
┃ 3 ┃ 💰 حزمة العملات
┃     💰 السعر: *10,000*
┃
┃ 4 ┃ 🎁 صندوق VIP
┃     💰 السعر: *25,000*
┃
┃ 5 ┃ 👑 صندوق النخبة
┃     💰 السعر: *50,000*
┃
┃ 🛍️ للشراء:
┃ *.شراء رقم*
┃
┃ مثال:
┃ *.شراء 1*
┃
╰━━━━━━━━━━━━━━━━━━╯
⚡ MASTER MD ⚡`

        return m.reply(text)
    }

    if (command === 'متجر') return

    const id = Number(args[0])
    const product = products[id]

    if (!product) {
        return m.reply(`❌ *المنتج غير موجود!*

استخدم:
*.متجر*

لمشاهدة المنتجات المتاحة.`)
    }

    if (user.coin < product.price) {
        const missing = product.price - user.coin

        return m.reply(`╭━━━〔 ❌ 𝐍𝐎𝐗 𝐒𝐓𝐎𝐑𝐄 〕━━━╮
┃
┃ المنتج: ${product.name}
┃ السعر: *${product.price.toLocaleString()}*
┃ رصيدك: *${user.coin.toLocaleString()}*
┃
┃ ينقصك: *${missing.toLocaleString()}* 🪙
┃
╰━━━━━━━━━━━━━━━━━━╯`)
    }

    user.coin -= product.price
    product.action()

    await m.reply(`╭━━━〔 🛍️ 𝐏𝐔𝐑𝐂𝐇𝐀𝐒𝐄 〕━━━╮
┃
┃ ✅ تمت عملية الشراء بنجاح!
┃
┃ 📦 المنتج:
┃ ${product.name}
┃
┃ 💰 السعر:
┃ *${product.price.toLocaleString()}*
┃
┃ 🎁 المكافأة:
┃ ${product.result}
┃
┃ 🪙 رصيدك الجديد:
┃ *${user.coin.toLocaleString()}*
┃
╰━━━━━━━━━━━━━━━━━━╯
⚡ MASTER MD ⚡`)
}

handler.help = ['متجر', 'شراء']
handler.tags = ['economy']
handler.command = ['متجر', 'شراء']
handler.group = true

export default handler