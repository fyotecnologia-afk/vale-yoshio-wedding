-- CreateTable
CREATE TABLE "Invitacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Confirmacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dedicatoria" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invitacionId" INTEGER NOT NULL,
    CONSTRAINT "Confirmacion_invitacionId_fkey" FOREIGN KEY ("invitacionId") REFERENCES "Invitacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invitado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "invitacionId" INTEGER NOT NULL,
    CONSTRAINT "Invitado_invitacionId_fkey" FOREIGN KEY ("invitacionId") REFERENCES "Invitacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Confirmados" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_Confirmados_A_fkey" FOREIGN KEY ("A") REFERENCES "Confirmacion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Confirmados_B_fkey" FOREIGN KEY ("B") REFERENCES "Invitado" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitacion_numero_key" ON "Invitacion"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "_Confirmados_AB_unique" ON "_Confirmados"("A", "B");

-- CreateIndex
CREATE INDEX "_Confirmados_B_index" ON "_Confirmados"("B");
