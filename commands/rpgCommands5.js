import { getChar, saveChar, checkLevelUp, grantExpGold } from '../lib/rpgEngine.js';
import { WEAPONS, ARMORS, MATERIALS, PETS } from '../lib/rpgData.js';
import { fmtNum, fmtDuration, cooldownLeft, randInt, pick } from '../lib/utils.js';

function requireChar(char, reply) {
    if (!char) {
        reply('❌ Kamu belum punya karakter! Ketik *.rpg* untuk mulai berpetualang.');
        return false;
    }
    return true;
}

const GACHA_COST = 100;
const EXPEDITION_CD = 60 * 60 * 1000; // 1 jam
const TITLES = [
    { name: 'Pemula', req: 0 },
    { name: 'Petarung', req: 10 },
    { name: 'Veteran', req: 25 },
    { name: 'Pahlawan', req: 50 },
    { name: 'Legenda', req: 100 },
    { name: 'Dewa Perang', req: 200 },
];

function titleForWins(wins) {
    let result = TITLES[0].name;
    for (const t of TITLES) if (wins >= t.req) result = t.name;
    return result;
}

export const rpgCommands5 = {

    // ─── GACHA ITEM ────────────────────────────────────────────────────────
    async gacha(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        if (char.gold < GACHA_COST) return reply(`❌ Butuh ${GACHA_COST} Gold untuk gacha! (Punya: ${fmtNum(char.gold)})`);

        char.gold -= GACHA_COST;
        const roll = randInt(1, 100);
        let resultText;

        if (roll <= 3) {
            const pet = pick(PETS);
            char.pets = char.pets || [];
            char.pets.push(pet.id);
            resultText = `🌟 *JACKPOT!!!* Kamu mendapat pet langka: *${pet.name}*!`;
        } else if (roll <= 25) {
            const pool = [...WEAPONS, ...ARMORS].filter(i => i.tier >= 2);
            const item = pick(pool);
            char.inventory[item.id] = (char.inventory[item.id] || 0) + 1;
            resultText = `✨ *RARE!* Kamu mendapat: *${item.name}*!`;
        } else {
            const mat = pick(MATERIALS);
            const qty = randInt(2, 5);
            char.inventory[mat.id] = (char.inventory[mat.id] || 0) + qty;
            resultText = `📦 Kamu mendapat: *${mat.name} x${qty}*`;
        }

        saveChar(sender, char);
        await reply(`🎰 *GACHA!*\n\n${resultText}\n💰 Sisa Gold: ${fmtNum(char.gold)}`);
    },

    // ─── EKSPEDISI (kirim karakter "berjalan-jalan", hasil delayed) ────────
    async expedition(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const left = cooldownLeft(char.lastExpedition || 0, EXPEDITION_CD);
        if (left > 0) return reply(`⏳ Ekspedisi masih berjalan, tunggu *${fmtDuration(left)}* lagi.`);

        char.lastExpedition = Date.now();
        char.expeditionPending = true;
        saveChar(sender, char);

        await reply(`🗺️ *EKSPEDISI DIMULAI!*\n\nKarakter kamu pergi menjelajah selama 1 jam.\nKetik *.klaimekspedisi* setelah waktu selesai untuk ambil hasilnya!`);
    },

    async claimExpedition(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        if (!char.expeditionPending) return reply('❌ Tidak ada ekspedisi yang sedang berjalan. Mulai dengan *.expedition*!');

        const left = cooldownLeft(char.lastExpedition || 0, EXPEDITION_CD);
        if (left > 0) return reply(`⏳ Ekspedisi belum selesai, tunggu *${fmtDuration(left)}* lagi.`);

        const gold = randInt(80, 250);
        const exp = randInt(20, 60);
        char.gold += gold;
        char.expeditionPending = false;
        grantExpGold(char, exp, 0);
        const levelUpMsg = checkLevelUp(char);
        saveChar(sender, char);

        await reply(`🎉 *EKSPEDISI SELESAI!*\n\n💰 Gold: +${gold}\n⭐ EXP: +${exp}${levelUpMsg ? `\n\n${levelUpMsg}` : ''}`);
    },

    // ─── TITLE SYSTEM (berdasarkan jumlah wins) ────────────────────────────
    async checkTitle(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const wins = char.wins || 0;
        const current = titleForWins(wins);
        const next = TITLES.find(t => t.req > wins);

        await reply(
`🏅 *TITLE KAMU*

Title saat ini: *${current}*
Total Wins: ${wins}
${next ? `Butuh ${next.req - wins} wins lagi untuk: *${next.name}*` : '🏆 Title tertinggi sudah tercapai!'}`
        );
    },

    // ─── RENAME KARAKTER ────────────────────────────────────────────────────
    async renameChar(reply, sender, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        const newName = args.join(' ').trim();
        if (!newName || newName.length > 20) return reply('📌 Cara pakai: *.renamechar [nama baru]*\nMaksimal 20 karakter.');

        char.name = newName;
        saveChar(sender, char);
        await reply(`✅ Nama karaktermu sekarang: *${newName}*`);
    },

    // ─── RESET BUFFS (darurat kalau ada bug buff aneh) ─────────────────────
    async resetBuffs(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        char.buffs = {};
        saveChar(sender, char);
        await reply('✅ Semua buff aktif sudah direset.');
    },

    // ─── STAT DETAIL (lebih lengkap dari .profil) ──────────────────────────
    async statDetail(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const winRate = (char.wins || 0) + (char.losses || 0) > 0
            ? (((char.wins || 0) / ((char.wins || 0) + (char.losses || 0))) * 100).toFixed(1)
            : '0.0';

        await reply(
`📊 *STAT DETAIL — ${char.name}*

⚔️ ATK: ${char.atk}  🛡️ DEF: ${char.def}  ❤️ HP: ${char.hp}/${char.maxHp}
🎯 Crit: ${char.crit || 0}%
🏆 Win Rate: ${winRate}% (${char.wins || 0}W / ${char.losses || 0}L)
🐉 Boss Kills: ${char.bossKills || 0}
🗿 Dungeon Cleared: ${char.dungeonsCleared || 0}
🌟 Prestige: ${char.prestige || 0}
🏅 Title: ${titleForWins(char.wins || 0)}`
        );
    },
};
