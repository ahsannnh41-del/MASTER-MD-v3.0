/**
 * commands/interactiveGames.js — Interactive Games Engine for MASTER MD
 * Developed by AHSAN (03107260507) • Version 3.0.0
 * Includes: Tic-Tac-Toe (X-O), Casino Slot Machine, Snake Game, Dino Game, Car Racing
 * 100% English, Native Buttons & Fallback delivery with zero clock icons!
 */

import { sendButton } from '../lib/interactiveButtons.js';

// ─── 1. TIC-TAC-TOE (X-O) ───────────────────────────────────────────────────
const activeXOGames = new Map();

function renderBoard(board) {
    const symbols = { 'X': '❌', 'O': '⭕', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣' };
    return (
        `${symbols[board[0]]} ┃ ${symbols[board[1]]} ┃ ${symbols[board[2]]}\n` +
        `━━━╋━━━╋━━━\n` +
        `${symbols[board[3]]} ┃ ${symbols[board[4]]} ┃ ${symbols[board[5]]}\n` +
        `━━━╋━━━╋━━━\n` +
        `${symbols[board[6]]} ┃ ${symbols[board[7]]} ┃ ${symbols[board[8]]}`
    );
}

function checkWinner(b) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (const [x, y, z] of lines) {
        if (b[x] && b[x] === b[y] && b[x] === b[z]) return b[x];
    }
    if (b.every(c => c === 'X' || c === 'O')) return 'tie';
    return null;
}

export async function handleTicTacToe(ctx) {
    const { sock, jid, sender, args, reply, msg } = ctx;
    const gameKey = jid;
    let game = activeXOGames.get(gameKey);

    const input = (args[0] || '').toLowerCase();

    if (input === 'surrender' || input === 'quit' || input === 'stop') {
        if (!game) return reply('❌ There is no active Tic-Tac-Toe game in this chat.');
        activeXOGames.delete(gameKey);
        return reply('🏁 The game has been cancelled.');
    }

    // Start a new game
    if (!game || input === 'start' || input === 'new') {
        game = {
            board: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
            playerX: sender,
            playerO: null,
            turn: 'X',
            startTime: Date.now()
        };
        activeXOGames.set(gameKey, game);

        const text =
`🎮 *TIC-TAC-TOE (X-O) CHALLENGE* 🎮
━━━━━━━━━━━━━━━━━━━━━━
${renderBoard(game.board)}
━━━━━━━━━━━━━━━━━━━━━━
👤 *Player 1 (X):* @${sender.split('@')[0]}
Waiting for Player 2 (O) to make a move!

💡 *How to Play:*
Type \`.xo <1-9>\` to choose a slot (e.g. \`.xo 5\`).
Type \`.xo quit\` to cancel.`;

        const buttons = [
            { name: 'quick_reply', display_text: '🎯 Play Center (5)', id: '.xo 5' },
            { name: 'quick_reply', display_text: '❌ Quit Game', id: '.xo quit' }
        ];

        return await sendButton(sock, jid, {
            text,
            title: '🎮 TIC-TAC-TOE — MASTER MD',
            footer: 'Developed by AHSAN (03107260507)',
            buttons,
            quoted: msg
        });
    }

    // Make a move
    const cell = parseInt(input);
    if (isNaN(cell) || cell < 1 || cell > 9) {
        return reply('❌ Invalid move! Choose a number from 1 to 9 (e.g. `.xo 5`).');
    }

    const idx = cell - 1;
    if (game.board[idx] === 'X' || game.board[idx] === 'O') {
        return reply('❌ That cell is already occupied! Choose another number.');
    }

    // Assign Player O on first move by opponent
    if (!game.playerO && sender !== game.playerX) {
        game.playerO = sender;
    }

    const currentTurnPlayer = game.turn === 'X' ? game.playerX : (game.playerO || 'Anyone');
    if (game.turn === 'X' && sender !== game.playerX) {
        return reply(`⏳ It is Player X's (@${game.playerX.split('@')[0]}) turn!`);
    }
    if (game.turn === 'O' && game.playerO && sender !== game.playerO) {
        return reply(`⏳ It is Player O's (@${game.playerO.split('@')[0]}) turn!`);
    }

    game.board[idx] = game.turn;

    const winner = checkWinner(game.board);
    if (winner) {
        activeXOGames.delete(gameKey);
        let resultText = '';
        if (winner === 'tie') {
            resultText = `🤝 *It's a TIE!* Well played both sides!`;
        } else {
            const winnerJid = winner === 'X' ? game.playerX : game.playerO;
            resultText = `🎉 *VICTORY!* Congratulations to @${winnerJid ? winnerJid.split('@')[0] : 'Player'} (${winner}) for winning!`;
        }

        const finalText =
`🎮 *TIC-TAC-TOE RESULT* 🎮
━━━━━━━━━━━━━━━━━━━━━━
${renderBoard(game.board)}
━━━━━━━━━━━━━━━━━━━━━━
${resultText}

⚡ Powered by MASTER MD • Dev: AHSAN`;

        const replayButtons = [
            { name: 'quick_reply', display_text: '🔄 Play Again', id: '.xo start' }
        ];

        return await sendButton(sock, jid, {
            text: finalText,
            title: '🏆 GAME FINISHED',
            footer: 'Developed by AHSAN (03107260507)',
            buttons: replayButtons,
            quoted: msg
        });
    }

    // Switch turns
    game.turn = game.turn === 'X' ? 'O' : 'X';
    const nextPlayerJid = game.turn === 'X' ? game.playerX : (game.playerO || 'Open (Anyone can join as O)');

    const moveText =
`🎮 *TIC-TAC-TOE* 🎮
━━━━━━━━━━━━━━━━━━━━━━
${renderBoard(game.board)}
━━━━━━━━━━━━━━━━━━━━━━
👉 Next Turn: *${game.turn}* (${nextPlayerJid.includes('@') ? '@' + nextPlayerJid.split('@')[0] : nextPlayerJid})
💡 Type \`.xo <1-9>\` to choose your slot!`;

    return await sendButton(sock, jid, {
        text: moveText,
        title: '🎮 TIC-TAC-TOE — MASTER MD',
        footer: 'Developed by AHSAN (03107260507)',
        buttons: [{ name: 'quick_reply', display_text: '❌ Quit Game', id: '.xo quit' }],
        quoted: msg
    });
}

