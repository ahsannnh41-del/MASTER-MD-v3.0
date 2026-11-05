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

let handler = async (m, { conn, usedPrefix, command }) => {

if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة ❌

👮‍♂️ يمكن لأحد المشرفين تفعيلها بالأمر:
» *${usedPrefix}economy on*`)
}

let user = global.db.data.users[m.sender]

user.lastcrime = user.lastcrime || 0
user.coin = user.coin || 0

const cooldown = 8 * 60 * 1000
const ahora = Date.now()

if (ahora < user.lastcrime) {
const restante = user.lastcrime - ahora
const wait = formatTimeMs(restante)

return conn.reply(
m.chat,
`ꕥ لازم تنتظر *${wait}* قبل ما تستخدم *${usedPrefix + command}* مرة ثانية ⏳`,
m
)
}

user.lastcrime = ahora + cooldown

const evento = pickRandom(crimen)

let cantidad

if (evento.tipo === 'انتصار') {

cantidad = Math.floor(Math.random() * 1501) + 6000
user.coin += cantidad

} else {

cantidad = Math.floor(Math.random() * 1501) + 4000
user.coin -= cantidad

if (user.coin < 0) user.coin = 0

}

await conn.reply(
m.chat,
`「✦」 Ｎｏｘ

${evento.mensaje}

💰 المبلغ: *¥${cantidad.toLocaleString()} ${currency}*`,
m
)
}

handler.tags = ['economy']
handler.help = ['جريمه']
handler.command = ['جريمه', 'crime', 'جريمة']
handler.group = true

export default handler

function formatTimeMs(ms) {

const totalSec = Math.ceil(ms / 1000)
const min = Math.floor(totalSec / 60)
const sec = totalSec % 60

const partes = []

if (min) partes.push(`${min} دقيقة`)

partes.push(`${sec} ثانية`)

return partes.join(' ')
}

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

const crimen = [

{ tipo: 'انتصار', mensaje: "💎 عثرت على كنز مخفي في أطلال قديمة، كانت مغامرة ناجحة!" },
{ tipo: 'انتصار', mensaje: "🏰 ساعدت الحراس في استعادة كنز مفقود، وحصلت على مكافأة!" },
{ tipo: 'انتصار', mensaje: "🗺️ وجدت خريطة كنز أسطورية واتّبعت الطريق حتى وصلت للمكافأة!" },
{ tipo: 'انتصار', mensaje: "🐉 ساعدت قرية في حل مشكلة مع تنين صغير وحصلت على مكافأة!" },
{ tipo: 'انتصار', mensaje: "🌌 اكتشفت كهفًا مليئًا بالأحجار اللامعة، وكانت الرحلة موفقة!" },
{ tipo: 'انتصار', mensaje: "⚔️ فزت في تحدي المغامرين وحصلت على الجائزة الكبرى!" },
{ tipo: 'انتصار', mensaje: "🏆 أصبحت بطل مسابقة المغامرين وربحت مكافأة محترمة!" },
{ tipo: 'انتصار', mensaje: "🔮 عثرت على جوهرة سحرية نادرة أثناء الاستكشاف!" },
{ tipo: 'انتصار', mensaje: "🌊 ساعدت طاقم سفينة في الوصول إلى الميناء بأمان وحصلت على مكافأة!" },
{ tipo: 'انتصار', mensaje: "🧭 اتبعت البوصلة القديمة حتى وصلت إلى صندوق كنز مخفي!" },
{ tipo: 'انتصار', mensaje: "🏔️ وصلت إلى قمة الجبل واكتشفت كنزًا تركه مستكشف قديم!" },
{ tipo: 'انتصار', mensaje: "🌳 استكشفت الغابة وعثرت على صندوق مكافآت بين الأشجار!" },
{ tipo: 'انتصار', mensaje: "🪙 اكتشفت مجموعة عملات قديمة في موقع أثري وحصلت على مكافأة!" },
{ tipo: 'انتصار', mensaje: "🎯 فزت في تحدي الرماية داخل ساحة المغامرين!" },
{ tipo: 'انتصار', mensaje: "🎲 فزت في مسابقة الحظ داخل مدينة المغامرين!" },

{ tipo: 'هزيمة', mensaje: "🌪️ هبت عاصفة قوية وأجبرتك على العودة بدون إكمال المهمة." },
{ tipo: 'هزيمة', mensaje: "🗺️ ضاعت منك الخريطة ولم تتمكن من العثور على الكنز." },
{ tipo: 'هزيمة', mensaje: "🌧️ هطلت الأمطار وأفسدت رحلة الاستكشاف، خسرت المكافأة." },
{ tipo: 'هزيمة', mensaje: "🏔️ كان الطريق صعبًا واضطررت للعودة قبل الوصول للقمة." },
{ tipo: 'هزيمة', mensaje: "🌳 ضعت في الغابة لفترة طويلة وانتهت المغامرة بدون مكافأة." },
{ tipo: 'هزيمة', mensaje: "🧭 تعطلت بوصلتك ولم تتمكن من معرفة الطريق الصحيح." },
{ tipo: 'هزيمة', mensaje: "🎯 أخفقت في تحدي المغامرين وخسرت فرصة المكافأة." },
{ tipo: 'هزيمة', mensaje: "🎲 لم يحالفك الحظ هذه المرة وخسرت جزءًا من مكافأتك." },
{ tipo: 'هزيمة', mensaje: "🌊 اضطرت السفينة للعودة بسبب سوء الطقس، وانتهت المهمة." },
{ tipo: 'هزيمة', mensaje: "🏰 وصلت للقلعة متأخرًا وانتهت المهمة قبل وصولك." },
{ tipo: 'هزيمة', mensaje: "🔮 لم تتمكن من حل لغز الجوهرة السحرية، وخسرت المكافأة." },
{ tipo: 'هزيمة', mensaje: "🧩 أخطأت في حل اللغز وانتهت المغامرة بدون جائزة." },
{ tipo: 'هزيمة', mensaje: "🌌 اختفى الطريق بين الضباب ولم تجد مكان الكنز." },
{ tipo: 'هزيمة', mensaje: "🏕️ نفدت مؤونتك واضطررت للعودة إلى المخيم." },
{ tipo: 'هزيمة', mensaje: "⚔️ خسرت تحدي المغامرين هذه المرة ولم تحصل على الجائزة." }

]