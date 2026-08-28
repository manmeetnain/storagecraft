---
title: Instructor kit
description: Run StorageCraft as a structured workshop, onboarding path, or practical assessment.
---

## Suggested delivery

Use the [Zero-to-SAN program](/storagecraft/learning/) as the syllabus. A five-session cohort can cover foundations, protection/performance, SAN identity and paths, FC/iSCSI operations, then incidents and assessment.

## Session pattern

1. Ten-minute concept briefing.
2. Guided Learn-mode walkthrough.
3. Individual Practice-mode task.
4. Paired Challenge-mode incident.
5. Evidence review and short knowledge check.

## Assessment rubric

| Domain | Weight | Evidence |
|---|---:|---|
| Mental model | 20% | Explains the complete data path and fault domains |
| Command selection | 20% | Chooses read-only evidence before mutations |
| Troubleshooting | 25% | Tests a clear hypothesis and correlates layers |
| Change safety | 20% | Defines validation, abort, and rollback |
| Communication | 15% | Produces a concise timeline and handoff |

Recommended pass: 80% overall with no safety-critical omission. Reset simulator state between learners and ask them to submit evidence rather than screenshots without interpretation.

## Facilitation safety

State clearly that commands are simulated, vendor behavior varies by release, and learners must not copy mutation commands into production. Use the [runbooks](/storagecraft/runbooks/) as the operational standard and the [glossary](/storagecraft/reference/glossary/) for vocabulary.

## Contribute

Educators can propose scenarios through the [topic template](https://github.com/manmeetnain/storagecraft/issues/new?template=topic.yml) or improve a module through the repository edit link.
