// ═══════════════════════════════════════════════════════════════════
//  PTERODACTYLRESELLER.JS — Sistem jualan slot server Pterodactyl
// ═══════════════════════════════════════════════════════════════════
//  Backend untuk fitur .cpanel (lihat commands/panelCommands.js untuk
//  command-command-nya). Mendukung sampai 5 panel Pterodactyl terpisah
//  (v1-v5, diatur lewat settings.pterodactyl.server1..server5).
//
//  3 lapis role per server (v1-v5):
//    - owner    : akses penuh (create/list/del/info server, kelola CEO
//                 & Reseller di server itu)
//    - ceo      : sama seperti owner tapi tidak bisa kelola sesama Owner
//    - reseller : cuma bisa create server (tidak bisa list/del/info
//                 server milik orang lain, tidak bisa kelola role)
//  Ditambah:
//    - gcseller : SATU grup WhatsApp per server yang "dibebaskan" —
//                 semua member grup itu bisa create server tanpa perlu
//                 terdaftar sebagai owner/ceo/reseller.
//    - Bot Owner/Creator SELALU py akses penuh ke semua server (bypass
//      pengecekan role di bawah).
// ═══════════════════════════════════════════════════════════════════

import axios from 'axios';
import { store, save } from './db.js';
import { settings } from '../setting.js';

export const VALID_SERVERS = ['v1', 'v2', 'v3', 'v4', 'v5'];
export const VALID_ROLES = ['owner', 'ceo', 'reseller'];

// Hirarki (index lebih kecil = lebih tinggi) — dipakai canManageRole()
// buat nentuin siapa boleh nambah/hapus siapa.
const ROLE_RANK = { owner: 0, ceo: 1, reseller: 2 };

// ── Role storage (owner/ceo/reseller per server) ──────────────────
function rolesStore() { return store('pterodactylRoles', {}); }

function roleKey(server, role) { return `${server}_${role}`; }

export function listByRole(server, role) {
    const data = rolesStore();
    return data[roleKey(server, role)] || [];
}

export function getUserRole(number, server) {
    for (const role of VALID_ROLES) {
        if (listByRole(server, role).includes(String(number))) return role;
    }
    return null;
}

export function addRole(number, server, role) {
    if (!VALID_SERVERS.includes(server)) return { success: false, error: 'Server tidak valid.' };
    if (!VALID_ROLES.includes(role)) return { success: false, error: 'Role tidak valid.' };
    const existing = getUserRole(number, server);
    if (existing) return { success: false, error: `Nomor ini sudah jadi *${existing}* di server ini.` };
    const data = rolesStore();
    const key = roleKey(server, role);
    data[key] = [...(data[key] || []), String(number)];
    save('pterodactylRoles');
    return { success: true };
}

export function removeRole(number, server, role) {
    const data = rolesStore();
    const key = roleKey(server, role);
    const list = data[key] || [];
    if (!list.includes(String(number))) return { success: false, error: `Nomor ini bukan *${role}* di server ini.` };
    data[key] = list.filter(n => n !== String(number));
    save('pterodactylRoles');
    return { success: true };
}

// Akses PENUH (create + list + del + info + kelola role di bawahnya):
// owner & ceo. Reseller TIDAK termasuk (cuma boleh create, lihat
// hasAccessToServer di bawah). Bot Owner/Creator selalu lolos.
export function hasFullAccess(number, server, isBotOwnerOrCreator) {
    if (isBotOwnerOrCreator) return true;
    const role = getUserRole(number, server);
    return role === 'owner' || role === 'ceo';
}

// Akses buat CREATE SERVER SAJA: owner, ceo, reseller, ATAU member dari
// grup gcseller server ini. Dipanggil dari panelCommands.js dengan
// chatJid supaya bisa cek gcseller sekalian.
export function hasAccessToServer(number, server, isBotOwnerOrCreator, chatJid) {
    if (isBotOwnerOrCreator) return true;
    if (getUserRole(number, server)) return true;
    if (chatJid && isGcSeller(chatJid, server)) return true;
    return false;
}

// Siapa boleh nambah/hapus role tertentu: harus rank-nya lebih tinggi
// (angka lebih kecil) dari role target. Reseller tidak bisa kelola
// siapa-siapa. Bot Owner/Creator selalu lolos.
export function canManageRole(number, server, targetRole, isBotOwnerOrCreator) {
    if (isBotOwnerOrCreator) return true;
    const myRole = getUserRole(number, server);
    if (!myRole) return false;
    const myRank = ROLE_RANK[myRole];
    const targetRank = ROLE_RANK[targetRole];
    if (myRank === undefined || targetRank === undefined) return false;
    return myRank < targetRank || (myRole === 'owner' && targetRole !== 'owner');
}

// ── GC Seller (satu grup "bebas create" per server) ────────────────
function gcSellerStore() { return store('pterodactylGcSeller', {}); }

export function setGcSeller(server, groupJid) {
    const data = gcSellerStore();
    data[server] = groupJid;
    save('pterodactylGcSeller');
}

export function getGcSeller(server) {
    return gcSellerStore()[server] || null;
}

export function isGcSeller(chatJid, server) {
    if (!chatJid?.endsWith('@g.us')) return false;
    return getGcSeller(server) === chatJid;
}

// ── Jeda global pembuatan server (anti-spam ke panel) ──────────────
// Berlaku untuk SEMUA user sekaligus (bukan per-orang) — supaya panel
// tidak digempur banyak create-server sekaligus dalam waktu singkat.
const DEFAULT_JEDA_MS = 5 * 60 * 1000; // 5 menit

function jedaStore() { return store('pterodactylJeda', {}); }

