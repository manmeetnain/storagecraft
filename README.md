<div align="center">
  <img src="public/brand/storagecraft-social.png" alt="Storage systems connected to an AI compute fabric" width="100%">

  # StorageCraft

  **Operate the data path beneath modern AI.**

  Interactive labs, transparent engineering models, and visual deep dives spanning storage internals, distributed data, and LLM infrastructure.

  [![Live Lab](https://img.shields.io/badge/LAUNCH-RAID_PLANNER-22d3ee?style=for-the-badge)](https://manmeetnain.github.io/storagecraft/simulators/raid-planner/index.html)
  [![Documentation](https://img.shields.io/badge/EXPLORE-DOCUMENTATION-8b5cf6?style=for-the-badge)](https://manmeetnain.github.io/storagecraft/)
  [![Sponsor](https://img.shields.io/badge/SPONSOR-THE_LAB-34d399?style=for-the-badge)](https://github.com/sponsors/manmeetnain)

  [![Quality](https://github.com/manmeetnain/storagecraft/actions/workflows/quality.yml/badge.svg)](https://github.com/manmeetnain/storagecraft/actions/workflows/quality.yml)
  [![Deploy](https://github.com/manmeetnain/storagecraft/actions/workflows/deploy.yml/badge.svg)](https://github.com/manmeetnain/storagecraft/actions/workflows/deploy.yml)
  [![GitHub stars](https://img.shields.io/github/stars/manmeetnain/storagecraft?style=flat-square&color=22d3ee)](https://github.com/manmeetnain/storagecraft/stargazers)
  [![License: MIT](https://img.shields.io/badge/license-MIT-8b5cf6.svg?style=flat-square)](LICENSE)
</div>

## Why StorageCraft exists

The storage layer is usually invisible—until latency spikes, a disk fails, compaction stalls, or an LLM server runs out of memory. StorageCraft exposes those mechanisms through experiments you can operate and models you can inspect.

| Explore | Operate | Measure |
|---|---|---|
| Canonical systems explanations | Browser-based failure labs | Capacity and memory calculators |
| Storage × AI learning paths | Colored terminal workflows | Explicit formulas and assumptions |
| Production trade-off checklists | Shareable, zero-install demos | Reproducible benchmarks—next |

## Try it in 60 seconds

### Browser lab

Open the **[Universal RAID Planner](https://manmeetnain.github.io/storagecraft/simulators/raid-planner/index.html)** to compare RAID 0–6, nested RAID, and RAID-Z. Then use the focused **[RAID-5 Visualizer](https://manmeetnain.github.io/storagecraft/simulators/raid/index.html)** to write stripes, fail a disk, and watch XOR reconstruction.

### Colored CLI

```bash
git clone https://github.com/manmeetnain/storagecraft.git
cd storagecraft
npm install
npm run craft -- raid --level 60 --disks 16 --size 8 --groups 2
npm run craft -- raid --compare --disks 12 --size 8 --groups 2
npm run craft -- kv --layers 32 --heads 8 --dim 128 --tokens 8192 --bytes 2
```

The CLI uses no additional runtime dependencies and respects the [`NO_COLOR`](https://no-color.org/) convention.

## Current learning capsules

| Path | Core question | Artifact |
|---|---|---|
| [Write Amplification](https://manmeetnain.github.io/storagecraft/concepts/write-amplification/) | Why does one logical write become many physical writes? | Deep dive |
| [Write-Ahead Log](https://manmeetnain.github.io/storagecraft/concepts/write-ahead-log/) | How is a mutation made crash-safe? | Deep dive |
| [Copy-on-Write](https://manmeetnain.github.io/storagecraft/concepts/copy-on-write/) | How do immutable updates enable snapshots? | Deep dive |
| [Erasure Coding](https://manmeetnain.github.io/storagecraft/concepts/erasure-coding/) | How is durability traded against capacity and repair cost? | Deep dive |
| [KV Cache](https://manmeetnain.github.io/storagecraft/ai-infra/kv-cache/) | Why does inference memory grow with live tokens? | AI-infra deep dive |
| [GPU Memory Anatomy](https://manmeetnain.github.io/storagecraft/ai-infra/gpu-memory/) | What competes for accelerator memory? | Sizing workflow |
| [RAID-5](https://manmeetnain.github.io/storagecraft/simulators/raid/index.html) | How does distributed parity recover missing data? | Interactive lab |
| [Universal RAID Planner](https://manmeetnain.github.io/storagecraft/simulators/raid-planner/index.html) | How do standard, nested, and RAID-Z layouts compare? | Interactive planner + CLI |
| [Erasure Coding Lab](https://manmeetnain.github.io/storagecraft/simulators/erasure-coding/index.html) | How does k+m coding trade capacity for recoverability? | Interactive failure lab + CLI |
| [Write Amplification Explorer](https://manmeetnain.github.io/storagecraft/simulators/write-amplification/index.html) | How does one logical write multiply through the full stack? | Interactive pipeline + CLI |
| [LSM-Tree Compaction Lab](https://manmeetnain.github.io/storagecraft/simulators/lsm-compaction/index.html) | How do leveled and tiered policies trade writes, reads, and space? | Interactive policy lab + CLI |
| [GPU Memory Planner](https://manmeetnain.github.io/storagecraft/simulators/gpu-memory/index.html) | Will an LLM serving configuration fit per GPU? | Interactive inference planner + CLI |
| [RAG Storage Sizer](https://manmeetnain.github.io/storagecraft/simulators/rag-storage/index.html) | What is the full source, chunk, vector, index, and replica footprint? | Interactive AI-data planner + CLI |
| [AI Data Path Lab](https://manmeetnain.github.io/storagecraft/simulators/ai-data-path/index.html) | Which storage, fabric, CPU, or accelerator stage limits an AI workload? | Interactive bottleneck lab + CLI |
| [NVMe Queue Lab](https://manmeetnain.github.io/storagecraft/simulators/nvme-queues/index.html) | When do queue count and depth expose performance versus add latency? | Interactive queue lab + CLI |
| [SAN Failure-Domain Lab](https://manmeetnain.github.io/storagecraft/simulators/san-failure/index.html) | Will storage remain reachable—and recover before the workload times out? | Interactive resilience lab + CLI |

## Roadmap

- [x] RAID failure and rebuild lab
- [x] Universal RAID planner and RAID/KV-cache CLI models
- [x] Storage internals and AI-infrastructure foundation
- [x] Erasure Coding Lab v1
- [x] Write Amplification Explorer v1
- [x] GPU Memory Planner
- [x] RAG Storage Sizer
- [x] AI Data Path Lab
- [ ] Reproducible benchmark capsule format

Vote for the next capsule through a [topic proposal](https://github.com/manmeetnain/storagecraft/issues/new?template=topic.yml).

## Quality contract

Every flagship capsule should include a learning objective, explicit assumptions, a visual or executable model, failure behavior, production limitations, automated validation, and a contribution entry point.

```bash
npm run check
npm run craft -- doctor
```

## Contribute

Storage engineers, ML-systems engineers, database practitioners, educators, technical writers, and accessible-design contributors are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md), open a focused proposal, or improve an explanation with a primary source.

## Maintainer

Built by **[Manmeet Nain](https://github.com/manmeetnain)**—Enterprise Storage Engineer working across IBM, EMC, Brocade, Cisco, SAN/NAS, and AI infrastructure in India.

If StorageCraft helps your work, [star the repository](https://github.com/manmeetnain/storagecraft), share a lab, or [sponsor its development](https://github.com/sponsors/manmeetnain).

---

<div align="center"><sub>Educational engineering software · Validate assumptions before production use · MIT</sub></div>
