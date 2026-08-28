---
title: 7. iSCSI and Multipathing
description: Connect network reachability, discovery, authentication, sessions, LUN mappings and multipath policy.
sidebar:
  order: 70
---

## Outcome

Build and diagnose a redundant iSCSI path without confusing IP reachability, target discovery, authenticated session and usable multipath state.

**Level:** Practitioner · **Time:** 50 minutes · **Prerequisite:** SAN Architecture

## Learn

```text
NIC/VLAN/IP/MTU
→ target portal reachability
→ discovery
→ CHAP authentication
→ iSCSI session
→ LUN mapping
→ SCSI device
→ multipath grouping and policy
```

Each layer can succeed while the next fails. A ping does not prove discovery; discovery does not prove login; login does not prove LUN authorization; multiple devices do not prove correct multipath grouping.

## Practice

Use the Academy's iSCSI terminal to create a portal, target and LUN mapping, discover it, authenticate, establish sessions and validate multipathing. Trigger path loss and CHAP incidents and recover them.

## Check your understanding

1. What evidence separates a network problem from an authentication problem?
2. Why can two visible SCSI devices represent one LUN?
3. Which settings must match end to end before changing jumbo-frame MTU?

## Production boundary

Commands vary across initiator, target and operating-system implementations. Validate timeout, replacement-timeout, path-checker and queueing behavior for the deployed stack.

## Next step

Continue to [Operations and Incident Response](./operations/).
