// /src/utils/validate.ts
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1).max(64).trim(),
  password: z.string().min(1).max(256),
});

export function safeParseJson<T>(body: string): T | null {
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}
