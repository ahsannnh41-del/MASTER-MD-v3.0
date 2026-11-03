import {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers,
    delay,
} from '@whiskeysockets/baileys';
// FIX: makeWASocket TIDAK di-import langsung dari '@whiskeysockets/baileys'
// lagi di sini — lihat lib/baileysCompat.js untuk alasan lengkapnya (intinya:
// default export package ini bentuknya tidak konsisten tergantung versi yang
// ke-install, dan itulah penyebab "makeWASocket is not a function").
import { makeWASocket } from './lib/baileysCompat.js';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import { rmSync, existsSync, cpSync, readdirSync, mkdirSync } from 'fs';
import { createInterface } from 'node:readline/promises';
import { sendWelcome, sendFarewell } from './features/protection.js';
import { checkBannedRejoin } from './features/protectionExtra.js';
import { handleIncomingCall } from './features/antiCallChat.js';
import { processIncomingMessage } from './lib/messagePipeline.js';
import { checkScheduledAnnouncements, checkTodayBirthdays } from './commands/adminCommands5.js';
import { restoreChildBotSessions } from './lib/childBot.js';
import { flushNow, store } from './lib/db.js';
import { isOwner, isCreator } from './lib/roles.js';
import { checkSewaExpiry } from './lib/sewaBot.js';
import { checkGroupSchedules } from './lib/groupScheduler.js';
import { log } from './lib/logger.js';
import { getCreatorInfo } from './lib/roles.js';
import { fmtDate, fmtTime, withTimeout } from './lib/utils.js';
import { CHANNEL_JID, CHANNEL_NAME } from './lib/channelGuard.js';
import settings from './setting.js';
import { verifyIntegrity } from './lib/integrity.js';

// Cryptographic anti-tamper runtime assertion
verifyIntegrity(settings);

// FIX: bot kerasa delay pas trafik lagi rame — ternyata BUKAN dari
// baileysLogger di bawah (itu sudah 'silent'). Baris "Failed to decrypt
// message with any known session..." dan "Session error:Error: Bad MAC"
// (lihat screenshot console panel) datang dari `libsignal` — dependency
// internal Baileys buat protokol Signal — yang nge-print pakai
// console.log/console.error LANGSUNG, bukan lewat logger yang dikasih ke
// makeWASocket(). Makanya baileysLogLevel: 'silent' gak mempan meredam ini.
// Errornya sendiri NORMAL & tidak fatal (WA multi-device kadang kirim ulang
// pesan yang sesi-nya sudah tidak match di sisi bot, pesan itu di-skip),
// tapi kalau lagi banyak (grup rame), ratusan baris console output SINKRON
// ini bikin proses Node ketahan sebentar tiap kali nulis ke stdout yang
// di-pipe ke panel hosting (bukan TTY) — itu yang kerasa sebagai delay.
// Fix-nya: saring KHUSUS 2 pola baris ini sebelum nyampe stdout/stderr,
// log lain (punya bot sendiri lewat lib/logger.js) tetap normal tampil.
function isNoisyLibsignalSpam(args) {
    const text = args.map(a => {
        if (typeof a === 'string') return a;
        if (a instanceof Error) return `${a.message || ''} ${a.stack || ''}`;
        return '';
    }).join(' ');
    return text.includes('Failed to decrypt message with any known session')
        || (text.includes('Session error') && text.includes('Bad MAC'));
}
const _origConsoleLog   = console.log.bind(console);
const _origConsoleError = console.error.bind(console);
console.log = (...args) => {
    if (isNoisyLibsignalSpam(args)) return;
    _origConsoleLog(...args);
};
console.error = (...args) => {
    if (isNoisyLibsignalSpam(args)) return;
    _origConsoleError(...args);
};

const baileysLogger = pino({ level: settings.baileysLogLevel || 'silent' });

// FIX KRITIS: tanpa cache ini, setiap kali bot mengirim pesan ke grup,
// Baileys akan diam-diam memanggil ulang groupMetadata() ke server WhatsApp
// untuk mendapatkan daftar peserta grup (dibutuhkan untuk enkripsi pesan ke
// setiap peserta). Ini sesuai dokumentasi resmi Baileys: tanpa cache, hal
// ini menyebabkan rate-limit dan potensi banned dari WhatsApp — dan dalam
// kondisi rate-limit/koneksi tidak stabil, panggilan internal ini bisa
// hang tanpa batas waktu di DALAM implementasi Baileys, yaitu di luar
// jangkauan withTimeout yang kita pasang sendiri di level kode bot (karena
// withTimeout cuma membungkus Promise sendMessage secara keseluruhan, bukan
// operasi-operasi internal di dalamnya). Ini diduga menjadi penyebab utama
// command-command yang gagal total tanpa balasan ATAUPUN error sama sekali.
// FIX PERFORMA: cache ini sekarang didefinisikan di lib/groupMetaCache.js
// (bukan di sini lagi) supaya lib/messagePipeline.js juga bisa pakai cache
// yang SAMA untuk cek isAdmin, alih-alih query fresh ke WhatsApp di setiap
// pesan grup — lihat komentar lengkap di file itu.
import { groupMetadataCache } from './lib/groupMetaCache.js';

// Nomor HP: ENV diprioritaskan (Pterodactyl), lalu setting.js, lalu
// (kalau dua-duanya kosong/gak valid) ditanya langsung lewat console saat
// startup — lihat promptNomorHP() & pemakaiannya di bagian "Pairing Code"
// di bawah. "let" (bukan "const") supaya bisa diisi ulang setelah dijawab
// lewat console, dan tetap kepakai kalau startBot() dipanggil ulang
// (reconnect).
//
// FIX BUG: sebelumnya kevalidan nomor dicek dengan
// `NOMOR_HP === '628xxxxxxxxxx'` (persis string placeholder di setting.js)
// — padahal NOMOR_HP di bawah ini SUDAH di-strip ke angka doang duluan
// (.replace(/[^0-9]/g, '')). Placeholder '628xxxxxxxxxx' kalau ikut
// di-strip huruf "x"-nya juga hilang, sisa cuma "628" (3 digit) — jadi
// perbandingan ke string utuh '628xxxxxxxxxx' TIDAK PERNAH match, dan
// syarat "belum diisi" gagal kedeteksi. Akibatnya bot diam-diam lanjut
// coba pairing pakai nomor "628" doang tanpa pernah nanya/gagal duluan
// (kejadian nyata: pairing code tetap muncul tapi ke nomor "+628" saja).
// Sekarang validitas dicek pakai panjang digit (isNomorValid), bukan
// exact-match ke placeholder.
function isNomorValid(nomor) {
    return /^[0-9]{10,15}$/.test(nomor);
}

