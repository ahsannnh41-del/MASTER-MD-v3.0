/**
 * ═══════════════════════════════════════════════════════════════════
 *  MASTER MD — Telegram Pairing Bot (Standalone Ultra Secure Edition)
 *  Developer : AHSAN (03107260507)
 *  Channel   : https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46
 * ═══════════════════════════════════════════════════════════════════
 */

import TelegramBotPkg from 'node-telegram-bot-api';
const TelegramBot = typeof TelegramBotPkg === 'function' ? TelegramBotPkg : (TelegramBotPkg?.default || TelegramBotPkg);
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Configuration ──────────────────────────────────────────────────────────
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '9104594619:AAHaspLTBfwlKCTSU1xsmCPi0GZ-bFAP2M8';
const MASTER_MD_URL  = (process.env.MASTER_MD_URL || 'https://master-md-qx60.onrender.com').replace(/\/+$/, '');

const DEVELOPER_NAME = 'AHSAN';
const DEVELOPER_NUM  = '03107260507';
const DEVELOPER_WA   = 'https://wa.me/923107260507';
const CHANNEL_URL    = 'https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46';
const WEB_PORTAL_URL = 'https://master-md-qx60.onrender.com/';
const ADMIN_SECRET   = '03107260507';

// Persistent Admin Set (Never leaked)
const authenticatedAdmins = new Set();

if (!TELEGRAM_TOKEN) {
    console.error('\n❌ ERROR: Please set your TELEGRAM_BOT_TOKEN!');
    process.exit(1);
}

