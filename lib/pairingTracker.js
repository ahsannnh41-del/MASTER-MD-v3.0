// ═══════════════════════════════════════════════════════════════════
//  pairingTracker.js — Persistent Tracker for Web & Telegram Pairing
//  Developer: AHSAN (03107260507)
// ═══════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HISTORY_FILE = path.join(__dirname, '..', 'session', 'pairing_history.json');

// Ensure directory exists
function ensureDir() {
    const dir = path.dirname(HISTORY_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Read all history
export function getPairingHistory() {
    ensureDir();
    try {
        if (fs.existsSync(HISTORY_FILE)) {
            const raw = fs.readFileSync(HISTORY_FILE, 'utf8');
            return JSON.parse(raw);
        }
    } catch (e) {
        console.warn('[pairingTracker] Read history error:', e.message);
    }
    return [];
}

// Save history
function saveHistory(list) {
    ensureDir();
    try {
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(list.slice(-500), null, 2), 'utf8');
    } catch (e) {
        console.warn('[pairingTracker] Save history error:', e.message);
    }
}

// Log a pairing attempt
export function logPairingAttempt(phone, source = 'Web Portal', code = null) {
    const list = getPairingHistory();
    const existingIndex = list.findIndex(item => item.phone === phone);

    const record = {
        phone: String(phone).replace(/[^0-9]/g, ''),
        source, // 'Web Portal' | 'Telegram Bot'
        code: code || '--------',
        status: 'Code Generated',
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
    };

    if (existingIndex >= 0) {
        list[existingIndex] = { ...list[existingIndex], ...record };
    } else {
        list.unshift(record);
    }

    saveHistory(list);
    return record;
}

// Update status when socket connects
export function markPairingConnected(phone) {
    const clean = String(phone || '').replace(/[^0-9]/g, '');
    if (!clean) return;

    const list = getPairingHistory();
    const item = list.find(x => x.phone === clean);
    if (item) {
        item.status = 'Connected 🟢';
        item.connectedAt = new Date().toISOString();
        item.lastActive = new Date().toISOString();
        saveHistory(list);
    } else {
        list.unshift({
            phone: clean,
            source: 'Auto-Detected',
            status: 'Connected 🟢',
            code: 'ACTIVE',
            createdAt: new Date().toISOString(),
            connectedAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
        });
        saveHistory(list);
    }
}

// Mark pairing as unlinked / terminated by Admin
export function unlinkPairing(phone) {
    const clean = String(phone || '').replace(/[^0-9]/g, '');
    if (!clean) return false;

    const list = getPairingHistory();
    const item = list.find(x => x.phone === clean);
    if (item) {
        item.status = 'Unlinked 🔴';
        item.unlinkedAt = new Date().toISOString();
        item.lastActive = new Date().toISOString();
        saveHistory(list);
        return true;
    }
    return false;
}

// Delete a pairing record completely from history
export function deletePairingRecord(phone) {
    const clean = String(phone || '').replace(/[^0-9]/g, '');
    if (!clean) return false;

    let list = getPairingHistory();
    const beforeLen = list.length;
    list = list.filter(x => x.phone !== clean);
    if (list.length !== beforeLen) {
        saveHistory(list);
        return true;
    }
    return false;
}
