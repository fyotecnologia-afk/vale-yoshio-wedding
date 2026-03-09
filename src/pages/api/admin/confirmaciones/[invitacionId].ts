import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { invitacionId } = req.query as { invitacionId: string };
  try {
    if (req.method === "GET") {
      const items = await db.confirmacion.findMany({
        where: { invitacionId },
        orderBy: { createdAt: "desc" },
        include: {
          confirmacionInvitados: { include: { invitado: true } },
        },
      });
      res.status(200).json(items);
      return;
    }

    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method Not Allowed" });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" });
  }
}
