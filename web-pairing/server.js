// server.js — Standalone High-Performance Express Server for MASTER MD Web Pairing
// Developer: AHSAN (03107260507)

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pairHandler from './pair.js';
import statusHandler from './status.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(__dirname));

// API Routes
app.all('/api/pair', (req, res) => pairHandler(req, res));
app.all('/api/status', (req, res) => statusHandler(req, res));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime(), bot: 'MASTER MD', dev: 'AHSAN' });
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('\n' + '═'.repeat(60));
    console.log('⚡ MASTER MD — Web Pairing Portal (Production Ready)');
    console.log('👑 Developer : AHSAN (03107260507)');
    console.log(`🌐 Live URL  : http://localhost:${PORT}`);
    console.log('═'.repeat(60) + '\n');
});
