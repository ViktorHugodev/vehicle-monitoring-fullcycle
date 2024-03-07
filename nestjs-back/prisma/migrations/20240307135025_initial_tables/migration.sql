-- CreateTable
CREATE TABLE `routes` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `sourceName` VARCHAR(191) NOT NULL,
    `sourceLat` DOUBLE NOT NULL,
    `sourceLng` DOUBLE NOT NULL,
    `destinationName` VARCHAR(191) NOT NULL,
    `destinationLat` DOUBLE NOT NULL,
    `destinationLng` DOUBLE NOT NULL,
    `distance` DOUBLE NOT NULL,
    `duration` DOUBLE NOT NULL,
    `directions` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `route_drivers` (
    `id` VARCHAR(191) NOT NULL,
    `route_id` VARCHAR(191) NOT NULL,
    `points` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `route_drivers` ADD CONSTRAINT `route_drivers_route_id_fkey` FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
