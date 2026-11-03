// ═══════════════════════════════════════════════════════════════════
//  THUMBNAILSOURCE.JS — sumber gambar thumbnail bot (lokal > URL)
// ═══════════════════════════════════════════════════════════════════
// LATAR BELAKANG: sepanjang sesi debugging thumbnail .menu, gambar dari
// settings.thumbnailUrl (link catbox.moe) berkali-kali gagal tampil lewat
// BANYAK teknik pengiriman yang berbeda-beda (.menu lewat relayMessage,
// .allmenu lewat sock.sendMessage biasa — dua jalur kode yang SAMA SEKALI
// tidak berhubungan). Kesamaan satu-satunya di antara semua kegagalan itu
// adalah SUMBER gambarnya: URL eksternal yang di-fetch ulang setiap kali
// pesan dikirim. Layanan hosting gambar gratis seperti catbox.moe bisa
// lambat atau membatasi (rate-limit) request dari IP kelas server —
// apalagi setelah link yang sama di-fetch berkali-kali sepanjang sesi
// testing ini. Daripada terus menebak teknik pengiriman mana yang
// "benar", file lokal MENGHILANGKAN total ketergantungan ke jaringan
// luar untuk urusan ini — dijamin selalu ada & selalu cepat, apapun
// kondisi koneksi ke catbox.moe saat itu.
//
// CARA PAKAI: taruh file gambar di media/thumbnail.png (atau .jpg —
// urutan pencarian di bawah). Kalau file itu ADA, dipakai sebagai Buffer
// langsung (tanpa fetch jaringan sama sekali). Kalau TIDAK ada, otomatis
// fallback ke settings.thumbnailUrl seperti sebelumnya — jadi aman dipasang
// tanpa breaking apapun kalau filenya belum sempat ditaruh.
import fs from 'fs';
import path from 'path';
import settings from '../setting.js';

const CANDIDATE_PATHS = [
    path.join(process.cwd(), 'media', 'thumbnail.png'),
    path.join(process.cwd(), 'media', 'thumbnail.jpg'),
    path.join(process.cwd(), 'media', 'thumbnail.jpeg'),
];

let _cachedLocalBuffer = null;
let _cachedLocalPath = null;
let _checked = false;

function findLocalThumbnail() {
    if (_checked) return _cachedLocalBuffer;
    _checked = true;
    for (const p of CANDIDATE_PATHS) {
        try {
            if (fs.existsSync(p)) {
                _cachedLocalBuffer = fs.readFileSync(p);
                _cachedLocalPath = p;
                return _cachedLocalBuffer;
            }
        } catch { /* lanjut coba path berikutnya */ }
    }
    return null;
}

/**
 * Balikin { image: Buffer } kalau ada file thumbnail lokal di media/,
 * atau { image: { url: settings.thumbnailUrl } } sebagai fallback kalau
 * tidak ada. Dipakai di semua tempat yang selama ini pakai
 * `{ image: { url: settings.thumbnailUrl } }` langsung (menu.js,
 * commands/index.js replyWithImage, dst) supaya satu sumber kebenaran.
 */
export function getThumbnailImageContent() {
    const local = findLocalThumbnail();
    if (local) return { image: local };
    return { image: { url: settings.thumbnailUrl } };
}

/** True kalau lagi pakai file lokal (bukan URL) — berguna buat logging. */
export function isUsingLocalThumbnail() {
    findLocalThumbnail();
    return !!_cachedLocalBuffer;
}

export function getLocalThumbnailPath() {
    findLocalThumbnail();
    return _cachedLocalPath;
}
