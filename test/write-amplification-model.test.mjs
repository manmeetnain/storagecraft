import test from'node:test';import assert from'node:assert/strict';import{calculateWritePath,WRITE_PRESETS}from'../public/lib/write-amplification-model.js';
test('multiplies layer factors across the write path',()=>{const r=calculateWritePath({logical:1,wal:2,engine:3,filesystem:1,protection:2,replication:3,ftl:1.5});assert.equal(r.physical,54);assert.equal(r.amplification,54)});
test('preserves no-amplification path',()=>{const r=calculateWritePath({logical:10});assert.equal(r.physical,10);assert.equal(r.added,0)});
test('preset produces deterministic result',()=>{const r=calculateWritePath({logical:1,...WRITE_PRESETS.database.factors});assert.ok(Math.abs(r.amplification-14.49)<1e-9)});
test('rejects zero and negative factors',()=>{assert.throws(()=>calculateWritePath({logical:0}),/logical writes/);assert.throws(()=>calculateWritePath({wal:-1}),/wal/) });
