// ═══════════════════════════════════════════════════════════════════
//  TOOLSCOMMANDS6.JS — Batch tools besar #3
// ═══════════════════════════════════════════════════════════════════

function railFenceEncrypt(text, rails) {
    const fence = Array.from({ length: rails }, () => []);
    let rail = 0, dir = 1;
    for (const char of text) {
        fence[rail].push(char);
        if (rail === 0) dir = 1;
        else if (rail === rails - 1) dir = -1;
        rail += dir;
    }
    return fence.map(r => r.join('')).join('');
}

function railFenceDecrypt(text, rails) {
    const len = text.length;
    const pattern = [];
    let rail = 0, dir = 1;
    for (let i = 0; i < len; i++) {
        pattern.push(rail);
        if (rail === 0) dir = 1;
        else if (rail === rails - 1) dir = -1;
        rail += dir;
    }
    const railCounts = new Array(rails).fill(0);
    pattern.forEach(r => railCounts[r]++);
    const railChars = [];
    let idx = 0;
    for (let r = 0; r < rails; r++) {
        railChars.push(text.slice(idx, idx + railCounts[r]).split(''));
        idx += railCounts[r];
    }
    const railPos = new Array(rails).fill(0);
    return pattern.map(r => railChars[r][railPos[r]++]).join('');
}

function nCr(n, r) {
    if (r > n || r < 0) return 0;
    r = Math.min(r, n - r);
    let result = 1;
    for (let i = 0; i < r; i++) result = result * (n - i) / (i + 1);
    return Math.round(result);
}

function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
}

const ONES = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
function numberToWordsID(n) {
    if (n === 0) return 'nol';
    if (n < 12) return ONES[n];
    if (n < 20) return numberToWordsID(n - 10) + ' belas';
    if (n < 100) return numberToWordsID(Math.floor(n / 10)) + ' puluh ' + numberToWordsID(n % 10);
    if (n < 200) return 'seratus ' + numberToWordsID(n - 100);
    if (n < 1000) return numberToWordsID(Math.floor(n / 100)) + ' ratus ' + numberToWordsID(n % 100);
    if (n < 2000) return 'seribu ' + numberToWordsID(n - 1000);
    if (n < 1_000_000) return numberToWordsID(Math.floor(n / 1000)) + ' ribu ' + numberToWordsID(n % 1000);
    if (n < 1_000_000_000) return numberToWordsID(Math.floor(n / 1_000_000)) + ' juta ' + numberToWordsID(n % 1_000_000);
    return numberToWordsID(Math.floor(n / 1_000_000_000)) + ' miliar ' + numberToWordsID(n % 1_000_000_000);
}

