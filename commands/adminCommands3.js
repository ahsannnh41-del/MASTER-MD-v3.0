import { store, save } from '../lib/db.js';
import { jidNum, fmtDuration, parseDurationArg } from '../lib/utils.js';
import { computeSiders } from '../lib/siderTracker.js';
import { recallRealJid } from '../lib/lidMapping.js';

function isAdminCheck(isAdmin, reply) {
    if (isAdmin === undefined || isAdmin === null) {
        reply('❌ This command can only be used inside a *group*!');
        return false;
    }
    if (!isAdmin) {
        reply('❌ Only *group admins* can use this command!\n\n_Bot Owner/Creator must also be an admin in this group to run admin tools._');
        return false;
    }
    return true;
}

// Inactivity threshold (default: 3 days)
const DEFAULT_SIDER_THRESHOLD_MS = 3 * 24 * 60 * 60 * 1000;

function displayJid(jid) {
    if (jid.includes('@lid')) {
        const real = recallRealJid(jid);
        if (real) return real;
    }
    return jid;
}

function getPolls(jid) {
    const data = store('groupPolls');
    if (!data[jid]) { data[jid] = []; save('groupPolls'); }
    return data[jid];
}

export const adminCommands3 = {

    // ─── SIMPLE GROUP POLLS ──────────────────────────────────────────────────
    async createPoll(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const text = args.join(' ');
        if (!text || !text.includes('|')) {
            return reply('📌 Usage: *.poll [question] | [option1] | [option2] | ...*\nExample: .poll Favorite language? | JavaScript | Python | Rust');
        }
        const [question, ...options] = text.split('|').map(s => s.trim()).filter(Boolean);
        if (options.length < 2) return reply('❌ At least 2 options are required!');

        const polls = getPolls(jid);
        const poll = { id: polls.length + 1, question, options, votes: {}, createdAt: Date.now() };
        polls.push(poll);
        save('groupPolls');

        const optText = options.map((o, i) => `${i + 1}. ${o}`).join('\n');
        await reply(`📊 *GROUP POLL #${poll.id}*\n\n*${question}*\n\n${optText}\n\nVote using: *.vote ${poll.id} [option_number]*`);
    },

    async votePoll(reply, jid, sender, args) {
        const pollId = parseInt(args[0]);
        const choice = parseInt(args[1]);
        if (!pollId || !choice) return reply('📌 Usage: *.vote [poll_id] [option_number]*');

        const polls = getPolls(jid);
        const poll = polls.find(p => p.id === pollId);
        if (!poll) return reply('❌ Poll with that ID was not found.');
        if (choice < 1 || choice > poll.options.length) return reply(`❌ Please choose a number from 1 to ${poll.options.length}!`);

        poll.votes[sender] = choice;
        save('groupPolls');
        await reply(`✅ Your vote for *"${poll.options[choice - 1]}"* has been recorded!`);
    },

    async pollResult(reply, jid, args) {
        const pollId = parseInt(args[0]);
        if (!pollId) return reply('📌 Usage: *.pollresult [poll_id]*');

        const polls = getPolls(jid);
        const poll = polls.find(p => p.id === pollId);
        if (!poll) return reply('❌ Poll with that ID was not found.');

        const counts = poll.options.map((_, i) => Object.values(poll.votes).filter(v => v === i + 1).length);
        const total = counts.reduce((a, b) => a + b, 0) || 1;
        const lines = poll.options.map((o, i) => {
            const pct = ((counts[i] / total) * 100).toFixed(0);
            return `${o}: ${counts[i]} votes (${pct}%)`;
        });

        await reply(`📊 *POLL RESULTS #${pollId}*\n\n*${poll.question}*\n\n${lines.join('\n')}\n\nTotal voters: ${Object.keys(poll.votes).length}`);
    },

    async listPolls(reply, jid) {
        const polls = getPolls(jid);
        if (!polls.length) return reply('📋 No active polls found in this group.');
        const lines = polls.slice(-10).map(p => `#${p.id} — ${p.question}`);
        await reply(`📋 *RECENT POLLS (Last 10)*\n\n${lines.join('\n')}`);
    },

    // ─── GROUP SCHEDULES ─────────────────────────────────────────────────────
    async addSchedule(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const text = args.join(' ');
        if (!text) return reply('📌 Usage: *.addschedule [schedule/event details]*');

        const data = store('groupSchedule');
        if (!data[jid]) data[jid] = [];
        data[jid].push({ text, ts: Date.now() });
        save('groupSchedule');
        await reply(`✅ Schedule entry added (#${data[jid].length}).`);
    },

    async listSchedule(reply, jid) {
        const data = store('groupSchedule');
        const items = data[jid] || [];
        if (!items.length) return reply('📅 No schedules saved in this group.');
        const lines = items.map((it, i) => `${i + 1}. ${it.text}`);
        await reply(`📅 *GROUP SCHEDULES*\n\n${lines.join('\n')}`);
    },

    async deleteSchedule(reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const idx = parseInt(args[0]) - 1;
        const data = store('groupSchedule');
        const items = data[jid] || [];
        if (isNaN(idx) || idx < 0 || idx >= items.length) return reply('📌 Usage: *.delschedule [entry_number]*');
        items.splice(idx, 1);
        save('groupSchedule');
        await reply('✅ Schedule entry deleted successfully.');
    },

    // ─── REPORTS TO ADMINS ───────────────────────────────────────────────────
    async reportToAdmin(reply, jid, sender, args) {
        const text = args.join(' ');
        if (!text) return reply('📌 Usage: *.report [issue details]*\nYour report will be filed for group admins.');

        const data = store('groupReports');
        if (!data[jid]) data[jid] = [];
        data[jid].push({ from: sender, text, ts: Date.now() });
        save('groupReports');
        await reply('✅ Your report has been submitted. Admins can review it with *.listreports*.');
    },

    async listReports(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const data = store('groupReports');
        const items = data[jid] || [];
        if (!items.length) return reply('📋 No pending reports found.');
        const lines = items.slice(-10).map((r, i) => `${i + 1}. @${jidNum(r.from)}: ${r.text}`);
        await reply(`📋 *MEMBER REPORTS (Last 10)*\n\n${lines.join('\n')}`);
    },

    async clearReports(reply, jid, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;
        const data = store('groupReports');
        data[jid] = [];
        save('groupReports');
        await reply('✅ All member reports have been cleared.');
    },

    // ─── GROUP ACTIVITY OVERVIEW ─────────────────────────────────────────────
    async groupActivity(reply, jid) {
        const polls = getPolls(jid);
        const schedules = store('groupSchedule')[jid] || [];
        const reports = store('groupReports')[jid] || [];
        await reply(
`📈 *GROUP ACTIVITY DASHBOARD*

📊 Total Polls: ${polls.length}
📅 Active Schedules: ${schedules.length}
📋 Pending Reports: ${reports.length}`
        );
    },

    // ─── INACTIVE MEMBERS (SIDER) TRACKER ────────────────────────────────────
    async checkSider(sock, reply, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;

        let thresholdMs = DEFAULT_SIDER_THRESHOLD_MS;
        if (args[0]) {
            const parsed = parseDurationArg(args[0], 'd');
            if (!parsed) return reply('📌 Invalid duration format. Example: *.sider 7d* or *.sider 12h*.');
            thresholdMs = parsed;
        }

        let metadata;
        try {
            metadata = await sock.groupMetadata(jid);
        } catch {
            return reply('❌ Failed to fetch group members. Please try again.');
        }

        const siders = computeSiders(jid, metadata.participants, thresholdMs, true);
        if (!siders.length) {
            return reply(`✅ No inactive members detected *(threshold: ${fmtDuration(thresholdMs)})*.\nAll non-admin members have chatted recently.`);
        }

        const lines = siders.map((s, i) => {
            const status = s.idleMs === null
                ? 'never sent a message'
                : `last active ${fmtDuration(s.idleMs)} ago`;
            return `${i + 1}. @${jidNum(displayJid(s.id))} — _${status}_`;
        });

        await sock.sendMessage(jid, {
            text:
`👀 *INACTIVE MEMBERS (SIDERS)*
━━━━━━━━━━━━━━━━━━
Inactivity threshold : *${fmtDuration(thresholdMs)}*
Detected members     : *${siders.length} members*
━━━━━━━━━━━━━━━━━━
${lines.join('\n')}
━━━━━━━━━━━━━━━━━━
💡 Group admins are excluded from inactivity checks.
👉 Type *.kicksider* to remove all detected inactive members.`,
            mentions: siders.map(s => s.id),
        });
    },

    // ─── KICK INACTIVE MEMBERS ───────────────────────────────────────────────
    async kickSider(sock, reply, msg, jid, args, isAdmin) {
        if (!isAdminCheck(isAdmin, reply)) return;

        let thresholdMs = DEFAULT_SIDER_THRESHOLD_MS;
        if (args[0]) {
            const parsed = parseDurationArg(args[0], 'd');
            if (!parsed) return reply('📌 Invalid duration format. Example: *.kicksider 7d*.');
            thresholdMs = parsed;
        }

        let metadata;
        try {
            metadata = await sock.groupMetadata(jid);
        } catch {
            return reply('❌ Failed to fetch group members. Please try again.');
        }

        const siders = computeSiders(jid, metadata.participants, thresholdMs, true);
        if (!siders.length) {
            return reply(`✅ No inactive members found to remove *(threshold: ${fmtDuration(thresholdMs)})*.`);
        }

        await reply(`🔎 Found *${siders.length}* inactive members. Starting removal process...`);

        const results = [];
        for (const s of siders) {
            try {
                await sock.groupParticipantsUpdate(jid, [s.id], 'remove');
                results.push(`👢 @${jidNum(displayJid(s.id))} — removed`);
            } catch {
                results.push(`❌ @${jidNum(displayJid(s.id))} — failed to remove`);
            }
        }

        await sock.sendMessage(jid, {
            text: `✅ *INACTIVE MEMBER REMOVAL COMPLETED*\n━━━━━━━━━━━━━━━━━━\n${results.join('\n')}`,
            mentions: siders.map(s => s.id),
        }, { quoted: msg });
    },
};
