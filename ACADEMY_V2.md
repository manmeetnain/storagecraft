# Storage Network Academy v2 execution contract

Storage Network Academy v2 is a sequenced delivery program owned and maintained by **Manmeet Nain ([@manmeetnain](https://github.com/manmeetnain))**. Its purpose is to turn the existing safe terminal trainer into a multi-switch, dual-fabric practice environment with measurable job readiness.

## Automated release train

Only one stage is `active` in [`capsules/catalog.json`](capsules/catalog.json). A stage moves to `shipped` only after its model, tests, browser UI, documentation, CLI path, and CI gate exist and pass. The next highest-priority queued stage then becomes active.

| Order | Stage | Outcome | Promotion evidence |
|---:|---|---|---|
| 1 | Foundation and identity | One canonical brand contract and Academy-only CI | Brand tests, validator, visible attribution |
| 2 | Dual-fabric topology | Fabric A/B with Brocade and Cisco multi-switch state | Deterministic topology tests and live graph |
| 3 | Operations workspace | Multiple terminal sessions and advanced incidents | Cross-switch workflows and recovery assertions |
| 4 | Configuration safety | Scripts, diff, checkpoints, rollback | Idempotency and restoration tests |
| 5 | Governance | RBAC, audit trail, versioned compatibility profiles | Permission matrix and immutable event tests |
| 6 | Certification | Structured practical assessments and reports | Scoring rubric, downloadable evidence, accessibility |
| 7 | Release assurance | Dedicated end-to-end browser suite | Desktop/mobile journeys and Pages smoke test |

## Architecture boundaries

- **Simulation core:** deterministic, browser-local state; never connects to infrastructure.
- **Command profiles:** Brocade FOS-style, Cisco MDS NX-OS-style, and standards-based iSCSI; version-labelled and educational rather than vendor firmware emulation.
- **Topology:** devices, links, ports, fabrics, paths, and failure domains represented as serializable state.
- **Operations:** terminals issue commands against an explicitly selected simulated device and identity.
- **Evidence:** every mutation records actor, command, target, time, result, and reversible state reference.
- **Presentation:** accessible keyboard operation, responsive visuals, high-contrast status that does not rely on color alone.
- **Learning experience:** progressive disclosure through Start, Configure, Dual Fabric, Troubleshoot, and Certify stages; new learners see one guided action while experts retain direct full-workspace access.

## Current topology baseline

The v2 baseline models two isolated end-to-end FC paths. Fabric A and Fabric B each contain a Brocade-style switch and a Cisco MDS-style switch between `HOST-01` and `ARRAY-01`. The browser can fail and restore either fabric; the deterministic health evaluator reports `HEALTHY`, `DEGRADED`, or `OUTAGE`. Inspect the same baseline from the colored CLI with `npm run craft -- academy --topology`.

The operations workspace retains independent state for `FC-A1`, `MDS-A2`, `FC-B1`, `MDS-B2`, and `ISCSI-GW1`. Learners can switch terminals without losing configuration and practice total-fabric loss, cross-switch CRC escalation, and asymmetric-path recovery. List the workspace and incidents with `npm run craft -- academy --operations`.

Configuration safety uses explicit targets such as `[brocade-a1] switchname PROD-A1`. Scripts are atomic by default: any rejected command restores the complete pre-run workspace. Successful runs return path-level desired-state diffs, named checkpoints span every terminal and topology link, and rollback restores that serialized state. Run the CLI demonstration with `npm run craft -- academy --config-safety`.

Governance exposes Observer, Operator, and Administrator roles. Every attempted terminal command creates a chained audit event containing actor, role, device, versioned compatibility profile, allow/deny decision, result, and previous-event hash. The browser identifies Brocade FOS-style 9.2, Cisco MDS NX-OS-style 9.4, or standards-based iSCSI 2026 as educational compatibility surfaces rather than claims of exact vendor firmware emulation.

Practical certification covers fabric health (20%), dual-fabric incident recovery (25%), configuration safety (20%), governance (15%), and iSCSI operations (20%). Passing requires all five evidence-bearing tasks, an 80/100 weighted score, and at least 60/100 in every domain. The assessment center exports branded, machine-readable JSON and trainer-friendly CSV reports; incomplete reports remain downloadable for coaching and progress review.

## Definition of complete

The program is complete only when all seven v2 stages are shipped, `npm run check` passes, the dedicated Academy workflow passes, GitHub Pages serves the verified build, and the user journeys are browser-tested. Popularity is not promised; quality, discoverability, trustworthy attribution, and consistent release evidence are engineered.

## Verification commands

```bash
npm run check
npm run test:academy:e2e
npm run craft -- academy --topology
npm run craft -- academy --operations
npm run craft -- academy --config-safety
npm run craft -- academy --governance
npm run craft -- academy --certification --candidate "Storage Learner"
```

The E2E release gate executes seven journeys in desktop Chromium and a mobile viewport: identity/topology rendering, fabric failure and restoration, state retention across vendor terminals, atomic configuration and rollback, RBAC denial and audit verification, JSON/CSV certification downloads, and automated serious/critical accessibility plus horizontal-overflow checks.
