# Tamim Tracker 🎯

A fun web app to track Tamim Arifin sightings with timestamps, locations, and who spotted him.

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 18+ (local or cloud)

### Local Development

1. **Clone & install:**
   ```bash
   cd Tamim-tracker
   npm install
   ```

2. **Configure database** (optional — defaults to local PostgreSQL):
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

   Default config in `config.js`:
   ```
   Host: localhost
   Port: 5432
   Database: tamim_tracker
   User: postgres
   Password: postgres
   ```

3. **Ensure PostgreSQL is running:**
   ```bash
   # macOS (Homebrew)
   brew services start postgresql
   
   # Or create a local database manually:
   createdb tamim_tracker
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   → Opens http://localhost:3000

## Environment Variables

Load from `.env` file or environment:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tamim_tracker
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3000
```

## Features

- ✅ **One-click check-ins**: "I SPOTTED TAMIM!" button
- 📍 **Optional locations**: Add where you saw him
- 👤 **Your name**: Displayed with each sighting
- 🕐 **Live timestamps**: Relative ("3 min ago") + absolute
- 📋 **History**: Browse all sightings with pagination
- 💾 **PostgreSQL**: Persistent, scalable backend

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/latest` | Most recent sighting |
| GET | `/api/checkins?page=1&limit=20` | Paginated history |
| POST | `/api/checkin` | Record a new sighting |

### POST /api/checkin

```json
{
  "seen_by": "Ahmed",
  "location": "Library" (optional)
}
```

## Database Schema

```sql
CREATE TABLE checkins (
  id        SERIAL PRIMARY KEY,
  seen_by   VARCHAR(100) NOT NULL,
  location  VARCHAR(200),
  seen_at   TIMESTAMP WITH TIME ZONE NOT NULL
);
```

## Files

```
├── server.js       ← Express + PostgreSQL backend
├── config.js       ← Database config (reads .env)
├── package.json
├── .env.example
├── public/
│   └── index.html  ← Single-page frontend
└── README.md
```
