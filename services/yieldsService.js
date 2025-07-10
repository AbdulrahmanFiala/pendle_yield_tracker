const PrismaDatabase = require("../prisma-database");
const { PendleAPI } = require("./pendleService");

exports.fetchAndStoreYields = async () => {
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
};
