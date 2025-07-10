const yieldsService = require("../services/yieldsService");
const { CHAIN_ID, CHAIN_NAME } = require("../config");

exports.getYields = async (req, res) => {
  try {
    const markets = await yieldsService.fetchAndStoreYields();
    res.json({
      chainId: CHAIN_ID,
      chainName: CHAIN_NAME,
      totalMarkets: markets.length,
      timestamp: new Date().toISOString(),
      markets: markets,
      message: `Successfully stored ${markets.length} markets in database`,
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: "Failed to fetch yield data",
      message: error.message,
    });
  }
};

exports.fetchAndStoreYieldsOnStartup = async () => {
  await yieldsService.fetchAndStoreYields();
};
