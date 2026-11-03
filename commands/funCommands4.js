// ═══════════════════════════════════════════════════════════════════
//  FUNCOMMANDS4.JS — Batch fun #4 (zodiak shio, generator random, dst)
//  v3.2.0 — ditambahkan bareng fitur Anti-NSFW untuk menggenapkan total
//  command bot ini. Semua fitur di file ini murni hiburan (bukan
//  ramalan/klaim ilmiah sungguhan).
// ═══════════════════════════════════════════════════════════════════

import { randInt, pick } from '../lib/utils.js';

const SHIO_LIST = ['Tikus', 'Kerbau', 'Macan', 'Kelinci', 'Naga', 'Ular', 'Kuda', 'Kambing', 'Monyet', 'Ayam', 'Anjing', 'Babi'];
const SHIO_TRAITS = {
    Tikus: 'cerdas, adaptif, dan pandai membaca peluang',
    Kerbau: 'pekerja keras, tekun, dan bisa diandalkan',
    Macan: 'berani, penuh percaya diri, dan suka tantangan',
    Kelinci: 'lembut, hati-hati, dan pandai menjaga hubungan',
    Naga: 'karismatik, ambisius, dan penuh energi',
    Ular: 'bijaksana, misterius, dan analitis',
    Kuda: 'bebas, energik, dan suka berpetualang',
    Kambing: 'kreatif, penyayang, dan mudah beradaptasi',
    Monyet: 'lincah, humoris, dan pintar cari solusi',
    Ayam: 'rajin, jujur, dan detail terhadap segala hal',
    Anjing: 'setia, jujur, dan pembela kebenaran',
    Babi: 'baik hati, murah hati, dan gigih',
};

const DREAM_DICT = {
    terbang: 'melambangkan keinginan bebas dari tekanan atau ingin mencapai sesuatu yang lebih tinggi.',
    jatuh: 'sering dikaitkan dengan rasa tidak aman atau kehilangan kendali atas suatu situasi.',
    gigi: 'konon melambangkan kekhawatiran soal penampilan atau rasa cemas yang terpendam.',
    dikejar: 'bisa melambangkan sedang menghindari masalah atau tanggung jawab di kehidupan nyata.',
    air: 'melambangkan emosi — air tenang berarti hati damai, air deras berarti emosi sedang bergejolak.',
    ular: 'dalam banyak budaya melambangkan transformasi, godaan, atau bahaya tersembunyi.',
    terbangjatuh: 'kombinasi perasaan bebas sekaligus takut kehilangan kendali.',
    hamil: 'sering dimaknai sebagai simbol ide baru atau awal babak baru dalam hidup.',
    menikah: 'melambangkan komitmen baru atau penyatuan dua sisi hidup yang berbeda.',
    uang: 'bisa melambangkan rasa percaya diri, atau justru kekhawatiran soal nilai diri.',
    kematian: 'dalam tafsir mimpi klasik biasanya justru melambangkan akhir suatu fase, bukan secara harfiah.',
    rumah: 'melambangkan diri sendiri — kondisi rumah dalam mimpi mencerminkan kondisi batin.',
};

const ZODIAC_ELEMENTS = {
    aries: 'Api 🔥', taurus: 'Tanah 🌍', gemini: 'Udara 💨', cancer: 'Air 💧',
    leo: 'Api 🔥', virgo: 'Tanah 🌍', libra: 'Udara 💨', scorpio: 'Air 💧',
    sagitarius: 'Api 🔥', sagittarius: 'Api 🔥', capricorn: 'Tanah 🌍',
    aquarius: 'Udara 💨', pisces: 'Air 💧',
};

const LUCKY_COLORS = [
    { nama: 'Merah', emoji: '❤️' }, { nama: 'Biru', emoji: '💙' }, { nama: 'Hijau', emoji: '💚' },
    { nama: 'Kuning', emoji: '💛' }, { nama: 'Ungu', emoji: '💜' }, { nama: 'Oranye', emoji: '🧡' },
    { nama: 'Putih', emoji: '🤍' }, { nama: 'Hitam', emoji: '🖤' }, { nama: 'Emas', emoji: '✨' }, { nama: 'Perak', emoji: '⚪' },
];

const TEAM_ADJ = ['Naga', 'Elang', 'Serigala', 'Fajar', 'Badai', 'Bayangan', 'Petir', 'Phoenix', 'Kilat', 'Baja'];
const TEAM_NOUN = ['Squad', 'Legion', 'Force', 'Alliance', 'Brigade', 'Warriors', 'Guardians', 'Clan', 'United', 'Corps'];

