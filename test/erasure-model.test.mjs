import test from 'node:test'; import assert from 'node:assert/strict';
import { calculateErasure, compareReplication } from '../public/lib/erasure-model.js';

test('calculates 10+4 coding efficiency and capacity',()=>{const r=calculateErasure({data:10,parity:4,dataset:100});assert.equal(r.efficiency,10/14);assert.equal(r.physical,140);assert.equal(r.toleratedFailures,4)});
test('detects recoverable and unrecoverable fragment loss',()=>{assert.equal(calculateErasure({data:6,parity:3,failures:3}).recoverable,true);assert.equal(calculateErasure({data:6,parity:3,failures:4}).recoverable,false)});
test('compares with replication',()=>{const r=calculateErasure({data:10,parity:4,dataset:100});const rep=compareReplication(r,3);assert.equal(rep.physical,300);assert.equal(rep.saving,160)});
test('rejects invalid parameters',()=>{assert.throws(()=>calculateErasure({data:0}),/data fragments/);assert.throws(()=>calculateErasure({failures:-1}),/non-negative/)});
