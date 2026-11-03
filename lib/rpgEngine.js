import { CLASSES, expNeeded, findItem } from './rpgData.js';
import { store, save } from './db.js';
import { randInt } from './utils.js';

export function getUsers() {
    return store('users');
}

export function getChar(jid) {
    return getUsers()[jid] || null;
}

export function hasChar(jid) {
    return !!getChar(jid);
}

export function createChar(jid, className = 'warrior') {
    const cls = CLASSES[className] || CLASSES.warrior;
    const users = getUsers();
    users[jid] = {
        name: jid.split('@')[0],
        class: className,
        level: 1,
        exp: 0,
        baseHp: cls.hp, maxHp: cls.hp, hp: cls.hp,
        baseAtk: cls.atk, atk: cls.atk,
        baseDef: cls.def, def: cls.def,
        crit: cls.crit,
        gold: 100,
        bank: 0,
        gems: 0,
        inventory: {},       // itemId -> qty
        equipped: { weapon: null, armor: null },
        pet: null,
        pets: [],
        job: null,
        wins: 0, losses: 0,
        totalHunts: 0,
        bossKills: 0,
        dungeonsCleared: 0,
        questProgress: {},
        questsCompleted: [],
        achievements: [],
        title: null,
        married: null,
        dailyStreak: 0,
        lastHunt: 0, lastDaily: 0, lastBattle: 0, lastJob: 0, lastDungeon: 0, lastRob: 0,
        buffs: {},            // effect -> { value, expiresAtHunts }
        createdAt: Date.now(),
    };
    save('users');
    return users[jid];
}

export function saveChar(jid, char) {
    const users = getUsers();
    users[jid] = char;
    save('users');
}

export function getEquippedStats(char) {
    let bonusAtk = 0, bonusDef = 0;

    if (char.equipped?.weapon) {
        const item = findItem(char.equipped.weapon);
        if (item?.effect === 'atk') bonusAtk += item.value;
    }
    if (char.equipped?.armor) {
        const item = findItem(char.equipped.armor);
        if (item?.effect === 'def') bonusDef += item.value;
    }
    if (char.pet) {
        const pet = char.pet;
        bonusAtk += pet.atkBonus || 0;
        bonusDef += pet.defBonus || 0;
    }
    // active buffs
    if (char.buffs?.atkbuff) bonusAtk += char.buffs.atkbuff.value;
    if (char.buffs?.defbuff) bonusDef += char.buffs.defbuff.value;

    return {
        atk: char.atk + bonusAtk,
        def: char.def + bonusDef,
        crit: char.crit || 5,
    };
}

export function expMultiplier(char) {
    return char.buffs?.expbuff ? char.buffs.expbuff.value : 1;
}

export function consumeBuffCharge(char) {
    // decrement buff duration counters that tick per hunt/battle
    for (const key of Object.keys(char.buffs || {})) {
        if (char.buffs[key].duration !== undefined) {
            char.buffs[key].duration -= 1;
            if (char.buffs[key].duration <= 0) delete char.buffs[key];
        }
    }
}

export function checkLevelUp(char) {
    let leveledUp = false;
    while (char.exp >= expNeeded(char.level)) {
        char.exp -= expNeeded(char.level);
        char.level++;
        const cls = CLASSES[char.class] || CLASSES.warrior;
        const mult = 1 + (char.level - 1) * 0.09;
        char.baseHp = Math.floor(cls.hp * mult);
        char.maxHp = char.baseHp;
        char.hp = char.maxHp;
        char.baseAtk = Math.floor(cls.atk * mult);
        char.atk = char.baseAtk;
        char.baseDef = Math.floor(cls.def * mult);
        char.def = char.baseDef;
        leveledUp = true;
    }
    return leveledUp;
}

export function simulateBattle(a, b, aStats, bStats) {
    let aHp = a.hp, bHp = b.hp;
    const log = [];
    const maxRounds = 30;

    for (let r = 1; r <= maxRounds && aHp > 0 && bHp > 0; r++) {
        const aCrit = Math.random() * 100 < (aStats.crit || 5);
        let d1 = Math.max(1, aStats.atk - Math.floor(bStats.def * 0.55) + randInt(0, 7));
        if (aCrit) d1 = Math.floor(d1 * 1.8);
        bHp -= d1;
        log.push(`R${r}: ${a.name} ${aCrit ? '💥CRIT!' : '⚔️'} ${d1} dmg`);
        if (bHp <= 0) break;

        const bCrit = Math.random() * 100 < (bStats.crit || 5);
        let d2 = Math.max(1, bStats.atk - Math.floor(aStats.def * 0.55) + randInt(0, 7));
        if (bCrit) d2 = Math.floor(d2 * 1.8);
        aHp -= d2;
        log.push(`R${r}: ${b.name} ${bCrit ? '💥CRIT!' : '⚔️'} ${d2} dmg`);
    }

    return {
        winner: aHp >= bHp ? 'a' : 'b',
        log: log.slice(-8),
        aHpLeft: Math.max(0, aHp),
        bHpLeft: Math.max(0, bHp),
    };
}

export function grantExpGold(char, exp, gold) {
    char.exp += Math.floor(exp * expMultiplier(char));
    char.gold += gold;
}

export function addAchievementsIfEligible(char, ACHIEVEMENTS) {
    const newly = [];
    for (const ach of ACHIEVEMENTS) {
        if (!char.achievements.includes(ach.id) && ach.condition(char)) {
            char.achievements.push(ach.id);
            newly.push(ach);
        }
    }
    return newly;
}
