// ═══════════════════════════════════════════════════════════════════
//  ADMIN COMMANDS 8 — Votekick, MOTD, and Poll Controls
//  Developer: AHSAN (03107260507)
// ═══════════════════════════════════════════════════════════════════

import { store, save } from '../lib/db.js';

// ─── VOTEKICK ───────────────────────────────────────────────────────────
const voteKickSessions = new Map();
const VOTEKICK_THRESHOLD = 3;

export async function votekick(ctx) {
    if (!ctx.isGroup) return ctx.reply('❌ This command can only be used in groups.');
    const target = ctx.mentioned?.[0];
    if (!target) {
        return ctx.reply(`📌 Usage: *.votekick @user*\nRequires ${VOTEKICK_THRESHOLD} votes from different members to remove someone democratically.`);
    }
    if (target === ctx.sender) return ctx.reply('❌ You cannot vote-kick yourself.');

    try {
        const meta = await ctx.sock.groupMetadata(ctx.jid);
        const p = meta.participants.find((x) => x.id === target);
        if (p?.admin) return ctx.reply('❌ Cannot vote-kick group admins.');
    } catch { /* proceed if metadata unavailable */ }

    if (!voteKickSessions.has(ctx.jid)) voteKickSessions.set(ctx.jid, new Map());
    const groupSessions = voteKickSessions.get(ctx.jid);
    if (!groupSessions.has(target)) groupSessions.set(target, new Set());
    const voters = groupSessions.get(target);
    const targetNum = target.split('@')[0];

    if (voters.has(ctx.sender)) {
        return ctx.reply(`ℹ️ You already voted to kick @${targetNum}. Progress: ${voters.size}/${VOTEKICK_THRESHOLD}`);
    }
    voters.add(ctx.sender);

    if (voters.size >= VOTEKICK_THRESHOLD) {
        groupSessions.delete(target);
        try {
            await ctx.sock.groupParticipantsUpdate(ctx.jid, [target], 'remove');
            await ctx.reply(`👢 *VOTE-KICK SUCCESSFUL!*\n\n@${targetNum} was removed after reaching ${VOTEKICK_THRESHOLD} votes from members.`);
        } catch {
            await ctx.reply('❌ Vote threshold reached, but failed to remove member (ensure bot is a group admin).');
        }
    } else {
        await ctx.reply(`🗳️ Vote-kick recorded for @${targetNum}! (${voters.size}/${VOTEKICK_THRESHOLD})\nOther members who agree, type *.votekick @${targetNum}*.`);
    }
}

// ─── MESSAGE OF THE DAY ─────────────────────────────────────────────────
function motdStore() { return store('groupMotd', {}); }

export async function setMotd(ctx) {
    if (!ctx.isAdmin) return ctx.reply('❌ Group Admins only.');
    const text = ctx.args.join(' ');
    if (!text) return ctx.reply('📌 Usage: *.setmotd [message]*\nExample: .setmotd Welcome to the official community group!');
    const data = motdStore();
    data[ctx.jid] = { text, setBy: ctx.sender, setAt: Date.now() };
    save('groupMotd');
    await ctx.reply('✅ Group MOTD (Message of the Day) set successfully. View anytime with *.motd*.');
}

export async function showMotd(ctx) {
    const entry = motdStore()[ctx.jid];
    if (!entry) return ctx.reply('ℹ️ No MOTD configured for this group yet.\nAdmins can set one with `.setmotd [text]`.');
    await ctx.reply(`📌 *MESSAGE OF THE DAY*\n\n${entry.text}`);
}

// ─── POLL CLOSE ─────────────────────────────────────────────────────────
function pollStore() { return store('groupPolls', {}); }

export async function pollClose(ctx) {
    if (!ctx.isAdmin) return ctx.reply('❌ Group Admins only.');
    const pollId = parseInt(ctx.args[0], 10);
    const polls = pollStore()[ctx.jid] || [];
    const poll = pollId ? polls.find((p) => p.id === pollId) : polls[polls.length - 1];
    if (!poll) return ctx.reply('❌ Poll not found. Check active IDs via `.listpoll`.');
    if (poll.closed) return ctx.reply(`ℹ️ Poll #${poll.id} has already been closed.`);

    const tally = new Array(poll.options.length).fill(0);
    for (const choice of Object.values(poll.votes || {})) {
        if (choice >= 1 && choice <= tally.length) tally[choice - 1]++;
    }
    const totalVotes = tally.reduce((a, b) => a + b, 0);
    const lines = poll.options.map((opt, i) => `${i + 1}. ${opt} — ${tally[i]} votes`);
    const maxVotes = Math.max(...tally);
    const winners = maxVotes > 0 ? poll.options.filter((_, i) => tally[i] === maxVotes) : [];

    poll.closed = true;
    save('groupPolls');

    await ctx.reply(
        `🔒 *POLL #${poll.id} CLOSED*\n\n*${poll.question}*\n\n${lines.join('\n')}\n\n` +
        `Total votes: ${totalVotes}` +
        (winners.length ? `\n🏆 Winner(s): *${winners.join(', ')}*` : '\n_(No votes recorded)_'),
    );
}
