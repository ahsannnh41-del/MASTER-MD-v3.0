import { fmtDuration, jidNum } from '../lib/utils.js';
import { settings } from '../setting.js';
import { getCreatorInfo } from '../lib/roles.js';

// ─── TEXT / STRING TOOLS ───────────────────────────────────────────────────
function toUpper(s) { return s.toUpperCase(); }
function toLower(s) { return s.toLowerCase(); }
function reverse(s) { return s.split('').reverse().join(''); }
function toBinary(s) { return s.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' '); }
function fromBinary(s) {
    try {
        return s.trim().split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join('');
    } catch { return null; }
}
function toBase64(s) { return Buffer.from(s, 'utf8').toString('base64'); }
function fromBase64(s) {
    try { return Buffer.from(s, 'base64').toString('utf8'); } catch { return null; }
}
function toHex(s) { return Buffer.from(s, 'utf8').toString('hex'); }
function fromHex(s) {
    try { return Buffer.from(s, 'hex').toString('utf8'); } catch { return null; }
}
function rot13(s) {
    return s.replace(/[a-zA-Z]/g, c => {
        const code = c.charCodeAt(0);
        const base = code < 97 ? 65 : 97;
        return String.fromCharCode(((code - base + 13) % 26) + base);
    });
}
function leetSpeak(s) {
    const map = { a: '4', e: '3', i: '1', o: '0', s: '5', t: '7', g: '9', b: '8' };
    return s.toLowerCase().split('').map(c => map[c] || c).join('');
}
function alternatingCase(s) {
    return s.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join('');
}
function countWords(s) { return s.trim().split(/\s+/).filter(Boolean).length; }
function countChars(s) { return s.length; }

export const textTools = {
    async upper(reply, args) { await reply(toUpper(args.join(' ')) || '📌 !upper [teks]'); },
    async lower(reply, args) { await reply(toLower(args.join(' ')) || '📌 !lower [teks]'); },
    async reverse(reply, args) { await reply(reverse(args.join(' ')) || '📌 !reverse [teks]'); },
    async toBinary(reply, args) {
        const t = args.join(' ');
        if (!t) return reply('📌 !tobinary [teks]');
        await reply(`🔢 ${toBinary(t)}`);
    },
    async fromBinary(reply, args) {
        const t = args.join(' ');
        const result = fromBinary(t);
        await reply(result ? `🔤 ${result}` : '❌ Format binary tidak valid.');
    },
    async toBase64(reply, args) {
        const t = args.join(' ');
        if (!t) return reply('📌 !tobase64 [teks]');
        await reply(`🔐 ${toBase64(t)}`);
    },
    async fromBase64(reply, args) {
        const result = fromBase64(args.join(' '));
        await reply(result !== null ? `🔓 ${result}` : '❌ Base64 tidak valid.');
    },
    async toHex(reply, args) {
        const t = args.join(' ');
        if (!t) return reply('📌 !tohex [teks]');
        await reply(`🔠 ${toHex(t)}`);
    },
    async fromHex(reply, args) {
        const result = fromHex(args.join(' '));
        await reply(result !== null ? `🔡 ${result}` : '❌ Hex tidak valid.');
    },
    async rot13(reply, args) {
        const t = args.join(' ');
        if (!t) return reply('📌 !rot13 [teks]');
        await reply(`🔁 ${rot13(t)}`);
    },
    async leet(reply, args) {
        const t = args.join(' ');
        if (!t) return reply('📌 !leet [teks]');
        await reply(`🤖 ${leetSpeak(t)}`);
    },
    async alternating(reply, args) {
        const t = args.join(' ');
        if (!t) return reply('📌 !alternating [teks]');
        await reply(alternatingCase(t));
    },
    async countWords(reply, args) {
        const t = args.join(' ');
        if (!t) return reply('📌 !wordcount [teks]');
        await reply(`📝 Jumlah kata: *${countWords(t)}*\n🔢 Jumlah karakter: *${countChars(t)}*`);
    },
};

