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

let handler = async (m, { args, usedPrefix, command }) => {

if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》أوامر *الاقتصاد* متعطلة في المجموعة دي ❌

👮‍♂️ ممكن *حد من الأدمنز* يفعلها بالأمر:
» *${usedPrefix}economy on* ✅`)
}

let user = global.db.data.users[m.sender]

if (!args[0])
return m.reply(`❀ Ｎｏｘ | اكتب كمية *${currency}* اللي عايز تودعها 🏦`)

if ((args[0]) < 1)
return m.reply(`ꕥ اكتب قيمة صحيحة من *${currency}* ❌`)

if (args[0] == 'الكل') {

let count = parseInt(user.coin)

user.coin -= count * 1
user.bank += count * 1

await m.reply(
`「✦」 Ｎｏｘ

🏦 تم إيداع *${count.toLocaleString()} ${currency}* في البنك.

🔒 رصيدك أصبح محفوظًا في البنك.`
)

return !0
}

if (!Number(args[0]))
return m.reply(`ꕥ لازم تكتب مبلغ صحيح للإيداع 💰

> مثال 1 » *${usedPrefix}ايداع 25000*
> مثال 2 » *${usedPrefix}ايداع الكل*`)

let count = parseInt(args[0])

if (!user.coin)
return m.reply(`ꕥ معندكش رصيد كافي في المحفظة 💸

> حاول تجمع رصيد أو استخدم كمية أقل.`)

if (user.coin < count)
return m.reply(
`✧ رصيدك الحالي في المحفظة:
*¥${user.coin.toLocaleString()} ${currency}* 💰`
)

user.coin -= count * 1
user.bank += count * 1

await m.reply(
`「✦」 Ｎｏｘ

🏦 تم إيداع *¥${count.toLocaleString()} ${currency}* في البنك.

🔒 رصيدك أصبح محفوظًا في البنك.`
)

}

handler.help = ['ايداع']
handler.tags = ['economy']
handler.command = ['deposit', 'ايداع-للبنك', 'إيداع', 'ايداع']
handler.group = true

export default handler