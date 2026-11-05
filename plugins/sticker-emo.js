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

import fetch from 'node-fetch'

function emojiToUnicode(emoji) {
    if (!emoji) return null

    return Array.from(emoji)
        .map(char => char.codePointAt(0).toString(16))
        .filter(hex => hex !== 'fe0f')
        .join('_')
}

let handler = async (m, { conn, text, usedPrefix, command }) => {

    const react = async (emoji) => {
        try {
            await conn.sendMessage(
                m.chat,
                {
                    react: {
                        text: emoji,
                        key: m.key
                    }
                }
            )
        } catch {}
    }

    if (!text) {

        await react('⚠️')

        return m.reply(
`MASTER MD 〢 𝙴𝙼𝙾𝙹𝙸

📌 الاستخدام:
${usedPrefix}${command} <الإيموجي>

💡 مثال:
${usedPrefix}${command} 😳`
        )
    }

    const emoji = text.trim().split(' ')[0]

    await react('⏳')

    try {

        const unicode = emojiToUnicode(emoji)

        if (!unicode) {

            await react('❌')

            return m.reply(
                'MASTER MD 〢 ❌ يرجى إرسال إيموجي صحيح.'
            )
        }

        const url =
            `https://fonts.gstatic.com/s/e/notoemoji/latest/${unicode}/512.webp`

        const res = await fetch(url)

        if (!res.ok) {

            await react('❌')

            return m.reply(
                'MASTER MD 〢 ❌ فشل جلب الإيموجي، جرب إيموجي آخر.'
            )
        }

        const buffer =
            Buffer.from(await res.arrayBuffer())

        if (typeof conn.sendFile === 'function') {

            await conn.sendFile(
                m.chat,
                buffer,
                'sticker.webp',
                '',
                m,
                true,
                {
                    packname:
                        global.packname ||
                        'MASTER MD',

                    author:
                        global.author ||
                        'AHSAN (03107260507)'
                }
            )

        } else {

            await conn.sendMessage(
                m.chat,
                {
                    sticker: buffer
                },
                {
                    quoted: m
                }
            )
        }

        await react('✅')

    } catch (error) {

        console.error(
            'NOX EMOJI ERROR:',
            error
        )

        await react('❌')

        return m.reply(
`MASTER MD 〢 𝙴𝙼𝙾𝙹𝙸

❌ حدث خطأ أثناء تحويل الإيموجي.

⚠️ ${error.message}`
        )
    }
}

handler.help = [
    'ايموجي <ايموجي>'
]

handler.tags = [
    'sticker',
    'tools'
]

handler.command =
    /^(ايموجي|ايمو|emoji)$/i

export default handler