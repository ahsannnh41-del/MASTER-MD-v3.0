import { randInt, pick, jidNum } from '../lib/utils.js';

const SESSIONS = new Map();

const TRIVIA = [
    { q: 'Apa ibu kota Jepang?', a: 'tokyo' },
    { q: 'Berapa jumlah benua di dunia?', a: '7' },
    { q: 'Planet apa yang dijuluki Planet Merah?', a: 'mars' },
    { q: 'Apa nama mata uang Jepang?', a: 'yen' },
    { q: 'Hewan apa yang dijuluki raja hutan?', a: 'singa' },
    { q: 'Berapa jumlah hari dalam tahun kabisat?', a: '366' },
    { q: 'Apa bahasa pemrograman yang dibuat oleh Brendan Eich?', a: 'javascript' },
    { q: 'Apa nama gas yang dihirup manusia untuk bernapas?', a: 'oksigen' },
];

const WOULD_YOU_RATHER_2 = [
    'Bisa terbang TANPA bisa berhenti, atau bisa berenang TANPA bisa naik ke darat?',
    'Selalu telat 10 menit, atau selalu terlalu cepat 1 jam?',
    'Kehilangan semua foto lama, atau kehilangan semua kontak HP?',
    'Hidup tanpa musik, atau hidup tanpa film?',
];

const SCRAMBLE_WORDS = ['KOMPUTER', 'PETUALANGAN', 'PERSAHABATAN', 'KEBAHAGIAAN', 'TEKNOLOGI', 'IMAJINASI'];

const ANAGRAM_HINTS = {
    KOMPUTER: 'Alat elektronik untuk mengolah data',
    PETUALANGAN: 'Perjalanan penuh tantangan',
    PERSAHABATAN: 'Hubungan dekat antar teman',
    KEBAHAGIAAN: 'Perasaan senang dan puas',
    TEKNOLOGI: 'Ilmu terapan untuk memudahkan hidup',
    IMAJINASI: 'Daya khayal atau fantasi',
};

const DAD_JOKES = [
    'Kenapa programmer suka alam? Karena banyak tree (pohon data)!',
    'Apa minuman favorit hantu? Es kunti(lanak)... eh, es teh maksudnya.',
    'Kenapa komputer gak pernah lapar? Karena udah punya byte!',
    'Kenapa laut gak pernah pinjam uang? Karena udah banyak "bank" (pantai)!',
];

const CONSPIRACY_FUN = [
    'Burung itu sebenarnya drone pengawas pemerintah.',
    'Kucing tidur 16 jam sehari karena merencanakan dominasi dunia.',
    'Setiap kali WiFi lambat, itu karena tetangga lagi download alam semesta paralel.',
];

const PERSONALITY_TEST = [
    { trait: 'Pemimpin Alami', desc: 'Kamu suka mengambil inisiatif dan diandalkan orang lain.' },
    { trait: 'Si Kreatif', desc: 'Otakmu penuh ide unik yang orang lain gak kepikiran.' },
    { trait: 'Si Penenang', desc: 'Kehadiranmu bikin orang lain jadi tenang dan nyaman.' },
    { trait: 'Si Petualang', desc: 'Kamu selalu cari hal baru dan gak suka rutinitas membosankan.' },
];

const RIDDLE_2 = [
    { q: 'Makin dikeringkan, makin basah. Apa itu?', a: 'handuk' },
    { q: 'Punya kunci tapi tidak bisa membuka pintu. Apa itu?', a: 'piano' },
    { q: 'Semakin diambil, semakin besar. Apa itu?', a: 'lubang' },
    { q: 'Berjalan tanpa kaki, menangis tanpa mata. Apa itu?', a: 'awan' },
];

