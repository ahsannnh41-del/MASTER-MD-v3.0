// ═══════════════════════════════════════════════════════════════════
//  telegramPairing.js — MASTER MD Telegram Pairing Engine (Ultra Secure)
//  Developer: AHSAN (03107260507)
//  Channel  : https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
// ═══════════════════════════════════════════════════════════════════

import TelegramBotPkg from 'node-telegram-bot-api';
const TelegramBot = typeof TelegramBotPkg === 'function' ? TelegramBotPkg : (TelegramBotPkg?.default || TelegramBotPkg);
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logPairingAttempt, getPairingHistory, unlinkPairing, deletePairingRecord } from './pairingTracker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEVELOPER_NAME = 'AHSAN';
const DEVELOPER_NUM  = '03107260507';
const DEVELOPER_WA   = 'https://wa.me/923107260507';
const CHANNEL_URL    = 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46';
const WEB_PORTAL_URL = 'https://master-md-qx60.onrender.com/';
const ADMIN_SECRET   = '03107260507';

// In-Memory Authenticated Admin IDs (Never leaked to anyone)
const authenticatedAdmins = new Set();

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

function formatUptime(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d > 0 ? d + 'd ' : ''}${h}h ${m}m ${s}s`;
}

function normalizePhoneNumber(raw) {
    let n = String(raw || '').replace(/[^0-9]/g, '');
    if (n.startsWith('00')) n = n.slice(2);

    // Redundant trunk zero after Pakistan country code:
    // e.g. 9203107260507 -> 923107260507
    if (n.startsWith('920') && n.length === 13) {
        n = '92' + n.slice(3);
    } else if (n.startsWith('9203') && n.length >= 13) {
        n = '92' + n.slice(3);
    }
    // Pakistani local 03xx format: 03107260507 (11 digits) -> 923107260507
    else if (n.startsWith('03') && n.length === 11) {
        n = '92' + n.slice(1);
    } else if (n.startsWith('0') && n.length === 11) {
        n = '92' + n.slice(1);
    } else if (n.startsWith('3') && n.length === 10) {
        n = '92' + n;
    }

    // India: 910xxxxxxxxxx (13 digits) -> 91xxxxxxxxxx (12 digits)
    else if (n.startsWith('910') && n.length === 13) {
        n = '91' + n.slice(3);
    }

    // United Kingdom: 4407xxxxxxxxx (13 digits) -> 447xxxxxxxxx (12 digits)
    else if (n.startsWith('440') && n.length === 13) {
        n = '44' + n.slice(3);
    }

    // Indonesia: 6208xxxxxxxxxx -> 628xxxxxxxxxx
    else if (n.startsWith('620') && (n.length === 13 || n.length === 14)) {
        n = '62' + n.slice(3);
    }

    return n;
}

// ─── Public Welcome Caption (For Normal Users) ──────────────────────────────
const WELCOME_CAPTION =
`👋 *Welcome to MASTER MD Pairing Portal!* ⚡
_Next-Gen WhatsApp Multi-Device Powerhouse by AHSAN_

┏ 👤 *User*      : Private Session
┃ 👑 *Developer* : ${DEVELOPER_NAME} (${DEVELOPER_NUM})
┃ 🌟 *Status*    : 🟢 Online & Active
┗ ⚡ *Mode*      : Direct Cloud Socket Pairing

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

