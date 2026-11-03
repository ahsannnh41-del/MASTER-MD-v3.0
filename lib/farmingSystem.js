// ═══════════════════════════════════════════════════════════════════
//  FARMINGSYSTEM.JS — Sistem berkebun RPG (baru)
// ═══════════════════════════════════════════════════════════════════
//  Tanam -> siram -> panen. Hasil panen masuk ke inventory char (reuse
//  field inventory yang sudah ada di lib/rpgEngine.js), exp/gold lewat
//  grantExpGold() yang sudah ada supaya konsisten sama sistem lain.

import { store, save } from './db.js';
import { getChar, saveChar, grantExpGold, checkLevelUp } from './rpgEngine.js';

export const CROPS = {
    jagung: { seedCost: 20, growMinutes: 10, yieldItem: 'jagung', yieldQty: 3, exp: 15, gold: 10 },
    tomat:  { seedCost: 35, growMinutes: 20, yieldItem: 'tomat',  yieldQty: 4, exp: 25, gold: 20 },
    wortel: { seedCost: 50, growMinutes: 30, yieldItem: 'wortel', yieldQty: 5, exp: 35, gold: 30 },
    gandum: { seedCost: 80, growMinutes: 60, yieldItem: 'gandum', yieldQty: 6, exp: 60, gold: 50 },
};

function farmStore() { return store('farms', {}); }

export function getFarm(jid) {
    return farmStore()[jid] || null;
}

export function plantCrop(jid, cropName) {
    const crop = CROPS[cropName];
    if (!crop) return { success: false, error: `Tanaman tidak dikenal. Pilihan: ${Object.keys(CROPS).join(', ')}` };
    const char = getChar(jid);
    if (!char) return { success: false, error: 'Kamu belum punya karakter RPG. Ketik `.rpg` dulu.' };
    const farms = farmStore();
    const existing = farms[jid];
    if (existing && existing.crop) return { success: false, error: `Lahan kamu masih ditanami *${existing.crop}*. Panen dulu lewat \`.harvest\`.` };
    if (char.gold < crop.seedCost) return { success: false, error: `Butuh ${crop.seedCost} gold untuk bibit ${cropName} (kamu punya ${char.gold}).` };

    char.gold -= crop.seedCost;
    saveChar(jid, char);
    farms[jid] = { crop: cropName, plantedAt: Date.now(), watered: false };
    save('farms');
    return { success: true, crop };
}

export function waterCrop(jid) {
    const farms = farmStore();
    const farm = farms[jid];
    if (!farm || !farm.crop) return { success: false, error: 'Kamu belum menanam apapun. Tanam dulu lewat `.plant [nama_tanaman]`.' };
    if (farm.watered) return { success: false, error: 'Tanaman kamu sudah disiram, tinggal tunggu waktu panen.' };
    farm.watered = true;
    save('farms');
    return { success: true };
}

export function harvestCrop(jid) {
    const farms = farmStore();
    const farm = farms[jid];
    if (!farm || !farm.crop) return { success: false, error: 'Kamu belum menanam apapun.' };
    if (!farm.watered) return { success: false, error: 'Siram dulu tanamannya lewat `.water` sebelum bisa dipanen.' };
    const crop = CROPS[farm.crop];
    const readyAt = farm.plantedAt + crop.growMinutes * 60 * 1000;
    if (Date.now() < readyAt) {
        const remainingMin = Math.ceil((readyAt - Date.now()) / 60000);
        return { success: false, error: `Belum waktunya panen. Tunggu *${remainingMin} menit* lagi.` };
    }

    const char = getChar(jid);
    char.inventory[crop.yieldItem] = (char.inventory[crop.yieldItem] || 0) + crop.yieldQty;
    char.harvestCount = (char.harvestCount || 0) + 1;
    grantExpGold(char, crop.exp, crop.gold);
    const leveledUp = checkLevelUp(char);
    saveChar(jid, char);
    farms[jid] = { crop: null, plantedAt: null, watered: false };
    save('farms');
    return { success: true, crop, cropName: farm.crop, leveledUp, newLevel: char.level };
}

export function getFarmStatusText(jid) {
    const farm = getFarm(jid);
    if (!farm || !farm.crop) return null;
    const crop = CROPS[farm.crop];
    const readyAt = farm.plantedAt + crop.growMinutes * 60 * 1000;
    const remaining = readyAt - Date.now();
    return {
        crop: farm.crop,
        watered: farm.watered,
        ready: remaining <= 0 && farm.watered,
        remainingMin: Math.max(0, Math.ceil(remaining / 60000)),
    };
}
