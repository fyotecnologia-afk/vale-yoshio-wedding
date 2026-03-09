// /src/pages/api/admin/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession, IronSession } from "iron-session";
import { sessionOptions, AdminSession } from "@/lib/session";
import bcrypt from "bcrypt";
import { loginSchema, safeParseJson } from "@/utils/validate";

// Rate limiting
const RATE = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000; // 1 minuto
const MAX_TRIES = 10;

function rateLimit(ip: string) {
  const now = Date.now();
  const item = RATE.get(ip);
  if (!item || now - item.ts > WINDOW_MS) {
    RATE.set(ip, { count: 1, ts: now });
    return;
  }
  item.count += 1;
  if (item.count > MAX_TRIES) {
    throw new Error("Too many attempts. Please wait a minute.");
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown";
    rateLimit(ip);

    // Parse body
    const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const json = safeParseJson<any>(raw);
    if (!json) return res.status(400).json({ error: "Invalid JSON" });

    const parsed = loginSchema.safeParse(json);
    if (!parsed.success) return res.status(400).json({ error: "Datos inválidos" });

    const { username, password } = parsed.data;

    // Validate credentials
    const okUser = username === process.env.ADMIN_USERNAME;
    const hash = process.env.ADMIN_PASSWORD_HASH || "";
    const okPass = hash ? await bcrypt.compare(password, hash) : false;

    if (!okUser || !okPass) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Get and save session
    const session: IronSession<AdminSession> = await getIronSession(req, res, sessionOptions);
    console.log("Session before saving:", session);

    session.isLoggedIn = true;
    session.username = username;

    try {
      await session.save();
      console.log("Session saved successfully");
    } catch (err) {
      console.error("Error saving session:", err);
      return res.status(500).json({ error: "Failed to save session" });
    }

    res.status(200).json({ success: true });
  } catch (e: any) {
    console.error("Login error:", e);
    res.status(429).json({ error: e?.message || "Error" });
  }
}
