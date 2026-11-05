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

const handler = async (m, { conn, command, usedPrefix }) => {
    const db = global.db

    
    if (m.isGroup) {
        if (!db.data.chats[m.chat]) {
            db.data.chats[m.chat] = {}
        }

        if (!db.data.chats[m.chat].economy) {
            return m.reply(
                `《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة ❌\n\n` +
                `👮‍♂️ يمكن لأحد المشرفين تفعيلها باستخدام الأمر:\n` +
                `» *${usedPrefix}economy on* ✅`
            )
        }
    }

    
    if (!db.data.users[m.sender]) {
        db.data.users[m.sender] = {
            coin: 0,
            exp: 0,
            lastFish: 0
        }
    }

    const user = db.data.users[m.sender]

    
    if (typeof user.coin !== 'number' || isNaN(user.coin)) {
        user.coin = 0
    }

    if (typeof user.exp !== 'number' || isNaN(user.exp)) {
        user.exp = 0
    }

    if (typeof user.lastFish !== 'number' || isNaN(user.lastFish)) {
        user.lastFish = 0
    }

    const cooldown = 12 * 60 * 1000
    const now = Date.now()

    
    if (now < user.lastFish) {
        const remaining = user.lastFish - now
        const wait = formatTime(remaining)

        return conn.reply(
            m.chat,
            `⏳ ꕥ لازم تنتظر *${wait}* قبل ما تستخدم الأمر *${usedPrefix + command}* مرة تانية 🔁`,
            m
        )
    }

    
    user.lastFish = now + cooldown

    
    const evento = pickRandom(eventos)

    let monedas = 0
    let experiencia = 0

    if (evento.tipo === 'انتصار') {
        monedas = Math.floor(Math.random() * 2001) + 11000
        experiencia = Math.floor(Math.random() * 61) + 30

        user.coin += monedas
        user.exp += experiencia
    } else {
        monedas = Math.floor(Math.random() * 2001) + 5000
        experiencia = Math.floor(Math.random() * 31) + 30

        user.coin -= monedas
        user.exp -= experiencia

        if (user.coin < 0) user.coin = 0
        if (user.exp < 0) user.exp = 0
    }

    const currencyName = global.currency || 'كوين'

    const resultado =
        `🎣 *Ｎｏｘ Ｂｏｔ* 🎣\n\n` +
        `❀ ${evento.mensaje}\n\n` +
        `${evento.tipo === 'انتصار' ? '🎉' : '💔'} ` +
        `المكافأة: *¥${monedas.toLocaleString()} ${currencyName}*\n` +
        `✨ الخبرة: *+${experiencia} EXP*`

    await conn.reply(m.chat, resultado, m)

    
    if (typeof db.write === 'function') {
        await db.write()
    }
}

handler.help = ['صيد']
handler.tags = ['economy']
handler.command = ['صيد', 'fishing', 'صياد']
handler.group = true

export default handler

