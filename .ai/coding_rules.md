# 💻 Coding Rules & Engineering Standards

These rules specify code design, folder organization, TypeScript standards, and backend design principles for the Parthenon Tecidos codebase.

---

## 🎨 General Principles

- **Simplicity:** Implement precisely what is requested. Choose simple, reliable code architecture over over-engineering.
- **Maintainability:** Ensure code is well-structured, easy to read, and utilizes existing conventions.
- **Security First:** Never trust user input. Validate, escape, and authenticate actions carefully.

---

## 🌐 Frontend (React / Next.js / TypeScript)

### Component Standards
- **Component Definitions:** Use functional components and export them clearly.
- **Component File Structure:** Use individual component files (e.g., `Button.tsx`). Group structural/UI pieces into `components/ui` and high-level sections into `components/layout` or page-specific folders.
- **Server vs. Client Components:**
  - Add `'use client'` strictly at the top of files that rely on React hooks, context, user events, or state.
  - Keep default Server Components for data fetching where applicable to optimize SEO and speed.

### TypeScript Conventions
- **Explicit Typings:** Always type component props with clean interfaces. Avoid using `any`.
- **Enums & Constants:** Store system constants (e.g., API paths, page limits, configuration defaults) in centralized config files like `frontend/config.ts`.
- **Utility Libraries:** For complex class composition, prefer clean template strings or dedicated utility utilities rather than manual concatenation.

### Routing & Navigation
- All routes must align with Next.js App Router guidelines.
- Use `<Link>` from `next/link` for internal page transitions rather than standard anchor tags (`<a>`) or programmatically changing `window.location` unless necessary.

---

## ⚙️ Backend (Node.js / Express)

### Endpoint Routing
- Route paths must follow RESTful standards (e.g., `/api/produtos`, `/api/pedidos`).
- Always structure routes under separate files in `backend/src/routes/` and tie them to controllers in separate modules.

### Security & Input Sanitization
- **Regular Expressions:** Never compile search expressions directly from user queries without escaping. Use search string validation or replace regex with safe index lookups.
- **Access Control:** Protect administrative routes (e.g., creating, updating, deleting fabrics) with `adminGuard` or token ownership validation.
- **Database Safety:** Ensure asynchronous file read/write tasks are properly resolved and handle locking issues or potential concurrency collisions securely.

### Formatting & Code Style
- Consistently use modern JavaScript ES6+ features (async/await, destructuring, arrow functions).
- Ensure comprehensive error handling on endpoints. Wrap operations in `try/catch` and return uniform error structures:
  ```json
  { "error": "Clear and detailed error message" }
  ```