// ─── 2. CASINO SLOTS MACHINE ────────────────────────────────────────────────
export async function handleSlots(ctx) {
    const { sock, jid, reply, msg } = ctx;
    const fruits = ['🍒', '🍋', '🍇', '🍉', '🔔', '💎', '7️⃣'];

    const reel1 = fruits[Math.floor(Math.random() * fruits.length)];
    const reel2 = fruits[Math.floor(Math.random() * fruits.length)];
    const reel3 = fruits[Math.floor(Math.random() * fruits.length)];

    let outcome = '';
    let isJackpot = false;

    if (reel1 === reel2 && reel2 === reel3) {
        if (reel1 === '7️⃣' || reel1 === '💎') {
            outcome = '💥 **JACKPOT MEGA WIN!** You hit 3 Ultra-Rares! 💎💎💎';
        } else {
            outcome = '🎉 **BIG WINNER!** Three of a kind! 💰💰';
        }
        isJackpot = true;
    } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
        outcome = '✨ **NICE MATCH!** Two symbols lined up! 🪙';
    } else {
        outcome = '😢 **No match!** Spin again to test your luck! 🍀';
    }

    const text =
`🎰 *MASTER MD CASINO SLOTS* 🎰
━━━━━━━━━━━━━━━━━━━━━━
       [ ${reel1} ┃ ${reel2} ┃ ${reel3} ]
━━━━━━━━━━━━━━━━━━━━━━
${outcome}

👑 Developer: AHSAN (03107260507)
⚡ Powered by: MASTER MD v3.0.0`;

    const buttons = [
        { name: 'quick_reply', display_text: '🎰 Spin Again', id: '.slots' },
        { name: 'quick_reply', display_text: '🔙 Main Menu', id: '.menu' }
    ];

    return await sendButton(sock, jid, {
        text,
        title: '🎰 CASINO SLOTS 🎰',
        footer: 'MASTER MD • Developed by AHSAN',
        buttons,
        quoted: msg
    });
}

