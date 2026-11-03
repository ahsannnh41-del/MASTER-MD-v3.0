// ═══════════════════════════════════════════════════════════════════
//  TOOLSCOMMANDS10.JS — Batch tools #7
// ═══════════════════════════════════════════════════════════════════

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58Encode(buffer) {
    let num = BigInt('0x' + Buffer.from(buffer).toString('hex') || '0x0');
    if (num === 0n) return BASE58_ALPHABET[0];
    let result = '';
    while (num > 0n) {
        result = BASE58_ALPHABET[Number(num % 58n)] + result;
        num = num / 58n;
    }
    for (const byte of buffer) { if (byte === 0) result = BASE58_ALPHABET[0] + result; else break; }
    return result;
}

function base58Decode(str) {
    let num = 0n;
    for (const char of str) {
        const idx = BASE58_ALPHABET.indexOf(char);
        if (idx === -1) throw new Error('karakter tidak valid');
        num = num * 58n + BigInt(idx);
    }
    let hex = num.toString(16);
    if (hex.length % 2) hex = '0' + hex;
    return Buffer.from(hex, 'hex').toString('utf8');
}

const RANDOM_WORDS = ['kelapa', 'gunung', 'pelangi', 'harimau', 'bintang', 'lautan', 'kabut', 'kunang', 'camar', 'kelinci', 'nirwana', 'zamrud'];
const INDO_CITIES = ['Bandung', 'Surabaya', 'Yogyakarta', 'Medan', 'Makassar', 'Semarang', 'Palembang', 'Denpasar', 'Balikpapan', 'Malang', 'Bogor', 'Manado'];

export const toolsCommands10 = {
    async toBase58(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.tobase58 [teks]*');
        await reply(`🔢 Base58: \`${base58Encode(Buffer.from(text, 'utf8'))}\``);
    },
    async fromBase58(reply, args) {
        const str = args[0] || '';
        if (!str) return reply('📌 Cara pakai: *.frombase58 [kode base58]*');
        try { await reply(`🔢 Hasil: \`${base58Decode(str)}\``); }
        catch { await reply('❌ Kode base58 tidak valid.'); }
    },
    async pressureConvert(reply, args) {
        const val = parseFloat(args[0]);
        const mode = (args[1] || '').toLowerCase();
        const table = { bartopsi: 14.5038, psitobar: 1 / 14.5038, bartoatm: 0.986923, atmtobar: 1 / 0.986923, bartokpa: 100, kpatobar: 0.01 };
        if (isNaN(val) || !table[mode]) {
            return reply('📌 Cara pakai: *.pressureconvert [nilai] [mode]*\nMode: bartopsi, psitobar, bartoatm, atmtobar, bartokpa, kpatobar');
        }
        await reply(`🌡️ ${val} → *${(val * table[mode]).toFixed(4)}*`);
    },
    async randomWord(reply) {
        await reply(`📝 Kata random: *${RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)]}*`);
    },
    async randomCity(reply) {
        await reply(`🏙️ Kota random: *${INDO_CITIES[Math.floor(Math.random() * INDO_CITIES.length)]}*`);
    },
    async wordFrequencyTop(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.topwords [teks]*\n(Tampilkan kata yang paling sering muncul)');
        const words = text.toLowerCase().match(/[a-z0-9]+/g) || [];
        const freq = {};
        words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
        const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);
        if (!sorted.length) return reply('ℹ️ Tidak ada kata untuk dianalisis.');
        await reply(`📊 *Top kata:*\n\n${sorted.map(([w, c]) => `${w}: ${c}x`).join('\n')}`);
    },
};
