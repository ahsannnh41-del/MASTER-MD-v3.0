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
            exp: 0,
            coin: 0,
            health: 100,
            lastwork: 0
        }

        user = global.db.data.users[m.sender]
    }

    
    user.coin = Number(user.coin) || 0
    user.exp = Number(user.exp) || 0
    user.health = Number(user.health) || 100
    user.lastwork = Number(user.lastwork) || 0

    
    const cooldown = 2 * 60 * 1000
    const now = Date.now()

    
    if (now < user.lastwork) {
        const remaining = formatTime(user.lastwork - now)

        return conn.reply(
            m.chat,
            `⏳ لازم تستنى *${remaining}* قبل ما تستخدم *${usedPrefix + command}* مرة تانية.`,
            m
        )
    }

    
    const reward = Math.floor(Math.random() * 1501) + 2000

    
    const job = pickRandom(jobs)

    
    user.lastwork = now + cooldown
    user.coin += reward

    
    return conn.reply(
        m.chat,
        `「✦」 *العمل* 💼\n\n` +
        `${job} *¥${reward.toLocaleString()} ${global.currency || '¥'}* 💰\n\n` +
        `👛 رصيدك الآن: *${user.coin.toLocaleString()} ${global.currency || '¥'}*`,
        m
    )
}

handler.help = ['عمل']
handler.tags = ['economy']
handler.command = ['work', 'اعمل', 'اشتغل', 'عمل']
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


const jobs = [
    '🍪 عملت في مخبز وحصلت على',
    '🎮 طورت لعبة صغيرة وحصلت على',
    '💼 اشتغلت ساعات إضافية في المكتب وحصلت على',
    '🧹 ساعدت في تنظيف مكان كبير وحصلت على',
    '🛒 اشتغلت في متجر وحصلت على',
    '👨‍🍳 اشتغلت كطباخ وحصلت على',
    '🍕 ساعدت في مطعم وحصلت على',
    '🥠 كتبت رسائل لطيفة وحصلت على',
    '🎒 رتبت أغراضك القديمة وبعت بعضها وحصلت على',
    '🎨 صممت شعارًا لشركة وحصلت على',
    '🖨️ اشتغلت في مطبعة وحصلت على',
    '🌳 ساعدت في ترتيب حديقة وحصلت على',
    '🎙️ اشتغلت كممثل صوتي وحصلت على',
    '🌾 ساعدت في مزرعة وحصلت على',
    '🏖️ صنعت أشكالًا رملية على الشاطئ وحصلت على',
    '🎨 اشتغلت كفنان شارع وحصلت على',
    '❤️ ساعدت في عمل خيري وتمت مكافأتك بـ',
    '🐍 ساعدت في رعاية الحيوانات وحصلت على',
    '🐼 اشتغلت في فعالية ترفيهية وحصلت على',
    '🕹️ أصلحت أجهزة ألعاب وحصلت على',
    '🏙️ عملت شغلًا مؤقتًا في المدينة وحصلت على',
    '🧪 ساعدت في مختبر وحصلت على',
    '🦁 عملت مع فريق رعاية الحيوانات وحصلت على',
    '🐟 بعت مأكولات بحرية وحصلت على',
    '🚕 اشتغلت سائقًا وحصلت على',
    '🚌 اشتغلت في المواصلات وحصلت على',
    '🥙 اشتغلت في مطعم وحصلت على',
    '🧆 بعت أكلًا في السوق وربحت',
    '🍞 اشتغلت في مخبز وحصلت على',
    '☕ اشتغلت في مقهى وحصلت على',
    '🚚 اشتغلت في توصيل الطلبات وحصلت على',
    '📱 اشتغلت في محل موبايلات وحصلت على',
    '🔧 اشتغلت في الصيانة وحصلت على',
    '💡 اشتغلت في الكهرباء وحصلت على',
    '🧱 اشتغلت في البناء وحصلت على',
    '🧹 اشتغلت في النظافة وحصلت على',
    '🧺 اشتغلت في مغسلة وحصلت على',
    '🚲 اشتغلت في توصيل الطلبات وحصلت على',
    '📦 رتبت البضائع في مخزن وحصلت على',
    '🛍️ اشتغلت بائعًا في متجر وحصلت على',
    '🍗 اشتغلت في مطعم وحصلت على',
    '🍔 اشتغلت في مطعم برجر وحصلت على',
    '🧑‍🌾 اشتغلت في الزراعة وحصلت على',
    '🐑 ساعدت في رعاية الأغنام وحصلت على',
    '🛵 اشتغلت مندوب توصيل وحصلت على',
    '🎤 اشتغلت في تنظيم حفلة وحصلت على',
    '📸 اشتغلت كمصور وحصلت على',
    '🎶 شاركت في فعالية موسيقية وحصلت على',
    '🧿 بعت منتجات في السوق وربحت',
    '🏪 اشتغلت في متجر صغير وحصلت على',
    '🍉 بعت الفاكهة في السوق وربحت',
    '🥭 بعت الفاكهة وربحت',
    '🐟 اشتغلت صيادًا وحصلت على',
    '🚧 ساعدت في موقع بناء وحصلت على'
]