// ═══════════════════════════════════════════════════════════════════
//  AUTOFEATURES.JS — Autoread & Autotyping per chat/grup
// ═══════════════════════════════════════════════════════════════════
//  .autoread on/off   → Bot otomatis baca (centang biru) setiap pesan
//  .autotyping on/off → Bot kirim indikator "mengetik..." saat proses
// ═══════════════════════════════════════════════════════════════════

import { store, save } from './db.js';

function autoStore() { return store('autoFeatures', {}); }

function getEntry(jid) {
    const data = autoStore();
    return data[jid] || { autoread: false, autotyping: false };
}

function setEntry(jid, patch) {
    const data = autoStore();
    data[jid] = { ...getEntry(jid), ...patch };
    save('autoFeatures');
}

// ── Autoread ──────────────────────────────────────────────────────
export function isAutoread(jid)        { return !!getEntry(jid).autoread; }
export function setAutoread(jid, val)  { setEntry(jid, { autoread: !!val }); }

// ── Autotyping ────────────────────────────────────────────────────
export function isAutotyping(jid)      { return !!getEntry(jid).autotyping; }
export function setAutotyping(jid, val){ setEntry(jid, { autotyping: !!val }); }

// ── Dipanggil dari messagePipeline.js setiap ada pesan masuk ──────
export async function handleAutoFeatures(sock, msg, jid) {
    if (!sock || !msg?.key) return;
    try {
        // Autoread: tandai pesan sebagai sudah dibaca (centang biru)
        if (isAutoread(jid)) {
            await sock.readMessages([msg.key]);
        }
        // Autotyping: kirim "sedang mengetik..." sebelum bot balas
        if (isAutotyping(jid)) {
            await sock.sendPresenceUpdate('composing', jid);
        }
    } catch { /* abaikan error presence — tidak kritis */ }
}
