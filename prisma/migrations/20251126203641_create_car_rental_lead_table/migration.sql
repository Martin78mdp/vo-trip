-- CreateTable
CREATE TABLE "CarRentalLead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'PENDIENTE',
    "pickupLocation" TEXT NOT NULL,
    "returnLocation" TEXT NOT NULL,
    "pickupDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3) NOT NULL,
    "carType" TEXT,
    "ageOfDriver" INTEGER,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "CarRentalLead_pkey" PRIMARY KEY ("id")
);
