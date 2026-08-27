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
| 100 | Universal RAID Planner | Shipped | Storage and infrastructure engineers |
| 95 | Erasure Coding Lab | Shipped | Distributed-storage and cloud engineers |
| 92 | Write Amplification Explorer | Shipped | Database, SSD, filesystem, and AI-data engineers |
| 90 | LSM-Tree Compaction Lab | Active | Database and vector-database engineers |
| 88 | GPU Memory Planner | Queued | LLM inference engineers |
| 86 | RAG Storage Sizer | Queued | RAG platform engineers |
| 82 | AI Data Path Lab | Queued | AI infrastructure architects |
| 78 | NVMe Queue Lab | Queued | Systems and performance engineers |
| 76 | SAN Failure-Domain Lab | Queued | Enterprise storage engineers |

Priorities may change when repository traffic, search demand, user issues, or commercial enquiries provide better evidence.
