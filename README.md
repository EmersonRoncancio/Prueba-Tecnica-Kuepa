# Kuepa CRM: Leads

This is a CRM for registering prospective students (leads) interested in Kuepa's academic programs and tracking them through a sales pipeline.

| Folder | Stack |
| --- | --- |
| [`back/`](back/README.md) | Node.js 18, Express, TypeScript, MongoDB (Mongoose) |
| [`front/`](front/README.md) | React 18, Vite, TypeScript, Tailwind CSS with shadcn/ui, nanostores |

## Quick start

Requirements: Node.js 18 or later, and Docker.

```bash
# 1. Database
cd back
docker compose up -d

# 2. Backend (http://localhost:7001)
npm i
npm run cli -- --seeder initSeeder -f       # admin user
npm run cli -- --seeder programSeeder -f    # academic programs
npm run cli -- --seeder trackingSeeder -f   # pipeline stages
npm run dev

# 3. Frontend (http://localhost:5173), in another terminal
cd front
npm i
npm run dev
```

Log in with `useradminket` / `ket#2025`, then open **Prospectos** in the sidebar.

## Features

- **Lead registration form**: personal data, contact details and the program of interest, with inline validation that mirrors the server rules. Server errors (400, and 409 for a duplicate email) are shown on the matching field.
- **Pipeline board**: one column per stage. Leads move between stages by drag and drop, or with the "Mover a…" selector, which also works from the keyboard. The board includes search and summary stats.

## Data model decisions

The existing models were reused rather than replaced:

- **`Program`** existed but was not exported or exposed. It now has its own domain (`GET /api/program`) and a seeder.
- **`Tracking`** documents are the **pipeline stages**. A new `order` field sorts the columns.
- **`Lead.trackings[]`** is the stage history. Moving a lead *appends* a tracking entry, and the current stage is the last one. This keeps the full history of each lead for free.
- **`Lead`** creation accepts only whitelisted fields and is validated on the server, so a client cannot assign arbitrary fields. Email is normalized and must be unique among active leads.

## Tests

```bash
cd back && npm test    # Jest + supertest + in-memory MongoDB (no Docker needed)
cd front && npm test   # Vitest + React Testing Library
```

## Project structure

The code follows the template's existing conventions.

- **Backend:** one folder per domain, `src/app/domains/<domain>/{route,controller,service}`. Models live in `src/app/models`, and seeders in `src/seeders`.
- **Frontend:**
  - Pages: `src/pages/<module>`
  - Feature components: `src/components/leads`
  - API services: `src/services`
  - Hooks: `src/hooks`
  - Pure helpers: `src/util`

  Every component is kept well under 150 lines.
