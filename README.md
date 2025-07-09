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

- `GET /api/yields` - Get all market yields and store them in MySQL database
- `GET /health` - Health check endpoint
- `GET /` - API information
