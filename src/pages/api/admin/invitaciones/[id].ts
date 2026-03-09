// src/pages/admin/invitaciones/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { Estado } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query as { id: string };

  try {
    if (req.method === "GET") {
      const item = await db.invitacion.findUnique({
        where: { id },
        include: {
          invitados: { orderBy: { nombre: "asc" } },
          confirmaciones: {
            orderBy: { createdAt: "desc" },
            include: {
              confirmacionInvitados: {
                include: { invitado: true },
              },
            },
          },
        },
      });
      if (!item) return res.status(404).json({ error: "No encontrada" });
      res.status(200).json(item);
      return;
    }

    if (req.method === "PUT") {
      const { numero, hostedBy, tipo, familia } = req.body;

      const updated = await db.invitacion.update({
        where: { id },
        data: {
          numero,
          hostedBy: hostedBy ?? null,
          tipo: tipo ?? null,
          familia: familia ?? null,
        },
      });

      res.status(200).json(updated);
      return;
    }

    if (req.method === "PATCH") {
      const { estado } = req.body as { estado: Estado };
      const updated = await db.invitacion.update({
        where: { id },
        data: { estado },
      });
      res.status(200).json(updated);
      return;
    }

    res.setHeader("Allow", "GET, PUT, PATCH");
    res.status(405).json({ error: "Method Not Allowed" });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" });
  }
}
