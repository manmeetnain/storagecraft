<div align="center">
  <img src="public/brand/storagecraft-social.png" alt="Storage systems connected to an AI compute fabric" width="100%">

  # StorageCraft

  **Learn and operate the data path—from first principles to production-minded practice.**

  Interactive labs, transparent engineering models, and visual deep dives spanning storage internals, distributed data, and LLM infrastructure.

  [![Learning Path](https://img.shields.io/badge/START-ZERO_TO_SAN-0f766e?style=for-the-badge)](https://manmeetnain.github.io/storagecraft/learning/)
  [![Progress](https://img.shields.io/badge/TRACK-LEARNING_PROGRESS-0e7490?style=for-the-badge)](https://manmeetnain.github.io/storagecraft/learning-dashboard/index.html)
  [![Live Lab](https://img.shields.io/badge/LAUNCH-NETWORK_ACADEMY-2563eb?style=for-the-badge)](https://manmeetnain.github.io/storagecraft/simulators/network-academy/)
  [![AI Hub](https://img.shields.io/badge/EXPLORE-AI_PROMPT_HUB-a78bfa?style=for-the-badge)](https://manmeetnain.github.io/storagecraft/ai-resource-hub/index.html)
  [![Documentation](https://img.shields.io/badge/EXPLORE-DOCUMENTATION-8b5cf6?style=for-the-badge)](https://manmeetnain.github.io/storagecraft/)
  [![Sponsor](https://img.shields.io/badge/SPONSOR-THE_LAB-34d399?style=for-the-badge)](https://github.com/sponsors/manmeetnain)

  [![Quality](https://github.com/manmeetnain/storagecraft/actions/workflows/quality.yml/badge.svg)](https://github.com/manmeetnain/storagecraft/actions/workflows/quality.yml)
  [![Deploy](https://github.com/manmeetnain/storagecraft/actions/workflows/deploy.yml/badge.svg)](https://github.com/manmeetnain/storagecraft/actions/workflows/deploy.yml)
  [![GitHub stars](https://img.shields.io/github/stars/manmeetnain/storagecraft?style=flat-square&color=22d3ee)](https://github.com/manmeetnain/storagecraft/stargazers)
  [![License: MIT](https://img.shields.io/badge/license-MIT-8b5cf6.svg?style=flat-square)](LICENSE)
</div>

## Why StorageCraft exists

The storage layer is usually invisible—until latency spikes, a disk fails, compaction stalls, or an LLM server runs out of memory. StorageCraft exposes those mechanisms through experiments you can operate and models you can inspect.

> **New here?** Start the ordered **[StorageCraft Foundations: Zero-to-SAN Engineer](https://manmeetnain.github.io/storagecraft/learning/)** program. Use Learn, Practice, Challenge, and Assess modes to progress from storage vocabulary to fabric operations and incident response.

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

### Python toolkit

```bash
PYTHONPATH=python python3 -m storagecraft_tools.cli raid --level 6 --disks 8 --size 4
PYTHONPATH=python python3 -m storagecraft_tools.cli raid --compare --disks 12 --size 8 --groups 2
PYTHONPATH=python python3 -m storagecraft_tools.cli learn
```

The dependency-free [Python package](python/storagecraft_tools) exposes typed, tested functions for notebooks and automation. It covers JBOD; RAID 0–6, 01, 10, 50, and 60; RAID-Z1/Z2/Z3; erasure coding; NVMe queues; RAG storage; and GPU memory. Start with the executable [quick-start notebook](notebooks/storagecraft_quickstart.ipynb), and use the browser planner for visual comparison.

## Guided learning program

| Stage | Capability | Practice |
|---:|---|---|
| 1–3 | Storage types, performance, RAID, erasure coding, backup, RPO/RTO | RAID and erasure-coding labs |
| 4–6 | SAN paths, FC identity/login, zoning and masking | Network Academy Learn + Practice modes |
| 7–8 | iSCSI, multipathing, daily operations, incident handling | Failure labs, runbooks, Challenge mode |
| 9 | Explain, operate, troubleshoot, and communicate safely | Practical assessment |

The program is backed by [`learning/catalog.json`](learning/catalog.json), validated in CI, and supported by a [progress and evidence dashboard](https://manmeetnain.github.io/storagecraft/learning-dashboard/index.html), [glossary](https://manmeetnain.github.io/storagecraft/reference/glossary/), [operations runbooks](https://manmeetnain.github.io/storagecraft/runbooks/), and [instructor kit](https://manmeetnain.github.io/storagecraft/instructors/).

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
| [Storage Network Academy](https://manmeetnain.github.io/storagecraft/simulators/network-academy/index.html) | How can a new hire safely practice FC switching and iSCSI operations? | Stateful terminal academy + guided labs |
| [Manmeet AI Command Center](https://manmeetnain.github.io/storagecraft/ai-resource-hub/index.html) | Which AI platform, capability, skill, connector, shortcut, or prompt pattern fits the job? | Multi-platform deep-dive guide and interactive prompt console |

## Roadmap

- [x] RAID failure and rebuild lab
- [x] Universal RAID planner and RAID/KV-cache CLI models
- [x] Storage internals and AI-infrastructure foundation
- [x] Erasure Coding Lab v1
- [x] Write Amplification Explorer v1
- [x] GPU Memory Planner
- [x] RAG Storage Sizer
- [x] AI Data Path Lab
- [x] Storage Network Academy: Brocade-style FC, Cisco MDS-style FC, and iSCSI
- [x] Storage Network Academy v2: dual fabrics, multi-switch operations, incidents, configuration safety, governance, certification, and desktop/mobile E2E ([execution contract](ACADEMY_V2.md))
- [x] Zero-to-SAN curriculum, glossary, operational runbooks, and instructor kit
- [x] Learner progress, milestone badges, and portable evidence export
- [x] Full Python model parity foundation and executable notebook
- [ ] Reproducible benchmark capsule format

Vote for the next capsule through a [topic proposal](https://github.com/manmeetnain/storagecraft/issues/new?template=topic.yml), ask a learning question in [Discussions](https://github.com/manmeetnain/storagecraft/discussions), or follow versioned changes in the [changelog](CHANGELOG.md).

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
