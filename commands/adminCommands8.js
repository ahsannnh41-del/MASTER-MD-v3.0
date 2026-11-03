// ═══════════════════════════════════════════════════════════════════
//  ADMIN COMMANDS 8 — tambahan fitur admin baru (v3.2.2)
// ═══════════════════════════════════════════════════════════════════
//  - votekick        : member biasa bisa gotong-royong vote buat keluarin
//                       satu orang tanpa perlu admin (butuh 3 vote unik).
//  - setmotd / motd   : "message of the day" grup — beda dari welcome/
//                       farewell karena bisa dipanggil kapan saja (bukan
//                       cuma pas ada yang join/keluar).
//  - pollclose        : tutup polling yang masih aktif lebih cepat &
//                       langsung tampilkan hasil akhir, tanpa perlu
//                       nunggu member berhenti vote sendiri.
// ═══════════════════════════════════════════════════════════════════

import { store, save } from '../lib/db.js';

// ─── VOTEKICK ───────────────────────────────────────────────────────────
const voteKickSessions = new Map(); // jid -> Map(targetJid -> Set(voterJid))
const VOTEKICK_THRESHOLD = 3;

export async function votekick(ctx) {
    if (!ctx.isGroup) return ctx.reply('❌ Command ini cuma bisa dipakai di grup.');
    const target = ctx.mentioned?.[0];
    if (!target) {
        return ctx.reply(`📌 Cara pakai: *.votekick @user*\nButuh ${VOTEKICK_THRESHOLD} vote dari member berbeda buat keluarin seseorang, tanpa perlu admin.`);
    }
    if (target === ctx.sender) return ctx.reply('❌ Nggak bisa vote-kick diri sendiri.');

    try {
        const meta = await ctx.sock.groupMetadata(ctx.jid);
        const p = meta.participants.find((x) => x.id === target);
        if (p?.admin) return ctx.reply('❌ Nggak bisa vote-kick sesama admin grup.');
    } catch { /* kalau metadata gagal, tetap lanjut — biar tidak nge-block fitur */ }

    if (!voteKickSessions.has(ctx.jid)) voteKickSessions.set(ctx.jid, new Map());
    const groupSessions = voteKickSessions.get(ctx.jid);
    if (!groupSessions.has(target)) groupSessions.set(target, new Set());
    const voters = groupSessions.get(target);
    const targetNum = target.split('@')[0];

    if (voters.has(ctx.sender)) {
        return ctx.reply(`ℹ️ Kamu sudah vote buat @${targetNum}. Progress: ${voters.size}/${VOTEKICK_THRESHOLD}`);
    }
    voters.add(ctx.sender);

    if (voters.size >= VOTEKICK_THRESHOLD) {
        groupSessions.delete(target);
        try {
            await ctx.sock.groupParticipantsUpdate(ctx.jid, [target], 'remove');
            await ctx.reply(`👢 *VOTE-KICK BERHASIL!*\n\n@${targetNum} dikeluarkan setelah mencapai ${VOTEKICK_THRESHOLD} vote dari member berbeda.`);
        } catch {
            await ctx.reply('❌ Vote sudah cukup, tapi bot gagal mengeluarkan member (kemungkinan bot bukan admin grup).');
        }
    } else {
        await ctx.reply(`🗳️ Vote-kick buat @${targetNum} tercatat! (${voters.size}/${VOTEKICK_THRESHOLD})\nMember lain yang setuju, ketik *.votekick @${targetNum}* juga.`);
    }
}

// ─── MESSAGE OF THE DAY ─────────────────────────────────────────────────
function motdStore() { return store('groupMotd', {}); }

export async function setMotd(ctx) {
    if (!ctx.isAdmin) return ctx.reply('❌ Khusus Admin grup.');
    const text = ctx.args.join(' ');
    if (!text) return ctx.reply('📌 Cara pakai: *.setmotd [teks]*\nContoh: .setmotd Jangan lupa baca rules sebelum posting jualan!');
    const data = motdStore();
    data[ctx.jid] = { text, setBy: ctx.sender, setAt: Date.now() };
    save('groupMotd');
    await ctx.reply('✅ MOTD (pesan hari ini) grup berhasil diatur. Cek kapan saja lewat *.motd*.');
}

export async function showMotd(ctx) {
    const entry = motdStore()[ctx.jid];
    if (!entry) return ctx.reply('ℹ️ Belum ada MOTD yang diatur untuk grup ini.\nAdmin bisa atur lewat `.setmotd [teks]`.');
    await ctx.reply(`📌 *MESSAGE OF THE DAY*\n\n${entry.text}`);
}

// ─── POLL CLOSE ─────────────────────────────────────────────────────────
function pollStore() { return store('groupPolls', {}); }

export async function pollClose(ctx) {
    if (!ctx.isAdmin) return ctx.reply('❌ Khusus Admin grup.');
    const pollId = parseInt(ctx.args[0], 10);
    const polls = pollStore()[ctx.jid] || [];
    const poll = pollId ? polls.find((p) => p.id === pollId) : polls[polls.length - 1];
    if (!poll) return ctx.reply('❌ Polling tidak ditemukan. Cek ID-nya lewat `.listpoll` dulu.');
    if (poll.closed) return ctx.reply(`ℹ️ Polling #${poll.id} sudah ditutup sebelumnya.`);

    const tally = new Array(poll.options.length).fill(0);
    for (const choice of Object.values(poll.votes || {})) {
        if (choice >= 1 && choice <= tally.length) tally[choice - 1]++;
    }
    const totalVotes = tally.reduce((a, b) => a + b, 0);
    const lines = poll.options.map((opt, i) => `${i + 1}. ${opt} — ${tally[i]} vote`);
    const maxVotes = Math.max(...tally);
    const winners = maxVotes > 0 ? poll.options.filter((_, i) => tally[i] === maxVotes) : [];

    poll.closed = true;
    save('groupPolls');

    await ctx.reply(
        `🔒 *POLLING #${poll.id} DITUTUP*\n\n*${poll.question}*\n\n${lines.join('\n')}\n\n` +
        `Total vote: ${totalVotes}` +
        (winners.length ? `\n🏆 Pemenang: *${winners.join(', ')}*` : '\n_(belum ada yang vote)_'),
    );
}
