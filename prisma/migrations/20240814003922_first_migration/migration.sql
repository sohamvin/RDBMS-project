-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "availableFrom" TIMESTAMP(3) NOT NULL,
    "availableTill" TIMESTAMP(3) NOT NULL,
    "askPrice" DOUBLE PRECISION NOT NULL,
    "imageLink" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pincode" VARCHAR(10) NOT NULL,
    "productType" VARCHAR(200) NOT NULL,
    "companyName" VARCHAR(200) NOT NULL,
    "taluka" VARCHAR(200) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" VARCHAR(300) NOT NULL,
    "productId" TEXT NOT NULL,
    "askerId" TEXT NOT NULL,
    "numberOfHours" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "bookerSign" BOOLEAN NOT NULL,
    "lenderSign" BOOLEAN NOT NULL,
    "whenDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LenderToBooking" (
    "A" VARCHAR(300) NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_username_key" ON "UserProfile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_LenderToBooking_AB_unique" ON "_LenderToBooking"("A", "B");

-- CreateIndex
CREATE INDEX "_LenderToBooking_B_index" ON "_LenderToBooking"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_askerId_fkey" FOREIGN KEY ("askerId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LenderToBooking" ADD CONSTRAINT "_LenderToBooking_A_fkey" FOREIGN KEY ("A") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LenderToBooking" ADD CONSTRAINT "_LenderToBooking_B_fkey" FOREIGN KEY ("B") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
