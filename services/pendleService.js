const axios = require("axios");
const { CHAIN_ID } = require("../config");

class PendleAPI {
  constructor() {
    this.baseURL = "https://api-v2.pendle.finance/core";
    this.chainId = CHAIN_ID; // Use unified chain ID
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
      return response.data.markets;
    } catch (error) {
      console.error(
        "Error fetching markets:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getMarketsApyHistory(markets, { timestamp_start, timestamp_end } = {}) {
    return Promise.all(
      markets.map(async (market) => {
        const url = `/v1/${this.chainId}/markets/${market.address}/historical-data`;
        const params = {
          time_frame: "day",
          timestamp_start,
          timestamp_end,
        };
        try {
          const response = await this.axiosInstance.get(url, { params });
          return {
            address: market.address,
            name: market.name,
            data: response.data?.results || response.data,
          };
        } catch (error) {
          return {
            address: market.address,
            name: market.name,
            error: error.response?.data || error.message,
          };
        }
      })
    );
  }
}

// Helper function to process market APY history data
function processMarketApyHistory(markets) {
  return markets.map((market) => {
    if (market.data && Array.isArray(market.data.timestamp)) {
      market.data.timestamp = market.data.timestamp.map((ts) =>
        new Date(ts * 1000).toISOString()
      );
    }
    if (market.data) {
      delete market.data.tvl;
      delete market.data.timestamp_start;
      delete market.data.timestamp_end;
    }
    return market;
  });
}

// Function to fetch and store yields
async function fetchAndStoreYields() {
  const PrismaDatabase = require("../prisma-database");
  const api = new PendleAPI();
  const markets = await api.getMarkets();
  console.log(`Found ${markets.length} markets from Pendle API`);
  for (const market of markets) {
    try {
      await PrismaDatabase.saveMarket(market);
      console.log(`Saved data for ${market.name} (${market.address})`);
    } catch (error) {
      console.error(`Error saving ${market.address}:`, error.message);
    }
  }
  return markets;
}

module.exports = {
  PendleAPI,
  processMarketApyHistory,
  fetchAndStoreYields,
};
