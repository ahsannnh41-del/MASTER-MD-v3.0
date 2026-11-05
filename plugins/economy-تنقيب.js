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

    if (m.isGroup && !global.db.data.chats[m.chat]?.economy) {
        return m.reply(
            `❌《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة 😴\n\n` +
            `🛠️ يمكن لأحد المشرفين تفعيلها باستخدام الأمر:\n` +
            `» *${usedPrefix}economy on* ✅`
        )
    }

    let user = global.db.data.users[m.sender]

    if (!user) {
        user = global.db.data.users[m.sender] = {
            exp: 0,
            coin: 0,
            health: 100,
            lastmine: 0,
            pickaxedurability: 100
        }
    }

    user.coin = Number(user.coin) || 0
    user.exp = Number(user.exp) || 0
    user.health = Number(user.health) || 100
    user.lastmine = Number(user.lastmine) || 0
    user.pickaxedurability = Number(user.pickaxedurability) || 100

    if (user.health < 5) {
        return conn.reply(
            m.chat,
            `⚠️ ꕥ صحتك مش كفاية عشان ترجع *تتنقّب* ⛏️.\n` +
            `> استخدم *${usedPrefix}عالج* 💊 عشان تعالج نفسك.`,
            m
        )
    }

    const cooldown = 10 * 60 * 1000
    const now = Date.now()

    if (now < user.lastmine) {
        return conn.reply(
            m.chat,
            `⏳ ꕥ لازم تنتظر *${formatTime(user.lastmine - now)}* ` +
            `قبل ما تستخدم *${usedPrefix + command}* مرة تانية 🔁`,
            m
        )
    }

    user.lastmine = now + cooldown

    const event = randomEvent()

    let coins
    let exp
    let health

    if (event.type === 'win') {

        coins = Math.floor(Math.random() * 2001) + 7000
        exp = Math.floor(Math.random() * 91) + 10
        health = Math.floor(Math.random() * 3) + 1

        user.coin += coins
        user.exp += exp
        user.health -= health

    } else {

        coins = Math.floor(Math.random() * 2001) + 3000
        exp = Math.floor(Math.random() * 41) + 10
        health = Math.floor(Math.random() * 5) + 1

        user.coin -= coins
        user.exp -= exp
        user.health -= health

        if (user.coin < 0) user.coin = 0
        if (user.exp < 0) user.exp = 0
    }

    if (user.health < 0) user.health = 0

    let currencyName = 'كوين'

    try {
        if (typeof currency !== 'undefined' && currency) {
            currencyName = currency
        }
    } catch {}

    const text =
        `❀ ${event.message}\n\n` +
        `💰 *¥${coins.toLocaleString()} ${currencyName}*`

    await conn.reply(m.chat, text, m)
}

handler.help = ['تنقيب']
handler.tags = ['economy']
handler.command = ['تنقيب', 'نقب', 'miming']
handler.group = true

export default handler


function formatTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    if (minutes > 0) {
        return `${minutes} دقيقة و ${seconds} ثانية`
    }

    return `${seconds} ثانية`
}


function randomEvent() {
    return events[Math.floor(Math.random() * events.length)]
}


