#!/usr/bin/env node
import { calculateRaid, compareRaids } from '../public/lib/raid-model.js';
import { calculateErasure, compareReplication } from '../public/lib/erasure-model.js';

const c = { reset:'\x1b[0m', bold:'\x1b[1m', dim:'\x1b[2m', cyan:'\x1b[36m', blue:'\x1b[34m', violet:'\x1b[35m', green:'\x1b[32m', yellow:'\x1b[33m', red:'\x1b[31m' };
const paint = (color, text) => process.stdout.isTTY && !process.env.NO_COLOR ? `${c[color]}${text}${c.reset}` : text;
const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i >= 0 ? process.argv[i + 1] : fallback; };
const number = (name, fallback) => { const value = Number(arg(name, fallback)); if (!Number.isFinite(value) || value <= 0) throw new Error(`--${name} must be a positive number`); return value; };
const fmt = n => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n);
const bar = (value, max, color='cyan') => paint(color, '█'.repeat(Math.max(1, Math.round(24*value/max)))) + paint('dim', '░'.repeat(Math.max(0, 24-Math.round(24*value/max))));

function header() {
  console.log(paint('cyan','  ╭────────────────────────────────────────────╮'));
  console.log(`${paint('cyan','  │')} ${paint('bold','STORAGECRAFT')} ${paint('dim','storage × AI systems lab')}      ${paint('cyan','│')}`);
  console.log(paint('cyan','  ╰────────────────────────────────────────────╯'));
}
function help() {
  header();
  console.log(`\n${paint('bold','Commands')}`);
  console.log(`  ${paint('green','raid')}     Model and compare RAID capacity, overhead, and tolerance`);
  console.log(`  ${paint('cyan','erasure')}  Model k+m coding, failure state, repair baseline, and replication savings`);
  console.log(`  ${paint('violet','kv')}       Estimate transformer KV-cache memory`);
  console.log(`  ${paint('blue','topics')}   Explore the learning roadmap`);
  console.log(`  ${paint('yellow','doctor')}   Check the local StorageCraft workspace`);
  console.log(`\n${paint('bold','RAID levels')}`);
  console.log(paint('dim','  jbod 0 1 2 3 4 5 6 01 10 50 60 z1 z2 z3'));
  console.log(`\n${paint('bold','Examples')}`);
  console.log(paint('dim','  npm run craft -- raid --level 60 --disks 16 --size 8 --groups 2'));
  console.log(paint('dim','  npm run craft -- raid --compare --disks 12 --size 8 --groups 2'));
  console.log(paint('dim','  npm run craft -- erasure --data 10 --parity 4 --dataset 100 --failures 2'));
  console.log(paint('dim','  npm run craft -- kv --layers 32 --heads 8 --dim 128 --tokens 8192 --bytes 2'));
}
function raid() {
  const level=String(arg('level','5')), disks=number('disks',6), size=number('size',4), groups=number('groups',2);
  if (process.argv.includes('--compare')) return raidCompare(disks,size,groups);
  const result=calculateRaid({level,disks,size,groups}); header();
  console.log(`\n${paint('bold',`${result.name} capacity model`)}  ${paint('dim',`${disks} × ${size} TB drives`)}`);
  console.log(`  ${paint('dim',result.description)}`);
  console.log(`\n  Raw       ${bar(result.raw,result.raw,'blue')}  ${fmt(result.raw)} TB`);
  console.log(`  Usable    ${bar(result.usable,result.raw,'green')}  ${fmt(result.usable)} TB`);
  console.log(`  Overhead  ${bar(result.overhead,result.raw,'violet')}  ${fmt(result.overhead)} TB`);
  console.log(`\n  Efficiency                    ${paint('green',`${fmt(100*result.efficiency)}%`)}`);
  console.log(`  Guaranteed failure tolerance  ${paint('yellow',`${result.guaranteedFailures} drive(s)`)}`);
  if(result.maximumFailures!==result.guaranteedFailures) console.log(`  Layout-dependent maximum      ${paint('yellow',`${result.maximumFailures} drive(s)`)}`);
  console.log(`  Small-write penalty           ${paint('cyan',result.writePenalty ? `${result.writePenalty} I/O baseline` : 'implementation-dependent')}`);
  result.warnings.forEach(warning=>console.log(`\n  ${paint('yellow','⚠')} ${paint('dim',warning)}`));
  console.log(paint('dim','\n  Educational model: account for spares, filesystem reserve, rebuild risk, and vendor units.'));
}
function raidCompare(disks,size,groups) {
  const rows=compareRaids({disks,size,groups}); header();
  console.log(`\n${paint('bold','RAID comparison')}  ${paint('dim',`${disks} × ${size} TB drives`)}\n`);
  console.log(`  ${paint('dim','Level'.padEnd(18))}${paint('dim','Usable'.padStart(10))}${paint('dim','Efficiency'.padStart(13))}${paint('dim','Guaranteed'.padStart(13))}`);
  rows.forEach(row=>row.error
    ? console.log(`  ${paint('dim',row.name.padEnd(18))}${paint('red','not valid'.padStart(10))}`)
    : console.log(`  ${paint('cyan',row.name.padEnd(18))}${paint('green',`${fmt(row.usable)} TB`.padStart(10))}${`${fmt(row.efficiency*100)}%`.padStart(13)}${String(row.guaranteedFailures).padStart(13)}`));
  console.log(paint('dim','\n  Use --level <value> for assumptions, warnings, and layout-dependent tolerance.'));
}
function erasure() {
  const result=calculateErasure({data:number('data',10),parity:number('parity',4),dataset:number('dataset',100),fragmentSize:number('fragment-size',64),failures:Number(arg('failures',1))});
  const replication=compareReplication(result,number('replicas',3)); header();
  console.log(`\n${paint('bold',`Erasure coding (${result.k}+${result.m})`)}  ${paint('dim',`${fmt(result.logical)} TB logical dataset`)}`);
  console.log(`\n  Logical   ${bar(result.logical,replication.physical,'blue')}  ${fmt(result.logical)} TB`);
  console.log(`  EC stored ${bar(result.physical,replication.physical,'green')}  ${fmt(result.physical)} TB`);
  console.log(`  ${replication.copies}× replica ${bar(replication.physical,replication.physical,'violet')}  ${fmt(replication.physical)} TB`);
  console.log(`\n  Efficiency               ${paint('green',`${fmt(result.efficiency*100)}%`)}`);
  console.log(`  Storage saved vs replica ${paint('cyan',`${fmt(replication.saving)} TB`)}`);
  console.log(`  Fragment failures        ${result.failed}/${result.m} tolerated  ${result.recoverable?paint('green','RECOVERABLE'):paint('red','DATA LOSS')}`);
  console.log(`  Baseline repair read     ${paint('yellow',`${fmt(result.baselineRepairRead)} TB`)}`);
  console.log(paint('dim','\n  Baseline model only: placement, code family, locality, and repair implementation change real cost.'));
}
function kv() {
  const layers=number('layers',32), heads=number('heads',32), dim=number('dim',128), tokens=number('tokens',8192), bytes=number('bytes',2), batch=number('batch',1);
  const total=2*layers*heads*dim*tokens*bytes*batch, gib=total/1024**3; header();
  console.log(`\n${paint('bold','Transformer KV-cache estimator')}`);
  console.log(`\n  2 × layers × heads × head_dim × tokens × bytes × batch`);
  console.log(`  2 × ${layers} × ${heads} × ${dim} × ${tokens} × ${bytes} × ${batch}`);
  console.log(`\n  Cache required  ${paint('violet',paint('bold',`${fmt(gib)} GiB`))}`);
  console.log(`  Per 1K tokens   ${paint('cyan',`${fmt(gib/tokens*1024)} GiB`)}`);
  console.log(paint('dim','\n  Unpaged baseline: GQA/MQA and quantized caches change KV head count or bytes.'));
}
function topics() {
  header(); console.log(`\n${paint('bold','Learning paths')}\n`);
  [['01','Storage mechanics','WAL → COW → RAID → erasure coding'],['02','Data engines','LSM trees → compaction → caching'],['03','AI memory','GPU memory → KV cache → PagedAttention'],['04','AI data plane','RAG → vector indexes → disaggregated storage']].forEach(([n,t,d])=>console.log(`  ${paint('cyan',n)}  ${paint('bold',t.padEnd(19))} ${paint('dim',d)}`));
  console.log(`\n  ${paint('green','Explore →')} https://manmeetnain.github.io/storagecraft/`);
}
async function doctor() {
  header(); const {existsSync}=await import('node:fs');
  const checks=[['package.json',existsSync('package.json')],['Astro config',existsSync('astro.config.mjs')],['content',existsSync('src/content/docs')],['RAID simulator',existsSync('public/simulators/raid/index.html')],['RAID model',existsSync('public/lib/raid-model.js')],['Erasure model',existsSync('public/lib/erasure-model.js')]];
  console.log(); checks.forEach(([name,ok])=>console.log(`  ${ok?paint('green','✓'):paint('red','✗')} ${name}`)); if(checks.some(([,ok])=>!ok)) process.exitCode=1;
}
const command=process.argv[2]||'help';
try { if(command==='raid') raid(); else if(command==='erasure') erasure(); else if(command==='kv') kv(); else if(command==='topics') topics(); else if(command==='doctor') await doctor(); else help(); }
catch(error) { console.error(`\n${paint('red','error:')} ${error.message}\n`); process.exitCode=1; }
