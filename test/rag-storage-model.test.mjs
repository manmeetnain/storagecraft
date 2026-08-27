import test from'node:test';import assert from'node:assert/strict';import{calculateRagStorage}from'../public/lib/rag-storage-model.js';
test('calculates overlap-aware chunks',()=>{const r=calculateRagStorage({documents:10,avgTokens:1200,chunkTokens:512,overlapTokens:64});assert.equal(r.stride,448);assert.equal(r.chunksPerDocument,3);assert.equal(r.chunks,30)});
test('replication multiplies the vector store but not source corpus',()=>{const a=calculateRagStorage({replicas:1}),b=calculateRagStorage({replicas:3});assert.ok(Math.abs(b.vectorReplicatedGiB-a.vectorPrimaryGiB*3)<1e-10);assert.equal(a.sourceGiB,b.sourceGiB)});
test('rejects overlap at or above chunk size',()=>{assert.throws(()=>calculateRagStorage({chunkTokens:128,overlapTokens:128}),/smaller/) });
