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

import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const getText = (m) => {
    if (m.quoted) {
        return (
            m.quoted.text ||
            m.quoted.body ||
            m.quoted.caption ||
            m.quoted.msg?.text ||
            m.quoted.msg?.caption ||
            m.quoted.message?.conversation ||
            m.quoted.message?.extendedTextMessage?.text ||
            m.quoted.message?.imageMessage?.caption ||
            m.quoted.message?.videoMessage?.caption ||
            ''
        )
    }

    return m.text || ''
}

const handler = async (m, { conn, text, usedPrefix }) => {
    try {
        usedPrefix = usedPrefix || '.'

        let input = text?.trim() || ''

        if (!input) {
            input = getText(m).trim()
        }

        if (!input) {
            return conn.sendMessage(
                m.chat,
                {
                    text: `🌐 *NOX Translator*

⚠️ لم يتم العثور على نص للترجمة.

✍️ اكتب:
${usedPrefix}ترجم Hello

💬 أو قم بالرد على رسالة واكتب:
${usedPrefix}ترجم

AHSAN (03107260507)`
                },
                { quoted: m }
            )
        }

        const languages = {
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

        const sectionsData = [
            {
                title: '⭐ اللغات الأساسية',
                codes: [
                    'ar', 'en', 'fr', 'de', 'es',
                    'it', 'pt', 'ru', 'tr', 'fa',
                    'ur', 'hi', 'zh', 'ja', 'ko'
                ]
            },
            {
                title: '🌍 اللغات الأوروبية',
                codes: [
                    'nl', 'sv', 'pl', 'uk', 'cs',
                    'ro', 'hu', 'da', 'no', 'fi',
                    'bg', 'sr', 'sk', 'hr',
                    'el', 'ca', 'et', 'eu', 'gl'
                ]
            },
            {
                title: '🌏 اللغات الآسيوية',
                codes: [
                    'id', 'ms', 'vi', 'th', 'he',
                    'bn', 'ne', 'pa', 'ta', 'te',
                    'ml', 'mr', 'gu', 'kn', 'tl'
                ]
            },
            {
                title: '🌐 لغات إضافية',
                codes: [
                    'af', 'sq', 'am', 'az', 'sw'
                ]
            }
        ]

        const cleanText = input
            .replace(/\n+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()

        const preview =
            cleanText.length > 500
                ? cleanText.slice(0, 500) + '…'
                : cleanText

        const sections = sectionsData.map(section => ({
            title: section.title,

            rows: section.codes
                .filter(code => languages[code])
                .map(code => ({
                    header: `🌐 ${languages[code]}`,
                    title: `ترجمة إلى ${languages[code]}`,
                    description: `اضغط للترجمة • ${code.toUpperCase()}`,
                    id: `${usedPrefix}تنفيذ_الترجمة ${code} ${cleanText}`
                }))
        }))

        const caption = `🌐 *NOX Translator*

📝 *النص:*
${preview}

━━━━━━━━━━━━━━

🌍 اختر اللغة التي تريد الترجمة إليها.

⚡ ترجمة سريعة
🌐 أكثر من 50 لغة

AHSAN (03107260507)`

        const interactiveMessage = {
            body: {
                text: caption
            },

            footer: {
                text: '🌓 NOX Bot • AHSAN (03107260507)'
            },

            header: {
                title: '🌐 NOX Translator',
                hasMediaAttachment: false
            },

            nativeFlowMessage: {
                buttons: [
                    {
                        name: 'single_select',

                        buttonParamsJson: JSON.stringify({
                            title: '🌍 اختيار اللغة',
                            sections
                        })
                    }
                ],

                messageParamsJson: ''
            }
        }

        const msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        interactiveMessage
                    }
                }
            },
            {
                userJid: conn.user?.jid || conn.user?.id || conn.user,
                quoted: m
            }
        )

        await conn.sendMessage(m.chat, {
            react: {
                text: '🌐',
                key: m.key
            }
        })

        await conn.relayMessage(
            m.chat,
            msg.message,
            {
                messageId: msg.key.id
            }
        )

    } catch (error) {
        console.error('NOX TRANSLATOR ERROR:', error)

        await conn.sendMessage(
            m.chat,
            {
                text: `❌ *NOX Translator*

حدث خطأ أثناء فتح قائمة الترجمة.

🔄 حاول مرة أخرى.`
            },
            { quoted: m }
        )
    }
}

handler.help = [
    'ترجم <النص>',
    'translate <text>'
]

handler.tags = ['tools']

handler.command = /^(ترجم|translate)$/i

export default handler