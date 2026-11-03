// ═══════════════════════════════════════════════════════════════════════
//  RPG GAME DATA — classes, items, monsters, dungeons, quests, pets, jobs
// ═══════════════════════════════════════════════════════════════════════

export const CLASSES = {
    warrior:  { name: '⚔️ Warrior',  hp: 160, atk: 22, def: 16, crit: 5,  desc: 'Tank kuat, HP & DEF besar' },
    mage:     { name: '🔮 Mage',     hp: 100, atk: 38, def: 8,  crit: 10, desc: 'Damage sihir sangat tinggi' },
    archer:   { name: '🏹 Archer',   hp: 120, atk: 30, def: 11, crit: 15, desc: 'Seimbang, crit tinggi' },
    healer:   { name: '✨ Healer',   hp: 140, atk: 16, def: 14, crit: 5,  desc: 'HP besar, regen tinggi' },
    assassin: { name: '🗡️ Assassin', hp: 95,  atk: 34, def: 9,  crit: 25, desc: 'Crit gila-gilaan, HP rapuh' },
    paladin:  { name: '🛡️ Paladin',  hp: 175, atk: 24, def: 20, crit: 5,  desc: 'Tank terbaik, lambat' },
    ninja:    { name: '🥷 Ninja',    hp: 110, atk: 32, def: 10, crit: 18, desc: 'Cepat & lincah' },
    summoner: { name: '👻 Summoner', hp: 105, atk: 28, def: 10, crit: 8,  desc: 'Dibantu monster panggilan' },
};

export function expNeeded(level) {
    return Math.floor(100 * Math.pow(1.45, level - 1));
}

// ─── MONSTERS (50 unique, scaled by tier) ─────────────────────────────────
const monsterNames = [
    ['🐀 Tikus Comberan', 1], ['🐍 Ular Sawah', 1], ['🦇 Kelelawar Gua', 1], ['🐗 Babi Hutan', 2],
    ['🐺 Serigala Liar', 2], ['🕷️ Laba-laba Raksasa', 2], ['🐻 Beruang Gunung', 3], ['🦂 Scorpion Pasir', 3],
    ['👹 Goblin Hijau', 3], ['👺 Goblin Merah', 4], ['🧟 Zombie Busuk', 4], ['💀 Skeleton Warrior', 4],
    ['🧙 Penyihir Hitam', 5], ['🐉 Naga Muda', 5], ['🦎 Kadal Lava', 5], ['👻 Hantu Penasaran', 6],
    ['🧛 Vampire Muda', 6], ['🐲 Naga Es', 6], ['🦅 Griffin Liar', 7], ['🐯 Macan Putih', 7],
    ['🦄 Unicorn Gelap', 7], ['🐙 Kraken Kecil', 8], ['🦖 Raptor Purba', 8], ['🧞 Jin Jahat', 8],
    ['👹 Orc Berat', 9], ['👹 Orc Champion', 9], ['🗿 Golem Batu', 9], ['🔥 Elemental Api', 10],
    ['❄️ Elemental Es', 10], ['⚡ Elemental Petir', 10], ['🐉 Naga Dewasa', 11], ['🦂 Ratu Scorpion', 11],
    ['🧟 Ghoul Raja', 11], ['💀 Lich Muda', 12], ['👁️ Mata Iblis', 12], ['🐺 Werewolf Alpha', 12],
    ['🧛 Vampire Lord', 13], ['🐲 Wyvern', 13], ['🗿 Golem Besi', 13], ['🔥 Phoenix Liar', 14],
    ['🦑 Kraken Dewasa', 14], ['👹 Demon Lord Muda', 15], ['💀 Lich Agung', 15], ['🐉 Naga Kuno', 16],
    ['😈 Iblis Penjaga', 16], ['🔥 Inferno Beast', 17], ['❄️ Frost Titan', 17], ['🌑 Bayangan Malam', 18],
    ['👑 Raja Goblin', 19], ['☠️ Penguasa Dunia Bawah', 20],
];

export const MONSTERS = monsterNames.map(([name, tier], idx) => {
    const baseHp = 25 + tier * 22;
    const baseAtk = 6 + tier * 4;
    const baseDef = 2 + tier * 2;
    return {
        id: `m${idx + 1}`,
        name,
        tier,
        hp: baseHp,
        atk: baseAtk,
        def: baseDef,
        exp: 10 + tier * 12,
        gold: 8 + tier * 10,
        dropChance: 0.18,
    };
});

