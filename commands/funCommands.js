import { randInt, pick, percentChance, jidNum } from '../lib/utils.js';

// ─── STATIC CONTENT POOLS ──────────────────────────────────────────────────
const QUOTES = [
    'Hidup adalah perjalanan, bukan tujuan.',
    'Kegagalan adalah guru terbaik.',
    'Jangan takut gagal, takutlah tidak mencoba.',
    'Waktu adalah hal paling berharga yang kita punya.',
    'Kebahagiaan dimulai dari rasa syukur.',
    'Sukses adalah hasil dari kerja keras dan doa.',
    'Mimpi besar, usaha keras, hasil maksimal.',
    'Setiap masalah punya jalan keluar.',
    'Belajarlah dari hari ini, hiduplah untuk hari esok.',
    'Orang hebat tidak lahir, mereka dibentuk.',
];

const FACTS = [
    'Madu tidak akan pernah basi jika disimpan dengan benar.',
    'Jantung paus biru seukuran mobil kecil.',
    'Gurita memiliki tiga jantung.',
    'Bulan menjauh dari Bumi sekitar 3.8 cm setiap tahun.',
    'Kucing tidak bisa merasakan rasa manis.',
    'Lebah bisa mengenali wajah manusia.',
    'Otak manusia menggunakan 20% energi tubuh.',
    'Hujan berlian pernah terjadi di Jupiter dan Saturnus (teori).',
    'Tulang manusia 5x lebih kuat dari baja dengan berat yang sama.',
    'Bintang laut tidak punya otak.',
];

const RIDDLES = [
    { q: 'Semakin diisi, semakin ringan. Apakah itu?', a: 'balon' },
    { q: 'Punya kunci tapi tidak bisa buka pintu. Apa itu?', a: 'piano' },
    { q: 'Makin dipotong makin besar. Apa itu?', a: 'lubang' },
    { q: 'Punya kepala dan ekor tapi tidak punya badan. Apa itu?', a: 'uang' },
    { q: 'Bisa berjalan tanpa kaki. Apa itu?', a: 'waktu' },
];

const TRUTHS = [
    'Apa hal paling memalukan yang pernah kamu lakukan?',
    'Siapa crush pertamamu?',
    'Pernah berbohong ke orang tua tentang apa?',
    'Apa rahasia yang belum pernah kamu ceritakan ke siapapun?',
    'Apa ketakutan terbesarmu?',
];

const DARES = [
    'Kirim voice note menyanyi selama 10 detik!',
    'Ganti foto profil jadi gambar lucu selama 1 jam.',
    'Chat orang random "halo aku ganteng/cantik".',
    'Tulis caption aneh di status WhatsApp.',
    'Telepon teman dan bilang "aku sayang kamu" lalu tutup.',
];

const TEBAK_GAMBAR = [
    { emoji: '🍕🇮🇹', answer: 'pizza' },
    { emoji: '🐱👑', answer: 'kucing raja' },
    { emoji: '🌙⭐', answer: 'malam' },
    { emoji: '🔥👨‍🚒', answer: 'pemadam kebakaran' },
    { emoji: '☔🌧️', answer: 'hujan' },
];

const PANTUN = [
    'Jalan-jalan ke kota Blitar\nJangan lupa beli oleh-oleh\nKalau kamu rajin belajar\nMasa depan pasti cerah',
    'Ada ulat di dalam buku\nBuku dimakan habis sehalaman\nKalau kamu sedang galau\nCurhat aja sama Tuhan',
    'Buah mangga buah kedondong\nKalau jatuh ke dalam kali\nKalau ngantuk jangan melamun\nKalau lapar jangan dikuli',
];

const HOROSCOPE = {
    aries: 'Hari ini penuh energi! Manfaatkan untuk hal produktif.',
    taurus: 'Stabilitas adalah kekuatanmu hari ini.',
    gemini: 'Komunikasi jadi kunci kesuksesanmu hari ini.',
    cancer: 'Perasaanmu sensitif, jaga emosi dengan baik.',
    leo: 'Saatnya tampil dan tunjukkan kemampuanmu!',
    virgo: 'Detail kecil akan membawa hasil besar.',
    libra: 'Keseimbangan hidup jadi fokus utama hari ini.',
    scorpio: 'Intuisimu kuat, percayalah pada insting.',
    sagittarius: 'Petualangan baru menanti di depan.',
    capricorn: 'Kerja keras hari ini akan berbuah manis.',
    aquarius: 'Ide kreatif mengalir deras hari ini.',
    pisces: 'Waktunya merenung dan mengisi ulang energi.',
};

