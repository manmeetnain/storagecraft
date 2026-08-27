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

Priorities may change when repository traffic, search demand, user issues, or commercial enquiries provide better evidence.
