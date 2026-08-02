# Database Design

## Overview

The application uses a single SQLite database file (`data/app.db`) with one table: `tasks`.

## Schema

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  topic TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('todo', 'in_progress', 'complete')) DEFAULT 'todo',
  archived_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Design decisions

**`status` is constrained to exactly three values** (`todo`, `in_progress`, `complete`) via a `CHECK` constraint. "Overdue" is deliberately *not* a fourth status value.

**Overdue is a derived property, not a stored column.** A task is considered overdue if `due_date` is in the past *and* `status !== 'complete'`. This logic lives in `src/lib/overdue.js` as a pure function (`isOverdue`), used identically by both the UI and the test suite, so overdue state can never fall out of sync with the underlying data — it's recalculated fresh on every render rather than persisted anywhere.

**Archiving uses a nullable timestamp (`archived_at`), not a boolean flag and not a separate table.** Archiving a task sets `archived_at` to the current time; unarchiving sets it back to `NULL`. This was chosen over a boolean because the timestamp doubles as a record of *when* a task was archived, at no extra cost. Archived tasks are never deleted or moved — they remain in the same `tasks` table and are simply filtered by whether `archived_at IS NULL` (active) or `archived_at IS NOT NULL` (archived).

**`created_at` / `updated_at`** aren't required by the brief but were added for free using SQLite's `datetime('now')` default, and proved useful during development for debugging and confirming persistence.

## Relationships

There is only one table — no foreign keys or relationships exist in this schema, since all task data (title, description, due date, topic, status, archive state) lives on a single row per task.

---
*This document was written with the assistance of AI (Claude, Claude Sonnet 5).*