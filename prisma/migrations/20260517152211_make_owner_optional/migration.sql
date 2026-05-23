/*
  Warnings:

  - You are about to drop the column `image` on the `Field` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Field` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "Field" DROP CONSTRAINT "Field_ownerId_fkey";

-- AlterTable
ALTER TABLE "Field" DROP COLUMN "image",
ALTER COLUMN "price" SET DATA TYPE INTEGER,
ALTER COLUMN "ownerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
