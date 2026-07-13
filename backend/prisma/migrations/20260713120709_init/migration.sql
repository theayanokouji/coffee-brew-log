-- CreateTable
CREATE TABLE "Brew" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "beans" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "coffeeGrams" REAL NOT NULL,
    "waterGrams" REAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "tastingNotes" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
