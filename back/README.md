# prueba-kuepa

## Database

Start MongoDB with Docker. The data is persisted in the `mongo_data` volume:

```bash
docker compose up -d
```

The database is available at `mongodb://127.0.0.1:27017/kuepa_test`, as configured in `src/config.ts`.

## Run

```bash
npm i
npm run dev
```

## Seeders

Seeders are run through the CLI with `--seeder <fileName>` (the file name in `src/seeders`, without `.ts`).
A seeder that already ran is skipped; add `-f` to run it again. All of them are idempotent (upsert by name).

```bash
npm run cli -- --seeder initSeeder -f       # admin user (useradminket / ket#2025)
npm run cli -- --seeder programSeeder -f    # academic programs
npm run cli -- --seeder trackingSeeder -f   # pipeline stages (Nuevo ... Descartado)
```

`npm run cli -- --x` runs every seeder that has not been launched yet.

## Tests

```bash
npm test
```

Jest + ts-jest + supertest. Integration tests run against an in-memory MongoDB
(`mongodb-memory-server`), so they need neither Docker nor a running server. The first run
downloads a MongoDB binary, which is then cached.

## API

All endpoints require `Authorization: Bearer <token>` (from `POST /api/auth/login`).

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/program` | Programs, sorted by name |
| GET | `/api/tracking` | Pipeline stages, sorted by `order` |
| GET | `/api/lead` | Leads (populated), newest first |
| POST | `/api/lead/upsert` | Register a lead: `first_name`, `last_name`, `email`, `mobile_phone` (Colombian mobile: `3XXXXXXXXX`, `57…` or `+57…`; stored as `+573XXXXXXXXX`), `interestProgram`, optional `description` |
| POST | `/api/lead/move` | Move a lead to a stage: `_id`, `tracking`, optional `description` |