// ─── BOSSES (10, for dungeons/raids) ──────────────────────────────────────
export const BOSSES = [
    { id: 'b1',  name: '👑 Raja Goblin Kegelapan', tier: 5,  hp: 600,  atk: 45, def: 25, exp: 400,  gold: 300,  reward: 'crown_shard' },
    { id: 'b2',  name: '🐉 Naga Merah Purba',      tier: 8,  hp: 1100, atk: 70, def: 40, exp: 800,  gold: 600,  reward: 'dragon_scale' },
    { id: 'b3',  name: '💀 Lich King',             tier: 10, hp: 1500, atk: 85, def: 45, exp: 1200, gold: 900,  reward: 'soul_gem' },
    { id: 'b4',  name: '🧊 Frost Titan Penguasa',  tier: 12, hp: 1900, atk: 95, def: 55, exp: 1600, gold: 1200, reward: 'frost_core' },
    { id: 'b5',  name: '🔥 Inferno Lord',          tier: 14, hp: 2400, atk: 110,def: 60, exp: 2100, gold: 1600, reward: 'inferno_core' },
    { id: 'b6',  name: '🦑 Kraken Penjaga Laut',   tier: 16, hp: 2900, atk: 125,def: 70, exp: 2700, gold: 2100, reward: 'kraken_eye' },
    { id: 'b7',  name: '😈 Arch Demon',            tier: 18, hp: 3500, atk: 140,def: 80, exp: 3400, gold: 2700, reward: 'demon_horn' },
    { id: 'b8',  name: '🌑 Penguasa Bayangan',     tier: 20, hp: 4200, atk: 155,def: 90, exp: 4200, gold: 3400, reward: 'shadow_orb' },
    { id: 'b9',  name: '👁️ Mata Segala Tahu',      tier: 23, hp: 5000, atk: 175,def: 100,exp: 5200, gold: 4200, reward: 'allseeing_eye' },
    { id: 'b10', name: '☠️ Penguasa Dunia Akhir',  tier: 26, hp: 6000, atk: 200,def: 115,exp: 6500, gold: 5500, reward: 'world_ender_core' },
];

// ─── SHOP ITEMS (weapons, armor, consumables, materials) ─────────────────
function genWeapons() {
    const tiers = [
        ['Kayu', 1, 6], ['Batu', 2, 12], ['Besi', 3, 20], ['Perak', 4, 30], ['Baja', 5, 42],
        ['Mithril', 6, 58], ['Naga', 7, 78], ['Iblis', 8, 100], ['Suci', 9, 125], ['Legendaris', 10, 155],
    ];
    const types = [
        ['Pedang', '⚔️'], ['Kapak', '🪓'], ['Tombak', '🔱'], ['Busur', '🏹'], ['Tongkat', '🪄'], ['Belati', '🗡️'],
    ];
    const out = [];
    let n = 1;
    for (const [tname, ticon] of types) {
        for (const [mat, tier, atkBonus] of tiers) {
            out.push({
                id: `weapon_${n}`,
                name: `${ticon} ${tname} ${mat}`,
                type: 'weapon',
                tier,
                price: tier * 90 + atkBonus * 6,
                effect: 'atk',
                value: atkBonus,
            });
            n++;
        }
    }
    return out;
}

function genArmors() {
    const tiers = [
        ['Kain', 1, 4], ['Kulit', 2, 9], ['Besi', 3, 16], ['Perak', 4, 24], ['Baja', 5, 34],
        ['Mithril', 6, 46], ['Naga', 7, 60], ['Iblis', 8, 76], ['Suci', 9, 95], ['Legendaris', 10, 118],
    ];
    const types = [
        ['Helm', '⛑️'], ['Zirah Dada', '🥋'], ['Sarung Tangan', '🧤'], ['Sepatu Besi', '🥾'], ['Perisai', '🛡️'],
    ];
    const out = [];
    let n = 1;
    for (const [tname, ticon] of types) {
        for (const [mat, tier, defBonus] of tiers) {
            out.push({
                id: `armor_${n}`,
                name: `${ticon} ${tname} ${mat}`,
                type: 'armor',
                tier,
                price: tier * 85 + defBonus * 7,
                effect: 'def',
                value: defBonus,
            });
            n++;
        }
    }
    return out;
}

