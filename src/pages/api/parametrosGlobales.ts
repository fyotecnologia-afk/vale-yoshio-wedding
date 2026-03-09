// src/pages/api/parametrosGlobales.ts
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const fechaParam = await db.parametrosGlobales.findFirst({
      where: { tipo: "fechaLimite" },
    });
    const intentosParam = await db.parametrosGlobales.findFirst({
      where: { tipo: "maxIntentos" },
    });

    const fecha = fechaParam?.valorDate || "";
    const maxIntentos = intentosParam?.valorNumber ?? 2; // <-- aquí

    res.status(200).json({ fechaLimite: fecha, maxIntentos });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "No se pudieron obtener los parámetros globales" });
  }
}
