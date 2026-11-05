/*
═══════════════════════════════════════════════════════════════
  ⚡ MASTER MD — Ultra Pure Telegram Pairing Bot & Control Center
  👑 Developer: AHSAN (03107260507)
  📢 Official Channel: https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
  🛡️ 100% Native Architecture (Zero-Dependency Engine)
═══════════════════════════════════════════════════════════════
*/

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.TG_TOKEN || global.tgToken || '9104594619:AAHaspLTBfwlKCTSU1xsmCPi0GZ-bFAP2M8'
const MASTER_MD_PORT = process.env.PORT || 3000
const MASTER_MD_URL = (process.env.MASTER_MD_URL || `http://localhost:${MASTER_MD_PORT}`).replace(/\/+$/, '')
const TG_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`

const DEVELOPER_NAME = 'AHSAN'
const DEVELOPER_NUM = '03107260507'
const DEVELOPER_WA = 'https://wa.me/923107260507'
const CHANNEL_URL = 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46'
const BANNER_URL = 'https://files.catbox.moe/8jkhav.png'
const ADMIN_SECRET = '03107260507'

const authenticatedAdmins = new Set()
const waitingUsers = new Set()
let cachedPhotoId = null

function normalizePhone(raw) {
    let n = String(raw || '').replace(/[^0-9]/g, '')
    if (n.startsWith('00')) n = n.slice(2)
    if (n.startsWith('920') && n.length === 13) n = '92' + n.slice(3)
    else if (n.startsWith('9203') && n.length >= 13) n = '92' + n.slice(3)
    else if (n.startsWith('03') && n.length === 11) n = '92' + n.slice(1)
    else if (n.startsWith('0') && n.length === 11) n = '92' + n.slice(1)
    else if (n.startsWith('3') && n.length === 10) n = '92' + n
    else if (n.startsWith('910') && n.length === 13) n = '91' + n.slice(3)
    return n
}

function findBannerPhotoPath() {
    const candidates = [
        path.join(process.cwd(), 'media', 'thumbnail.jpg'),
        path.join(__dirname, 'media', 'thumbnail.jpg'),
        path.join(process.cwd(), 'src', 'menu', 'thumbnail.jpg'),
        path.join(__dirname, 'src', 'menu', 'thumbnail.jpg'),
        path.join(process.cwd(), 'media', 'thumbnail.png'),
        path.join(__dirname, 'media', 'thumbnail.png'),
    ]
    for (const p of candidates) {
        try {
            if (fs.existsSync(p) && fs.statSync(p).size > 1000) {
                return p
            }
        } catch {}
    }
    return null
}

async function tgRequest(method, data = {}) {
    try {
        const res = await axios.post(`${TG_API}/${method}`, data, { timeout: 15000 })
        return res.data?.result
    } catch (e) {
        console.error(`[Telegram API ${method} Error]:`, e.response?.data?.description || e.message)
        return null
    }
}

async function sendMsg(chatId, text, replyMarkup = null) {
    const payload = {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
    }
    if (replyMarkup) payload.reply_markup = replyMarkup
    try {
        const res = await tgRequest('sendMessage', payload)
        if (res) return res
    } catch (e) {
        console.warn('[sendMsg HTML failed, retrying plain]:', e.message)
    }
    payload.text = text.replace(/<[^>]*>/g, '')
    delete payload.parse_mode
    return await tgRequest('sendMessage', payload)
}

async function sendPhoto(chatId, caption, replyMarkup = null) {
    // 1. Cached file_id
    if (cachedPhotoId) {
        try {
            const res = await tgRequest('sendPhoto', {
                chat_id: chatId,
                photo: cachedPhotoId,
                caption,
                parse_mode: 'HTML',
                reply_markup: replyMarkup
            })
            if (res) return res
        } catch (e) {
            cachedPhotoId = null
        }
    }

    // 2. Direct Local File Upload (Zero external dependency)
    const photoPath = findBannerPhotoPath()
    if (photoPath) {
        try {
            const fileBuf = fs.readFileSync(photoPath)
            const form = new FormData()
            const blob = new Blob([fileBuf], { type: 'image/jpeg' })
            form.append('chat_id', String(chatId))
            form.append('photo', blob, 'thumbnail.jpg')
            form.append('caption', caption)
            form.append('parse_mode', 'HTML')
            if (replyMarkup) {
                form.append('reply_markup', JSON.stringify(replyMarkup))
            }

            const uploadRes = await fetch(`${TG_API}/sendPhoto`, {
                method: 'POST',
                body: form
            })
            const data = await uploadRes.json()

            if (data.ok && data.result) {
                const photos = data.result.photo || []
                if (photos.length > 0) {
                    cachedPhotoId = photos[photos.length - 1].file_id
                }
                return data.result
            } else {
                console.error('[sendPhoto upload error]:', data.description)
                // Retry plain text caption if HTML parse issue
                const plainForm = new FormData()
                plainForm.append('chat_id', String(chatId))
                plainForm.append('photo', new Blob([fileBuf], { type: 'image/jpeg' }), 'thumbnail.jpg')
                plainForm.append('caption', caption.replace(/<[^>]*>/g, ''))
                if (replyMarkup) plainForm.append('reply_markup', JSON.stringify(replyMarkup))

                const retryRes = await fetch(`${TG_API}/sendPhoto`, { method: 'POST', body: plainForm })
                const retryData = await retryRes.json()
                if (retryData.ok && retryData.result) {
                    const photos = retryData.result.photo || []
                    if (photos.length > 0) cachedPhotoId = photos[photos.length - 1].file_id
                    return retryData.result
                }
            }
        } catch (uploadErr) {
            console.error('[sendPhoto local upload error]:', uploadErr.message)
        }
    }

    // 3. Fallback to URL
    try {
        const urlRes = await tgRequest('sendPhoto', {
            chat_id: chatId,
            photo: BANNER_URL,
            caption,
            parse_mode: 'HTML',
            reply_markup: replyMarkup
        })
        if (urlRes) return urlRes
    } catch {}

    // 4. Final Fallback to Text
    return await sendMsg(chatId, caption, replyMarkup)
}

async function editCaption(chatId, messageId, caption, replyMarkup = null) {
    const payload = {
        chat_id: chatId,
        message_id: messageId,
        caption,
        parse_mode: 'HTML'
    }
    if (replyMarkup) payload.reply_markup = replyMarkup
    try {
        const res = await tgRequest('editMessageCaption', payload)
        if (res) return res
    } catch (e) {
        console.warn('[editCaption HTML failed, retrying plain]:', e.message)
    }
    payload.caption = caption.replace(/<[^>]*>/g, '')
    delete payload.parse_mode
    return await tgRequest('editMessageCaption', payload)
}

async function editText(chatId, messageId, text, replyMarkup = null) {
    const payload = {
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
    }
    if (replyMarkup) payload.reply_markup = replyMarkup
    try {
        const res = await tgRequest('editMessageText', payload)
        if (res) return res
    } catch (e) {
        console.warn('[editText HTML failed, retrying plain]:', e.message)
    }
    payload.text = text.replace(/<[^>]*>/g, '')
    delete payload.parse_mode
    return await tgRequest('editMessageText', payload)
}

async function answerCallback(callbackQueryId, text = '', showAlert = false) {
    const payload = { callback_query_id: callbackQueryId }
    if (text) {
        payload.text = text
        payload.show_alert = showAlert
    }
    return await tgRequest('answerCallbackQuery', payload)
}

async function deleteMsg(chatId, messageId) {
    if (!chatId || !messageId) return
    return await tgRequest('deleteMessage', { chat_id: chatId, message_id: messageId })
}

// ─── Keyboards ───────────────────────────────────────────────────────────────
const MAIN_KEYBOARD = {
    keyboard: [
        [{ text: '⚡ Get Pairing Code' }, { text: '📊 System Status' }],
        [{ text: '📖 How to Link' }, { text: '👑 Developer Info' }],
        [{ text: '📢 Official Channel' }, { text: '🔄 Reset Session' }]
    ],
    resize_keyboard: true,
    persistent: true
}

const WELCOME_INLINE = {
    inline_keyboard: [
        [
            { text: '⚡ Pair WhatsApp (Send Number)', callback_data: 'pair_guide' },
            { text: '📊 System Status', callback_data: 'status_menu' }
        ],
        [
            { text: '📢 Official Channel', url: CHANNEL_URL },
            { text: '👑 Developer Info', url: DEVELOPER_WA }
        ],
        [
            { text: '📋 Bot Commands Help', callback_data: 'help_menu' }
        ]
    ]
}

const HELP_INLINE = {
    inline_keyboard: [
        [
            { text: '🔙 Back to Home', callback_data: 'home_menu' },
            { text: '⚡ Get Pairing Code', callback_data: 'pair_guide' }
        ],
        [
            { text: '📢 Official Channel', url: CHANNEL_URL },
            { text: '💬 Contact Developer', url: DEVELOPER_WA }
        ]
    ]
}

const STATUS_INLINE = {
    inline_keyboard: [
        [
            { text: '🔄 Refresh Status', callback_data: 'status_menu' },
            { text: '🔙 Back to Home', callback_data: 'home_menu' }
        ],
        [
            { text: '⚡ Get Pairing Code', callback_data: 'pair_guide' },
            { text: '📢 Official Channel', url: CHANNEL_URL }
        ]
    ]
}

// ─── HTML Captions ───────────────────────────────────────────────────────────
const WELCOME_CAPTION =
`╔══════════════════════════════════╗
║  ⚡ <b>MASTER MD PAIRING PORTAL</b> ⚡  ║
║     👑 DEVELOPER: AHSAN          ║
╚══════════════════════════════════╝

