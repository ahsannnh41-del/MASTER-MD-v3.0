// encrypt.js — JavaScript Obfuscation & Encryption Engine for MASTER MD
// Developer: AHSAN
// Protects source code from theft, unauthorized edits, and tampering.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JavaScriptObfuscator from 'javascript-obfuscator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.resolve(__dirname, '../../MASTER-MD-PROTECTED');

const OBFUSCATOR_OPTIONS = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayCallsTransformThreshold: 0.75,
    stringArrayEncoding: ['rc4'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 4,
    stringArrayWrappersType: 'function',
    stringArrayThreshold: 0.8,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
};

const EXCLUDE_PATHS = [
    'node_modules',
    '.git',
    'session',
    'session-backup',
    'data',
    'media',
    'extracted_bots'
];

function ensureDirSync(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function processDirectory(currentSource, currentDest) {
    ensureDirSync(currentDest);
    const entries = fs.readdirSync(currentSource, { withFileTypes: true });

    for (const entry of entries) {
        const sourcePath = path.join(currentSource, entry.name);
        const destPath = path.join(currentDest, entry.name);

        if (EXCLUDE_PATHS.includes(entry.name)) {
            continue;
        }

        if (entry.isDirectory()) {
            processDirectory(sourcePath, destPath);
        } else if (entry.isFile()) {
            if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) {
                // Don't obfuscate this script itself
                if (entry.name === 'encrypt.js') continue;

                console.log(`🔒 Encrypting: ${path.relative(SOURCE_DIR, sourcePath)}`);
                const code = fs.readFileSync(sourcePath, 'utf8');

                try {
                    const obfuscated = JavaScriptObfuscator.obfuscate(code, OBFUSCATOR_OPTIONS);
                    const protectedBanner = `/* ═══════════════════════════════════════════════════════════════\n * MASTER MD — PROTECTED ENGINE\n * Developed by AHSAN\n * Anti-Tamper & Encrypted File — Do NOT Modify\n * ═══════════════════════════════════════════════════════════════ */\n`;
                    fs.writeFileSync(destPath, protectedBanner + obfuscated.getObfuscatedCode(), 'utf8');
                } catch (err) {
                    console.warn(`⚠️ Skipped obfuscation for ${entry.name}: ${err.message}`);
                    fs.copyFileSync(sourcePath, destPath);
                }
            } else {
                // Copy non-js files as-is (e.g. package.json, json files, fonts, html, css)
                fs.copyFileSync(sourcePath, destPath);
            }
        }
    }
}

console.log('═'.repeat(60));
console.log('⚡ MASTER MD — Code Encryption & Protection Engine');
console.log('👑 Developer: AHSAN');
console.log('═'.repeat(60));
console.log(`📁 Source: ${SOURCE_DIR}`);
console.log(`🛡️ Target: ${OUTPUT_DIR}\n`);

processDirectory(SOURCE_DIR, OUTPUT_DIR);

console.log('\n✅ All files successfully encrypted and protected in MASTER-MD-PROTECTED!');
