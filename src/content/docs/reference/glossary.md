---
title: Storage and SAN glossary
description: Plain-language definitions for the terms used throughout StorageCraft.
---

Use this page when a lab introduces an unfamiliar term. Definitions describe the learning model; vendor implementations can add constraints.

## Storage foundations

- **Block storage:** numbered fixed-size blocks presented to a host, which normally adds a filesystem or database layout.
- **File storage:** named files and directories exported through a file protocol such as NFS or SMB.
- **Object storage:** objects addressed by key and accessed through an API, with metadata stored alongside content.
- **LUN:** a logical block-storage unit exposed by a target.
- **RAID:** a method of combining devices for capacity, performance, and/or failure tolerance.
- **Erasure coding:** protection that divides data into fragments and computes independent parity fragments.
- **Snapshot:** a point-in-time logical view; it is not automatically an independent backup.
- **RPO / RTO:** acceptable data-loss window / acceptable service-restoration time.
- **IOPS / throughput / latency:** operations per second / bytes per second / time per operation.

## Fibre Channel and SAN

- **Fabric:** interconnected Fibre Channel switches operating as one routing domain.
- **WWPN:** globally unique identifier for an FC port.
- **FCID:** fabric-assigned address used for frame routing.
- **FLOGI:** login that registers an endpoint with a fabric.
- **Name server:** fabric directory mapping registered identities and attributes.
- **Zone:** policy that controls which initiators and targets can discover one another.
- **Zoning:** fabric-side visibility control; it does not replace array-side LUN masking.
- **ISL:** inter-switch link carrying frames between switches.
- **RSCN:** registered state-change notification sent after relevant fabric changes.
- **NPIV:** multiple virtual FC identities sharing a physical port.

## iSCSI and multipathing

- **Initiator / target:** client that requests block I/O / service that presents block devices.
- **IQN:** iSCSI Qualified Name used as an endpoint identity.
- **Portal:** target IP address and TCP port used for discovery or login.
- **Session:** authenticated iSCSI relationship between initiator and target.
- **Multipathing:** host aggregation of redundant routes to the same logical device.
- **ALUA:** protocol by which a target reports optimized and non-optimized paths.

## AI data systems

- **Embedding:** numeric vector representing content for similarity search.
- **RAG:** retrieval-augmented generation, where external context is retrieved before generation.
- **KV cache:** attention key/value state retained for active model tokens.
- **Checkpoint:** persisted model or training state used to resume or deploy work.

## Next step

Follow the [Zero-to-SAN learning program](/storagecraft/learning/) or use the [daily health-check runbook](/storagecraft/runbooks/daily-health-check/).
