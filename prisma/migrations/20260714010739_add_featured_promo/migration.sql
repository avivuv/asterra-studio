-- AlterTable
ALTER TABLE `Product` ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `originalPrice` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Product_isFeatured_idx` ON `Product`(`isFeatured`);
