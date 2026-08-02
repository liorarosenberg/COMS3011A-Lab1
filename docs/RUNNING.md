# Running This Project

## Requirements

- Node.js (LTS version recommended; developed and tested on Node with npm)
- npm

## Installation

Clone the repository, then install dependencies:

```bash
npm install
```

## Running the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or the next available port if 3000 is already in use — check the terminal output for the actual URL).

On first run, the SQLite database file (`data/app.db`) is created automatically, along with the `tasks` table, if they don't already exist.

## Running tests

```bash
npm test
```

This runs the full test suite via Vitest against a throwaway test database (`tests/test.db`), which is deleted and recreated fresh before each test run. Tests never touch the development database (`data/app.db`).

## Notes for Windows users

This project was developed on Windows/PowerShell. If cloning to a folder synced by OneDrive, native module installs (`better-sqlite3`) and Next.js's build cache (`.next`) can occasionally be corrupted by real-time sync. If you hit unexplained module or cache errors, try:

```bash
Remove-Item -Recurse -Force .next
npm run dev
```

or, if a full reinstall is needed:

```bash
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```
---
*This document was written with the assistance of AI (Claude, Claude Sonnet 5).*