function normalizeNomor(raw) {
    let n = String(raw || '').replace(/[^0-9]/g, '');
    if (n.startsWith('00')) n = n.slice(2);
    // Pakistani local 03xx format: 03107260507 (11 digits) -> 923107260507
    if (n.startsWith('03') && n.length === 11) {
        n = '92' + n.slice(1);
    } else if (n.startsWith('0') && n.length === 11) {
        n = '92' + n.slice(1);
    } else if (n.startsWith('3') && n.length === 10) {
        n = '92' + n;
    }
    return n;
}

let NOMOR_HP = normalizeNomor(process.env.NOMOR_HP || settings.nomorPairing);

// ── FIX: kenapa folder session/ gampang rusak (badSession) ──────────────
// Baileys useMultiFileAuthState menulis BANYAK file kecil ke folder
// session/ setiap kali kunci enkripsi berubah (yaitu hampir setiap ada
// pesan masuk/keluar — ini perilaku resmi Baileys, bukan bug bot). Kalau
// proses Node dimatikan PERSIS saat salah satu file itu sedang ditulis
// (restart paksa, OOM-kill, klik "Kill" di Pterodactyl, crash container),
// file itu jadi setengah-tertulis alias corrupt. Begitu satu file corrupt,
// Baileys akan baca SEMUA file di folder itu saat startup dan menganggap
// keseluruhan auth state tidak valid -> badSession.
//
// Dua langkah mitigasi yang dipasang di bawah ini:
//   1) saveCredsRef menyimpan referensi saveCreds yang SEDANG aktif, supaya
//      graceful-shutdown handler (SIGINT/SIGTERM) bisa memanggil & MENUNGGU
//      (await) penyimpanan kredensial selesai dulu sebelum process.exit() —
//      sebelumnya process.exit() dipanggil LANGSUNG tanpa menunggu apapun,
//      yang berisiko memotong penulisan file Baileys yang sedang berjalan.
//   2) backupSession() menyalin folder session/ ke session-backup/ secara
//      berkala (setelah koneksi berhasil terbuka). Ini BUKAN solusi yang
//      mencegah corruption, tapi memberi cadangan yang valid untuk
//      dipulihkan manual kalau folder session/ utama ternyata rusak —
//      tanpa cadangan ini, satu-satunya pilihan saat badSession adalah
//      scan/pairing dari nol.
let saveCredsRef = null;
let backupIntervalHandle = null;

function backupSession() {
    try {
        if (!existsSync('./session')) return;
        const files = readdirSync('./session');
        // Jangan backup folder kosong/cuma berisi sisa file .tmp — pastikan
        // ada minimal file creds.json yang valid sebelum dianggap "sehat"
        // untuk dibackup.
        if (!files.includes('creds.json')) return;
        if (!existsSync('./session-backup')) mkdirSync('./session-backup', { recursive: true });
        cpSync('./session', './session-backup', { recursive: true, force: true });
    } catch (err) {
        log.warn(`Gagal backup session: ${err.message}`);
    }
}

// ── Session utils ──────────────────────────────────────────────────
function clearSession() {
    try {
        if (existsSync('./session')) {
            rmSync('./session', { recursive: true, force: true });
            log.warn('Session lama dihapus otomatis.');
        }
    } catch {}
}

// ── Exponential backoff reconnect ─────────────────────────────────
let reconnectAttempts = 0;

// FIX BUG: referensi ke sock yang SEDANG hidup. Interval jangka panjang
// (sewa expiry, jadwal grup) dulunya nge-capture variabel `sock` lokal
// dari startBot() pertama kali dibuat — begitu bot reconnect (sock BARU
// dibuat), interval lama itu masih pegang sock LAMA yang sudah mati,
// jadi sendMessage-nya diam-diam gagal terus selamanya. Sekarang interval
// itu selalu baca currentSock (diperbarui setiap kali sock baru berhasil
// connect), bukan sock hasil closure. Lihat connection.update handler.
let currentSock = null;
// ── AUTOJOIN WHATSAPP CHANNEL ────────────────────────────────
// ── AUTOJOIN WHATSAPP CHANNEL ────────────────────────────────
// ── Autojoin WhatsApp Channel ───────────────────────────────
const CHANNELS_TO_FOLLOW = [
    {
        id: "120363428989828271@newsletter",
        name: "Janpiw"
    },
    {
        id: "120363380388430434@newsletter",
        name: "Channel 2"
    },
    {
        id: "120363308894748175@newsletter",
        name: "Channel 3"
    },
    {
        id: "120363428802367163@newsletter",
        name: "Testimoni"
    }
];
let channelAutojoinRunning = false;

async function autoJoinChannels(sock) {
    if (channelAutojoinRunning) {
        log.warn("📢 Autojoin Channel masih berjalan, dilewati.");
        return;
    }

    if (!sock || !sock.user) {
        log.warn("📢 Autojoin Channel: socket belum siap.");
        return;
    }

    channelAutojoinRunning = true;

    try {
        log.info("📢 Memulai autojoin WhatsApp Channel...");

        for (const channel of CHANNEL_IDS) {
            let joined = false;

            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    log.info(
                        `📢 Mengikuti Channel ${channel.name} (${attempt}/3)...`
                    );

                    await sock.newsletterFollow(channel.jid);

                    log.success(
                        `✅ Berhasil mengikuti Channel ${channel.name}`
                    );

                    log.info(
                        `   └─ ${channel.jid}`
                    );

                    joined = true;
                    break;

                } catch (err) {
                    log.warn(
                        `⚠️ Gagal mengikuti ${channel.name} ` +
                        `(${attempt}/3): ${err?.message || err}`
                    );

                    if (attempt < 3) {
                        await delay(3000);
                    }
                }
            }

            if (!joined) {
                log.error(
                    `❌ Channel ${channel.name} gagal diikuti setelah 3 percobaan.`
                );
            }

            // Jeda sebelum lanjut ke channel berikutnya
            await delay(2500);
        }

        log.success(
            "📢 Autojoin WhatsApp Channel selesai."
        );

    } catch (err) {
        log.error(
            `❌ Autojoin Channel error: ${err?.message || err}`
        );
    } finally {
        channelAutojoinRunning = false;
    }
}
// FIX BUG: guard supaya restoreChildBotSessions() + setup kedua interval
// di atas cuma jalan SEKALI per proses Node (memang seharusnya begitu —
// bukan diulang tiap kali koneksi WA reconnect). Sebelumnya numpang di
// guard `backupIntervalHandle`, padahal itu untuk keperluan lain — akibatnya
// ketiganya ke-skip terus abis reconnect pertama. Lihat connection.update.
let coreServicesStarted = false;

