import test from'node:test';import assert from'node:assert/strict';import{calculateNvmeQueues}from'../public/lib/nvme-queue-model.js';
test('applies Little’s Law to queue concurrency',()=>{const r=calculateNvmeQueues({queues:2,depthPerQueue:4,latencyUs:100,deviceMaxIops:1e6,hostMaxIops:1e6});assert.equal(r.concurrency,8);assert.equal(r.concurrencyLimitedIops,80000);assert.equal(r.limitingFactor,'Queue concurrency')});
test('caps result at the host ceiling',()=>{const r=calculateNvmeQueues({queues:16,depthPerQueue:64,latencyUs:100,deviceMaxIops:2e6,hostMaxIops:500000});assert.equal(r.effectiveIops,500000);assert.equal(r.limitingFactor,'Host stack')});
test('converts IOPS and block size into throughput',()=>{const r=calculateNvmeQueues({queues:1,depthPerQueue:1,latencyUs:1000,deviceMaxIops:1000,hostMaxIops:1000,blockKiB:4});assert.equal(r.throughputMiBps,3.90625)});
test('rejects fractional queue count',()=>{assert.throws(()=>calculateNvmeQueues({queues:1.5}),/integer/) });
