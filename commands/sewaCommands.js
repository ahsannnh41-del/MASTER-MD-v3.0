// ═══════════════════════════════════════════════════════════════════
//  SEWACOMMANDS.JS — Sistem Sewa Bot per Grup
// ═══════════════════════════════════════════════════════════════════

import {
    addSewa, delSewa, getSewa, listSewa, isSewaActive,
    isSewaMode, setSewaMode, fmtTgl, sisaWaktu, parseDurasi,
    getHargaSewa, setHargaSewa,
} from '../lib/sewaBot.js';
import settings from '../setting.js';

const P = settings.prefix || '.';

// Helper: resolve JID grup dari link atau JID langsung
function resolveGroupJid(input) {
    if (!input) return null;
    // Ambil kode invite dari link
    const linkMatch = input.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/);
    if (linkMatch) return linkMatch[1]; // return invite code (perlu join dulu)

    // Sudah berbentuk JID
    if (input.includes('@g.us')) return input;

    // Nomor murni → tambah suffix
    const clean = input.replace(/[^0-9]/g, '');
    if (clean.length > 10) return `${clean}@g.us`;

    return null;
}

export const sewaCommands = {

    // ── .sewa ─────────────────────────────────────────────────────
    // Penggunaan: .sewa [link/jid grup] [durasi]
    // Di dalam grup: .sewa 7hari   (tanpa link → pakai jid grup saat ini)
    async sewa(ctx) {
        if (!ctx.isOwner) {
            return ctx.reply('❌ Hanya *Owner/Creator* yang bisa mengatur sewa bot.');
        }

        const { args, jid, isGroup } = ctx;

        // Parse argumen — bisa: .sewa 7hari  atau  .sewa <link> 7hari
        let targetJid = null;
        let durasiStr = null;

        if (args.length === 0) {
            return ctx.reply(
                `📋 *SISTEM SEWA BOT*\n\n` +
                `*Cara pakai:*\n` +
                `• Di grup langsung: \`${P}sewa 7hari\`\n` +
                `• Dari DM: \`${P}sewa [link/jid grup] [durasi]\`\n\n` +
                `*Format durasi:*\n` +
                `┣ \`1hari\` / \`7hari\` / \`30hari\`\n` +
                `┣ \`1minggu\` / \`2minggu\`\n` +
                `┣ \`1bulan\` / \`3bulan\`\n` +
                `┣ \`1tahun\`\n` +
                `┗ \`selamanya\` / \`permanent\`\n\n` +
                `*Contoh:*\n` +
                `\`${P}sewa 7hari\` ← di grup\n` +
                `\`${P}sewa https://chat.whatsapp.com/xxx 1bulan\``
            );
        }

        if (args.length === 1) {
            // Satu arg: bisa jadi durasi (kalau di grup) atau link saja
            if (isGroup && parseDurasi(args[0])) {
                targetJid = jid;
                durasiStr = args[0];
            } else {
                return ctx.reply(`❌ Kurang argumen.\nContoh: \`${P}sewa 7hari\` (di grup) atau \`${P}sewa <link> 7hari\``);
            }
        } else {
            // Dua arg atau lebih: arg[0] = link/jid, arg[1] = durasi
            targetJid = resolveGroupJid(args[0]);
            durasiStr = args.slice(1).join('');
            if (!targetJid) {
                // Mungkin args[0] adalah durasi dan dipanggil dari grup
                if (isGroup && parseDurasi(args[0])) {
                    targetJid = jid;
                    durasiStr = args[0];
                } else {
                    return ctx.reply('❌ Format link/JID grup tidak dikenali.');
                }
            }
        }

        const result = addSewa(targetJid, {
            penyewaJid: ctx.sender,
            durasi: durasiStr,
            catatan: '',
        });

        if (!result.ok) return ctx.reply(`❌ ${result.reason}`);

        const isPerp = result.perpanjang;
        const selesaiText = result.selesaiTs === Infinity
            ? 'Selamanya ♾️'
            : fmtTgl(result.selesaiTs);

        await ctx.reply(
            `${isPerp ? '🔄 *Sewa Diperpanjang*' : '✅ *Sewa Bot Berhasil Diatur*'}\n\n` +
            `🏘️ Grup  : \`${targetJid}\`\n` +
            `⏱️ Durasi: *${result.label}*\n` +
            `📅 Sampai: *${selesaiText}*\n\n` +
            `> Ketik \`${P}ceksewa\` di grup untuk cek status.`
        );
    },

    // ── .ceksewa ──────────────────────────────────────────────────
    async ceksewa(ctx) {
        const targetJid = ctx.args?.[0] ? resolveGroupJid(ctx.args[0]) : ctx.jid;
        const data = getSewa(targetJid);

        if (!data) {
            return ctx.reply(
                `📋 *Status Sewa Bot*\n\n` +
                `❌ Grup ini *belum* memiliki sewa bot aktif.\n\n` +
                `> Hubungi owner untuk menyewa bot.`
            );
        }

        const aktif = isSewaActive(targetJid);
        const sisa  = sisaWaktu(data.selesai);

        await ctx.reply(
            `📋 *Status Sewa Bot*\n\n` +
            `${aktif ? '✅ *AKTIF*' : '⛔ *SUDAH HABIS*'}\n\n` +
            `🏘️ Grup    : \`${targetJid}\`\n` +
            `📅 Mulai   : ${fmtTgl(data.mulai)}\n` +
            `📅 Selesai : ${fmtTgl(data.selesai)}\n` +
            `⏱️ Durasi  : ${data.durasi}\n` +
            `⌛ Sisa    : *${sisa}*\n` +
            `${data.diperpanjang > 0 ? `🔄 Diperpanjang: ${data.diperpanjang}x\n` : ''}` +
            `${data.catatan ? `📝 Catatan: ${data.catatan}\n` : ''}`
        );
    },

    // ── .delsewa ──────────────────────────────────────────────────
    async delsewa(ctx, sock) {
        if (!ctx.isOwner) return ctx.reply('❌ Hanya *Owner/Creator* yang bisa menghapus sewa.');

        const targetJid = ctx.args?.[0] ? resolveGroupJid(ctx.args[0]) : ctx.jid;
        if (!targetJid) return ctx.reply(`📌 Cara: \`${P}delsewa [link/jid]\` atau jalankan di grup.`);

        const deleted = delSewa(targetJid);
        if (!deleted) return ctx.reply(`❌ Tidak ada data sewa untuk grup \`${targetJid}\`.`);

        // Keluar dari grup kalau bot ada di sana
        try {
            await sock?.sendMessage(targetJid, {
                text: '⚠️ Sewa bot untuk grup ini telah dihapus oleh owner. Bot akan keluar. Terima kasih!'
            });
            await new Promise(r => setTimeout(r, 2000));
            await sock?.groupLeave(targetJid).catch(() => {});
        } catch { /* abaikan kalau tidak di grup */ }

        await ctx.reply(`✅ Sewa grup \`${targetJid}\` berhasil dihapus dan bot telah keluar dari grup tersebut.`);
    },

    // ── .listsewa ─────────────────────────────────────────────────
    async listsewa(ctx) {
        if (!ctx.isOwner) return ctx.reply('❌ Hanya *Owner/Creator* yang bisa melihat daftar sewa.');

        const list = listSewa(false); // semua, termasuk expired
        if (list.length === 0) return ctx.reply('📋 Belum ada data sewa.');

        const active  = list.filter(s => isSewaActive(s.jid));
        const expired = list.filter(s => !isSewaActive(s.jid));

        const fmt = (s) =>
            `• \`${s.jid.split('@')[0]}\` — ${s.durasi} — ⌛ ${sisaWaktu(s.selesai)}`;

        let msg = `📋 *DAFTAR SEWA BOT*\n\n`;
        if (active.length)  msg += `✅ *Aktif (${active.length}):*\n${active.map(fmt).join('\n')}\n\n`;
        if (expired.length) msg += `⛔ *Expired (${expired.length}):*\n${expired.map(fmt).join('\n')}`;

        await ctx.reply(msg);
    },

    // ── .extsewa (perpanjang) ─────────────────────────────────────
    async extsewa(ctx) {
        if (!ctx.isOwner) return ctx.reply('❌ Hanya *Owner/Creator* yang bisa perpanjang sewa.');

        const { args, jid, isGroup } = ctx;
        if (args.length === 0) {
            return ctx.reply(`📌 Cara: \`${P}extsewa [link] [durasi]\` atau \`${P}extsewa 7hari\` di grup.`);
        }

        let targetJid = null, durasiStr = null;
        if (isGroup && args.length === 1 && parseDurasi(args[0])) {
            targetJid = jid; durasiStr = args[0];
        } else {
            targetJid = resolveGroupJid(args[0]);
            durasiStr = args.slice(1).join('');
        }
        if (!targetJid || !durasiStr) return ctx.reply('❌ Format tidak lengkap.');

        const existing = getSewa(targetJid);
        if (!existing) return ctx.reply(`❌ Grup ini belum punya sewa aktif. Gunakan \`${P}sewa\` terlebih dahulu.`);

        const result = addSewa(targetJid, { penyewaJid: ctx.sender, durasi: durasiStr });
        if (!result.ok) return ctx.reply(`❌ ${result.reason}`);

        await ctx.reply(
            `🔄 *Sewa Diperpanjang*\n\n` +
            `⏱️ Ditambah: *+${result.label}*\n` +
            `📅 Selesai baru: *${fmtTgl(result.selesaiTs)}*\n` +
            `⌛ Sisa: *${sisaWaktu(result.selesaiTs)}*`
        );
    },

    // ── .hargasewa ────────────────────────────────────────────────
    async hargasewa(ctx) {
        const harga = getHargaSewa();

        await ctx.reply(
            `💰 *HARGA SEWA BOT*\n` +
            `━━━━━━━━━━━━━━━━\n\n` +
            `${harga ? `${harga}\n\n` : ''}` +
            `⏱️ *Durasi BEBAS* — mau 10 detik atau 10 tahun, semua bisa!\n\n` +
            `*Format durasi:*\n` +
            `┣ \`10detik\` / \`30s\`\n` +
            `┣ \`5menit\` / \`30min\`\n` +
            `┣ \`1jam\` / \`6h\`\n` +
            `┣ \`1hari\` / \`7hari\` / \`30hari\`\n` +
            `┣ \`1minggu\` / \`2minggu\`\n` +
            `┣ \`1bulan\` / \`3bulan\`\n` +
            `┣ \`1tahun\`\n` +
            `┗ \`selamanya\` / \`permanent\`\n\n` +
            `*Contoh:*\n` +
            `\`${P}sewa 30menit\`\n` +
            `\`${P}sewa 7hari\`\n` +
            `\`${P}sewa selamanya\`\n\n` +
            `📞 Hubungi owner untuk info harga & pembayaran.\n\n` +
            `> Ketik \`${P}ceksewa\` untuk cek status sewa grupmu.`
        );
    },

    // ── .gantihargasewa ─────────────────────────────────────────────
    // Owner mengatur teks harga yang tampil di .hargasewa.
    // Penggunaan: .gantihargasewa <teks harga baru>
    async gantihargasewa(ctx) {
        if (!ctx.isOwner) {
            return ctx.reply('❌ Hanya *Owner/Creator* yang bisa mengubah harga sewa.');
        }

        const teks = ctx.args?.join(' ').trim();
        const current = getHargaSewa();

        if (!teks) {
            return ctx.reply(
                `📌 *Ubah Harga Sewa*\n\n` +
                `Harga saat ini:\n${current ? current : '_(belum diatur)_'}\n\n` +
                `*Cara pakai:*\n` +
                `\`${P}gantihargasewa <teks harga baru>\`\n\n` +
                `*Contoh:*\n` +
                `\`${P}gantihargasewa 7 Hari: Rp10.000 | 30 Hari: Rp30.000 | Selamanya: Rp100.000\`\n\n` +
                `> Kirim \`-\` sebagai teks untuk mengosongkan kembali harga.`
            );
        }

        setHargaSewa(teks === '-' ? '' : teks);

        await ctx.reply(
            teks === '-'
                ? `✅ Harga sewa berhasil dikosongkan.\n\n> Ketik \`${P}hargasewa\` untuk lihat tampilannya.`
                : `✅ *Harga Sewa Diperbarui*\n\n${teks}\n\n> Ketik \`${P}hargasewa\` untuk lihat tampilannya.`
        );
    },

    // ── .sewamode on/off ──────────────────────────────────────────
    // Kalau ON: hanya grup bersewa yang bisa pakai bot
    async sewamode(ctx) {
        if (!ctx.isOwner) return ctx.reply('❌ Hanya *Owner/Creator* yang bisa mengatur sewa mode.');
        const arg = (ctx.args?.[0] || '').toLowerCase();
        if (!['on', 'off'].includes(arg)) {
            return ctx.reply(
                `📌 *Sewa Mode*\n\n` +
                `Status: *${isSewaMode() ? '✅ ON' : '❌ OFF'}*\n\n` +
                `• ON = hanya grup bersewa yang bisa pakai bot\n` +
                `• OFF = semua grup bisa pakai (mode bebas)\n\n` +
                `\`${P}sewamode on\` / \`${P}sewamode off\``
            );
        }
        const val = arg === 'on';
        setSewaMode(val);
        await ctx.reply(
            val
                ? `✅ *Sewa Mode ON* — bot sekarang hanya aktif di grup yang bersewa.`
                : `❌ *Sewa Mode OFF* — bot aktif di semua grup.`
        );
    },
};
