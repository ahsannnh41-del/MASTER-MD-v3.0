import { pick, randInt, percentChance, jidNum } from '../lib/utils.js';

// ─── GOJO SATORU — STATIC CONTENT POOLS ────────────────────────────────────
// Catatan: semua teks di bawah ditulis ulang dengan gaya sendiri (bukan kutipan
// verbatim dari manga/anime) untuk menghormati hak cipta karya aslinya.
// Ini BUKAN chatbot AI — semua balasan dipilih acak dari daftar statis.

const GOJO_QUOTES = [
    'Tenang aja, yang terkuat di sini cuma ada satu, dan itu aku.',
    'Selama aku ada, kalian semua aman. Itu jaminan dari yang terkuat.',
    'Belajar itu penting, tapi rasa percaya diri lebih penting lagi.',
    'Aku nggak pernah kalah, karena aku selalu pastikan menang dulu sebelum bertarung.',
    'Limit itu cuma ada buat orang yang belum nemu batas sebenarnya.',
    'Yang lemah nggak punya pilihan. Yang kuat yang menentukan jalannya sendiri.',
    'Aku bukannya sombong, aku cuma jujur soal seberapa kuat aku.',
    'Kalau kamu jatuh, anggap aja itu pose keren buat bangkit lagi.',
    'Dunia ini luas dan penuh kemungkinan — kalau kamu berani melangkah.',
    'Guru yang baik itu bukan yang paling pintar, tapi yang paling percaya sama muridnya.',
    'Santai aja, semua juga akan baik-baik saja kalau aku turun tangan.',
    'Kekuatan tanpa rasa percaya diri itu sia-sia.',
];

const GOJO_TECHNIQUES = [
    { name: 'Limitless — Blue', desc: 'Menarik segala sesuatu di sekitarnya dengan gaya tarik tak terbatas.' },
    { name: 'Limitless — Red', desc: 'Mendorong segala sesuatu menjauh dengan gaya tolak yang dahsyat.' },
    { name: 'Hollow Technique — Purple', desc: 'Gabungan Blue dan Red, menciptakan ledakan energi yang menghapus apapun di lintasannya.' },
    { name: 'Domain Expansion: Unlimited Void', desc: 'Membuka domain yang membanjiri targetnya dengan informasi tanpa batas, melumpuhkan tanpa perlawanan.' },
    { name: 'Six Eyes', desc: 'Mata yang bisa melihat aliran energi kutukan dengan presisi luar biasa, nyaris tanpa cela.' },
    { name: 'Cursed Energy Reinforcement', desc: 'Memperkuat kemampuan fisik dengan energi kutukan agar gerakannya jauh di atas manusia biasa.' },
];

const GOJO_ROASTS = [
    'Hadeh, kalau ketemu musuh selemah kamu, aku bisa sambil makan permen karet.',
    'Kamu tuh kayak teknik kutukan level 4 — lucu tapi nggak ngancem.',
    'Santai dikit kali, kamu tegang terus kayak lagi ngelawan Special Grade.',
    'Kalau kamu sekuat omonganmu, dunia jujutsu udah damai dari kemarin.',
    'Coba deh latihan dulu sebelum nantang yang terkuat ngomong gini.',
    'Kamu butuh lebih dari sekadar niat buat ngalahin aku, kawan.',
];

const GOJO_HYPE = [
    'Kamu pasti bisa! Anggap aja kamu lagi dilatih langsung sama yang terkuat.',
    'Jangan ragu, jalanmu udah benar — tinggal jalan terus aja!',
    'Semangat! Bahkan jurus paling rumit pun mulai dari latihan kecil.',
    'Percaya diri itu separuh dari kemenangan. Sisanya, usaha kerasmu sendiri.',
    'Kamu lebih kuat dari yang kamu kira, cuma belum nemu momennya aja.',
    'Teruslah melangkah — yang terkuat pun dulu pernah jadi pemula.',
];

const GOJO_FACTS = [
    'Gojo Satoru dikenal sebagai salah satu sorcerer (penyihir kutukan) paling kuat di generasinya.',
    'Ciri khasnya adalah penutup mata atau kacamata hitam yang ia pakai untuk mengontrol kemampuan matanya.',
    'Ia dikenal punya kepribadian santai dan suka bercanda, meskipun kekuatannya luar biasa besar.',
    'Gojo sering digambarkan sebagai sosok guru yang sangat percaya pada potensi murid-muridnya.',
    'Gaya bertarungnya mengandalkan teknik manipulasi ruang dan energi yang sangat jarang dimiliki sorcerer lain.',
];

function fmtName(jid) { return jidNum(jid); }

export const gojoCommands = {
    async gojoQuote(reply) {
        await reply(`💙 *GOJO SATORU*\n\n_"${pick(GOJO_QUOTES)}"_`);
    },

    async gojoTeknik(reply) {
        const t = pick(GOJO_TECHNIQUES);
        await reply(`🌀 *TEKNIK GOJO SATORU*\n\n✨ *${t.name}*\n${t.desc}`);
    },

    async gojoRoast(reply, sender, mentioned) {
        const target = mentioned?.[0] ? `@${fmtName(mentioned[0])}` : `@${fmtName(sender)}`;
        await reply(`😏 *GOJO NGEROAST*\n\n${target}\n\n_"${pick(GOJO_ROASTS)}"_`);
    },

    async gojoHype(reply, sender, mentioned) {
        const target = mentioned?.[0] ? `@${fmtName(mentioned[0])}` : `@${fmtName(sender)}`;
        await reply(`💪 *GOJO NYEMANGATIN*\n\n${target}\n\n_"${pick(GOJO_HYPE)}"_`);
    },

    async gojoFact(reply) {
        await reply(`🧠 *FAKTA GOJO SATORU*\n\n${pick(GOJO_FACTS)}`);
    },

    async gojoPower(reply, sender, mentioned) {
        // "Cek kekuatan" ala Gojo — random meter lucu-lucuan, bukan AI, cuma RNG.
        const target = mentioned?.[0] || sender;
        const power = randInt(1, 100);
        let title;
        if (power >= 95) title = '🔵 SETARA YANG TERKUAT!';
        else if (power >= 70) title = '🟣 Special Grade!';
        else if (power >= 40) title = '🟢 Grade 1, lumayan!';
        else title = '⚪ Masih perlu banyak latihan!';

        await reply(`⚡ *CEK KEKUATAN ALA GOJO*\n\n@${fmtName(target)}\nPower Level: *${power}/100*\n${title}\n\n_"${percentChance(50) ? 'Nggak buruk, tapi masih jauh dari aku.' : 'Lumayan, tapi limitmu belum ketemu.'}"_`);
    },
};
