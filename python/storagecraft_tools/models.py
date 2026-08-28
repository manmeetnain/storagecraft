"""Additional dependency-free StorageCraft engineering models."""

from __future__ import annotations

import math


def erasure_coding(data: int, parity: int, dataset_tb: float, failures: int = 0) -> dict:
    if data <= 0 or parity <= 0 or dataset_tb <= 0 or failures < 0:
        raise ValueError("data, parity, and dataset must be positive; failures cannot be negative")
    total = data + parity
    efficiency = data / total
    physical = dataset_tb / efficiency
    return {"data": data, "parity": parity, "fragments": total, "logical_tb": dataset_tb, "physical_tb": physical, "overhead_tb": physical - dataset_tb, "efficiency": efficiency, "recoverable": total - failures >= data, "tolerated_failures": parity}


def nvme_queues(queues: int, depth: int, latency_us: float, device_iops: float, host_iops: float, block_kib: float = 4) -> dict:
    if min(queues, depth, latency_us, device_iops, host_iops, block_kib) <= 0:
        raise ValueError("all NVMe inputs must be positive")
    concurrency = queues * depth
    concurrency_iops = concurrency * 1_000_000 / latency_us
    effective = min(concurrency_iops, device_iops, host_iops)
    ceilings = {"queue concurrency": concurrency_iops, "NVMe device": device_iops, "host stack": host_iops}
    return {"concurrency": concurrency, "concurrency_limited_iops": concurrency_iops, "effective_iops": effective, "throughput_mib_s": effective * block_kib / 1024, "limiting_factor": min(ceilings, key=ceilings.get)}


def rag_storage(documents: int, avg_tokens: float, chunk_tokens: int, overlap_tokens: int = 64, dimensions: int = 1536, replicas: int = 2) -> dict:
    if min(documents, avg_tokens, chunk_tokens, dimensions, replicas) <= 0 or overlap_tokens < 0 or overlap_tokens >= chunk_tokens:
        raise ValueError("RAG inputs must be positive and overlap smaller than chunk size")
    stride = chunk_tokens - overlap_tokens
    chunks_per_document = max(1, math.ceil(max(0, avg_tokens - overlap_tokens) / stride))
    chunks = documents * chunks_per_document
    source = documents * avg_tokens * 4
    embeddings = chunks * dimensions * 4
    metadata = chunks * 512
    index = embeddings * .30
    total = source + (embeddings + metadata + index) * replicas
    return {"chunks_per_document": chunks_per_document, "chunks": chunks, "source_gib": source / 1024**3, "vector_primary_gib": (embeddings + metadata + index) / 1024**3, "total_physical_gib": total / 1024**3}


def gpu_memory(params_b: float, weight_bits: float, layers: int, kv_heads: int, head_dim: int, tokens: int, concurrency: int, gpus: int = 1, gpu_memory_gb: float = 80) -> dict:
    if min(params_b, weight_bits, layers, kv_heads, head_dim, tokens, concurrency, gpus, gpu_memory_gb) <= 0:
        raise ValueError("all GPU inputs must be positive")
    weights = params_b * 1e9 * weight_bits / 8 * 1.05 / 1024**3
    per_request_kv = 2 * layers * kv_heads * head_dim * tokens * 2 / 1024**3
    required = weights / gpus + per_request_kv * concurrency / gpus + 5
    usable = gpu_memory_gb * .90
    return {"total_weights_gib": weights, "per_request_kv_gib": per_request_kv, "required_per_gpu_gib": required, "usable_per_gpu_gib": usable, "headroom_gib": usable - required, "fits": required <= usable}
