const apyHistoryService = require("../services/apyHistoryService");

exports.getApyHistory = async (req, res) => {
  try {
    const result = await apyHistoryService.getApyHistory(req.query);
    res.json(result);
  } catch (error) {
    console.error("Error fetching APY history for all markets:", error);
    res.status(500).json({
      error: "Failed to fetch APY history for all markets",
      message: error.message,
    });
  }
};
