// src/pages/admin/[id].tsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Space,
  Tag,
  Button,
  message,
  Typography,
  Divider,
  List,
  Switch,
} from "antd";
import { useRouter } from "next/router";
import InvitationForm from "@/components/admin/InvitationForm";
import GuestsTable from "@/components/admin/GuestsTable";
import { useSpring, animated } from "@react-spring/web";
import AdminLayout from "@/components/admin/AdminLayout"; // ⬅ Importa tu layout

const { Title, Text } = Typography;

export default function AdminDetail() {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const spring = useSpring({
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
  });

  const fetchItem = async () => {
    if (!id || id === "login") return;
    setLoading(true);
    const res = await fetch(`/api/admin/invitaciones/${id}`);
    if (!res.ok) {
      message.error("Invitación no encontrada en [id].tsx");
      router.replace("/admin");
      return;
    }
    const json = await res.json();
    setItem(json);
    setLoading(false);
  };

  useEffect(() => {
    if (id && id !== "login") fetchItem();
  }, [id]);

  const save = async (values: any) => {
    if (!id) return;
    const res = await fetch(`/api/admin/invitaciones/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const err = await res.json();
      message.error(err.error || "Error al guardar");
      return;
    }
    message.success("Guardado");
    fetchItem();
  };

  const toggleEstado = async () => {
    if (!item || !id) return;
    const nuevo = item.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    const res = await fetch(`/api/admin/invitaciones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevo }),
    });
    if (!res.ok) return message.error("Error al actualizar estado");
    message.success(`Estado: ${nuevo}`);
    fetchItem();
  };

  if (!item) return null;

  // ⬇ Envuelve todo en AdminLayout
  return (
    <AdminLayout>
      <animated.div
        style={{
          ...spring,

          maxWidth: "100%",
          margin: "0 auto",
          overflowX: "auto",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Card
            loading={loading}
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  Editar Invitación
                </Title>
                {/* <Button onClick={() => router.push("/admin")}>Volver</Button> */}
                <Button onClick={() => router.back()}>Volver</Button>
              </div>
            }
          >
            <InvitationForm
              initialValues={item}
              onSubmit={save}
              submitText="Guardar cambios"
            />

            <Divider />

            <Space align="center" wrap>
              <Text strong>Cambiar estado:</Text>
              <Switch
                checked={item.estado === "ACTIVO"}
                onChange={toggleEstado}
                checkedChildren="ACTIVO"
                unCheckedChildren="INACTIVO"
              />
            </Space>
          </Card>

          <Card title="Invitados">
            <div style={{ overflowX: "auto" }}>
              <GuestsTable invitacionId={id} />
            </div>
          </Card>

          <Card title="Confirmaciones / Dedicatorias">
            <div style={{ overflowX: "auto" }}>
              {item.confirmaciones?.length === 0 ? (
                <Text type="secondary">No hay confirmaciones</Text>
              ) : (
                <List
                  dataSource={item.confirmaciones}
                  renderItem={(c: any) => (
                    <List.Item>
                      <Space
                        direction="vertical"
                        style={{ width: "100%" }}
                        wrap
                      >
                        <Space
                          style={{
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                          wrap
                        >
                          <Text strong>
                            {new Date(c.createdAt).toLocaleString()}
                          </Text>
                          <Tag>
                            Invitados: {c.confirmacionInvitados?.length || 0}
                          </Tag>
                        </Space>
                        <Text>{c.dedicatoria}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              )}
            </div>
          </Card>
        </Space>
      </animated.div>
    </AdminLayout>
  );
}
