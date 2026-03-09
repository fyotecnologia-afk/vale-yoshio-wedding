// prisma/clear.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {

  await prisma.invitado.deleteMany({})
  await prisma.invitacion.deleteMany({})

  console.log("Base de datos limpiada")

}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })