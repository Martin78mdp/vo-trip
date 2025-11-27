-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDIENTE', 'COTIZADO', 'VENDIDO', 'CANCELADO');

-- CreateTable
CREATE TABLE "AccommodationLead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'PENDIENTE',
    "destination" TEXT NOT NULL,
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "checkOutDate" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL,
    "rooms" INTEGER,
    "typeOfAccommodation" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "AccommodationLead_pkey" PRIMARY KEY ("id")
);
