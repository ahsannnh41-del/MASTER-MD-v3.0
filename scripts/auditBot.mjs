import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const failures = [];
const files = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'session', 'session-backup'].includes(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full);
    else if (ent.isFile() && full.endsWith('.js')) files.push(full);
  }
}
walk(root);

for (const file of files) {
  try { execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' }); }
  catch (err) {
    failures.push(`Syntax error: ${path.relative(root, file)}\n${String(err.stderr || err.stdout || err.message)}`);
  }
}

const registryPath = path.join(root, 'commands', 'featureRegistry2000.js');
const registryText = fs.readFileSync(registryPath, 'utf8');
const features = [...registryText.matchAll(/"([^"]+)"/g)].map(m => m[1]);
if (features.length !== 2000) failures.push(`Feature registry expected 2000 entries, found ${features.length}.`);
if (new Set(features).size !== features.length) failures.push('Feature registry contains duplicate names.');

const indexText = fs.readFileSync(path.join(root, 'commands', 'index.js'), 'utf8');
const missing = features.filter(name => !new RegExp(`[\\\"']${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\\\$&')}[\\\"']`).test(indexText));
if (missing.length) failures.push(`Registry names missing from command source: ${missing.slice(0, 20).join(', ')}`);

const forbiddenLegacy = [
  'categorizeByHandlerSource is not defined',
  'ALIAS_OVERRIDE_CATTEGORY',
];
for (const marker of forbiddenLegacy) {
  if (indexText.includes(marker)) failures.push(`Legacy broken marker still present: ${marker}`);
}

console.log(`JS files checked : ${files.length}`);
console.log(`Registry entries : ${features.length}`);
console.log(`Unique registry : ${new Set(features).size}`);
if (failures.length) {
  console.error('\nAUDIT FAILED');
  for (const f of failures) console.error(`\n- ${f}`);
  process.exit(1);
}
console.log('AUDIT OK');
