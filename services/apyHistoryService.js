const PrismaDatabase = require("../prisma-database");
const { PendleAPI } = require("./pendleService");
const getDefaultTimestamps = require("../utils/getDefaultTimestamps");

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

exports.getApyHistory = async (query) => {
  let { timestamp_start, timestamp_end } = query;
  // Set default timestamps if not provided
  const { pendleTimestampStart, pendleTimestampEnd } = getDefaultTimestamps(
    timestamp_start,
    timestamp_end
  );
  // Get all markets from DB
  const allMarkets = await PrismaDatabase.getAllMarketsAddresses();
  if (!allMarkets || allMarkets.length === 0) {
    throw new Error("No markets found in database");
  }
  const api = new PendleAPI();
  const results = await api.getMarketsApyHistory(allMarkets, {
    timestamp_start: pendleTimestampStart,
    timestamp_end: pendleTimestampEnd,
  });
  // Process market APY history data
  const formattedResults = processMarketApyHistory(results);
  return {
    chainId: api.chainId,
    time_frame: "day",
    timestamp: new Date().toISOString(),
    markets: formattedResults,
    message: `Fetched daily APY history for ${allMarkets.length} markets`,
  };
};
