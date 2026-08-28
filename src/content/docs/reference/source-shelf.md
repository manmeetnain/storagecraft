---
title: Standards and vendor source shelf
description: Primary references for validating StorageCraft concepts and simulated commands.
---

StorageCraft teaches portable mental models and a declared subset of vendor-style behavior. Use these primary sources to validate terminology, protocol details, and the exact software release used in production.

## Vendor-neutral foundations

- [SNIA Dictionary](https://www.snia.org/education/dictionary/about-dictionary) — technically reviewed terminology for storage, data, and storage networking.
- [SNIA Storage Networking & Information Management Primer](https://www.snia.org/education/storage_networking_primer) — vendor-neutral education across networked storage topics.
- [IETF RFC 7143: iSCSI Protocol](https://datatracker.ietf.org/doc/rfc7143/) — consolidated standards-track description of SCSI transport over TCP.

## Fibre Channel operations

- [Brocade Fabric OS 8.2.x Command Reference](https://docs.broadcom.com/doc/FOS-82x-Command-RM) — official command behavior for that documented release family.
- [Cisco MDS 9000 Fabric Configuration Guide 9.x: Zoning](https://www.cisco.com/c/en/us/td/docs/dcn/mds9000/sw/9x/configuration/fabric/cisco-mds-9000-nx-os-fabric-configuration-guide-9x/configuring_and_managing_zones.html) — official zoning concepts, configuration, and enforcement behavior.

## How to use sources

1. Match the product, platform, and exact release—not just the vendor name.
2. Separate protocol requirements from implementation-specific commands.
3. Record the reference version in change plans and incident evidence.
4. Treat simulator output as practice evidence, never as proof of production compatibility.

## Next step

Use the [glossary](../glossary/) for quick definitions, then follow the [Zero-to-SAN program](/storagecraft/learning/) and its explicit production boundaries.
