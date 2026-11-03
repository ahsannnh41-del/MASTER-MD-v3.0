// ═══════════════════════════════════════════════════════════════════
//  EXPANSION PACK 3 — target kategori paling kecil biar lebih adil
// ═══════════════════════════════════════════════════════════════════
//  Breakdown sebelum pack ini (dihitung dari getRegisteredCommandCount()
//  yang sama dipakai .totalfitur): 🎵 Musik & Download 20, 🤖 Bot 46,
//  🖼️ Media 46 — jauh di bawah kategori lain (Fun 406, Tools 274, dst).
//  Pack ini fokus nambahin ke 3 kategori itu aja (15 masing-masing),
//  BUKAN disebar rata ke semua kategori — supaya beneran ngejar
//  keseimbangan, bukan makin nambah gap yang sudah ada.
// ═══════════════════════════════════════════════════════════════════

export const AUDIO_FACT = [
    'Notasi musik yang paling sering dipakai dalam skala do-re-mi disebut dengan tangga nada mayor.',
    'Headphone pertama kali dikembangkan buat keperluan operator telepon, bukan buat dengerin musik.',
    'Genre musik lo-fi sering dipakai buat nemenin belajar atau kerja karena temponya yang santai dan konsisten.',
    'Beberapa lagu sengaja di-mixing dengan frekuensi bass yang lebih tebal biar cocok didengerin lewat speaker mobil.',
    'Format audio lossless (kayak FLAC) menyimpan kualitas suara asli tanpa kompresi yang menghilangkan detail.',
    "Istilah 'remix' dan 'cover' itu beda — remix ngubah aransemen lagu asli, cover nyanyiin ulang dengan gaya sendiri.",
    'Beberapa produser musik sengaja nambahin white noise halus di lagu buat bikin suasana lebih hangat.',
    'Podcast awalnya berkembang dari format radio internet sebelum jadi tren besar kayak sekarang.',
    'Equalizer di aplikasi musik membantu nyesuain frekuensi suara sesuai selera atau jenis headphone yang dipakai.',
    'Beberapa aplikasi musik nyimpen riwayat dengar buat bikin ringkasan tahunan kebiasaan mendengarkan penggunanya.',
    'Album konsep adalah kumpulan lagu yang sengaja disusun buat cerita satu tema besar dari awal sampai akhir.',
    'Sound check sebelum konser penting banget buat mastiin keseimbangan suara di panggung sesuai kondisi ruangan.',
    'Beberapa lagu hits ternyata awalnya ditulis buat penyanyi lain, sebelum akhirnya dipakai sendiri oleh penulisnya.',
    'Vinyl (piringan hitam) sempat dianggap ketinggalan zaman, tapi belakangan populer lagi di kalangan kolektor musik.',
    'Durasi rata-rata lagu pop modern cenderung lebih pendek dibanding dekade sebelumnya, mengikuti kebiasaan dengar yang serba cepat.',
];

export const HOSTING_TIP = [
    'Tips hosting: pastikan session/auth folder bot di-backup rutin, biar nggak perlu scan ulang QR/pairing tiap redeploy.',
    'Tips hosting: batasi jumlah child-bot (jadibot) aktif sesuai kapasitas RAM server, biar nggak semua bot ikut lag.',
    'Tips hosting: pisahkan environment tiap child-bot supaya kalau satu error, bot utama tetap jalan normal.',
    'Tips hosting: cek reminder masa aktif sewa bot secara berkala, biar nggak ada slot yang kelewat expired tanpa notifikasi.',
    'Tips hosting: broadcast massal sebaiknya dikasih jeda antar pesan, biar nggak kena rate-limit dari WhatsApp.',
    'Tips hosting: monitoring uptime bot bantu banget buat tau pola kapan biasanya koneksi suka putus.',
    'Tips hosting: siapin auto-restart kalau proses bot crash, daripada nunggu ketauan manual baru di-restart.',
    'Tips hosting: dokumentasiin config penting (prefix, owner number, dst) di tempat aman di luar server juga.',
    'Tips hosting: kasih tau penyewa bot batasan fitur apa aja yang bisa mereka pakai, biar ekspektasi jelas dari awal.',
    'Tips hosting: cadangkan nomor testing terpisah dari nomor produksi, biar eksperimen nggak ganggu layanan yang udah jalan.',
    'Tips hosting: log activity child-bot membantu banget buat nelusurin masalah kalau ada laporan error dari penyewa.',
    'Tips hosting: update dependency bot secara berkala, tapi tes dulu di environment terpisah sebelum ke produksi.',
    'Tips hosting: kasih limit resource per child-bot biar satu bot yang berat nggak makan semua kapasitas server.',
    'Tips hosting: simpan changelog tiap update fitur, biar gampang nelusurin kapan sebuah bug mulai muncul.',
    'Tips hosting: komunikasiin jadwal maintenance ke penyewa bot jauh-jauh hari, biar mereka nggak kaget bot sempat down.',
];

export const FOTO_TIP = [
    'Tips foto: cahaya alami dari jendela sering hasilin foto lebih natural dibanding lampu kamar biasa.',
    'Tips foto: bersihin lensa kamera HP secara rutin, debu tipis aja bisa bikin hasil foto jadi buram.',
    'Tips foto: aturan rule of thirds bantu bikin komposisi foto lebih enak dilihat tanpa perlu skill khusus.',
    'Tips foto: hindari zoom digital kalau bisa, kualitasnya turun jauh dibanding motret lebih deket langsung.',
    'Tips foto: background yang simpel bikin subjek foto lebih menonjol dan nggak keliatan berantakan.',
    'Tips foto: manfaatin golden hour (pagi/sore) buat hasil foto outdoor dengan warna yang lebih hangat.',
    'Tips foto: sticker WhatsApp idealnya pakai gambar dengan background transparan biar hasilnya rapi.',
    'Tips foto: simpan foto penting dalam beberapa format/lokasi, jangan cuma mengandalkan satu penyimpanan aja.',
    'Tips foto: potret dari sudut sedikit lebih tinggi biasanya bikin wajah kelihatan lebih proporsional di foto.',
    'Tips foto: hindari cahaya langsung dari belakang subjek, biasanya bikin wajah jadi gelap/backlit.',
    'Tips foto: edit ringan (brightness/contrast) sering udah cukup, nggak selalu butuh filter berat.',
    'Tips foto: video pendek yang stabil (nggak goyang) lebih enak ditonton walau kualitasnya bukan yang tertinggi.',
    'Tips foto: kompres ukuran file sebelum kirim kalau cuma buat preview cepat, biar hemat kuota penerima.',
    'Tips foto: pas convert foto ke sticker, teks kecil sering susah kebaca — mending pakai gambar yang elemen utamanya jelas.',
    'Tips foto: profile picture yang wajahnya jelas dan pencahayaan cukup biasanya lebih gampang dikenali orang lain.',
];
