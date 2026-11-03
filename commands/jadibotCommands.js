// ═══════════════════════════════════════════════════════════════════
//  JADIBOT COMMANDS — Sub-Bot Management System
//  Developer: AHSAN (03107260507)
// ═══════════════════════════════════════════════════════════════════

import {
    startChildBot,
    stopChildBot,
    isAlreadyChildBot,
    countActiveChildBots,
    listChildBotNumbers,
    getChildBotStatus,
} from '../lib/childBot.js';
import { log } from '../lib/logger.js';
import { resolveSenderJid } from '../lib/utils.js';

function extractTargetNumber(msg, args) {
    if (args && args[0]) {
        const clean = args[0].replace(/[^0-9]/g, '');
        if (clean.length >= 10 && clean.length <= 15) return clean;
    }
    const sender = resolveSenderJid(msg);
    return sender.split('@')[0].replace(/[^0-9]/g, '');
}

export const jadibotCommands = {
    async jadibot(sock, msg, args, reply, mainHandleMessage) {
        const number = extractTargetNumber(msg, args);

        if (!number || number.length < 10) {
            return reply(
                `📱 *PAIR AS SUB-BOT (JADIBOT)*\n\n` +
                `How to use:\n` +
                `• *.jadibot* — Use your own WhatsApp number\n` +
                `• *.jadibot 923001234567* — Specify target number\n\n` +
                `> Code will be generated and sent directly to your chat.`
            );
        }

        if (isAlreadyChildBot(number)) {
            return reply(`⚠️ Number +${number} already has an active sub-bot session!\nTo disconnect, type: *.stopbot*`);
        }

        const activeCount = countActiveChildBots();
        if (activeCount >= 20) {
            return reply(`⚠️ Maximum limit of 20 active sub-bots reached. Please try again later.`);
        }

        await reply(
            `⏳ Requesting 8-digit pairing code for *+${number}*...\n` +
            `Please wait 5-10 seconds.`
        );

        let codeSent = false;

        try {
            await startChildBot(number, {
                onPairingCode: async (code) => {
                    codeSent = true;
                    await reply(
                        `╔══════════════════════════════════╗\n` +
                        `║     🔑 MASTER MD PAIRING CODE    ║\n` +
                        `╚══════════════════════════════════╝\n\n` +
                        `Target: *+${number}*\n` +
                        `Your Code: *${code}*\n\n` +
                        `📲 *How to link:*\n` +
                        `1. Open WhatsApp ➡️ Settings ⚙️ ➡️ Linked Devices\n` +
                        `2. Tap Link a Device ➡️ Link with phone number instead\n` +
                        `3. Enter the 8-digit code shown above.\n\n` +
                        `⏱️ Code is valid for 2 minutes!`
                    );
                },
                onStatus: async (status, reason) => {
                    if (status === 'connected') {
                        await reply(`🎉 *+${number}* successfully connected as a MASTER MD sub-bot!`);
                    } else if (status === 'error' || status === 'loggedout') {
                        await reply(`⚠️ Sub-bot +${number} disconnected: ${reason || 'Session ended'}`);
                    }
                },
                mainHandleMessage,
            });
        } catch (err) {
            log.error(`jadibot command error: ${err.message}`);
            if (!codeSent) {
                await reply(`❌ Failed to start sub-bot session: ${err.message}`);
            }
        }
    },

    async stopbot(msg, args, reply, isOwner) {
        const number = extractTargetNumber(msg, args);
        const senderNumber = resolveSenderJid(msg).split('@')[0].replace(/[^0-9]/g, '');

        if (!isOwner && number !== senderNumber) {
            return reply('❌ You can only disconnect your own sub-bot session.');
        }

        const stopped = await stopChildBot(number, true);
        await reply(stopped
            ? `✅ Sub-bot +${number} was stopped and session cleaned.`
            : `ℹ️ No active sub-bot session found for +${number}.`
        );
    },

    async listJadibot(reply, isOwner) {
        if (!isOwner) return reply('❌ This command is restricted to Bot Owners.');
        const numbers = listChildBotNumbers();
        if (!numbers.length) return reply('📋 No active sub-bots running at the moment.');

        const lines = numbers.map(n => {
            const s = getChildBotStatus(n);
            const uptime = s?.startedAt ? Math.floor((Date.now() - s.startedAt) / 60000) : '?';
            return `• +${n} — ${s?.status || '?'} (${uptime} mins)`;
        }).join('\n');
        return reply(`📋 *ACTIVE MASTER MD SUB-BOTS* (${numbers.length}/20):\n\n${lines}`);
    },
};