// ─── CALCULATOR / MATH TOOLS ───────────────────────────────────────────────
function safeEval(expr) {
    // Only allow numbers, basic operators, parentheses, decimal points, and spaces
    if (!/^[\d+\-*/().\s%]+$/.test(expr)) return null;
    try {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`return (${expr})`);
        const result = fn();
        return typeof result === 'number' && isFinite(result) ? result : null;
    } catch {
        return null;
    }
}

export const mathTools = {
    async calc(reply, args) {
        const expr = args.join(' ');
        if (!expr) return reply('📌 !calc [ekspresi]\nContoh: !calc 5*(3+2)');
        const result = safeEval(expr);
        await reply(result !== null ? `🧮 ${expr} = *${result}*` : '❌ Ekspresi tidak valid atau tidak aman.');
    },

    async percent(reply, args) {
        const [a, b] = args.map(Number);
        if (isNaN(a) || isNaN(b)) return reply('📌 !persen [angka] [total]\nContoh: !persen 25 200 → 12.5%');
        await reply(`📊 ${a} dari ${b} = *${((a / b) * 100).toFixed(2)}%*`);
    },

    async bmi(reply, args) {
        const [weight, heightCm] = args.map(Number);
        if (!weight || !heightCm) return reply('📌 !bmi [berat_kg] [tinggi_cm]\nContoh: !bmi 60 165');
        const h = heightCm / 100;
        const bmi = weight / (h * h);
        let cat;
        if (bmi < 18.5) cat = 'Kurus';
        else if (bmi < 25) cat = 'Normal';
        else if (bmi < 30) cat = 'Gemuk';
        else cat = 'Obesitas';
        await reply(`⚖️ *BMI Calculator*\n\nBMI: *${bmi.toFixed(1)}*\nKategori: *${cat}*`);
    },

    async convertCurrencyNote(reply) {
        await reply('💱 Untuk kurs real-time, gunakan aplikasi resmi bank atau situs konversi mata uang terpercaya — bot ini belum terhubung API kurs live.');
    },

    async ageCalc(reply, args) {
        const dateStr = args.join(' ');
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return reply('📌 !umur [YYYY-MM-DD]\nContoh: !umur 2000-05-20');

        const now = new Date();
        let years = now.getFullYear() - date.getFullYear();
        let months = now.getMonth() - date.getMonth();
        let days = now.getDate() - date.getDate();
        if (days < 0) { months--; days += 30; }
        if (months < 0) { years--; months += 12; }

        await reply(`🎂 *Umur kamu:*\n${years} tahun, ${months} bulan, ${days} hari`);
    },
};

// ─── CONVERTER TOOLS ────────────────────────────────────────────────────────
const LENGTH_UNITS = { mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, ft: 0.3048, yard: 0.9144, mile: 1609.34 };
const WEIGHT_UNITS = { mg: 0.001, g: 1, kg: 1000, ton: 1000000, lb: 453.592, oz: 28.3495 };
const TEMP_CONVERT = {
    c2f: c => (c * 9 / 5) + 32,
    f2c: f => (f - 32) * 5 / 9,
    c2k: c => c + 273.15,
    k2c: k => k - 273.15,
};

export const converterTools = {
    async convertLength(reply, args) {
        const [val, from, to] = args;
        const num = parseFloat(val);
        if (!num || !LENGTH_UNITS[from] || !LENGTH_UNITS[to]) {
            return reply(`📌 !convertlength [angka] [dari] [ke]\nUnit: ${Object.keys(LENGTH_UNITS).join(', ')}`);
        }
        const result = (num * LENGTH_UNITS[from]) / LENGTH_UNITS[to];
        await reply(`📏 ${num} ${from} = *${result.toFixed(4)} ${to}*`);
    },

    async convertWeight(reply, args) {
        const [val, from, to] = args;
        const num = parseFloat(val);
        if (!num || !WEIGHT_UNITS[from] || !WEIGHT_UNITS[to]) {
            return reply(`📌 !convertweight [angka] [dari] [ke]\nUnit: ${Object.keys(WEIGHT_UNITS).join(', ')}`);
        }
        const result = (num * WEIGHT_UNITS[from]) / WEIGHT_UNITS[to];
        await reply(`⚖️ ${num} ${from} = *${result.toFixed(4)} ${to}*`);
    },

    async convertTemp(reply, args) {
        const [val, mode] = args;
        const num = parseFloat(val);
        if (isNaN(num) || !TEMP_CONVERT[mode]) {
            return reply(`📌 !convertsuhu [angka] [mode]\nMode: ${Object.keys(TEMP_CONVERT).join(', ')}\nContoh: !convertsuhu 100 c2f`);
        }
        await reply(`🌡️ Hasil: *${TEMP_CONVERT[mode](num).toFixed(2)}*`);
    },
};

