// ═══════════════════════════════════════════════════════════════════
//  TOOLSCOMMANDS4.JS — Batch tools baru (warna, cipher, teks, JSON)
// ═══════════════════════════════════════════════════════════════════

// ─── HELPERS ────────────────────────────────────────────────────────
function vigenereShift(text, key, decrypt) {
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (!cleanKey) return null;
    let ki = 0;
    return text.replace(/[a-zA-Z]/g, (c) => {
        const base = c <= 'Z' ? 65 : 97;
        const keyShift = cleanKey.charCodeAt(ki % cleanKey.length) - 65;
        ki++;
        const shift = decrypt ? -keyShift : keyShift;
        return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base);
    });
}

function atbashCipher(text) {
    return text.replace(/[a-zA-Z]/g, (c) => {
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(base + (25 - (c.charCodeAt(0) - base)));
    });
}

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(str) {
    const bytes = Buffer.from(str, 'utf8');
    let bits = 0, value = 0, output = '';
    for (const byte of bytes) {
        value = (value << 8) | byte;
        bits += 8;
        while (bits >= 5) {
            output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0) output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
    while (output.length % 8 !== 0) output += '=';
    return output;
}

function base32Decode(str) {
    const clean = str.toUpperCase().replace(/=+$/, '');
    let bits = 0, value = 0;
    const bytes = [];
    for (const char of clean) {
        const idx = BASE32_ALPHABET.indexOf(char);
        if (idx === -1) continue;
        value = (value << 5) | idx;
        bits += 5;
        if (bits >= 8) {
            bytes.push((value >>> (bits - 8)) & 0xff);
            bits -= 8;
        }
    }
    return Buffer.from(bytes).toString('utf8');
}

function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
    if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
    return {
        r: parseInt(full.slice(0, 2), 16),
        g: parseInt(full.slice(2, 4), 16),
        b: parseInt(full.slice(4, 6), 16),
    };
}

function slugify(text) {
    return text.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function countSyllables(word) {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!clean) return 0;
    const matches = clean.match(/[aeiouy]+/g);
    return matches ? matches.length : 1;
}

const NAME_PREFIXES = ['Aer', 'Vor', 'Zan', 'Kel', 'Thal', 'Dra', 'Myr', 'Sil', 'Or', 'Fen'];
const NAME_SUFFIXES = ['dor', 'ion', 'wen', 'rick', 'las', 'nar', 'eth', 'wyn', 'gard', 'iel'];

