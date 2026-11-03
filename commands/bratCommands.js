// ═══════════════════════════════════════════════════════════════════
//  BRATCOMMANDS.JS — Brat, IQC
//
//  CATATAN (2026-07-07): variant brat dipangkas jadi cuma 3 command —
//  .brat (default), .bratwhite, .bratgreen — sesuai permintaan. Semua
//  variant tematik (brathd/bratanime/bratpatrick/bratsquidward/bratgojo/
//  bratvermeil), variant VIDEO (bratvid/bratvid2/bratgojovid/
//  bratvermeilvid), dan menu picker interaktifnya (bratMenu) sengaja
//  dihapus. Fungsi generator video & helper terkait (fetchBratVidClip,
//  BRATVID_MAX_WORDS) ikut dihapus karena sudah tidak dipakai sama
//  sekali. `iqc` TIDAK disentuh — itu fitur terpisah, bukan variant brat.
//
//  FIX (2026-07-24): brat.siputzx.my.id (endpoint gambar brat) mati —
//  "Gagal generate brat: HTTP 530". Ini API kedua yang mati (setelah
//  api-faa.my.id dulu). Diganti total ke renderBratImage() lokal
//  (lib/bratRender.js, pakai ffmpeg) — TIDAK gantung ke API luar lagi
//  sama sekali buat 3 command ini, jadi tidak akan mati lagi gara-gara
//  provider API pihak ketiga down.
//
//  UPDATE (2026-07-25): endpoint API baru dipasang atas permintaan —
//  https://api.siputzx.my.id/api/m/brat (beda host dari brat.siputzx.my.id
//  yang mati di atas; ini kategori "m" di hub api.siputzx.my.id). Dipakai
//  sebagai percobaan PERTAMA untuk .brat & .bratwhite lewat fetchBratFromApi()
//  — bukan gantiin renderBratImage() lokal, cuma didahulukan. Kalau endpoint
//  ini gagal/mati suatu saat (sama kayak 2 API brat sebelumnya), otomatis
//  fallback diam-diam ke render lokal, jadi command tidak ikut mati lagi.
//  .bratgreen sengaja TETAP lokal saja — belum ada konfirmasi endpoint ini
//  bisa diatur warna latarnya. CATATAN: dokumentasi resmi endpoint ini tidak
//  ketemu (situs docs-nya nolak automated fetch), jadi nama parameter `text`
//  dipakai berdasar konvensi umum API sejenis — lihat komentar di
//  fetchBratFromApi() kalau ternyata perlu disesuaikan.
//
//  FIX (2026-08-01): path di atas (/api/m/brat) ternyata salah/tidak jalan.
//  Dikonfirmasi user, path yang benar adalah /api/canvas/brat (parameter
//  `text` tetap sama, jadi tebakan sebelumnya sudah tepat untuk itu).
// ═══════════════════════════════════════════════════════════════════

import settings from '../setting.js';
import { imageToWebpSticker } from '../lib/videoGen.js';

const PREFIX = settings.prefix || '.';
const FAA_BASE = 'https://api-faa.my.id'; // masih dipakai iqc() di bawah — belum diganti, di luar laporan bug ini
const BRAT_API_URL = 'https://api.siputzx.my.id/api/m/brat';

// ── 3 variant gambar yang tersisa: brat (default) / bratgreen / bratwhite ──
// Semua di-render LOKAL (lihat lib/bratRender.js) — bedanya cuma
// parameter warna latar/teks.
const IMAGE_VARIANT_COLORS = {
    brat:       { bg: 'ffffff', color: '000000' }, // default — gaya sticker brat original
    bratgreen:  { bg: '8ace00', color: '000000' }, // hijau asli album "Brat"
    bratwhite:  { bg: 'ffffff', color: '000000' },
};

// ── Fetch helper (dipakai iqc() saja sekarang, brat sudah lokal) ───
async function fetchBuf(url, timeoutMs = 30_000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
        const res = await fetch(url, {
            signal: ctrl.signal,
            headers: {
                // Beberapa provider REST API gratis (termasuk kemungkinan
                // api-faa.my.id) menolak request tanpa User-Agent yang
                // wajar dengan 403. fetch() Node tidak mengirim UA sama
                // sekali secara default, jadi kita set manual di sini.
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': '*/*',
            },
        });
        if (!res.ok) {
            // Sertakan potongan body respons (kalau ada) supaya pesan error
            // yang tampil ke user tidak cuma "HTTP 403" polos, tapi juga
            // alasan aslinya kalau providernya mengirim JSON/teks penjelasan
            // (mis. "apikey wajib diisi" atau "rate limit tercapai").
            let detail = '';
            try {
                detail = (await res.text()).replace(/\s+/g, ' ').trim().slice(0, 150);
            } catch { /* body tidak bisa dibaca, abaikan */ }
            throw new Error(`HTTP ${res.status}${detail ? ` — ${detail}` : ''}`);
        }
        const ab = await res.arrayBuffer();
        return Buffer.from(ab);
    } finally {
        clearTimeout(timer);
    }
}

