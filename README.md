# 🗄️ StorageCraft

**The open knowledge base where enterprise storage meets AI infrastructure.**

[![GitHub Stars](https://img.shields.io/github/stars/manmeetnain/storagecraft?style=flat-square)](https://github.com/manmeetnain/storagecraft/stargazers)
[![Docs Site](https://img.shields.io/badge/docs-live-brightgreen?style=flat-square)](https://manmeetnain.github.io/storagecraft)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg?style=flat-square)](CONTRIBUTING.md)

---

## 📖 What's inside

| Section | Description | Status |
|---|---|---|
| [🧠 Core Concepts](https://manmeetnain.github.io/storagecraft/concepts/write-amplification/) | WAL, Write Amplification, COW, Erasure Coding | 🟢 Live |
| [🤖 AI Infrastructure](https://manmeetnain.github.io/storagecraft/ai-infra/kv-cache/) | KV-Cache, vLLM, Flash Attention, GPU Memory | 🟢 Live |
| [🔮 Generative AI](https://manmeetnain.github.io/storagecraft) | LLM storage, RAG, Vector DBs, Agents | 🟡 Building |
| [⚙️ Storage Internals](https://manmeetnain.github.io/storagecraft) | NVMe, LSM Trees, RAID, ext4, ZFS | 🟡 Building |
| [🏢 Enterprise Storage](https://manmeetnain.github.io/storagecraft) | IBM FlashSystem, EMC PowerMax, SAN fabrics | 🟡 Building |
| [🔬 Simulators](https://manmeetnain.github.io/storagecraft/simulators/raid/index.html) | Interactive RAID, LSM Tree, SAN fabric | 🟡 Building |
| [📊 Benchmarks](https://manmeetnain.github.io/storagecraft) | Reproducible Python benchmark suite | 🔴 Coming |

---

## 🌐 Live Site

**[→ manmeetnain.github.io/storagecraft](https://manmeetnain.github.io/storagecraft)**

This is where you read the content — beautifully rendered with search, sidebar navigation, and code highlighting.

---

## 🔬 Live Simulators

**[▶ RAID-5 Visualizer](https://manmeetnain.github.io/storagecraft/simulators/raid/index.html)**
Write data, fail a disk, watch parity rebuild in real-time via XOR.

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

# Generate benchmark page from result JSON
python3 scripts/gen_benchmark_page.py --sample
```

---

## 🤝 Contributing

PRs welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 👤 Author

**Manmeet Nain** — Enterprise Storage Engineer × GenAI & AI Infrastructure

- GitHub: [@manmeetnain](https://github.com/manmeetnain)
- Docs: [manmeetnain.github.io/storagecraft](https://manmeetnain.github.io/storagecraft)
- Sponsor: [github.com/sponsors/manmeetnain](https://github.com/sponsors/manmeetnain)

---

*Enterprise Storage × Generative AI × Open Source · India 🇮🇳 · MIT License*