const events = [

    {
        type: 'win',
        message: '🪙 اكتشفت وريدًا من الذهب بين الصخور وتمكنت من استخراجه بنجاح، لقد فزت 🥳'
    },

    {
        type: 'win',
        message: '💎 وجدت غرفة سرية مليئة بالجواهر المخفية منذ سنوات، لقد فزت 🎉'
    },

    {
        type: 'win',
        message: '⛏️ وجدت أدوات تعدين قديمة ساعدتك في استخراج كنز ثمين، لقد فزت 💪'
    },

    {
        type: 'win',
        message: '🏺 حفرت نفقًا منسيًا ووجدت صندوقًا يحتوي على معادن نادرة، لقد فزت 🏆'
    },

    {
        type: 'win',
        message: '🔮 وجدت كهفًا مليئًا بالبلورات اللامعة وبداخله كنز مخفي، لقد فزت ✨'
    },

    {
        type: 'win',
        message: '🗿 حللت لغزًا قديمًا وفتحت غرفة مليئة بالزمرد، لقد فزت 🌟'
    },

    {
        type: 'win',
        message: '👷 تعاونت مع مستكشفين آخرين وتقاسمت معهم كنزًا نادرًا، لقد فزت 🌈'
    },

    {
        type: 'win',
        message: '🌕 بعد ساعات من الحفر وجدت غرفة مليئة بحجارة القمر، لقد فزت 🌙'
    },

    {
        type: 'win',
        message: '💰 ضرب معولك صندوقًا معدنيًا قديمًا مليئًا بالعملات، لقد فزت 💎'
    },

    {
        type: 'win',
        message: '📜 اتبعت خريطة قديمة ووصلت إلى مكان مليء بالياقوت، لقد فزت 🔴'
    },

    {
        type: 'win',
        message: '🪨 اكتشفت معدنًا فضيًا نادرًا بين الصخور، لقد فزت 🥳'
    },

    {
        type: 'win',
        message: '🧭 وجدت خريطة تقود إلى كنز مخفي في أعماق الجبل، لقد فزت 🎉'
    },

    {
        type: 'win',
        message: '🔦 اكتشفت نفقًا مظلمًا مليئًا بالزمرد، لقد فزت 💎'
    },

    {
        type: 'win',
        message: '🛡️ ساعدت مجموعة من المستكشفين في العثور على كنز قديم، لقد فزت 🏆'
    },

    {
        type: 'win',
        message: '🔥 اكتشفت منطقة بركانية تحتوي على معادن نادرة، لقد فزت ✨'
    },

    {
        type: 'win',
        message: '🪓 طورت طريقة جديدة للتنقيب وساعدتك على استخراج كنز ثمين، لقد فزت 🌟'
    },

    {
        type: 'win',
        message: '🏔️ تسلقت الجبل واكتشفت مغارة مليئة بالذهب، لقد فزت 🌈'
    },

    {
        type: 'win',
        message: '🌌 عثرت على حجر نيزكي نادر داخل الكهف، لقد فزت 🌙'
    },

    {
        type: 'win',
        message: '💎 اكتشفت قلادة قديمة مزينة بالأحجار الكريمة، لقد فزت 💎'
    },

    {
        type: 'win',
        message: '📦 عثرت على صندوق مهجور يحتوي على كنوز قديمة، لقد فزت 🔴'
    },

    {
        type: 'lose',
        message: '💨 حدث انهيار صغير وأضاع عليك بعض المعادن الثمينة، خسرت 😢'
    },

    {
        type: 'lose',
        message: '🔥 اندلعت شرارة داخل النفق وأتلفت جزءًا من الغنيمة، خسرت 💔'
    },

    {
        type: 'lose',
        message: '🌊 تسربت المياه إلى الكهف وضاعت بعض المعادن، خسرت 😞'
    },

    {
        type: 'lose',
        message: '🕷️ ظهر عنكبوت ضخم وأجبرك على إيقاف التنقيب، خسرت ⚡'
    },

    {
        type: 'lose',
        message: '💨 هبت رياح قوية وأبعدتك عن مدخل الكهف، خسرت 😞'
    },

    {
        type: 'lose',
        message: '🛠️ انكسرت أدواتك قبل اكتشاف المعدن الثمين، خسرت 😢'
    },

    {
        type: 'lose',
        message: '💥 حدث انفجار مفاجئ داخل النفق وفقدت جزءًا من الغنيمة، خسرت 💔'
    },

    {
        type: 'lose',
        message: '🪨 انهار جزء من الكهف وضاعت معادنك، خسرت 😞'
    },

    {
        type: 'lose',
        message: '🦇 هاجمتك الخفافيش وأجبرتك على مغادرة الكهف، خسرت ⚡'
    },

    {
        type: 'lose',
        message: '⚠️ فخ قديم أتلف حقيبتك وفقدت عدة جواهر، خسرت 😞'
    }

]