// ─── 3. DINO RUNNER GAME ────────────────────────────────────────────────────
export async function handleDino(ctx) {
    const { sock, jid, args, msg } = ctx;
    const action = (args[0] || '').toLowerCase();

    let state = '';
    if (action === 'jump') {
        state = '🦖💨\n\n      🌵     🌵';
    } else if (action === 'duck') {
        state = '     🦅\n🦕\n     🌵';
    } else {
        state = '🦖\n\n   🌵     🌵      🌴';
    }

    const score = Math.floor(Math.random() * 850) + 150;
    const text =
`🦖 *DINO RUNNER RETRO* 🦖
━━━━━━━━━━━━━━━━━━━━━━
${state}
━━━━━━━━━━━━━━━━━━━━━━
🏆 Score: *${score} pts*
Status: *RUNNING FAST!*

💡 Tap Jump or Duck to dodge incoming obstacles!`;

    const buttons = [
        { name: 'quick_reply', display_text: '🦘 Jump Over Cactus', id: '.dino jump' },
        { name: 'quick_reply', display_text: '🦆 Duck Under Pterodactyl', id: '.dino duck' },
        { name: 'quick_reply', display_text: '🏃 Keep Running', id: '.dino run' }
    ];

    return await sendButton(sock, jid, {
        text,
        title: '🦖 RETRO DINO JUMP 🦖',
        footer: 'MASTER MD • Dev: AHSAN (03107260507)',
        buttons,
        quoted: msg
    });
}

// ─── 4. CAR RACING GAME ─────────────────────────────────────────────────────
export async function handleCarRace(ctx) {
    const { sock, jid, args, msg } = ctx;
    const lane = (args[0] || 'mid').toLowerCase();

    let track = '';
    if (lane === 'left') {
        track = `| 🏎️ | 🚗 |    |\n|    | 🚙 | 🚛 |\n|    |    | 🚓 |`;
    } else if (lane === 'right') {
        track = `|    | 🚗 | 🏎️ |\n| 🚙 | 🚛 |    |\n| 🚓 |    |    |`;
    } else {
        track = `|    | 🏎️ |    |\n| 🚗 |    | 🚛 |\n|    | 🚙 | 🚓 |`;
    }

    const speed = Math.floor(Math.random() * 80) + 180;
    const text =
`🏎️ *HIGH-SPEED TURBO HIGHWAY* 🏎️
━━━━━━━━━━━━━━━━━━━━━━
${track}
━━━━━━━━━━━━━━━━━━━━━━
⚡ Current Speed: *${speed} KM/H*
Status: *CLEAN OVERTAKE!*

Switch lanes to avoid crashing into traffic!`;

    const buttons = [
        { name: 'quick_reply', display_text: '⬅️ Steer Left', id: '.race left' },
        { name: 'quick_reply', display_text: '⬆️ Boost Straight', id: '.race mid' },
        { name: 'quick_reply', display_text: '➡️ Steer Right', id: '.race right' }
    ];

    return await sendButton(sock, jid, {
        text,
        title: '🏎️ TURBO CAR RACING 🏎️',
        footer: 'MASTER MD • Dev: AHSAN (03107260507)',
        buttons,
        quoted: msg
    });
}

// ─── 5. SNAKE GAME ──────────────────────────────────────────────────────────
export async function handleSnake(ctx) {
    const { sock, jid, args, msg } = ctx;
    const dir = (args[0] || 'right').toLowerCase();

    const grid = [
        ['⬛', '⬛', '⬛', '⬛', '⬛', '⬛', '⬛'],
        ['⬛', '🟩', '🟩', '🟩', '🟢', '⬛', '⬛'],
        ['⬛', '⬛', '⬛', '⬛', '⬛', '🍎', '⬛'],
        ['⬛', '⬛', '⬛', '⬛', '⬛', '⬛', '⬛'],
    ];

    const gridStr = grid.map(r => r.join('')).join('\n');
    const score = Math.floor(Math.random() * 25) + 5;

    const text =
`🐍 *RETRO NOSTALGIA SNAKE* 🐍
━━━━━━━━━━━━━━━━━━━━━━
${gridStr}
━━━━━━━━━━━━━━━━━━━━━━
🍎 Apples Eaten: *${score}*
Moving Direction: *${dir.toUpperCase()}*

Guide your snake to eat the golden apple without hitting the walls!`;

    const buttons = [
        { name: 'quick_reply', display_text: '⬆️ Up', id: '.snake up' },
        { name: 'quick_reply', display_text: '⬅️ Left', id: '.snake left' },
        { name: 'quick_reply', display_text: '➡️ Right', id: '.snake right' },
        { name: 'quick_reply', display_text: '⬇️ Down', id: '.snake down' }
    ];

    return await sendButton(sock, jid, {
        text,
        title: '🐍 CLASSIC SNAKE 🐍',
        footer: 'MASTER MD • Dev: AHSAN (03107260507)',
        buttons,
        quoted: msg
    });
}
