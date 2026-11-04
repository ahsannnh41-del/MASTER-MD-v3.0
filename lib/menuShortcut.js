// ═══════════════════════════════════════════════════════════════════
//  MENUSHORTCUT.JS — Shortcut Angka untuk .menu
//  Dipisah jadi modul sendiri (bukan ditaruh di menu.js ATAU
//  messagePipeline.js) supaya keduanya bisa sama-sama import tanpa
//  bikin circular dependency (menu.js dipakai oleh commands/index.js,
//  yang juga dipakai oleh messagePipeline.js).
// ═══════════════════════════════════════════════════════════════════

import settings from '../setting.js';

const PREFIX = settings.prefix || '.';

// Pemetaan angka balasan → nama command tujuan (tanpa prefix)
// FIX (2026-08-01): diupdate supaya cocok sama 9 menu quick-action yang
// sekarang ditampilkan .menu (lihat commands/menu.js) — sebelumnya masih
// nunjuk ke 8 kategori lama (menurpg/menuadmin/dst) padahal tampilannya
// udah diganti, jadi balesan angka bisa nyasar ke command yang beda dari
// yang keliatan di teks.
export const MENU_SHORTCUT_MAP = {
    '1': 'allmenu',
    '2': 'owner',
    '3': 'pair',
    '4': 'credits',
    '5': 'menuadmin',
    '6': 'menufun',
    '7': 'menumedia',
    '8': 'menutools',
    '9': 'ping',
};

const PENDING_TTL_MS = 3 * 60 * 1000; // berlaku 3 menit sejak .menu ditampilkan
const pendingBySender = new Map();    // sender -> timestamp

// Dipanggil dari menu.js setiap kali .menu berhasil ditampilkan ke user.
export function markMenuPending(sender) {
    if (sender) pendingBySender.set(sender, Date.now());
}

// Dipanggil dari messagePipeline.js. Mengembalikan nama command (tanpa
// prefix) kalau body persis 1 digit "1".."9" DAN sender masih dalam
// jendela waktu sejak .menu terakhir ditampilkan ke dia. Sekali dipakai,
// status pending langsung dihapus (one-shot) supaya angka berikutnya di
// luar konteks .menu tidak ke-trigger lagi secara tidak sengaja.
export function resolveMenuShortcut(sender, rawBody) {
    const bareDigit = (rawBody || '').trim();
    const target = MENU_SHORTCUT_MAP[bareDigit];
    if (!target) return null;

    // Return the clean command name directly so it executes immediately without triggering AI
    return target;
}