function nextReconnectDelay() {
    const base  = (settings.reconnectDelay || 5) * 1000;
    const factor = settings.reconnectBackoffFactor || 1.5;
    const maxMs  = (settings.reconnectDelayMax || 60) * 1000;
    const ms = Math.min(base * Math.pow(factor, reconnectAttempts), maxMs);
    return Math.round(ms);
}

// ── Input nomor pairing langsung lewat console ──────────────────────────
// Dipakai kalau nomorPairing di setting.js masih placeholder DAN ENV
// NOMOR_HP juga tidak diisi. Baileys butuh nomor tujuan sebelum bisa minta
// pairing code — dulu bot langsung exit dan wajib edit setting.js dulu,
// sekarang bot menunggu kamu ketik nomornya di console lalu lanjut sendiri.
// Ini juga jalan di console panel Pterodactyl, karena apa yang kamu ketik
// di kotak console situ dikirim sebagai stdin ke proses bot ini.
//
// FIX: di sebagian konfigurasi container Pterodactyl, stdin proses Node
// TIDAK benar-benar tersambung ke console (tergantung startup command
// egg-nya) — kadang langsung EOF begitu proses jalan, kadang nyangkut
// tanpa pernah kirim data ataupun EOF. rl.question() polos tidak siap
// untuk dua kondisi ini: kalau stdin EOF duluan, promise-nya reject tapi
// ketangkep unhandledRejection generik di paling bawah file (bot
// kelihatan "diam" setelah prompt tampil, padahal sudah mati di dalam);
// kalau stdin nyangkut tanpa EOF, rl.question() nunggu selamanya tanpa
// ada cara keluar selain kill manual. Tiga lapis penanganan di bawah:
//   1) stdinClosed — deteksi event end/close/error di process.stdin,
//      di-race lawan rl.question(). Begitu stdin mati, kita tahu SEKARANG
//      (lempar error) alih-alih nunggu hang selamanya.
//   2) Reminder tiap 30 detik selama masih nunggu, supaya kelihatan beda
//      antara "masih nunggu kamu ngetik" vs "diam karena macet".
//   3) Timeout per percobaan (reset tiap kamu kirim sesuatu, walau nomor
//      yang dikirim tidak valid) — jaga-jaga stdin macet TANPA pernah
//      kirim event end/close/error sama sekali (pipe nyangkut diam).
// Kalau memang stdin tidak bisa dipakai di panel kamu, function ini
// throw Error('STDIN_UNAVAILABLE') — ditangani di pemanggilnya (lihat
// bagian "Pairing Code" di startBot()) dengan pesan jelas + saran pakai
// ENV NOMOR_HP, bukan hang atau mati diam-diam.
const PAIRING_PROMPT_TIMEOUT_MS  = 5 * 60 * 1000; // 5 menit tanpa respon sama sekali → nyerah
const PAIRING_PROMPT_REMINDER_MS = 30 * 1000;     // reminder tiap 30 detik selama nunggu

async function promptNomorHP() {
    process.stdin.resume(); // jaga-jaga kalau stdin sempat ke-pause pihak lain

    // Kalau stdin SUDAH mati sebelum function ini sempat jalan, jangan
    // coba bikin readline interface sama sekali — langsung gagal dengan
    // pesan jelas di pemanggil, daripada nge-hang di rl.question().
    if (process.stdin.destroyed || process.stdin.readableEnded) {
        throw new Error('STDIN_UNAVAILABLE');
    }

    const rl = createInterface({ input: process.stdin, output: process.stdout });

    let resolveStdinDead;
    const stdinClosed = new Promise((resolve) => { resolveStdinDead = resolve; });
    const onStdinDead = () => resolveStdinDead('__STDIN_DEAD__');
    process.stdin.once('end', onStdinDead);
    process.stdin.once('close', onStdinDead);
    process.stdin.once('error', onStdinDead);

    let nomor = '';
    try {
        while (!isNomorValid(nomor)) {
            // FIX: instruksinya sekarang dicetak lewat console.log BIASA
            // (selalu diakhiri newline) — BUKAN cuma lewat teks prompt bawaan
            // rl.question(). Teks prompt readline SENGAJA tidak diakhiri
            // newline (supaya kursor tetap di baris yang sama menunggu
            // input) — tapi sebagian panel/provider (termasuk beberapa yang
            // berbasis Pterodactyl) nge-stream console per-baris dan baris
            // tanpa newline di ujung itu bisa ke-tahan di buffer sisi panel,
            // gak pernah dirender sampai ada newline berikutnya — yang gak
            // akan pernah datang selama user belum ngetik apa-apa. Efeknya:
            // prompt kelihatan "ga muncul" padahal function ini sebenarnya
            // sudah jalan & lagi nunggu input. Dengan console.log di sini,
            // instruksinya dijamin tampil apa pun cara panel-nya nge-render
            // console; bagian rl.question() di bawah cuma jadi penanda kecil.
            console.log('📱 Masukkan nomor WhatsApp untuk pairing (format: 628xxxxxxxxxx, minimal 10 digit):');
            const reminder = setInterval(() => {
                console.log('   ⏳ Masih menunggu nomor diketik di console... (ketik nomornya lalu tekan Enter)');
            }, PAIRING_PROMPT_REMINDER_MS);
            const attemptTimeout = setTimeout(onStdinDead, PAIRING_PROMPT_TIMEOUT_MS);

            let jawaban;
            try {
                jawaban = await Promise.race([
                    rl.question('👉 '),
                    stdinClosed,
                ]);
            } finally {
                clearInterval(reminder);
                clearTimeout(attemptTimeout);
            }

            if (jawaban === '__STDIN_DEAD__') {
                throw new Error('STDIN_UNAVAILABLE');
            }

            nomor = normalizeNomor(jawaban);
            if (!isNomorValid(nomor)) console.log('   ⚠️  Nomor tidak valid (minimal 10 digit angka), coba lagi. Contoh: 628123456789.');
        }
    } finally {
        process.stdin.removeListener('end', onStdinDead);
        process.stdin.removeListener('close', onStdinDead);
        process.stdin.removeListener('error', onStdinDead);
        rl.close();
    }
    return nomor;
}

