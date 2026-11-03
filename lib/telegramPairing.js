// ═══════════════════════════════════════════════════════════════════
//  telegramPairing.js — MASTER MD Telegram Pairing Bot (Stylish Edition)
//  Developer: AHSAN (03107260507)
//  Channel  : https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
// ═══════════════════════════════════════════════════════════════════

import TelegramBotPkg from 'node-telegram-bot-api';
const TelegramBot = typeof TelegramBotPkg === 'function' ? TelegramBotPkg : (TelegramBotPkg?.default || TelegramBotPkg);
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logPairingAttempt } from './pairingTracker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEVELOPER_NAME = 'AHSAN';
const DEVELOPER_NUM  = '03107260507';
const DEVELOPER_WA   = 'https://wa.me/923107260507';
const CHANNEL_URL    = 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46';
const WEB_PORTAL_URL = 'https://master-md-qx60.onrender.com/';

// Locate official bot banner image
function getBannerPhoto() {
    const candidatePaths = [
        path.join(process.cwd(), 'media', 'thumbnail.png'),
        path.join(__dirname, '..', 'media', 'thumbnail.png'),
        path.join(process.cwd(), 'media', 'thumbnail.jpg'),
    ];
    for (const p of candidatePaths) {
        try {
            if (fs.existsSync(p)) {
                return fs.readFileSync(p);
            }
        } catch {}
    }
    return null;
}

// Stylish Main Menu Text
const WELCOME_CAPTION =
`👋 *Welcome to MASTER MD Pairing Portal!* ⚡
_Next-Gen WhatsApp Multi-Device Powerhouse by AHSAN_

┏ 👤 *User*      : Private Session
┃ 👑 *Developer* : ${DEVELOPER_NAME} (${DEVELOPER_NUM})
┃ 🌟 *Status*    : 🟢 Online & Active
┗ ⚡ *Mode*      : High-Speed Web Pairing

┏ 📦 *Version*   : v3.0.0
┃ 🟢 *Node.js*   : Node v20+
┗ 📚 *Engine*    : Baileys Multi-Device

┏ 💾 *Security*  : End-to-End Encrypted
┃ 📊 *Features*  : 2000+ Commands Ready
┗ 🔖 *Platform*  : WhatsApp Multi-Device

╭─〔 📋 *How to Link Your WhatsApp* 〕
│ 1️⃣ Type your WhatsApp number with country code
│    _Example: \`923107260507\`_
│ 2️⃣ Wait 10-15s for your 8-digit Pairing Key
│ 3️⃣ Open *WhatsApp* ➔ *Linked Devices* ➔ Enter Key!
╰──────────────────────────────────────
💡 _Send your phone number below to get started!_`;

// Stylish Inline Buttons Menu
const MAIN_KEYBOARD = {
    inline_keyboard: [
        [
            { text: '⚡ Pair WhatsApp (Send Number)', callback_data: 'pair_guide' },
        ],
        [
            { text: '📢 Official Channel', url: CHANNEL_URL },
            { text: '👑 Developer Info', url: DEVELOPER_WA }
        ],
        [
            { text: '🌐 Open Web Portal', url: WEB_PORTAL_URL },
            { text: '📋 Bot Commands Help', callback_data: 'help_menu' }
        ]
    ]
};

const HELP_CAPTION =
`╔══════════════════════════════════════╗
║   📋 *MASTER MD COMMAND GUIDE* ⚡    ║
╚══════════════════════════════════════╝

*How to use MASTER MD once linked:*
• \`.menu\` — Interactive button dashboard
• \`.allmenu\` — Complete directory of 2,000+ features
• \`.ping\` — Real-time server latency check
• \`.owner\` — Official developer contact
• \`.ai\` — Artificial Intelligence chat assistant
• \`.menuadmin\` — Group administration & anti-delete

💡 *To pair right now:*
Simply reply to this message with your phone number (e.g. \`923107260507\`).`;

const HELP_KEYBOARD = {
    inline_keyboard: [
        [
            { text: '🔙 Back to Home', callback_data: 'home_menu' },
            { text: '📢 Join Channel', url: CHANNEL_URL }
        ]
    ]
};

// Active pairing tracking
const tgSessions = new Map();

/**
 * Start the Telegram pairing bot.
 */
