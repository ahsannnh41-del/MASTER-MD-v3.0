// ═══════════════════════════════════════════════════════════════════
//  TOOLSCOMMANDS11.JS — Batch tools #8 (unicode text style + math)
// ═══════════════════════════════════════════════════════════════════

export function mapChars(text, map) {
    return text.split('').map(c => map[c] || c).join('');
}

export const SMALLCAPS_MAP = { a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ғ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'s',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ' };
const CIRCLED_MAP = { a:'ⓐ',b:'ⓑ',c:'ⓒ',d:'ⓓ',e:'ⓔ',f:'ⓕ',g:'ⓖ',h:'ⓗ',i:'ⓘ',j:'ⓙ',k:'ⓚ',l:'ⓛ',m:'ⓜ',n:'ⓝ',o:'ⓞ',p:'ⓟ',q:'ⓠ',r:'ⓡ',s:'ⓢ',t:'ⓣ',u:'ⓤ',v:'ⓥ',w:'ⓦ',x:'ⓧ',y:'ⓨ',z:'ⓩ','1':'①','2':'②','3':'③','4':'④','5':'⑤','6':'⑥','7':'⑦','8':'⑧','9':'⑨','0':'⓪' };
const FULLWIDTH_MAP = {};
for (let i = 33; i <= 126; i++) FULLWIDTH_MAP[String.fromCharCode(i)] = String.fromCharCode(0xFEE0 + i);
FULLWIDTH_MAP[' '] = '　';

function addCombining(text, mark) {
    return text.split('').map(c => c + mark).join('');
}

export const toolsCommands11 = {
    async upsideDown(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.upsidedown [teks]*');
        const map = { a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ƃ',h:'ɥ',i:'ᴉ',j:'ɾ',k:'ʞ',l:'l',m:'ɯ',n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z' };
        const result = text.toLowerCase().split('').map(c => map[c] || c).reverse().join('');
        await reply(`🙃 ${result}`);
    },
    async zalgoText(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.zalgotext [teks]*');
        const marks = ['\u0301', '\u0300', '\u0316', '\u0317', '\u0489', '\u0308'];
        const result = text.split('').map(c => {
            let out = c;
            const n = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < n; i++) out += marks[Math.floor(Math.random() * marks.length)];
            return out;
        }).join('');
        await reply(`👻 ${result}`);
    },
    async smallCaps(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.smallcaps [teks]*');
        await reply(mapChars(text.toLowerCase(), SMALLCAPS_MAP));
    },
    async strikethroughText(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.strikethrough [teks]*');
        await reply(addCombining(text, '\u0336'));
    },
    async underlineText(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.underline [teks]*');
        await reply(addCombining(text, '\u0332'));
    },
    async circledText(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.circledtext [teks]*\n(Cuma huruf & angka yang bisa dikonversi)');
        await reply(mapChars(text.toLowerCase(), CIRCLED_MAP));
    },
    async fullwidthText(reply, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Cara pakai: *.fullwidth [teks]*');
        await reply(mapChars(text, FULLWIDTH_MAP));
    },

    // ── MATH & MISC TAMBAHAN ─────────────────────────────────────────
    async hammingDistance(reply, args) {
        const [a, b] = args.join(' ').split('|').map(s => s.trim());
        if (!a || !b || a.length !== b.length) return reply('📌 Cara pakai: *.hammingdistance [teks1] | [teks2]*\n(Kedua teks harus sama panjang)');
        let dist = 0;
        for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) dist++;
        await reply(`🔢 Hamming distance: *${dist}*`);
    },
    async jaccardSimilarity(reply, args) {
        const [l1, l2] = args.join(' ').split('|');
        if (!l1 || !l2) return reply('📌 Cara pakai: *.jaccard a,b,c | b,c,d*');
        const set1 = new Set(l1.split(',').map(s => s.trim()));
        const set2 = new Set(l2.split(',').map(s => s.trim()));
        const intersection = [...set1].filter(x => set2.has(x)).length;
        const union = new Set([...set1, ...set2]).size;
        const similarity = union === 0 ? 0 : (intersection / union * 100).toFixed(1);
        await reply(`📊 Jaccard similarity: *${similarity}%*\n_(${intersection} irisan dari ${union} total item unik)_`);
    },
    async averageSpeed(reply, args) {
        const [jarak, waktu] = args.map(Number);
        if (isNaN(jarak) || isNaN(waktu) || waktu <= 0) return reply('📌 Cara pakai: *.averagespeed [jarak_km] [waktu_jam]*');
        await reply(`🚗 Kecepatan rata-rata: *${(jarak / waktu).toFixed(2)} km/jam*`);
    },
    async electricityBill(reply, args) {
        const [kwh, tarif] = args.map(Number);
        if (isNaN(kwh) || isNaN(tarif)) return reply('📌 Cara pakai: *.electricitybill [pemakaian_kwh] [tarif_per_kwh]*\nContoh: `.electricitybill 150 1500`');
        await reply(`💡 Perkiraan tagihan listrik:\n${kwh} kWh × Rp${tarif.toLocaleString('id-ID')} = *Rp${(kwh * tarif).toLocaleString('id-ID')}*\n\n_(Belum termasuk biaya admin/pajak, cuma estimasi kasar.)_`);
    },
};
