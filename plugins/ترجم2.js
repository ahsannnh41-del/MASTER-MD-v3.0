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

const getQuotedText = (m) => {
    const quoted = m.quoted

    if (!quoted) return ''

    return (
        quoted.text ||
        quoted.body ||
        quoted.caption ||
        quoted.msg?.text ||
        quoted.msg?.caption ||
        quoted.message?.conversation ||
        quoted.message?.extendedTextMessage?.text ||
        quoted.message?.imageMessage?.caption ||
        quoted.message?.videoMessage?.caption ||
        ''
    )
}

const handler = async (m, { conn, args }) => {
    try {
        let text = args.slice(1).join(' ').trim()

        if (!text) {
            text = getQuotedText(m).trim()
        }

        if (!text) {
            return conn.sendMessage(
                m.chat,
                {
                    text: `╭━━━〔 🌐 𝐍𝐎𝐗 〕━━━╮
│
│ ⚠️ *لم يتم العثور على نص للترجمة.*
│
│ ✍️ اكتب النص بعد الأمر:
│ .ترجم Hello
│
│ 💬 أو قم بالرد على رسالة ثم اكتب:
│ .ترجم
│
╰━━━〔 AHSAN (03107260507) 〕━━━╯`
                },
                { quoted: m }
            )
        }

        const lang = String(args[0] || '').toLowerCase()

        if (!lang) {
            return conn.sendMessage(
                m.chat,
                {
                    text: `╭━━━〔 🌐 𝐍𝐎𝐗 〕━━━╮
│
│ ⚠️ لم يتم تحديد لغة الترجمة.
│
│ 🌍 اختر اللغة من قائمة الترجمة.
│
╰━━━━━━━━━━━━━━━━━━━━╯`
                },
                { quoted: m }
            )
        }

        await conn.sendMessage(m.chat, {
            react: {
                text: '⏳',
                key: m.key
            }
        })

        const result = await translate(text, {
            to: lang
        })

        const translated = result?.text

        if (!translated) {
            throw new Error('Translation result is empty')
        }

        const languageNames = {
            ar: 'العربية',
            en: 'English',
            fr: 'Français',
            de: 'Deutsch',
            es: 'Español',
            it: 'Italiano',
            pt: 'Português',
            ru: 'Русский',
            tr: 'Türkçe',
            fa: 'فارسی',
            ur: 'اردو',
            hi: 'हिन्दी',
            zh: '中文',
            ja: '日本語',
            ko: '한국어',
            nl: 'Nederlands',
            sv: 'Svenska',
            pl: 'Polski',
            uk: 'Українська',
            id: 'Indonesia',
            ms: 'Melayu',
            vi: 'Tiếng Việt',
            th: 'ไทย',
            he: 'עברית',
            el: 'Ελληνικά',
            cs: 'Čeština',
            ro: 'Română',
            hu: 'Magyar',
            da: 'Dansk',
            no: 'Norsk',
            fi: 'Suomi',
            bg: 'Български',
            sr: 'Српски',
            sk: 'Slovenčina',
            hr: 'Hrvatski',
            sw: 'Swahili',
            af: 'Afrikaans',
            sq: 'Shqip',
            am: 'አማርኛ',
            az: 'Azərbaycan',
            bn: 'বাংলা',
            ca: 'Català',
            et: 'Eesti',
            eu: 'Euskara',
            gl: 'Galego',
            ka: 'ქართული',
            gu: 'ગુજરાતી',
            kn: 'ಕನ್ನಡ',
            ml: 'മലയാളം',
            mr: 'मराठी',
            ne: 'नेपाली',
            pa: 'ਪੰਜਾਬੀ',
            ta: 'தமிழ்',
            te: 'తెలుగు',
            tl: 'Filipino'
        }

        const language = languageNames[lang] || lang.toUpperCase()

        const reply = `╭━━━〔 🌐 𝐍𝐎𝐗 𝐓𝐑𝐀𝐍𝐒𝐋𝐀𝐓𝐎𝐑 〕━━━╮
│
│ 🌍 *اللغة:* ${language}
│ 🔤 *الرمز:* ${lang.toUpperCase()}
│
│ ─────────────────────
│
│ 📝 *النص:*
│ ${text}
│
│ ─────────────────────
│
│ ✅ *الترجمة:*
│ ${translated}
│
╰━━━〔 AHSAN (03107260507) 〕━━━╯`

        await conn.sendMessage(
            m.chat,
            {
                text: reply
            },
            { quoted: m }
        )

        await conn.sendMessage(m.chat, {
            react: {
                text: '✅',
                key: m.key
            }
        })

    } catch (error) {
        console.error('NOX TRANSLATOR ERROR:', error)

        await conn.sendMessage(m.chat, {
            react: {
                text: '❌',
                key: m.key
            }
        })

        await conn.sendMessage(
            m.chat,
            {
                text: `╭━━━〔 ❌ 𝐍𝐎𝐗 〕━━━╮
│
│ تعذر إتمام الترجمة.
│
│ 🔄 حاول مرة أخرى.
│
╰━━━━━━━━━━━━━━━━━━━━╯`
            },
            { quoted: m }
        )
    }
}

handler.help = ['تنفيذ_الترجمة']
handler.tags = ['tools']
handler.command = /^تنفيذ_الترجمة$/i

export default handler