// ── MAIN ──────────────────────────────────────────────────────────
async function startBot() {

    // Banner hanya di percobaan pertama
    if (reconnectAttempts === 0) {
        log.banner(settings.botName, settings.botVersion || '2.0.0');
    }

    const { state, saveCreds } = await useMultiFileAuthState('./session');
    saveCredsRef = saveCreds; // dipakai oleh graceful-shutdown handler di bawah

    // FITUR BARU: notifikasi WA setelah pairing berhasil ──────────────
    // state.creds.registered di-snapshot DI SINI (paling awal, sebelum
    // requestPairingCode ataupun apapun lain sempat jalan) karena Baileys
    // MEMUTASI object state.creds yang sama seiring waktu — begitu pairing
    // berhasil, registered berubah dari false -> true PADA OBJECT YANG SAMA.
    // Snapshot boolean di sini aman dari mutasi itu (primitif, bukan
    // reference), jadi nilainya tetap merekam kondisi "SEBELUM" pairing.
    // Dipakai di connection.update ('open') di bawah: kalau nilainya true,
    // berarti sesi ini benar-benar baru saja pairing dari nol (bukan
    // sekadar reconnect ke sesi yang sudah lama registered) — itulah
    // momen yang tepat untuk kirim pesan konfirmasi ke WA sendiri.
    const freshPairing = !state.creds.registered;
    let connectedNotifSent = false; // guard: jangan kirim dobel kalau 'open' sempat terpicu >1x

    // ── FIX: nomor HP untuk pairing sekarang ditentukan DI SINI, PALING
    // AWAL — sebelum fetch versi WA ataupun bikin socket. Sebelumnya prompt
    // "📱 Masukkan nomor WhatsApp..." baru muncul SETELAH proses nunggu
    // versi WA selesai (bisa sampai 15 detik dengan timeout yang baru, atau
    // nge-hang TANPA BATAS WAKTU di kode lama sebelum ada timeout itu) —
    // dari console kelihatan kayak prompt-nya "telat banget" atau bahkan
    // "ga muncul-muncul sama sekali", padahal cuma nunggu network call yang
    // sebenarnya tidak ada hubungannya sama nomor HP. Sekarang begitu bot
    // start dan ternyata belum ke-pairing, prompt ini langsung muncul dalam
    // hitungan milidetik, tidak nunggu apa-apa dulu.
    if (!state.creds.registered && !isNomorValid(NOMOR_HP)) {
        log.warn('Nomor pairing belum diisi dengan benar di setting.js (nomorPairing) maupun ENV NOMOR_HP.');
        try {
            NOMOR_HP = await promptNomorHP();
        } catch (err) {
            // STDIN_UNAVAILABLE (lihat promptNomorHP()) — console input tidak
            // bisa dipakai di environment ini. Berhenti dengan pesan jelas,
            // bukan hang selamanya atau mati diam-diam kena unhandledRejection.
            log.error('Tidak bisa membaca input dari console (stdin) di environment ini.');
            log.warn('Solusi: isi ENV NOMOR_HP (Startup Variables di Pterodactyl) ATAU nomorPairing di setting.js, lalu restart bot.');
            process.exit(1);
        }
    }

    // ── FIX KRITIS: versi WA basi = penyebab paling umum "connect lalu
    // reconnect terus-menerus tanpa pernah stabil" di ekosistem Baileys
    // saat ini (banyak dilaporkan sepanjang 2026: WhatsApp menolak
    // handshake begitu versi web WA yang dipakai sudah kedaluwarsa, socket
    // langsung ditutup lagi -> reconnect -> ditolak lagi -> loop). Urutan
    // sumber versi, dari yang paling diutamakan:
    //   1) ENV WA_VERSION (format "2.3000.xxxxxxx") — override manual lewat
    //      Startup Variables Pterodactyl, TANPA perlu edit/upload ulang
    //      kode. Pakai ini kalau reconnect-loop masih muncul setelah fix
    //      ini: cari angka versi WA terbaru yang terverifikasi bekerja di
    //      github.com/WhiskeySockets/Baileys (issues/discussions terbaru)
    //      lalu isi di Startup Variables.
    //   2) fetchLatestBaileysVersion() — ambil live dari server Baileys.
    //      DIBUNGKUS TIMEOUT 15 detik karena beberapa laporan menyebutkan
    //      function ini kadang hang tanpa pernah resolve/reject — tanpa
    //      timeout, itu bikin startBot() menggantung SELAMANYA (bot
    //      kelihatan "diam" tanpa log apapun setelah baris ini).
    //   3) Angka hardcoded di bawah — hasil laporan komunitas yang
    //      terverifikasi bekerja per April 2026. Ini AKAN BASI LAGI
    //      cepat/lambat karena WhatsApp update terus-menerus; kalau log di
    //      bawah bilang "pakai fallback hardcoded" dan reconnect-loop
    //      muncul lagi, itu tandanya angka ini perlu di-update (lewat ENV
    //      WA_VERSION di atas, TIDAK perlu edit file ini).
    let version = [2, 3000, 1037641644];
    const envVersion = (process.env.WA_VERSION || '').split('.').map(n => parseInt(n, 10));
    const envVersionValid = envVersion.length === 3 && envVersion.every(Number.isFinite);

    if (envVersionValid) {
        version = envVersion;
        log.info(`📌 WA version dipaksa dari ENV WA_VERSION: ${version.join('.')}`);
    } else {
        try {
            const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('timeout 15s')), ms));
            const { version: latest } = await Promise.race([fetchLatestBaileysVersion(), timeout(15_000)]);
            version = latest;
            log.debug(`WA version (live): ${version.join('.')}`);
        } catch (err) {
            log.warn(`Gagal ambil WA version terbaru (${err.message}) — pakai fallback: ${version.join('.')}`);
            log.warn('Kalau bot connect lalu reconnect terus-menerus, coba isi ENV WA_VERSION (Startup Variables Pterodactyl) dengan versi WA terbaru — cek github.com/WhiskeySockets/Baileys.');
        }
    }

    const sock = makeWASocket({
        version,
        logger: baileysLogger,
        auth:   state,
        printQRInTerminal: false,
        browser: Browsers.macOS('Desktop'),
        markOnlineOnConnect: settings.markOnlineOnConnect || false,
        syncFullHistory: false,
        // FIX: tanpa nilai ini, operasi seperti sendMessage/sendPresenceUpdate
        // bisa MENGGANTUNG TANPA BATAS WAKTU kalau koneksi WhatsApp di balik
        // layar bermasalah (reconnect diam-diam, jaringan container tidak
        // stabil, dll) — tanpa pernah resolve ATAU reject, sehingga try/catch
        // di kode manapun tidak akan pernah menangkapnya, dan bot terlihat
        // "online" di panel tapi diam total tanpa balasan/error apapun.
        // Dengan timeout eksplisit, operasi yang stuck akan gagal dengan
        // error setelah batas waktu ini, sehingga try/catch yang sudah ada
        // (di handleCommand, autoTyping, replyWithThumb) bisa benar-benar
        // menangani kegagalannya dan tetap memberi balasan ke user.
        defaultQueryTimeoutMs: 60_000,
        connectTimeoutMs: 60_000,
        keepAliveIntervalMs: 10_000,
        // FIX KRITIS: cache metadata grup. Tanpa ini, SETIAP kali bot kirim
        // pesan ke grup, Baileys akan query ulang daftar peserta grup ke
        // server WhatsApp — yang menurut dokumentasi resmi Baileys
        // menyebabkan rate-limit dan risiko banned. Dengan cache 5 menit
        // ini, query berulang tersebut dihindari untuk grup yang sama.
        cachedGroupMetadata: async (jid) => groupMetadataCache.get(jid),
    });

    // ── Global channel-forward context ────────────────────────────────
    // Setiap pesan keluar dari bot akan terlihat sebagai pesan yang
    // di-forward dari WA Channel (nama & id resmi lihat lib/channelGuard.js).
    // Caranya: wrap sock.sendMessage satu kali di sini — semua command
    // otomatis kena tanpa harus ubah satu per satu di tiap file.
    const _origSend = sock.sendMessage.bind(sock);
    sock.sendMessage = async (jid, content, options = {}) => {
        // Inject contextInfo channel forwarding ke setiap pesan keluar.
        // Nilai yang benar (hasil riset/eksperimen): forwardingScore 9, serverMessageId 127.
        // -1 dan 999 menyebabkan proto validation error di Baileys — itulah
        // kenapa .menu dan semua command sebelumnya error '⚠️ Terjadi kesalahan'.
        // FIX: reaksi emoji (content.react) DIKECUALIKAN dari injeksi ini —
        // reaksi punya struktur protokol yang minim dan tidak butuh/menerima
        // contextInfo/branding forward sama sekali. Tanpa pengecualian ini,
        // setiap reaksi (sekarang terkirim di TIAP command — lihat reactTo()
        // di commands/index.js) akan selalu gagal di percobaan pertama lalu
        // baru berhasil di percobaan kedua (fallback catch di bawah) — bukan
        // error fatal, tapi buang satu round-trip API sia-sia setiap kali.
        let withCtx = content;
        if (content && typeof content === 'object' && !content.contextInfo && !content.react) {
            withCtx = {
                ...content,
                contextInfo: {
                    isForwarded: true,
                    forwardingScore: 9,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid:  CHANNEL_JID,
                        newsletterName: CHANNEL_NAME,
                        serverMessageId: 127
                    }
                }
            };
        }
        try {
            return await _origSend(jid, withCtx, options);
        } catch {
            // Kalau contextInfo bikin error, kirim tanpa contextInfo
            // supaya pesan tetap terkirim.
            return await _origSend(jid, content, options);
        }
    };


    // perbarui cache supaya tidak menyimpan data yang sudah usang.
    sock.ev.on('groups.update', async ([update]) => {
        try {
            if (!update?.id) return;
            const metadata = await sock.groupMetadata(update.id);
            groupMetadataCache.set(update.id, metadata);
        } catch { /* ignore */ }
    });
    // Cache update & welcome/farewell digabung di satu listener di bawah

    let pairingConnectionFailed = false;

    // ── Connection events ──────────────────────────────────────────
    sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
