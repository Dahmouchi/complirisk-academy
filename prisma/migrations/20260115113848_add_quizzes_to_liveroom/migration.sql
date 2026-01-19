-- CreateTable
CREATE TABLE "_LiveRoomToQuiz" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LiveRoomToQuiz_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LiveRoomToQuiz_B_index" ON "_LiveRoomToQuiz"("B");

-- AddForeignKey
ALTER TABLE "_LiveRoomToQuiz" ADD CONSTRAINT "_LiveRoomToQuiz_A_fkey" FOREIGN KEY ("A") REFERENCES "LiveRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LiveRoomToQuiz" ADD CONSTRAINT "_LiveRoomToQuiz_B_fkey" FOREIGN KEY ("B") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