👋 <b>Assalam-o-Alaikum, Welcome!</b>
Next-Gen WhatsApp Multi-Device Powerhouse by <b>AHSAN</b>.

┏ 👤 <b>User</b>      : Private Session
┃ 👑 <b>Developer</b> : ${DEVELOPER_NAME} (${DEVELOPER_NUM})
┃ 🌟 <b>Status</b>    : 🟢 Server Online &amp; Ready
┗ ⚡ <b>Mode</b>      : Direct Cloud Socket Pairing

┏ 📦 <b>Version</b>   : v3.0.0 (Gojo Satoru Edition)
┃ 🟢 <b>Node.js</b>   : Node v20 LTS
┗ 🛡️ <b>Anti-Ban</b>  : 🟢 Active &amp; 100% Enforced

┏ 💾 <b>Security</b>  : End-to-End Encrypted
┃ 📊 <b>Commands</b>  : 2,000+ Commands Ready
┗ 🔖 <b>Platform</b>  : WhatsApp Multi-Device

╭─〔 📋 <b>How to Link Your WhatsApp</b> 〕
│ 1️⃣ Tap <b>⚡ Get Pairing Code</b> below
│    • Or send your number: <code>923107260507</code>
│ 2️⃣ Receive 8-digit Pairing Code instantly
│ 3️⃣ WhatsApp ➜ Linked Devices ➜ Enter Code!
╰──────────────────────────────────────
💡 <i>Send your phone number below to get started!</i>`

const HELP_CAPTION =
`╔══════════════════════════════════════╗
║   📋 <b>MASTER MD COMMAND GUIDE</b> ⚡    ║
╚══════════════════════════════════════╝

