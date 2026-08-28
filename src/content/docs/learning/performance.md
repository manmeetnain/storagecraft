---
title: 2. Performance Fundamentals
description: Connect IOPS, throughput, latency, block size, concurrency and queueing to observable storage behavior.
sidebar:
  order: 20
---

## Outcome

Calculate basic workload relationships and identify whether additional concurrency exposes service capacity or only adds waiting time.

**Level:** Foundation · **Time:** 40 minutes · **Prerequisite:** Storage Building Blocks

## Learn

```text
throughput ≈ IOPS × average transfer size
concurrency ≈ IOPS × average latency     (Little's Law, consistent units)
response time = service time + queueing time
```

IOPS without transfer size is incomplete. Throughput without latency distribution is incomplete. Average latency can hide a damaging tail, so operational reviews should include percentiles and workload shape.

Sequential access favors large transfers and locality. Random access increases seek, mapping, metadata or flash-translation pressure depending on the medium. Reads and writes may have different cache and protection paths.

## Practice

Open the [NVMe Queue Lab](/storagecraft/simulators/nvme-queues/). Hold the device ceiling constant, increase queue depth gradually and note the point where throughput stops improving while latency continues to rise.

## Check your understanding

1. What throughput does `25,000 IOPS × 16 KiB` approximately produce?
2. Why can higher queue depth increase benchmark throughput but harm an application SLO?
3. Which evidence would distinguish device saturation from fabric congestion?

## Production boundary

The lab is a queueing baseline. Real latency includes application, operating system, multipath, protocol, fabric, controller, cache and media behavior.

## Next step

Continue to [Data Protection and Recovery](./data-protection/).
