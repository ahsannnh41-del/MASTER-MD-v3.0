// ═══════════════════════════════════════════════════════════════════
//  YTDLPBINARY.JS — Resolve & auto-download binary `yt-dlp` standalone
//
//  KENAPA PINDAH DARI @distube/ytdl-core KE yt-dlp:
//  Repository @distube/ytdl-core (dan semua fork ytdl-core lainnya)
//  SUDAH DI-ARCHIVE oleh pemiliknya (16 Agustus 2025) — artinya tidak
//  ada lagi update untuk mengikuti perubahan signature/cipher YouTube.
//  Itu sebabnya .play selalu gagal dengan "Status code: 403" — bukan
//  bug di kode bot ini, tapi library-nya sendiri yang sudah ditinggalkan
//  dan YouTube terus mengubah mekanisme anti-bot mereka.
//
//  yt-dlp (project Python, BUKAN library Node.js) jauh lebih sering
//  di-update (kadang beberapa kali per bulan) untuk mengikuti perubahan
//  YouTube, dan punya rilis "standalone binary" yang SUDAH MEMBUNDEL
//  Python di dalamnya — jadi TIDAK perlu install Python di server sama
//  sekali, aman dipakai di Pterodactyl (yang biasanya cuma egg Node.js
//  polos, tanpa python3 ter-install).
//
//  Modul ini auto-download binary tersebut SEKALI ke folder bin/ pada
//  saat pertama kali fitur .play dipanggil (bukan saat npm install,
//  supaya tidak menggagalkan instalasi bot kalau jaringan saat itu
//  tidak stabil) — lalu cache path-nya untuk pemanggilan berikutnya.
//  Konsisten dengan gaya defensif videoGen.js (resolveFfmpegPath):
//  kalau gagal, fungsi pemanggil akan menerima error yang jelas, BUKAN
//  bikin bot crash.
// ═══════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BIN_DIR   = path.join(__dirname, '..', 'bin');
const BIN_PATH  = path.join(BIN_DIR, 'yt-dlp');

// URL rilis binary standalone Linux (sudah membundel Python, tidak ada
// dependency python3 di OS). Lihat dokumentasi resmi yt-dlp — bagian
// "Linux standalone x64 binary" di halaman Releases.
//
// FIX (2026-08-01): sebelumnya URL ini nunjuk ke asset "yt-dlp" polos
// (~3MB) — dicek langsung ke halaman Releases GitHub-nya, asset itu
// ternyata "Platform-independent zipimport binary. Needs Python", BUKAN
// yang standalone. Di server tanpa python3 ter-install (persis situasi
// Pterodactyl egg Node.js polos yang disebutkan di komentar atas), file
// itu ke-download sukses (lolos cek fileLooksValid karena ukurannya tetap
// >1MB) tapi GAGAL DIJALANKAN setiap saat dipanggil — karena butuh python3
// yang tidak ada. Ini kemungkinan besar penyebab SEMUA downloader (.tiktok,
// .ig, .play, dst — semua lewat runYtDlp()) kelihatan error/nggak jalan.
// Asset yang benar buat "standalone, sudah termasuk Python" adalah
// "yt-dlp_linux" (~34MB, dikonfirmasi ukurannya jauh lebih besar karena
// memang membundel interpreter Python di dalamnya).
const DOWNLOAD_URL = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux';
const SYSTEM_CANDIDATES = ['yt-dlp', 'yt-dlp_linux'];

let downloadPromise = null; // dipakai supaya download cuma jalan SEKALI walau dipanggil bersamaan

function fileLooksValid(p) {
    try {
        const stat = fs.statSync(p);
        return stat.isFile() && stat.size > 1_000_000;
    } catch {
        return false;
    }
}

async function probeYtDlp(p) {
    return new Promise((resolve) => {
        const proc = spawn(p, ['--version'], { stdio: ['ignore', 'pipe', 'ignore'] });
        let out = '';
        const timer = setTimeout(() => {
            try { proc.kill('SIGKILL'); } catch {}
            resolve(false);
        }, 10_000);
        proc.stdout.on('data', d => { out += d.toString(); });
        proc.on('error', () => { clearTimeout(timer); resolve(false); });
        proc.on('close', code => {
            clearTimeout(timer);
            resolve(code === 0 && /^\d{4}\.\d{2}\.\d+(?:\.\d+)?/.test(out.trim()));
        });
    });
}

