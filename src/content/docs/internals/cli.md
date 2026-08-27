---
title: StorageCraft CLI
description: Colored terminal models for storage capacity and AI memory.
lastUpdated: 2026-08-27
sidebar:
  order: 1
---

The StorageCraft CLI turns common architecture calculations into fast, inspectable terminal models. It has no runtime dependencies beyond Node.js.

## Run from the repository

```bash
npm install
npm run craft -- topics
```

### RAID capacity

```bash
npm run craft -- raid --level 6 --disks 8 --size 4
```

This reports raw capacity, usable capacity, parity overhead, efficiency, and nominal drive-failure tolerance.

### KV-cache memory

```bash
npm run craft -- kv \
  --layers 32 --heads 32 --dim 128 \
  --tokens 8192 --bytes 2 --batch 1
```

The baseline model is:

```text
bytes = 2 × layers × KV heads × head dimension × tokens × bytes/element × batch
```

The leading `2` represents keys and values. For GQA or MQA, pass the number of **KV heads**, not attention query heads.

## Automation-friendly output

Set [`NO_COLOR`](https://no-color.org/) for plain output:

```bash
NO_COLOR=1 npm run craft -- raid --level 5 --disks 6 --size 8
```

## Scope

These are transparent educational models. Production sizing also requires filesystem reserve, device-vendor units, spares, rebuild exposure, allocator fragmentation, and serving-framework behavior.