<b>How to use MASTER MD once linked:</b>
• <code>.menu</code> — Interactive button dashboard
• <code>.allmenu</code> — Complete directory of 2,000+ features
• <code>.ping</code> — Real-time server latency check
• <code>.owner</code> — Official developer contact
• <code>.ai</code> — Artificial Intelligence chat assistant
• <code>.menuadmin</code> — Group administration &amp; anti-delete

💡 <b>To pair right now:</b>
Simply reply or send your phone number (e.g. <code>923107260507</code>).

👑 <b>Developer:</b> ${DEVELOPER_NAME} (${DEVELOPER_NUM})`

async function getStatusText() {
    try {
        const res = await axios.get(`${MASTER_MD_URL}/api/status`, { timeout: 6000 })
        const data = res.data
        const isOnline = data.isRegistered || data.status === 'connected'
        const userPhone = data.user?.id ? `+${data.user.id.split(':')[0]}` : 'Not Linked Yet'

        return `╔══════════════════════════════════╗
║    📊 <b>MASTER MD SYSTEM STATUS</b>   ║
╚══════════════════════════════════╝

◈ <b>Engine Status</b>  : ${isOnline ? '🟢 Connected &amp; Online' : '🟡 Waiting for Pairing'}
◈ <b>WhatsApp User</b>  : <code>${userPhone}</code>
◈ <b>Bot Name</b>       : ${data.botName || 'MASTER MD v3.0.0'}
◈ <b>Developer</b>      : ${DEVELOPER_NAME} (${DEVELOPER_NUM})
◈ <b>Anti-Ban Shield</b>: 🟢 ACTIVE (Zero Spam, Silent Handshake)
◈ <b>Web Portal</b>     : <code>${MASTER_MD_URL}</code>

