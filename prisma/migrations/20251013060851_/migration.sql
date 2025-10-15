/*
  Warnings:

  - A unique constraint covering the columns `[postexTrackingNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "postexTrackingNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_postexTrackingNumber_key" ON "public"."Order"("postexTrackingNumber");
