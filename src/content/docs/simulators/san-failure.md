---
title: SAN Failure-Domain Lab
description: Test fabric, host-port, controller, target-port, multipath, and application-timeout resilience.
lastUpdated: 2026-08-27
sidebar:
  order: 9
---

The SAN Failure-Domain Lab separates physical reachability from application recovery. A surviving path is necessary, but it is not sufficient if multipath recovery exceeds the workload's I/O timeout.

<a class="sl-link-button primary" href="/storagecraft/simulators/san-failure/index.html">Launch SAN Failure-Domain Lab →</a>

## Modeled domains

- independent fabrics;
- host initiator ports per fabric;
- active storage controllers;
- target ports per controller and fabric;
- multipath failover duration versus application timeout.

The lab reports **healthy**, **degraded**, or **outage**, and makes the timeout outcome explicit.

## CLI

```bash
npm run craft -- san-failure \
  --fabrics 2 --host-ports 1 \
  --controllers 2 --target-ports 1 \
  --fail-fabrics 1 --failover 8 --timeout 30
```

The active-path count is an aggregate estimate. It cannot prove that surviving initiator and target ports meet on the same fabric. Production validation must inspect cabling, zoning, name-server visibility, masking, ALUA/ANA states, multipath policy, host and application timeouts, array controller semantics, and quorum dependencies.