const BASE36 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const toolsCommands6 = {

    // ── CIPHER TAMBAHAN ─────────────────────────────────────────────
    async railFenceEnc(reply, args) {
        const rails = parseInt(args[args.length - 1], 10);
        const text = args.slice(0, -1).join(' ');
        if (!text || !rails || rails < 2) return reply('📌 Cara pakai: *.railfence [teks] [jumlah_rel]*\nContoh: `.railfence hello world 3`');
        await reply(`🔐 Rail Fence (${rails} rel): \`${railFenceEncrypt(text.replace(/\s/g, '_'), rails)}\`\n_(spasi diganti "_")_`);
    },
    async railFenceDec(reply, args) {
        const rails = parseInt(args[args.length - 1], 10);
        const text = args.slice(0, -1).join('');
        if (!text || !rails || rails < 2) return reply('📌 Cara pakai: *.railfencedekrip [teks] [jumlah_rel]*');
        await reply(`🔓 Hasil: \`${railFenceDecrypt(text, rails).replace(/_/g, ' ')}\``);
    },
    async caesarBrute(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.caesarbrute [teks terenkripsi]*\n(Coba semua 25 kemungkinan geseran Caesar cipher)');
        let result = '';
        for (let shift = 1; shift <= 25; shift++) {
            const decoded = text.replace(/[a-zA-Z]/g, c => {
                const base = c <= 'Z' ? 65 : 97;
                return String.fromCharCode((c.charCodeAt(0) - base - shift + 26) % 26 + base);
            });
            result += `${shift}: ${decoded}\n`;
        }
        await reply(`🔓 *Brute Force Caesar Cipher*\n\n${result.slice(0, 1800)}`);
    },
    async toBase36(reply, args) {
        const n = parseInt(args[0], 10);
        if (isNaN(n) || n < 0) return reply('📌 Cara pakai: *.tobase36 [angka]*');
        await reply(`🔢 Base36: *${n.toString(36).toUpperCase()}*`);
    },
    async fromBase36(reply, args) {
        const str = (args[0] || '').toUpperCase();
        if (!str || ![...str].every(c => BASE36.includes(c))) return reply('📌 Cara pakai: *.frombase36 [kode base36]*');
        await reply(`🔢 Desimal: *${parseInt(str, 36)}*`);
    },
    async pigLatin(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.piglatin [teks]*');
        const result = text.split(' ').map(word => {
            const match = word.match(/^([^aeiouAEIOU]*)(.*)$/);
            if (!match) return word;
            const [, consonants, rest] = match;
            return consonants ? `${rest}${consonants.toLowerCase()}ay` : `${word}way`;
        }).join(' ');
        await reply(`🐷 Pig Latin: ${result}`);
    },

    // ── KOMBINATORIK ─────────────────────────────────────────────────
    async combination(reply, args) {
        const [n, r] = args.map(Number);
        if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || n > 1000) return reply('📌 Cara pakai: *.ncr [n] [r]*\n(Kombinasi: berapa cara pilih r dari n, urutan tidak penting)');
        await reply(`🔢 C(${n},${r}) = *${nCr(n, r).toLocaleString('id-ID')}*`);
    },
    async permutation(reply, args) {
        const [n, r] = args.map(Number);
        if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n || n > 170) return reply('📌 Cara pakai: *.npr [n] [r]*\n(Permutasi: berapa cara susun r dari n, urutan penting)');
        let result = 1;
        for (let i = 0; i < r; i++) result *= (n - i);
        await reply(`🔢 P(${n},${r}) = *${result.toLocaleString('id-ID')}*`);
    },
    async pascalRow(reply, args) {
        const n = parseInt(args[0], 10);
        if (isNaN(n) || n < 0 || n > 30) return reply('📌 Cara pakai: *.pascalrow [n]* (0-30)\n(Baris ke-n dari Segitiga Pascal)');
        const row = [];
        for (let k = 0; k <= n; k++) row.push(nCr(n, k));
        await reply(`🔺 Pascal baris ke-${n}:\n${row.join(', ')}`);
    },
    async primeList(reply, args) {
        const n = Math.min(parseInt(args[0], 10) || 10, 50);
        const primes = [];
        let candidate = 2;
        while (primes.length < n) { if (isPrime(candidate)) primes.push(candidate); candidate++; }
        await reply(`🔢 ${n} bilangan prima pertama:\n${primes.join(', ')}`);
    },

    // ── GEOMETRI TAMBAHAN ────────────────────────────────────────────
    async trapezoidArea(reply, args) {
        const [a, b, t] = args.map(Number);
        if ([a, b, t].some(n => isNaN(n) || n <= 0)) return reply('📌 Cara pakai: *.trapezoidarea [sisi_sejajar_a] [sisi_sejajar_b] [tinggi]*');
        await reply(`📐 Luas trapesium: *${(((a + b) / 2) * t).toFixed(2)}*`);
    },
    async hexagonArea(reply, args) {
        const s = parseFloat(args[0]);
        if (isNaN(s) || s <= 0) return reply('📌 Cara pakai: *.hexagonarea [panjang_sisi]*\n(Segi enam beraturan)');
        const area = (3 * Math.sqrt(3) / 2) * s * s;
        await reply(`⬡ Luas segi enam beraturan (sisi ${s}): *${area.toFixed(2)}*`);
    },
    async cylinderCalc(reply, args) {
        const [r, t] = args.map(Number);
        if (isNaN(r) || isNaN(t) || r <= 0 || t <= 0) return reply('📌 Cara pakai: *.cylindervolume [radius] [tinggi]*');
        const volume = Math.PI * r * r * t;
        const surface = 2 * Math.PI * r * (r + t);
        await reply(`🥫 Radius: ${r}, Tinggi: ${t}\nVolume: *${volume.toFixed(2)}*\nLuas permukaan: *${surface.toFixed(2)}*`);
    },

    // ── VALIDATOR TAMBAHAN ───────────────────────────────────────────
    async ibanValidate(reply, args) {
        const iban = (args[0] || '').replace(/\s/g, '').toUpperCase();
        if (!iban || !/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) return reply('📌 Cara pakai: *.ibancheck [kode IBAN]*');
        const rearranged = iban.slice(4) + iban.slice(0, 4);
        const numeric = rearranged.split('').map(c => /[A-Z]/.test(c) ? (c.charCodeAt(0) - 55).toString() : c).join('');
        let remainder = 0;
        for (const digit of numeric) remainder = (remainder * 10 + Number(digit)) % 97;
        await reply(remainder === 1 ? '✅ Format IBAN valid (lolos cek checksum mod-97).' : '❌ IBAN tidak valid (gagal cek checksum).');
    },
    async macValidate(reply, args) {
        const mac = args[0] || '';
        const valid = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac);
        await reply(`🔍 MAC Address \`${mac}\`\n${valid ? '✅ Format valid' : '❌ Format tidak valid'}`);
    },
    async ipv4Validate(reply, args) {
        const ip = args[0] || '';
        const parts = ip.split('.');
        const valid = parts.length === 4 && parts.every(p => /^\d{1,3}$/.test(p) && Number(p) >= 0 && Number(p) <= 255);
        await reply(`🔍 IP \`${ip}\`\n${valid ? '✅ Format IPv4 valid' : '❌ Format tidak valid'}`);
    },

    // ── GENERATOR TAMBAHAN ───────────────────────────────────────────
    async pinGenerate(reply, args) {
        const length = Math.min(Math.max(parseInt(args[0], 10) || 6, 4), 12);
        let pin = '';
        for (let i = 0; i < length; i++) pin += Math.floor(Math.random() * 10);
        await reply(`🔢 PIN (${length} digit): *${pin}*`);
    },
    async couponCode(reply) {
        const segment = () => Math.random().toString(36).slice(2, 6).toUpperCase();
        await reply(`🎟️ Kode kupon: *${segment()}-${segment()}-${segment()}*`);
    },
    async numberToWords(reply, args) {
        const n = parseInt(args[0], 10);
        if (isNaN(n) || n < 0 || n > 999_999_999_999) return reply('📌 Cara pakai: *.numbertowords [angka]*');
        await reply(`🔢 ${n.toLocaleString('id-ID')} = *${numberToWordsID(n).replace(/\s+/g, ' ').trim()}*`);
    },

    // ── LAIN-LAIN ────────────────────────────────────────────────────
    async fuelEfficiency(reply, args) {
        const val = parseFloat(args[0]);
        const mode = (args[1] || '').toLowerCase();
        if (isNaN(val) || !['l100tompg', 'mpgtol100'].includes(mode)) {
            return reply('📌 Cara pakai: *.fueleff [nilai] [l100tompg/mpgtol100]*\nContoh: `.fueleff 7.5 l100tompg`');
        }
        const result = mode === 'l100tompg' ? 235.215 / val : 235.215 / val;
        await reply(`⛽ ${val} ${mode === 'l100tompg' ? 'L/100km' : 'MPG'} = *${result.toFixed(2)} ${mode === 'l100tompg' ? 'MPG' : 'L/100km'}*`);
    },
    async cookingConvert(reply, args) {
        const val = parseFloat(args[0]);
        const mode = (args[1] || '').toLowerCase();
        const table = { cuptoml: 236.588, mltocup: 1 / 236.588, tbsptoml: 14.787, mltotbsp: 1 / 14.787, tsptoml: 4.929, mltotsp: 1 / 4.929 };
        if (isNaN(val) || !table[mode]) {
            return reply('📌 Cara pakai: *.cookingconvert [nilai] [mode]*\nMode: cuptoml, mltocup, tbsptoml, mltotbsp, tsptoml, mltotsp');
        }
        await reply(`🥄 ${val} → *${(val * table[mode]).toFixed(2)}*`);
    },
    async textStats(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.textstats [teks]*');
        const words = text.split(/\s+/).filter(Boolean);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        const avgWordLen = words.reduce((s, w) => s + w.length, 0) / (words.length || 1);
        await reply(`📊 *Statistik Teks*\n\nKarakter: ${text.length}\nKata: ${words.length}\nKalimat: ${sentences.length}\nRata-rata panjang kata: ${avgWordLen.toFixed(1)} huruf`);
    },
};