function genConsumables() {
    return [
        { id: 'potion_s',  name: '🧪 Potion Kecil',     type: 'consumable', price: 15,  effect: 'heal', value: 25 },
        { id: 'potion_m',  name: '💊 Potion Sedang',    type: 'consumable', price: 35,  effect: 'heal', value: 60 },
        { id: 'potion_l',  name: '🍶 Potion Besar',     type: 'consumable', price: 70,  effect: 'heal', value: 130 },
        { id: 'potion_xl', name: '⚗️ Elixir Penyembuh', type: 'consumable', price: 140, effect: 'heal', value: 300 },
        { id: 'potion_full', name: '🌟 Potion Suci',    type: 'consumable', price: 250, effect: 'healfull', value: 9999 },
        { id: 'atk_boost', name: '🔥 Ramuan Kekuatan',  type: 'consumable', price: 60,  effect: 'atkbuff', value: 15, duration: 3 },
        { id: 'def_boost', name: '🧊 Ramuan Pertahanan',type: 'consumable', price: 60,  effect: 'defbuff', value: 15, duration: 3 },
        { id: 'exp_boost', name: '📘 Gulungan EXP x2',  type: 'consumable', price: 200, effect: 'expbuff', value: 2, duration: 5 },
        { id: 'revive',     name: '💎 Batu Kebangkitan', type: 'consumable', price: 120, effect: 'revive', value: 1 },
        { id: 'antidote',  name: '🍃 Penawar Racun',    type: 'consumable', price: 25,  effect: 'cure', value: 1 },
    ];
}

function genMaterials() {
    const mats = [
        'Kulit Serigala', 'Sisik Naga', 'Gigi Goblin', 'Inti Slime', 'Bulu Griffin',
        'Tulang Skeleton', 'Racun Scorpion', 'Jiwa Hantu', 'Batu Rune', 'Kristal Ajaib',
    ];
    return mats.map((m, i) => ({
        id: `mat_${i + 1}`,
        name: `🔹 ${m}`,
        type: 'material',
        price: 20 + i * 15,
        effect: 'material',
        value: 0,
    }));
}

export const WEAPONS = genWeapons();
export const ARMORS = genArmors();
export const CONSUMABLES = genConsumables();
export const MATERIALS = genMaterials();
export const SHOP_ITEMS = [...WEAPONS, ...ARMORS, ...CONSUMABLES, ...MATERIALS];

export function findItem(idOrName) {
    const q = idOrName.toLowerCase().trim();
    return SHOP_ITEMS.find(i => i.id === q) ||
        SHOP_ITEMS.find(i => i.name.toLowerCase().includes(q));
}

// ─── PETS ──────────────────────────────────────────────────────────────────
export const PETS = [
    { id: 'pet_cat',    name: '🐱 Kucing', price: 150,  atkBonus: 3,  defBonus: 1,  rarity: 'common' },
    { id: 'pet_dog',    name: '🐶 Anjing', price: 150,  atkBonus: 2,  defBonus: 3,  rarity: 'common' },
    { id: 'pet_wolf',   name: '🐺 Serigala', price: 400, atkBonus: 6,  defBonus: 3,  rarity: 'uncommon' },
    { id: 'pet_eagle',  name: '🦅 Elang', price: 450,    atkBonus: 7,  defBonus: 2,  rarity: 'uncommon' },
    { id: 'pet_tiger',  name: '🐯 Harimau', price: 900,  atkBonus: 12, defBonus: 5,  rarity: 'rare' },
    { id: 'pet_bear',   name: '🐻 Beruang', price: 950,  atkBonus: 9,  defBonus: 10, rarity: 'rare' },
    { id: 'pet_phoenix',name: '🔥 Phoenix', price: 2200, atkBonus: 20, defBonus: 12, rarity: 'epic' },
    { id: 'pet_griffin',name: '🦅 Griffin', price: 2400, atkBonus: 22, defBonus: 14, rarity: 'epic' },
    { id: 'pet_dragon', name: '🐉 Naga Kecil', price: 5000, atkBonus: 35, defBonus: 25, rarity: 'legendary' },
    { id: 'pet_unicorn',name: '🦄 Unicorn', price: 5500,  atkBonus: 30, defBonus: 32, rarity: 'legendary' },
];

// ─── JOBS / PROFESSIONS (passive income via !kerja) ───────────────────────
export const JOBS = [
    { id: 'petani',  name: '🌾 Petani',   minPay: 15, maxPay: 40,  cooldownMin: 20 },
    { id: 'nelayan', name: '🎣 Nelayan',  minPay: 20, maxPay: 50,  cooldownMin: 25 },
    { id: 'penambang', name: '⛏️ Penambang', minPay: 25, maxPay: 65, cooldownMin: 30 },
    { id: 'pemburu', name: '🏹 Pemburu',  minPay: 30, maxPay: 75,  cooldownMin: 30 },
    { id: 'pedagang', name: '💰 Pedagang', minPay: 35, maxPay: 90, cooldownMin: 35 },
    { id: 'pandai_besi', name: '🔨 Pandai Besi', minPay: 40, maxPay: 100, cooldownMin: 40 },
    { id: 'penyihir', name: '🔮 Penyihir', minPay: 45, maxPay: 120, cooldownMin: 45 },
    { id: 'bangsawan', name: '👑 Bangsawan', minPay: 60, maxPay: 150, cooldownMin: 60 },
];

