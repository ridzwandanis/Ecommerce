-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- Insert default categories from existing product categories
INSERT INTO "Category" ("name", "slug", "description", "updatedAt")
SELECT DISTINCT 
    "category" as name,
    LOWER(REPLACE("category", ' ', '-')) as slug,
    'Kategori ' || "category" as description,
    CURRENT_TIMESTAMP as "updatedAt"
FROM "Product"
WHERE "category" IS NOT NULL;

-- Add categoryId column with temporary nullable
ALTER TABLE "Product" ADD COLUMN "categoryId" INTEGER;

-- Update categoryId based on existing category names
UPDATE "Product" p
SET "categoryId" = c.id
FROM "Category" c
WHERE LOWER(REPLACE(p."category", ' ', '-')) = c.slug;

-- Make categoryId NOT NULL
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

-- Drop old category column
ALTER TABLE "Product" DROP COLUMN "category";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" 
FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
