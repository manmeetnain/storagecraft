---
title: GPU Memory Anatomy for LLM Inference
description: Budget weights, KV cache, activations, runtime workspaces, and fragmentation.
lastUpdated: 2026-08-28
sidebar:
  order: 2
---

Model weights are only the first line of an inference memory budget. A serving system must fit weights, KV cache, temporary activations, runtime workspaces, graph captures, and allocator headroom at the same time.

## Memory map

| Region | Main driver | Lifetime |
|---|---|---|
| Weights | parameters, precision, quantization metadata | model residency |
| KV cache | aggregate live tokens and concurrency | request/prefix lifetime |
| Activations | batch shape, prefill length, kernel | operation/graph lifetime |
| Runtime workspace | kernels, collectives, compilation, graph captures | runtime-dependent |
| Allocator reserve | block pools and fragmentation | process lifetime |

## Working budget

```text
GPU memory ≈ weights + KV cache + activations + runtime workspace + fragmentation
```

### Weights

The rough lower bound is parameter count multiplied by bytes per stored parameter. Real deployments may add scales, zero points, duplicated embeddings, or tensor-parallel communication buffers.

### KV cache

KV-cache demand grows with active tokens and concurrency. Continuous batching makes the peak live-token count more important than the maximum context of one request.

```text
KV bytes = 2 × layers × KV heads × head dimension × live tokens × bytes/element
```

Grouped-query and multi-query attention reduce KV heads. Cache quantization reduces bytes per element but may add conversion cost and quality considerations.

### Activations and workspace

Prefill usually creates a different memory and compute profile from decoding. Attention kernels, collective communication, CUDA graphs, and compilation systems may reserve their own working regions.

## Why advertised capacity is not allocatable capacity

Allocators reserve blocks, requests have varying lifetimes, and serving frameworks retain pools for performance. A process can fail allocation even when the sum of live tensors appears smaller than physical capacity.

Tensor and pipeline parallelism also do not divide every region equally. Weights may shard predictably while KV cache, embeddings, communication buffers, or pipeline-stage allocations remain uneven.

## Sizing workflow

1. Measure resident weights after model load.
2. Measure prefill peak at the target prompt size.
3. Model KV-cache demand from maximum concurrent live tokens.
4. Include runtime reservations and fragmentation.
5. Apply operational headroom and validate with sustained traffic.

## Failure signatures

| Symptom | Likely class | Investigate |
|---|---|---|
| OOM at model load | resident footprint | precision, quantization metadata, shard balance |
| OOM during long prefill | activation/workspace peak | prompt length, batch shape, kernel workspace |
| OOM under concurrency | KV pool pressure | live tokens, cache precision, scheduling limits |
| free memory but allocation fails | fragmentation/reservation | allocator state, graph pools, block sizes |
| one rank fails first | uneven sharding | per-rank weights, KV heads, pipeline allocation |

## Operational guardrails

- measure every rank, not only aggregate GPU memory;
- separate cold-load, prefill, decode, and sustained-concurrency peaks;
- reserve capacity for workload variance and runtime updates;
- load-test cancellation, long prompts, and bursty arrivals;
- record model revision, runtime version, kernel choice, and cache precision with every result.

Use the [StorageCraft CLI](/storagecraft/internals/cli/) for a transparent KV-cache baseline.

Use the [GPU Memory Planner](/storagecraft/simulators/gpu-memory/) to combine weights, KV cache, runtime workspace, tensor parallelism, headroom, and modeled concurrency.