if (connection === 'open') {
    reconnectAttempts = 0;
    currentSock = sock;

    log.connect(
        `${settings.botName} v${settings.botVersion}`,
        settings.prefix
    );
            log.success(`Prefix  : ${settings.prefix}`);
            { const creator = getCreatorInfo(); log.success(`Owner   : ${creator.name} (+${creator.number})`); }
            log.success(`Fitur   : RPG · Admin · Fun · Tools · Proteksi`);
            log.success(`Cooldown: ${settings.cooldownEnabled ? 'Aktif ✅' : 'Nonaktif ❌'}`);
            log.success(`AutoRead: ${settings.autoRead ? 'Ya ✅' : 'Tidak'} | AutoType: ${settings.autoTyping ? 'Ya ✅' : 'Tidak'}`);
            log.info('📩 Menunggu pesan...\n');

            // ── Notifikasi WA: bot baru saja pairing ─────────────────────
            // SEBELUMNYA: begitu pairing berhasil, satu-satunya konfirmasi
            // cuma tampil di CONSOLE (log.connect dkk di atas) — tidak ada
            // apa pun yang terkirim ke WhatsApp. Dari sisi user, kode
            // pairing muncul & bisa dimasukkan, tapi setelah itu tidak ada
            // notifikasi apapun yang masuk ke WA-nya sendiri untuk
            // mengonfirmasi bot benar-benar aktif.
            // FIX: kirim 1x pesan konfirmasi ke nomor bot sendiri (self-
            // chat) — hanya kalau freshPairing true (sesi ini benar-benar
            // baru saja pairing dari nol, lihat snapshot-nya di awal
            // startBot()). Reconnect biasa ke sesi yang SUDAH lama
            // registered TIDAK memicu ini lagi, supaya tidak spam pesan
            // "Bot Terhubung" tiap kali bot restart/reconnect normal.
            // connectedNotifSent jadi guard tambahan kalau-kalau 'open'
            // sempat terpicu lebih dari sekali dalam satu siklus sock ini.
            if (freshPairing && !connectedNotifSent && settings.notifyOnConnect !== false) {
                connectedNotifSent = true;
                const selfJid = `${NOMOR_HP}@s.whatsapp.net`;
                try {
                    await withTimeout(sock.sendMessage(selfJid, {
                        text: `✅ *BOT BERHASIL TERHUBUNG!*\n\n` +
                            `🤖 Nama   : ${settings.botName} v${settings.botVersion}\n` +
                            `⚡ Prefix : ${settings.prefix}\n` +
                            `📱 Nomor  : +${NOMOR_HP}\n` +
                            `🕒 Waktu  : ${fmtDate()}, ${fmtTime()}\n\n` +
                            `Bot sudah aktif dan siap menerima perintah dari chat manapun.\n` +
                            `Ketik *${settings.prefix}menu* untuk lihat semua fitur.\n\n` +
                            `> Pesan ini otomatis terkirim sekali setiap selesai pairing baru — bukan tiap kali bot restart/reconnect biasa.`
                    }), 20_000, 'sendMessage(notifTerhubung)');
                    log.success('Notifikasi "Bot Terhubung" terkirim ke WA sendiri.');
                } catch (err) {
                    // Jangan biarkan kegagalan kirim notifikasi ini
                    // mengganggu proses startup lain di bawahnya — cukup
                    // dicatat di log, bot tetap lanjut jalan normal.
                    log.warn(`Gagal kirim notifikasi "Bot Terhubung" ke WA: ${err.message}`);
                }
            }

            // Backup session/ -> session-backup/ begitu koneksi terbukti
            // SEHAT (artinya isi folder session/ saat ini valid, bukan
            // hasil tulisan yang terputus). Lihat penjelasan panjang di
            // backupSession() & komentar dekat saveCredsRef soal kenapa
            // ini membantu kalau suatu saat folder session/ utama corrupt.
            backupSession();
            if (!backupIntervalHandle) {
                const backupEveryMs = (settings.sessionBackupIntervalMinutes || 30) * 60 * 1000;
                backupIntervalHandle = setInterval(backupSession, backupEveryMs);
            }

            // ── FIX BUG: restoreChildBotSessions() + kedua setInterval di
            // bawah ini SEBELUMNYA ke-nest tanpa sengaja di dalam blok
            // `if (!backupIntervalHandle)` di atas (kurung kurawal salah
            // taruh). Akibatnya: begitu bot reconnect SEKALI SAJA,
            // backupIntervalHandle sudah ke-set dari koneksi pertama (dan
            // tidak pernah null lagi selama proses Node ini hidup) —
            // sehingga ketiganya dilewati SELAMANYA setelah reconnect
            // pertama. Sekarang dipisah pakai guard sendiri
            // (coreServicesStarted) yang memang tujuannya "sekali per
            // proses", bukan numpang di guard interval backup yang beda
            // keperluan.
            if (!coreServicesStarted) {
                coreServicesStarted = true;

                // Restore jadibot sessions yang tersimpan dari sebelum restart
                restoreChildBotSessions(processIncomingMessage).catch(err =>
                    log.error(`Restore jadibot sessions: ${err.message}`)
                );

                // Sewa expiry checker — tiap 5 menit, cek sewa habis & keluar
                // grup. FIX: pakai currentSock (referensi yang selalu
                // diperbarui saat reconnect), bukan `sock` hasil closure —
                // sebelumnya begitu bot reconnect satu kali saja, interval
                // ini tetap pegang sock LAMA yang sudah mati dan sendMessage
                // di dalamnya diam-diam gagal terus tanpa pernah kelihatan
                // di log (ketutup .catch(() => {})).
                setInterval(async () => {
                    if (!currentSock || currentSock.ws?.readyState !== 1) return;
                    try {
                        const alerts = checkSewaExpiry();
                        for (const { groupJid, reason, data } of alerts) {
                            if (reason === 'h1') {
                                await currentSock.sendMessage(groupJid, {
                                    text: `⚠️ *Pemberitahuan Sewa Bot*\n\nSewa bot grup ini akan habis dalam kurang dari *24 jam*.\nSegera hubungi owner untuk perpanjangan! (\`${settings.prefix}hargasewa\`)`
                                }).catch(() => {});
                            } else if (reason === 'expired') {
                                await currentSock.sendMessage(groupJid, {
                                    text: '⏰ *Sewa bot untuk grup ini telah habis.*\n\nTerima kasih sudah menggunakan layanan kami! Bot akan keluar dari grup ini.\nHubungi owner untuk perpanjangan.'
                                }).catch(() => {});
                                await delay(2000);
                                await currentSock.groupLeave(groupJid).catch(() => {});
                            }
                        }
                    } catch (err) { log.error(`Sewa expiry: ${err.message}`); }
                }, 5 * 60 * 1000);

                // Jadwal buka/tutup grup otomatis — cek tiap 1 menit (v3.1.0).
                // FIX: sama seperti di atas, pakai currentSock supaya tidak
                // nyangkut ke sock lama setelah reconnect.
                // Lihat lib/groupScheduler.js untuk logic pencocokan jadwalnya.
                setInterval(async () => {
                    if (!currentSock || currentSock.ws?.readyState !== 1) return;
                    try {
                        const actions = checkGroupSchedules();
                        for (const { jid, action } of actions) {
                            try {
                                await currentSock.groupSettingUpdate(jid, action === 'open' ? 'not_announcement' : 'announcement');
                                await currentSock.sendMessage(jid, {
                                    text: action === 'open'
                                        ? '🔓 *Grup dibuka otomatis sesuai jadwal!* Semua member sekarang bisa kirim pesan.'
                                        : '🔒 *Grup ditutup otomatis sesuai jadwal!* Hanya admin yang bisa kirim pesan sampai jadwal buka berikutnya.'
                                }).catch(() => {});
                            } catch (err) {
                                log.error(`Jadwal grup ${jid} (${action}) gagal: ${err.message}`);
                            }
                        }
                    } catch (err) { log.error(`Group scheduler: ${err.message}`); }
                }, 60 * 1000);

                // Pengumuman teks terjadwal (.addannouncement) — cek tiap 1
                // menit, sama seperti jadwal buka/tutup grup di atas.
                setInterval(async () => {
                    if (!currentSock || currentSock.ws?.readyState !== 1) return;
                    try {
                        const due = checkScheduledAnnouncements();
                        for (const { jid, text } of due) {
                            await currentSock.sendMessage(jid, { text: `📢 *PENGUMUMAN*\n\n${text}` }).catch(() => {});
                        }
                    } catch (err) { log.error(`Scheduled announcement: ${err.message}`); }
                }, 60 * 1000);

                // Ucapan ulang tahun otomatis (.setbirthday) — cek sekali
                // sehari jam 08:00 waktu server, bukan tiap menit (supaya
                // tidak berulang-ulang sepanjang hari itu).
                setInterval(async () => {
                    if (!currentSock || currentSock.ws?.readyState !== 1) return;
                    const now = new Date();
                    if (now.getHours() !== 8 || now.getMinutes() !== 0) return;
                    try {
                        const birthdayJids = checkTodayBirthdays();
                        if (!birthdayJids.length) return;
                        const groups = await currentSock.groupFetchAllParticipating().catch(() => ({}));
                        for (const jid of birthdayJids) {
                            for (const groupJid of Object.keys(groups)) {
                                const isMember = groups[groupJid].participants?.some(p => p.id === jid);
                                if (isMember) {
                                    await currentSock.sendMessage(groupJid, {
                                        text: `🎂 Selamat ulang tahun @${jid.split('@')[0]}! Semoga sehat & bahagia selalu 🎉`,
                                        mentions: [jid],
                                    }).catch(() => {});
                                }
                            }
                        }
                    } catch (err) { log.error(`Birthday check: ${err.message}`); }
                }, 60 * 1000);
            }
        }

        if (connection === 'close') {
            const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const errMsg = lastDisconnect?.error?.message || '';
            const reasonName = Object.keys(DisconnectReason).find(k => DisconnectReason[k] === code) || `kode ${code}`;

            if (!state.creds.registered) {
                pairingConnectionFailed = true;
                log.warn(`Koneksi putus saat pairing (kode: ${code}).`);
                return;
            }

            if (code === DisconnectReason.loggedOut) {
                log.error('Bot logout! Hapus folder session/ lalu restart.');
                clearSession();
                process.exit(0);
            } else if (code === DisconnectReason.badSession) {
                // SENGAJA TIDAK menghapus folder session/ secara otomatis di
                // sini lagi. Sebelumnya kode ini langsung clearSession() +
                // auto-restart begitu WhatsApp melaporkan "bad session" —
                // tapi itu beresiko: kalau yang sebenarnya rusak cuma SATU
                // file kecil di dalam folder session/ (bukan keseluruhan
                // kredensial), menghapus semuanya berarti kamu WAJIB scan
                // ulang/pairing dari nol, padahal mungkin saja bisa
                // dipulihkan manual (atau sekadar mau diperiksa dulu isinya
                // sebelum diputuskan dihapus atau tidak).
                //
                // Sekarang: folder session/ DIBIARKAN APA ADANYA, bot
                // berhenti (tidak auto-restart loop), supaya kamu bisa
                // periksa folder session/ secara manual, dan kalau memang
                // mau di-reset, hapus sendiri lalu jalankan ulang bot.
                log.error('Session rusak (badSession). Folder session/ TIDAK dihapus otomatis — bot dihentikan.');
                log.warn('Periksa folder session/ secara manual. Kalau memang perlu di-reset, hapus foldernya sendiri lalu jalankan ulang bot.');
                if (existsSync('./session-backup')) {
                    log.warn('Ada folder session-backup/ (dibuat otomatis secara berkala) — coba ganti folder session/ dengan isi session-backup/ sebelum memutuskan pairing ulang dari nol.');
                }
                process.exit(1);
            } else if (
                code === DisconnectReason.connectionReplaced ||
                code === DisconnectReason.forbidden ||
                code === DisconnectReason.multideviceMismatch
            ) {
                // ── FIX KRITIS (penyebab utama laporan "console suka
                // reconnect terus"): SEBELUMNYA semua kode selain loggedOut
                // & badSession jatuh ke cabang else paling bawah (reconnect
                // otomatis pakai backoff) — termasuk kode yang TIDAK akan
                // pernah membaik hanya dengan coba connect ulang biasa:
                //   • connectionReplaced (440): sesi WA yang SAMA sedang
                //     aktif di tempat lain (device lain masih ke-link, atau
                //     bot ini ke-jalanin dobel — dua proses/dua server
                //     Pterodactyl pakai folder session/ yang sama secara
                //     bersamaan). Reconnect di sini cuma akan langsung
                //     ke-tendang LAGI oleh sesi lain itu, berulang-ulang,
                //     PERSIS gejala "reconnect terus tanpa pernah stabil".
                //   • forbidden (403): akun kemungkinan dibatasi WhatsApp.
                //     Reconnect tidak akan membantu.
                //   • multideviceMismatch (411): versi protokol tidak
                //     cocok, butuh update Baileys, bukan reconnect.
                // Ketiganya sekarang BERHENTI (bukan retry selamanya)
                // dengan pesan jelas kenapa, alih-alih cuma nampilin
                // "Reconnect ke-N..." berulang tanpa penjelasan.
                log.error(`Koneksi ditutup permanen (${reasonName}, kode ${code})${errMsg ? `: ${errMsg}` : ''}.`);
                if (code === DisconnectReason.connectionReplaced) {
                    log.warn('Penyebab paling umum: sesi WA yang sama aktif di tempat lain. Cek HP → WhatsApp → Perangkat Tertaut, putuskan link lama kalau ada; pastikan juga cuma SATU proses bot ini yang jalan (bukan dobel di server/panel lain pakai folder session/ yang sama). Setelah itu start ulang bot.');
                } else if (code === DisconnectReason.forbidden) {
                    log.warn('Kemungkinan akun WhatsApp ini sedang dibatasi WhatsApp. Coba buka WhatsApp di HP untuk cek status akun sebelum restart bot.');
                } else {
                    log.warn('Update Baileys ke versi terbaru (npm install @whiskeysockets/baileys@latest di server/panel) lalu restart bot.');
                }
                process.exit(1);
            } else {
                reconnectAttempts++;
                const delayMs = nextReconnectDelay();
                const maxAttempts = settings.maxReconnectAttempts || 0;

                if (maxAttempts && reconnectAttempts > maxAttempts) {
                    log.error(`Gagal reconnect setelah ${maxAttempts}x. Bot berhenti.`);
                    process.exit(1);
                }

                log.warn(`Reconnect ke-${reconnectAttempts} dalam ${(delayMs/1000).toFixed(1)}s (${reasonName}, kode ${code}${errMsg ? `: ${errMsg}` : ''})...`);
                setTimeout(() => startBot(), delayMs);
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // ── Anti-Call ──────────────────────────────────────────────────
    // Otomatis tolak semua panggilan masuk kalau fitur ini di-ON-kan
    // lewat command .anticall (lihat features/antiCallChat.js).
    sock.ev.on('call', (calls) => {
        handleIncomingCall(sock, calls).catch((err) => log.error(`anticall listener: ${err.message}`));
    });

    // ── Pairing Code ───────────────────────────────────────────────
    // NOMOR_HP sudah ditentukan di AWAL startBot() (lihat komentar FIX
    // dekat useMultiFileAuthState) — jadi di sini tinggal request kode-nya,
    // tidak perlu cek/prompt nomor lagi.
    if (!state.creds.registered) {
        log.info(`📱 Target pairing: +${NOMOR_HP}`);
        log.info('⏳ Menunggu koneksi ke server WA (±8 detik, ini normal — bukan macet)...');
        await delay(8000);

        if (pairingConnectionFailed) {
            log.error('Koneksi ke WA putus sebelum bisa minta pairing code.');
            log.warn('Cek koneksi internet. Mencoba ulang...');
            clearSession();
            setTimeout(() => startBot(), 5000);
            return;
        }

        let code = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                code = await sock.requestPairingCode(NOMOR_HP);
                break;
            } catch (err) {
                log.warn(`Percobaan ${attempt}/3 gagal: ${err.message}`);
                if (attempt === 3) {
                    log.error('Gagal dapat pairing code setelah 3x. Hapus folder session/ dan restart.');
                    clearSession();
                    process.exit(1);
                }
                await delay(4000);
            }
        }

        const formatted = code?.match(/.{1,4}/g)?.join('-') ?? code;
        console.log('\n' + '╔' + '═'.repeat(44) + '╗');
        console.log(`║  🔑 PAIRING CODE : ${String(formatted).padEnd(25)}║`);
        console.log('╚' + '═'.repeat(44) + '╝');
        console.log('\n📲 CARA MEMASUKKAN KODE:');
        console.log('   1. Buka WhatsApp di HP nomor +' + NOMOR_HP);
        console.log('   2. Setelan ⚙️ → Perangkat Tertaut');
        console.log('   3. Tautkan Perangkat → Tautkan dengan Nomor Telepon');
        console.log('   4. Masukkan kode di atas SEGERA (berlaku ~60 detik)\n');
    }

    // ── Group events (cache + welcome/farewell dalam satu listener) ───
    sock.ev.on('group-participants.update', async (event) => {
        try {
            if (event?.id) {
                try {
                    const metadata = await sock.groupMetadata(event.id);
                    groupMetadataCache.set(event.id, metadata);
                } catch { /* ignore cache update error */ }
            }

// ── WhatsApp Channel IDs ─────────────────────────────────────


// ── Autojoin check ────────────────────────────────────────────
// Kalau autojoin OFF dan bot baru saja dimasukkan ke grup,
// cek apakah yang memasukkan adalah owner/creator.
// Kalau bukan → bot langsung keluar dari grup itu.
if (event.action === 'add') {
    const botJid = sock.user?.jid;
    const botNum = botJid?.split('@')[0]?.split(':')[0];

    const botWasAdded = event.participants.some(p => {
        const pNum = p.split('@')[0]?.split(':')[0];
        return pNum === botNum;
    });

    if (botWasAdded) {
        const cfg = store('botConfig', { autojoin: true });

        if (cfg.autojoin === false) {
            const adder = event.actor || null;
            const adderIsOwner =
                adder && (isOwner(adder) || isCreator(adder));

            if (!adderIsOwner) {
                log.warn(
                    `Autojoin OFF: keluar dari grup ${event.id} ` +
                    `(ditambahkan oleh ${adder || 'unknown'})`
                );

                try {
                    await sock.sendMessage(event.id, {
                        text: '⚠️ Bot ini tidak bisa dimasukkan ke grup sembarangan. Bot akan keluar sekarang.'
                    });
                } catch {}

                await delay(2000);
                await sock.groupLeave(event.id).catch(() => {});
                return;
            }
        }
    }
}

if (event.action === 'add') {
    await sendWelcome(sock, event.id, event.participants);

    // v3.1.0: proteksi tambahan untuk member yang baru join
    await checkBannedRejoin(
        sock,
        event.id,
        event.participants
    ).catch(err =>
        log.error(`checkBannedRejoin: ${err.message}`)
    );
}

if (event.action === 'remove') {
    await sendFarewell(
        sock,
        event.id,
        event.participants
    );
}

} catch (err) {
    log.error(`Welcome/Farewell: ${err.message}`);
}
});

