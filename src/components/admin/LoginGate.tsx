// /src/components/admin/LoginGate.tsx
import React, { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  LoginForm: React.ComponentType<{ onSuccess: () => void }>;
};

export default function LoginGate({ children, LoginForm }: Props) {
  const [status, setStatus] = useState<"loading" | "in" | "out">("loading");

  // Verifica si hay sesión activa
  const check = async () => {
    try {
      const res = await fetch("/api/admin/session", { cache: "no-store" });
      const json = await res.json();
      setStatus(json?.isLoggedIn ? "in" : "out");
    } catch {
      setStatus("out");
    }
  };

  useEffect(() => {
    check();
  }, []);

  if (status === "loading") return null;

  // Enviamos a LoginForm la función envuelta para que coincida con () => void
  if (status === "out") return <LoginForm onSuccess={() => check()} />;

  return <>{children}</>;
}