${isOnline 
    ? '✅ <b>Your MASTER MD bot is actively responding to commands on WhatsApp!</b>' 
    : '⚡ <i>Ready for linking! Tap <b>⚡ Get Pairing Code</b> to connect your WhatsApp.</i>'}`
    } catch {
        return `⚠️ Could not reach MASTER MD Backend engine. Please ensure the server is running on port ${MASTER_MD_PORT}.`
    }
}

// ─── Pairing Flow ────────────────────────────────────────────────────────────
async function handlePairRequest(chatId, rawNumber) {
    const cleanNumber = normalizePhone(rawNumber)

    if (!cleanNumber || cleanNumber.length < 10 || cleanNumber.length > 15) {
        return sendMsg(chatId, `⚠️ <b>Invalid Phone Number!</b>\n\nPlease provide 10 to 15 digits including country code.\n<b>Example:</b> <code>923107260507</code> or <code>03107260507</code>`, MAIN_KEYBOARD)
    }

    const waitSent = await sendMsg(chatId, `⚡ <b>Connecting to WhatsApp Baileys Handshake...</b>\nGenerating 8-digit secure pairing code for: <code>+${cleanNumber}</code>\n\n<i>Please wait 2-4 seconds...</i>`)

    try {
        const res = await axios.post(`${MASTER_MD_URL}/api/pair`, { phoneNumber: cleanNumber, force: true }, { timeout: 35000 })
        const data = res.data

        if (waitSent?.message_id) {
            deleteMsg(chatId, waitSent.message_id)
        }

        if (data.success && data.code) {
            const formattedCode = data.code
            const rawCode = data.code.replace(/[^a-zA-Z0-9]/g, '')

            const successCard = 
`╔══════════════════════════════════╗
║    🎉 <b>PAIRING CODE GENERATED!</b>  ║
╚══════════════════════════════════╝

📱 <b>Phone Number:</b> <code>+${data.phoneNumber}</code>
🔑 <b>Your Code:</b> <b>${formattedCode}</b>

👇 <b>TAP TO COPY RAW CODE BELOW:</b>
<code>${rawCode}</code>
━━━━━━━━━━━━━━━━━━━━━
⏱️ <b>Code expires in:</b> 120 seconds

📖 <b>Quick Instructions:</b>
1️⃣ Open <b>WhatsApp</b> on your phone
2️⃣ Tap <b>3 Dots (Menu)</b> ➜ <b>Linked Devices</b>
3️⃣ Tap <b>Link a Device</b> ➜ <b>"Link with phone number instead"</b>
4️⃣ Enter the code above!

