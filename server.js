const express = require("express");
const cors = require("cors");
const PrismaDatabase = require("./prisma-database");
const yieldsController = require("./controllers/yieldsController");
const apyHistoryController = require("./controllers/apyHistoryController");
const { CHAIN_ID, CHAIN_NAME } = require("./config");
require("dotenv").config();

const app = express();
const PORT = process.env.APP_PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database tables
async function initializeDatabase() {
  try {
    await PrismaDatabase.initializeDatabase();
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    throw error;
  }
}

// API Routes
app.get("/api/yields", yieldsController.getYields);
app.get("/api/apy-history", apyHistoryController.getApyHistory);

app.get("/", (req, res) => {
  res.json({
    message: "Pendle Finance Yield Tracker - Simplified API",
    endpoint: "/api/yields - Get all market yields on Base chain",
    chain: `${CHAIN_NAME} (ID: ${CHAIN_ID})`,
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: "connected",
  });
});

async function startServer() {
  try {
    await initializeDatabase();
    await yieldsController.fetchAndStoreYieldsOnStartup();
    app.listen(PORT, () => {
      console.log(`🚀 Pendle Yield Tracker running on port ${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api/yields`);
      console.log(`⛓️  Tracking ${CHAIN_NAME} chain (ID: ${CHAIN_ID})`);
      console.log(
        `🗄️  Using MySQL database: ${process.env.DB_NAME || "pendle_yields"}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
