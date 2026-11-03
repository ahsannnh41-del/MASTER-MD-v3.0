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
    async fact(reply) { await reply(`🧠 *Fun Fact:*\n${pick(FACTS)}`); },

    async riddle(reply, jid) {
        const r = pick(RIDDLES);
        activeGames.set(`riddle:${jid}`, r.a);
        await reply(`🧩 *RIDDLE TIME*\n\n${r.q}\n\nAnswer using: *.answer [your_answer]*`);
    },

    async answerRiddle(reply, jid, args) {
        const ans = (args.join(' ') || '').toLowerCase().trim();
        const correct = activeGames.get(`riddle:${jid}`);
        if (!correct) return reply('❌ No active riddle in this chat. Type *.riddle* first!');
        if (ans === correct) {
            activeGames.delete(`riddle:${jid}`);
            await reply('🎉 *CORRECT!* Outstanding brain power!');
        } else {
            await reply('❌ Incorrect, try again!');
        }
    },

    async truth(reply) { await reply(`🤔 *TRUTH:*\n${pick(TRUTHS)}`); },
    async dare(reply) { await reply(`🔥 *DARE:*\n${pick(DARES)}`); },

    async tebakGambar(reply, jid) {
        const t = pick(TEBAK_GAMBAR);
        activeGames.set(`tebak:${jid}`, t.answer);
        await reply(`🖼️ *GUESS THE EMOJI*\n\n${t.emoji}\n\nAnswer using: *.answer [word]*`);
    },

    async answerTebak(reply, jid, args) {
        const ans = (args.join(' ') || '').toLowerCase().trim();
        const correct = activeGames.get(`tebak:${jid}`);
        if (!correct) return reply('❌ No active guessing game. Type *.tebakgambar* first!');
        if (ans === correct) {
            activeGames.delete(`tebak:${jid}`);
            await reply('🎉 *CORRECT!* You nailed it!');
        } else {
            await reply('❌ Wrong guess, try again!');
        }
    },

    async pantun(reply) { await reply(`📜 *POEM*\n\n${pick(PANTUN)}`); },

    async horoscope(reply, args) {
        const sign = (args[0] || '').toLowerCase();
        if (!HOROSCOPE[sign]) {
            return reply(`📌 Usage: *.zodiac [sign]*\nOptions: ${Object.keys(HOROSCOPE).join(', ')}`);
        }
        await reply(`🔮 *HOROSCOPE FOR ${sign.toUpperCase()}*\n\n${HOROSCOPE[sign]}`);
    },

    async coinFlip(reply) {
        await reply(`🪙 Result: *${percentChance(50) ? 'HEADS' : 'TAILS'}*`);
    },

    async rollDice(reply, args) {
        const sides = parseInt(args?.[0]) || 6;
        const result = randInt(1, sides);
        await reply(`🎲 Dice (1-${sides}): *${result}*`);
    },

    async rps(reply, args) {
        const choices = ['rock', 'paper', 'scissors'];
        let user = (args[0] || '').toLowerCase();
        if (user === 'batu') user = 'rock';
        if (user === 'gunting') user = 'scissors';
        if (user === 'kertas') user = 'paper';
        if (!choices.includes(user)) return reply('📌 Usage: *.rps rock/paper/scissors*');

        const bot = pick(choices);
        let result;
        if (user === bot) result = '🤝 IT\'S A DRAW!';
        else if (
            (user === 'rock' && bot === 'scissors') ||
            (user === 'scissors' && bot === 'paper') ||
            (user === 'paper' && bot === 'rock')
        ) result = '🎉 YOU WIN!';
        else result = '😢 BOT WINS!';

        await reply(`✊✋✌️ *ROCK PAPER SCISSORS*\n\nYou: ${user.toUpperCase()}\nBot: ${bot.toUpperCase()}\n\n${result}`);
    },

    async slot(reply, sender) {
        const symbols = ['🍒', '🍋', '🔔', '💎', '7️⃣', '🍀'];
        const result = [pick(symbols), pick(symbols), pick(symbols)];
        const win = result[0] === result[1] && result[1] === result[2];
        await reply(`🎰 *SLOT MACHINE*\n\n[ ${result.join(' | ')} ]\n\n${win ? '🎉 *JACKPOT!*' : '😢 Spin again!'}`);
    },

    async tebakAngka(reply, jid) {
        const num = randInt(1, 100);
        activeGames.set(`angka:${jid}`, num);
        await reply('🔢 *GUESS THE NUMBER (1-100)*\n\nI have chosen a secret number between 1 and 100!\nGuess with: *.guess [number]*');
    },

    async guessNumber(reply, jid, args) {
        const guess = parseInt(args?.[0]);
        const target = activeGames.get(`angka:${jid}`);
        if (target === undefined) return reply('❌ No active number guessing game. Start with *.guessnumber*!');
        if (isNaN(guess)) return reply('📌 Usage: *.guess [number]*');

        if (guess === target) {
            activeGames.delete(`angka:${jid}`);
            await reply(`🎉 *BINGO!* The secret number was indeed *${target}*!`);
        } else if (guess < target) {
            await reply('📈 Higher! Try a bigger number.');
        } else {
            await reply('📉 Lower! Try a smaller number.');
        }
    },

    async wouldYouRather(reply) {
        const pairs = [
            ['Rich but ugly', 'Poor but attractive'],
            ['Ability to fly', 'Ability to be invisible'],
            ['Live without internet', 'Live without air conditioning'],
            ['Always tell the truth', 'Always get lucky'],
            ['$100,000 right now', '$10,000 every year forever'],
        ];
        const p = pick(pairs);
        await reply(`🤔 *WOULD YOU RATHER*\n\nA) ${p[0]}\nor\nB) ${p[1]}`);
    },

    async checkJodoh(reply, sender, mentioned) {
        if (!mentioned?.[0]) return reply('📌 Usage: *.match @tag*');
        const percent = randInt(1, 100);
        await reply(`💞 *LOVE COMPATIBILITY*\n\n@${fmtName(sender)} + @${fmtName(mentioned[0])}\n\nCompatibility: *${percent}%*\n${percent > 70 ? '😍 Perfect Match!' : percent > 40 ? '😊 Good Chemistry!' : '😅 Just Friends...'}`);
    },

    async tarotCard(reply) {
        const cards = ['The Fool', 'The Magician', 'The Lovers', 'The Sun', 'The Moon', 'Death', 'The Tower', 'The Star', 'Wheel of Fortune', 'Strength'];
        await reply(`🔮 *TAROT READING TODAY*\n\n🃏 *${pick(cards)}*\n\nReflect upon its wisdom throughout your day.`);
    },

    async fortuneCookie(reply) {
        const fortunes = [
            'Something wonderful is heading your way this week.',
            'Never hesitate to embrace a bold new opportunity.',
            'The people you care about truly value your loyalty.',
            'Patience and persistence will reap abundant rewards.',
            'A thrilling journey or breakthrough awaits you.',
        ];
        await reply(`🥠 *FORTUNE COOKIE*\n\n_${pick(fortunes)}_`);
    },

    async hitungCinta(reply, sender, mentioned, args) {
        const name1 = args?.[0] || 'You';
        const name2 = mentioned?.[0] ? fmtName(mentioned[0]) : (args?.[1] || 'Partner');
        const percent = randInt(1, 100);
        await reply(`💘 *LOVE CALCULATOR*\n\n${name1} ❤️ ${name2}\n\nScore: *${percent}%*`);
    },
};
