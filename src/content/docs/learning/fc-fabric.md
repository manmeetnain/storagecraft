---
title: 5. Fibre Channel Fabric Operations
description: Understand FC identities, login stages, name services, ports, ISLs, credits and health evidence.
sidebar:
  order: 50
---

## Outcome

Explain how an endpoint joins a fabric and run a structured fabric health inspection before changing configuration.

**Level:** Practitioner · **Time:** 55 minutes · **Prerequisite:** SAN Architecture

## Learn

- **WWNN/WWPN:** persistent node and port identities.
- **FCID:** fabric-assigned address for a logged-in port.
- **FLOGI:** fabric login and address acquisition.
- **PLOGI/PRLI:** endpoint/session establishment at later protocol stages.
- **Name server:** fabric database of registered identities and attributes.
- **ISL:** inter-switch link; its health and credit behavior affect many paths.
- **RSCN:** notification that registered fabric state changed.

Health inspection should move from scope to evidence: switch identity and time, fabric membership, port state, error counters, logins, name server, ISLs, zoning state, events and recent changes.

## Practice

Open the [Storage Network Academy](/storagecraft/simulators/network-academy/), begin at Basics, and complete the Brocade-style and Cisco-style inspection labs. Use the [command reference](/storagecraft/simulators/academy-command-reference/) when needed.

## Check your understanding

1. Why can link-up exist without a usable fabric login?
2. Which identity is persistent and which address is fabric-assigned?
3. Why should counters be correlated with time and traffic rather than read in isolation?

## Production boundary

Command availability and output vary by platform, license and release. The Academy is an original educational subset, not a firmware emulator.

## Next step

Continue to [Zoning and Safe Change](./zoning/).
