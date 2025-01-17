/*
  Warnings:

  - You are about to drop the column `name` on the `Destination` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `PossibleDestination` table. All the data in the column will be lost.
  - Added the required column `city` to the `Destination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Destination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Destination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `PossibleDestination` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Destination" DROP COLUMN "name",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PossibleDestination" DROP COLUMN "name",
ADD COLUMN     "city" TEXT NOT NULL;
