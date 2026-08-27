#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';

const catalog=JSON.parse(readFileSync('capsules/catalog.json','utf8'));const errors=[];const ids=new Set();
if(catalog.version!==1)errors.push('catalog version must be 1');
for(const capsule of catalog.capsules){
  if(ids.has(capsule.id))errors.push(`duplicate capsule id: ${capsule.id}`);ids.add(capsule.id);
  if(!['queued','active','shipped'].includes(capsule.status))errors.push(`${capsule.id}: invalid status`);
  if(!Number.isFinite(capsule.priority))errors.push(`${capsule.id}: priority is required`);
  if(capsule.status==='shipped')for(const field of ['model','tests','ui','docs','cli']){if(!capsule[field])errors.push(`${capsule.id}: shipped capsule missing ${field}`);else if(field!=='cli'&&!existsSync(capsule[field]))errors.push(`${capsule.id}: ${field} not found at ${capsule[field]}`)}
}
const active=catalog.capsules.filter(c=>c.status==='active');if(active.length>1)errors.push('only one capsule may be active');
catalog.capsules.sort((a,b)=>b.priority-a.priority);console.log(`Capsule pipeline: ${catalog.capsules.filter(c=>c.status==='shipped').length} shipped · ${active.length} active · ${catalog.capsules.filter(c=>c.status==='queued').length} queued`);
catalog.capsules.forEach(c=>console.log(`  ${c.status==='shipped'?'✓':c.status==='active'?'▶':'·'} ${String(c.priority).padStart(3)}  ${c.title}`));
if(errors.length){errors.forEach(e=>console.error(`✗ ${e}`));process.exit(1)}console.log('✓ Capsule catalog valid.');