const ANIME_TITLE_PREFIX = ['Sang Penakluk', 'Raja Iblis', 'Ksatria', 'Penguasa', 'Dewa', 'Legenda Hidup', 'Sang Maestro', 'Bayangan'];
const ANIME_TITLE_SUFFIX = ['Bayangan', 'Es Abadi', 'Petir', 'Seribu Dunia', 'Naga Langit', 'Malam Tanpa Bulan', 'Kegelapan', 'Domain Tak Terbatas'];

const KINGDOM_PREFIX = ['Elder', 'Drac', 'Sylva', 'Nord', 'Val', 'Astra', 'Ember', 'Frost'];
const KINGDOM_SUFFIX = ['fall', 'onia', 'heim', 'garde', 'moor', ' realm', 'haven', 'spire'];

export const funCommands4 = {
    async chineseZodiac(reply, args) {
        const year = parseInt(args[0]);
        if (!year || year < 1900 || year > 2100) return reply('📌 Cara pakai: *.shiozodiak [tahun lahir]*\nContoh: `.shiozodiak 2000`');
        const idx = ((year - 1900) % 12 + 12) % 12;
        const shio = SHIO_LIST[idx];
        await reply(`🐉 *SHIO TAHUN ${year}*\n\nShio: *${shio}*\nKarakter umum: ${SHIO_TRAITS[shio]}\n\n_(Hiburan semata, bukan ramalan sungguhan.)_`);
    },

    async dreamMeaning(reply, args) {
        const key = (args.join('') || '').toLowerCase().replace(/[^a-z]/g, '');
        if (!key) return reply(`📌 Cara pakai: *.artimimpi [kata kunci]*\nContoh: \`.artimimpi terbang\`\n\n💡 Kata yang tersedia: ${Object.keys(DREAM_DICT).join(', ')}`);
        const found = Object.keys(DREAM_DICT).find(k => key.includes(k) || k.includes(key));
        if (!found) return reply(`❓ Simbol mimpi "${args.join(' ')}" belum ada di database.\n\n💡 Coba salah satu: ${Object.keys(DREAM_DICT).join(', ')}`);
        await reply(`💭 *TAFSIR MIMPI: ${found.toUpperCase()}*\n\n${DREAM_DICT[found]}\n\n_(Tafsir tradisional untuk hiburan, bukan fakta ilmiah.)_`);
    },

    async luckyColor(reply) {
        const today = new Date().toISOString().slice(0, 10);
        let seed = 0;
        for (const c of today) seed += c.charCodeAt(0);
        const color = LUCKY_COLORS[seed % LUCKY_COLORS.length];
        await reply(`${color.emoji} *WARNA HOKI HARI INI*\n\n${color.nama}\n\n_(Sama untuk semua orang yang tanya hari ini — hiburan semata!)_`);
    },

    async zodiacElement(reply, args) {
        const sign = (args[0] || '').toLowerCase();
        const el = ZODIAC_ELEMENTS[sign];
        if (!el) return reply(`📌 Cara pakai: *.elementzodiak [nama zodiak]*\nContoh: \`.elementzodiak leo\`\n\n💡 Pilihan: ${Object.keys(ZODIAC_ELEMENTS).filter(s => s !== 'sagitarius').join(', ')}`);
        await reply(`🔯 *ELEMEN ZODIAK*\n\n${args[0][0].toUpperCase() + args[0].slice(1)} → Elemen *${el}*`);
    },

    async randomTeamName(reply) {
        await reply(`🛡️ *NAMA TIM RANDOM*\n\n*${pick(TEAM_ADJ)} ${pick(TEAM_NOUN)}*`);
    },

    async animeEpithet(reply) {
        await reply(`⚔️ *JULUKAN ANIME-MU*\n\n*"${pick(ANIME_TITLE_PREFIX)} ${pick(ANIME_TITLE_SUFFIX)}"*`);
    },

    async randomKingdomName(reply) {
        const style = randInt(0, 2);
        let name;
        if (style === 0) name = `Kerajaan ${pick(KINGDOM_PREFIX)}${pick(KINGDOM_SUFFIX)}`;
        else if (style === 1) name = `Kekaisaran ${pick(KINGDOM_PREFIX)}${pick(KINGDOM_SUFFIX)}`;
        else name = `Aliansi ${pick(KINGDOM_PREFIX)}${pick(KINGDOM_SUFFIX)}`;
        await reply(`🏰 *NAMA KERAJAAN RANDOM*\n\n*${name}*`);
    },
};
