---
title: AI Infrastructure Index
description: A high-level map of GPU memory, KV cache, RAG storage, and the end-to-end AI data path.
sidebar:
  order: 0
  label: Start here
---

## AI infrastructure, from storage to token

AI serving performance is a pipeline property. Model quality may dominate product value, but storage, network, host memory, accelerator memory, runtime scheduling, and cache policy determine whether the system can serve reliably.

| Layer | Core question | Operate it |
|---|---|---|
| [GPU memory](./gpu-memory/) | What competes for accelerator capacity? | [GPU Memory Planner](/storagecraft/simulators/gpu-memory/) |
| [KV cache](./kv-cache/) | How do live tokens trade compute for memory? | [KV baseline CLI](/storagecraft/internals/cli/) |
| RAG storage | What is the source, chunk, vector, index, and replica footprint? | [RAG Storage Sizer](/storagecraft/simulators/rag-storage/) |
| AI data path | Which stage limits training or inference movement? | [AI Data Path Lab](/storagecraft/simulators/ai-data-path/) |
| NVMe queues | Does concurrency expose performance or create delay? | [NVMe Queue Lab](/storagecraft/simulators/nvme-queues/) |

## Serving memory equation

```text
resident weights
+ KV cache for aggregate live tokens
+ activation peaks
+ kernel / collective / graph workspace
+ allocator reserve and fragmentation
= required per-rank memory
```

## Triage order

1. Establish the exact workload: model revision, precision, prompt/output distribution, concurrency, and latency target.
2. Measure cold load, prefill, decode, and sustained traffic separately.
3. Inspect every rank and every data-path stage instead of relying on aggregate capacity.
4. Change one constraint at a time and verify throughput, latency, quality, and failure behavior.