export function startTelegramPairingBot(launchBotFn, sessionDir, delayFn) {
    const token = process.env.TELEGRAM_BOT_TOKEN || '9104594619:AAHaspLTBfwlKCTSU1xsmCPi0GZ-bFAP2M8';

    if (!token) {
        console.log('⚠️ [TelegramPairing] TELEGRAM_BOT_TOKEN not set — Telegram bot disabled.');
        return null;
    }

    let bot;
    try {
        bot = new TelegramBot(token, { polling: true });
    } catch (err) {
        console.error('[TelegramPairing] Failed to create bot:', err.message);
        return null;
    }

    console.log('\n' + '═'.repeat(60));
    console.log('⚡ MASTER MD — STYLISH TELEGRAM PAIRING BOT ONLINE');
    console.log(`👑 Developer : ${DEVELOPER_NAME} (${DEVELOPER_NUM})`);
    console.log(`📢 Channel   : ${CHANNEL_URL}`);
    console.log('═'.repeat(60) + '\n');

    // Helper: Send banner image with fallback to text
    async function sendBanner(chatId, caption, keyboard = MAIN_KEYBOARD) {
        const photo = getBannerPhoto();
        if (photo) {
            try {
                return await bot.sendPhoto(chatId, photo, {
                    caption,
                    parse_mode: 'Markdown',
                    reply_markup: keyboard
                });
            } catch (err) {
                console.warn('[TelegramPairing] sendPhoto failed, falling back to message:', err.message);
            }
        }
        return await bot.sendMessage(chatId, caption, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
            reply_markup: keyboard
        });
    }

    // ── /start & /menu ────────────────────────────────────────────────────
    bot.onText(/\/(start|menu)/, async (msg) => {
        await sendBanner(msg.chat.id, WELCOME_CAPTION, MAIN_KEYBOARD);
    });

    // ── /help ─────────────────────────────────────────────────────────────
    bot.onText(/\/help/, async (msg) => {
        await bot.sendMessage(msg.chat.id, HELP_CAPTION, {
            parse_mode: 'Markdown',
            reply_markup: HELP_KEYBOARD
        });
    });

    // ── /pair ─────────────────────────────────────────────────────────────
    bot.onText(/\/pair/, async (msg) => {
        await bot.sendMessage(msg.chat.id,
`📱 *Enter Your WhatsApp Number:*

Please send your phone number with your country code:
_Example: \`923107260507\` or \`+92 310 7260507\`_

⚡ *Supported Countries:* Pakistan (+92), India (+91), Bangladesh (+880), USA (+1), and 190+ countries worldwide!`,
            { parse_mode: 'Markdown' }
        );
    });

    // ── Callback Queries (Interactive Buttons) ────────────────────────────
    bot.on('callback_query', async (query) => {
        const chatId = query.message?.chat?.id;
        const msgId  = query.message?.message_id;
        const data   = query.data;

        try {
            await bot.answerCallbackQuery(query.id);
        } catch {}

        if (data === 'help_menu') {
            try {
                await bot.editMessageCaption(HELP_CAPTION, {
                    chat_id: chatId,
                    message_id: msgId,
                    parse_mode: 'Markdown',
                    reply_markup: HELP_KEYBOARD
                });
            } catch {
                await bot.sendMessage(chatId, HELP_CAPTION, {
                    parse_mode: 'Markdown',
                    reply_markup: HELP_KEYBOARD
                });
            }
        } else if (data === 'home_menu') {
            try {
                await bot.editMessageCaption(WELCOME_CAPTION, {
                    chat_id: chatId,
                    message_id: msgId,
                    parse_mode: 'Markdown',
                    reply_markup: MAIN_KEYBOARD
                });
            } catch {
                await sendBanner(chatId, WELCOME_CAPTION, MAIN_KEYBOARD);
            }
        } else if (data === 'pair_guide') {
            await bot.sendMessage(chatId,
`📱 *Ready for Pairing!*

Just reply to this chat with your *WhatsApp number* (with country code):
👉 Example: \`923107260507\`

Our cloud server will generate your 8-digit code in 10-15 seconds.`,
                { parse_mode: 'Markdown' }
            );
        }
    });

    // ── Main Listener: User sends their phone number ──────────────────────
    bot.on('message', async (msg) => {
        const text = (msg.text || '').trim();
        if (!text || text.startsWith('/')) return;

        const chatId = msg.chat.id;
        const userId = msg.from?.id;
        const cleanNumber = text.replace(/[^0-9]/g, '');

        if (!cleanNumber || cleanNumber.length < 10 || cleanNumber.length > 15) {
            return bot.sendMessage(chatId,
`⚠️ *Invalid Phone Number Format!*

Please provide a valid 10–15 digit phone number including your country code.

*Examples:*
🇵🇰 Pakistan  : \`923107260507\`
🇮🇳 India     : \`919876543210\`
🇺🇸 USA       : \`12025550123\``,
                { parse_mode: 'Markdown' }
            );
        }

        if (tgSessions.get(userId)?.status === 'pending') {
            return bot.sendMessage(chatId, '⏳ Please wait! Your code is already being prepared...');
        }

        tgSessions.set(userId, { status: 'pending', phone: cleanNumber });

        // Stylish animated progress card
        let progressMsg;
        try {
            progressMsg = await bot.sendMessage(chatId,
`╔══════════════════════════════════════╗
║   ⚡ *MASTER MD CLOUD ENGINE* ⚡     ║
╚══════════════════════════════════════╝

📱 *Target Socket*  : \`+${cleanNumber}\`
🔄 *State*          : Establishing WhatsApp handshake...
🔐 *Encryption*     : E2EE Signal Protocol (Multi-Device)
⏳ *Progress*       : [ ▓▓▓▓▓▓▓▓▓▓░░ ] 80%

_⚡ Connecting to WhatsApp servers... Code will appear shortly._`,
                { parse_mode: 'Markdown' }
            );
        } catch {}

        // Launch Pairing Asynchronously
        (async () => {
            try {
                let activeSock = null;

                await launchBotFn(sessionDir, cleanNumber, (sock) => {
                    activeSock = sock;
                });

                await delayFn(4500);

                let pairingCode = null;
                for (let attempt = 1; attempt <= 3; attempt++) {
                    try {
                        pairingCode = await activeSock.requestPairingCode(cleanNumber);
                        if (pairingCode) break;
                    } catch (err) {
                        console.warn(`[TelegramPairing] Code attempt ${attempt} warning:`, err.message);
                        if (attempt === 3) throw err;
                        await delayFn(2000);
                    }
                }

                tgSessions.set(userId, { status: 'done', phone: cleanNumber, code: pairingCode });
                logPairingAttempt(cleanNumber, 'Telegram Bot', pairingCode);

                const rawCode = String(pairingCode || '').trim();
                const displayCode = rawCode.length === 8 ? `${rawCode.slice(0, 4)} - ${rawCode.slice(4)}` : rawCode;

                if (progressMsg) {
                    try { await bot.deleteMessage(chatId, progressMsg.message_id); } catch {}
                }

                // Stylish Pairing Code Card
                const SUCCESS_CARD =
`╔══════════════════════════════════════╗
║   ⚡ *WHATSAPP PAIRING KEY READY* ⚡  ║
╚══════════════════════════════════════╝

┏ 🔑 *Your Official Pairing Code:*
┃
┃   👉  \`${displayCode}\`  👈
┃
┗ 💡 _(Tap code above to copy it automatically!)_

╭─〔 📋 *How to Activate on WhatsApp* 〕
│ 1️⃣ Open *WhatsApp* on your phone
│ 2️⃣ Tap ⋮ (3 dots menu) ➔ *Linked Devices*
│ 3️⃣ Tap *Link a Device*
│ 4️⃣ Tap *Link with phone number instead*
│ 5️⃣ Enter code: \`${displayCode}\`
╰──────────────────────────────────────

⏰ *Notice:* Code expires in 120 seconds!
⚡ *Mode:* Linked device will run MASTER MD 24/7!

━━━━━━━━━━━━━━━━━━━━━━━━
👑 *Developer:* ${DEVELOPER_NAME} (${DEVELOPER_NUM})
📢 [Join MASTER MD Official Channel](${CHANNEL_URL})`;

                const CODE_KEYBOARD = {
                    inline_keyboard: [
                        [
                            { text: '📢 Official Channel', url: CHANNEL_URL },
                            { text: '👑 Developer Help', url: DEVELOPER_WA }
                        ],
                        [
                            { text: '🔄 Generate New Code', callback_data: 'pair_guide' }
                        ]
                    ]
                };

                await sendBanner(chatId, SUCCESS_CARD, CODE_KEYBOARD);
                console.log(`[TelegramPairing] ✅ Delivered code ${displayCode} to Telegram user ${userId}`);

            } catch (err) {
                console.error('[TelegramPairing] Error:', err.message);
                tgSessions.set(userId, { status: 'error', phone: cleanNumber, error: err.message });

                if (progressMsg) {
                    try { await bot.deleteMessage(chatId, progressMsg.message_id); } catch {}
                }

                await bot.sendMessage(chatId,
`❌ *Pairing Session Error*

*Reason:* \`${err.message || 'Could not connect to WhatsApp socket.'}\`

💡 *Tips to Fix:*
• Make sure the number has active WhatsApp.
• Double check the country code.
• Try again by sending your number again in 30s.`,
                    { parse_mode: 'Markdown' }
                );
            }
        })();
    });

    bot.on('polling_error', (err) => {
        if (err.code !== 'EFATAL') return;
        console.error('[TelegramPairing Polling Error]:', err.message);
    });

    return bot;
}
