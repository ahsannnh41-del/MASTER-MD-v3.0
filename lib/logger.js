// ═══════════════════════════════════════════════════════════════════
//  LOGGER.JS — Colored Terminal Logger
//  Menghasilkan output console yang indah & mudah dibaca di Pterodactyl
// ═══════════════════════════════════════════════════════════════════

const C = {
    reset:  '\x1b[0m',  bold:  '\x1b[1m',  dim: '\x1b[2m',
    red:    '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
    blue:   '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m',
    gray:   '\x1b[90m', bRed: '\x1b[91m',  bGreen: '\x1b[92m',
    bYellow:'\x1b[93m', bBlue: '\x1b[94m', bMagenta: '\x1b[95m',
    bCyan:  '\x1b[96m', white: '\x1b[97m',
};

function col(c, t) { return `${C[c]}${t}${C.reset}`; }
function bold(t)    { return `${C.bold}${t}${C.reset}`; }
function ts()       { return col('gray', new Date().toLocaleTimeString('id-ID', { hour12: false })); }

export const log = {
    info:    (m) => console.log(`${ts()} ${col('bCyan',    '◈')} ${m}`),
    success: (m) => console.log(`${ts()} ${col('bGreen',   '✔')} ${col('bGreen', m)}`),
    warn:    (m) => console.log(`${ts()} ${col('bYellow',  '⚠')} ${col('bYellow', m)}`),
    error:   (m) => console.log(`${ts()} ${col('bRed',     '✖')} ${col('bRed', m)}`),
    debug:   (m) => console.log(`${ts()} ${col('gray',     '·')} ${col('gray', m)}`),

    cmd(num, command, args = []) {
        const argStr = args.length ? col('gray', ` ${args.join(' ')}`) : '';
        console.log(`${ts()} ${col('bMagenta', '⚡')} ${col('bMagenta', num)} ${col('gray', '→')} ${bold(command)}${argStr}`);
    },

    msg(tag, num, body) {
        const tagCol = tag.includes('GRP') ? 'bBlue' : 'bCyan';
        const preview = body.length > 90 ? body.substring(0, 87) + '…' : body;
        console.log(`${ts()} ${col('bCyan', '📩')} ${col(tagCol, tag)} ${col('white', num)}: ${col('gray', preview)}`);
    },

    cooldown(num, command, secs) {
        console.log(`${ts()} ${col('yellow', '⏳')} ${col('yellow', num)} cooldown ${command} (${secs}s)`);
    },

    protection(type, num) {
        console.log(`${ts()} ${col('bRed', '🛡️')} ${col('bRed', type.toUpperCase())} triggered → ${col('gray', num)}`);
    },

    connect(botName, prefix) {
        const w = 44;
        const line = col('bCyan', '═'.repeat(w));
        console.log(`\n${line}`);
        console.log(`${col('bCyan', '║')}  🥶 ${bold(col('bCyan', botName))}${''.padEnd(Math.max(0, w - botName.length - 7))}${col('bCyan', '║')}`);
        console.log(`${col('bCyan', '║')}  ⚡ Prefix: ${col('white', prefix)}   Status: ${col('bGreen', '● TERHUBUNG')}${''.padEnd(Math.max(0, w - prefix.length - 23))}${col('bCyan', '║')}`);
        console.log(`${line}\n`);
    },

    banner(name, version) {
        console.log(col('bCyan', `
 ██████╗  ██████╗      ██╗ ██████╗
██╔════╝ ██╔═══██╗     ██║██╔═══██╗
██║  ███╗██║   ██║     ██║██║   ██║
██║   ██║██║   ██║██   ██║██║   ██║
╚██████╔╝╚██████╔╝╚█████╔╝╚██████╔╝
 ╚═════╝  ╚═════╝  ╚════╝  ╚═════╝`));
        console.log(`  ${col('bMagenta', bold(name))}  ${col('gray', `v${version}`)}\n`);
    },
};

export default log;
