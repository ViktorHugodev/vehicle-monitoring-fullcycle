-- AlterTable
ALTER TABLE `routes` ADD COLUMN `destinationPlaceId` VARCHAR(191) NULL,
    ADD COLUMN `sourcePlaceId` VARCHAR(191) NULL;
