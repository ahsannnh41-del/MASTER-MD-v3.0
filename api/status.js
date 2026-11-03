import { getSession } from './sessionStore.js';

export const maxDuration = 30;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id } = req.query;

    if (!id) {
        return res.status(200).json({
            success: true,
            status: 'ready',
            service: 'MASTER MD Status API',
            message: 'Provide ?id=sessionId to query pairing progress.'
        });
    }

    const session = getSession(id);
    if (!session) {
        return res.status(404).json({
            success: false,
            status: 'not_found',
            message: 'Session expired or not found.'
        });
    }

    return res.status(200).json({
        success: true,
        status: session.status,
        code: session.code,
        message: session.message || (session.status === 'connected' ? 'Connected successfully!' : 'Waiting for connection...')
    });
}
