// ═══════════════════════════════════════════════════════════════════
//  RPGCOMMANDS7.JS — Command untuk Farming, Title, Cooking, Bounty
// ═══════════════════════════════════════════════════════════════════

import { CROPS, plantCrop, waterCrop, harvestCrop, getFarmStatusText } from '../lib/farmingSystem.js';
import { TITLES, getUnlockedTitles, equipTitle, getEquippedTitleName } from '../lib/titleSystem.js';
import { RECIPES, cookRecipe, getTodayBounty, claimBounty } from '../lib/cookingBounty.js';
import { getChar } from '../lib/rpgEngine.js';

// ── FARMING ──────────────────────────────────────────────────────────
export async function plantCmd(ctx) {
    const cropName = (ctx.args[0] || '').toLowerCase();
    if (!cropName) {
        const list = Object.entries(CROPS).map(([k, v]) => `${k} (${v.seedCost} gold, ${v.growMinutes}m)`).join('\n');
        return ctx.reply(`🌱 *Cara pakai:* \`.plant [nama_tanaman]\`\n\n${list}`);
    }
    const result = plantCrop(ctx.sender, cropName);
    if (!result.success) return ctx.reply(`❌ ${result.error}`);
    return ctx.reply(`🌱 *Berhasil tanam ${cropName}!*\n\nJangan lupa \`.water\` sebelum panen. Siap panen dalam ${result.crop.growMinutes} menit.`);
}

export async function waterCmd(ctx) {
    const result = waterCrop(ctx.sender);
    if (!result.success) return ctx.reply(`❌ ${result.error}`);
    return ctx.reply('💧 Tanaman berhasil disiram! Tunggu waktunya lalu `.harvest`.');
}

export async function harvestCmd(ctx) {
    const result = harvestCrop(ctx.sender);
    if (!result.success) return ctx.reply(`❌ ${result.error}`);
    let txt = `🌾 *Panen berhasil!*\n\n+${result.crop.yieldQty}x ${result.cropName}\n+${result.crop.exp} EXP | +${result.crop.gold} gold`;
    if (result.leveledUp) txt += `\n\n🎉 *LEVEL UP!* Sekarang level ${result.newLevel}`;
    return ctx.reply(txt);
}

export async function farmStatusCmd(ctx) {
    const status = getFarmStatusText(ctx.sender);
    if (!status) return ctx.reply('🌱 Lahan kamu masih kosong. Tanam dulu lewat `.plant [nama_tanaman]`.');
    let txt = `🚜 *Status Lahan*\n\nTanaman: ${status.crop}\nDisiram: ${status.watered ? '✅ Ya' : '❌ Belum'}\n`;
    txt += status.ready ? 'Status: *Siap dipanen!* Ketik `.harvest`' : `Sisa waktu: *${status.remainingMin} menit*`;
    return ctx.reply(txt);
}

// ── TITLE ────────────────────────────────────────────────────────────
export async function titlesCmd(ctx) {
    const char = getChar(ctx.sender);
    if (!char) return ctx.reply('❌ Kamu belum punya karakter RPG. Ketik `.rpg` dulu.');
    const unlocked = getUnlockedTitles(char).map(t => t.id);
    let txt = `🏅 *DAFTAR TITLE*\n\n`;
    TITLES.forEach(t => {
        const isUnlocked = unlocked.includes(t.id);
        const isEquipped = char.equippedTitle === t.id;
        txt += `${isUnlocked ? '✅' : '🔒'} ${t.name}${isEquipped ? ' *(dipakai)*' : ''}\n`;
    });
    txt += `\nPakai title: \`.equiptitle [nama]\``;
    return ctx.reply(txt);
}

export async function equipTitleCmd(ctx) {
    const titleName = ctx.args.join(' ').toLowerCase().replace(/\s+/g, '_');
    const title = TITLES.find(t => t.id === titleName || t.name.toLowerCase() === ctx.args.join(' ').toLowerCase());
    if (!title) return ctx.reply('⚠️ Cara pakai: `.equiptitle [nama title]`\nLihat daftar: `.titles`');
    const result = equipTitle(ctx.sender, title.id);
    if (!result.success) return ctx.reply(`❌ ${result.error}`);
    return ctx.reply(`✅ Title *"${result.title.name}"* sekarang dipakai!`);
}

// ── COOKING ──────────────────────────────────────────────────────────
export async function cookCmd(ctx) {
    const recipeName = (ctx.args[0] || '').toLowerCase();
    if (!recipeName) {
        const list = Object.entries(RECIPES).map(([k, v]) => {
            const ing = Object.entries(v.ingredients).map(([i, q]) => `${q}x ${i}`).join(' + ');
            return `${k} — ${v.name} (butuh: ${ing})`;
        }).join('\n');
        return ctx.reply(`🍳 *Cara pakai:* \`.cook [nama_resep]\`\n\n${list}`);
    }
    const result = cookRecipe(ctx.sender, recipeName);
    if (!result.success) return ctx.reply(`❌ ${result.error}`);
    let txt = `🍳 *Berhasil masak ${result.recipe.name}!*\n\n+${result.recipe.exp} EXP\nMakanan disimpan di inventory, dipakai lewat sistem item yang sudah ada.`;
    if (result.leveledUp) txt += `\n\n🎉 *LEVEL UP!* Sekarang level ${result.newLevel}`;
    return ctx.reply(txt);
}

export async function recipesCmd(ctx) {
    let txt = `📖 *DAFTAR RESEP MASAKAN*\n\n`;
    Object.entries(RECIPES).forEach(([key, r]) => {
        const ing = Object.entries(r.ingredients).map(([i, q]) => `${q}x ${i}`).join(' + ');
        txt += `*${key}* — ${r.name}\nBahan: ${ing}\n\n`;
    });
    return ctx.reply(txt.trim());
}

// ── BOUNTY HARIAN ────────────────────────────────────────────────────
export async function bountyCmd(ctx) {
    const bounty = getTodayBounty(ctx.sender);
    let txt = `🎯 *BOUNTY HARI INI*\n\nTarget: *${bounty.target}*\nHadiah: ${bounty.rewardGold} gold + ${bounty.rewardExp} EXP\n\n`;
    txt += bounty.claimed ? '✅ Sudah kamu klaim hari ini.' : 'Klaim lewat `.claimbounty`';
    return ctx.reply(txt);
}

export async function claimBountyCmd(ctx) {
    const result = claimBounty(ctx.sender);
    if (!result.success) return ctx.reply(`❌ ${result.error}`);
    let txt = `🎯 *Bounty "${result.bounty.target}" berhasil diklaim!*\n\n+${result.bounty.rewardGold} gold\n+${result.bounty.rewardExp} EXP`;
    if (result.leveledUp) txt += `\n\n🎉 *LEVEL UP!* Sekarang level ${result.newLevel}`;
    return ctx.reply(txt);
}
