# Pendle Yield Tracker

A simple API to track Pendle Finance yields on Base chain using MySQL database.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. MySQL Database Setup

1. Install MySQL on your system
2. Create a database:

```sql
CREATE DATABASE pendle_yields;
```

3. Create a `.env` file in the root directory:

```env
# Server Configuration
APP_PORT=your_app_port

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=pendle_yields
DB_PORT=your_db_port
```

### 3. Run the Server

```bash
npm start
```

## API Endpoints

- `GET /api/yields` - Fetches all market yields from Pendle, stores them in MySQL, and returns the data. This logic also runs automatically on server startup.
- `GET /api/apy-history` - Returns daily APY history for all markets in the database. Accepts optional `timestamp_start` and `timestamp_end` query parameters (defaults to the last 5 days).
- `GET /health` - Health check endpoint
- `GET /` - API information