// ── Fetch brat dari API luar (api.siputzx.my.id/api/m/brat) ────────
// Dipakai duluan oleh .brat & .bratwhite sebelum fallback ke render lokal
// (lihat bratGenerateImage() di bawah). Parameter `text` dipakai berdasar
// konvensi umum API sejenis (belum bisa dipastikan lewat dokumentasi resmi
// — situsnya nolak automated fetch saat dicek). Kalau ternyata parameternya
// beda, cukup ganti nama key di bawah, bagian lain tidak perlu diubah.
//
// Respons ditangani DUA kemungkinan format, karena tidak bisa dipastikan
// yang mana dipakai endpoint ini tanpa dokumentasi:
//   1) Gambar langsung (Content-Type: image/*) — kebanyakan endpoint
//      "maker" gambar tunggal kayak gini pakai pola ini.
//   2) JSON pembungkus, mis. { result: "<url gambar>" } atau base64 —
//      pola yang juga umum dipakai hub API kayak api.siputzx.my.id.
async function fetchBratFromApi(text, timeoutMs = 20_000) {
    const url = `${BRAT_API_URL}?text=${encodeURIComponent(text.toLowerCase().trim())}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    let res;
    try {
        res = await fetch(url, {
            signal: ctrl.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': '*/*',
            },
        });
    } finally {
        clearTimeout(timer);
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const contentType = res.headers.get('content-type') || '';
    if (contentType.startsWith('image/')) {
        return Buffer.from(await res.arrayBuffer());
    }

    // Bukan gambar langsung — coba anggap JSON pembungkus.
    let json;
    try {
        json = JSON.parse(await res.text());
    } catch {
        throw new Error('Response API brat bukan gambar maupun JSON yang valid.');
    }
    const result = json?.result ?? json?.data ?? json?.url ?? json?.image;
    if (typeof result !== 'string' || !result) {
        throw new Error('Field hasil tidak ditemukan di response JSON API brat.');
    }
    if (/^https?:\/\//i.test(result)) {
        const imgRes = await fetch(result);
        if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status} saat ambil gambar dari URL hasil JSON`);
        return Buffer.from(await imgRes.arrayBuffer());
    }
    return Buffer.from(result.replace(/^data:image\/\w+;base64,/, ''), 'base64'); // asumsikan base64 mentah/data-URI
}

// ── Generator gambar brat (.brat / .bratgreen / .bratwhite) ────────
export async function bratGenerate(ctx, variant = 'brat') {
    const { args, reply } = ctx;
    const text = args?.join(' ') || '';
    if (!text) {
        return reply(
            `📌 Cara pakai: \`${PREFIX}${variant} <teks>\`\n` +
            `Contoh: \`${PREFIX}${variant} selow lah\``
        );
    }

    return bratGenerateImage(ctx, variant, text);
}

// ── Variant GAMBAR: brat (default) / bratgreen / bratwhite ─────────
// .brat & .bratwhite: coba fetchBratFromApi() (endpoint luar) DULU, baru
// fallback ke renderBratImage() lokal (ffmpeg, lib/bratRender.js) kalau
// gagal. .bratgreen: lokal saja (lihat UPDATE 2026-07-25 di atas).
async function bratGenerateImage(ctx, variant, text) {
    const { sock, jid, msg, reply } = ctx;
    try {
        // Brat memakai REST API publik tanpa API key. Tidak ada fallback
        // drawtext/ffmpeg, sehingga error "No such filter: drawtext" tidak
        // bisa lagi menjatuhkan fitur ini.
        const raw = await fetchBratFromApi(text);
        if (!raw || raw.length < 100) throw new Error('API mengembalikan gambar kosong.');
        const sticker = await imageToWebpSticker(raw);
        await sock.sendMessage(jid, { sticker }, { quoted: msg });
    } catch (err) {
        await reply(`❌ Gagal generate brat: ${String(err.message || 'API gagal').slice(0, 220)}\n\nCoba lagi beberapa saat.`);
    }
}

// ── IQC — iPhone Quote Creator ─────────────────────────────────────
export async function iqc(ctx) {
    const { sock, jid, msg, args, reply } = ctx;
    const text = args?.join(' ') || '';

    if (!text) {
        return reply(
            `📱 *iPhone Quote Creator*\n\n` +
            `Buat gambar quote bergaya iMessage/iPhone.\n\n` +
            `📌 Cara: \`${PREFIX}iqc <teks>\`\n` +
            `Contoh: \`${PREFIX}iqc Gojo terkuat sejagad raya\``
        );
    }

    await reply('⏳ Membuat iPhone quote...');

    try {
        const url = `${FAA_BASE}/faa/iqc?prompt=${encodeURIComponent(text)}`;
        const buf = await fetchBuf(url);

        await sock.sendMessage(jid, {
            image: buf,
            caption:
                `📱 *iPhone Quote Creator*\n\n` +
                `_"${text}"_\n\n` +
                `> Dibuat dengan ${PREFIX}iqc`,
        }, { quoted: msg });
    } catch (err) {
        await reply(`❌ Gagal membuat IQC: ${err.message}\n\nCoba lagi beberapa saat.`);
    }
}
