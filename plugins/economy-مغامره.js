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

let handler = async (m, { conn, command, usedPrefix }) => {
if (!global.db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》أوامر *الاقتصاد* متعطلة في المجموعة دي ❌

👮‍♂️ ممكن *حد من الأدمنز* يفعلها بالأمر ده:
» *${usedPrefix}economy on* ✅`)
}

let user = global.db.data.users[m.sender]

if (!user) global.db.data.users[m.sender] = user = {
coin: 0,
exp: 0,
health: 100,
lastAdventure: 0
}

if (user.coin == null) user.coin = 0
if (user.exp == null) user.exp = 0
if (user.health == null) user.health = 100
if (user.lastAdventure == null) user.lastAdventure = 0

if (user.health < 5)
return conn.reply(
m.chat,
`ꕥ معندكش صحة كفاية عشان ترجع *تغامر* 🏹.\n> استخدم *"${usedPrefix}heal"* عشان تتعالج 💊.`,
m
)

const cooldown = 20 * 60 * 1000
const now = Date.now()

if (now < user.lastAdventure) {
const restante = user.lastAdventure - now
const wait = formatTime(restante)

return conn.reply(
m.chat,
`ꕥ لازم تنتظر *${wait}* عشان تستخدم *${usedPrefix + command}* تاني ⏳.`,
m
)
}

user.lastAdventure = now + cooldown

const evento = pickRandom(aventuras)

let monedas, experiencia, salud

if (evento.tipo === 'انتصار') {

monedas = Math.floor(Math.random() * 3001) + 15000
experiencia = Math.floor(Math.random() * 81) + 40
salud = Math.floor(Math.random() * 6) + 10

user.coin += monedas
user.exp += experiencia
user.health -= salud

} else if (evento.tipo === 'هزيمة') {

monedas = Math.floor(Math.random() * 2001) + 7000
experiencia = Math.floor(Math.random() * 41) + 40
salud = Math.floor(Math.random() * 6) + 10

user.coin -= monedas
user.exp -= experiencia
user.health -= salud

if (user.coin < 0) user.coin = 0
if (user.exp < 0) user.exp = 0

} else {

experiencia = Math.floor(Math.random() * 61) + 30
user.exp += experiencia

}

if (user.health < 0) user.health = 0

const resultado = `❀ ${evento.mensaje} ${
evento.tipo === 'نجاه'
? ''
: evento.tipo === 'انتصار'
? `🎉 فزت! *¥${monedas.toLocaleString()} ${currency}*`
: `💔 خسرت! *¥${monedas.toLocaleString()} ${currency}*`
}`

await conn.reply(m.chat, resultado, m)

await global.db.write()
}

handler.tags = ['economy']
handler.help = ['مغامره']
handler.command = ['adventure', 'مغامره', 'مغامرة']
handler.group = true

export default handler

function formatTime(ms) {

const totalSec = Math.ceil(ms / 1000)
const min = Math.floor((totalSec % 3600) / 60)
const sec = totalSec % 60

const txt = []

if (min > 0) txt.push(`${min} دقيقة`)

txt.push(`${sec} ثانية`)

return txt.join(' ')
}

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

const aventuras = [

{ tipo: 'انتصار', mensaje: '🗡️ هزمت غول في كمين بين أشجار دراكولونيا، وخرجت منتصرًا!' },
{ tipo: 'انتصار', mensaje: '🏆 أصبحت بطل بطولة المصارعين في فالوريا، تهانينا!' },
{ tipo: 'انتصار', mensaje: '📚 أنقذت كتابًا سحريًا من مذبح الهمسات، نجحت في المهمة!' },
{ tipo: 'انتصار', mensaje: '🏘️ حررت القرويين المحاصرين في مناجم أولديران بعد هزيمة التنانين الصغيرة، انتصرت!' },
{ tipo: 'انتصار', mensaje: '🐉 هزمت تنينًا صغيرًا على منحدرات فليمير، عمل رائع!' },
{ tipo: 'انتصار', mensaje: '🔮 وجدت تميمة مقدسة في أطلال إسكاريا وحميتها من السراق، نجحت!' },
{ tipo: 'انتصار', mensaje: '⚔️ انتصرت في مبارزة ضد الفارس الفاسد في إنفالون، أحسنت!' },
{ tipo: 'انتصار', mensaje: '🏰 غزوت الحصن الملعون لظلال الحمراء دون أي خسائر، انتصرت!' },
{ tipo: 'انتصار', mensaje: '🕯️ تسللت إلى معبد الفراغ واستعدت كريستال التوازن، مهمة ناجحة!' },
{ tipo: 'انتصار', mensaje: '🗝️ حللت لغز القبو الأبدي وحصلت على كنز أسطوري، مبروك!' },
{ tipo: 'انتصار', mensaje: '🦁 هزمت أسدًا ضخمًا في السهول الذهبية، انتصرت!' },
{ tipo: 'انتصار', mensaje: '🌋 أوقفت ثوران بركان نشط وأنقذت القرية، نجاح مذهل!' },
{ tipo: 'انتصار', mensaje: '🕷️ قتلت عنكبوتًا عملاقًا في الكهف المظلم، أحسنت!' },
{ tipo: 'انتصار', mensaje: '💎 اكتشفت جوهرة أسطورية في منجم مهجور، انتصرت!' },
{ tipo: 'انتصار', mensaje: '🛡️ دافعت عن قرية من هجوم قطاع الطرق، مهمة ناجحة!' },
{ tipo: 'انتصار', mensaje: '🦅 أنقذت عش نسر من الصيادين، تهانينا!' },
{ tipo: 'انتصار', mensaje: '⚡ هزمت ساحرًا شريرًا في البرج المظلم، نجاح كامل!' },
{ tipo: 'انتصار', mensaje: '🌌 اكتشفت بوابة النجوم القديمة في النفق السماوي، مبروك!' },
{ tipo: 'انتصار', mensaje: '🦄 أنقذت وحيد القرن المفقود من الصيادين، انتصرت!' },
{ tipo: 'انتصار', mensaje: '🗺️ اكتشفت خريطة كنز قديم في أطلال مهجورة، نجاح كبير!' },
{ tipo: 'انتصار', mensaje: '🏹 اصطدت غزالًا نادرًا في الغابة السحرية، تهانينا!' },
{ tipo: 'انتصار', mensaje: '🌊 أنقذت سفينة من الغرق أثناء العاصفة، نجاح كبير!' },
{ tipo: 'انتصار', mensaje: '🧝‍♂️ ساعدت الأقزام على استعادة كنوزهم المسروقة، انتصرت!' },
{ tipo: 'انتصار', mensaje: '🦖 هزمت ديناصورًا مفترسًا في الوادي القديم، نجاح كامل!' },
{ tipo: 'انتصار', mensaje: '🎨 اكتشفت لوحة سحرية تعطي قوة، مبروك على النجاح!' },
{ tipo: 'انتصار', mensaje: '🧿 كسرت تعويذة شريرة على القرية، انتصرت!' },
{ tipo: 'انتصار', mensaje: '🐲 ترويض تنين نادر، إنجاز أسطوري!' },
{ tipo: 'انتصار', mensaje: '🧙‍♂️ هزمت ساحر الغابة المظلمة، تهانينا!' },
{ tipo: 'انتصار', mensaje: '🛶 عبرت نهرًا هائجًا وأنقذت البحارة، نجاح رائع!' },
{ tipo: 'انتصار', mensaje: '🌠 وجدت حجر نجمي يمنح حظًا كبيرًا، انتصرت!' },

{ tipo: 'هزيمة', mensaje: '🌪️ هبت عاصفة قوية وأسقطتك من الجسر، خسرت.' },
{ tipo: 'هزيمة', mensaje: '🐺 هاجمك ذئب مفترس أثناء الليل، خسرت بعض الموارد.' },
{ tipo: 'هزيمة', mensaje: '🔥 حريق في الغابة أجبرك على الهرب، خسرت.' },
{ tipo: 'هزيمة', mensaje: '🪨 سقطة صخرة عملاقة أفسدت رحلتك، خسرت.' },
{ tipo: 'هزيمة', رسالة: '🧊 جليد زلق أوقعك في الوادي، خسرت بعض الأدوات.' },
{ tipo: 'هزيمة', رسالة: '🦈 هاجمك قرش أثناء السباحة، خسرت.' },
{ tipo: 'هزيمة', رسالة: '⚡ صاعقة أصابت معداتك أثناء العاصفة، خسرت.' },
{ tipo: 'هزيمة', رسالة: '🕸️ علقت في شبكة عنكبوت عملاق وفشلت في الهروب، خسرت.' },
{ tipo: 'هزيمة', رسالة: '🗡️ فشلت في مبارزة ضد لص ماهر، خسرت الأدوات.' },
{ tipo: 'هزيمة', رسالة: '🩸 تم خداعك بواسطة شبح في المقبرة، خسرت.' },
{ tipo: 'هزيمة', رسالة: '😈 ألقى الساحر المظلم لعنة عليك، فاضطررت للهرب وفقدت الموارد.' },
{ tipo: 'هزيمة', رسالة: '🌴 ضعت في غابة زاركليا وتعرضت لهجوم من اللصوص، خسرت بعض الأشياء.' },
{ tipo: 'هزيمة', رسالة: '🦎 صدمك البازيلسك وهربت جريحًا بدون أي غنيمة، خسرت.' },
{ tipo: 'هزيمة', رسالة: '❄️ فشلت محاولتك في برج الجليد عندما وقعت في فخ سحري، خسرت.' },
{ tipo: 'هزيمة', رسالة: '🌀 فقدت الاتجاه بين بوابات الغابة المرآة وانتهى بك المطاف بلا مكافأة، خسرت.' },

{ tipo: 'نجاه', mensaje: '🏞️ استكشفت واديًا مخفيًا وتعلمت تاريخه بدون مكافأة.' },
{ tipo: 'نجاه', mensaje: '🌳 تجولت في غابة كثيفة واستمتعت بالطبيعة بأمان.' },
{ tipo: 'نجاه', mensaje: '🛶 ركبت زورقًا في بحيرة هادئة، تجربة آمنة.' },
{ tipo: 'نجاه', mensaje: '🌌 لاحظت النجوم وتعلمت الأبراج بدون مخاطرة.' },
{ tipo: 'نجاه', mensaje: '🏔️ تسلقت تلًا صغيرًا واستمتعت بالمناظر بأمان.' },
{ tipo: 'نجاه', mensaje: '🦜 شاهدت طيورًا نادرة بدون مشاكل، تجربة آمنة.' },
{ tipo: 'نجاه', mensaje: '🌺 استكشفت حدائق مخفية وتعلمت النباتات، بلا مكافأة.' },
{ tipo: 'نجاه', mensaje: '🌾 عبرت حقولًا ممتدة واستمتعت بالمنظر، تجربة آمنة.' },
{ tipo: 'نجاه', mensaje: '🏯 دخلت قلعة مهجورة وتعرفت على تاريخها، بلا مكافأة.' },
{ tipo: 'نجاه', mensaje: '🛤️ تجولت على طريق قديم واكتشفت ذكريات الماضي، تجربة آمنة.' },
{ tipo: 'نجاه', mensaje: '🏛️ استكشفت أطلالًا قديمة وتعلمت أسرارًا مخفية بدون العثور على كنوز.' },
{ tipo: 'نجاه', mensaje: '🌫️ تابعت أثر شبح لكنه اختفى بين الضباب، بلا مكافأة.' },
{ tipo: 'نجاه', mensaje: '🏜️ رافقت أميرة عبر صحاري ثالوريا بدون أي مشاكل، تجربة آمنة.' }

]