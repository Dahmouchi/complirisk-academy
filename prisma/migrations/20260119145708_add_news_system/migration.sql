-- CreateEnum
CREATE TYPE "NewsPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "imageUrl" TEXT,
    "priority" "NewsPriority" NOT NULL DEFAULT 'MEDIUM',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsGrade" (
    "id" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    "gradeId" TEXT NOT NULL,

    CONSTRAINT "NewsGrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "News_authorId_idx" ON "News"("authorId");

-- CreateIndex
CREATE INDEX "News_published_idx" ON "News"("published");

-- CreateIndex
CREATE INDEX "News_publishedAt_idx" ON "News"("publishedAt");

-- CreateIndex
CREATE INDEX "NewsGrade_newsId_idx" ON "NewsGrade"("newsId");

-- CreateIndex
CREATE INDEX "NewsGrade_gradeId_idx" ON "NewsGrade"("gradeId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsGrade_newsId_gradeId_key" ON "NewsGrade"("newsId", "gradeId");

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsGrade" ADD CONSTRAINT "NewsGrade_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsGrade" ADD CONSTRAINT "NewsGrade_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
