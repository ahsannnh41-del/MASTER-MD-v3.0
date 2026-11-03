// ═══════════════════════════════════════════════════════════════════
//  TOOLSCOMMANDS9.JS — Batch tools #6 (sederhana)
// ═══════════════════════════════════════════════════════════════════

function gcdTwo(a, b) { return b === 0 ? a : gcdTwo(b, a % b); }

const SUITS = ['♠️', '♥️', '♦️', '♣️'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const toolsCommands9 = {
    async simplifyFraction(reply, args) {
        const match = (args[0] || '').match(/^(-?\d+)\/(\d+)$/);
        if (!match) return reply('📌 Cara pakai: *.simplifyfraction [a/b]*\nContoh: `.simplifyfraction 12/18`');
        const [, aStr, bStr] = match;
        const a = parseInt(aStr, 10), b = parseInt(bStr, 10);
        if (b === 0) return reply('❌ Penyebut tidak boleh nol.');
        const g = gcdTwo(Math.abs(a), Math.abs(b));
        await reply(`🔢 ${a}/${b} disederhanakan = *${a / g}/${b / g}*`);
    },

    async fractionToDecimal(reply, args) {
        const match = (args[0] || '').match(/^(-?\d+)\/(\d+)$/);
        if (!match) return reply('📌 Cara pakai: *.fractiontodecimal [a/b]*');
        const [, aStr, bStr] = match;
        const a = parseInt(aStr, 10), b = parseInt(bStr, 10);
        if (b === 0) return reply('❌ Penyebut tidak boleh nol.');
        await reply(`🔢 ${a}/${b} = *${(a / b).toFixed(6).replace(/0+$/, '').replace(/\.$/, '')}*`);
    },

    async decimalToFraction(reply, args) {
        const dec = parseFloat(args[0]);
        if (isNaN(dec)) return reply('📌 Cara pakai: *.decimaltofraction [desimal]*\nContoh: `.decimaltofraction 0.75`');
        const decimals = (args[0].split('.')[1] || '').length;
        const denominator = Math.pow(10, decimals);
        const numerator = Math.round(dec * denominator);
        const g = gcdTwo(Math.abs(numerator), denominator) || 1;
        await reply(`🔢 ${dec} = *${numerator / g}/${denominator / g}*`);
    },

    async gpaCalculator(reply, args) {
        const grades = args.join(' ').split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n) && n >= 0 && n <= 4);
        if (!grades.length) return reply('📌 Cara pakai: *.gpacalc [nilai1,nilai2,...]*\n(Skala 0-4, contoh: `.gpacalc 3.5,4,3.7,3.2`)');
        const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
        await reply(`🎓 IPK rata-rata dari ${grades.length} nilai: *${avg.toFixed(2)}*`);
    },

    async romanValidate(reply, args) {
        const roman = (args[0] || '').toUpperCase();
        const valid = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(roman) && roman.length > 0;
        await reply(`🏛️ "${roman}" ${valid ? '✅ angka Romawi valid' : '❌ bukan format angka Romawi yang valid'}`);
    },

    async currencyFormat(reply, args) {
        const num = parseFloat(args[0]);
        const currency = (args[1] || 'IDR').toUpperCase();
        if (isNaN(num)) return reply('📌 Cara pakai: *.currencyformat [angka] [IDR/USD/EUR]*');
        const symbols = { IDR: 'Rp', USD: '$', EUR: '€' };
        const symbol = symbols[currency] || currency;
        await reply(`💵 ${symbol} ${num.toLocaleString('id-ID', { minimumFractionDigits: currency === 'IDR' ? 0 : 2 })}`);
    },

    async rollNotation(reply, args) {
        const match = (args[0] || '').match(/^(\d*)d(\d+)([+-]\d+)?$/i);
        if (!match) return reply('📌 Cara pakai: *.rollnotation [XdY+Z]*\nContoh: `.rollnotation 2d6+3` (2 dadu 6 sisi, +3)');
        const count = Math.min(parseInt(match[1] || '1', 10), 20);
        const sides = Math.min(parseInt(match[2], 10), 1000);
        const modifier = parseInt(match[3] || '0', 10);
        const rolls = [];
        for (let i = 0; i < count; i++) rolls.push(Math.floor(Math.random() * sides) + 1);
        const total = rolls.reduce((a, b) => a + b, 0) + modifier;
        await reply(`🎲 ${args[0]}: [${rolls.join(', ')}]${modifier ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''} = *${total}*`);
    },

    async drawCard(reply, args) {
        const n = Math.min(Math.max(parseInt(args[0], 10) || 1, 1), 5);
        const cards = [];
        for (let i = 0; i < n; i++) {
            const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
            const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
            cards.push(`${rank}${suit}`);
        }
        await reply(`🃏 Kartu: ${cards.join(' ')}`);
    },

    async hashtagGenerate(reply, args) {
        const topic = args.join(' ').trim();
        if (!topic) return reply('📌 Cara pakai: *.hashtaggen [topik]*');
        const words = topic.split(/\s+/);
        const combined = '#' + words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
        const separate = words.map(w => `#${w.toLowerCase()}`).join(' ');
        await reply(`#️⃣ *Saran hashtag:*\n\n${combined}\n${separate}`);
    },
};
