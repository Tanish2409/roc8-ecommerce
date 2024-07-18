-- DropForeignKey
ALTER TABLE "UserInterestedCategory" DROP CONSTRAINT "UserInterestedCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "UserInterestedCategory" DROP CONSTRAINT "UserInterestedCategory_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserInterestedCategory" ADD CONSTRAINT "UserInterestedCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInterestedCategory" ADD CONSTRAINT "UserInterestedCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
