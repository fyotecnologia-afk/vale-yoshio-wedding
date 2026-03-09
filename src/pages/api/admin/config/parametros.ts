// src/pages/api/admin/config/parametros.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const parametros = await prisma.parametrosGlobales.findMany();
      return res.json(parametros);
    }

    if (req.method === "POST") {
      const data = req.body;

      // Actualizar solo parámetros existentes usando el id
      for (const param of data) {
        if (!param.id) continue; // Ignora si no hay id
        await prisma.parametrosGlobales.update({
          where: { id: param.id },
          data: {
            valorDate: param.valorDate ?? undefined,
            valorNumber: param.valorNumber ?? undefined,
          },
        });
      }

      return res.status(200).json({ message: "Parámetros actualizados" });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Método ${req.method} no permitido`);
  } catch (error) {
    console.error("Error en API parámetros:", error);
    return res.status(500).json({ error: "Error interno" });
  }
}