// ─── Public Inline Buttons Menu (ZERO ADMIN BUTTONS) ─────────────────────────
const PUBLIC_KEYBOARD = {
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
Simply reply to this chat with your phone number (e.g. \`923107260507\`).`;

const HELP_KEYBOARD = {
    inline_keyboard: [
        [
            { text: '🔙 Back to Home', callback_data: 'home_menu' },
            { text: '📢 Join Channel', url: CHANNEL_URL }
        ]
    ]
};

// Active user pairing sessions
const tgSessions = new Map();

/**
 * Start the Telegram pairing bot.
 */
export function startTelegramPairingBot(launchBotFn, sessionDir, delayFn, unlinkUserSessionFn = null) {
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
    console.log('⚡ MASTER MD — TELEGRAM DIRECT PAIRING ENGINE ACTIVE');
    console.log(`👑 Developer : ${DEVELOPER_NAME} (${DEVELOPER_NUM})`);
    console.log(`📢 Channel   : ${CHANNEL_URL}`);
    console.log('═'.repeat(60) + '\n');

    // Helper: Send banner image with fallback to text
    async function sendBanner(chatId, caption, keyboard = PUBLIC_KEYBOARD) {
        const photo = getBannerPhoto();
        if (photo) {
            try {
                return await bot.sendPhoto(chatId, photo, {
                    caption,
                    parse_mode: 'Markdown',
                    reply_markup: keyboard
                });
            } catch (err) {
                console.warn('[TelegramPairing] sendPhoto fallback:', err.message);
            }
        }
        return await bot.sendMessage(chatId, caption, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
            reply_markup: keyboard
        });
    }

    // Helper: Build Admin Dashboard (Only sent to verified admin)
    function buildAdminDashboard() {
        const history = getPairingHistory();
        const total = history.length;
        const teleCount = history.filter(x => x.source && x.source.toLowerCase().includes('telegram')).length;
        const webCount = history.filter(x => x.source && x.source.toLowerCase().includes('web')).length;
        const connectedCount = history.filter(x => x.status && x.status.includes('Connected')).length;
        const uptimeStr = formatUptime(process.uptime());
        const ramMb = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);

        const caption =
`╔══════════════════════════════════════╗
║   ⚡ *MASTER MD — DEVELOPER DASHBOARD* ⚡ ║
╚══════════════════════════════════════╝

👑 *Architect:* ${DEVELOPER_NAME} (${DEVELOPER_NUM})
🟢 *Engine Status:* Online & Active
⏰ *Uptime:* \`${uptimeStr}\`
💾 *Memory:* \`${ramMb} MB\`

┏ 📊 *PAIRING METRICS SUMMARY:*
┃ 👥 *Total Logged:* \`${total} Users\`
┃ 🟢 *Connected Live:* \`${connectedCount} Active\`
┃ ✈️ *From Telegram:* \`${teleCount}\`
┗ 🌐 *From Web Portal:* \`${webCount}\`

👇 *Select management option:*`;

        const keyboard = {
            inline_keyboard: [
                [
                    { text: '👥 View Linked Users List', callback_data: 'adm_users' },
                    { text: '📊 Engine Stats', callback_data: 'adm_stats' }
                ],
                [
                    { text: '🌐 Open Web Admin Portal', url: `${WEB_PORTAL_URL}admin?pin=${ADMIN_SECRET}` }
                ],
                [
                    { text: '🔄 Refresh Dashboard', callback_data: 'adm_refresh' }
                ]
            ]
        };

        return { caption, keyboard };
    }

    // ── /start & /menu (Public) ───────────────────────────────────────────
    bot.onText(/\/(start|menu)/, async (msg) => {
        await sendBanner(msg.chat.id, WELCOME_CAPTION, PUBLIC_KEYBOARD);
    });

    // ── /help (Public) ────────────────────────────────────────────────────
    bot.onText(/\/help/, async (msg) => {
        await bot.sendMessage(msg.chat.id, HELP_CAPTION, {
            parse_mode: 'Markdown',
            reply_markup: HELP_KEYBOARD
        });
    });

    // ── /pair (Public) ────────────────────────────────────────────────────
    bot.onText(/\/pair/, async (msg) => {
        await bot.sendMessage(msg.chat.id,
`📱 *Enter Your WhatsApp Number:*

Please send your phone number with your country code:
_Example: \`923107260507\` or \`+92 310 7260507\`_

⚡ *Direct Cloud Pairing Active* — Web connection not required!`,
            { parse_mode: 'Markdown' }
        );
    });

    // ── Secret /admin Command (NO LEAKAGE, NO PUBLIC TRACE) ───────────────
    bot.onText(/\/admin(.*)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from?.id;
        const rawArg = (match[1] || '').trim();

        // If correct secret PIN is provided OR already authenticated:
        if (rawArg === ADMIN_SECRET || authenticatedAdmins.has(userId)) {
            // Delete the message with the PIN for maximum privacy
            try { await bot.deleteMessage(chatId, msg.message_id); } catch {}

            authenticatedAdmins.add(userId);
            const { caption, keyboard } = buildAdminDashboard();
            await bot.sendMessage(chatId, `👑 *Welcome back, Master Developer (${DEVELOPER_NAME})!*`, { parse_mode: 'Markdown' });
            return await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown', reply_markup: keyboard });
        }

        // For anyone else who types /admin with wrong or no PIN:
        // NEVER REVEAL THE PIN! Behave like an unrecognized command.
        await bot.sendMessage(chatId, '❌ Command not recognized. Please send your phone number to pair WhatsApp or type /help.', {
            parse_mode: 'Markdown'
        });
    });

    // ── Secret Admin Command: /unlink (Disconnect & Terminate Session) ──────
    bot.onText(/\/unlink(?:\s+(.+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from?.id;

        if (!authenticatedAdmins.has(userId)) {
            return bot.sendMessage(chatId, '❌ Command not recognized.', { parse_mode: 'Markdown' });
        }

        const rawTarget = (match[1] || '').trim().replace(/[^0-9]/g, '');
        if (!rawTarget) {
            return bot.sendMessage(chatId,
`ℹ️ *How to Unlink a WhatsApp User:*
Usage: \`/unlink <phone_number>\`
Example: \`/unlink 923107260507\`

💡 _You can also tap *View Linked Users List* in the dashboard to unlink with 1 click!_`,
                { parse_mode: 'Markdown' }
            );
        }

        try {
            if (typeof unlinkUserSessionFn === 'function') {
                await unlinkUserSessionFn(rawTarget);
            } else {
                unlinkPairing(rawTarget);
            }

            await bot.sendMessage(chatId,
`✅ *USER UNLINKED & DISCONNECTED!*
━━━━━━━━━━━━━━━━━━━━━
📱 Phone : \`+${rawTarget}\`
🔴 Status: *Unlinked & Terminated*
🔒 WhatsApp socket logged out & credentials wiped.
━━━━━━━━━━━━━━━━━━━━━`,
                { parse_mode: 'Markdown' }
            );
        } catch (err) {
            await bot.sendMessage(chatId, `❌ Failed to unlink user: ${err.message}`);
        }
    });

    // ── Secret Admin Command: /delete (Remove from database) ───────────────
    bot.onText(/\/delete(?:\s+(.+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from?.id;

        if (!authenticatedAdmins.has(userId)) {
            return bot.sendMessage(chatId, '❌ Command not recognized.', { parse_mode: 'Markdown' });
        }

        const rawTarget = (match[1] || '').trim().replace(/[^0-9]/g, '');
        if (!rawTarget) {
            return bot.sendMessage(chatId, `Usage: \`/delete <phone_number>\`\nExample: \`/delete 923107260507\``, { parse_mode: 'Markdown' });
        }

        deletePairingRecord(rawTarget);
        await bot.sendMessage(chatId, `🗑️ Record for \`+${rawTarget}\` removed from history directory!`, { parse_mode: 'Markdown' });
    });

    // ── Callback Queries ──────────────────────────────────────────────────
    bot.on('callback_query', async (query) => {
        const chatId = query.message?.chat?.id;
        const msgId  = query.message?.message_id;
        const userId = query.from?.id;
        const data   = query.data;

        try { await bot.answerCallbackQuery(query.id); } catch {}

        // ── Admin-Only Callbacks (Strictly Protected) ─────────────────────
        if (data.startsWith('adm_')) {
            if (!authenticatedAdmins.has(userId)) {
                // Silently reject unauthorized users
                return;
            }

            if (data === 'adm_refresh') {
                const { caption, keyboard } = buildAdminDashboard();
                try {
                    await bot.editMessageText(caption, {
                        chat_id: chatId,
                        message_id: msgId,
                        parse_mode: 'Markdown',
                        reply_markup: keyboard
                    });
                } catch {
                    await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown', reply_markup: keyboard });
                }
            } else if (data.startsWith('adm_un_')) {
                const phoneToUnlink = data.replace('adm_un_', '').trim();
                try {
                    if (typeof unlinkUserSessionFn === 'function') {
                        await unlinkUserSessionFn(phoneToUnlink);
                    } else {
                        unlinkPairing(phoneToUnlink);
                    }
                    await bot.answerCallbackQuery(query.id, {
                        text: `✅ +${phoneToUnlink} unlinked!`,
                        show_alert: true
                    });
                    await bot.sendMessage(chatId, `🛑 *Bot Unlinked & Disconnected for +${phoneToUnlink}!*`, { parse_mode: 'Markdown' });
                } catch (e) {
                    await bot.sendMessage(chatId, `❌ Failed to unlink +${phoneToUnlink}: ${e.message}`);
                }
                return;
            } else if (data === 'adm_users') {
                const history = getPairingHistory();
                if (!history.length) {
                    return bot.sendMessage(chatId, '📋 No pairing records logged yet.', {
                        reply_markup: {
                            inline_keyboard: [[{ text: '🔙 Back to Dashboard', callback_data: 'adm_refresh' }]]
                        }
                    });
                }

                const recent = history.slice(0, 15);
                let text = `📋 *LINKED USERS DIRECTORY (${recent.length}/${history.length}):*\n━━━━━━━━━━━━━━━━━━━━━\n\n`;

                recent.forEach((u, i) => {
                    const sourceEmoji = u.source && u.source.toLowerCase().includes('telegram') ? '✈️ Telegram' : '🌐 Web';
                    const statusEmoji = u.status && u.status.includes('Connected') 
                        ? '🟢 Connected' 
                        : (u.status && u.status.includes('Unlinked') ? '🔴 Unlinked' : '⏳ Generated');
                    const timeStr = u.createdAt ? new Date(u.createdAt).toLocaleDateString() + ' ' + new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent';
                    text += `*${i + 1}.* \`+${u.phone}\`\n   • ${sourceEmoji} | ${statusEmoji}\n   • Key: \`${u.code || '--------'}\` | ${timeStr}\n   • [Chat WhatsApp](https://wa.me/${u.phone})\n\n`;
                });

                text += `━━━━━━━━━━━━━━━━━━━━━\n💡 _Showing latest 15 pairs. To unlink, tap below or send \`/unlink <phone>\`._`;

                // Add quick 1-tap unlink buttons for recent users
                const unlinkButtons = [];
                recent.slice(0, 4).forEach((u) => {
                    unlinkButtons.push({
                        text: `❌ Unlink +${u.phone.slice(-6)}`,
                        callback_data: `adm_un_${u.phone}`
                    });
                });

                const usersKeyboardRows = [];
                for (let k = 0; k < unlinkButtons.length; k += 2) {
                    usersKeyboardRows.push(unlinkButtons.slice(k, k + 2));
                }

                usersKeyboardRows.push([
                    { text: '🔄 Refresh List', callback_data: 'adm_users' },
                    { text: '🔙 Back to Dashboard', callback_data: 'adm_refresh' }
                ]);
                usersKeyboardRows.push([
                    { text: '🌐 View All on Web Admin', url: `${WEB_PORTAL_URL}admin?pin=${ADMIN_SECRET}` }
                ]);

                await bot.sendMessage(chatId, text, {
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true,
                    reply_markup: { inline_keyboard: usersKeyboardRows }
                });
            } else if (data === 'adm_stats') {
                const ramMb = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
                const heapMb = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
                const statsText =
`📊 *MASTER MD ENGINE DIAGNOSTICS:*
━━━━━━━━━━━━━━━━━━━━━
🟢 *Server Engine:* Online
⏰ *Process Uptime:* ${formatUptime(process.uptime())}
💾 *RSS Memory:* ${ramMb} MB
📈 *Heap Used:* ${heapMb} MB
⚙️ *Node Version:* ${process.version}
📡 *Baileys Multi-Device:* v6.7.23
👑 *Developer:* ${DEVELOPER_NAME} (${DEVELOPER_NUM})
━━━━━━━━━━━━━━━━━━━━━`;

                await bot.sendMessage(chatId, statsText, {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: '🔙 Back to Dashboard', callback_data: 'adm_refresh' }]]
                    }
                });
            }
            return;
        }

        // ── Public Callbacks ──────────────────────────────────────────────
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
                    reply_markup: PUBLIC_KEYBOARD
                });
            } catch {
                await sendBanner(chatId, WELCOME_CAPTION, PUBLIC_KEYBOARD);
            }
        } else if (data === 'pair_guide') {
            await bot.sendMessage(chatId,
`📱 *Ready for Pairing!*

Just reply to this chat with your *WhatsApp number* (with country code):
👉 Example: \`923107260507\`

⚡ *Direct Socket Engine:* Generates your 8-digit pairing key directly via WhatsApp Multi-Device protocol!`,
                { parse_mode: 'Markdown' }
            );
        }
    });

    // ── Main Listener: Direct Baileys Pairing via Telegram ────────────────
    bot.on('message', async (msg) => {
        const text = (msg.text || '').trim();
        if (!text || text.startsWith('/')) return;

        const chatId = msg.chat.id;
        const userId = msg.from?.id;
        const cleanNumber = normalizePhoneNumber(text);

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
            return bot.sendMessage(chatId, '⏳ Please wait! Your pairing key is already being generated...');
        }

        tgSessions.set(userId, { status: 'pending', phone: cleanNumber });

        // Stylish animated progress card
        let progressMsg;
        try {
            progressMsg = await bot.sendMessage(chatId,
`╔══════════════════════════════════════╗
║   ⚡ *MASTER MD DIRECT SOCKET* ⚡    ║
╚══════════════════════════════════════╝

📱 *Target Socket*  : \`+${cleanNumber}\`
🔄 *State*          : Direct Baileys Multi-Device Handshake...
🔐 *Encryption*     : E2EE Signal Protocol
⏳ *Progress*       : [ ▓▓▓▓▓▓▓▓▓▓░░ ] 85%

_⚡ Generating 8-digit pairing key directly... Please wait 10-15s._`,
                { parse_mode: 'Markdown' }
            );
        } catch {}

        // Direct Socket Pairing (Does NOT rely on Web Portal!)
        (async () => {
            try {
                let activeSock = null;

                // Clean unauthenticated session files if any exist before fresh pairing
                let isRegistered = false;
                try {
                    const credsPath = path.join(sessionDir, 'creds.json');
                    if (fs.existsSync(credsPath)) {
                        const credsData = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
                        isRegistered = !!credsData.registered;
                    }
                } catch {}

                if (!isRegistered) {
                    try {
                        if (fs.existsSync(sessionDir)) {
                            const files = fs.readdirSync(sessionDir);
                            for (const f of files) {
                                if (f !== 'pairing_history.json') {
                                    fs.rmSync(path.join(sessionDir, f), { recursive: true, force: true });
                                }
                            }
                        }
                    } catch {}
                }

                // Launch Baileys socket directly for this number
                await launchBotFn(sessionDir, cleanNumber, (sock) => {
                    activeSock = sock;
                });

                // Allow socket 2.5 seconds to establish initial connection
                await delayFn(2500);

                let pairingCode = null;
                for (let attempt = 1; attempt <= 4; attempt++) {
                    try {
                        if (activeSock && typeof activeSock.requestPairingCode === 'function') {
                            pairingCode = await activeSock.requestPairingCode(cleanNumber);
                            if (pairingCode) break;
                        }
                    } catch (err) {
                        console.warn(`[TelegramPairing] Direct attempt ${attempt} warning:`, err.message);
                    }
                    if (attempt < 4) await delayFn(1500);
                }

                if (!pairingCode) {
                    throw new Error('WhatsApp server did not return a pairing code in time. Please try again.');
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
⚡ *Mode:* Linked device runs MASTER MD 24/7!

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
                console.log(`[TelegramPairing] ✅ Delivered code ${displayCode} directly to Telegram user ${userId}`);

                // Real-time Telegram notification to all authenticated admins
                for (const adminChatId of authenticatedAdmins) {
                    try {
                        await bot.sendMessage(adminChatId,
`🔔 *NEW USER PAIRING ALERT!*
📱 Phone: \`+${cleanNumber}\`
✈️ Source: *Telegram Direct Socket*
🔑 Code: \`${displayCode}\`
⏰ Time: ${new Date().toLocaleTimeString()}`,
                            { parse_mode: 'Markdown' }
                        );
                    } catch {}
                }

            } catch (err) {
                console.error('[TelegramPairing] Direct pairing error:', err.message);
                tgSessions.set(userId, { status: 'error', phone: cleanNumber, error: err.message });

                if (progressMsg) {
                    try { await bot.deleteMessage(chatId, progressMsg.message_id); } catch {}
                }

                await bot.sendMessage(chatId,
`❌ *Direct Pairing Error*

*Reason:* \`${err.message || 'Could not connect to WhatsApp socket.'}\`

💡 *Tips to Fix:*
• Make sure the phone number has an active WhatsApp account.
• Check your country code.
• Try again in 30 seconds by resending your phone number.`,
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
