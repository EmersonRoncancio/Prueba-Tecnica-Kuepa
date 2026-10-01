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

npm run cli -- --seeder initSeeder -f
```
