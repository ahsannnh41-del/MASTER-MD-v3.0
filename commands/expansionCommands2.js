// ═══════════════════════════════════════════════════════════════════
//  EXPANSION PACK 2 — minimal 5 command baru per kategori di .allmenu
// ═══════════════════════════════════════════════════════════════════
//  Semua teks original (ditulis sendiri). Registrasi (reg() loop + kategori)
//  ada di commands/index.js, sama pola dengan commands/expansionCommands.js.
// ═══════════════════════════════════════════════════════════════════

export const RPG_LORE = [
    'Di dunia RPG ini, setiap karakter mulai dari Level 1 — bahkan penyihir kutukan terkuat sekalipun pernah jadi pemula.',
    'Gold yang kamu kumpulkan bisa dipakai buat beli perlengkapan di toko — cek `.shop` buat lihat apa aja yang tersedia.',
    'Naik level nggak cuma soal angka — tiap level baru biasanya buka akses ke fitur atau area baru.',
    'Guild adalah tempat buat gabung sama pemain lain dan saling bantu progress bareng-bareng.',
    'Domain Expansion butuh penguasaan penuh atas cursed energy — di RPG ini, anggap aja itu skill tier tertinggi yang butuh grinding niat.',
    'Setiap petualangan besar dimulai dari keputusan kecil buat mulai duluan. Coba `.daftar` kalau belum gabung.',
];

export const TIPS_TOOLS = [
    'Tips: sebelum convert file besar, cek dulu format tujuannya didukung command yang kamu pakai.',
    'Tips: kombinasi kalkulator + konversi satuan bisa bantu kerjaan sehari-hari, coba explore `.allmenu` kategori Tools.',
    'Tips: simpan hasil convert penting di luar chat, soalnya history WhatsApp bisa kehapus kalau chat dibersihin.',
    'Tips: kalau butuh hitung cepat, banyak command tools bisa langsung terima angka desimal, nggak cuma bulat.',
    'Tips: gunakan tools validator buat ngecek format data (email, nomor, dll) sebelum submit ke sistem lain.',
    'Tips: beberapa command tools bisa dirantai — hasil satu command dipakai jadi input command berikutnya secara manual.',
];

export const CAPTION_IDEAS = [
    'Kadang yang paling indah itu yang paling sederhana.',
    'Ceritanya panjang, tapi fotonya cukup buat jelasin semuanya.',
    'Progress kecil hari ini, langkah besar buat nanti.',
    'Nggak semua momen harus dijelasin, cukup diabadikan.',
    'Versi terbaik diri sendiri itu proses, bukan tujuan akhir.',
    'Kalau capek boleh berhenti sebentar, asal jangan lupa jalan lagi.',
];

export const BOT_FACTS = [
    "Bot WhatsApp modern biasanya jalan pakai library yang 'membaca' protokol WhatsApp Web, bukan API resmi dari Meta.",
    'Setiap pesan yang bot kirim tetap melewati proses enkripsi end-to-end yang sama kayak chat biasa antar manusia.',
    'Uptime bot itu penting — semakin stabil koneksinya, semakin jarang butuh scan ulang QR/pairing code.',
    'Banyak bot WhatsApp dijalankan di server kecil (VPS/hosting panel) yang nyala 24 jam supaya selalu online.',
    'Command prefix (kayak titik di depan perintah) membantu bot bedain mana pesan biasa dan mana yang harus diproses sebagai perintah.',
    'Fitur auto-reconnect itu krusial — kalau koneksi bot putus, dia harus bisa nyambung lagi sendiri tanpa perlu restart manual.',
];

export const MUSIC_TRIVIA = [
    'Format MP3 jadi salah satu format audio paling populer karena ukurannya kecil tapi kualitasnya cukup baik.',
    'Sebelum era streaming, orang biasa download lagu satu-satu dan simpan di memori HP atau MP3 player.',
    'Banyak platform musik sekarang punya fitur rekomendasi otomatis berdasarkan kebiasaan dengar penggunanya.',
    "Remix dan mashup jadi cara populer buat kasih 'wajah baru' ke lagu yang udah lama rilis.",
    'Playlist personal jadi salah satu cara orang paling sering nunjukin selera musik mereka ke orang lain.',
    'Beberapa lagu sengaja dibikin dengan tempo tertentu supaya cocok didengerin pas olahraga atau kerja.',
];

export const PANEL_INFO = [
    "Tips panel: selalu backup folder `data/` secara berkala, itu tempat penyimpanan pengaturan bot kamu.",
    'Tips panel: restart bot lewat panel biasanya lebih aman daripada matiin paksa proses yang lagi jalan.',
    'Tips panel: cek log server kalau bot tiba-tiba berhenti merespon, biasanya ada petunjuk error di sana.',
    'Tips panel: jangan lupa cek kuota resource (RAM/CPU) server, bot yang kehabisan resource bisa lag atau crash.',
    'Tips panel: pisahkan environment variable sensitif (kayak token) dari file yang gampang ke-share ke orang lain.',
    'Tips panel: update dependency secara berkala membantu bot tetap kompatibel sama perubahan di sisi WhatsApp.',
];

export const SEMANGAT_PAGI = [
    'Pagi ini kesempatan baru — nggak perlu langsung sempurna, cukup mulai dulu.',
    'Satu langkah pelan tiap pagi tetap lebih baik daripada diam di tempat.',
    'Semangat buat hari ini, secukupnya aja, yang penting konsisten besok juga.',
    'Nggak apa mulai pelan-pelan, yang penting nggak berhenti di tengah jalan.',
    'Hari baru, beban lama boleh ditinggal — fokus ke apa yang bisa dikerjain hari ini.',
];
