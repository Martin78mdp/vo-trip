-- CreateTable
CREATE TABLE "ItineraryLead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'PENDIENTE',
    "departureCity" TEXT,
    "desiredDestinations" TEXT NOT NULL,
    "budgetPerPerson" TEXT,
    "durationDays" INTEGER,
    "travelType" TEXT,
    "notes" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "ItineraryLead_pkey" PRIMARY KEY ("id")
);
