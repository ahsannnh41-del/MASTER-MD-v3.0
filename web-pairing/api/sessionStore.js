// sessionStore.js — In-memory session registry with auto-cleanup for Web Pairing
import path from 'path';
import os from 'os';
import { rmSync, existsSync } from 'fs';

if (!global.__PAIRING_SESSIONS) {
    global.__PAIRING_SESSIONS = new Map();
}

export const sessions = global.__PAIRING_SESSIONS;

export function createSession(id, data = {}) {
    sessions.set(id, {
        id,
        status: 'pending',
        createdAt: Date.now(),
        ...data
    });
    return sessions.get(id);
}

export function getSession(id) {
    return sessions.get(id);
}

export function updateSession(id, data = {}) {
    const existing = sessions.get(id) || {};
    sessions.set(id, { ...existing, ...data });
}

export function cleanupSession(id) {
    const s = sessions.get(id);
    if (s?.sock) {
        try { s.sock.ev?.removeAllListeners(); } catch {}
        try { s.sock.ws?.close(); } catch {}
    }
    const dir1 = path.join(os.tmpdir(), `master_md_${id}`);
    const dir2 = path.join(os.tmpdir(), `master-md-${id}`);
    if (existsSync(dir1)) {
        try { rmSync(dir1, { recursive: true, force: true }); } catch {}
    }
    if (existsSync(dir2)) {
        try { rmSync(dir2, { recursive: true, force: true }); } catch {}
    }
    sessions.delete(id);
}

// Periodic cleanup for stale sessions (> 5 minutes)
if (!global.__PAIRING_CLEANUP_INTERVAL) {
    global.__PAIRING_CLEANUP_INTERVAL = setInterval(() => {
        const now = Date.now();
        for (const [id, s] of sessions.entries()) {
            if (now - (s.createdAt || 0) > 5 * 60 * 1000) {
                cleanupSession(id);
            }
        }
    }, 60 * 1000);
}
