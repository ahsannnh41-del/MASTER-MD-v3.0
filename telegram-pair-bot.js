/*
═══════════════════════════════════════════════════════════════
  ⚡ MASTER MD — Next-Gen Telegram Pairing Bot & Control Center
  👑 Developer: AHSAN (03107260507)
  📢 Official Channel: https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
  🛡️ Anti-Ban Protocol: Active & Enforced
═══════════════════════════════════════════════════════════════
*/

import { createRequire } from 'module'
const _require = createRequire(import.meta.url)
const TelegramBot = _require('node-telegram-bot-api')
import axios from 'axios'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.TG_TOKEN || global.tgToken || '9104594619:AAHaspLTBfwlKCTSU1xsmCPi0GZ-bFAP2M8'
const MASTER_MD_PORT = process.env.PORT || 3000
const MASTER_MD_URL = process.env.MASTER_MD_URL || `http://localhost:${MASTER_MD_PORT}`

function normalizePhone(raw) {
    let n = String(raw || '').replace(/[^0-9]/g, '')
    if (n.startsWith('00')) n = n.slice(2)

    // Pakistan +92 prefix adjustments
    if (n.startsWith('920') && n.length === 13) {
        n = '92' + n.slice(3)
    } else if (n.startsWith('9203') && n.length >= 13) {
        n = '92' + n.slice(3)
    } else if (n.startsWith('03') && n.length === 11) {
        n = '92' + n.slice(1)
    } else if (n.startsWith('0') && n.length === 11) {
        n = '92' + n.slice(1)
    } else if (n.startsWith('3') && n.length === 10) {
        n = '92' + n
    }

    // India +91 adjustments
    else if (n.startsWith('910') && n.length === 13) {
        n = '91' + n.slice(3)
    }

    return n
}

if (!TELEGRAM_TOKEN) {
    console.log('⚠️ [Telegram Bot] No TELEGRAM_BOT_TOKEN provided.')
} else {
    const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true })

    // Suppress unhandled polling errors from killing the process
    bot.on('polling_error', (err) => {
        // Silently log or handle network hiccups
    })

    console.log('🤖 [Telegram Bot] MASTER MD Telegram Pairing Bot is online & ready!')

    const MAIN_KEYBOARD = {
        reply_markup: {
            keyboard: [
                [{ text: '⚡ Get Pairing Code' }, { text: '📊 System Status' }],
                [{ text: '📖 How to Link' }, { text: '👑 Developer Info' }],
                [{ text: '📢 Official Channel' }, { text: '🔄 Reset Session' }]
            ],
            resize_keyboard: true,
            persistent: true
        }
    }

    const waitingUsers = new Set()

    // ─── /start Command ──────────────────────────────────────────────────────────
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id
        const name = msg.from.first_name || 'User'

        const welcomeText = 
