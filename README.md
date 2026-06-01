# 🗄️ StorageCraft

**The open knowledge base for storage systems and AI infrastructure.**

Deep dives into how storage actually works — from NVMe queue dispatch to KV-cache in LLM inference. Trusted content, reproducible benchmarks, and interactive simulators. All free, all open.

[![GitHub Stars](https://img.shields.io/github/stars/manmeetnain/storagecraft?style=flat-square)](https://github.com/manmeetnain/storagecraft/stargazers)
[![Docs Site](https://img.shields.io/badge/docs-live-brightgreen?style=flat-square)](https://manmeetnain.github.io/storagecraft)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg?style=flat-square)](CONTRIBUTING.md)

---

## 📖 What's inside

| Section | Description | Status |
|---|---|---|
| [Core Concepts](src/content/docs/concepts/) | WAL, write amplification, COW, erasure coding | 🟢 Live |
| [Storage Internals](src/content/docs/internals/) | ext4, ZFS, NVMe, LSM trees, RAID | 🟡 Building |
| [AI Infrastructure](src/content/docs/ai-infra/) | KV-cache, vLLM, Flash Attention, GPU memory | 🟡 Building |
| [Comparisons](src/content/docs/comparisons/) | S3 vs Azure Blob, Ceph vs MinIO, ext4 vs ZFS | 🔴 Soon |
| [Benchmarks](src/content/docs/benchmarks/) | Reproducible Python-scripted benchmarks | 🔴 Soon |
| [Simulators](docs/src/content/docs/simulators/) | Interactive RAID, LSM, consistent hashing | 🟡 Building |

---

## 🔬 Live Simulators

| Simulator | Description | Link |
|---|---|---|
| RAID-5 Visualizer | See parity, disk failures, rebuild in real-time | [▶ Launch](https://manmeetnain.github.io/storagecraft/simulators/raid/) |
| LSM Tree | Insert keys, watch compaction happen | Coming Week 4 |
| Consistent Hashing | Add/remove nodes, watch key redistribution | Coming Week 5 |

---

## 🚀 Quick start

```bash
git clone https://github.com/manmeetnain/storagecraft
cd storagecraft
npm install
npm run dev
# → http://localhost:4321/storagecraft
```

---

## 🐍 Python tooling

```bash
# Validate all doc frontmatter
python3 scripts/validate_frontmatter.py

# Generate a benchmark page from a result JSON
python3 scripts/gen_benchmark_page.py --sample

# Run content index generator
python3 scripts/gen_content_index.py
```

---

## 🤝 Contributing

Found an error? Want to add a deep dive? PRs are very welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 👤 Author

Built and maintained by **Manmeet Nain**

- GitHub: [@manmeetnain](https://github.com/manmeetnain)
- Email: manmeet.nain@gmail.com
- Support this work: [GitHub Sponsors](https://github.com/sponsors/manmeetnain)

---

*MIT License · Built in public · Every benchmark reproducible*
