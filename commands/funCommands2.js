import { randInt, pick, jidNum } from '../lib/utils.js';

const COMPLIMENTS = [
    'Kamu terlihat bersinar hari ini!', 'Senyummu menular kebahagiaan!',
    'Kamu lebih kuat dari yang kamu kira.', 'Kehadiranmu membuat hari ini lebih baik.',
    'Kamu pantas mendapatkan hal baik.', 'Usahamu selama ini luar biasa!',
];

const ROASTS = [
    'Wifi tetangga lebih setia daripada kamu ke gym.', 'Kamu kayak baterai HP lowbat, gampang capek.',
    'Mimpi kamu setinggi langit, tapi alarm kamu kalah sama bantal.', 'Kamu spesial... kayak nasi goreng tanpa garam.',
];

const PICKUP_LINES = [
    'Kamu kayak wifi, bikin aku pengen connect terus.', 'Apa kamu magnet? Soalnya aku tertarik banget.',
    'Kamu kayak kalkulator, bikin hidupku lebih terhitung indah.', 'Senyum kamu kayak update OS, selalu bikin upgrade mood.',
];

const NEVER_HAVE_I_EVER = [
    'Berbohong ke orang tua', 'Nge-stalk mantan di sosmed', 'Ketiduran di kelas/meeting',
    'Salah kirim chat ke orang yang salah', 'Pura-pura sibuk biar gak diajak ngumpul',
];

const STORY_STARTERS = [
    'Di tengah hutan yang gelap, seorang petualang menemukan...',
    'Hari itu langit tiba-tiba berubah warna menjadi ungu, semua orang...',
    'Sebuah pesan misterius muncul di ponselnya: "Jangan buka pintu itu."',
    'Setelah bertahun-tahun, ia akhirnya menemukan kunci rahasia ke...',
];

const EMOJI_PUZZLES = [
    { emoji: '🦁👑', answer: 'lion king' },
    { emoji: '🕷️🧑', answer: 'spiderman' },
    { emoji: '❄️👸', answer: 'frozen' },
    { emoji: '🏠🔝', answer: 'up' },
];

const SESSIONS = new Map();

export const funCommands2 = {
    async compliment(reply, mentioned) {
        const target = mentioned?.[0];
        await reply(target ? `💝 @${jidNum(target)}, ${pick(COMPLIMENTS)}` : `💝 ${pick(COMPLIMENTS)}`);
    },

    async roast(reply, mentioned) {
        const target = mentioned?.[0];
        await reply(target ? `🔥 @${jidNum(target)}, ${pick(ROASTS)}` : `🔥 ${pick(ROASTS)}`);
    },

    async pickupLine(reply) {
        await reply(`😏 ${pick(PICKUP_LINES)}`);
    },

    async neverHaveIEver(reply) {
        await reply(`🙊 *NEVER HAVE I EVER*\n\n"${pick(NEVER_HAVE_I_EVER)}"`);
    },

    async storyStarter(reply) {
        await reply(`📖 *STORY STARTER*\n\n${pick(STORY_STARTERS)}\n\nLanjutkan ceritanya!`);
    },

    async emojiPuzzle(reply, jid) {
        const p = pick(EMOJI_PUZZLES);
        SESSIONS.set(`emoji:${jid}`, p.answer);
        await reply(`🧩 *TEBAK FILM DARI EMOJI*\n\n${p.emoji}\n\nJawab dengan: *!jawabemoji [jawaban]*`);
    },

    async answerEmoji(reply, jid, args) {
        const ans = (args.join(' ') || '').toLowerCase().trim();
        const correct = SESSIONS.get(`emoji:${jid}`);
        if (!correct) return reply('❌ Tidak ada game aktif. Ketik *!emojipuzzle* dulu!');
        if (ans === correct) {
            SESSIONS.delete(`emoji:${jid}`);
            await reply('🎉 *BENAR!*');
        } else {
            await reply('❌ Salah, coba lagi!');
        }
    },

    async magic8ball(reply, args) {
        const question = args.join(' ');
        if (!question) return reply('📌 !magic8ball [pertanyaan]');
        const answers = [
            'Ya, pasti!', 'Tidak mungkin.', 'Mungkin saja.', 'Tanyakan lagi nanti.',
            'Jangan berharap lebih.', 'Sangat mungkin!', 'Sumber tidak jelas, coba lagi.', 'Pasti tidak.',
        ];
        await reply(`🎱 *MAGIC 8-BALL*\n\nQ: ${question}\nA: *${pick(answers)}*`);
    },

    async randomChallenge(reply) {
        const challenges = [
            'Minum air putih 2 liter hari ini!', 'Tidak buka sosmed selama 1 jam.',
            'Beri pujian ke 3 orang hari ini.', 'Jalan kaki 20 menit tanpa HP.',
            'Tulis 3 hal yang kamu syukuri hari ini.',
        ];
        await reply(`🏆 *CHALLENGE HARI INI*\n\n${pick(challenges)}`);
    },

    async wordAssociation(reply, jid) {
        const words = ['Laut', 'Bintang', 'Mimpi', 'Hujan', 'Cahaya', 'Waktu', 'Kenangan'];
        const w = pick(words);
        await reply(`🔗 *ASOSIASI KATA*\n\nKata: *${w}*\nBalas dengan kata apapun yang terlintas di pikiranmu!`);
    },

    async mbtiGuess(reply) {
        const types = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
        await reply(`🧠 *MBTI RANDOM HARI INI*\n\nTipe kamu hari ini adalah: *${pick(types)}* (just for fun!)`);
    },

    async luckyNumber(reply, sender) {
        await reply(`🍀 Angka keberuntunganmu hari ini: *${randInt(1, 99)}*`);
    },

    async dailyMood(reply) {
        const moods = ['😄 Ceria', '😌 Tenang', '🔥 Bersemangat', '😴 Santai', '🤔 Penuh ide', '💪 Produktif'];
        await reply(`🎭 Mood kamu hari ini: *${pick(moods)}*`);
    },
};
