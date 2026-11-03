// ═══════════════════════════════════════════════════════════════════
//  TOOLSCOMMANDS7.JS — Batch tools sederhana (utilitas dasar)
// ═══════════════════════════════════════════════════════════════════

const COLOR_NAMES = ['Merah Marun','Biru Laut','Hijau Zamrud','Kuning Mustard','Ungu Anggur','Oranye Senja','Merah Muda','Biru Langit','Cokelat Tanah','Abu-abu Batu'];
const WEEKDAYS_ID = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

function gcdTwo(a, b) { return b === 0 ? a : gcdTwo(b, a % b); }
function lcmTwo(a, b) { return (a * b) / gcdTwo(a, b); }

export const toolsCommands7 = {
    async massConvert(reply, args) {
        const val = parseFloat(args[0]);
        const mode = (args[1] || '').toLowerCase();
        const table = { kgtolb: 2.20462, lbtokg: 1 / 2.20462, kgtooz: 35.274, oztokg: 1 / 35.274, gtooz: 0.035274, oztog: 1 / 0.035274 };
        if (isNaN(val) || !table[mode]) {
            return reply('📌 Cara pakai: *.massconvert [nilai] [mode]*\nMode: kgtolb, lbtokg, kgtooz, oztokg, gtooz, oztog');
        }
        await reply(`⚖️ ${val} → *${(val * table[mode]).toFixed(3)}*`);
    },

    async volumeConvert(reply, args) {
        const val = parseFloat(args[0]);
        const mode = (args[1] || '').toLowerCase();
        const table = { ltogal: 0.264172, galtol: 1 / 0.264172, mltofloz: 0.033814, floztoml: 1 / 0.033814 };
        if (isNaN(val) || !table[mode]) {
            return reply('📌 Cara pakai: *.volumeconvert [nilai] [mode]*\nMode: ltogal, galtol, mltofloz, floztoml');
        }
        await reply(`🧪 ${val} → *${(val * table[mode]).toFixed(3)}*`);
    },

    async trimSpaces(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.trimspaces [teks]*');
        const result = text.trim().replace(/\s+/g, ' ');
        await reply(`✂️ Hasil: \`${result}\``);
    },

    async capitalizeFirst(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.capitalizefirst [teks]*');
        await reply(`🔤 Hasil: ${text.charAt(0).toUpperCase() + text.slice(1)}`);
    },

    async countChar(reply, args) {
        const char = args[args.length - 1];
        const text = args.slice(0, -1).join(' ');
        if (!text || !char || char.length !== 1) return reply('📌 Cara pakai: *.countchar [teks] [1 karakter]*\nContoh: `.countchar halo dunia a`');
        const count = text.split('').filter(c => c.toLowerCase() === char.toLowerCase()).length;
        await reply(`🔤 Karakter "${char}" muncul *${count}x* dalam teks tersebut.`);
    },

    async randomColorName(reply) {
        await reply(`🎨 Warna random: *${COLOR_NAMES[Math.floor(Math.random() * COLOR_NAMES.length)]}*`);
    },

    async ageInSeconds(reply, args) {
        const birth = new Date(args[0]);
        if (!args[0] || isNaN(birth)) return reply('📌 Cara pakai: *.ageinseconds [YYYY-MM-DD]*');
        const seconds = Math.floor((Date.now() - birth) / 1000);
        await reply(`⏱️ Kamu sudah hidup selama kira-kira *${seconds.toLocaleString('id-ID')} detik*`);
    },

    async nextWeekday(reply, args) {
        const target = WEEKDAYS_ID.findIndex(d => d.toLowerCase() === (args[0] || '').toLowerCase());
        if (target === -1) return reply(`📌 Cara pakai: *.nextweekday [nama_hari]*\nContoh: \`.nextweekday jumat\`\nPilihan: ${WEEKDAYS_ID.join(', ')}`);
        const now = new Date();
        let diff = (target - now.getDay() + 7) % 7;
        if (diff === 0) diff = 7;
        const next = new Date(now);
        next.setDate(now.getDate() + diff);
        await reply(`📅 ${WEEKDAYS_ID[target]} berikutnya: *${next.toISOString().slice(0, 10)}* (${diff} hari lagi)`);
    },

    async gcdList(reply, args) {
        const nums = args.join(' ').split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
        if (nums.length < 2) return reply('📌 Cara pakai: *.gcdlist [n1,n2,n3,...]*');
        const result = nums.reduce((a, b) => gcdTwo(a, b));
        await reply(`🔢 FPB dari ${nums.join(', ')} = *${result}*`);
    },

    async lcmList(reply, args) {
        const nums = args.join(' ').split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
        if (nums.length < 2) return reply('📌 Cara pakai: *.lcmlist [n1,n2,n3,...]*');
        const result = nums.reduce((a, b) => lcmTwo(a, b));
        await reply(`🔢 KPK dari ${nums.join(', ')} = *${result.toLocaleString('id-ID')}*`);
    },

    async removeDuplicateWords(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.removedupewords [teks]*');
        const seen = new Set();
        const result = text.split(/\s+/).filter(w => {
            const key = w.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        }).join(' ');
        await reply(`✂️ Hasil: ${result}`);
    },

    async stringLength(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.strlen [teks]*');
        await reply(`🔤 Panjang teks: *${text.length} karakter*`);
    },

    async isNumeric(reply, args) {
        const text = args.join('');
        if (!text) return reply('📌 Cara pakai: *.isnumeric [teks]*');
        await reply(`🔢 "${text}" ${/^\d+$/.test(text) ? '✅ hanya berisi angka' : '❌ bukan angka murni'}`);
    },

    async reverseNumber(reply, args) {
        const n = args[0];
        if (!n || !/^\d+$/.test(n)) return reply('📌 Cara pakai: *.reversenumber [angka]*');
        await reply(`🔢 ${n} dibalik = *${n.split('').reverse().join('')}*`);
    },
};
