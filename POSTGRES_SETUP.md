# PostgreSQL Setup

Choose one of the methods below to get PostgreSQL running:

## Option 1: Homebrew (macOS)

```bash
# Install PostgreSQL 18
brew install postgresql@18

# Start PostgreSQL service
brew services start postgresql@18

# Create the database
createdb tamim_tracker

# Verify connection
psql tamim_tracker -c "SELECT version();"
```

Then run the app:
```bash
npm start
```

---

## Option 2: Docker

```bash
# Run PostgreSQL 18 in a container
docker run --name tamim-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=tamim_tracker \
  -p 5432:5432 \
  -d postgres:18

# Verify it's running
docker logs tamim-db
```

Then run the app:
```bash
npm start
```

---

## Option 3: Cloud PostgreSQL (Production)

1. Create a PostgreSQL instance on:
   - AWS RDS
   - DigitalOcean
   - Railway.app
   - Heroku Postgres
   - Or any other provider

2. Update your `.env` file:
   ```env
   DB_HOST=your-cloud-db.com
   DB_PORT=5432
   DB_NAME=tamim_tracker
   DB_USER=admin
   DB_PASSWORD=your_password
   ```

3. Run the app:
   ```bash
   npm start
   ```

---

## Troubleshooting

**"psql: command not found"**  
→ PostgreSQL is not installed. Use Homebrew or Docker (Options 1 or 2)

**"connection refused"**  
→ PostgreSQL is installed but not running:
```bash
brew services start postgresql@18
```

**"database does not exist"**  
→ Create it:
```bash
createdb tamim_tracker
```

**"Failed to start: Database connection error"**  
→ Check `config.js` credentials match your PostgreSQL setup
