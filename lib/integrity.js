import crypto from 'crypto';

const _0xS1 = '54c754863d9cb6c84d9db0b182a4add3e88cd0254ba0b6a2c46dd20d8f572da1';
const _0xS2 = 'a3768f00f1da37c9e8c9e0199f9b50926457a3d8dee642e37d400a7c48e076d6';
const _0xS3 = 'e854bc73923755ba3b67e9f597fabd083bf8a27d8ee343c8eac2ca1484516612';

function _0xdgst(v) {
    return crypto.createHash('sha256').update(String(v || '')).digest('hex');
}

export function verifyIntegrity(cfg) {
    if (!cfg) {
        console.error('\n❌ [SECURITY VIOLATION] Configuration missing! Bot halted.\n');
        process.exit(1);
    }
    if (_0xdgst(cfg.creatorName) !== _0xS1 ||
        _0xdgst(cfg.creatorNumber) !== _0xS2 ||
        _0xdgst(cfg.channelUrl) !== _0xS3) {
        console.error('\n' + '='.repeat(66));
        console.error('  [CRITICAL TAMPER VIOLATION] MASTER MD CANNOT BE REBRANDED');
        console.error('  All rights cryptographically locked to Developer: AHSAN');
        console.error('  Official WhatsApp: 03107260507');
        console.error('  Channel: https://whatsapp.com/channel/0029VbB45OnAInPcfOvoYm46');
        console.error('  Execution halted. To deploy legally, preserve original credits.');
        console.error('='.repeat(66) + '\n');
        process.exit(1);
    }
    return true;
}

export default verifyIntegrity;