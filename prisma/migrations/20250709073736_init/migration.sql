-- CreateTable
CREATE TABLE `markets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `expiry` DATETIME(3) NULL,
    `pt` VARCHAR(191) NOT NULL,
    `yt` VARCHAR(191) NOT NULL,
    `sy` VARCHAR(191) NOT NULL,
    `underlyingAsset` VARCHAR(191) NOT NULL,
    `liquidity` DECIMAL(20, 8) NOT NULL,
    `pendle_apy` DECIMAL(10, 8) NOT NULL,
    `implied_apy` DECIMAL(10, 8) NOT NULL,
    `yield_range_min` DECIMAL(10, 8) NOT NULL,
    `yield_range_max` DECIMAL(10, 8) NOT NULL,
    `aggregated_apy` DECIMAL(10, 8) NOT NULL,
    `max_boosted_apy` DECIMAL(10, 8) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `markets_address_key`(`address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
