---
title: 1. Storage Building Blocks
description: Understand block, file and object access and map hosts, LUNs, volumes, filesystems and datastores.
sidebar:
  order: 10
---

## Outcome

Differentiate access models and trace an application request through the logical layers that turn physical capacity into usable storage.

**Level:** Foundation · **Time:** 35 minutes · **Prerequisite:** none

## Learn

| Layer | Provides | Does not automatically provide |
|---|---|---|
| Block storage | addressable fixed-size blocks exposed as a device/LUN | files, directories or shared-file coordination |
| File storage | named files and directories through a filesystem protocol | raw block control to the client |
| Object storage | key/object access with metadata through an API | POSIX block or file semantics by default |

```text
application → file/database → filesystem or volume manager → block device/LUN
            → host path → fabric/network → controller → pool/RAID → media
```

A **LUN** is an addressable block-storage presentation. A host may place a partition table, volume manager, filesystem, database or hypervisor datastore above it. These terms are layers, not interchangeable synonyms.

## Practice

Open the [Universal RAID Planner](/storagecraft/simulators/raid-planner/) and create an eight-disk layout. Record raw capacity, usable capacity, protection overhead and tolerated failures. Explain where that usable capacity could appear in the path above.

## Check your understanding

1. Why can two filesystems not safely mount the same ordinary block device for independent writes?
2. Which layer gives an application directories and filenames?
3. Why is a LUN not the same thing as a physical disk?

## Production boundary

Real arrays may virtualize pools, extents, compression and thin allocation. Product terminology varies; confirm the vendor's exact object hierarchy before operating it.

## Next step

Continue to [Performance Fundamentals](./performance/) and use the [glossary](/storagecraft/reference/glossary/) whenever a term is unfamiliar.
