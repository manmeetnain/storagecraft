---
title: RAID-5 Visualizer
description: Write stripes, fail a disk, and watch parity rebuild the missing data.
lastUpdated: 2026-08-27
---

The interactive RAID-5 lab shows data and rotating parity placement across disks. Trigger writes, fail a drive, and observe the XOR reconstruction path.

<a class="sl-link-button primary" href="/storagecraft/simulators/raid/index.html">Launch interactive lab →</a>

## Experiment

1. Write two stripes and locate each parity block.
2. Fail a disk containing both data and parity.
3. Compare the displayed usable capacity before and during failure.
4. Start the rebuild and observe which surviving blocks participate.

RAID improves availability; it is not a backup. It does not independently protect against deletion, corruption propagated by software, credential compromise, or site loss.
