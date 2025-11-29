-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingCost" DECIMAL(65,30),
ADD COLUMN     "shippingCourier" TEXT,
ADD COLUMN     "shippingService" TEXT,
ADD COLUMN     "subtotal" DECIMAL(65,30);
