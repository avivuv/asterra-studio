-- Jadikan code NOT NULL (semua produk sudah punya kode via backfill)
ALTER TABLE `Product` MODIFY `code` VARCHAR(191) NOT NULL;