// ─── RANDOM GENERATORS ──────────────────────────────────────────────────────
function generatePassword(length = 12, opts = {}) {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = lower.toUpperCase();
    const nums = '0123456789';
    const symbols = '!@#$%^&*()_+-=';
    let pool = lower + upper + nums;
    if (opts.symbols) pool += symbols;
    let pw = '';
    for (let i = 0; i < length; i++) pw += pool[Math.floor(Math.random() * pool.length)];
    return pw;
}

export const generatorTools = {
    async genPassword(reply, args) {
        const length = Math.min(64, Math.max(4, parseInt(args[0]) || 12));
        const withSymbols = args[1] === 'symbols';
        await reply(`🔑 Password (${length} karakter):\n\`${generatePassword(length, { symbols: withSymbols })}\``);
    },

    async genUUID(reply) {
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        await reply(`🆔 UUID: \`${uuid}\``);
    },

    async pickRandom(reply, args) {
        const items = args.join(' ').split(',').map(s => s.trim()).filter(Boolean);
        if (items.length < 2) return reply('📌 !pilih opsi1, opsi2, opsi3\nPisahkan dengan koma.');
        const choice = items[Math.floor(Math.random() * items.length)];
        await reply(`🎯 Pilihan bot: *${choice}*`);
    },

    async shuffleList(reply, args) {
        const items = args.join(' ').split(',').map(s => s.trim()).filter(Boolean);
        if (items.length < 2) return reply('📌 !shuffle opsi1, opsi2, opsi3\nPisahkan dengan koma.');
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        await reply(`🔀 Hasil acak:\n${shuffled.map((s, i) => `${i + 1}. ${s}`).join('\n')}`);
    },
};

// ─── INFO / UTILITY ──────────────────────────────────────────────────────
export const infoTools = {
    async ping(reply) {
        const start = Date.now();
        await reply(`🏓 Pong! Menghitung latensi...`);
        const latency = Date.now() - start;
        await reply(`⚡ Latensi: ${latency}ms`);
    },

    async whoami(reply, sender) {
        await reply(`👤 Nomor kamu: *${jidNum(sender)}*`);
    },

    async runtime(reply, startTime) {
        const uptime = Date.now() - startTime;
        await reply(`⏱️ Bot sudah berjalan selama: *${fmtDuration(uptime)}*`);
    },

    async serverTime(reply) {
        const now = new Date();
        await reply(`🕐 Waktu server: ${now.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB`);
    },

    async owner(reply, sock, jid) {
        const creator = getCreatorInfo();
        const waLink = `https://wa.me/${creator.number}`;
        const text =
`👑 *OWNER BOT*

📛 Nama: *${creator.name}*
📱 Nomor: *${creator.number}*
🔗 Chat: ${waLink}

Hubungi owner untuk pertanyaan, laporan bug, atau kerjasama.`;

        try {
            await sock.sendMessage(jid, {
                contacts: {
                    displayName: creator.name,
                    contacts: [{
                        vcard:
`BEGIN:VCARD
VERSION:3.0
FN:${creator.name}
TEL;type=CELL;type=VOICE;waid=${creator.number}:+${creator.number}
END:VCARD`,
                    }],
                },
            });
        } catch {
            // fallback to plain text if vcard isn't supported in this context
        }

        await reply(text);
    },
};
