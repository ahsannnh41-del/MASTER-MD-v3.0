// ═══════════════════════════════════════════════════════════════════
//  TITLESYSTEM.JS — Sistem gelar/title RPG (baru)
// ═══════════════════════════════════════════════════════════════════
//  Title otomatis "unlock" berdasarkan level/pencapaian, lalu bisa
//  dipilih salah satu untuk dipakai (equippedTitle di char, field baru
//  yang aman ditambahkan karena char adalah object bebas-bentuk).

import { getChar, saveChar } from './rpgEngine.js';

export const TITLES = [
    { id: 'pemula',     name: 'Pemula',        condition: (c) => true },
    { id: 'petualang',  name: 'Petualang',     condition: (c) => c.level >= 10 },
    { id: 'veteran',    name: 'Veteran',       condition: (c) => c.level >= 25 },
    { id: 'master',     name: 'Master',        condition: (c) => c.level >= 50 },
    { id: 'legenda',    name: 'Legenda',       condition: (c) => c.level >= 75 },
    { id: 'dewa',       name: 'Dewa',          condition: (c) => c.level >= 100 },
    { id: 'kaya_raya',  name: 'Kaya Raya',     condition: (c) => c.gold + (c.bank || 0) >= 1_000_000 },
    { id: 'pemburu',    name: 'Sang Pemburu',  condition: (c) => (c.totalHunts || 0) >= 100 },
    { id: 'penakluk',   name: 'Penakluk Boss', condition: (c) => (c.bossKills || 0) >= 20 },
    { id: 'petani',     name: 'Petani Ulung',  condition: (c) => (c.harvestCount || 0) >= 20 },
];

export function getUnlockedTitles(char) {
    return TITLES.filter(t => t.condition(char));
}

export function equipTitle(jid, titleId) {
    const char = getChar(jid);
    if (!char) return { success: false, error: 'Kamu belum punya karakter RPG. Ketik `.rpg` dulu.' };
    const title = TITLES.find(t => t.id === titleId);
    if (!title) return { success: false, error: 'Title tidak dikenal. Ketik `.titles` untuk lihat daftarnya.' };
    if (!title.condition(char)) return { success: false, error: `Kamu belum memenuhi syarat untuk title "${title.name}".` };
    char.equippedTitle = titleId;
    saveChar(jid, char);
    return { success: true, title };
}

export function getEquippedTitleName(char) {
    if (!char.equippedTitle) return null;
    const title = TITLES.find(t => t.id === char.equippedTitle);
    return title ? title.name : null;
}