export function formatDuration(ms) {
    if (ms <= 0) return '0 detik';
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h} jam ${m % 60} menit`;
    if (m > 0) return `${m} menit ${s % 60} detik`;
    return `${s} detik`;
}

export function checkCreationCooldown() {
    const data = jedaStore();
    const jedaMs = data.jedaMs ?? DEFAULT_JEDA_MS;
    if (jedaMs === 0) return { allowed: true };
    const lastUsed = data.lastUsed || 0;
    const remaining = jedaMs - (Date.now() - lastUsed);
    if (remaining > 0) return { allowed: false, remaining };
    return { allowed: true };
}

export function markCreationUsed() {
    const data = jedaStore();
    data.lastUsed = Date.now();
    save('pterodactylJeda');
}

export function getCooldownInfo() {
    const data = jedaStore();
    const jedaMs = data.jedaMs ?? DEFAULT_JEDA_MS;
    const lastUsed = data.lastUsed || 0;
    const remaining = Math.max(0, jedaMs - (Date.now() - lastUsed));
    return { jedaMs, lastUsed, remaining, isReady: remaining === 0 };
}

// ── Spesifikasi RAM per paket ───────────────────────────────────────
export const RAM_TIERS = ['1gb', '2gb', '3gb', '4gb', '5gb', '6gb', '7gb', '8gb', '9gb', '10gb', 'unli'];

export const RAM_SPECS = {
    '1gb':  { ram: 1024,  cpu: 70,  disk: 1024 },
    '2gb':  { ram: 2048,  cpu: 80,  disk: 2048 },
    '3gb':  { ram: 3072,  cpu: 90,  disk: 2048 },
    '4gb':  { ram: 4096,  cpu: 100, disk: 4096 },
    '5gb':  { ram: 5120,  cpu: 110, disk: 5120 },
    '6gb':  { ram: 6144,  cpu: 120, disk: 6144 },
    '7gb':  { ram: 7168,  cpu: 130, disk: 7168 },
    '8gb':  { ram: 8192,  cpu: 140, disk: 8192 },
    '9gb':  { ram: 9216,  cpu: 150, disk: 9216 },
    '10gb': { ram: 10240, cpu: 160, disk: 10240 },
    unli:   { ram: 0,     cpu: 0,   disk: 0 },
};

// ── Konfigurasi & koneksi ke panel Pterodactyl ──────────────────────
export function getServerConfig(version) {
    const idx = version.replace('v', '');
    return settings.pterodactyl?.[`server${idx}`] || null;
}

export function validateServerConfig(cfg) {
    const missing = [];
    if (!cfg?.domain) missing.push('domain');
    if (!cfg?.apikey) missing.push('apikey');
    return missing;
}

export function getAvailableServers() {
    return VALID_SERVERS.filter(v => validateServerConfig(getServerConfig(v)).length === 0);
}

function pteroHeaders(cfg) {
    return {
        Authorization: `Bearer ${cfg.apikey}`,
        'Content-Type': 'application/json',
        Accept: 'Application/vnd.pterodactyl.v1+json',
    };
}

export async function createPterodactylUser(cfg, { email, username, name, password, rootAdmin = false }) {
    const res = await axios.post(`${cfg.domain}/api/application/users`, {
        email, username,
        first_name: name,
        last_name: rootAdmin ? 'Admin' : 'User',
        root_admin: rootAdmin,
        language: 'en',
        password,
    }, { headers: pteroHeaders(cfg) });
    return res.data.attributes;
}

export async function createPterodactylServer(cfg, { userId, name, ramTier, eggOverride }) {
    const specs = RAM_SPECS[ramTier];
    const eggRes = await axios.get(`${cfg.domain}/api/application/nests/${cfg.nestid}/eggs/${eggOverride || cfg.egg}?include=startup`, {
        headers: pteroHeaders(cfg),
    });
    const egg = eggRes.data.attributes;

    const res = await axios.post(`${cfg.domain}/api/application/servers`, {
        name,
        user: userId,
        egg: egg.id,
        docker_image: egg.docker_image,
        startup: egg.startup,
        environment: Object.fromEntries(
            (egg.relationships?.variables?.data || []).map(v => [v.attributes.env_variable, v.attributes.default_value])
        ),
        limits: {
            memory: specs.ram,
            swap: 0,
            disk: specs.disk,
            io: 500,
            cpu: specs.cpu,
        },
        feature_limits: { databases: 5, backups: 5, allocations: 5 },
        deploy: { locations: [Number(cfg.location)], dedicated_ip: false, port_range: [] },
        start_on_completion: true,
    }, { headers: pteroHeaders(cfg) });
    return res.data.attributes;
}

export async function listPterodactylServers(cfg) {
    let all = [];
    let page = 1, totalPages = 1;
    while (page <= totalPages) {
        const res = await axios.get(`${cfg.domain}/api/application/servers?page=${page}&per_page=50`, { headers: pteroHeaders(cfg) });
        all = all.concat(res.data.data || []);
        totalPages = res.data.meta?.pagination?.total_pages || 1;
        page++;
    }
    return all;
}

export async function getPterodactylServer(cfg, serverId) {
    const res = await axios.get(`${cfg.domain}/api/application/servers/${serverId}`, { headers: pteroHeaders(cfg) });
    return res.data.attributes;
}

export async function deletePterodactylServer(cfg, serverId) {
    await axios.delete(`${cfg.domain}/api/application/servers/${serverId}`, { headers: pteroHeaders(cfg) });
}

export function formatBytes(mb) {
    if (mb === 0) return 'Unlimited';
    if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`;
    return `${mb} MB`;
}
