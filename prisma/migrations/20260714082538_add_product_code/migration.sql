-- AlterTable: tambah kolom code (nullable) + unique index
ALTER TABLE `Product` ADD COLUMN `code` VARCHAR(191) NULL;
CREATE UNIQUE INDEX `Product_code_key` ON `Product`(`code`);