// Locate official bot banner image
function getBannerPhoto() {
    const candidatePaths = [
        path.join(process.cwd(), 'media', 'thumbnail.png'),
        path.join(__dirname, 'media', 'thumbnail.png'),
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

// ─── Bulletproof Phone Number Normalizer ──────────────────────────────────
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

// ─── Initialize Telegram Bot ───────────────────────────────────────────────
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

console.log('\n' + '═'.repeat(60));
console.log('⚡ MASTER MD — TELEGRAM PAIRING BOT ONLINE');
console.log(`👑 Developer : ${DEVELOPER_NAME} (${DEVELOPER_NUM})`);
console.log(`📢 Channel   : ${CHANNEL_URL}`);
console.log(`🌐 Bot API   : ${MASTER_MD_URL}`);
console.log('═'.repeat(60) + '\n');

// ─── Public Welcome (No Admin Buttons) ──────────────────────────────────────
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

// Public Keyboard (NO ADMIN BUTTONS EVER SHOWN)
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
Simply reply to this message with your phone number (e.g. \`923107260507\`).`;

const HELP_KEYBOARD = {
    inline_keyboard: [
        [
            { text: '🔙 Back to Home', callback_data: 'home_menu' },
            { text: '📢 Join Channel', url: CHANNEL_URL }
        ]
    ]
};

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

// Fetch Admin Data
async function fetchAdminData() {
    try {
        const res = await fetch(`${MASTER_MD_URL}/api/admin/history?pin=${ADMIN_SECRET}`);
        if (res.ok) {
            return await res.json();
        }
    } catch {}
    return { history: [], uptime: process.uptime() };
}

// Build Admin Dashboard
async function getAdminDashboardData() {
    const data = await fetchAdminData();
    const history = data.history || [];
    const total = history.length;
    const teleCount = history.filter(x => x.source && x.source.toLowerCase().includes('telegram')).length;
    const webCount = history.filter(x => x.source && x.source.toLowerCase().includes('web')).length;
    const connectedCount = history.filter(x => x.status && x.status.includes('Connected')).length;
    const uptimeStr = formatUptime(data.uptime || process.uptime());

    const caption =
`╔══════════════════════════════════════╗
║   ⚡ *MASTER MD — DEVELOPER DASHBOARD* ⚡ ║
╚══════════════════════════════════════╝

👑 *Architect:* ${DEVELOPER_NAME} (${DEVELOPER_NUM})
🟢 *Engine Status:* Online & Active
⏰ *Uptime:* \`${uptimeStr}\`

┏ 📊 *PAIRING METRICS SUMMARY:*
┃ 👥 *Total Logged:* \`${total} Users\`
┃ 🟢 *Connected Live:* \`${connectedCount} Active\`
┃ ✈️ *From Telegram:* \`${teleCount}\`
┗ 🌐 *From Web Portal:* \`${webCount}\`

👇 *Select management option:*`;

    const keyboard = {
        inline_keyboard: [
            [
                { text: '👥 View Linked Users List', callback_data: 'adm_users' }
            ],
            [
                { text: '🌐 Open Web Admin Portal', url: `${WEB_PORTAL_URL}admin?pin=${ADMIN_SECRET}` }
            ],
            [
                { text: '🔄 Refresh Dashboard', callback_data: 'adm_refresh' }
            ]
        ]
    };

    return { caption, keyboard, history };
}

// Active user tracking
const activeSessions = new Map();

// Helper: Request Pairing Code from MASTER MD Backend
async function requestPairingCode(phoneNumber) {
    const pairUrl = `${MASTER_MD_URL}/api/pair`;
    const pairRes = await fetch(pairUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
    });

    let pairData;
    try {
        pairData = await pairRes.json();
    } catch {
        throw new Error('MASTER MD cloud backend is currently offline. Please wait 30 seconds.');
    }

    if (!pairRes.ok && !pairData.sessionId) {
        throw new Error(pairData.message || 'Failed to start pairing session.');
    }

    if (pairData.code) {
        return { sessionId: pairData.sessionId, code: pairData.code };
    }

    const sessionId = pairData.sessionId;
    if (!sessionId) {
        throw new Error('No session ID received from pairing backend.');
    }

    const startTime = Date.now();
    const TIMEOUT_MS = 45_000;

    while (Date.now() - startTime < TIMEOUT_MS) {
        await new Promise(r => setTimeout(r, 2000));

        try {
            const statusUrl = `${MASTER_MD_URL}/api/status?id=${encodeURIComponent(sessionId)}`;
            const statusRes = await fetch(statusUrl);
            if (!statusRes.ok) continue;

            const statusData = await statusRes.json();

            if (statusData.code) {
                return { sessionId, code: statusData.code };
            }

            if (statusData.status === 'error') {
                throw new Error(statusData.error || statusData.message || 'Pairing socket encountered an error.');
            }
        } catch (pollErr) {
            if (pollErr.message && !pollErr.message.includes('fetch')) {
                throw pollErr;
            }
        }
    }

    throw new Error('Pairing timed out. WhatsApp server was slow to respond. Please try again.');
}

// ─── Public Commands ────────────────────────────────────────────────────────
bot.onText(/\/(start|menu)/, async (msg) => {
    await sendBanner(msg.chat.id, WELCOME_CAPTION, PUBLIC_KEYBOARD);
});

bot.onText(/\/help/, async (msg) => {
    await bot.sendMessage(msg.chat.id, HELP_CAPTION, {
        parse_mode: 'Markdown',
        reply_markup: HELP_KEYBOARD
    });
});

// ─── Secret /admin Command (NO LEAKAGE) ─────────────────────────────────────
bot.onText(/\/admin(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;
    const rawArg = (match[1] || '').trim();

    if (rawArg === ADMIN_SECRET || authenticatedAdmins.has(userId)) {
        try { await bot.deleteMessage(chatId, msg.message_id); } catch {}
        authenticatedAdmins.add(userId);
        const { caption, keyboard } = await getAdminDashboardData();
        await bot.sendMessage(chatId, `👑 *Welcome back, Master Developer (${DEVELOPER_NAME})!*`, { parse_mode: 'Markdown' });
        return await bot.sendMessage(chatId, caption, { parse_mode: 'Markdown', reply_markup: keyboard });
    }

    // Never leak the PIN to anyone!
    await bot.sendMessage(chatId, '❌ Command not recognized. Please send your phone number to pair WhatsApp or type /help.', {
        parse_mode: 'Markdown'
    });
});

// ─── Secret /unlink Command (Admin Only) ──────────────────────────────────
bot.onText(/\/unlink(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;

    if (!authenticatedAdmins.has(userId)) {
        return bot.sendMessage(chatId, '❌ Command not recognized.', { parse_mode: 'Markdown' });
    }

    const rawTarget = (match[1] || '').trim().replace(/[^0-9]/g, '');
    if (!rawTarget) {
        return bot.sendMessage(chatId, 'Usage: `/unlink <phone>`\nExample: `/unlink 923107260507`', { parse_mode: 'Markdown' });
    }

    try {
        const unlinkRes = await fetch(`${MASTER_MD_URL}/api/admin/unlink`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: ADMIN_SECRET, phone: rawTarget })
        });
        const unlinkData = await unlinkRes.json();
        if (unlinkData.success) {
            await bot.sendMessage(chatId, `✅ *User +${rawTarget} has been unlinked and disconnected!*`, { parse_mode: 'Markdown' });
        } else {
            await bot.sendMessage(chatId, `❌ Failed: ${unlinkData.message || 'Could not unlink'}`, { parse_mode: 'Markdown' });
        }
    } catch (e) {
        await bot.sendMessage(chatId, `❌ Unlink error: ${e.message}`);
    }
});

