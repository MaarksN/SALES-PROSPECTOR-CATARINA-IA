## 2024-05-23 - Missing Database Index on Timeline

**Learning:** The `TimelineController` performs a query on `Communication` filtering by `contactId` and sorting by `createdAt` without a composite index. This forces a sequence scan, which degrades performance as the table grows.
**Action:** Always check `orderBy` clauses in Prisma queries and ensure a composite index exists covering the `where` and `orderBy` fields. For `Communication`, added `@@index([contactId, createdAt])`.

## 2024-05-25 - Missing Database Index on Contact Leads

**Learning:** The `SalesService.getLeads` query filters `Contact` by `orgId` and sorts by `createdAt` (desc). The existing index `@@index([orgId])` is insufficient for the sort, potentially causing slow queries on large datasets.
**Action:** Replaced `@@index([orgId])` with `@@index([orgId, createdAt])` in `Contact` model to enable index-based sorting.

## 2026-02-08 - React.memo with Custom Comparator

**Learning:** When rendering lists where item objects are recreated on every fetch (new references), standard `React.memo` is ineffective. A custom comparator checking IDs and timestamps (or content) is required. Crucially, function props (like `onClick`) must be checked first to avoid stale closures where the component holds onto old function references.
**Action:** Implement `React.memo` with a custom comparator that checks function props equality first, then ID/Timestamp equality, and falls back to specific content field comparison.

## 2026-02-11 - Missing RAG Database Indexes
**Learning:** The `VectorService` performs a join between `Embedding` and `Document` and filters by `Document.orgId`. Without indexes on `Document(orgId)` and `Embedding(documentId)`, this query is inefficient, potentially causing full table scans. Similarly, `PromptManager` queries `PromptVersion` by `promptId`, which also lacked an index.
**Action:** Added `@@index([orgId])` to `Document`, `@@index([documentId])` to `Embedding`, and `@@index([promptId])` to `PromptVersion` in `schema.prisma`.

## 2026-02-12 - Optimizing Large Client-Side Lists
**Learning:** `LeadList` fetches all leads (potentially thousands) and filters them on the client. Without strict memoization of the list component (`LeadGrid`), typing in the search box causes expensive re-renders of the entire list, degrading input responsiveness.
**Action:** Extract list rendering into a `memo` component and ensure all props (callbacks, filtered data) are stable. Decouple input state (`search`) from list state (`debouncedSearch`) so the list only updates when necessary.

## 2026-02-14 - Pre-computing Lowercase for Client-Side Filtering
**Learning:** In `LeadList`, filtering logic converted `name` and `company` to lowercase inside the filter loop (`O(N)` string operations on every keystroke). For large lists, this adds unnecessary overhead to the hot path (user typing).
**Action:** Pre-compute lowercase versions of search fields using `useMemo` when the list data changes. This moves the `O(N)` string transformation to the cold path (data loading), making the filter loop a simple string inclusion check.
