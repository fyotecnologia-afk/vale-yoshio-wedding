// pages/api/invitaciones/[numero].ts
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const numero = req.query.numero as string;

  // Evitar que este endpoint maneje rutas como /lista
  if (!numero || numero.toLowerCase() === "lista") {
    return res.status(400).json({ error: "Ruta inválida para este endpoint" });
  }

  try {
    const invitacion = await db.invitacion.findUnique({
      where: { numero },
      include: {
        invitados: {
          where: { estado: "ACTIVO" },
          select: { id: true, nombre: true },
        },
        confirmaciones: {
          orderBy: { createdAt: "asc" }, // Se conservan todas, para contar intentos
          include: {
            confirmacionInvitados: {
              select: { invitadoId: true, respuesta: true },
            },
          },
        },
      },
    });

    if (!invitacion) {
      return res.status(404).json({ exists: false });
    }

    // Tomar dedicatoria de la confirmación más reciente
    const dedicatoria =
      invitacion.confirmaciones.length > 0
        ? invitacion.confirmaciones[invitacion.confirmaciones.length - 1]
            .dedicatoria
        : "";

    const numIntentos = invitacion.confirmaciones.length;

    // Construir la lista de invitados con su última respuesta
    const invitadosConRespuesta = invitacion.invitados.map((inv) => {
      let ultimaRespuesta: "SI" | "NO" | null = null;

      // Recorrer confirmaciones desde la última hacia la primera
      for (let i = invitacion.confirmaciones.length - 1; i >= 0; i--) {
        const cInv = invitacion.confirmaciones[i].confirmacionInvitados.find(
          (ci) => ci.invitadoId === inv.id
        );
        if (cInv) {
          ultimaRespuesta = cInv.respuesta;
          break;
        }
      }

      return {
        ...inv,
        respuesta: ultimaRespuesta,
      };
    });

    res.status(200).json({
      exists: true,
      estado: invitacion.estado,
      invitados: invitadosConRespuesta,
      confirmaciones: invitacion.confirmaciones,
      dedicatoria,
      numIntentos,
    });
  } catch (error) {
    console.error("Error en la API de invitaciones:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
