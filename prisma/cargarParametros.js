const { db } = require('../src/lib/db.ts'); // Ajusta la ruta según tu proyecto

async function main() {
  try {
    // Verifica si ya hay algún registro
    const existente = await db.parametrosGlobales.findFirst();
    if (existente) {
      console.log("Ya existe al menos un registro de parámetros globales.");
      process.exit(0);
    }

    // Crear registro de fecha límite
    const registroFecha = await db.parametrosGlobales.create({
      data: {
        tipo: "fechaLimite", // campo extra para diferenciar tipo de parámetro
        valorDate: "2025-10-17"
      }
    });

    // Crear registro de intentos máximos
    const registroIntentos = await db.parametrosGlobales.create({
      data: {
        tipo: "maxIntentos",
        valorNumber: 2
      }
    });

    console.log("Parámetros globales cargados:");
    console.log("Fecha límite:", registroFecha);
    console.log("Intentos máximos:", registroIntentos);

    process.exit(0);
  } catch (error) {
    console.error("Error cargando parámetros globales:", error);
    process.exit(1);
  }
}

main();
