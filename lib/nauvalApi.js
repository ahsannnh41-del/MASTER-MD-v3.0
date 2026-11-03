import axios from 'axios';

const BASE = String(process.env.NAUVAL_API_BASE || 'https://ytdlpyton.nvlgroup.my.id').replace(/\/$/, '');
const KEY = String(process.env.NAUVAL_API_KEY || process.env.REST_API_KEY || '').trim();
const ENABLED = String(process.env.NAUVAL_API_ENABLED || 'true').toLowerCase() !== 'false';

let openApiCache = null;
let openApiCacheAt = 0;

function headers() {
    return KEY ? { 'X-API-Key': KEY } : {};
}

function flatten(obj, depth = 0) {
    if (depth > 4 || obj == null) return [];
    if (typeof obj === 'string') return [obj];
    if (Array.isArray(obj)) return obj.flatMap(x => flatten(x, depth + 1));
    if (typeof obj === 'object') return Object.entries(obj).flatMap(([k, v]) => [k, ...flatten(v, depth + 1)]);
    return [];
}

function scorePath(path, kind) {
    const p = path.toLowerCase();
    let score = 0;
    if (p.includes('youtube')) score += 8;
    if (p.includes('yt')) score += 3;
    if (kind === 'search') {
        if (p.includes('search')) score += 8;
        if (p.includes('video')) score += 3;
    } else {
        if (p.includes('mp3') || p.includes('audio')) score += 8;
        if (p.includes('download') || p.includes('dl')) score += 5;
    }
    if (p.includes('spotify')) score -= 5;
    return score;
}

async function getOpenApi() {
    if (!ENABLED) return null;
    if (openApiCache && Date.now() - openApiCacheAt < 10 * 60 * 1000) return openApiCache;
    const { data } = await axios.get(`${BASE}/openapi.json`, { headers: headers(), timeout: 8_000 });
    if (!data?.paths || typeof data.paths !== 'object') throw new Error('OpenAPI Nauval tidak valid.');
    openApiCache = data;
    openApiCacheAt = Date.now();
    return data;
}

function pickEndpoint(spec, kind) {
    const candidates = [];
    for (const [path, methods] of Object.entries(spec.paths || {})) {
        const score = scorePath(path, kind);
        if (score <= 0) continue;
        for (const [method, op] of Object.entries(methods || {})) {
            if (!['get', 'post'].includes(method)) continue;
            const text = `${path} ${op?.summary || ''} ${op?.description || ''} ${flatten(op?.tags || []).join(' ')}`.toLowerCase();
            let extra = 0;
            if (kind === 'search' && text.includes('search')) extra += 8;
            if (kind === 'download' && (text.includes('mp3') || text.includes('audio'))) extra += 8;
            candidates.push({ path, method, op, score: score + extra });
        }
    }
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0] || null;
}

function parameterNames(op) {
    return new Set((op?.parameters || []).map(p => String(p.name || '').toLowerCase()));
}

function makeParams(op, value, kind) {
    const names = parameterNames(op);
    const q = {};
    const preferred = kind === 'search'
        ? ['q', 'query', 'keyword', 'search', 'text']
        : ['url', 'video_url', 'youtube_url', 'link', 'video'];
    const key = preferred.find(k => names.has(k)) || preferred[0];
    q[key] = value;
    return q;
}

function extractUrl(value, depth = 0) {
    if (depth > 5 || value == null) return null;
    if (typeof value === 'string') {
        const m = value.match(/https?:\/\/[^\s"'<>]+/i);
        return m ? m[0] : null;
    }
    if (Array.isArray(value)) {
        for (const x of value) {
            const u = extractUrl(x, depth + 1);
            if (u) return u;
        }
        return null;
    }
    if (typeof value === 'object') {
        const preferred = ['url', 'download_url', 'downloadUrl', 'audio_url', 'audioUrl', 'link', 'result'];
        for (const k of preferred) {
            if (k in value) {
                const u = extractUrl(value[k], depth + 1);
                if (u) return u;
            }
        }
        for (const v of Object.values(value)) {
            const u = extractUrl(v, depth + 1);
            if (u) return u;
        }
    }
    return null;
}

function extractSearchResult(data) {
    if (!data) return null;
    if (Array.isArray(data)) return data[0] || null;
    if (Array.isArray(data.results)) return data.results[0] || null;
    if (Array.isArray(data.items)) return data.items[0] || null;
    if (Array.isArray(data.data)) return data.data[0] || null;
    if (Array.isArray(data.result)) return data.result[0] || null;
    return data.data || data.result || data;
}

export async function nauvalPlay(query) {
    if (!ENABLED) return null;
    const spec = await getOpenApi();
    const search = pickEndpoint(spec, 'search');
    const download = pickEndpoint(spec, 'download');
    if (!search && !download) return null;

    let video = null;
    if (search) {
        const params = makeParams(search.op, query, 'search');
        const response = search.method === 'get'
            ? await axios.get(`${BASE}${search.path}`, { params, headers: headers(), timeout: 20_000 })
            : await axios.post(`${BASE}${search.path}`, params, { headers: { ...headers(), 'Content-Type': 'application/json' }, timeout: 20_000 });
        video = extractSearchResult(response.data);
    }

    const videoUrl = extractUrl(video) || (typeof video === 'string' ? video : null);
    if (!download) return videoUrl ? { url: videoUrl, title: video?.title || video?.name || query } : null;

    const input = videoUrl || query;
    const params = makeParams(download.op, input, 'download');
    const response = download.method === 'get'
        ? await axios.get(`${BASE}${download.path}`, { params, headers: headers(), timeout: 30_000, responseType: 'arraybuffer' })
        : await axios.post(`${BASE}${download.path}`, params, { headers: { ...headers(), 'Content-Type': 'application/json' }, timeout: 30_000, responseType: 'arraybuffer' });

    const contentType = String(response.headers?.['content-type'] || '');
    if (contentType.includes('audio/') || contentType.includes('octet-stream')) {
        return { buffer: Buffer.from(response.data), title: video?.title || video?.name || query, mimetype: contentType.includes('mpeg') ? 'audio/mpeg' : 'audio/mpeg' };
    }

    let parsed;
    try { parsed = JSON.parse(Buffer.from(response.data).toString('utf8')); } catch { parsed = null; }
    const url = extractUrl(parsed);
    if (!url) return null;
    return { url, title: video?.title || video?.name || query };
}

export function nauvalConfigStatus() {
    return { enabled: ENABLED, hasKey: Boolean(KEY), base: BASE };
}
