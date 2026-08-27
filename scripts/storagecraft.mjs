#!/usr/bin/env node

const c = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m', cyan: '\x1b[36m',
  blue: '\x1b[34m', violet: '\x1b[35m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m',
};
const paint = (color, text) => process.stdout.isTTY && !process.env.NO_COLOR ? `${c[color]}${text}${c.reset}` : text;
const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
};
const number = (name, fallback) => {
  const value = Number(arg(name, fallback));
  if (!Number.isFinite(value) || value <= 0) throw new Error(`--${name} must be a positive number`);
  return value;
};
const fmt = n => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n);
const bar = (value, max, color = 'cyan') => paint(color, '█'.repeat(Math.max(1, Math.round(24 * value / max)))) + paint('dim', '░'.repeat(Math.max(0, 24 - Math.round(24 * value / max))));

function header() {
  console.log(paint('cyan', '  ╭────────────────────────────────────────────╮'));
  console.log(`${paint('cyan', '  │')} ${paint('bold', 'STORAGECRAFT')} ${paint('dim', 'storage × AI systems lab')}      ${paint('cyan', '│')}`);
  console.log(paint('cyan', '  ╰────────────────────────────────────────────╯'));
}
function help() {
  header();
  console.log(`\n${paint('bold', 'Commands')}`);
  console.log(`  ${paint('green', 'raid')}     Size usable capacity and failure tolerance`);
  console.log(`  ${paint('violet', 'kv')}       Estimate transformer KV-cache memory`);
  console.log(`  ${paint('blue', 'topics')}   Explore the learning roadmap`);
  console.log(`  ${paint('yellow', 'doctor')}   Check the local StorageCraft workspace`);
  console.log(`\n${paint('bold', 'Examples')}`);
  console.log(paint('dim', '  npm run craft -- raid --level 6 --disks 8 --size 4'));
  console.log(paint('dim', '  npm run craft -- kv --layers 32 --heads 32 --dim 128 --tokens 8192 --bytes 2'));
}
function raid() {
  const level = String(arg('level', '5')); const disks = number('disks', 6); const size = number('size', 4);
  const parity = level === '6' ? 2 : level === '5' ? 1 : level === '1' ? disks / 2 : 0;
  if (!['0', '1', '5', '6'].includes(level)) throw new Error('--level must be 0, 1, 5, or 6');
  if ((level === '5' && disks < 3) || (level === '6' && disks < 4) || (level === '1' && disks % 2)) throw new Error('invalid disk count for selected RAID level');
  const raw = disks * size; const usable = level === '1' ? raw / 2 : (disks - parity) * size;
  header();
  console.log(`\n${paint('bold', `RAID-${level} capacity model`)}  ${paint('dim', `${disks} × ${size} TB drives`)}`);
  console.log(`\n  Raw       ${bar(raw, raw, 'blue')}  ${fmt(raw)} TB`);
  console.log(`  Usable    ${bar(usable, raw, 'green')}  ${fmt(usable)} TB`);
  console.log(`  Overhead  ${bar(raw - usable, raw, 'violet')}  ${fmt(raw - usable)} TB`);
  console.log(`\n  Efficiency       ${paint('green', `${fmt(100 * usable / raw)}%`)}`);
  console.log(`  Failure tolerance ${paint('yellow', `${level === '0' ? 0 : level === '6' ? 2 : 1} drive${level === '6' ? 's' : ''}`)}`);
  console.log(paint('dim', '\n  Educational model: account for spares, filesystem reserve, and vendor units in production.'));
}
function kv() {
  const layers = number('layers', 32), heads = number('heads', 32), dim = number('dim', 128), tokens = number('tokens', 8192), bytes = number('bytes', 2), batch = number('batch', 1);
  const total = 2 * layers * heads * dim * tokens * bytes * batch; const gib = total / 1024 ** 3;
  header();
  console.log(`\n${paint('bold', 'Transformer KV-cache estimator')}`);
  console.log(`\n  2 × layers × heads × head_dim × tokens × bytes × batch`);
  console.log(`  2 × ${layers} × ${heads} × ${dim} × ${tokens} × ${bytes} × ${batch}`);
  console.log(`\n  Cache required  ${paint('violet', paint('bold', `${fmt(gib)} GiB`))}`);
  console.log(`  Per 1K tokens   ${paint('cyan', `${fmt(gib / tokens * 1024)} GiB`)}`);
  console.log(paint('dim', '\n  This is the unpaged baseline. GQA/MQA and quantized caches change head count or bytes.'));
}
function topics() {
  header();
  console.log(`\n${paint('bold', 'Learning paths')}\n`);
  [['01','Storage mechanics','WAL → COW → RAID → erasure coding'],['02','Data engines','LSM trees → compaction → caching'],['03','AI memory','GPU memory → KV cache → PagedAttention'],['04','AI data plane','RAG → vector indexes → disaggregated storage']].forEach(([n,t,d]) => console.log(`  ${paint('cyan', n)}  ${paint('bold', t.padEnd(19))} ${paint('dim', d)}`));
  console.log(`\n  ${paint('green', 'Explore →')} https://manmeetnain.github.io/storagecraft/`);
}
async function doctor() {
  header();
  const { existsSync } = await import('node:fs');
  const checks = [['package.json', existsSync('package.json')], ['Astro config', existsSync('astro.config.mjs')], ['content', existsSync('src/content/docs')], ['RAID simulator', existsSync('public/simulators/raid/index.html')]];
  console.log(); checks.forEach(([name, ok]) => console.log(`  ${ok ? paint('green','✓') : paint('red','✗')} ${name}`));
  if (checks.some(([,ok]) => !ok)) process.exitCode = 1;
}
const command = process.argv[2] || 'help';
try { if (command === 'raid') raid(); else if (command === 'kv') kv(); else if (command === 'topics') topics(); else if (command === 'doctor') await doctor(); else help(); }
catch (error) { console.error(`\n${paint('red', 'error:')} ${error.message}\n`); process.exitCode = 1; }