function scrambleWord(word) {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = randInt(0, i);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

export const funCommands3 = {
    async trivia(reply, jid) {
        const item = pick(TRIVIA);
        SESSIONS.set(`trivia:${jid}`, item.a);
        await reply(`🧠 *TRIVIA TIME!*\n\n${item.q}\n\nJawab dengan: *.jawabtrivia [jawaban]*`);
    },

    async answerTrivia(reply, jid, args) {
        const ans = (args.join(' ') || '').toLowerCase().trim();
        const correct = SESSIONS.get(`trivia:${jid}`);
        if (!correct) return reply('❌ Belum ada trivia aktif. Ketik *.trivia* dulu!');
        if (ans === correct) {
            SESSIONS.delete(`trivia:${jid}`);
            await reply('🎉 *BENAR!* Kamu pintar banget!');
        } else {
            await reply(`❌ Salah! Coba lagi atau ketik *.trivia* untuk soal baru.`);
        }
    },

    async wouldYouRather2(reply) {
        await reply(`🤔 *WOULD YOU RATHER*\n\n${pick(WOULD_YOU_RATHER_2)}`);
    },

    async wordScramble(reply, jid) {
        const word = pick(SCRAMBLE_WORDS);
        SESSIONS.set(`scramble:${jid}`, word.toLowerCase());
        await reply(`🔀 *TEBAK KATA ACAK*\n\nSusunan huruf: *${scrambleWord(word)}*\nHint: ${ANAGRAM_HINTS[word]}\n\nJawab dengan: *.jawabscramble [kata]*`);
    },

    async answerScramble(reply, jid, args) {
        const ans = (args.join(' ') || '').toLowerCase().trim();
        const correct = SESSIONS.get(`scramble:${jid}`);
        if (!correct) return reply('❌ Belum ada game aktif. Ketik *.wordscramble* dulu!');
        if (ans === correct) {
            SESSIONS.delete(`scramble:${jid}`);
            await reply('🎉 *BENAR!* Hebat!');
        } else {
            await reply('❌ Belum tepat, coba lagi!');
        }
    },

    async riddle2(reply, jid) {
        const item = pick(RIDDLE_2);
        SESSIONS.set(`riddle2:${jid}`, item.a);
        await reply(`🧩 *TEKA-TEKI*\n\n${item.q}\n\nJawab dengan: *.jawabriddle2 [jawaban]*`);
    },

    async answerRiddle2(reply, jid, args) {
        const ans = (args.join(' ') || '').toLowerCase().trim();
        const correct = SESSIONS.get(`riddle2:${jid}`);
        if (!correct) return reply('❌ Belum ada teka-teki aktif. Ketik *.riddle2* dulu!');
        if (ans === correct) {
            SESSIONS.delete(`riddle2:${jid}`);
            await reply('🎉 *BENAR!*');
        } else {
            await reply('❌ Salah, coba lagi!');
        }
    },

    async dadJoke(reply) {
        await reply(`😂 *DAD JOKE*\n\n${pick(DAD_JOKES)}`);
    },

    async conspiracyFun(reply) {
        await reply(`👽 *TEORI KONSPIRASI RANDOM*\n\n${pick(CONSPIRACY_FUN)}\n\n(murni untuk hiburan ya!)`);
    },

    async personalityToday(reply) {
        const p = pick(PERSONALITY_TEST);
        await reply(`🧬 *KEPRIBADIANMU HARI INI*\n\n*${p.trait}*\n${p.desc}`);
    },

    async rollMultiDice(reply, args) {
        const count = Math.min(10, Math.max(1, parseInt(args[0]) || 2));
        const sides = Math.min(100, Math.max(2, parseInt(args[1]) || 6));
        const rolls = Array.from({ length: count }, () => randInt(1, sides));
        await reply(`🎲 *ROLL ${count}x DADU (${sides} sisi)*\n\nHasil: ${rolls.join(', ')}\nTotal: *${rolls.reduce((a, b) => a + b, 0)}*`);
    },

    async guessHigherLower(reply, jid) {
        const target = randInt(1, 100);
        SESSIONS.set(`hilo:${jid}`, target);
        await reply(`🔢 *HIGHER OR LOWER*\n\nAku punya angka rahasia 1-100.\nJawab dengan: *.tebakhilo [angka]*, aku akan kasih tahu lebih tinggi/rendah.`);
    },

    async answerHigherLower(reply, jid, args) {
        const guess = parseInt(args[0]);
        const target = SESSIONS.get(`hilo:${jid}`);
        if (target === undefined) return reply('❌ Belum ada game aktif. Ketik *.guesshilo* dulu!');
        if (!guess) return reply('📌 Cara pakai: *.tebakhilo [angka]*');
        if (guess === target) {
            SESSIONS.delete(`hilo:${jid}`);
            await reply(`🎉 *TEPAT!* Angkanya memang ${target}!`);
        } else if (guess < target) {
            await reply('📈 Lebih tinggi lagi!');
        } else {
            await reply('📉 Lebih rendah lagi!');
        }
    },

    async randomCompliment2(reply, mentioned) {
        const target = mentioned?.[0];
        const lines = [
            'punya energi positif yang menular!', 'selalu bikin orang sekitar nyaman.',
            'punya potensi besar yang belum semua orang sadari.', 'adalah orang yang pantas dibanggakan.',
        ];
        await reply(target ? `✨ @${jidNum(target)} ${pick(lines)}` : `✨ Kamu ${pick(lines)}`);
    },

    async wordOfTheDay(reply) {
        const words = [
            { word: 'Serendipity', meaning: 'Menemukan sesuatu yang baik tanpa direncanakan.' },
            { word: 'Petrichor', meaning: 'Aroma khas tanah setelah hujan turun.' },
            { word: 'Ephemeral', meaning: 'Sesuatu yang berlangsung sangat singkat.' },
            { word: 'Wanderlust', meaning: 'Hasrat kuat untuk menjelajah/bepergian.' },
        ];
        const w = pick(words);
        await reply(`📖 *KATA HARI INI*\n\n*${w.word}*\n${w.meaning}`);
    },

    async thisOrThat(reply) {
        const pairs = [
            ['Kucing', 'Anjing'], ['Pagi', 'Malam'], ['Pantai', 'Gunung'],
            ['Teh', 'Kopi'], ['Film', 'Buku'], ['Musim Panas', 'Musim Hujan'],
        ];
        const [a, b] = pick(pairs);
        await reply(`⚖️ *THIS OR THAT*\n\n${a} 🆚 ${b}\n\nPilih salah satu dan kasih alasannya!`);
    },

    async magic8ball(reply, args) {
        const answers = [
            'Ya, pasti!', 'Tidak diragukan lagi.', 'Sepertinya begitu.',
            'Tanya lagi nanti.', 'Lebih baik tidak kuberitahu sekarang.',
            'Jangan berharap.', 'Sangat ragu.', 'Tidak.', 'Mungkin.',
        ];
        const q = args.join(' ');
        await reply(`🎱 *MAGIC 8-BALL*\n\n${q ? `Pertanyaan: "${q}"\n\n` : ''}Jawaban: *${pick(answers)}*`);
    },

    async rateMyDay(reply) {
        const score = randInt(1, 10);
        const comments = {
            low: 'Hari yang berat, tapi besok pasti lebih baik!',
            mid: 'Hari yang cukup oke, terus semangat!',
            high: 'Hari yang luar biasa, pertahankan!',
        };
        const tier = score <= 3 ? 'low' : score <= 7 ? 'mid' : 'high';
        await reply(`📅 *RATING HARI INI*\n\nSkor: ${score}/10\n${comments[tier]}`);
    },

    async luckyNumber(reply) {
        await reply(`🍀 *ANGKA KEBERUNTUNGANMU HARI INI*\n\n*${randInt(1, 99)}*`);
    },

    async randomEmoji(reply) {
        const emojis = ['😀','😎','🤔','🥳','😴','🤯','🥶','😇','🤖','👻','🦄','🔥','💎','🌈','⚡'];
        await reply(`🎲 Emoji random: ${pick(emojis)}`);
    },

    async secretAdmirer(reply) {
        const lines = [
            'Seseorang di grup ini diam-diam mengagumimu.',
            'Ada yang selalu baca chat kamu duluan sebelum yang lain.',
            'Seseorang menyimpan momen seru bareng kamu sebagai favorit.',
        ];
        await reply(`💌 *PESAN MISTERIUS*\n\n${pick(lines)}`);
    },

    async dailyAffirmation(reply) {
        const affirmations = [
            'Kamu lebih kuat dari yang kamu kira.',
            'Setiap langkah kecil tetap kemajuan.',
            'Kamu pantas mendapat hal-hal baik hari ini.',
            'Kesalahan hari ini adalah pelajaran untuk besok.',
        ];
        await reply(`🌻 *AFIRMASI HARI INI*\n\n"${pick(affirmations)}"`);
    },
};
