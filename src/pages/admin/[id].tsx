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
  Grid,
  Tabs,
} from "antd";
import { useRouter } from "next/router";
import InvitationForm from "@/components/admin/InvitationForm";
import GuestsTable from "@/components/admin/GuestsTable";
import { useSpring, animated } from "@react-spring/web";
import AdminLayout from "@/components/admin/AdminLayout";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function AdminDetail() {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const screens = useBreakpoint();
  const isMobile = !screens.md;

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
      message.error("Invitación no encontrada");
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

  // 🔹 SECCIONES reutilizables
  const InvitacionSection = (
    <Card loading={loading}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Title level={4} style={{ margin: 0 }}>
          Editar Invitación
        </Title>

        <InvitationForm
          initialValues={item}
          onSubmit={save}
          submitText="Guardar cambios"
        />

        <Divider />

        <Space align="center" wrap>
          <Text strong>Estado:</Text>
          <Switch
            checked={item.estado === "ACTIVO"}
            onChange={toggleEstado}
            checkedChildren="ACTIVO"
            unCheckedChildren="INACTIVO"
          />
        </Space>
      </Space>
    </Card>
  );

  const InvitadosSection = (
    <Card title="Invitados">
      <GuestsTable invitacionId={id} />
    </Card>
  );

  const DedicatoriasSection = (
    <Card title="Confirmaciones / Dedicatorias">
      {item.confirmaciones?.length === 0 ? (
        <Text type="secondary">No hay confirmaciones</Text>
      ) : (
        <List
          dataSource={item.confirmaciones}
          renderItem={(c: any) => (
            <List.Item>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space
                  style={{
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                  wrap
                >
                  <Text strong>{new Date(c.createdAt).toLocaleString()}</Text>

                  <Tag>Invitados: {c.confirmacionInvitados?.length || 0}</Tag>
                </Space>

                <Text>{c.dedicatoria}</Text>
              </Space>
            </List.Item>
          )}
        />
      )}
    </Card>
  );

  return (
    <AdminLayout>
      <animated.div style={{ ...spring, width: "100%" }}>
        {/* HEADER */}
        <Space
          style={{
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 16,
          }}
        >
          <Title level={isMobile ? 5 : 4} style={{ margin: 0 }}>
            Panel de Invitación
          </Title>

          <Button onClick={() => router.back()}>Volver</Button>
        </Space>

        {/* 📱 MOBILE → TABS */}
        {isMobile ? (
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "Invitación",
                children: InvitacionSection,
              },
              {
                key: "2",
                label: "Invitados",
                children: InvitadosSection,
              },
              {
                key: "3",
                label: "Dedicatorias",
                children: DedicatoriasSection,
              },
            ]}
          />
        ) : (
          /* 🖥️ DESKTOP → STACK LIMPIO */
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {InvitacionSection}
            {InvitadosSection}
            {DedicatoriasSection}
          </Space>
        )}
      </animated.div>
    </AdminLayout>
  );
}
