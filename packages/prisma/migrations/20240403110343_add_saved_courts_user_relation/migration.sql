-- CreateTable
CREATE TABLE "_savedCourts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_savedCourts_AB_unique" ON "_savedCourts"("A", "B");

-- CreateIndex
CREATE INDEX "_savedCourts_B_index" ON "_savedCourts"("B");

-- AddForeignKey
ALTER TABLE "_savedCourts" ADD CONSTRAINT "_savedCourts_A_fkey" FOREIGN KEY ("A") REFERENCES "Court"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_savedCourts" ADD CONSTRAINT "_savedCourts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
