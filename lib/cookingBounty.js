// ═══════════════════════════════════════════════════════════════════
//  COOKINGBOUNTY.JS — Sistem memasak + bounty harian RPG (baru)
// ═══════════════════════════════════════════════════════════════════

import { store, save } from './db.js';
import { getChar, saveChar, grantExpGold, checkLevelUp } from './rpgEngine.js';

// ── MEMASAK — gabungkan hasil panen jadi makanan berbuff ────────────
export const RECIPES = {
    supjagung:  { name: 'Sup Jagung',   ingredients: { jagung: 3 },            buffHp: 20,  exp: 20 },
    saustomat:  { name: 'Saus Tomat',   ingredients: { tomat: 3 },             buffAtk: 5,  exp: 25 },
    supwortel:  { name: 'Sup Wortel',   ingredients: { wortel: 3 },            buffDef: 5,  exp: 30 },
    rotigandum: { name: 'Roti Gandum',  ingredients: { gandum: 2, tomat: 1 },  buffHp: 40, buffAtk: 3, exp: 50 },
};

export function cookRecipe(jid, recipeName) {
    const recipe = RECIPES[recipeName];
    if (!recipe) return { success: false, error: `Resep tidak dikenal. Pilihan: ${Object.keys(RECIPES).join(', ')}` };
    const char = getChar(jid);
    if (!char) return { success: false, error: 'Kamu belum punya karakter RPG. Ketik `.rpg` dulu.' };

    for (const [item, qty] of Object.entries(recipe.ingredients)) {
        if ((char.inventory[item] || 0) < qty) {
            return { success: false, error: `Bahan kurang: butuh ${qty}x ${item} (kamu punya ${char.inventory[item] || 0}). Tanam & panen dulu lewat \`.plant\`/\`.harvest\`.` };
        }
    }
    for (const [item, qty] of Object.entries(recipe.ingredients)) {
        char.inventory[item] -= qty;
        if (char.inventory[item] <= 0) delete char.inventory[item];
    }
    const foodKey = `food_${recipeName}`;
    char.inventory[foodKey] = (char.inventory[foodKey] || 0) + 1;
    grantExpGold(char, recipe.exp, 0);
    const leveledUp = checkLevelUp(char);
    saveChar(jid, char);
    return { success: true, recipe, leveledUp, newLevel: char.level };
}

// ── BOUNTY HARIAN — klaim sekali sehari, hadiah lumayan ─────────────
const BOUNTY_FLAVORS = [
    'Buronan Serigala Bayangan', 'Bandit Jalan Raya', 'Naga Muda yang Mengamuk',
    'Roh Hutan yang Marah', 'Perompak Sungai', 'Golem Batu Liar',
];

function bountyStore() { return store('dailyBounty', {}); }

function todayKey() { return new Date().toISOString().slice(0, 10); }

export function getTodayBounty(jid) {
    const data = bountyStore();
    const seedIndex = new Date().getDate() % BOUNTY_FLAVORS.length;
    return {
        target: BOUNTY_FLAVORS[seedIndex],
        claimed: data[jid]?.date === todayKey(),
        rewardGold: 150 + seedIndex * 20,
        rewardExp: 100 + seedIndex * 10,
    };
}

export function claimBounty(jid) {
    const char = getChar(jid);
    if (!char) return { success: false, error: 'Kamu belum punya karakter RPG. Ketik `.rpg` dulu.' };
    const data = bountyStore();
    if (data[jid]?.date === todayKey()) return { success: false, error: 'Kamu sudah klaim bounty hari ini. Balik lagi besok!' };

    const bounty = getTodayBounty(jid);
    grantExpGold(char, bounty.rewardExp, bounty.rewardGold);
    const leveledUp = checkLevelUp(char);
    saveChar(jid, char);
    data[jid] = { date: todayKey() };
    save('dailyBounty');
    return { success: true, bounty, leveledUp, newLevel: char.level };
}
