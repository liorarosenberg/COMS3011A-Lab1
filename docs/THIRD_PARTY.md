# Third-Party Code

This document lists every third-party package used in this project and why it was chosen.

## Dependencies

### next (v16.2.12)
The core framework for this project. Provides the App Router, API routes, and dev server used to build the entire application (frontend UI and backend API in one codebase).

### react / react-dom
Required peer dependencies of Next.js. Used for all UI components via hooks (`useState`, `useEffect`).

### better-sqlite3 (v13.0.2)
Synchronous SQLite driver for Node.js. Chosen over an async driver because this is a local-first, single-user application with no need for connection pooling or non-blocking I/O — a synchronous API keeps the data layer simple and avoids unnecessary `async`/`await` plumbing throughout the codebase.

### tailwindcss
Utility-first CSS framework used for all styling in the application (forms, buttons, task cards, layout).

## Dev Dependencies

### vitest (v4.1.10)
Test runner used for the project's test suite (`tests/tasks.test.js`). Chosen for its fast startup, native ESM support, and zero-config compatibility with a Next.js/Vite-adjacent toolchain.

### eslint
Linting, included by the `create-next-app` scaffold to catch common JavaScript errors during development.

## Notes

- No ORM was used. Database access goes through raw SQL via `better-sqlite3`, kept intentionally simple and centralized in `src/lib/db.js` and `src/lib/tasks.js`.
- `@types/better-sqlite3` was installed initially but removed, since the project ended up using plain JavaScript rather than TypeScript.

---
*This document was written with the assistance of AI (Claude, Claude Sonnet 5).*