import { getChar, saveChar } from '../lib/rpgEngine.js';
import { findItem, MATERIALS, WEAPONS, ARMORS } from '../lib/rpgData.js';
import { fmtNum, fmtDuration, cooldownLeft, randInt, percentChance, pick } from '../lib/utils.js';

function requireChar(char, reply) {
    if (!char) {
        reply('❌ Kamu belum punya karakter! Ketik *!rpg* untuk mulai berpetualang.');
        return false;
    }
    return true;
}

const MINE_CD = 30 * 60 * 1000;
const FISH_CD = 15 * 60 * 1000;
const GAMBLE_CD = 5 * 60 * 1000;
const LOTTERY_COST = 50;

export const rpgCommands3 = {

    // ─── MINING / GATHERING ──────────────────────────────────────────────
    async mine(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const left = cooldownLeft(char.lastMine || 0, MINE_CD);
        if (left > 0) return reply(`⏳ Tunggu *${fmtDuration(left)}* untuk menambang lagi.`);

        const found = pick(MATERIALS);
        const qty = randInt(1, 3);
        char.inventory[found.id] = (char.inventory[found.id] || 0) + qty;
        char.lastMine = Date.now();
        const gold = randInt(10, 30);
        char.gold += gold;
        saveChar(sender, char);

        await reply(`⛏️ *MENAMBANG!*\n\nMenemukan: ${found.name} x${qty}\n💰 Gold: +${gold}`);
    },

    async fish(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const left = cooldownLeft(char.lastFish || 0, FISH_CD);
        if (left > 0) return reply(`⏳ Tunggu *${fmtDuration(left)}* untuk memancing lagi.`);

        const success = percentChance(70);
        char.lastFish = Date.now();

        if (success) {
            const gold = randInt(15, 45);
            char.gold += gold;
            saveChar(sender, char);
            await reply(`🎣 *MEMANCING BERHASIL!*\n\n🐟 Kamu menangkap ikan!\n💰 Gold: +${gold}`);
        } else {
            saveChar(sender, char);
            await reply('🎣 Tidak ada ikan yang menggigit kali ini. Coba lagi nanti.');
        }
    },

    // ─── CRAFTING / REFINING ──────────────────────────────────────────────
    async craft(reply, sender, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const matCount = Object.entries(char.inventory)
            .filter(([id]) => MATERIALS.some(m => m.id === id))
            .reduce((sum, [, q]) => sum + q, 0);

        if (matCount < 5) return reply(`❌ Butuh minimal 5 bahan crafting (punya: ${matCount}). Tambang dengan *!mine* atau berburu monster!`);

        // consume 5 random owned materials
        let need = 5;
        for (const [id, qty] of Object.entries(char.inventory)) {
            if (!MATERIALS.some(m => m.id === id)) continue;
            const take = Math.min(need, qty);
            char.inventory[id] -= take;
            if (char.inventory[id] <= 0) delete char.inventory[id];
            need -= take;
            if (need <= 0) break;
        }

        const pool = percentChance(50) ? WEAPONS : ARMORS;
        const result = pick(pool.filter(i => i.tier <= Math.ceil(char.level / 5) + 1));
        const finalItem = result || pick(pool);
        char.inventory[finalItem.id] = (char.inventory[finalItem.id] || 0) + 1;
        saveChar(sender, char);

        await reply(`🔨 *CRAFTING BERHASIL!*\n\nKamu membuat: *${finalItem.name}*!\nCek di *!inventory* dan pakai *!equip*.`);
    },

    async refine(reply, sender, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        if (!args?.[0]) return reply('📌 Cara pakai: *!refine [item]*\nMeningkatkan kualitas weapon/armor (butuh 3 material).');

        const query = args.join(' ').toLowerCase();
        const ownedId = Object.keys(char.inventory).find(id => {
            const it = findItem(id);
            return it && (it.type === 'weapon' || it.type === 'armor') && (it.id === query || it.name.toLowerCase().includes(query));
        });
        if (!ownedId) return reply('❌ Item weapon/armor itu tidak ada di inventorimu!');

        const matCount = Object.entries(char.inventory)
            .filter(([id]) => MATERIALS.some(m => m.id === id))
            .reduce((sum, [, q]) => sum + q, 0);
        if (matCount < 3) return reply('❌ Butuh 3 bahan crafting untuk refine!');

        let need = 3;
        for (const [id, qty] of Object.entries(char.inventory)) {
            if (!MATERIALS.some(m => m.id === id)) continue;
            const take = Math.min(need, qty);
            char.inventory[id] -= take;
            if (char.inventory[id] <= 0) delete char.inventory[id];
            need -= take;
            if (need <= 0) break;
        }

        const success = percentChance(65);
        if (success) {
            const item = findItem(ownedId);
            const bonus = randInt(2, 6);
            if (!char.refinedBonus) char.refinedBonus = {};
            char.refinedBonus[ownedId] = (char.refinedBonus[ownedId] || 0) + bonus;
            saveChar(sender, char);
            await reply(`✨ *REFINE BERHASIL!*\n\n${item.name} mendapat bonus +${bonus} permanen!`);
        } else {
            saveChar(sender, char);
            await reply('💥 *REFINE GAGAL!* Bahan habis terpakai, item tetap aman.');
        }
    },

    // ─── GAMBLING / LOTTERY ────────────────────────────────────────────────
    async gamble(reply, sender, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const left = cooldownLeft(char.lastGamble || 0, GAMBLE_CD);
        if (left > 0) return reply(`⏳ Tunggu *${fmtDuration(left)}* untuk gamble lagi.`);

        const bet = parseInt(args?.[0]);
        if (!bet || bet <= 0) return reply('📌 Cara pakai: *!gamble [jumlah gold]*');
        if (bet > char.gold) return reply('❌ Gold tidak cukup!');

        char.lastGamble = Date.now();
        const win = percentChance(45);

        if (win) {
            const profit = Math.floor(bet * 1.8);
            char.gold += profit - bet;
            saveChar(sender, char);
            await reply(`🎰 *MENANG!*\n\nTaruhan: ${fmtNum(bet)}\nDapat: *+${fmtNum(profit - bet)}* Gold\n💰 Total: ${fmtNum(char.gold)}`);
        } else {
            char.gold -= bet;
            saveChar(sender, char);
            await reply(`💸 *KALAH!*\n\nKamu kehilangan *${fmtNum(bet)}* Gold.\n💰 Sisa: ${fmtNum(char.gold)}`);
        }
    },

    async lottery(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        if (char.gold < LOTTERY_COST) return reply(`❌ Butuh ${LOTTERY_COST} Gold untuk beli tiket lotre!`);

        char.gold -= LOTTERY_COST;
        const roll = randInt(1, 100);
        let prize = 0;

        if (roll <= 2) prize = LOTTERY_COST * 50;
        else if (roll <= 10) prize = LOTTERY_COST * 10;
        else if (roll <= 30) prize = LOTTERY_COST * 2;

        char.gold += prize;
        saveChar(sender, char);

        await reply(
`🎟️ *LOTTERY!*

Roll: ${roll}/100
${prize > 0 ? `🎉 *MENANG ${fmtNum(prize)} Gold!*` : '😢 Tidak menang. Coba lagi nanti!'}
💰 Total Gold: ${fmtNum(char.gold)}`
        );
    },

    // ─── TRAINING (passive stat grind) ────────────────────────────────────
    async train(reply, sender, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const stat = (args?.[0] || '').toLowerCase();
        if (!['atk', 'def', 'hp'].includes(stat)) return reply('📌 Cara pakai: *!train atk/def/hp*\nBiaya: 30 Gold, +1 stat permanen (maks 1x per jam).');

        const left = cooldownLeft(char.lastTrain || 0, 60 * 60 * 1000);
        if (left > 0) return reply(`⏳ Tunggu *${fmtDuration(left)}* untuk training lagi.`);
        if (char.gold < 30) return reply('❌ Butuh 30 Gold untuk training!');

        char.gold -= 30;
        char.lastTrain = Date.now();

        if (stat === 'hp') { char.maxHp += 10; char.hp += 10; }
        else if (stat === 'atk') { char.atk += 2; }
        else { char.def += 2; }

        saveChar(sender, char);
        await reply(`💪 *TRAINING SELESAI!*\n\n${stat.toUpperCase()} meningkat permanen!\n💰 Sisa Gold: ${fmtNum(char.gold)}`);
    },

    // ─── PRESTIGE / RESET ───────────────────────────────────────────────────
    async prestige(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        if (char.level < 50) return reply('❌ Butuh minimal Level 50 untuk Prestige!');

        const prestigeCount = (char.prestige || 0) + 1;
        char.prestige = prestigeCount;
        char.level = 1;
        char.exp = 0;
        char.gold = Math.floor(char.gold * 0.5);

        const cls = (await import('../lib/rpgData.js')).CLASSES[char.class];
        char.baseHp = cls.hp; char.maxHp = cls.hp; char.hp = cls.hp;
        char.baseAtk = cls.atk + prestigeCount * 3; char.atk = char.baseAtk;
        char.baseDef = cls.def + prestigeCount * 2; char.def = char.baseDef;

        saveChar(sender, char);

        await reply(
`✨ *PRESTIGE BERHASIL!*

Kamu kembali ke Level 1, tapi mendapat:
🌟 Prestige Rank: ${prestigeCount}
⚔️ Bonus ATK permanen: +${prestigeCount * 3}
🛡️ Bonus DEF permanen: +${prestigeCount * 2}

Lanjutkan perjalananmu menjadi lebih kuat dari sebelumnya!`
        );
    },
};
