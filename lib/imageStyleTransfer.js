// ═══════════════════════════════════════════════════════════════════
//  IMAGESTYLETRANSFER.JS — Transformasi gaya gambar via AI (Gemini
//  image model, lewat Puter.js)
// ═══════════════════════════════════════════════════════════════════
//  Dipakai commands/mediaCommands3.js untuk .tobotak, .tochibi,
//  .tofigura, .toghibli, .tohijab, .tolego, .tohitam, .to3d, .toroblox,
//  .tooilpainting.
//
//  SETUP WAJIB: isi settings.puterAuthToken di setting.js (atau ENV
//  PUTER_AUTH_TOKEN) — lihat komentar lengkap di setting.js soal cara
//  dapetnya dari puter.com.
//
//  ⚠️ CATATAN JUJUR SOAL KEANDALAN FITUR INI:
//  Dokumentasi resmi Puter.js (docs.puter.com/AI/txt2img) bilang
//  txt2img() return-nya berupa Promise<HTMLImageElement> — elemen DOM
//  browser yang TIDAK ADA di Node.js. Puter JUGA punya jalur pemakaian
//  Node.js resmi (pola init(token) yang dipakai di bawah), tapi belum
//  ada konfirmasi jelas apakah txt2img() otomatis mengembalikan bentuk
//  lain (Buffer/base64/objek dengan .src) saat dipanggil dari Node,
//  atau malah gagal karena butuh DOM yang tidak ada. Fungsi di bawah
//  ini SUDAH coba tangani beberapa kemungkinan bentuk hasil sekaligus,
//  tapi INI BAGIAN YANG PALING BERISIKO GAGAL dari seluruh fitur ini —
//  kalau .tochibi dkk error terus, kabari lewat pesan error yang
//  muncul (sekarang detail, bukan generik) supaya bisa diperbaiki tepat
//  sasaran.
// ═══════════════════════════════════════════════════════════════════

import { settings } from '../setting.js';

let puterClient = null;
let initFailed = null;

async function getPuterClient() {
    const token = process.env.PUTER_AUTH_TOKEN || settings.puterAuthToken;
    if (!token) {
        throw new Error('Token Puter belum diisi — lihat settings.puterAuthToken di setting.js untuk cara setup.');
    }
    if (puterClient) return puterClient;
    if (initFailed) throw initFailed;
    try {
        const { init } = await import('@heyputer/puter.js/src/init.cjs');
        puterClient = init(token);
        return puterClient;
    } catch (err) {
        // FIX: sudah dikonfirmasi ulang ke dokumentasi resmi npm/puter.com —
        // path import '@heyputer/puter.js/src/init.cjs' ini SUDAH BENAR
        // (bukan salah tebak). Kalau error "Cannot find module" muncul,
        // hampir pasti karena package-nya belum ter-install sama sekali di
        // server — paling sering karena 'npm install' belum dijalankan
        // ulang setelah update file ini. Pesan di bawah dibuat SANGAT
        // eksplisit soal itu supaya gak perlu nebak-nebak lagi.
        initFailed = new Error(
            `Package @heyputer/puter.js belum ke-install di server ini (${err.message}). ` +
            `SOLUSI: buka console Pterodactyl, jalankan 'npm install' (bukan cuma restart bot), ` +
            `tunggu sampai selesai tanpa error, BARU restart bot lagi.`
        );
        throw initFailed;
    }
}

function extractImageBuffer(result) {
    if (Buffer.isBuffer(result)) return result;
    if (typeof result === 'string') {
        if (result.startsWith('data:')) {
            const base64Part = result.split(',')[1];
            if (base64Part) return Buffer.from(base64Part, 'base64');
        }
        try { return Buffer.from(result, 'base64'); } catch { /* fallthrough */ }
    }
    if (result && typeof result === 'object') {
        if (typeof result.src === 'string') {
            const base64Part = result.src.split(',')[1];
            if (base64Part) return Buffer.from(base64Part, 'base64');
        }
        if (result.data) {
            return Buffer.isBuffer(result.data) ? result.data : Buffer.from(result.data, 'base64');
        }
        if (typeof result.arrayBuffer === 'function') {
            return result.arrayBuffer().then(ab => Buffer.from(ab));
        }
        if (result.url && typeof result.url === 'string') {
            return { __needsFetch: result.url };
        }
    }
    return null;
}

export async function transformImageStyle(imageBuffer, mimeType, promptText) {
    const puter = await getPuterClient();
    const base64Image = imageBuffer.toString('base64');

    let result;
    try {
        result = await puter.ai.txt2img(promptText, {
            model: 'google/gemini-2.5-flash-image',
            input_image: base64Image,
            input_image_mime_type: mimeType,
        });
    } catch (err) {
        throw new Error(`Panggilan API Puter gagal: ${err.message}`);
    }

    const extracted = extractImageBuffer(result);
    if (extracted === null) {
        throw new Error(`Format hasil dari Puter tidak dikenali (kemungkinan besar masalah HTMLImageElement di Node.js — lihat catatan di lib/imageStyleTransfer.js). Tipe hasil: ${typeof result}, keys: ${result && typeof result === 'object' ? Object.keys(result).join(',') : '-'}`);
    }
    if (extracted && extracted.__needsFetch) {
        const res = await fetch(extracted.__needsFetch);
        return Buffer.from(await res.arrayBuffer());
    }
    return extracted;
}
