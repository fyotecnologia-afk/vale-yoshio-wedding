// /src/components/admin/LoginForm.tsx
import React, { useState } from "react";
import { Form, Input, Button, Alert, Card } from "antd";

type Props = { onSuccess: () => void };

export default function LoginForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username?.trim(),
          password: values.password || "",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Error");
      onSuccess();
    } catch (e: any) {
      setMsg(e?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 380, width: "100%", margin: "48px auto" }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Usuario"
          name="username"
          rules={[{ required: true, message: "Ingresa tu usuario" }]}
        >
          <Input autoComplete="username" maxLength={64} />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: "Ingresa tu contraseña" }]}
        >
          <Input.Password autoComplete="current-password" maxLength={256} />
        </Form.Item>
        {msg && (
          <Alert
            type="error"
            message={msg}
            showIcon
            style={{ marginBottom: 8 }}
          />
        )}
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          style={{ background: "#1677ff" }}
        >
          Entrar
        </Button>
      </Form>
    </Card>
  );
}
