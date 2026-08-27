---
title: NVMe Queue Lab
description: Connect queue count, depth, latency, device limits, and host limits to IOPS and throughput.
lastUpdated: 2026-08-27
sidebar:
  order: 8
---

The NVMe Queue Lab shows when parallel queues expose device performance—and when the host or device has already become the ceiling.

<a class="sl-link-button primary" href="/storagecraft/simulators/nvme-queues/index.html">Launch NVMe Queue Lab →</a>

## Queue ceiling

Using Little's Law as a steady-state approximation:

```text
outstanding concurrency = queues × depth per queue
concurrency-limited IOPS = outstanding concurrency / average latency (seconds)
effective IOPS = min(concurrency ceiling, device ceiling, host ceiling)
throughput MiB/s = effective IOPS × block KiB / 1024
```

Adding queue depth only improves modeled IOPS while queue concurrency is the limit. Once the device or host stack limits the path, deeper queues increase outstanding work without increasing throughput and may worsen tail latency.

## CLI

```bash
npm run craft -- nvme-queues \
  --queues 8 --depth 32 --latency 100 \
  --device-iops 1000000 --host-iops 800000 --block 4
```

This is a sizing model, not an NVMe benchmark. Confirm behavior with the target controller, namespace, NUMA placement, I/O engine, read/write mix, access pattern, cache policy, CPU affinity, power state, and latency percentiles.
