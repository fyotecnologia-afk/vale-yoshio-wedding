// src/components/admin/config/GlobalSettings.tsx
import React, { useEffect, useRef } from "react";
import { Form, InputNumber, Button, Card, DatePicker, message } from "antd";
import dayjs from "dayjs";

const GlobalSettings: React.FC = () => {
  const [form] = Form.useForm();
  const idsRef = useRef<{ [key: string]: string }>({}); // Guardar los IDs de los parámetros

  // Cargar valores existentes desde la API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/config/parametros");
        const data = await res.json();

        if (data && Array.isArray(data)) {
          const settings: Record<string, any> = {};
          data.forEach((item: any) => {
            if (item.tipo === "fechaLimite" && item.valorDate) {
              settings.fechaLimite = dayjs(item.valorDate);
              idsRef.current.fechaLimite = item.id; // Guardar id
            }
            if (item.tipo === "maxIntentos" && item.valorNumber !== null) {
              settings.maxIntentos = item.valorNumber;
              idsRef.current.maxIntentos = item.id; // Guardar id
            }
          });
          form.setFieldsValue(settings);
        }
      } catch (error) {
        console.error("Error cargando parámetros:", error);
        message.error("No se pudieron cargar los parámetros");
      }
    };

    fetchSettings();
  }, [form]);

  const handleSave = async (values: any) => {
    try {
      const payload = [
        {
          id: idsRef.current.fechaLimite, // ⚡ enviar id
          valorDate: values.fechaLimite
            ? dayjs(values.fechaLimite).format("YYYY-MM-DD")
            : null,
        },
        {
          id: idsRef.current.maxIntentos, // ⚡ enviar id
          valorNumber: values.maxIntentos || null,
        },
      ];

      const res = await fetch("/api/admin/config/parametros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        message.success("Parámetros guardados correctamente");
      } else {
        message.error("Error al guardar parámetros");
      }
    } catch (error) {
      console.error("Error en handleSave:", error);
      message.error("Error al conectar con el servidor");
    }
  };

  return (
    <Card
      title="Parámetros Globales"
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      {/* Nota de advertencia */}
      <div style={{ marginBottom: 16, color: "#d48806", fontWeight: 500 }}>
        Nota: tener cuidado con la edición de estos parámetros y modificar con
        responsabilidad.
      </div>
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item
          label="Fecha Límite de Confirmación"
          name="fechaLimite"
          rules={[{ required: true, message: "La fecha límite es requerida" }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Máximo de Intentos de Confirmación"
          name="maxIntentos"
          rules={[{ required: true, message: "Requerido" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Guardar
        </Button>
      </Form>
    </Card>
  );
};

export default GlobalSettings;
