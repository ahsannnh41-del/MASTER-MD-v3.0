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

const handler = async (m, { conn, usedPrefix, command }) => {

    if (m.isGroup && !global.db.data.chats[m.chat]?.economy) {
        return m.reply(
            `《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة ❌\n\n` +
            `يمكن *لأحد المشرفين* تفعيلها باستخدام الأمر:\n` +
            `» *${usedPrefix}economy on* ✅`
        )
    }

    let user = global.db.data.users[m.sender]

    if (!user) {
        global.db.data.users[m.sender] = {
            coin: 0,
            exp: 0,
            lastslut: 0
        }

        user = global.db.data.users[m.sender]
    }

    user.coin = Number(user.coin) || 0
    user.exp = Number(user.exp) || 0
    user.lastslut = Number(user.lastslut) || 0

    const cooldown = 5 * 60 * 1000
    const now = Date.now()

    if (now < user.lastslut) {
        const remaining = formatTime(user.lastslut - now)

        return conn.reply(
            m.chat,
            `⏳ لازم تستنى *${remaining}* قبل ما تستخدم الأمر *${usedPrefix + command}* مرة تانية.`,
            m
        )
    }

    const event = pickRandom(events)

    let amount

    if (event.type === 'win') {
        amount = Math.floor(Math.random() * 1501) + 4000
        user.coin += amount
        user.exp += Math.floor(Math.random() * 21) + 10
    } else {
        amount = Math.floor(Math.random() * 1001) + 3000
        user.coin -= amount

        if (user.coin < 0) {
            user.coin = 0
        }
    }

    user.lastslut = now + cooldown

    const currency = global.currency || '¥'

    const message =
        `「✦」 *مهمة عشوائية* 🎲\n\n` +
        `${event.message}\n\n` +
        `${event.type === 'win' ? '💰 ربحت' : '💸 خسرت'} *${amount.toLocaleString()} ${currency}*`

    return conn.reply(m.chat, message, m)
}

handler.help = ['عمل2']
handler.tags = ['economy']
handler.command = ['work2', 'اعمل2', 'اشتغل2', 'عمل2']
handler.group = true

export default handler


function formatTime(ms) {
    const totalSec = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSec / 60)
    const seconds = totalSec % 60

    const parts = []

    if (minutes > 0) {
        parts.push(`${minutes} دقيقة`)
    }

    if (seconds > 0 || parts.length === 0) {
        parts.push(`${seconds} ثانية`)
    }

    return parts.join(' ')
}


function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}


const events = [

    { type: 'win', message: '🎮 طورت لعبة صغيرة وبعتها لأحد العملاء، وحصلت على مكافأة.' },
    { type: 'win', message: '📦 ساعدت في ترتيب مستودع كبير وحصلت على أجر إضافي.' },
    { type: 'win', message: '🍔 اشتغلت في مطعم خلال وقت الذروة وحصلت على مكافأة.' },
    { type: 'win', message: '🚗 ساعدت شخصًا في إصلاح سيارته وحصلت على مقابل جيد.' },
    { type: 'win', message: '📱 أصلحت هاتفًا معطلًا وحصلت على مبلغ محترم.' },
    { type: 'win', message: '🎨 صممت شعارًا لشخص وأعجبته النتيجة، فدفع لك مكافأة.' },
    { type: 'win', message: '📸 صورت مناسبة صغيرة وحصلت على أجر ممتاز.' },
    { type: 'win', message: '🌱 ساعدت في مزرعة طوال اليوم وحصلت على أجرك.' },
    { type: 'win', message: '🛠️ أصلحت بعض الأدوات القديمة وبعتها بسعر جيد.' },
    { type: 'win', message: '🚚 ساعدت في توصيل مجموعة من الطلبات وحصلت على مكافأة.' },
    { type: 'win', message: '💻 ساعدت شخصًا في حل مشكلة في جهاز الكمبيوتر وحصلت على أجر.' },
    { type: 'win', message: '🏪 اشتغلت في متجر لبضع ساعات وحصلت على مكافأة.' },
    { type: 'win', message: '🎯 أنجزت مهمة صعبة بدقة وحصلت على مكافأة إضافية.' },
    { type: 'win', message: '📚 ساعدت طالبًا في ترتيب ملاحظاته وحصلت على أجر.' },
    { type: 'win', message: '🧹 نظفت مكانًا كبيرًا بسرعة وحصلت على مكافأة.' },

    { type: 'lose', message: '📦 أسقطت بعض الصناديق أثناء العمل وتسببت في خسارة بسيطة.' },
    { type: 'lose', message: '🚲 تعطلت وسيلة النقل أثناء المهمة وخسرت جزءًا من أجرك.' },
    { type: 'lose', message: '🌧️ بدأ المطر فجأة وأفسد جزءًا من المهمة.' },
    { type: 'lose', message: '📱 تعطل جهازك أثناء العمل واضطررت لدفع تكلفة الإصلاح.' },
    { type: 'lose', message: '🛠️ انكسرت إحدى أدواتك أثناء تنفيذ المهمة.' },
    { type: 'lose', message: '📦 ضاعت بعض البضاعة أثناء التوصيل وتم خصم قيمتها منك.' },
    { type: 'lose', message: '🍔 أخطأت في أحد الطلبات واضطررت لتعويض العميل.' },
    { type: 'lose', message: '💻 حدث خطأ في جهاز الكمبيوتر واضطررت لدفع تكلفة الإصلاح.' },
    { type: 'lose', message: '🚗 تأخرت عن موعد المهمة ولم تحصل على كامل أجرك.' },
    { type: 'lose', message: '🏪 لم تنجح في إنهاء المهمة المطلوبة وخسرت جزءًا من المال.' },
    { type: 'lose', message: '🎨 لم يعجب العميل بالعمل وخصم جزءًا من المبلغ.' },
    { type: 'lose', message: '📸 نسيت بعض معدات التصوير واضطررت لدفع تكلفة إضافية.' },
    { type: 'lose', message: '🌱 أتلفت بعض الأدوات أثناء العمل وخسرت جزءًا من المال.' },
    { type: 'lose', message: '🚚 ضللت الطريق أثناء التوصيل وتأخرت عن المهمة.' },
    { type: 'lose', message: '😵 تعبت أثناء المهمة ولم تستطع إكمالها بالكامل.' }
]