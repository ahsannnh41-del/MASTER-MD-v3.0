import {
    WEAPONS, ARMORS, CONSUMABLES, MATERIALS, SHOP_ITEMS, PETS, JOBS,
    DUNGEONS, BOSSES, QUESTS, ACHIEVEMENTS, findItem,
} from '../lib/rpgData.js';
import {
    getChar, getUsers, saveChar, getEquippedStats, checkLevelUp,
    simulateBattle, grantExpGold, addAchievementsIfEligible,
} from '../lib/rpgEngine.js';
import { fmtNum, fmtDuration, cooldownLeft, randInt, percentChance } from '../lib/utils.js';

function requireChar(char, reply) {
    if (!char) {
        reply('❌ Kamu belum punya karakter! Ketik *!rpg* untuk mulai berpetualang.');
        return false;
    }
    return true;
}

const SHOP_PAGE_SIZE = 15;
const JOB_CD = 20 * 60 * 1000;
const ROB_CD = 15 * 60 * 1000;
const DUNGEON_CD = 5 * 60 * 1000;

export const rpgCommands2 = {

    // ─── SHOP ───────────────────────────────────────────────────────────
    async showShop(reply, args) {
        const cat = (args?.[0] || '').toLowerCase();
        const catalogs = {
            weapon: WEAPONS, senjata: WEAPONS,
            armor: ARMORS, zirah: ARMORS,
            potion: CONSUMABLES, consumable: CONSUMABLES,
            material: MATERIALS, bahan: MATERIALS,
        };

        if (!cat) {
            return reply(
`🏪 *TOKO ITEM RPG*

Pilih kategori:
• !toko weapon — ${WEAPONS.length} senjata
• !toko armor — ${ARMORS.length} zirah
• !toko potion — ${CONSUMABLES.length} consumable
• !toko material — ${MATERIALS.length} bahan crafting
• !petshop — toko hewan peliharaan

📌 Beli: *!beli [nama item]*`
            );
        }

        const list = catalogs[cat];
        if (!list) return reply('❌ Kategori tidak ada. Pilihan: weapon, armor, potion, material');

        const page = parseInt(args?.[1]) || 1;
        const start = (page - 1) * SHOP_PAGE_SIZE;
        const items = list.slice(start, start + SHOP_PAGE_SIZE);
        if (!items.length) return reply('❌ Halaman kosong.');

        const lines = items.map(i =>
            `• *${i.name}* — 💰 ${fmtNum(i.price)}\n  └ ${i.effect === 'heal' ? `Heal ${i.value} HP` : i.effect === 'material' ? 'Bahan crafting' : `+${i.value} ${i.effect.replace('buff','').toUpperCase()}`}`
        ).join('\n');

        const totalPages = Math.ceil(list.length / SHOP_PAGE_SIZE);
        await reply(`🏪 *TOKO — ${cat.toUpperCase()}* (hal ${page}/${totalPages})\n\n${lines}\n\n📌 *!beli [nama item]*\n📄 Halaman lain: *!toko ${cat} 2*`);
    },

    async buyItem(reply, sender, args) {
        if (!args?.[0]) return reply('📌 Cara pakai: *!beli [item]*\nContoh: *!beli Potion Kecil*');

        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const query = args.join(' ').toLowerCase();
        const item = findItem(query);
        if (!item) return reply(`❌ Item *"${args.join(' ')}"* tidak ditemukan!\nKetik *!toko* untuk lihat daftar kategori.`);

        if (char.gold < item.price)
            return reply(`❌ Gold tidak cukup!\nPunya: 💰 ${fmtNum(char.gold)} | Harga: 💰 ${fmtNum(item.price)}`);

        char.gold -= item.price;
        char.inventory[item.id] = (char.inventory[item.id] || 0) + 1;
        saveChar(sender, char);

        await reply(`✅ Berhasil beli *${item.name}*!\n📦 Masuk ke inventori.\n💰 Sisa Gold: ${fmtNum(char.gold)}`);
    },

    async sellItem(reply, sender, args) {
        if (!args?.[0]) return reply('📌 Cara pakai: *!jual [item] [jumlah]*');

        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const qtyArg = parseInt(args[args.length - 1]);
        const hasQty = !isNaN(qtyArg) && qtyArg > 0;
        const nameArgs = hasQty ? args.slice(0, -1) : args;
        const query = nameArgs.join(' ').toLowerCase();

        const ownedId = Object.keys(char.inventory).find(id => {
            const it = findItem(id);
            return it && (it.id === query || it.name.toLowerCase().includes(query));
        });
        if (!ownedId) return reply('❌ Item tidak ada di inventorimu!');

        const item = findItem(ownedId);
        const have = char.inventory[ownedId];
        const sellQty = Math.min(hasQty ? qtyArg : 1, have);
        const sellPrice = Math.floor(item.price * 0.5) * sellQty;

        char.inventory[ownedId] -= sellQty;
        if (char.inventory[ownedId] <= 0) delete char.inventory[ownedId];
        char.gold += sellPrice;
        saveChar(sender, char);

        await reply(`✅ Terjual *${item.name}* x${sellQty}!\n💰 Dapat: ${fmtNum(sellPrice)} Gold\n💰 Total Gold: ${fmtNum(char.gold)}`);
    },

    // ─── DAILY / ECONOMY ────────────────────────────────────────────────
    async dailyReward(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        if (now - char.lastDaily < oneDay) {
            const next = new Date(char.lastDaily + oneDay);
            return reply(`⏳ Sudah klaim hari ini!\nCoba lagi pukul *${next.getHours().toString().padStart(2,'0')}:${next.getMinutes().toString().padStart(2,'0')}*.`);
        }

        const isStreak = now - char.lastDaily < oneDay * 2;
        char.dailyStreak = isStreak ? (char.dailyStreak || 0) + 1 : 1;

        const gold = 50 + char.level * 10 + char.dailyStreak * 5;
        const exp = 30 + char.level * 5;
        const hp = Math.floor(char.maxHp * 0.5);

        char.gold += gold;
        char.exp += exp;
        char.hp = Math.min(char.maxHp, char.hp + hp);
        char.lastDaily = now;

        checkLevelUp(char);
        saveChar(sender, char);

        await reply(
`🎁 *DAILY REWARD!*

🔥 Streak: ${char.dailyStreak} hari
💰 Gold: +${gold}
✨ EXP: +${exp}
❤️ HP: +${hp}

💰 Total Gold: ${fmtNum(char.gold)}
❤️ HP sekarang: ${char.hp}/${char.maxHp}

Kembali besok untuk lanjutkan streak! 🗓️`
        );
    },

    async joblist(reply) {
        const lines = JOBS.map(j => `• *${j.name}* (!kerja ${j.id})\n  └ Gaji ${j.minPay}-${j.maxPay} | CD ${j.cooldownMin}m`).join('\n');
        await reply(`💼 *DAFTAR PEKERJAAN*\n\n${lines}`);
    },

    async work(reply, sender, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const jobId = (args?.[0] || char.job || '').toLowerCase();
        const job = JOBS.find(j => j.id === jobId);
        if (!job) return reply(`❌ Pekerjaan tidak ada!\nKetik *!joblist* untuk lihat daftar.`);

        const cd = job.cooldownMin * 60 * 1000;
        const left = cooldownLeft(char.lastJob, cd);
        if (left > 0) return reply(`⏳ Masih lelah! Tunggu *${fmtDuration(left)}* lagi.`);

        const pay = randInt(job.minPay, job.maxPay);
        char.gold += pay;
        char.job = job.id;
        char.lastJob = Date.now();
        saveChar(sender, char);

        await reply(`${job.name}\n\n💰 Kamu bekerja dan mendapat *${pay} Gold*!\n💰 Total: ${fmtNum(char.gold)}\n⏳ Cooldown: ${job.cooldownMin} menit`);
    },

    async bankDeposit(reply, sender, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const amount = args?.[0] === 'all' ? char.gold : parseInt(args?.[0]);
        if (!amount || amount <= 0) return reply('📌 Cara pakai: *!nabung [jumlah]* atau *!nabung all*');
        if (amount > char.gold) return reply('❌ Gold tidak cukup!');

        char.gold -= amount;
        char.bank += amount;
        saveChar(sender, char);
        await reply(`🏦 Berhasil nabung *${fmtNum(amount)}* Gold!\n💰 Dompet: ${fmtNum(char.gold)} | 🏦 Bank: ${fmtNum(char.bank)}`);
    },

    async bankWithdraw(reply, sender, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const amount = args?.[0] === 'all' ? char.bank : parseInt(args?.[0]);
        if (!amount || amount <= 0) return reply('📌 Cara pakai: *!tarik [jumlah]* atau *!tarik all*');
        if (amount > char.bank) return reply('❌ Saldo bank tidak cukup!');

        char.bank -= amount;
        char.gold += amount;
        saveChar(sender, char);
        await reply(`🏦 Berhasil tarik *${fmtNum(amount)}* Gold!\n💰 Dompet: ${fmtNum(char.gold)} | 🏦 Bank: ${fmtNum(char.bank)}`);
    },

    async transfer(reply, sender, mentioned, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        if (!mentioned?.[0]) return reply('📌 Cara pakai: *!transfer @tag [jumlah]*');

        const targetId = mentioned[0];
        const target = getChar(targetId);
        if (!target) return reply('❌ Target belum punya karakter RPG!');
        if (targetId === sender) return reply('❌ Tidak bisa transfer ke diri sendiri!');

        const amount = parseInt(args.find(a => /^\d+$/.test(a)));
        if (!amount || amount <= 0) return reply('📌 Sertakan jumlah gold yang valid!');
        if (amount > char.gold) return reply('❌ Gold tidak cukup!');

        char.gold -= amount;
        target.gold += amount;
        saveChar(sender, char);
        saveChar(targetId, target);

        await reply(`✅ Transfer *${fmtNum(amount)}* Gold ke ${target.name} berhasil!\n💰 Sisa Gold: ${fmtNum(char.gold)}`);
    },

    async rob(reply, sender, mentioned) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        if (!mentioned?.[0]) return reply('📌 Cara pakai: *!rob @tag*');

        const targetId = mentioned[0];
        const target = getChar(targetId);
        if (!target) return reply('❌ Target belum punya karakter RPG!');
        if (targetId === sender) return reply('❌ Tidak bisa merampok diri sendiri!');

        const left = cooldownLeft(char.lastRob, ROB_CD);
        if (left > 0) return reply(`⏳ Polisi masih mengawasimu! Tunggu *${fmtDuration(left)}*.`);
        if (target.gold < 50) return reply('❌ Target tidak punya cukup gold untuk dirampok.');

        char.lastRob = Date.now();
        const success = percentChance(40);

        if (success) {
            const stolen = Math.floor(target.gold * (0.1 + Math.random() * 0.2));
            target.gold -= stolen;
            char.gold += stolen;
            saveChar(sender, char);
            saveChar(targetId, target);
            await reply(`🦹 *RAMPOK BERHASIL!*\nKamu mencuri *${fmtNum(stolen)}* Gold dari ${target.name}!`);
        } else {
            const fine = Math.floor(char.gold * 0.15);
            char.gold = Math.max(0, char.gold - fine);
            saveChar(sender, char);
            await reply(`🚨 *KETANGKAP!*\nKamu didenda *${fmtNum(fine)}* Gold karena tertangkap merampok!`);
        }
    },

    // ─── PETS ───────────────────────────────────────────────────────────
    async petShop(reply) {
        const lines = PETS.map(p => `• ${p.name} — 💰 ${fmtNum(p.price)} (${p.rarity})\n  └ +${p.atkBonus} ATK, +${p.defBonus} DEF`).join('\n');
        await reply(`🐾 *TOKO PET*\n\n${lines}\n\n📌 Beli: *!buypet [nama]*`);
    },

    async buyPet(reply, sender, args) {
        if (!args?.[0]) return reply('📌 Cara pakai: *!buypet [nama]*');
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const query = args.join(' ').toLowerCase();
        const pet = PETS.find(p => p.id === query || p.name.toLowerCase().includes(query));
        if (!pet) return reply('❌ Pet tidak ditemukan! Lihat *!petshop*.');
        if (char.gold < pet.price) return reply(`❌ Gold tidak cukup! Butuh ${fmtNum(pet.price)}.`);

        char.gold -= pet.price;
        char.pet = pet;
        char.pets = char.pets || [];
        if (!char.pets.find(p => p.id === pet.id)) char.pets.push(pet);
        saveChar(sender, char);

        await reply(`🎉 Selamat! Kamu mengadopsi *${pet.name}*!\nPet otomatis aktif memberi bonus +${pet.atkBonus} ATK / +${pet.defBonus} DEF.`);
    },

    async petInfo(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        if (!char.pets?.length) return reply('🐾 Kamu belum punya pet. Beli di *!petshop*!');

        const lines = char.pets.map(p => `${char.pet?.id === p.id ? '✅' : '•'} ${p.name} (+${p.atkBonus} ATK / +${p.defBonus} DEF)`).join('\n');
        await reply(`🐾 *PET KAMU*\n\n${lines}\n\n📌 Ganti aktif: *!setpet [nama]*`);
    },

    async setPet(reply, sender, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        if (!args?.[0]) return reply('📌 Cara pakai: *!setpet [nama]*');

        const query = args.join(' ').toLowerCase();
        const pet = (char.pets || []).find(p => p.id === query || p.name.toLowerCase().includes(query));
        if (!pet) return reply('❌ Kamu tidak punya pet itu!');

        char.pet = pet;
        saveChar(sender, char);
        await reply(`✅ ${pet.name} sekarang menjadi pet aktifmu!`);
    },

    // ─── BOSS & DUNGEON ─────────────────────────────────────────────────
    async bossInfo(reply) {
        const lines = BOSSES.map((b, i) => `${i + 1}. ${b.name} (Tier ${b.tier}) — HP ${fmtNum(b.hp)}`).join('\n');
        await reply(`🐉 *DAFTAR BOSS*\n\n${lines}\n\n📌 Lawan: *!boss [nomor]*\n⚠️ Butuh level cukup untuk menang!`);
    },

    async fightBoss(reply, sender, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const idx = (parseInt(args?.[0]) || 1) - 1;
        const boss = BOSSES[idx];
        if (!boss) return reply('❌ Boss tidak ditemukan! Ketik *!bossinfo*.');

        if (char.level < boss.tier * 3) {
            return reply(`⚠️ Levelmu terlalu rendah untuk melawan ${boss.name}!\nDisarankan minimal level ${boss.tier * 3}.`);
        }

        const s = getEquippedStats(char);
        const bossStats = { atk: boss.atk, def: boss.def, crit: 5 };
        const result = simulateBattle(
            { name: char.name, hp: char.hp },
            { name: boss.name, hp: boss.hp },
            s, bossStats
        );

        let txt = `🐉 *RAID BOSS: ${boss.name}*\n\n📜 *Log:*\n${result.log.map(l => `• ${l}`).join('\n')}\n\n`;

        if (result.winner === 'a') {
            grantExpGold(char, boss.exp, boss.gold);
            char.bossKills = (char.bossKills || 0) + 1;
            char.inventory[boss.reward] = (char.inventory[boss.reward] || 0) + 1;
            char.hp = Math.max(1, result.aHpLeft);
            const levelUp = checkLevelUp(char);
            txt += `🏆 *MENANG!*\n✨ EXP: +${boss.exp}\n💰 Gold: +${boss.gold}\n🎁 Item: ${boss.reward}`;
            if (levelUp) txt += `\n\n🎉 *LEVEL UP! Level ${char.level}!*`;
        } else {
            char.hp = Math.max(0, Math.floor(char.maxHp * 0.1));
            txt += `💀 *KALAH!* ${boss.name} terlalu kuat. Coba perkuat dirimu dulu.`;
        }

        saveChar(sender, char);
        await reply(txt);
    },

    async dungeonInfo(reply) {
        const lines = DUNGEONS.map((d, i) => `${i + 1}. ${d.name} — min Lv.${d.minLevel}, ${d.floors} lantai`).join('\n');
        await reply(`🏯 *DAFTAR DUNGEON*\n\n${lines}\n\n📌 Masuk: *!dungeon [nomor]*`);
    },

    async enterDungeon(reply, sender, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const idx = (parseInt(args?.[0]) || 1) - 1;
        const dungeon = DUNGEONS[idx];
        if (!dungeon) return reply('❌ Dungeon tidak ditemukan! Ketik *!dungeoninfo*.');
        if (char.level < dungeon.minLevel) return reply(`⚠️ Butuh minimal level ${dungeon.minLevel} untuk masuk!`);

        const left = cooldownLeft(char.lastDungeon, DUNGEON_CD);
        if (left > 0) return reply(`⏳ Masih lelah dari dungeon sebelumnya! Tunggu *${fmtDuration(left)}*.`);

        const s = getEquippedStats(char);
        const clampChance = (diff) => Math.max(15, Math.min(90, 50 + diff * 0.5));
        let survived = true;
        let totalGold = 0, totalExp = 0;
        const floorLog = [];

        for (let f = 1; f <= dungeon.floors; f++) {
            const floorPower = dungeon.minLevel * 4 + f * 8;
            const success = percentChance(clampChance(s.atk + s.def - floorPower));
            if (success) {
                const g = randInt(20, 60) * f;
                const e = randInt(15, 45) * f;
                totalGold += g; totalExp += e;
                floorLog.push(`✅ Lantai ${f}: Berhasil! (+${g}G, +${e}EXP)`);
            } else {
                floorLog.push(`❌ Lantai ${f}: Gagal! Dungeon terhenti.`);
                survived = false;
                break;
            }
        }

        char.lastDungeon = Date.now();
        grantExpGold(char, totalExp, totalGold);

        let txt = `🏯 *DUNGEON: ${dungeon.name}*\n\n${floorLog.join('\n')}\n\n`;

        if (survived) {
            char.dungeonsCleared = (char.dungeonsCleared || 0) + 1;
            const boss = BOSSES.find(b => b.id === dungeon.bossId);
            txt += `🎉 *DUNGEON CLEAR!*\n👑 Boss penjaga: ${boss?.name || '???'}\n💰 Total Gold: +${totalGold}\n✨ Total EXP: +${totalExp}`;
        } else {
            txt += `💰 Gold didapat: +${totalGold}\n✨ EXP didapat: +${totalExp}\nCoba lagi setelah lebih kuat!`;
        }

        const levelUp = checkLevelUp(char);
        if (levelUp) txt += `\n\n🎉 *LEVEL UP! Level ${char.level}!*`;
        saveChar(sender, char);

        await reply(txt);
    },

    // ─── QUESTS & ACHIEVEMENTS ──────────────────────────────────────────
    async showQuests(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const lines = QUESTS.map(q => {
            const done = char.questsCompleted.includes(q.id);
            return `${done ? '✅' : '⬜'} *${q.name}*\n  └ Reward: ${q.rewardGold}G / ${q.rewardExp}EXP`;
        }).join('\n');

        await reply(`📜 *DAFTAR QUEST*\n\n${lines}\n\n📌 Ketik *!questclaim [id]* (contoh: q1) untuk klaim reward.`);
    },

    async claimQuest(reply, sender, args) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        const qid = (args?.[0] || '').toLowerCase();
        const quest = QUESTS.find(q => q.id === qid);
        if (!quest) return reply('❌ Quest tidak ditemukan! Ketik *!quest* untuk lihat daftar.');
        if (char.questsCompleted.includes(qid)) return reply('✅ Quest ini sudah pernah diklaim!');

        let eligible = false;
        switch (quest.type) {
            case 'hunt_count': eligible = (char.totalHunts || 0) >= quest.target; break;
            case 'pvp_win': eligible = char.wins >= quest.target; break;
            case 'level': eligible = char.level >= quest.target; break;
            case 'gold': eligible = char.gold >= quest.target; break;
            case 'dungeon': eligible = (char.dungeonsCleared || 0) >= quest.target; break;
            case 'boss': eligible = (char.bossKills || 0) >= quest.target; break;
            case 'daily_streak': eligible = (char.dailyStreak || 0) >= quest.target; break;
            default: eligible = false;
        }

        if (!eligible) return reply(`❌ Syarat belum terpenuhi untuk *${quest.name}*.`);

        char.gold += quest.rewardGold;
        char.exp += quest.rewardExp;
        char.questsCompleted.push(qid);
        checkLevelUp(char);
        saveChar(sender, char);

        await reply(`🎉 Quest *${quest.name}* selesai!\n💰 +${quest.rewardGold} Gold\n✨ +${quest.rewardExp} EXP`);
    },

    async showAchievements(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;

        const lines = ACHIEVEMENTS.map(a => `${char.achievements.includes(a.id) ? '✅' : '⬜'} ${a.name}`).join('\n');
        await reply(`🏅 *ACHIEVEMENT*\n\n${lines}`);
    },

    // ─── RANKING / SOCIAL ───────────────────────────────────────────────
    async showRanking(reply) {
        const users = getUsers();
        const players = Object.values(users)
            .filter(Boolean)
            .sort((a, b) => b.level !== a.level ? b.level - a.level : b.wins - a.wins)
            .slice(0, 10);

        if (!players.length) return reply('📊 Belum ada pemain RPG.');

        const medals = ['🥇', '🥈', '🥉'];
        const list = players.map((p, i) => `${medals[i] || `${i + 1}.`} *${p.name}* — Lv.${p.level} | 🏆 ${p.wins}W`).join('\n');

        await reply(`🏆 *TOP 10 PEMAIN RPG*\n\n${list}`);
    },

    async leaderboard(reply, args) {
        const mode = (args?.[0] || 'level').toLowerCase();
        const users = getUsers();
        const players = Object.values(users).filter(Boolean);
        if (!players.length) return reply('📊 Belum ada pemain RPG.');

        const sorters = {
            gold: (a, b) => (b.gold + b.bank) - (a.gold + a.bank),
            level: (a, b) => b.level - a.level,
            wins: (a, b) => b.wins - a.wins,
            hunts: (a, b) => (b.totalHunts || 0) - (a.totalHunts || 0),
        };
        const sorter = sorters[mode] || sorters.level;
        const top = players.sort(sorter).slice(0, 10);

        const valueFns = {
            gold: p => `${fmtNum(p.gold + p.bank)} G`,
            level: p => `Lv.${p.level}`,
            wins: p => `${p.wins} W`,
            hunts: p => `${p.totalHunts || 0}x`,
        };
        const valueFn = valueFns[mode] || valueFns.level;

        const list = top.map((p, i) => `${i + 1}. *${p.name}* — ${valueFn(p)}`).join('\n');
        await reply(`🏆 *LEADERBOARD: ${mode.toUpperCase()}*\n\n${list}`);
    },

    async marry(reply, sender, mentioned) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        if (!mentioned?.[0]) return reply('📌 Cara pakai: *!marry @tag*');
        if (char.married) return reply('❌ Kamu sudah menikah! Ketik *!divorce* untuk cerai dulu.');

        const targetId = mentioned[0];
        const target = getChar(targetId);
        if (!target) return reply('❌ Target belum punya karakter RPG!');
        if (targetId === sender) return reply('❌ Tidak bisa menikah dengan diri sendiri!');
        if (target.married) return reply('❌ Target sudah menikah dengan orang lain!');

        char.married = targetId;
        target.married = sender;
        saveChar(sender, char);
        saveChar(targetId, target);

        await reply(`💍 *PERNIKAHAN BERHASIL!*\n${char.name} 💕 ${target.name}\nSelamat menempuh hidup baru di dunia RPG!`);
    },

    async divorce(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        if (!char.married) return reply('❌ Kamu belum menikah!');

        const partner = getChar(char.married);
        if (partner) { partner.married = null; saveChar(char.married, partner); }
        char.married = null;
        saveChar(sender, char);

        await reply('💔 Kamu telah bercerai.');
    },
};