async function resolveSystemYtDlp() {
    for (const candidate of SYSTEM_CANDIDATES) {
        if (candidate.includes('/')) {
            if (await probeYtDlp(candidate)) return candidate;
            continue;
        }
        try {
            const { execFile } = await import('node:child_process');
            const resolved = await new Promise((resolve) => {
                execFile('sh', ['-lc', `command -v ${candidate}`], (err, stdout) => {
                    resolve(!err ? String(stdout).trim() : '');
                });
            });
            if (resolved && await probeYtDlp(resolved)) return resolved;
        } catch {}
    }
    return null;
}

function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        const tmpPath = destPath + '.download';
        const file = fs.createWriteStream(tmpPath);

        const req = https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                file.close();
                fs.unlink(tmpPath, () => {});
                downloadFile(res.headers.location, destPath).then(resolve, reject);
                return;
            }
            if (res.statusCode !== 200) {
                file.close();
                fs.unlink(tmpPath, () => {});
                reject(new Error(`Gagal download yt-dlp (HTTP ${res.statusCode}).`));
                return;
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    try {
                        fs.renameSync(tmpPath, destPath);
                        fs.chmodSync(destPath, 0o755);
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                });
            });
        });
        req.setTimeout(60_000, () => req.destroy(new Error('Timeout download yt-dlp.')));
        req.on('error', (err) => {
            file.close();
            fs.unlink(tmpPath, () => {});
            reject(err);
        });
    });
}

export async function ensureYtDlp() {
    if (fileLooksValid(BIN_PATH) && await probeYtDlp(BIN_PATH)) return BIN_PATH;

    // Jika binary lokal rusak (termasuk kasus PyInstaller/curl_cffi rusak),
    // buang dan cari binary sistem yang sehat sebelum download ulang.
    try { if (fs.existsSync(BIN_PATH)) fs.unlinkSync(BIN_PATH); } catch {}

    const system = await resolveSystemYtDlp();
    if (system) return system;

    if (!downloadPromise) {
        downloadPromise = (async () => {
            if (!fs.existsSync(BIN_DIR)) fs.mkdirSync(BIN_DIR, { recursive: true });
            await downloadFile(DOWNLOAD_URL, BIN_PATH);
            fs.chmodSync(BIN_PATH, 0o755);
            if (!fileLooksValid(BIN_PATH) || !(await probeYtDlp(BIN_PATH))) {
                throw new Error('Binary yt-dlp yang terdownload tidak valid atau tidak bisa dijalankan.');
            }
        })().finally(() => { downloadPromise = null; });
    }

    try {
        await downloadPromise;
    } catch (err) {
        throw new Error(
            `Gagal menyiapkan downloader: ${err.message}. ` +
            'Pastikan server punya akses internet atau pasang yt-dlp pada environment server.'
        );
    }
    return BIN_PATH;
}

/**
 * Jalankan yt-dlp dengan argumen tertentu, return { stdout, stderr }.
 * Melempar Error (dengan stderr terlampir) kalau exit code != 0.
 */
export function runYtDlp(binPath, args, { timeoutMs = 120_000 } = {}) {
    return new Promise((resolve, reject) => {
        // PyInstaller/yt-dlp mengekstrak modul seperti curl_cffi ke TMPDIR.
        // Beberapa panel/Termux membuat /tmp noexec, read-only, atau terlalu
        // kecil sehingga muncul: "Failed to extract curl_cffi/_wrapper.abi3.so".
        // Pakai folder tmp milik project agar ekstraksi punya lokasi yang
        // writable dan tidak bergantung pada konfigurasi /tmp host.
        const localTmp = path.join(process.cwd(), '.tmp-yt-dlp');
        try { fs.mkdirSync(localTmp, { recursive: true }); } catch {}
        const proc = spawn(binPath, args, {
            windowsHide: true,
            env: { ...process.env, TMPDIR: localTmp, TMP: localTmp, TEMP: localTmp }
        });
        let stderr = '';
        const chunks = [];
        let timedOut = false;

        const timer = setTimeout(() => {
            timedOut = true;
            proc.kill('SIGKILL');
        }, timeoutMs);

        // Kumpulkan stdout sebagai Buffer mentah (bukan string), supaya
        // tidak korup data biner (video/audio) waktu mode download dipakai.
        proc.stdout.on('data', (chunk) => { chunks.push(chunk); });
        proc.stderr.on('data', (d) => { stderr += d.toString(); });
        proc.on('error', (err) => { clearTimeout(timer); reject(err); });
        proc.on('close', (code) => {
            clearTimeout(timer);
            if (timedOut) {
                reject(new Error(`yt-dlp timeout setelah ${timeoutMs}ms.`));
                return;
            }
            if (code !== 0) {
                reject(new Error(`yt-dlp keluar dengan kode ${code}: ${stderr.slice(-800) || '(tidak ada output error)'}`));
                return;
            }
            resolve({ stdout: Buffer.concat(chunks), stderr });
        });
    });
}
