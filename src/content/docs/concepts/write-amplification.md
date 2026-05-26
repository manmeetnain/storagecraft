---
title: Write Amplification
description: Understanding write amplification — the hidden cost multiplier in SSDs, LSM trees, and distributed storage.
sidebar:
  order: 1
  badge:
    text: Core
    variant: tip
lastUpdated: 2026-05-26
---

Write amplification (WA) is one of the most important concepts in storage systems. A single logical write from your application causes **multiple physical writes** inside the device or system.

## The formula

```
WAF = Physical bytes written / Logical bytes written
```

A WAF of 1.0 is ideal. In practice: 1.5–30+ depending on system and workload.

## Why it happens in SSDs

SSDs erase at **block level** (256KB–4MB) but write at **page level** (4KB). Result: updating 4KB can force reading, erasing, and rewriting an entire block.

```python
# Measure WAF from /proc/diskstats
def measure_waf(sectors_before, sectors_after, ops_before, ops_after):
    physical_kb = ((sectors_after - sectors_before) * 512) / 1024
    logical_ops = ops_after - ops_before
    return physical_kb / logical_ops if logical_ops > 0 else 0
```

## WAF in LSM trees

```python
levels, fan_out = 4, 10
print(f"Estimated LSM WAF: {levels * fan_out / 2}x")  # 20x
```

## Reducing WAF

| Technique | System | Effect |
|---|---|---|
| Sequential writes | SSD/HDD | 10–100x vs random |
| Over-provisioning | SSD | Less GC pressure |
| Tiered compaction | LSM | Fewer rewrites |
| Erasure coding | Distributed | 1.5x vs 3x replication |