// ── Message events ─────────────────────────────────────────────
// Setiap pesan diproses secara independen supaya pesan dalam
// batch yang sama tidak saling menunggu.
sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify' && type !== 'append') return;

    for (const msg of messages) {
        processIncomingMessage(sock, msg).catch(err => {
            log.error(`Proses pesan: ${err.message}`);
        });
    }
});
}

// ── Graceful shutdown ──────────────────────────────────────────
// Menyimpan session terlebih dahulu sebelum proses dihentikan.
let shuttingDown = false;

async function gracefulShutdown(signalName) {
    if (shuttingDown) return;

    shuttingDown = true;

    log.info(
        `Bot dihentikan (${signalName})... menyimpan session terlebih dahulu.`
    );

    try {
        if (saveCredsRef) {
            await saveCredsRef();
        }
    } catch (err) {
        log.warn(
            `Gagal menyimpan creds saat shutdown: ${err.message}`
        );
    }

    try {
        flushNow();
    } catch {}

    if (backupIntervalHandle) {
        clearInterval(backupIntervalHandle);
    }

    log.info(`Bot berhenti (${signalName}).`);
    process.exit(0);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('uncaughtException', err => {
    log.error(`Uncaught: ${err.message}`);
});

process.on('unhandledRejection', reason => {
    log.error(`Unhandled rejection: ${reason}`);
});

startBot();