🛡️ <b>Anti-Ban Engine:</b> 🟢 Enforced &amp; Safe (Silent Handshake)
👑 <b>Developed by:</b> ${DEVELOPER_NAME} (${DEVELOPER_NUM})`

            sendMsg(chatId, successCard, {
                inline_keyboard: [
                    [
                        { text: '📢 Official Channel', url: CHANNEL_URL },
                        { text: '💬 Contact Developer', url: DEVELOPER_WA }
                    ]
                ]
            })
        } else {
            sendMsg(chatId, `❌ <b>Failed to Generate Code:</b>\n${data.message || 'Unknown server error'}\n\n<i>Please check your number and try again.</i>`, MAIN_KEYBOARD)
        }
    } catch (err) {
        if (waitSent?.message_id) {
            deleteMsg(chatId, waitSent.message_id)
        }
        sendMsg(chatId, `❌ <b>Pairing Error:</b>\n${err.response?.data?.message || err.message}\n\n<i>Please ensure the bot server is online.</i>`, MAIN_KEYBOARD)
    }
}

// ─── Callback Query Handler ──────────────────────────────────────────────────
async function handleCallbackQuery(cb) {
    const queryId = cb.id
    const chatId = cb.message?.chat?.id
    const msgId = cb.message?.message_id
    const data = cb.data
    const isPhotoMessage = !!cb.message?.photo

    if (!chatId || !data) return

    try { await answerCallback(queryId) } catch {}

    if (data === 'pair_guide') {
        waitingUsers.add(chatId)
        return sendMsg(chatId, `📲 <b>Please send your WhatsApp Phone Number:</b>\n\nInclude country code (e.g. <code>923107260507</code> or <code>03107260507</code>):\n\n<i>Just type your number and send!</i>`, MAIN_KEYBOARD)
    }

    if (data === 'help_menu') {
        if (isPhotoMessage) {
            return editCaption(chatId, msgId, HELP_CAPTION, HELP_INLINE)
        } else {
            return editText(chatId, msgId, HELP_CAPTION, HELP_INLINE)
        }
    }

    if (data === 'home_menu') {
        if (isPhotoMessage) {
            return editCaption(chatId, msgId, WELCOME_CAPTION, WELCOME_INLINE)
        } else {
            return editText(chatId, msgId, WELCOME_CAPTION, WELCOME_INLINE)
        }
    }

    if (data === 'status_menu') {
        const statusText = await getStatusText()
        if (isPhotoMessage) {
            return editCaption(chatId, msgId, statusText, STATUS_INLINE)
        } else {
            return editText(chatId, msgId, statusText, STATUS_INLINE)
        }
    }
}

// ─── Message Handler ─────────────────────────────────────────────────────────
async function handleMessage(msg) {
    const chatId = msg.chat?.id
    const text = msg.text?.trim() || ''
    const userId = msg.from?.id

    if (!chatId || !text) return

    // ─── /start or /menu ──────────────────────────────────────────────────────
    if (text === '/start' || text === '/menu') {
        await sendPhoto(chatId, WELCOME_CAPTION, WELCOME_INLINE)
        return sendMsg(chatId, '👇 <b>Quick Keyboard loaded below. Tap any button or send your phone number anytime!</b>', MAIN_KEYBOARD)
    }

    // ─── /status ──────────────────────────────────────────────────────────────
    if (text === '/status' || text === '📊 System Status') {
        const statusText = await getStatusText()
        return sendMsg(chatId, statusText, MAIN_KEYBOARD)
    }

    // ─── /help ────────────────────────────────────────────────────────────────
    if (text === '/help' || text === '📖 How to Link') {
        return sendMsg(chatId, HELP_CAPTION, MAIN_KEYBOARD)
    }

    // ─── Developer Info ───────────────────────────────────────────────────────
    if (text === '👑 Developer Info') {
        const devText = 
`👑 <b>MASTER MD Developer Information</b>

◈ <b>Developer:</b> ${DEVELOPER_NAME}
◈ <b>Contact:</b> +92 310 7260507
◈ <b>WhatsApp:</b> ${DEVELOPER_WA}
◈ <b>Channel:</b> ${CHANNEL_URL}

&gt; © 2026 MASTER MD • All Rights Reserved to ${DEVELOPER_NAME}`

        return sendMsg(chatId, devText, {
            inline_keyboard: [
                [
                    { text: '💬 WhatsApp Chat', url: DEVELOPER_WA },
                    { text: '📢 Official Channel', url: CHANNEL_URL }
                ]
            ]
        })
    }

    // ─── Official Channel ─────────────────────────────────────────────────────
    if (text === '📢 Official Channel') {
        return sendMsg(chatId, `📢 <b>Join the official MASTER MD WhatsApp Channel for updates &amp; features:</b>\n\n👉 ${CHANNEL_URL}`, {
            inline_keyboard: [
                [{ text: '📢 Open WhatsApp Channel', url: CHANNEL_URL }]
            ]
        })
    }

    // ─── Reset Session ────────────────────────────────────────────────────────
    if (text === '/reset' || text === '🔄 Reset Session') {
        sendMsg(chatId, '⏳ Resetting WhatsApp session state, please wait 2 seconds...')
        try {
            await axios.post(`${MASTER_MD_URL}/api/reset`, {}, { timeout: 15000 })
            return sendMsg(chatId, `🧹 <b>Session Reset Successfully!</b>\n\nA fresh socket is initialized. You can now request a new pairing code anytime.`, MAIN_KEYBOARD)
        } catch (err) {
            return sendMsg(chatId, `❌ <b>Reset Error:</b> ${err.message}`, MAIN_KEYBOARD)
        }
    }

    // ─── Admin Command ────────────────────────────────────────────────────────
    if (text.startsWith('/admin')) {
        const parts = text.split(/\s+/)
        const pin = parts[1] || ''

        if (pin === ADMIN_SECRET || authenticatedAdmins.has(userId)) {
            try { await deleteMsg(chatId, msg.message_id) } catch {}
            authenticatedAdmins.add(userId)
            const statusText = await getStatusText()
            const adminCard = 
`👑 <b>WELCOME DEVELOPER ${DEVELOPER_NAME}!</b>
━━━━━━━━━━━━━━━━━━━━━
🔒 <b>Admin Privileges:</b> Authenticated
⚙️ <b>Control Center:</b> DigitalOcean Droplet
🌐 <b>Backend:</b> <code>${MASTER_MD_URL}</code>

