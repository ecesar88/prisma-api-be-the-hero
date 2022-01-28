-- CreateTable
CREATE TABLE "Ong" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Incidents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "ongId" TEXT,
    CONSTRAINT "Incidents_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "Ong" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Ong_id_key" ON "Ong"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Ong_email_key" ON "Ong"("email");