export const toolsCommands4 = {

    // ── WARNA ────────────────────────────────────────────────────────
    async hexToRgbCmd(reply, args) {
        const hex = (args[0] || '').trim();
        if (!hex) return reply('📌 Cara pakai: *.hex2rgb [kode hex]*\nContoh: `.hex2rgb #FF5733`');
        const rgb = hexToRgb(hex);
        if (!rgb) return reply('❌ Format hex tidak valid. Contoh: `#FF5733` atau `#F53`.');
        await reply(`🎨 *${hex.toUpperCase()}*\n\nRGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
    },

    async rgbToHexCmd(reply, args) {
        const parts = args.join(' ').split(',').map(s => parseInt(s.trim(), 10));
        if (parts.length !== 3 || parts.some(n => isNaN(n) || n < 0 || n > 255)) {
            return reply('📌 Cara pakai: *.rgb2hex [r,g,b]*\nContoh: `.rgb2hex 255,87,51`');
        }
        const hex = '#' + parts.map(n => n.toString(16).padStart(2, '0')).join('').toUpperCase();
        await reply(`🎨 rgb(${parts.join(', ')})\n\nHex: *${hex}*`);
    },

    // ── ENKRIPSI TAMBAHAN ───────────────────────────────────────────
    async vigenereEncrypt(reply, args) {
        if (args.length < 2) return reply('📌 Cara pakai: *.vigenere [key] [teks]*\nContoh: `.vigenere kunci halo dunia`');
        const [key, ...rest] = args;
        const text = rest.join(' ');
        const result = vigenereShift(text, key, false);
        if (!result) return reply('❌ Key harus mengandung huruf.');
        await reply(`🔐 *Vigenère Encrypt*\n\nKey: ${key}\nHasil: \`${result}\``);
    },

    async vigenereDecrypt(reply, args) {
        if (args.length < 2) return reply('📌 Cara pakai: *.vigeneredekrip [key] [teks terenkripsi]*');
        const [key, ...rest] = args;
        const text = rest.join(' ');
        const result = vigenereShift(text, key, true);
        if (!result) return reply('❌ Key harus mengandung huruf.');
        await reply(`🔓 *Vigenère Decrypt*\n\nKey: ${key}\nHasil: \`${result}\``);
    },

    async atbash(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.atbash [teks]*\n(A↔Z, B↔Y, dst — encrypt & decrypt sama)');
        await reply(`🔐 *Atbash Cipher*\n\nHasil: \`${atbashCipher(text)}\``);
    },

    async toBase32(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.tobase32 [teks]*');
        await reply(`📦 Base32: \`${base32Encode(text)}\``);
    },

    async fromBase32(reply, args) {
        const b32 = args.join('');
        if (!b32) return reply('📌 Cara pakai: *.frombase32 [base32]*');
        try {
            await reply(`📦 Hasil: \`${base32Decode(b32)}\``);
        } catch {
            await reply('❌ Base32 tidak valid.');
        }
    },

    // ── TEKS ─────────────────────────────────────────────────────────
    async slugifyCmd(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.slugify [teks]*\nContoh: `.slugify Judul Artikel Keren!`');
        await reply(`🔗 Slug: \`${slugify(text)}\``);
    },

    async loremIpsum(reply, args) {
        const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];
        const n = Math.min(parseInt(args[0], 10) || 20, 100);
        let result = [];
        for (let i = 0; i < n; i++) result.push(words[Math.floor(Math.random() * words.length)]);
        result = result.join(' ');
        await reply(`📄 *Lorem Ipsum (${n} kata)*\n\n${result.charAt(0).toUpperCase() + result.slice(1)}.`);
    },

    async randomFantasyName(reply) {
        const prefix = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
        const suffix = NAME_SUFFIXES[Math.floor(Math.random() * NAME_SUFFIXES.length)];
        await reply(`🧙 Nama random: *${prefix}${suffix}*`);
    },

    async anagramCheck(reply, args) {
        if (args.length < 2) return reply('📌 Cara pakai: *.anagram [kata1] [kata2]*');
        const norm = w => w.toLowerCase().replace(/[^a-z0-9]/g, '').split('').sort().join('');
        const isAnagram = norm(args[0]) === norm(args[1]);
        await reply(`🔤 "${args[0]}" & "${args[1]}"\n${isAnagram ? '✅ ANAGRAM' : '❌ Bukan anagram'}`);
    },

    async syllableCount(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.syllable [kata/kalimat]*\n(Perkiraan kasar, bukan linguistik presisi)');
        const total = text.split(/\s+/).filter(Boolean).reduce((sum, w) => sum + countSyllables(w), 0);
        await reply(`🔤 Perkiraan jumlah suku kata: *${total}*`);
    },

    async readingTime(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.readingtime [teks]*\n(Estimasi kecepatan baca 200 kata/menit)');
        const wordCount = text.split(/\s+/).filter(Boolean).length;
        const minutes = Math.max(1, Math.ceil(wordCount / 200));
        await reply(`⏱️ Perkiraan waktu baca: *${minutes} menit* (${wordCount} kata)`);
    },

    async numeronym(reply, args) {
        const word = args[0] || '';
        if (word.length < 3) return reply('📌 Cara pakai: *.numeronim [kata]*\nContoh: `.numeronim internationalization` → i18n');
        const result = word[0] + (word.length - 2) + word[word.length - 1];
        await reply(`🔢 Numeronim: *${result}*`);
    },

    async dogYears(reply, args) {
        const age = parseFloat(args[0]);
        if (!age || age < 0) return reply('📌 Cara pakai: *.dogyears [umur manusia]*');
        // Rumus non-linear yang lebih akurat dibanding "x7" biasa: tahun
        // pertama anjing setara ~15 tahun manusia, tahun kedua +9, setelah
        // itu tiap tahun +5.
        let dogAge;
        if (age <= 1) dogAge = age * 15;
        else if (age <= 2) dogAge = 15 + (age - 1) * 9;
        else dogAge = 24 + (age - 2) * 5;
        await reply(`🐶 ${age} tahun manusia ≈ *${dogAge.toFixed(1)} tahun anjing*`);
    },

    // ── JSON ─────────────────────────────────────────────────────────
    async jsonValidate(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.jsonvalidate [json]*');
        try {
            JSON.parse(text);
            await reply('✅ JSON valid.');
        } catch (err) {
            await reply(`❌ JSON tidak valid.\n\nDetail: ${err.message}`);
        }
    },

    async jsonFormat(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.jsonformat [json]*');
        try {
            const parsed = JSON.parse(text);
            const formatted = JSON.stringify(parsed, null, 2);
            await reply(`\`\`\`${formatted.slice(0, 1500)}\`\`\`${formatted.length > 1500 ? '\n\n_(dipotong, terlalu panjang)_' : ''}`);
        } catch (err) {
            await reply(`❌ JSON tidak valid.\n\nDetail: ${err.message}`);
        }
    },

    // ── REGEX ────────────────────────────────────────────────────────
    async regexTest(reply, args) {
        const full = args.join(' ');
        const match = full.match(/^\/(.+)\/([gimsuy]*)\s+([\s\S]+)$/) || full.match(/^(\S+)\s+([\s\S]+)$/);
        if (!match) return reply('📌 Cara pakai: *.regextest [pattern] [teks]*\nContoh: `.regextest ^\\d+$ 12345`\nAtau: `.regextest /\\d+/g ada 123 dan 456`');
        try {
            let pattern, flags, text;
            if (match.length === 4) { [, pattern, flags, text] = match; }
            else { [, pattern, text] = match; flags = 'g'; }
            const re = new RegExp(pattern, flags);
            const found = text.match(re);
            if (!found) return reply('🔍 Tidak ada yang cocok.');
            await reply(`🔍 *Cocok (${found.length}x):*\n\n${found.slice(0, 15).map(f => `\`${f}\``).join(', ')}`);
        } catch (err) {
            await reply(`❌ Pattern regex tidak valid: ${err.message}`);
        }
    },
};