`╔══════════════════════════════════╗
║  ⚡ *MASTER MD PAIRING BOT* ⚡  ║
║     👑 DEVELOPER: AHSAN          ║
╚══════════════════════════════════╝

Assalam-o-Alaikum, *${name}*! 👋
Welcome to the official *MASTER MD WhatsApp Pairing Bot*.

Use this bot to link your WhatsApp account in seconds with zero delay!

🤖 *Bot:* MASTER MD v3.0.0 (NOX Powerhouse)
👑 *Developer:* AHSAN (03107260507)
🛡️ *Anti-Ban Shield:* 🟢 Active & 100% Enforced
📢 *Official Channel:* [Join Here](https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46)

👇 *Quick Actions:*
• Tap *⚡ Get Pairing Code* to link your number
• Or simply type your phone number directly in this chat!`

        bot.sendMessage(chatId, welcomeText, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
            reply_markup: {
                keyboard: [
                    [{ text: '⚡ Get Pairing Code' }, { text: '📊 System Status' }],
                    [{ text: '📖 How to Link' }, { text: '👑 Developer Info' }],
                    [{ text: '📢 Official Channel' }, { text: '🔄 Reset Session' }]
                ],
                resize_keyboard: true,
                persistent: true
            }
        })
    })

    // ─── /status Command ─────────────────────────────────────────────────────────
    bot.onText(/\/status|📊 System Status/, async (msg) => {
        const chatId = msg.chat.id
        try {
            const res = await axios.get(`${MASTER_MD_URL}/api/status`, { timeout: 6000 })
            const data = res.data
            const isOnline = data.isRegistered || data.status === 'connected'

            const statusText = 
`╔══════════════════════════════════╗
║    📊 *MASTER MD SYSTEM STATUS*   ║
╚══════════════════════════════════╝

◈ *Engine Status*  : ${isOnline ? '🟢 Connected & Online' : '🟡 Waiting for Pairing'}
◈ *WhatsApp User*  : ${data.user?.id ? `+${data.user.id.split(':')[0]}` : 'Not Linked Yet'}
◈ *Bot Name*       : ${data.botName || 'MASTER MD v3.0.0'}
◈ *Developer*      : AHSAN (03107260507)
◈ *Anti-Ban Shield*: 🟢 ACTIVE (Zero Spam, Silent Mode)
◈ *Web Portal*     : \`${MASTER_MD_URL}\`

${isOnline 
    ? '✅ Your MASTER MD bot is actively responding to commands on WhatsApp!' 
    : '⚡ Ready for linking! Tap *⚡ Get Pairing Code* to connect your WhatsApp.'}`

            bot.sendMessage(chatId, statusText, { parse_mode: 'Markdown' })
        } catch {
            bot.sendMessage(chatId, `⚠️ Could not reach MASTER MD Backend engine. Please ensure the server is running on port ${MASTER_MD_PORT}.`)
        }
    })

    // ─── /help Command ───────────────────────────────────────────────────────────
    bot.onText(/\/help|📖 How to Link/, (msg) => {
        const chatId = msg.chat.id
        const helpText = 
`📖 *How to Link MASTER MD to your WhatsApp:*

1️⃣ Tap *⚡ Get Pairing Code* or type your phone number (e.g. \`923107260507\`).
2️⃣ Copy the *8-digit code* sent by this bot.
3️⃣ Open *WhatsApp* on your phone:
   ➜ Tap the 3 dots (Menu) on Android or Settings on iPhone
   ➜ Tap *Linked Devices*
   ➜ Tap *Link a Device*
4️⃣ At the bottom, tap:
   ➜ *"Link with phone number instead"*
5️⃣ Enter the 8-digit code.

🎉 *Done!* Your WhatsApp will link in under 3 seconds!

👑 *Developer:* AHSAN (03107260507)`
        bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' })
    })

    // ─── Developer Info ──────────────────────────────────────────────────────────
    bot.onText(/👑 Developer Info/, (msg) => {
        const chatId = msg.chat.id
        const devText = 
`👑 *MASTER MD Developer Information*

◈ *Developer:* AHSAN
◈ *Contact:* +92 310 7260507
◈ *WhatsApp:* https://wa.me/923107260507
◈ *Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46

> © 2026 MASTER MD • All Rights Reserved to AHSAN`

        bot.sendMessage(chatId, devText, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '💬 WhatsApp Chat', url: 'https://wa.me/923107260507' },
                        { text: '📢 Official Channel', url: 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46' }
                    ]
                ]
            }
        })
    })

    // ─── Official Channel ────────────────────────────────────────────────────────
    bot.onText(/📢 Official Channel/, (msg) => {
        const chatId = msg.chat.id
        bot.sendMessage(chatId, `📢 *Join the official MASTER MD WhatsApp Channel for updates & features:*\n\n👉 https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46`, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📢 Open WhatsApp Channel', url: 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46' }]
                ]
            }
        })
    })

    // ─── Reset Session ───────────────────────────────────────────────────────────
    bot.onText(/\/reset|🔄 Reset Session/, async (msg) => {
        const chatId = msg.chat.id
        bot.sendMessage(chatId, '⏳ Resetting WhatsApp session state, please wait 2 seconds...', { parse_mode: 'Markdown' })
        try {
            const res = await axios.post(`${MASTER_MD_URL}/api/reset`, {}, { timeout: 15000 })
            bot.sendMessage(chatId, `🧹 *Session Reset Successfully!*\n\nA fresh socket is initialized. You can now request a new pairing code anytime.`, { parse_mode: 'Markdown' })
        } catch (err) {
            bot.sendMessage(chatId, `❌ *Reset Error:* ${err.message}`, { parse_mode: 'Markdown' })
        }
    })

    // ─── Pair Request Handler ────────────────────────────────────────────────────
    async function handlePairRequest(chatId, rawNumber) {
        const cleanNumber = normalizePhone(rawNumber)

        if (!cleanNumber || cleanNumber.length < 10 || cleanNumber.length > 15) {
            return bot.sendMessage(chatId, `⚠️ *Invalid Phone Number!*\n\nPlease provide 10 to 15 digits including country code.\n*Example:* \`923107260507\` or \`03107260507\``, { parse_mode: 'Markdown' })
        }

        const waitMsg = await bot.sendMessage(chatId, `⚡ *Connecting to WhatsApp Baileys Handshake...*\nGenerating 8-digit secure pairing code for: \`+${cleanNumber}\`\n\n_Please wait 2-4 seconds..._`, { parse_mode: 'Markdown' })

        try {
            const res = await axios.post(`${MASTER_MD_URL}/api/pair`, { phoneNumber: cleanNumber, force: true }, { timeout: 35000 })
            const data = res.data

            if (data.success && data.code) {
                const formattedCode = data.code
                const rawCode = data.code.replace(/[^a-zA-Z0-9]/g, '')

                const successCard = 
`🎉 *PAIRING CODE GENERATED!*
━━━━━━━━━━━━━━━━━━━━━
📱 *Phone:* \`+${data.phoneNumber}\`
🔑 *Your Code:* *${formattedCode}*

👇 *TAP TO COPY RAW CODE BELOW:*
\`${rawCode}\`
━━━━━━━━━━━━━━━━━━━━━
⏱️ *Code expires in:* 120 seconds

📖 *Quick Instructions:*
1️⃣ Open *WhatsApp* on your phone
2️⃣ Tap *3 Dots (Menu)* ➜ *Linked Devices*
3️⃣ Tap *Link a Device* ➜ *"Link with phone number instead"*
4️⃣ Enter the code above!

🛡️ *Anti-Ban Engine:* 🟢 Enforced & Safe
👑 *Developed by:* AHSAN (03107260507)`

                bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {})

                bot.sendMessage(chatId, successCard, {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: '📢 Official Channel', url: 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46' },
                                { text: '💬 Contact Developer', url: 'https://wa.me/923107260507' }
                            ]
                        ]
                    }
                })
            } else {
                bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {})
                bot.sendMessage(chatId, `❌ *Failed to Generate Code:*\n${data.message || 'Unknown server error'}\n\n_Please check your number and try again._`, { parse_mode: 'Markdown' })
            }
        } catch (err) {
            bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {})
            bot.sendMessage(chatId, `❌ *Pairing Error:*\n${err.response?.data?.message || err.message}\n\n_Please ensure the bot server is online._`, { parse_mode: 'Markdown' })
        }
    }

    // ─── Get Pairing Code Button Trigger ─────────────────────────────────────────
    bot.onText(/⚡ Get Pairing Code/, (msg) => {
        const chatId = msg.chat.id
        waitingUsers.add(chatId)
        bot.sendMessage(chatId, `📲 *Please send your WhatsApp Phone Number:*\n\nInclude country code (e.g. \`923107260507\` or \`03107260507\`):\n\n_Just type your number and send!_`, { parse_mode: 'Markdown' })
    })

    // ─── /pair Command ───────────────────────────────────────────────────────────
    bot.onText(/\/pair(?:\s+(.+))?/, (msg, match) => {
        const chatId = msg.chat.id
        const num = match[1]
        if (!num) {
            waitingUsers.add(chatId)
            return bot.sendMessage(chatId, `💡 *Usage:* \`/pair <number>\`\n*Example:* \`/pair 923107260507\`\n\n_Or simply send your phone number now:_`, { parse_mode: 'Markdown' })
        }
        handlePairRequest(chatId, num)
    })

    // ─── Direct Message Listener ─────────────────────────────────────────────────
    bot.on('message', (msg) => {
        const text = msg.text?.trim() || ''
        const chatId = msg.chat.id

        if (!text || text.startsWith('/') || [
            '⚡ Get Pairing Code', 
            '📊 System Status', 
            '📖 How to Link', 
            '👑 Developer Info', 
            '📢 Official Channel', 
            '🔄 Reset Session'
        ].includes(text)) {
            return
        }

        // Check if message is a phone number
        const digits = text.replace(/[^0-9]/g, '')
        if (digits.length >= 10 && digits.length <= 15) {
            waitingUsers.delete(chatId)
            handlePairRequest(chatId, text)
        } else if (waitingUsers.has(chatId)) {
            bot.sendMessage(chatId, `⚠️ That doesn't look like a valid phone number. Please enter 10 to 15 digits (e.g. \`923107260507\`).`, { parse_mode: 'Markdown' })
        }
    })
}
