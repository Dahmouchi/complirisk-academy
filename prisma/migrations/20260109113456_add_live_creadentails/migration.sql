-- CreateTable
CREATE TABLE "LiveCredentials" (
    "id" TEXT NOT NULL,
    "liveRoomId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "roomName" TEXT NOT NULL,

    CONSTRAINT "LiveCredentials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LiveCredentials" ADD CONSTRAINT "LiveCredentials_liveRoomId_fkey" FOREIGN KEY ("liveRoomId") REFERENCES "LiveRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
