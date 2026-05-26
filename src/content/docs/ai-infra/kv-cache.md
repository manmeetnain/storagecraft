---
title: KV-Cache in LLM Inference
description: How the Key-Value cache works in transformer inference — and why it's the most important storage optimization in modern AI.
sidebar:
  order: 1
  badge:
    text: AI Infra
    variant: caution
lastUpdated: 2026-05-26
---

The KV-cache is the single most impactful performance optimization in LLM inference. Understanding it is essential for anyone building or scaling AI systems.

## The problem it solves

Transformers use **attention**: every output token attends to every previous token. Without caching, generating a 1000-token response requires recomputing attention for tokens 1–999 when generating token 1000.

```
Without KV-cache:
  Token 1:   1 attention computation
  Token 2:   2 attention computations  
  Token N:   N attention computations
  Total:     O(N²) computations ← quadratic!

With KV-cache:
  Token 1:   1 computation → store K,V in cache
  Token 2:   1 computation → append K,V to cache
  Token N:   1 computation → append K,V to cache
  Total:     O(N) computations ← linear!
```

## What gets cached

For each transformer layer, every token produces three vectors: **Query (Q)**, **Key (K)**, and **Value (V)**. During generation, Q changes every step (new token), but K and V for previous tokens are **static** — they never change.

```python
import torch

def attention_with_kv_cache(query, key_cache, value_cache, new_key, new_value):
    """
    query:       [1, d_head]      ← current token only
    key_cache:   [seq_len, d_head] ← all previous K vectors
    value_cache: [seq_len, d_head] ← all previous V vectors
    """
    # Append new K, V to cache
    key_cache   = torch.cat([key_cache,   new_key.unsqueeze(0)],   dim=0)
    value_cache = torch.cat([value_cache, new_value.unsqueeze(0)], dim=0)

    # Attention over full cached sequence
    scores = torch.matmul(query, key_cache.T)          # [1, seq_len]
    scores = scores / (query.shape[-1] ** 0.5)
    weights = torch.softmax(scores, dim=-1)
    output  = torch.matmul(weights, value_cache)       # [1, d_head]

    return output, key_cache, value_cache
```

## Memory cost of KV-cache

This is where storage becomes critical. KV-cache size for a single request:

```python
def kv_cache_bytes(num_layers, num_heads, head_dim, seq_len, dtype_bytes=2):
    """
    num_layers:  e.g. 32 (Llama-2-7B has 32 layers)
    num_heads:   e.g. 32
    head_dim:    e.g. 128
    seq_len:     max context length, e.g. 4096
    dtype_bytes: 2 for float16/bfloat16
    """
    per_token = num_layers * num_heads * head_dim * dtype_bytes * 2  # K + V
    total     = per_token * seq_len
    return total

# Llama-2-7B, 4096 token context, bfloat16
size = kv_cache_bytes(32, 32, 128, 4096, 2)
print(f"KV-cache per request: {size / 1e9:.2f} GB")
# Output: KV-cache per request: 1.07 GB
```

With 40 GB GPU RAM and 1 GB per request, you can serve **~37 concurrent users** — that's your throughput ceiling.

## PagedAttention (vLLM)

vLLM solved the KV-cache memory fragmentation problem by treating GPU memory exactly like OS virtual memory — **paged, demand-allocated**.

```
Traditional KV-cache:           PagedAttention (vLLM):
┌────────────────────┐          ┌──────┐ ┌──────┐ ┌──────┐
│ Request A (2048 tok)│          │Page 1│ │Page 3│ │Page 5│  ← Request A
│ [pre-allocated]    │          └──────┘ └──────┘ └──────┘
│ [wasted if shorter]│          ┌──────┐ ┌──────┐
├────────────────────┤          │Page 2│ │Page 4│           ← Request B
│ Request B (512 tok) │          └──────┘ └──────┘
│ [padded to max]    │
└────────────────────┘          Pages allocated on demand — no waste
```

Result: vLLM achieves **2–4x higher throughput** than naive implementations on the same hardware.

## Key takeaways

| Concept | Detail |
|---|---|
| What's cached | K and V vectors per layer, per token |
| Memory grows | Linearly with sequence length |
| GPU memory limit | Defines max concurrent requests |
| vLLM innovation | Paged KV-cache — eliminates fragmentation |
| Quantization win | INT8 KV-cache halves memory → 2x more users |

*See also: Flash Attention, GPU Memory Management, vLLM Architecture*
