// src/pages/api/invitaciones/confirmar.ts
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { numero, asistentes = [], dedicatoria = "" } = req.body;

  if (!numero)
    return res.status(400).json({ error: "Falta número de invitación" });

  try {
    // Buscar invitacion con confirmaciones
    const invitacion = await db.invitacion.findUnique({
      where: { numero },
      include: {
        invitados: true,
        confirmaciones: {
          orderBy: { createdAt: "asc" }, // asc para contar desde la primera
          include: { confirmacionInvitados: true },
        },
      },
    });

    if (!invitacion)
      return res.status(404).json({ error: "Invitación no encontrada" });

    const totalConfirmaciones = invitacion.confirmaciones.length;

    if (totalConfirmaciones >= 2) {
      return res
        .status(400)
        .json({
          error: "Ya se han realizado las dos oportunidades de confirmación",
        });
    }

    // Crear nueva confirmación
    const nuevaConfirmacion = await db.confirmacion.create({
      data: {
        dedicatoria,
        invitacionId: invitacion.id,
      },
    });

    const confirmacionId = nuevaConfirmacion.id;

    // Crear confirmacionInvitado para cada invitado según asistentes[]
    await Promise.all(
      invitacion.invitados.map((invitado) => {
        const respuesta = asistentes.includes(invitado.id) ? "SI" : "NO";
        return db.confirmacionInvitado.create({
          data: {
            confirmacionId,
            invitadoId: invitado.id,
            respuesta,
          },
        });
      })
    );

    res
      .status(200)
      .json({ success: true, oportunidad: totalConfirmaciones + 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error procesando confirmación" });
  }
}
