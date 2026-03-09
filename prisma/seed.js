// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seedData = require("../seedData").seedData; // ruta correcta a tu seedData.js

async function main() {
  for (const inv of seedData) {
    await prisma.invitacion.create({
      data: {
        numero: inv.numero,
        hostedBy: inv.hostedBy,
        tipo: inv.tipo,
        familia: inv.familia,
        invitados: {
          create: inv.invitados.map((i) => ({
            nombre: i.nombre,
            principal: i.principal,
            categoria: i.categoria,
            especial: i.especial, // ahora sí
            estado: i.estado || "ACTIVO",
          })),
        },
      },
    });
  }
}

main()
  .then(() => console.log("Datos insertados correctamente"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
