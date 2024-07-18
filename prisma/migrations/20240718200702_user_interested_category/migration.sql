-- CreateTable
CREATE TABLE "UserInterestedCategory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "UserInterestedCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInterestedCategory_userId_categoryId_key" ON "UserInterestedCategory"("userId", "categoryId");

-- AddForeignKey
ALTER TABLE "UserInterestedCategory" ADD CONSTRAINT "UserInterestedCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInterestedCategory" ADD CONSTRAINT "UserInterestedCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
