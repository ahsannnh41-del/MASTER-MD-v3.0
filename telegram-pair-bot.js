/*
═══════════════════════════════════════════════════════════════
  ⚡ MASTER MD — Telegram Pairing Bot
  👑 Developer: AHSAN (03107260507)
  📢 Channel: https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
═══════════════════════════════════════════════════════════════
*/

import TelegramBot from 'node-telegram-bot-api'
import axios from 'axios'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.TG_TOKEN || ''
const MASTER_MD_PORT = process.env.PORT || 3000
const MASTER_MD_URL = process.env.MASTER_MD_URL || `http://localhost:${MASTER_MD_PORT}`

if (!TELEGRAM_TOKEN) {
    console.log('⚠️ [Telegram Bot] No TELEGRAM_BOT_TOKEN provided. To enable Telegram pairing, set TELEGRAM_BOT_TOKEN in environment variables.')
} else {
    const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true })

    console.log('🤖 [Telegram Bot] MASTER MD Telegram Pairing Bot is online!')

    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id
        const name = msg.from.first_name || 'User'

        const welcomeText = `👋 Hello, *${name}*! Welcome to *MASTER MD Pairing Bot* ⚡

👑 *Developer:* AHSAN (03107260507)
⚡ *Bot:* MASTER MD v3.0.0
📢 *Official Channel:* https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46

Use this bot to instantly generate an 8-digit WhatsApp Pairing Code for linking your account!

*Available Commands:*
• \`/pair <number>\` — Get 8-digit pairing code (e.g. \`/pair 923107260507\`)
• \`/status\` — Check MASTER MD system & server status
• \`/help\` — How to link your WhatsApp step-by-step

_Or simply send your phone number directly in this chat!_`

        bot.sendMessage(chatId, welcomeText, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '⚡ Official Channel', url: 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46' },
                        { text: '👑 Developer Contact', url: 'https://wa.me/923107260507' }
                    ]
                ]
            }
        })
    })

    bot.onText(/\/status/, async (msg) => {
        const chatId = msg.chat.id
        try {
            const res = await axios.get(`${MASTER_MD_URL}/api/status`, { timeout: 5000 })
            const data = res.data
            const status = data.isRegistered ? '🟢 Connected & Online' : '🟡 Waiting for Pairing'

            const statusText = `╔══════════════════════════════════╗
║     ⚡ MASTER MD STATUS ⚡       ║
╚══════════════════════════════════╝

◈ *Status*     : ${status}
◈ *Bot Name*   : ${data.botName || 'MASTER MD'}
◈ *Developer*  : AHSAN (03107260507)
◈ *WhatsApp*   : ${data.user?.id ? data.user.id.split(':')[0] : 'Not Paired'}
◈ *Web Portal* : ${MASTER_MD_URL}`

            bot.sendMessage(chatId, statusText, { parse_mode: 'Markdown' })
        } catch {
            bot.sendMessage(chatId, `⚠️ Could not reach MASTER MD Backend server. Please ensure the bot is running on port ${MASTER_MD_PORT}.`)
        }
    })

    bot.onText(/\/help/, (msg) => {
        const chatId = msg.chat.id
        const helpText = `📖 *How to Link MASTER MD via Pairing Code:*

1️⃣ Send your phone number (e.g. \`/pair 923107260507\`).
2️⃣ Copy the *8-digit code* sent by this bot.
3️⃣ Open *WhatsApp* on your phone & tap the 3 dots (Menu) &rarr; *Linked Devices*.
4️⃣ Tap *Link a Device* &rarr; select *"Link with phone number instead"*.
5️⃣ Enter the 8-digit code. Linking completes in ~3 seconds!

👑 *Developer:* AHSAN (03107260507)`
        bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' })
    })

    async function handlePairRequest(chatId, rawNumber) {
        bot.sendMessage(chatId, `⏳ *Generating pairing code for:* \`${rawNumber}\`...\nPlease wait 2-3 seconds.`, { parse_mode: 'Markdown' })

        try {
            const res = await axios.post(`${MASTER_MD_URL}/api/pair`, { phoneNumber: rawNumber }, { timeout: 25000 })
            const data = res.data

            if (data.success && data.code) {
                const cleanCode = data.code.replace(/[^a-zA-Z0-9]/g, '')
                const successText = `🎉 *Pairing Code Generated Successfully!*

📱 *Phone:* \`+${data.phoneNumber}\`
🔑 *Your Code:* \`${data.code}\`

👇 *Tap to copy raw code below:*
\`${cleanCode}\`

*Instructions:*
1. Open WhatsApp &rarr; Linked Devices &rarr; Link a Device
2. Tap *"Link with phone number instead"*
3. Enter the code above!

👑 *Developer:* AHSAN (03107260507)`

                bot.sendMessage(chatId, successText, {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '📢 Official Channel', url: 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46' }]
                        ]
                    }
                })
            } else {
                bot.sendMessage(chatId, `❌ *Failed to get pairing code:* ${data.message || 'Unknown error'}`)
            }
        } catch (err) {
            bot.sendMessage(chatId, `❌ *Connection Error:* ${err.response?.data?.message || err.message}`)
        }
    }

    bot.onText(/\/reset/, async (msg) => {
        const chatId = msg.chat.id
        try {
            const res = await axios.post(`${MASTER_MD_URL}/api/reset`, {}, { timeout: 10000 })
            bot.sendMessage(chatId, `🧹 *${res.data.message || 'Session reset successfully!'}*`, { parse_mode: 'Markdown' })
        } catch (err) {
            bot.sendMessage(chatId, `❌ *Reset Error:* ${err.message}`, { parse_mode: 'Markdown' })
        }
    })

    bot.onText(/\/pair(?:\s+(.+))?/, (msg, match) => {
        const chatId = msg.chat.id
        const num = match[1]
        if (!num) {
            return bot.sendMessage(chatId, `💡 *Usage:* \`/pair <number>\`\n*Example:* \`/pair 923107260507\``, { parse_mode: 'Markdown' })
        }
        handlePairRequest(chatId, num)
    })

    bot.on('message', (msg) => {
        const text = msg.text?.trim() || ''
        if (!text || text.startsWith('/')) return

        const digits = text.replace(/[^0-9]/g, '')
        if (digits.length >= 10 && digits.length <= 15) {
            handlePairRequest(msg.chat.id, text)
        }
    })
}
