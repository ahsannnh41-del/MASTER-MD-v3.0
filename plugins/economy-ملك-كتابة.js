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

if (!db.data.chats[m.chat].economy && m.isGroup)
return conn.reply(m.chat, `《✦》أوامر *الاقتصاد* متعطلة في هذه المجموعة ❌

👮‍♂️ يمكن لأحد الأدمنز تفعيلها بالأمر:
» *${usedPrefix}economy on*`, m)

const user = global.db.data.users[m.sender]

if (!text)
return conn.reply(
m.chat,
`❀ لازم تراهن على كمية صحيحة.
> مثال » *${usedPrefix + command} 150 ملك* 👑`,
m
)

const args = text.trim().split(/\s+/)

if (!args[0] || !args[1])
return conn.reply(
m.chat,
`❌ صيغة غير صحيحة!

❗ حدد المبلغ 💰 وبعدها اختر 👑 ملك أو ✍️ كتابة
> مثال » *${usedPrefix + command} 150 كتابة*`,
m
)

const cantidad = parseFloat(args[0])
const eleccion = args[1].toLowerCase()

if (isNaN(cantidad))
return conn.reply(
m.chat,
`❌ كمية غير صالحة!
🔢 ادخل رقم صحيح.
> مثال » *${usedPrefix + command} 200 كتابة* ✍️`,
m
)

if (Math.abs(cantidad) < 100)
return conn.reply(
m.chat,
`⚠️ الحد الأدنى للمراهنة هو *100 ${currency}* 💰`,
m
)

if (!['ملك', 'كتابة'].includes(eleccion))
return conn.reply(
m.chat,
`⚠️ اختيار غير صالح.
لازم تختار *ملك* 👑 أو *كتابة* 📜.
> مثال » *${usedPrefix + command} 200 ملك*`,
m
)

if (cantidad > user.coin)
return conn.reply(
m.chat,
`💸 معندكش كفاية من *${currency}* عشان تراهن، معاك دلوقتي *¥${user.coin.toLocaleString()} ${currency}* فقط.`,
m
)

const resultado = Math.random() < 0.5 ? 'ملك' : 'كتابة'
const acierto = resultado === eleccion
const cambio = acierto ? cantidad : -cantidad

user.coin += cambio

if (user.coin < 0) user.coin = 0

const mensaje = `「✦」 Ｎｏｘ

🪙 العملة وقعت على *${capitalize(resultado)}*
${acierto ? '🎉 لقد فزت' : '💔 خسرت'} *¥${Math.abs(cambio).toLocaleString()} ${currency}*!

> اختيارك كان *${capitalize(eleccion)}*`

return conn.reply(m.chat, mensaje, m)
}

handler.help = ['ملك-كتابة']
handler.tags = ['economy']
handler.command = ['ملك-كتابة', 'كتابة-ملك', 'coinflip', 'flip']
handler.group = true

export default handler

function capitalize(txt) {
return txt.charAt(0).toUpperCase() + txt.slice(1)
}