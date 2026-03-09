// /src/lib/session.ts
import { SessionOptions } from "iron-session";

export interface AdminSession {
  isLoggedIn?: boolean;
  username?: string;
}

// Validaciones para evitar timeouts silenciosos
if (!process.env.IRON_SESSION_PASSWORD) {
  throw new Error("❌ IRON_SESSION_PASSWORD no está definido en variables de entorno.");
}

if (process.env.IRON_SESSION_PASSWORD.length < 32) {
  throw new Error("❌ IRON_SESSION_PASSWORD debe tener al menos 32 caracteres.");
}

export const sessionOptions: SessionOptions = {
  cookieName: process.env.IRON_SESSION_COOKIE_NAME || "admin_session",
  password: process.env.IRON_SESSION_PASSWORD,
  ttl: Number(process.env.IRON_SESSION_TTL || 60 * 60 * 24), // 1 día
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};

// Re-declaramos la sesión para incluir AdminSession
declare module "iron-session" {
  interface IronSessionData extends AdminSession {}
}
