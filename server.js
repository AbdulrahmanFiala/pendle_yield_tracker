const express = require("express");
const axios = require("axios");
const cors = require("cors");
const PrismaDatabase = require("./prisma-database");
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

// Pendle API client
class PendleAPI {
  constructor() {
    this.baseURL = "https://api-v2.pendle.finance/core";
    this.chainId = 8453; // Base chain ID
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Pendle-Yield-Tracker/2.0.0",
      },
    });
  }

  async getMarkets() {
    try {
      const response = await this.axiosInstance.get(
        `/v1/${this.chainId}/markets/active`,
        {
          params: {
            order_by: "total_pt:desc",
            skip: 0,
            limit: 100,
          },
        }
      );
      return response.data.results || response.data.markets || [];
    } catch (error) {
      console.error(
        "Error fetching markets:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

// API Routes
app.get("/api/yields", async (req, res) => {
  try {
    const api = new PendleAPI();
    const markets = await api.getMarkets();

    console.log(`Found ${markets.length} markets from Pendle API`);

    // Store markets in database
    for (const market of markets) {
      try {
        await PrismaDatabase.saveMarket(market);
        console.log(`Saved data for ${market.name} (${market.address})`);
      } catch (error) {
        console.error(`Error saving ${market.address}:`, error.message);
      }
    }

    // Transform the data to include only the requested fields
    const yields = markets.map((market) => ({
      name: market.name,
      address: market.address,
      expiry: market.expiry,
      pt: market.pt,
      yt: market.yt,
      sy: market.sy,
      underlyingAsset: market.underlyingAsset,
      details: {
        liquidity: market.details?.liquidity || 0,
        pendleApy: market.details?.pendleApy || 0,
        impliedApy: market.details?.impliedApy || 0,
        yieldRange: {
          min: market.details?.yieldRange?.min || 0,
          max: market.details?.yieldRange?.max || 0,
        },
        aggregatedApy: market.details?.aggregatedApy || 0,
        maxBoostedApy: market.details?.maxBoostedApy || 0,
      },
    }));

    res.json({
      chainId: 8453,
      chainName: "Base",
      totalMarkets: yields.length,
      timestamp: new Date().toISOString(),
      markets: yields,
      message: `Successfully stored ${markets.length} markets in database`,
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: "Failed to fetch yield data",
      message: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "Pendle Finance Yield Tracker - Simplified API",
    endpoint: "/api/yields - Get all market yields on Base chain",
    chain: "Base (ID: 8453)",
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

    app.listen(PORT, () => {
      console.log(`🚀 Pendle Yield Tracker running on port ${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api/yields`);
      console.log(`⛓️  Tracking Base chain (ID: 8453)`);
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