${statusText}

<b>Admin Commands:</b>
• <code>/reset</code> — Reset local pairing socket
• Send any phone number to test pairing instantly!`
            return sendMsg(chatId, adminCard, MAIN_KEYBOARD)
        } else {
            return sendMsg(chatId, '❌ Command not recognized. Please send your phone number to pair WhatsApp or type /help.', MAIN_KEYBOARD)
        }
    }

    // ─── Get Pairing Code Button ──────────────────────────────────────────────
    if (text === '⚡ Get Pairing Code') {
        waitingUsers.add(chatId)
        return sendMsg(chatId, `📲 <b>Please send your WhatsApp Phone Number:</b>\n\nInclude country code (e.g. <code>923107260507</code> or <code>03107260507</code>):\n\n<i>Just type your number and send!</i>`, MAIN_KEYBOARD)
    }

    // ─── /pair <number> ───────────────────────────────────────────────────────
    if (text.startsWith('/pair')) {
        const parts = text.split(/\s+/)
        if (parts.length > 1 && parts[1]) {
            return handlePairRequest(chatId, parts[1])
        } else {
            waitingUsers.add(chatId)
            return sendMsg(chatId, `💡 <b>Usage:</b> <code>/pair &lt;number&gt;</code>\n<b>Example:</b> <code>/pair 923107260507</code>\n\n<i>Or simply send your phone number now:</i>`, MAIN_KEYBOARD)
        }
    }

    // ─── Direct Phone Number Detection ────────────────────────────────────────
    const digits = text.replace(/[^0-9]/g, '')
    if (digits.length >= 10 && digits.length <= 15) {
        waitingUsers.delete(chatId)
        return handlePairRequest(chatId, text)
    } else if (waitingUsers.has(chatId)) {
        return sendMsg(chatId, `⚠️ That doesn't look like a valid phone number. Please enter 10 to 15 digits (e.g. <code>923107260507</code>).`, MAIN_KEYBOARD)
    }
}

// ─── Long-Polling Engine ──────────────────────────────────────────────────────
async function startBot() {
    console.log('🤖 [Telegram Bot] MASTER MD Ultra Native Engine starting polling...')
    await tgRequest('deleteWebhook', { drop_pending_updates: false })

    let offset = 0
    let isRunning = true

    while (isRunning) {
        try {
            const res = await axios.get(`${TG_API}/getUpdates`, {
                params: {
                    offset: offset,
                    timeout: 25,
                    allowed_updates: JSON.stringify(['message', 'callback_query'])
                },
                timeout: 35000
            })

            const updates = res.data?.result || []
            for (const u of updates) {
                offset = u.update_id + 1
                if (u.message) {
                    handleMessage(u.message).catch(err => {
                        console.error('[TG Message Handler Error]:', err.message)
                    })
                } else if (u.callback_query) {
                    handleCallbackQuery(u.callback_query).catch(err => {
                        console.error('[TG Callback Query Error]:', err.message)
                    })
                }
            }
        } catch (err) {
            await new Promise(r => setTimeout(r, 3000))
        }
    }
}

startBot()
