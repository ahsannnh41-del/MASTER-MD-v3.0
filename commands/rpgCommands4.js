import { MONSTERS, WEAPONS, ARMORS, findItem } from '../lib/rpgData.js';
import { getChar } from '../lib/rpgEngine.js';
import { fmtNum } from '../lib/utils.js';

function requireChar(char, reply) {
    if (!char) {
        reply('❌ Kamu belum punya karakter! Ketik *!rpg* untuk mulai berpetualang.');
        return false;
    }
    return true;
}

export const rpgCommands4 = {
    async monsterInfo(reply, args) {
        if (!args?.[0]) {
            const sample = MONSTERS.slice(0, 10).map((m, i) => `${i + 1}. ${m.name} (T${m.tier})`).join('\n');
            return reply(`👹 *DAFTAR MONSTER (10 pertama)*\n\n${sample}\n\nKetik *!monster [nama]* untuk detail.\nTotal monster: ${MONSTERS.length}`);
        }
        const query = args.join(' ').toLowerCase();
        const m = MONSTERS.find(mo => mo.name.toLowerCase().includes(query));
        if (!m) return reply('❌ Monster tidak ditemukan.');
        await reply(`👹 *${m.name}*\n\nTier: ${m.tier}\nHP: ${m.hp}\nATK: ${m.atk}\nDEF: ${m.def}\nEXP: ${m.exp}\nGold: ${m.gold}`);
    },

    async monsterList(reply, args) {
        const page = parseInt(args?.[0]) || 1;
        const size = 15;
        const start = (page - 1) * size;
        const items = MONSTERS.slice(start, start + size);
        if (!items.length) return reply('❌ Halaman kosong.');
        const lines = items.map((m, i) => `${start + i + 1}. ${m.name} (T${m.tier}) — HP${m.hp}`).join('\n');
        const totalPages = Math.ceil(MONSTERS.length / size);
        await reply(`👹 *DAFTAR MONSTER* (hal ${page}/${totalPages})\n\n${lines}`);
    },

    async itemInfo(reply, args) {
        if (!args?.[0]) return reply('📌 !iteminfo [nama item]');
        const item = findItem(args.join(' '));
        if (!item) return reply('❌ Item tidak ditemukan.');
        await reply(`📦 *${item.name}*\n\nTipe: ${item.type}\nHarga: ${fmtNum(item.price)} Gold\nEfek: ${item.effect} ${item.value ? `(+${item.value})` : ''}`);
    },

    async weaponList(reply, args) {
        const page = parseInt(args?.[0]) || 1;
        const size = 15;
        const start = (page - 1) * size;
        const items = WEAPONS.slice(start, start + size);
        if (!items.length) return reply('❌ Halaman kosong.');
        const lines = items.map(w => `• ${w.name} — ${fmtNum(w.price)}G (+${w.value} ATK)`).join('\n');
        const totalPages = Math.ceil(WEAPONS.length / size);
        await reply(`⚔️ *DAFTAR WEAPON* (hal ${page}/${totalPages})\n\n${lines}`);
    },

    async armorList(reply, args) {
        const page = parseInt(args?.[0]) || 1;
        const size = 15;
        const start = (page - 1) * size;
        const items = ARMORS.slice(start, start + size);
        if (!items.length) return reply('❌ Halaman kosong.');
        const lines = items.map(a => `• ${a.name} — ${fmtNum(a.price)}G (+${a.value} DEF)`).join('\n');
        const totalPages = Math.ceil(ARMORS.length / size);
        await reply(`🛡️ *DAFTAR ARMOR* (hal ${page}/${totalPages})\n\n${lines}`);
    },

    async comparePower(reply, sender, mentioned) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        if (!mentioned?.[0]) return reply('📌 !compare @tag');
        const target = getChar(mentioned[0]);
        if (!target) return reply('❌ Target belum punya karakter RPG!');

        const myPower = char.atk + char.def + char.maxHp / 5;
        const theirPower = target.atk + target.def + target.maxHp / 5;

        await reply(
`⚖️ *PERBANDINGAN KEKUATAN*

${char.name}: Power ${Math.round(myPower)}
${target.name}: Power ${Math.round(theirPower)}

${myPower > theirPower ? `🏆 ${char.name} lebih kuat!` : myPower < theirPower ? `🏆 ${target.name} lebih kuat!` : '🤝 Kekuatan seimbang!'}`
        );
    },

    async classInfo(reply, args) {
        const { CLASSES } = await import('../lib/rpgData.js');
        if (!args?.[0]) {
            const lines = Object.entries(CLASSES).map(([id, c]) => `• ${c.name} (!class ${id})`).join('\n');
            return reply(`📚 *DAFTAR CLASS*\n\n${lines}\n\nKetik *!classinfo [nama]* untuk detail stat.`);
        }
        const cls = CLASSES[args[0].toLowerCase()];
        if (!cls) return reply('❌ Class tidak ditemukan.');
        await reply(`${cls.name}\n\nHP: ${cls.hp}\nATK: ${cls.atk}\nDEF: ${cls.def}\nCrit: ${cls.crit}%\n\n${cls.desc}`);
    },

    async checkHp(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        await reply(`❤️ HP: ${char.hp}/${char.maxHp}`);
    },

    async checkGold(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        await reply(`💰 Gold: ${fmtNum(char.gold)} | 🏦 Bank: ${fmtNum(char.bank)}`);
    },

    async checkLevel(reply, sender) {
        const char = getChar(sender);
        if (!requireChar(char, reply)) return;
        await reply(`⭐ Level: ${char.level} | Class: ${char.class}`);
    },
};
