# StorageCraft execution roadmap

This roadmap is generated conceptually from [`capsules/catalog.json`](capsules/catalog.json), the machine-readable source of truth enforced in CI.

## Release contract

A capsule can move to `shipped` only when it has:

1. A deterministic calculation or simulation model
2. Automated boundary and correctness tests
3. A responsive, accessible browser experience
4. Canonical documentation with assumptions and limitations
5. A colored CLI workflow
6. A successful quality and deployment run

## Queue

| Priority | Capsule | State | Primary audience |
|---:|---|---|---|
| 140 | Academy v2 foundation and identity | Shipped | Contributors and Academy learners |
| 138 | Academy dual-fabric topology | Shipped | SAN engineers and new hires |
| 136 | Academy multi-session incident operations | Shipped | Operations and incident teams |
| 134 | Academy configuration safety | Shipped | Switch administrators |
| 132 | Academy governance and version profiles | Shipped | Enterprise platform teams |
| 130 | Academy practical certification | Shipped | Learners, trainers, and hiring teams |
| 128 | Academy end-to-end release assurance | Shipped | Maintainers and contributors |
| 120 | Storage Network Academy | Shipped | New hires, students, and SAN operations teams |
| 100 | Universal RAID Planner | Shipped | Storage and infrastructure engineers |
| 95 | Erasure Coding Lab | Shipped | Distributed-storage and cloud engineers |
| 92 | Write Amplification Explorer | Shipped | Database, SSD, filesystem, and AI-data engineers |
| 90 | LSM-Tree Compaction Lab | Shipped | Database and vector-database engineers |
| 88 | GPU Memory Planner | Shipped | LLM inference engineers |
| 86 | RAG Storage Sizer | Shipped | RAG platform engineers |
| 82 | AI Data Path Lab | Shipped | AI infrastructure architects |
| 78 | NVMe Queue Lab | Shipped | Systems and performance engineers |
| 76 | SAN Failure-Domain Lab | Shipped | Enterprise storage engineers |
| 75 | Learner progress and evidence dashboard | Shipped | Self-directed learners and hiring teams |

## Next evidence-driven releases

| Priority | Work item | State | Acceptance signal |
|---:|---|---|---|
| 74 | Reproducible benchmark capsule | Planned | Dataset, environment capture, repeatable result, and interpretation guide |
| 72 | Backup and replication recovery lab | Planned | RPO/RTO scenarios with restore validation and failure injection |
| 70 | Host multipathing deep-dive | Planned | Linux path-state simulation, ALUA policy, and controlled failover |
| 68 | Enterprise array operations lab | Discovery | Vendor-neutral pools, volumes, hosts, snapshots, replication, and alerts |
| 66 | AI checkpoint and data pipeline lab | Discovery | Checkpoint sizing, restart time, throughput, and tiering trade-offs |
| 64 | Instructor scenario pack | Planned | Facilitator notes, evidence rubric, resettable cohorts, and answer keys |

## Python companion direction

The Python package now provides a tested foundation for notebooks, automation, and community contributions, including all-RAID parity, erasure coding, NVMe queues, RAG sizing, and GPU-memory planning. Next candidates are browser/Python parity fixtures, richer report export, benchmark datasets, and versioned package releases.

## Learning resources outside the capsule pipeline

The [AI Resource & Prompt Hub](https://manmeetnain.github.io/storagecraft/ai-resource-hub/index.html) is a curated learning surface rather than a deterministic engineering capsule. It is covered by repository-wide desktop/mobile browser, accessibility, interaction, and deployment gates.

Priorities may change when repository traffic, search demand, user issues, or commercial enquiries provide better evidence.
