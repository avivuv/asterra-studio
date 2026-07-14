/*
  Warnings:

  - You are about to drop the column `originalPrice` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Product` DROP COLUMN `originalPrice`,
    ADD COLUMN `promoPrice` INTEGER NULL;
