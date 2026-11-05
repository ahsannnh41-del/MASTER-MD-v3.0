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

import { delay } from '@whiskeysockets/baileys'

const handler = async (m, { args, usedPrefix, command, conn }) => {

    
    if (m.isGroup && !global.db.data.chats[m.chat]?.economy) {
        return m.reply(
`《✦》أوامر *الاقتصاد* معطّلة في هذه المجموعة ❌

يمكن لأحد المشرفين تفعيلها باستخدام الأمر:
» *${usedPrefix}economy on* ✅`
        )
    }

    
    const users = global.db.data.users[m.sender]

    if (!users) {
        return m.reply('❌ لم يتم العثور على بيانات حسابك في الاقتصاد.')
    }

    
    users.coin = Number(users.coin) || 0
    users.exp = Number(users.exp) || 0
    users.lastslot = Number(users.lastslot) || 0

    
    if (!args[0] || isNaN(args[0])) {
        return m.reply(
`❗ أدخل المبلغ الذي تريد المراهنة به.

مثال:
*${usedPrefix + command} 1000*`
        )
    }

    const apuesta = parseInt(args[0])

    if (apuesta <= 0) {
        return m.reply('❌ يجب أن يكون مبلغ الرهان أكبر من صفر.')
    }

    
    if (apuesta < 100) {
        return m.reply(
`💰 الحد الأدنى للرهان هو *100 ${currency}*.`
        )
    }

    
    if (users.coin < apuesta) {
        return m.reply(
`❌ رصيدك غير كافٍ.

💰 رصيدك: *${users.coin.toLocaleString()} ${currency}*
🎯 الرهان: *${apuesta.toLocaleString()} ${currency}*`
        )
    }

    
    const cooldown = 10 * 1000
    const now = Date.now()

    if (now - users.lastslot < cooldown) {

        const remaining = users.lastslot + cooldown - now

        return m.reply(
`⏳ انتظر *${formatTime(remaining)}* قبل استخدام الرهان مرة أخرى.`
        )
    }

    
    const emojis = ['✾', '❃', '❁']

    const getRandomEmojis = () => {

        return {
            x: Array.from(
                { length: 3 },
                () => emojis[Math.floor(Math.random() * emojis.length)]
            ),

            y: Array.from(
                { length: 3 },
                () => emojis[Math.floor(Math.random() * emojis.length)]
            ),

            z: Array.from(
                { length: 3 },
                () => emojis[Math.floor(Math.random() * emojis.length)]
            )
        }
    }

    
    const initialText =
`「✿」 *Nox Roulette*
────────────
🎰 جاري تشغيل الرهان...
────────────`

    const sent = await conn.sendMessage(
        m.chat,
        { text: initialText },
        { quoted: m }
    )

    const key = sent.key

    
    for (let i = 0; i < 5; i++) {

        const { x, y, z } = getRandomEmojis()

        const animationText =
`「✿」 *Nox Roulette*
────────────
${x[0]} : ${y[0]} : ${z[0]}
${x[1]} : ${y[1]} : ${z[1]}
${x[2]} : ${y[2]} : ${z[2]}
────────────
🎰 جاري الدوران...`

        await conn.sendMessage(
            m.chat,
            {
                text: animationText,
                edit: key
            }
        )

        await delay(300)
    }

    
    const { x, y, z } = getRandomEmojis()

    let resultado
    let premio = 0

    if (x[0] === y[0] && y[0] === z[0]) {

        premio = apuesta * 2

        users.coin += premio

        resultado =
`🎉 *فوز كبير!*

💰 ربحت:
*+${premio.toLocaleString()} ${currency}*`

    } else if (
        x[0] === y[0] ||
        x[0] === z[0] ||
        y[0] === z[0]
    ) {

        premio = 10

        users.coin += premio

        resultado =
`✨ *قريب جدًا!*

🎁 تعويض المحاولة:
*+${premio} ${currency}*`

    } else {

        users.coin -= apuesta

        if (users.coin < 0)
            users.coin = 0

        resultado =
`😢 *لم يحالفك الحظ!*

💸 خسرت:
*-${apuesta.toLocaleString()} ${currency}*`
    }

    
    users.lastslot = Date.now()

    
    const finalText =
`「✿」 *Nox Roulette*
────────────
${x[0]} : ${y[0]} : ${z[0]}
${x[1]} : ${y[1]} : ${z[1]}
${x[2]} : ${y[2]} : ${z[2]}
────────────
${resultado}
────────────
💰 رصيدك:
*${users.coin.toLocaleString()} ${currency}*`

    await conn.sendMessage(
        m.chat,
        {
            text: finalText,
            edit: key
        }
    )
}

handler.help = ['رهان']
handler.tags = ['economy']
handler.command = ['slot', 'رهان', 'راهن']
handler.group = true

export default handler

function formatTime(ms) {

    const totalSec = Math.ceil(ms / 1000)

    const minutes = Math.floor(
        (totalSec % 3600) / 60
    )

    const seconds = totalSec % 60

    const parts = []

    if (minutes > 0)
        parts.push(`${minutes} دقيقة`)

    parts.push(`${seconds} ثانية`)

    return parts.join(' ')
}