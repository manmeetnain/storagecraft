---
title: Erasure Coding
description: Turn data into recoverable fragments with lower capacity overhead than replication.
lastUpdated: 2026-08-27
sidebar:
  order: 4
---

An erasure code transforms `k` data fragments into `k + m` total fragments. Any `k` suitable fragments can reconstruct the original data; the `m` coding fragments provide failure tolerance.

## Capacity efficiency

For a `(k, m)` layout:

```text
efficiency = k / (k + m)
overhead   = m / k
```

A `(10, 4)` code stores 10 units of data using 14 units of physical capacity: **71.4% efficiency** and **40% overhead relative to the data**. Three-way replication is only 33.3% efficient.

## Why it is not “RAID across servers”

The mathematics may resemble parity RAID, but distributed erasure coding must also handle:

- fragment placement across correlated failure domains;
- network fan-out and tail latency;
- degraded reads and repair bandwidth;
- metadata consistency;
- partial writes and small-object packing;
- background scrubbing and silent corruption.

## Read and repair paths

A healthy read may need only the `k` data fragments. A degraded read retrieves extra fragments and performs decoding. Repair reconstructs missing fragments and writes them to new locations, consuming CPU, network, and storage bandwidth simultaneously.

## Choosing parameters

Larger `k` generally improves capacity efficiency but increases fan-out and the number of resources involved in recovery. Larger `m` tolerates more failures but costs capacity and repair work.

Choose parameters from durability, correlated-failure, recovery-time, bandwidth, latency, and object-size requirements—not capacity efficiency alone.

## Failure-domain checklist

1. Never count fragments in the same failure domain as independent protection.
2. Model simultaneous maintenance and hardware failure.
3. Bound repair time under realistic throttling.
4. Test loss of metadata separately from loss of data fragments.
5. Scrub continuously; redundancy cannot repair corruption it never detects.
