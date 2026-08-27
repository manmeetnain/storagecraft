#!/usr/bin/env node
import { calculateRaid, compareRaids } from '../public/lib/raid-model.js';
import { calculateErasure, compareReplication } from '../public/lib/erasure-model.js';
import { calculateWritePath, WRITE_PRESETS } from '../public/lib/write-amplification-model.js';
import { calculateLsm } from '../public/lib/lsm-model.js';
import { calculateGpuMemory, GPU_PRESETS } from '../public/lib/gpu-memory-model.js';
import { calculateRagStorage } from '../public/lib/rag-storage-model.js';
import { calculateAiDataPath } from '../public/lib/ai-data-path-model.js';

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
  console.log(`  ${paint('yellow','write-path')} Trace cumulative write amplification through the storage stack`);
  console.log(`  ${paint('green','lsm')}      Compare leveled and tiered LSM compaction trade-offs`);
  console.log(`  ${paint('violet','gpu-plan')} Size weights, KV cache, runtime reserve, and concurrency per GPU`);
  console.log(`  ${paint('blue','rag-size')}  Size RAG chunks, embeddings, metadata, index overhead, and replicas`);
  console.log(`  ${paint('cyan','ai-path')}   Find AI training, checkpoint, and model-load data-path bottlenecks`);
  console.log(`  ${paint('violet','kv')}       Estimate transformer KV-cache memory`);
  console.log(`  ${paint('blue','topics')}   Explore the learning roadmap`);
  console.log(`  ${paint('yellow','doctor')}   Check the local StorageCraft workspace`);
  console.log(`\n${paint('bold','RAID levels')}`);
  console.log(paint('dim','  jbod 0 1 2 3 4 5 6 01 10 50 60 z1 z2 z3'));
  console.log(`\n${paint('bold','Examples')}`);
  console.log(paint('dim','  npm run craft -- raid --level 60 --disks 16 --size 8 --groups 2'));
  console.log(paint('dim','  npm run craft -- raid --compare --disks 12 --size 8 --groups 2'));
  console.log(paint('dim','  npm run craft -- erasure --data 10 --parity 4 --dataset 100 --failures 2'));
  console.log(paint('dim','  npm run craft -- write-path --preset lsm --logical 1'));
  console.log(paint('dim','  npm run craft -- lsm --policy leveled --dataset 500 --memtable 512 --ratio 10'));
  console.log(paint('dim','  npm run craft -- gpu-plan --preset llama70 --gpus 1 --gpu-memory 80 --tokens 8192'));
  console.log(paint('dim','  npm run craft -- rag-size --documents 1000000 --tokens 1200 --chunk 512 --overlap 64'));
  console.log(paint('dim','  npm run craft -- ai-path --dataset 100 --object-read 5000 --fabric 12500 --preprocess 8000'));
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
function writePath() {
  const presetName=String(arg('preset','database'));const preset=WRITE_PRESETS[presetName];if(!preset)throw new Error('--preset must be database, lsm, cow, or ai');
  const factors={...preset.factors};for(const key of Object.keys(factors))if(process.argv.includes(`--${key}`))factors[key]=number(key,factors[key]);
  const result=calculateWritePath({logical:number('logical',1),...factors});header();
  console.log(`\n${paint('bold','Write Amplification Explorer')}  ${paint('dim',preset.name)}`);
  console.log(`  ${paint('dim','Relative write-work units; every factor is explicit and configurable.')}\n`);
  const max=result.physical;result.stages.forEach((stage,index)=>console.log(`  ${paint(index===0?'blue':index===result.stages.length-1?'red':'cyan',stage.name.padEnd(28))}${bar(stage.output,max,index===result.stages.length-1?'red':'cyan')}  ${fmt(stage.output)}×`));
  console.log(`\n  End-to-end amplification  ${paint('red',paint('bold',`${fmt(result.amplification)}×`))}`);
  console.log(`  Largest added work        ${paint('yellow',`${result.largest.name}: +${fmt(result.largest.added)} units`)}`);
  console.log(`\n  ${paint('yellow','⚠')} ${paint('dim',result.warning)}`);
}
function lsm(){const result=calculateLsm({policy:String(arg('policy','leveled')),datasetGB:number('dataset',500),memtableMB:number('memtable',512),sizeRatio:number('ratio',10),l0Files:number('l0-files',4),storageMBps:number('bandwidth',500)});header();console.log(`\n${paint('bold','LSM Compaction Lab')}  ${paint('dim',result.policy)}`);console.log(`  ${paint('dim',result.tradeoff)}\n`);console.log(`  Non-empty levels         ${paint('cyan',result.levels)}`);console.log(`  Estimated write amp     ${paint('red',`${fmt(result.writeAmplification)}×`)}`);console.log(`  Point-lookup runs       ${paint('yellow',fmt(result.readRuns))}`);console.log(`  Space amplification    ${paint('violet',`${fmt(result.spaceAmplification)}×`)}`);console.log(`  Ingest ceiling         ${paint('green',`${fmt(result.maxIngestMBps)} MB/s`)}`);console.log(`\n  ${paint('yellow','⚠')} ${paint('dim',result.warning)}`)}
function gpuPlan(){const presetName=String(arg('preset','llama70')),preset=GPU_PRESETS[presetName];if(!preset)throw new Error('--preset must be llama8, llama70, dense7, or large405');const r=calculateGpuMemory({...preset,weightBits:number('weight-bits',preset.weightBits),tokens:number('tokens',8192),concurrency:number('concurrency',8),kvBytes:number('kv-bytes',2),gpus:number('gpus',1),gpuMemoryGB:number('gpu-memory',80),activationGB:number('activations',2),workspaceGB:number('workspace',3),reservePercent:Number(arg('reserve',10))});header();console.log(`\n${paint('bold','GPU Memory Planner')}  ${paint('dim',preset.name)}\n`);console.log(`  Weights total / per GPU  ${paint('violet',`${fmt(r.totalWeightsGiB)} / ${fmt(r.perGpuWeights)} GiB`)}`);console.log(`  KV per request           ${paint('cyan',`${fmt(r.perRequestKvGiB)} GiB`)}`);console.log(`  KV total / per GPU       ${paint('cyan',`${fmt(r.totalKvGiB)} / ${fmt(r.perGpuKv)} GiB`)}`);console.log(`  Runtime fixed per GPU    ${paint('yellow',`${fmt(r.fixedPerGpu)} GiB`)}`);console.log(`  Required / usable        ${paint(r.fits?'green':'red',`${fmt(r.requiredPerGpu)} / ${fmt(r.usablePerGpu)} GiB`)}`);console.log(`  Maximum concurrency      ${paint('green',fmt(r.maxConcurrency))}`);console.log(`\n  ${r.fits?paint('green','FIT'):paint('red','DOES NOT FIT')} · headroom ${fmt(r.headroomGiB)} GiB per GPU`);console.log(`  ${paint('yellow','⚠')} ${paint('dim',r.warning)}`)}
function ragSize(){const r=calculateRagStorage({documents:number('documents',1e6),avgTokens:number('tokens',1200),chunkTokens:number('chunk',512),overlapTokens:Number(arg('overlap',64)),embeddingDimensions:number('dimensions',1536),embeddingBytes:number('embedding-bytes',4),metadataBytes:number('metadata-bytes',512),indexOverheadPercent:Number(arg('index-overhead',30)),replicas:number('replicas',2)});header();console.log(`\n${paint('bold','RAG Storage Sizer')}  ${paint('dim',`${fmt(r.documents)} documents`)}\n`);console.log(`  Chunks / total           ${paint('cyan',`${r.chunksPerDocument} / ${fmt(r.chunks)}`)}`);console.log(`  Source corpus            ${paint('blue',`${fmt(r.sourceGiB)} GiB`)}`);console.log(`  Raw embeddings           ${paint('violet',`${fmt(r.embeddingGiB)} GiB`)}`);console.log(`  Metadata + index         ${paint('yellow',`${fmt(r.metadataGiB+r.indexGiB)} GiB`)}`);console.log(`  Replicated vector store  ${paint('cyan',`${fmt(r.vectorReplicatedGiB)} GiB`)}`);console.log(`  Total modeled physical   ${paint('green',`${fmt(r.totalPhysicalGiB)} GiB`)}`);console.log(`\n  ${paint('yellow','⚠')} ${paint('dim',r.warning)}`)}
function aiPath(){const r=calculateAiDataPath({datasetTiB:number('dataset',100),epochs:number('epochs',1),objectReadMBps:number('object-read',5000),fabricMBps:number('fabric',12500),preprocessMBps:number('preprocess',8000),trainerIngestMBps:number('trainer',6000),checkpointGiB:number('checkpoint-size',500),checkpointWriteMBps:number('checkpoint-write',4000),modelGiB:number('model-size',140),modelReadMBps:number('model-read',7000),gpuLoadMBps:number('gpu-load',12000)});header();console.log(`\n${paint('bold','AI Data Path Lab')}  ${paint('dim',`${fmt(r.datasetTiB)} TiB × ${fmt(r.epochs)} pass(es)`)}\n`);r.stages.forEach(s=>console.log(`  ${paint(s.isBottleneck?'red':'cyan',s.name.padEnd(18))}${bar(s.throughputMBps,Math.max(...r.stages.map(x=>x.throughputMBps)),s.isBottleneck?'red':'cyan')}  ${fmt(s.throughputMBps)} MB/s${s.isBottleneck?paint('red','  ← LIMIT'):''}`));console.log(`\n  Effective training rate  ${paint('green',`${fmt(r.effectiveTrainingMBps)} MB/s`)}`);console.log(`  Dataset-pass time        ${paint('yellow',`${fmt(r.trainingHours)} hours`)}`);console.log(`  Checkpoint save          ${paint('violet',`${fmt(r.checkpointSeconds)} seconds`)}`);console.log(`  Model cold load          ${paint('blue',`${fmt(r.modelLoadSeconds)} seconds`)}`);console.log(`\n  ${paint('yellow','⚠')} ${paint('dim',r.warning)}`)}
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
  const checks=[['package.json',existsSync('package.json')],['Astro config',existsSync('astro.config.mjs')],['content',existsSync('src/content/docs')],['Capsule catalog',existsSync('capsules/catalog.json')],['RAID simulator',existsSync('public/simulators/raid/index.html')],['RAID model',existsSync('public/lib/raid-model.js')],['Erasure model',existsSync('public/lib/erasure-model.js')],['Write-path model',existsSync('public/lib/write-amplification-model.js')]];
  console.log(); checks.forEach(([name,ok])=>console.log(`  ${ok?paint('green','✓'):paint('red','✗')} ${name}`)); if(checks.some(([,ok])=>!ok)) process.exitCode=1;
}
const command=process.argv[2]||'help';
try { if(command==='raid') raid(); else if(command==='erasure') erasure(); else if(command==='write-path') writePath(); else if(command==='lsm') lsm(); else if(command==='gpu-plan') gpuPlan(); else if(command==='rag-size') ragSize(); else if(command==='ai-path') aiPath(); else if(command==='kv') kv(); else if(command==='topics') topics(); else if(command==='doctor') await doctor(); else help(); }
catch(error) { console.error(`\n${paint('red','error:')} ${error.message}\n`); process.exitCode=1; }
