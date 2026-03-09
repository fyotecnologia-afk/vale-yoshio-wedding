// src/pages/api/admin/invitaciones/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { Estado, CategoriaInvitado } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { q, estado, page = "1", pageSize = "10", especial } = req.query;
      const where: any = {};

      if (estado === "ACTIVO" || estado === "INACTIVO") where.estado = estado;
      if (q && typeof q === "string") {
        where.OR = [
          { numero: { contains: q, mode: "insensitive" } },
          { familia: { contains: q, mode: "insensitive" } },
          { tipo: { contains: q, mode: "insensitive" } },
          { hostedBy: { contains: q, mode: "insensitive" } },
        ];
      }

      // Primero filtramos según especial si aplica
      let invitadosFilter: any = {};
      if (especial === "true") invitadosFilter.especial = true;
      else if (especial === "false") invitadosFilter.especial = false;

      // Total de registros filtrados
      const total = await db.invitacion.count({
        where: {
          ...where,
          ...(especial !== undefined
            ? {
                invitados: { some: invitadosFilter },
              }
            : {}),
        },
      });

      const skip = (Number(page) - 1) * Number(pageSize);

      // Traemos la página actual
      const items = await db.invitacion.findMany({
        where: {
          ...where,
          ...(especial !== undefined
            ? {
                invitados: { some: invitadosFilter },
              }
            : {}),
        },
        orderBy: { numero: "asc" },
        skip,
        take: Number(pageSize),
        include: {
          invitados: true,
          confirmaciones: {
            include: { confirmacionInvitados: true },
          },
        },
      });

      // Mapear conteos como antes
      const itemsWithCounts = items.map((inv) => {
        const conteoInvitados = inv.invitados?.length || 0;

        const invitadosConfirmadosMap: Record<string, "SI" | "NO"> = {};
        inv.confirmaciones.forEach((c) => {
          c.confirmacionInvitados?.forEach((ci) => {
            invitadosConfirmadosMap[ci.invitadoId] = ci.respuesta;
          });
        });

        let conteoConfirmados = 0;
        let conteoNoConfirmados = 0;
        Object.values(invitadosConfirmadosMap).forEach((r) => {
          if (r === "SI") conteoConfirmados++;
          if (r === "NO") conteoNoConfirmados++;
        });

        const conteoSinRespuesta =
          conteoInvitados - (conteoConfirmados + conteoNoConfirmados);

        return {
          ...inv,
          conteoInvitados,
          conteoConfirmados,
          conteoNoConfirmados,
          conteoSinRespuesta,
        };
      });

      res.status(200).json({ items: itemsWithCounts, total });
      return;
    }

    if (req.method === "POST") {
      const { hostedBy, tipo, familia, invitados = [] } = req.body;

      try {
        const lastInvitacion = await db.invitacion.findFirst({
          orderBy: { numero: "desc" },
        });

        let lastNumber = 0;
        if (lastInvitacion?.numero) {
          const match = lastInvitacion.numero.match(/^MM(\d{3})$/);
          if (match) lastNumber = parseInt(match[1], 10);
        }

        const nextNumber = `MM${String(lastNumber + 1).padStart(3, "0")}`;

        const created = await db.invitacion.create({
          data: {
            numero: nextNumber,
            hostedBy: hostedBy ?? null,
            tipo: tipo ?? null,
            familia: familia ?? null,
            invitados: {
              create: invitados.map((i: any) => ({
                nombre: i.nombre,
                principal: i.principal ?? null,
                categoria: i.categoria as CategoriaInvitado | null,
                estado: (i.estado as Estado) ?? "ACTIVO",
                especial: i.especial ?? false,
              })),
            },
          },
        });

        res.status(201).json(created);
      } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || "Server error" });
      }
    }

    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ error: "Method Not Allowed" });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" });
  }
}
