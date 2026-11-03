import {
    CLASSES, MONSTERS, BOSSES, SHOP_ITEMS, WEAPONS, ARMORS, CONSUMABLES, MATERIALS,
    PETS, JOBS, DUNGEONS, QUESTS, ACHIEVEMENTS, expNeeded, findItem,
} from '../lib/rpgData.js';
import {
    getChar, hasChar, createChar, saveChar, getEquippedStats, expMultiplier,
    consumeBuffCharge, checkLevelUp, simulateBattle, grantExpGold, addAchievementsIfEligible,
} from '../lib/rpgEngine.js';
import { bar, fmtNum, fmtDuration, cooldownLeft, randInt, pick, percentChance } from '../lib/utils.js';
import { save } from '../lib/db.js';

const HUNT_CD = 45 * 1000;
const BATTLE_CD = 2 * 60 * 1000;
const DUNGEON_CD = 5 * 60 * 1000;
const JOB_CD_BASE = 20 * 60 * 1000;
const ROB_CD = 10 * 60 * 1000;

function persist() { save('users'); }

function requireChar(char, reply) {
    if (!char) {
        reply('❌ Kamu belum punya karakter! Ketik *!rpg* untuk mulai berpetualang.');
        return false;
    }
    return true;
}

export const rpgCommands = {

    async startRPG(reply, sender, args) {
        if (hasChar(sender)) return reply('⚔️ Kamu sudah punya karakter!\nKetik *!profil* untuk melihatnya.');

        const wanted = (args?.[0] || 'warrior').toLowerCase();
        const className = CLASSES[wanted] ? wanted : 'warrior';
        createChar(sender, className);

        const cls = CLASSES[className];
        const classList = Object.entries(CLASSES)
            .map(([id, c]) => `• !class ${id} — ${c.name} (${c.desc})`)
            .join('\n');

        await reply(
`🎮 *SELAMAT DATANG DI DUNIA RPG!*

Karaktermu telah dibuat sebagai ${cls.name}!

*Ganti Class kapan saja (gratis di level 1):*
${classList}

Mulai dengan *!berburu* untuk dapat EXP & Gold!
Ketik *!menurpg* untuk lihat semua perintah RPG.`
        );
    },

    async setClass(reply, sender, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const wanted = (args?.[0] || '').toLowerCase();
        if (!CLASSES[wanted]) {
            return reply(`❌ Class tidak ada!\nPilihan: ${Object.keys(CLASSES).join(', ')}`);
        }
        if (char.level > 5) {
            return reply('❌ Ganti class hanya bisa di bawah level 6! Karaktermu sudah terlalu kuat untuk berganti arah.');
        }

        char.class = wanted;
        const cls = CLASSES[wanted];
        char.baseHp = cls.hp; char.maxHp = cls.hp; char.hp = cls.hp;
        char.baseAtk = cls.atk; char.atk = cls.atk;
        char.baseDef = cls.def; char.def = cls.def;
        char.crit = cls.crit;
        saveChar(sender, char);

        await reply(`✅ Class berhasil diganti ke ${cls.name}!\nStats telah disesuaikan.`);
    },

    async showProfile(reply, sender, msg, mentioned) {
        const target = mentioned?.[0] || sender;
        const char = getChar(target);
        if (!char) return reply(target === sender ? '❌ Belum punya karakter! Ketik *!rpg* untuk mulai.' : '❌ Pemain itu belum punya karakter RPG.');

        const cls = CLASSES[char.class] || CLASSES.warrior;
        const s = getEquippedStats(char);
        const hpBar = bar(char.hp, char.maxHp);
        const weapon = char.equipped.weapon ? findItem(char.equipped.weapon)?.name : '-';
        const armor = char.equipped.armor ? findItem(char.equipped.armor)?.name : '-';
        const petTxt = char.pet ? char.pet.name : '-';
        const title = char.title ? `🏷️ Title: *${char.title}*\n` : '';

        await reply(
`╔══════════════════╗
║  ⚔️ *KARAKTER RPG*  ║
╚══════════════════╝

👤 Nama: *${char.name}*
${title}${cls.name.split(' ')[0]} Class: *${cls.name}*
⭐ Level: *${char.level}*
📊 EXP: ${fmtNum(char.exp)}/${fmtNum(expNeeded(char.level))}

❤️ HP: ${hpBar} ${char.hp}/${char.maxHp}
⚔️ ATK: *${s.atk}* (base ${char.atk})
🛡️ DEF: *${s.def}* (base ${char.def})
💥 Crit: *${s.crit}%*

💰 Gold: *${fmtNum(char.gold)}*
🏦 Bank: *${fmtNum(char.bank)}*
💎 Gems: *${fmtNum(char.gems)}*

🗡️ Weapon: ${weapon}
🛡️ Armor: ${armor}
🐾 Pet: ${petTxt}

🏆 Menang: ${char.wins} | Kalah: ${char.losses}
🐉 Boss Kill: ${char.bossKills || 0} | Dungeon: ${char.dungeonsCleared || 0}
🎒 Item unik: ${Object.keys(char.inventory).length}`
        );
    },

    async showInventory(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const entries = Object.entries(char.inventory).filter(([, qty]) => qty > 0);
        if (!entries.length) return reply('🎒 Inventori kosong. Belanja di *!toko*!');

        const lines = entries.map(([id, qty]) => {
            const item = findItem(id);
            return `• ${item ? item.name : id} x${qty}`;
        });

        await reply(`🎒 *INVENTORI ${char.name}*\n\n${lines.join('\n')}\n\nGunakan: *!equip [item]* / *!use [item]*`);
    },

    async equipItem(reply, sender, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        if (!args?.[0]) return reply('📌 Cara pakai: *!equip [nama item]*');

        const query = args.join(' ').toLowerCase();
        const owned = Object.keys(char.inventory).find(id => {
            const item = findItem(id);
            return item && (item.id === query || item.name.toLowerCase().includes(query));
        });
        if (!owned) return reply('❌ Item tidak ada di inventorimu!');

        const item = findItem(owned);
        if (item.type === 'weapon') char.equipped.weapon = item.id;
        else if (item.type === 'armor') char.equipped.armor = item.id;
        else return reply('❌ Item ini tidak bisa di-equip (bukan weapon/armor).');

        saveChar(sender, char);
        await reply(`✅ *${item.name}* berhasil di-equip!`);
    },

    async unequipItem(reply, sender, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        const slot = (args?.[0] || '').toLowerCase();
        if (!['weapon', 'armor'].includes(slot)) return reply('📌 Cara pakai: *!unequip weapon* atau *!unequip armor*');

        char.equipped[slot] = null;
        saveChar(sender, char);
        await reply(`✅ ${slot === 'weapon' ? 'Weapon' : 'Armor'} dilepas.`);
    },

    async useItem(reply, sender, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        if (!args?.[0]) return reply('📌 Cara pakai: *!use [item]*');

        const query = args.join(' ').toLowerCase();
        const owned = Object.keys(char.inventory).find(id => {
            const item = findItem(id);
            return item && (item.id === query || item.name.toLowerCase().includes(query)) && char.inventory[id] > 0;
        });
        if (!owned) return reply('❌ Item tidak ada di inventorimu (atau habis)!');

        const item = findItem(owned);
        if (item.type !== 'consumable') return reply('❌ Item ini tidak bisa dipakai langsung. Gunakan *!equip* untuk weapon/armor.');

        let resultText = '';
        switch (item.effect) {
            case 'heal':
                char.hp = Math.min(char.maxHp, char.hp + item.value);
                resultText = `❤️ HP +${item.value} → ${char.hp}/${char.maxHp}`;
                break;
            case 'healfull':
                char.hp = char.maxHp;
                resultText = `❤️ HP terisi penuh! ${char.hp}/${char.maxHp}`;
                break;
            case 'atkbuff':
            case 'defbuff':
            case 'expbuff':
                char.buffs[item.effect] = { value: item.value, duration: item.duration || 3 };
                resultText = `✨ Buff *${item.name}* aktif selama ${item.duration} aksi berikutnya!`;
                break;
            case 'revive':
                resultText = '💎 Batu kebangkitan disimpan (otomatis terpakai saat HP habis).';
                break;
            case 'cure':
                resultText = '🍃 Status negatif dibersihkan.';
                break;
            default:
                resultText = '✅ Item dipakai.';
        }

        char.inventory[owned] -= 1;
        if (char.inventory[owned] <= 0) delete char.inventory[owned];
        saveChar(sender, char);

        await reply(`✅ Memakai *${item.name}*!\n${resultText}`);
    },

    async hunt(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const left = cooldownLeft(char.lastHunt, HUNT_CD);
        if (left > 0) return reply(`⏳ Tunggu *${fmtDuration(left)}* lagi untuk berburu!`);
        if (char.hp <= 0) return reply('💀 HP habis! Pakai *!use potion* untuk pulihkan HP, atau tunggu regen alami via *!istirahat*.');

        const tierCap = Math.max(1, Math.min(20, Math.ceil(char.level / 2) + 1));
        const pool = MONSTERS.filter(m => m.tier <= tierCap);
        const m = pick(pool.length ? pool : MONSTERS);
        const s = getEquippedStats(char);

        const isCrit = percentChance(s.crit);
        let playerDmg = Math.max(1, s.atk - Math.floor(m.def * 0.5) + randInt(0, 8));
        if (isCrit) playerDmg = Math.floor(playerDmg * 1.8);
        const monsterDmg = Math.max(1, m.atk - Math.floor(s.def * 0.5) + randInt(0, 5));

        let hasil, expGain = 0, goldGain = 0, drop = null;

        if (playerDmg >= m.hp) {
            expGain = m.exp + randInt(0, 10);
            goldGain = m.gold + randInt(0, 15);
            grantExpGold(char, expGain, goldGain);
            char.hp = Math.max(1, char.hp - Math.floor(monsterDmg * 0.3));
            char.totalHunts = (char.totalHunts || 0) + 1;
            hasil = '✅ *MENANG!*';

            if (percentChance(m.dropChance * 100)) {
                drop = pick(MATERIALS);
                char.inventory[drop.id] = (char.inventory[drop.id] || 0) + 1;
            }
        } else {
            const loss = Math.floor(monsterDmg * 0.8);
            char.hp = Math.max(0, char.hp - loss);
            expGain = Math.floor(m.exp * 0.3);
            char.exp += expGain;
            hasil = char.hp === 0 ? '💀 *KALAH! HP habis.*' : '⚠️ *Monster kabur!*';
        }

        consumeBuffCharge(char);
        const levelUp = checkLevelUp(char);
        const newAch = addAchievementsIfEligible(char, ACHIEVEMENTS);
        char.lastHunt = Date.now();
        saveChar(sender, char);

        let txt =
`🗡️ *HASIL BERBURU*

Monster: ${m.name} (Tier ${m.tier})
❤️ HP Monster: ${m.hp}

${isCrit ? '💥 *CRITICAL HIT!*\n' : ''}⚔️ Seranganmu: *${playerDmg} dmg*
💥 Serangan balik: *${monsterDmg} dmg*

${hasil}
✨ EXP: +${expGain}
💰 Gold: +${goldGain}
❤️ HP tersisa: ${char.hp}/${char.maxHp}`;

        if (drop) txt += `\n🎁 Drop: ${drop.name} x1`;
        if (levelUp) txt += `\n\n🎉 *LEVEL UP! Kamu kini Level ${char.level}!*`;
        if (newAch.length) txt += `\n\n🏅 Achievement baru: ${newAch.map(a => a.name).join(', ')}`;

        await reply(txt);
    },

    async rest(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        if (char.hp >= char.maxHp) return reply('❤️ HP kamu sudah penuh!');

        const heal = Math.floor(char.maxHp * 0.4);
        char.hp = Math.min(char.maxHp, char.hp + heal);
        saveChar(sender, char);
        await reply(`😴 Kamu beristirahat...\n❤️ HP +${heal} → ${char.hp}/${char.maxHp}`);
    },

    async battle(reply, sender, mentioned) {
        if (!mentioned || mentioned.length === 0) return reply('📌 Cara pakai: *!lawan @tag*');

        const a = getChar(sender);
        const targetId = mentioned[0];
        const b = getChar(targetId);

        if (!requireChar(a, reply)) return;
        if (!b) return reply('❌ Target belum punya karakter RPG!');
        if (sender === targetId) return reply('❌ Tidak bisa melawan diri sendiri!');

        const left = cooldownLeft(a.lastBattle, BATTLE_CD);
        if (left > 0) return reply(`⏳ Cooldown battle! Tunggu *${fmtDuration(left)}*.`);

        const aStats = getEquippedStats(a), bStats = getEquippedStats(b);
        const result = simulateBattle(a, b, aStats, bStats);
        const menang = result.winner === 'a';

        if (menang) {
            a.wins++; b.losses++;
            grantExpGold(a, 50, 35);
        } else {
            a.losses++; b.wins++;
            grantExpGold(b, 50, 35);
        }

        a.lastBattle = Date.now();
        checkLevelUp(a); checkLevelUp(b);
        saveChar(sender, a); saveChar(targetId, b);

        await reply(
`⚔️ *PVP BATTLE!*

🔴 ${a.name} (Lv.${a.level}) VS
🔵 ${b.name} (Lv.${b.level})

📜 *Log Pertarungan:*
${result.log.map(l => `• ${l}`).join('\n')}

🏆 *PEMENANG: ${menang ? a.name : b.name}!*
💰 Reward: +35 Gold, +50 EXP`
        );
    },

    async menuRPG(reply) {
        await reply(
`⚔️ *MENU RPG LENGKAP*

*— Karakter —*
!rpg [class] — Buat karakter
!class [nama] — Ganti class (lv≤5)
!profil [@tag] — Lihat profil
!inventory / !inv — Lihat tas
!equip [item] — Pakai weapon/armor
!unequip [weapon/armor]
!use [item] — Pakai consumable

*— Bertarung —*
!berburu / !hunt — Buru monster
!lawan @tag — PvP battle
!istirahat — Heal 40% HP
!boss [nomor] — Lawan boss
!dungeon [id] — Masuk dungeon
!bossinfo — List semua boss
!dungeoninfo — List semua dungeon

*— Ekonomi —*
!toko / !shop [kategori] — Lihat toko
!beli [item] — Beli item
!jual [item] — Jual item
!daily — Reward harian
!kerja [job] — Kerja & dapat gold
!joblist — List pekerjaan
!nabung [jumlah] — Tabung ke bank
!tarik [jumlah] — Tarik dari bank
!transfer @tag [jumlah] — Kirim gold
!rob @tag — Coba rampok gold

*— Pet & Quest —*
!petshop — Toko pet
!beli pet [nama]
!petinfo — Lihat pet kamu
!quest — Lihat daftar quest
!questclaim [id] — Klaim reward quest
!achievement — Lihat achievement

*— Sosial & Ranking —*
!ranking / !top — Top 10 player
!leaderboard gold/level/wins
!marry @tag — Menikah dalam game
!divorce — Cerai

Prefix: *!*  |  Ketik *!menu* untuk menu utama.`
        );
    },
};
