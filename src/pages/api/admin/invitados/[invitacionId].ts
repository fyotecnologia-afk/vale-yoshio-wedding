// src/pages/admin/invitados/[invitacionId].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { Estado, CategoriaInvitado } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { invitacionId } = req.query as { invitacionId: string };

  try {
    if (req.method === "GET") {
      const items = await db.invitado.findMany({
        where: { invitacionId },
        orderBy: { nombre: "asc" },
        include: {
          confirmacionInvitados: {
            select: {
              respuesta: true, // Trae si confirmó o rechazó
              confirmacionId: true, // ID de la confirmación
            },
          },
        },
      });
      res.status(200).json(items);
      return;
    }

    if (req.method === "POST") {
      const { nombre, principal, categoria, estado, especial } = req.body;
      const created = await db.invitado.create({
        data: {
          nombre,
          principal: principal ?? null,
          categoria: categoria as CategoriaInvitado | null,
          estado: (estado as Estado) ?? "ACTIVO",
          especial: especial ?? false, // <-- aquí guardamos Especial
          invitacionId,
        },
      });
      res.status(201).json(created);
      return;
    }

    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ error: "Method Not Allowed" });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" });
  }
}