// active hangman/tebak sessions per chat
const activeGames = new Map();

function fmtName(jid) { return jidNum(jid); }

export const funCommands = {
    async quote(reply) { await reply(`💬 _"${pick(QUOTES)}"_`); },
    async fact(reply) { await reply(`🧠 *Fakta Unik:*\n${pick(FACTS)}`); },

    async riddle(reply, jid) {
        const r = pick(RIDDLES);
        activeGames.set(`riddle:${jid}`, r.a);
        await reply(`🧩 *TEKA-TEKI*\n\n${r.q}\n\nJawab dengan: *!jawab [jawaban]*`);
    },

    async answerRiddle(reply, jid, args) {
        const ans = (args.join(' ') || '').toLowerCase().trim();
        const correct = activeGames.get(`riddle:${jid}`);
        if (!correct) return reply('❌ Tidak ada teka-teki aktif. Ketik *!riddle* dulu!');
        if (ans === correct) {
            activeGames.delete(`riddle:${jid}`);
            await reply('🎉 *BENAR!* Kamu hebat!');
        } else {
            await reply('❌ Salah, coba lagi!');
        }
    },

    async truth(reply) { await reply(`🤔 *TRUTH:*\n${pick(TRUTHS)}`); },
    async dare(reply) { await reply(`🔥 *DARE:*\n${pick(DARES)}`); },

    async tebakGambar(reply, jid) {
        const t = pick(TEBAK_GAMBAR);
        activeGames.set(`tebak:${jid}`, t.answer);
        await reply(`🖼️ *TEBAK GAMBAR*\n\n${t.emoji}\n\nJawab dengan: *!jawab [jawaban]*`);
    },

    async answerTebak(reply, jid, args) {
        const ans = (args.join(' ') || '').toLowerCase().trim();
        const correct = activeGames.get(`tebak:${jid}`);
        if (!correct) return reply('❌ Tidak ada game aktif. Ketik *!tebakgambar* dulu!');
        if (ans === correct) {
            activeGames.delete(`tebak:${jid}`);
            await reply('🎉 *BENAR!* Kamu jago nebak!');
        } else {
            await reply('❌ Salah, coba lagi!');
        }
    },

    async pantun(reply) { await reply(`📜 *PANTUN*\n\n${pick(PANTUN)}`); },

    async horoscope(reply, args) {
        const sign = (args[0] || '').toLowerCase();
        if (!HOROSCOPE[sign]) {
            return reply(`📌 Cara pakai: *!zodiak [nama]*\nPilihan: ${Object.keys(HOROSCOPE).join(', ')}`);
        }
        await reply(`🔮 *RAMALAN ${sign.toUpperCase()}*\n\n${HOROSCOPE[sign]}`);
    },

    async coinFlip(reply) {
        await reply(`🪙 Hasil: *${percentChance(50) ? 'GAMBAR' : 'ANGKA'}*`);
    },

    async rollDice(reply, args) {
        const sides = parseInt(args?.[0]) || 6;
        const result = randInt(1, sides);
        await reply(`🎲 Dadu (1-${sides}): *${result}*`);
    },

    async rps(reply, args) {
        const choices = ['batu', 'gunting', 'kertas'];
        const user = (args[0] || '').toLowerCase();
        if (!choices.includes(user)) return reply('📌 Cara pakai: *!rps batu/gunting/kertas*');

        const bot = pick(choices);
        let result;
        if (user === bot) result = '🤝 SERI!';
        else if (
            (user === 'batu' && bot === 'gunting') ||
            (user === 'gunting' && bot === 'kertas') ||
            (user === 'kertas' && bot === 'batu')
        ) result = '🎉 KAMU MENANG!';
        else result = '😢 KAMU KALAH!';

        await reply(`✊✋✌️ *BATU GUNTING KERTAS*\n\nKamu: ${user}\nBot: ${bot}\n\n${result}`);
    },

    async slot(reply, sender) {
        const symbols = ['🍒', '🍋', '🔔', '💎', '7️⃣', '🍀'];
        const result = [pick(symbols), pick(symbols), pick(symbols)];
        const win = result[0] === result[1] && result[1] === result[2];
        await reply(`🎰 *SLOT MACHINE*\n\n[ ${result.join(' | ')} ]\n\n${win ? '🎉 *JACKPOT!*' : '😢 Coba lagi!'}`);
    },

    async tebakAngka(reply, jid) {
        const num = randInt(1, 100);
        activeGames.set(`angka:${jid}`, num);
        await reply('🔢 *TEBAK ANGKA 1-100*\n\nAku sudah pilih angka rahasia!\nTebak dengan: *!tebak [angka]*');
    },

    async guessNumber(reply, jid, args) {
        const guess = parseInt(args?.[0]);
        const target = activeGames.get(`angka:${jid}`);
        if (target === undefined) return reply('❌ Tidak ada game aktif. Ketik *!tebakangka* dulu!');
        if (isNaN(guess)) return reply('📌 Cara pakai: *!tebak [angka]*');

        if (guess === target) {
            activeGames.delete(`angka:${jid}`);
            await reply(`🎉 *BENAR!* Angkanya memang *${target}*!`);
        } else if (guess < target) {
            await reply('📈 Lebih besar lagi!');
        } else {
            await reply('📉 Lebih kecil lagi!');
        }
    },

    async wouldYouRather(reply) {
        const pairs = [
            ['kaya tapi jelek', 'miskin tapi tampan/cantik'],
            ['bisa terbang', 'bisa tak terlihat'],
            ['hidup tanpa internet', 'hidup tanpa AC'],
            ['selalu jujur', 'selalu beruntung'],
            ['punya banyak uang sekarang', 'punya sedikit uang tapi terus bertambah'],
        ];
        const p = pick(pairs);
        await reply(`🤔 *WOULD YOU RATHER*\n\nA) ${p[0]}\natau\nB) ${p[1]}`);
    },

    async checkJodoh(reply, sender, mentioned) {
        if (!mentioned?.[0]) return reply('📌 Cara pakai: *!jodoh @tag*');
        const percent = randInt(1, 100);
        await reply(`💞 *CEK JODOH*\n\n@${fmtName(sender)} + @${fmtName(mentioned[0])}\n\nPersentase: *${percent}%*\n${percent > 70 ? '😍 Cocok banget!' : percent > 40 ? '😊 Lumayan cocok!' : '😅 Mungkin cuma teman...'}`);
    },

    async tarotCard(reply) {
        const cards = ['The Fool', 'The Magician', 'The Lovers', 'The Sun', 'The Moon', 'Death', 'The Tower', 'The Star', 'Wheel of Fortune', 'Strength'];
        await reply(`🔮 *KARTU TAROT HARI INI*\n\n🃏 *${pick(cards)}*\n\nRenungkan maknanya untuk hidupmu hari ini.`);
    },

    async fortuneCookie(reply) {
        const fortunes = [
            'Sesuatu yang baik akan datang minggu ini.',
            'Jangan ragu untuk mengambil kesempatan baru.',
            'Orang yang kamu sayangi akan menghargai usahamu.',
            'Kesabaran akan membawa hasil yang manis.',
            'Perubahan besar sedang menantimu.',
        ];
        await reply(`🥠 *FORTUNE COOKIE*\n\n${pick(fortunes)}`);
    },

    async hitungCinta(reply, sender, mentioned, args) {
        const name1 = args?.[0] || 'Kamu';
        const name2 = mentioned?.[0] ? fmtName(mentioned[0]) : (args?.[1] || 'Dia');
        const percent = randInt(1, 100);
        await reply(`💘 *LOVE CALCULATOR*\n\n${name1} ❤️ ${name2}\n\nHasil: *${percent}%*`);
    },
};