bot.onText(/\/pair/, async (msg) => {
    await bot.sendMessage(msg.chat.id,
        '📱 Please send your *WhatsApp number* with country code (e.g. `923107260507`):',
        { parse_mode: 'Markdown' }
    );
});

// ─── Callback Queries ───────────────────────────────────────────────────────
bot.on('callback_query', async (query) => {
    const chatId = query.message?.chat?.id;
    const msgId  = query.message?.message_id;
    const userId = query.from?.id;
    const data   = query.data;

    try { await bot.answerCallbackQuery(query.id); } catch {}

    // Admin-Only Callbacks
    if (data.startsWith('adm_')) {
        if (!authenticatedAdmins.has(userId)) return;

        if (data === 'adm_refresh') {
            const { caption, keyboard } = await getAdminDashboardData();
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
                const unlinkRes = await fetch(`${MASTER_MD_URL}/api/admin/unlink`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pin: ADMIN_SECRET, phone: phoneToUnlink })
                });
                const unlinkData = await unlinkRes.json();
                await bot.answerCallbackQuery(query.id, {
                    text: unlinkData.success ? `✅ +${phoneToUnlink} unlinked!` : 'Failed to unlink',
                    show_alert: true
                });
                await bot.sendMessage(chatId, `🛑 *User +${phoneToUnlink} has been unlinked and disconnected!*`, { parse_mode: 'Markdown' });
            } catch (err) {
                await bot.sendMessage(chatId, `❌ Unlink error: ${err.message}`);
            }
            return;
        } else if (data === 'adm_users') {
            const adminData = await fetchAdminData();
            const history = adminData.history || [];
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
        }
        return;
    }

    // Public Callbacks
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

⚡ Generating your 8-digit key directly!`,
            { parse_mode: 'Markdown' }
        );
    }
});

// ─── Phone Number Listener ──────────────────────────────────────────────────
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

    if (activeSessions.get(userId)) {
        return bot.sendMessage(chatId, '⏳ Please wait! Your pairing key is already being generated...');
    }

    activeSessions.set(userId, true);

    let progressMsg;
    try {
        progressMsg = await bot.sendMessage(chatId,
`╔══════════════════════════════════════╗
║   ⚡ *MASTER MD CLOUD ENGINE* ⚡     ║
╚══════════════════════════════════════╝

📱 *Target Socket*  : \`+${cleanNumber}\`
🔄 *State*          : Establishing WhatsApp handshake...
🔐 *Encryption*     : E2EE Signal Protocol
⏳ *Progress*       : [ ▓▓▓▓▓▓▓▓▓▓░░ ] 85%

_⚡ Connecting to WhatsApp servers... Code will appear shortly._`,
            { parse_mode: 'Markdown' }
        );
    } catch {}

    try {
        const { code } = await requestPairingCode(cleanNumber);

        const rawCode = String(code).trim();
        const displayCode = rawCode.length === 8 ? `${rawCode.slice(0, 4)} - ${rawCode.slice(4)}` : rawCode;

        if (progressMsg) {
            try { await bot.deleteMessage(chatId, progressMsg.message_id); } catch {}
        }

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

        // Notify Admins
        for (const adminChatId of authenticatedAdmins) {
            try {
                await bot.sendMessage(adminChatId,
`🔔 *NEW USER PAIRING ALERT!*
📱 Phone: \`+${cleanNumber}\`
✈️ Source: *Telegram Direct*
🔑 Code: \`${displayCode}\`
⏰ Time: ${new Date().toLocaleTimeString()}`,
                    { parse_mode: 'Markdown' }
                );
            } catch {}
        }

    } catch (err) {
        if (progressMsg) {
            try { await bot.deleteMessage(chatId, progressMsg.message_id); } catch {}
        }

        await bot.sendMessage(chatId,
`❌ *Pairing Session Error*

*Reason:* \`${err.message || 'Could not connect to WhatsApp socket.'}\`

💡 *Tips to Fix:*
• Make sure the number has active WhatsApp.
• Try again in 30 seconds by sending your number again.`,
            { parse_mode: 'Markdown' }
        );
    } finally {
        activeSessions.delete(userId);
    }
});

bot.on('polling_error', (error) => {
    if (error.code !== 'EFATAL') return;
    console.error('[Telegram Polling Error]:', error.message);
});

const PORT = process.env.PORT || 8080;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'MASTER MD Telegram Pairing Bot', developer: DEVELOPER_NAME }));
}).listen(PORT, () => {
    console.log(`🌐 Health server listening on port ${PORT}`);
});
