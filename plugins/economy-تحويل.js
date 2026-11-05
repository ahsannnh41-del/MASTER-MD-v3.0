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

async function handler(m, { conn, args, usedPrefix, command }) {

if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`❌《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة.

🛠️ يمكن *لأحد المشرفين* تفعيلها باستخدام الأمر:
» *${usedPrefix}economy on*`)
}

const mentionedJid = m.mentionedJid || []

const who = m.quoted
  ? m.quoted.sender
  : mentionedJid[0]
  || (args[1] ? args[1].replace(/[@ .+-]/g, '') + '@s.whatsapp.net' : null)

if (!args[0])
return m.reply(`❀ لازم تحدد المبلغ والشخص اللي هتحوّله *${currency}* 🎁
> مثال » *${usedPrefix + command} 25000 @منشن*`)

if (!isNumber(args[0]) && args[0].startsWith('@'))
return m.reply(`ꕥ لازم تكتب المبلغ الأول وبعدين الشخص اللي هتحوّله 💸
> مثال » *${usedPrefix + command} 1000 @منشن*`)

if (!who)
return m.reply(`ꕥ لازم تعمل منشن لحد عشان تحوّله *${currency}* 💸`)

if (!(who in global.db.data.users))
return m.reply(`ꕥ المستخدم ده مش موجود في قاعدة البيانات ❌`)

let user = global.db.data.users[m.sender]
let recipient = global.db.data.users[who]

let count = Math.min(
Number.MAX_SAFE_INTEGER,
Math.max(10, (isNumber(args[0]) ? parseInt(args[0]) : 10))
)

if (typeof user.bank !== 'number')
user.bank = 0

if (user.bank < count)
return m.reply(`ꕥ معندكش *${currency}* كفاية في البنك عشان تحوّل ❌💸`)

user.bank -= count

if (typeof recipient.bank !== 'number')
recipient.bank = 0

recipient.bank += count

if (isNaN(user.bank))
user.bank = 0

let name = await (async () =>
global.db.data.users[who].name ||
(async () => {
try {
const n = await conn.getName(who)
return typeof n === 'string' && n.trim()
? n
: who.split('@')[0]
} catch {
return who.split('@')[0]
}
})()
)()

let username = '@' + who.split('@')[0]

conn.reply(
m.chat,
`❀ Ｎｏｘ | تم التحويل بنجاح 💸

حوّلت *¥${count.toLocaleString()} ${currency}* لـ ${username} 💰
> رصيدك في البنك الآن *¥${user.bank.toLocaleString()} ${currency}* 🏦`,
m,
{
mentions: [who]
}
)
}

handler.help = ['تحويل']
handler.tags = ['economy']
handler.command = ['تحويل', 'coinsgive', 'givecoins', 'حول']
handler.group = true

export default handler

function isNumber(x) {
return !isNaN(x)
}