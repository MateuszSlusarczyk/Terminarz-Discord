/*
  Warnings:

  - You are about to drop the column `Friday` on the `Week` table. All the data in the column will be lost.
  - You are about to drop the column `Monday` on the `Week` table. All the data in the column will be lost.
  - You are about to drop the column `Saturday` on the `Week` table. All the data in the column will be lost.
  - You are about to drop the column `Sunday` on the `Week` table. All the data in the column will be lost.
  - You are about to drop the column `Thursday` on the `Week` table. All the data in the column will be lost.
  - You are about to drop the column `Tuesday` on the `Week` table. All the data in the column will be lost.
  - You are about to drop the column `Wednesday` on the `Week` table. All the data in the column will be lost.
  - Added the required column `Czwartek` to the `Week` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Niedziela` to the `Week` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Piątek` to the `Week` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Poniedziałek` to the `Week` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Sobota` to the `Week` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Wtorek` to the `Week` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Środa` to the `Week` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Week" DROP COLUMN "Friday",
DROP COLUMN "Monday",
DROP COLUMN "Saturday",
DROP COLUMN "Sunday",
DROP COLUMN "Thursday",
DROP COLUMN "Tuesday",
DROP COLUMN "Wednesday",
ADD COLUMN     "Czwartek" TEXT NOT NULL,
ADD COLUMN     "Niedziela" TEXT NOT NULL,
ADD COLUMN     "Piątek" TEXT NOT NULL,
ADD COLUMN     "Poniedziałek" TEXT NOT NULL,
ADD COLUMN     "Sobota" TEXT NOT NULL,
ADD COLUMN     "Wtorek" TEXT NOT NULL,
ADD COLUMN     "Środa" TEXT NOT NULL;
