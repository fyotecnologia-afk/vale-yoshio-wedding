// /src/pages/api/admin/session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession, IronSession } from "iron-session";
import { sessionOptions, AdminSession } from "@/lib/session"; // 👈 Import usando alias

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session: IronSession<AdminSession> = await getIronSession(req, res, sessionOptions);
    const isLoggedIn = Boolean(session.isLoggedIn);

    return res.status(200).json({
      isLoggedIn,
      username: session.username || null,
    });
  } catch (error) {
    console.error("❌ Error en /api/admin/session:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
