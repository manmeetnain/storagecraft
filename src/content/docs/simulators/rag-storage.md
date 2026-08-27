---
title: RAG Storage Sizer
description: Estimate source, chunks, embeddings, metadata, vector indexes, and replicated storage.
lastUpdated: 2026-08-27
sidebar:
  order: 6
---

The RAG Storage Sizer models the capacity layers frequently omitted from embedding-only estimates.

<a class="sl-link-button primary" href="/storagecraft/simulators/rag-storage/index.html">Launch RAG Storage Sizer →</a>

## Chunk count

```text
stride = chunk tokens − overlap tokens
chunks/document = ceil((average tokens − overlap) / stride)
```

## Capacity layers

- source text;
- embedding values;
- metadata per chunk;
- vector-index overhead;
- replicated vector-store copies.

## CLI

```bash
npm run craft -- rag-size \
  --documents 1000000 --tokens 1200 \
  --chunk 512 --overlap 64 \
  --dimensions 1536 --embedding-bytes 4 \
  --metadata-bytes 512 --index-overhead 30 \
  --replicas 2
```

Production sizing must additionally include WAL, compaction amplification, deleted vector versions, snapshots, backups, caches, temporary ingest space, database minimum allocations, and measured index behavior.