// ─── DUNGEONS (multi-floor PvE content) ───────────────────────────────────
export const DUNGEONS = [
    { id: 'd1', name: '🕳️ Gua Goblin',        minLevel: 1,  floors: 3,  bossId: 'b1' },
    { id: 'd2', name: '🏯 Kuil Terlupakan',    minLevel: 8,  floors: 4,  bossId: 'b2' },
    { id: 'd3', name: '⚰️ Makam Raja Tua',     minLevel: 15, floors: 5,  bossId: 'b3' },
    { id: 'd4', name: '🧊 Benteng Es',         minLevel: 22, floors: 5,  bossId: 'b4' },
    { id: 'd5', name: '🌋 Gunung Berapi',      minLevel: 30, floors: 6,  bossId: 'b5' },
    { id: 'd6', name: '🌊 Kuil Bawah Laut',    minLevel: 38, floors: 6,  bossId: 'b6' },
    { id: 'd7', name: '🏰 Kastil Iblis',       minLevel: 46, floors: 7,  bossId: 'b7' },
    { id: 'd8', name: '🌑 Dimensi Bayangan',   minLevel: 55, floors: 7,  bossId: 'b8' },
    { id: 'd9', name: '👁️ Menara Segala Tahu', minLevel: 65, floors: 8,  bossId: 'b9' },
    { id: 'd10',name: '☠️ Gerbang Akhir Dunia',minLevel: 80, floors: 10, bossId: 'b10' },
];

// ─── QUESTS ────────────────────────────────────────────────────────────────
export const QUESTS = [
    { id: 'q1',  name: 'Berburu 5 Monster',        type: 'hunt_count',  target: 5,   rewardGold: 100,  rewardExp: 80 },
    { id: 'q2',  name: 'Berburu 15 Monster',       type: 'hunt_count',  target: 15,  rewardGold: 300,  rewardExp: 250 },
    { id: 'q3',  name: 'Menang 3 Battle PvP',      type: 'pvp_win',     target: 3,   rewardGold: 200,  rewardExp: 150 },
    { id: 'q4',  name: 'Menang 10 Battle PvP',     type: 'pvp_win',     target: 10,  rewardGold: 600,  rewardExp: 500 },
    { id: 'q5',  name: 'Capai Level 10',           type: 'level',       target: 10,  rewardGold: 250,  rewardExp: 0 },
    { id: 'q6',  name: 'Capai Level 25',           type: 'level',       target: 25,  rewardGold: 800,  rewardExp: 0 },
    { id: 'q7',  name: 'Kumpulkan 1000 Gold',      type: 'gold',        target: 1000,rewardGold: 0,    rewardExp: 400 },
    { id: 'q8',  name: 'Selesaikan 1 Dungeon',     type: 'dungeon',     target: 1,   rewardGold: 500,  rewardExp: 350 },
    { id: 'q9',  name: 'Kalahkan 1 Boss',          type: 'boss',        target: 1,   rewardGold: 700,  rewardExp: 500 },
    { id: 'q10', name: 'Klaim Daily 7 Hari Beruntun', type: 'daily_streak', target: 7, rewardGold: 1000, rewardExp: 700 },
];

// ─── ACHIEVEMENTS (titles) ────────────────────────────────────────────────
export const ACHIEVEMENTS = [
    { id: 'a1', name: '🌱 Pemula', condition: c => c.level >= 1,  title: 'Pemula' },
    { id: 'a2', name: '⚔️ Petarung', condition: c => c.level >= 10, title: 'Petarung' },
    { id: 'a3', name: '🛡️ Veteran', condition: c => c.level >= 25, title: 'Veteran' },
    { id: 'a4', name: '👑 Legenda', condition: c => c.level >= 50, title: 'Legenda' },
    { id: 'a5', name: '☠️ Dewa Perang', condition: c => c.level >= 80, title: 'Dewa Perang' },
    { id: 'a6', name: '💰 Kaya Raya', condition: c => c.gold >= 10000, title: 'Si Kaya' },
    { id: 'a7', name: '🏆 Juara PvP', condition: c => c.wins >= 50, title: 'Juara PvP' },
    { id: 'a8', name: '🗡️ Pembunuh Monster', condition: c => (c.totalHunts || 0) >= 100, title: 'Pembunuh Monster' },
];
