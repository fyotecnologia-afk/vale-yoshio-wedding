-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invitacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO'
);
INSERT INTO "new_Invitacion" ("id", "numero") SELECT "id", "numero" FROM "Invitacion";
DROP TABLE "Invitacion";
ALTER TABLE "new_Invitacion" RENAME TO "Invitacion";
CREATE UNIQUE INDEX "Invitacion_numero_key" ON "Invitacion"("numero");
CREATE TABLE "new_Invitado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "invitacionId" INTEGER NOT NULL,
    CONSTRAINT "Invitado_invitacionId_fkey" FOREIGN KEY ("invitacionId") REFERENCES "Invitacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Invitado" ("id", "invitacionId", "nombre") SELECT "id", "invitacionId", "nombre" FROM "Invitado";
DROP TABLE "Invitado";
ALTER TABLE "new_Invitado" RENAME TO "Invitado";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