function formatTime(ms) {
    if (!ms || ms <= 0 || isNaN(ms)) {
        return 'الآن'
    }

    const totalSec = Math.ceil(ms / 1000)
    const min = Math.floor(totalSec / 60)
    const sec = totalSec % 60

    const parts = []

    if (min > 0) {
        parts.push(`${min} دقيقة`)
    }

    parts.push(`${sec} ثانية`)

    return parts.join(' ')
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

const eventos = [
    { tipo: 'انتصار', mensaje: '🎣 لقد اصطدت سلمون! طعمه لذيذ، لقد فزت 🥳' },
    { tipo: 'انتصار', mensaje: '🐟 لقد اصطدت تروتة! طازجة وممتازة، لقد فزت 🎉' },
    { tipo: 'انتصار', mensaje: '🦈 لقد اصطدت سمكة قرش! كانت مغامرة قوية، لقد فزت 💪' },
    { tipo: 'انتصار', mensaje: '🐋 مذهل! اصطدت حوتًا نادرًا، لقد فزت 🌊' },
    { tipo: 'انتصار', mensaje: '🐠 لقد اصطدت سمكة مهرج ملونة، لقد فزت 🌈' },
    { tipo: 'انتصار', mensaje: '🐟 اصطدت سمكة ضخمة! الجهد كان يستحق، لقد فزت 🏆' },
    { tipo: 'انتصار', mensaje: '🐙 لقد اصطدت أخطبوطًا نادرًا، لقد فزت 🌀' },
    { tipo: 'انتصار', mensaje: '🐉 لقد حصلت على سمكة تنين أسطورية، لقد فزت 🐲' },
    { tipo: 'انتصار', mensaje: '🦑 لقد اصطدت حبارًا عملاقًا، لقد فزت 🌀' },
    { tipo: 'انتصار', mensaje: '🐬 لقد اصطدت سمكة نادرة بالقرب من الشاطئ، لقد فزت 🌊' },
    { tipo: 'انتصار', mensaje: '🐡 اصطدت سمكة نادرة جدًا، حظك ممتاز اليوم ☠️' },
    { tipo: 'انتصار', mensaje: '🦀 التقطت سلطعونًا ضخمًا، لقد فزت 🏆' },
    { tipo: 'انتصار', mensaje: '🦞 أمسكّت جراد البحر الأحمر، لقد فزت 🍴' },
    { tipo: 'انتصار', mensaje: '🐟 اصطدت سمكة ذهبية نادرة، حظ رائع 🌟' },
    { tipo: 'انتصار', mensaje: '🐠 اصطدت مجموعة من الأسماك الملونة، لقد فزت 🌈' },
    { tipo: 'انتصار', mensaje: '🦈 اصطدت قرشًا صغيرًا، كانت مغامرة سريعة ⚡' },
    { tipo: 'انتصار', mensaje: '🦐 اصطدت جمبريًا كبيرًا، لقد فزت 🍤' },
    { tipo: 'انتصار', mensaje: '🐙 اصطدت أخطبوطًا صغيرًا، لقد فزت 🌀' },
    { tipo: 'انتصار', mensaje: '🐠 اصطدت سمكة فانتازية نادرة، لقد فزت 🌈' },
    { tipo: 'انتصار', mensaje: '🦀 التقطت سلطعونًا أزرق نادرًا، لقد فزت 💎' },
    { tipo: 'انتصار', mensaje: '🐟 اصطدت تونة كبيرة وسريعة، لقد فزت 🏃‍♂️' },
    { tipo: 'انتصار', mensaje: '🐠 اصطدت سمكة ملونة نادرة جدًا، لقد فزت 🌟' },

    { tipo: 'هزيمة', mensaje: '🐡 السمكة أفلتت منك قبل الإمساك بها، خسرت ☠️' },
    { tipo: 'هزيمة', mensaje: '🦀 السلطعون هرب بين الصخور، خسرت 🏃‍♂️' },
    { tipo: 'هزيمة', mensaje: '🦞 جراد البحر اختفى بين الأعشاب، خسرت 🌿' },
    { tipo: 'هزيمة', mensaje: '🐠 السمك الصغير تفرق وهرب، خسرت 😢' },
    { tipo: 'هزيمة', mensaje: '🎣 الطُعم اختفى بدون أن تصطاد شيئًا، خسرت 😞' },
    { tipo: 'هزيمة', mensaje: '🐟 انفلتت السمكة الكبيرة عند السطح، خسرت 💦' },
    { tipo: 'هزيمة', mensaje: '🦑 الحبار هرب فجأة، خسرت 🌀' },
    { tipo: 'هزيمة', mensaje: '🦈 القرش ابتعد بسرعة، خسرت ⚡' },
    { tipo: 'هزيمة', mensaje: '🐋 الحوت غاص بعيدًا إلى الأعماق، خسرت 🌊' },
    { tipo: 'هزيمة', mensaje: '🦐 الجمبري قفز من الصنارة، خسرت 🍤' },
    { tipo: 'هزيمة', mensaje: '🐟 السمكة الذهبية أفلتت منك، خسرت 🌟' },
    { tipo: 'هزيمة', mensaje: '🐠 السمكة الملونة اختفت بين الصخور، خسرت 🌈' },
    { tipo: 'هزيمة', mensaje: '🦀 السلطعون الأزرق رجع للبحر، خسرت 💎' },
    { tipo: 'هزيمة', mensaje: '🐡 السمكة الكبيرة هربت، خسرت 🍽️' },
    { tipo: 'هزيمة', mensaje: '🦑 الحبار الملون اختفى فجأة، خسرت 🎨' },
    { tipo: 'هزيمة', mensaje: '🐟 التونة الكبيرة ابتعدت، خسرت 🏃‍♂️' },
    { tipo: 'هزيمة', mensaje: '🐠 السمكة النادرة هربت قبل الإمساك بها، خسرت 🌟' },
    { tipo: 'هزيمة', mensaje: '🎣 خط الصيد انقطع فجأة، خسرت ⚡' },
    { tipo: 'هزيمة', mensaje: '🌊 لم تصطد شيئًا هذه المرة، خسرت 😞' },
    { tipo: 'هزيمة', mensaje: '🎣 الطُعم انجذب بعيدًا ولم تصطد أي سمكة، خسرت 😢' },
    { tipo: 'هزيمة', mensaje: '🐬 اختفت السمكة بين الأمواج، خسرت 🌊' },
    { tipo: 'هزيمة', mensaje: '🗑️ اصطدت شيئًا غريبًا بدل السمك، خسرت 😢' }
]