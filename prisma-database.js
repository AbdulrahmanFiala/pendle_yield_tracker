const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

class PrismaDatabase {
  static async initializeDatabase() {
    try {
      await prisma.$connect();
      console.log("✅ Prisma database connection established successfully");
    } catch (error) {
      console.error("❌ Prisma database initialization error:", error);
      throw error;
    }
  }

  static async saveMarket(market) {
    try {
      const marketData = {
        name: market.name,
        address: market.address,
        expiry: market.expiry ? new Date(market.expiry) : null,
        pt: market.pt,
        yt: market.yt,
        sy: market.sy,
        underlyingAsset: market.underlyingAsset,
        liquidity: market.details?.liquidity || 0,
        pendleApy: market.details?.pendleApy || 0,
        impliedApy: market.details?.impliedApy || 0,
        yieldRangeMin: market.details?.yieldRange?.min || 0,
        yieldRangeMax: market.details?.yieldRange?.max || 0,
        aggregatedApy: market.details?.aggregatedApy || 0,
        maxBoostedApy: market.details?.maxBoostedApy || 0,
      };

      await prisma.market.upsert({
        where: { address: market.address },
        update: marketData,
        create: marketData,
      });

      return true;
    } catch (error) {
      console.error("Error saving market:", error);
      throw error;
    }
  }

  // Add this method to get all markets address from the database
  static async getAllMarketsAddresses() {
    try {
      const markets = await prisma.market.findMany({
        orderBy: { liquidity: "desc" },
        select: { address: true },
      });
      return markets;
    } catch (error) {
      console.error("Error fetching all markets:", error);
      throw error;
    }
  }
}

module.exports = PrismaDatabase;
