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

import translate from '@vitalets/google-translate-api'

const languages = [
    ['ar', '🇸🇦 العربية'],
    ['en', '🇺🇸 الإنجليزية'],
    ['fr', '🇫🇷 الفرنسية'],
    ['es', '🇪🇸 الإسبانية'],
    ['de', '🇩🇪 الألمانية'],
    ['it', '🇮🇹 الإيطالية'],
    ['pt', '🇧🇷 البرتغالية'],
    ['tr', '🇹🇷 التركية'],
    ['ru', '🇷🇺 الروسية'],
    ['ja', '🇯🇵 اليابانية'],
    ['ko', '🇰🇷 الكورية'],
    ['zh-CN', '🇨🇳 الصينية'],
    ['hi', '🇮🇳 الهندية'],
    ['fa', '🇮🇷 الفارسية'],
    ['ur', '🇵🇰 الأردية'],
    ['id', '🇮🇩 الإندونيسية'],
    ['ms', '🇲🇾 الماليزية'],
    ['nl', '🇳🇱 الهولندية'],
    ['pl', '🇵🇱 البولندية'],
    ['uk', '🇺🇦 الأوكرانية'],
    ['sv', '🇸🇪 السويدية'],
    ['da', '🇩🇰 الدنماركية'],
    ['no', '🇳🇴 النرويجية'],
    ['fi', '🇫🇮 الفنلندية'],
    ['cs', '🇨🇿 التشيكية'],
    ['el', '🇬🇷 اليونانية'],
    ['he', '🇮🇱 العبرية'],
    ['th', '🇹🇭 التايلاندية'],
    ['vi', '🇻🇳 الفيتنامية'],
    ['ro', '🇷🇴 الرومانية'],
    ['hu', '🇭🇺 المجرية'],
    ['bg', '🇧🇬 البلغارية'],
    ['sr', '🇷🇸 الصربية'],
    ['sk', '🇸🇰 السلوفاكية'],
    ['hr', '🇭🇷 الكرواتية'],
    ['sl', '🇸🇮 السلوفينية'],
    ['ca', '🇪🇸 الكتالونية'],
    ['et', '🇪🇪 الإستونية'],
    ['lv', '🇱🇻 اللاتفية'],
    ['lt', '🇱🇹 الليتوانية'],
    ['sw', '🇰🇪 السواحيلية'],
    ['bn', '🇧🇩 البنغالية'],
    ['ta', '🇮🇳 التاميلية'],
    ['te', '🇮🇳 التيلجو'],
    ['ml', '🇮🇳 المالايالامية'],
    ['mr', '🇮🇳 الماراثية'],
    ['gu', '🇮🇳 الغوجاراتية'],
    ['pa', '🇮🇳 البنجابية'],
    ['ne', '🇳🇵 النيبالية'],
    ['am', '🇪🇹 الأمهرية'],
    ['az', '🇦🇿 الأذربيجانية'],
    ['ka', '🇬🇪 الجورجية'],
    ['hy', '🇦🇲 الأرمنية'],
    ['kk', '🇰🇿 الكازاخستانية'],
    ['uz', '🇺🇿 الأوزبكية'],
    ['cy', '🏴 الويلزية'],
    ['is', '🇮🇸 الآيسلندية'],
    ['ga', '🇮🇪 الأيرلندية']
]

const makeButtons = (items, usedPrefix, command, text) =>
    items.map(([code, name]) => ({
        buttonId: `${usedPrefix + command} ${code} ${text}`,
        buttonText: { displayText: name },
        type: 1
    }))

const handler = async (m, { conn, usedPrefix, command, args }) => {
    try {
        let text = args.join(' ').trim() || m.quoted?.text

        if (!text) {
            return await conn.reply(
                m.chat,
                `╭━━━〔 ⚠️ 𝐍𝐎𝐗 〕━━━╮

│ 📝 اكتب نصاً أو قم بالرد
│ على رسالة تريد ترجمتها.

│ 📌 مثال:
│ ${usedPrefix + command} Hello

╰━━━━━━━━━━━━━━━━━━━━╯`,
                m
            )
        }

        const selected = languages.find(
            ([code]) => code.toLowerCase() === args[0]?.toLowerCase()
        )

        if (selected) {
            const lang = selected[0]
            const content =
                args.slice(1).join(' ').trim() || m.quoted?.text

            if (!content) {
                return await conn.reply(
                    m.chat,
                    `╭━━━〔 ⚠️ 𝐍𝐎𝐗 〕━━━╮

│ لم يتم العثور على نص للترجمة.

╰━━━━━━━━━━━━━━━━━━━━╯`,
                    m
                )
            }

            await m.react('🕒')

            const result = await translate(content, {
                to: lang,
                autoCorrect: true
            })

            const message = `╭━━━〔 🌐 𝐍𝐎𝐗 𝐓𝐑𝐀𝐍𝐒𝐋𝐀𝐓𝐎𝐑 〕━━━╮
│
│ 🌍 *اللغة:* ${selected[1]}
│
╰━━━〔 📖 𝐑𝐄𝐒𝐔𝐋𝐓 〕━━━╯

${result.text}

╭━━━━━━━━━━━━━━━━━━━━╮
│ 👑 AHSAN (03107260507)
│ 🌓 Ｎｏｘ Ｂｏｔ
╰━━━━━━━━━━━━━━━━━━━━╯`

            await conn.reply(m.chat, message, m)
            return await m.react('✔️')
        }

        const buttons = makeButtons(
            languages.slice(0, 20),
            usedPrefix,
            command,
            text
        )

        buttons.push({
            buttonId: `${usedPrefix + command} more ${text}`,
            buttonText: {
                displayText: '🌐 المزيد من اللغات'
            },
            type: 1
        })

        const message = `╭━━━〔 🌐 𝐍𝐎𝐗 〕━━━╮

│ ✦ *مـتـرجـم نـوكـس*
│
│ 📝 النص:
│ ${text}
│
│ 🌍 اختر اللغة التي تريد
│ الترجمة إليها من الأزرار.

╰━━━〔 AHSAN (03107260507) 〕━━━╯`

        await conn.sendMessage(
            m.chat,
            {
                text: message,
                footer: '🌓 Ｎｏｘ Ｂｏｔ • 𝐓𝐫𝐚𝐧𝐬𝐥𝐚𝐭𝐨𝐫',
                buttons,
                headerType: 1
            },
            { quoted: m }
        )

    } catch (error) {
        console.error('NOX TRANSLATOR ERROR:', error)

        await m.react('✖️')

        await conn.reply(
            m.chat,
            `╭━━━〔 ❌ 𝐍𝐎𝐗 𝐄𝐑𝐑𝐎𝐑 〕━━━╮

│ حدث خطأ أثناء الترجمة.
│
│ ⚠️ حاول مرة أخرى لاحقاً.

╰━━━━━━━━━━━━━━━━━━━━╯`,
            m
        )
    }
}

handler.help = ['ترانست']
handler.tags = ['utils']
handler.command = ['ترانست']

export default handler