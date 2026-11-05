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

import { addExif } from '../lib/sticker.js'

const handler = async (m, { conn, text }) => {
    try {
        if (!m.quoted) {
            return m.reply(
                `╭──────────────────────╮
│    ✦ NOX STICKER ✦
├──────────────────────┤
│
│ ❌ قم بالرد على ملصق أولاً.
│
│ مثال:
│ ↳ حقوق
│ ↳ حقوق Nox
│
╰──────────────────────╯`
            )
        }

        const mime = m.quoted.mimetype || ''

        if (!mime.includes('webp')) {
            return m.reply(
                `╭──────────────────────╮
│    ✦ NOX STICKER ✦
├──────────────────────┤
│
│ ❌ الرسالة التي رددت عليها
│ ليست ملصق WebP.
│
╰──────────────────────╯`
            )
        }

        const sticker = await m.quoted.download()

        if (!sticker || !Buffer.isBuffer(sticker)) {
            return m.reply('❌ تعذر تحميل الملصق.')
        }

        const botName = global.botname || 'Ｎｏｘ Ｂｏｔ'
        const dev = global.dev || 'Nox Developer'

        const author = text?.trim()
            ? `╭──────────────────────╮
│   ${botName}
├──────────────────────┤
│   ${text.trim()}
╰──────────────────────╯`
            : `╭──────────────────────╮
│   ${botName}
├──────────────────────┤
│   ✦ ${dev}
│   ✦ Nox Bot
╰──────────────────────╯`

        const result = await addExif(
            sticker,
            botName,
            author
        )

        if (!result || !Buffer.isBuffer(result)) {
            throw new Error('تعذر إنشاء الملصق الجديد.')
        }

        await conn.sendMessage(
            m.chat,
            {
                sticker: result
            },
            {
                quoted: m
            }
        )

    } catch (error) {
        console.error('❌ Nox Rights Error:', error)

        return m.reply(
            `❌ تعذر إكمال العملية

${error?.message || 'حدث خطأ غير معروف'}`
        )
    }
}

handler.help = ['حقوق <نص>']
handler.tags = ['sticker']
handler.command = ['حقوق', 'rights']

export default handler