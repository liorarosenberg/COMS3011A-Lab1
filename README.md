# COMS3011A - Lab 1: Todo App

A local-first todo application built with Next.js and SQLite. Tasks can be created, edited, sorted, and archived (never deleted), with an automatically derived "overdue" indicator.

## Features

- Create tasks with title, description, due date, and topic
- Edit any task field, including status (`todo` / `in_progress` / `complete`)
- Archive and unarchive tasks (soft-delete via timestamp, not a hard delete)
- Sort active tasks by due date, topic, or status
- Automatic overdue flagging, derived at render time from due date and status
- Full persistence via SQLite — data survives app restarts

## Documentation

- [Third-Party Code](docs/THIRD_PARTY.md)
- [Database Design](docs/DATABASE.md)
- [Running This Project](docs/RUNNING.md)

## Quick start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. See [docs/RUNNING.md](docs/RUNNING.md) for full setup details, testing instructions, and Windows-specific notes.

## AI Usage Declaration

This project was developed with AI assistance (Claude, Claude Sonnet 5 and ChatGPT, ChatGPT-Web[GPT-5.5]) throughout. Per the course AI usage policy:

- **Code generation**: Used. AI generated initial implementations of the database schema, API routes, React components, and test suite, which were then reviewed, run, and in several cases corrected by hand (see commit history for specific fixes — e.g. a Turbopack native-module bundling issue, an ESM `__dirname` compatibility fix, and a misplaced overdue-badge bug caught during manual browser testing).
- **In-line editing**: Used. AI assisted with iterative fixes to existing code in response to real errors encountered during development (e.g. PowerShell/bash syntax differences, native module compilation issues, brace mismatches).
- **Code review**: Used. AI was used to review error output, terminal logs, and screenshots at each step to diagnose and confirm fixes before proceeding.

Full AI conversation transcripts are included in the submission per the course's AI policy requirements.

Every commit that included AI-assisted code is tagged in its commit message, e.g.: Assisted-by: Claude-Web[Claude Sonnet 5]

*This document was written with the assistance of AI (Claude, Claude Sonnet 5).*

