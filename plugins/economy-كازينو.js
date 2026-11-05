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

let buatall = 1

let handler = async (m, { conn, args, usedPrefix, command }) => {

if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》أوامر *الاقتصاد* متعطلة في المجموعة دي ❌

👮‍♂️ ممكن *حد من الأدمنز* يفعلها بالأمر ده:
» *${usedPrefix}economy on* ✅`)
}

const user = global.db.data.users[m.sender]

let Aku = Math.floor(Math.random() * 101)
let Kamu = Math.floor(Math.random() * 55)
let count = args[0]

const userName = await (async () =>
global.db.data.users[m.sender].name ||
(async () => {
try {
const n = await conn.getName(m.sender)
return typeof n === 'string' && n.trim() ? n : m.sender.split('@')[0]
} catch {
return m.sender.split('@')[0]
}
})()
)()

const tiempoEspera = 15 * 1000
const ahora = Date.now()

if (user.lastApuesta && ahora - user.lastApuesta < tiempoEspera) {
const restante = user.lastApuesta + tiempoEspera - ahora
const tiempoRestante = formatTime(restante)

return conn.reply(
m.chat,
`ꕥ لازم تنتظر *${tiempoRestante}* عشان تستخدم *${usedPrefix + command}* تاني ⏳`,
m
)
}

user.lastApuesta = ahora

count = count
? /all/i.test(count)
? Math.floor(global.db.data.users[m.sender].limit / buatall)
: parseInt(count)
: args[0]
? parseInt(args[0])
: 1

count = Math.max(1, count)

if (args.length < 1) {
return conn.reply(
m.chat,
`❀ ادخل كمية *${currency}* اللي عايز تضيفها ضد البوت
> مثال: *${usedPrefix + command} 100* 💰`,
m
)
}

if (user.coin >= count) {

user.coin -= count

let resultado = ''
let ganancia = 0

if (Aku > Kamu) {

resultado = `> ${userName}, 💔 خسرت *¥${formatNumber(count)} ${currency}*.`

} else if (Aku < Kamu) {

ganancia = count * 2
user.coin += ganancia

resultado = `> ${userName}, 🎉 فزت بـ *¥${formatNumber(ganancia)} ${currency}*.`

} else {

ganancia = count
user.coin += ganancia

resultado = `> ${userName}, 🎉 فزت بـ *¥${formatNumber(ganancia)} ${currency}*.`

}

const replyMsg =
`❀ \`يلا نشوف الأرقام اللي معانا!\`

➠ *Ｎｏｘ* : ${Aku}
➠ *${userName}* : ${Kamu}

${resultado}`

conn.reply(m.chat, replyMsg.trim(), m)

} else {

conn.reply(
m.chat,
`ꕥ معندكش *¥${formatNumber(count)} ${currency}* عشان تراهن! 💸`,
m
)

}}

handler.help = ['كازينو']
handler.tags = ['economy']
handler.command = ['كازينو', 'casino']
handler.group = true

export default handler

function formatNumber(number) {
return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function formatTime(ms) {
if (ms <= 0 || isNaN(ms)) return 'Ahora'

const totalSec = Math.ceil(ms / 1000)
const min = Math.floor(totalSec / 60)
const sec = totalSec % 60
const partes = []

if (min) partes.push(`${min} دقيقة`)

partes.push(`${sec} ثانية`)

return partes.join(' ')
}