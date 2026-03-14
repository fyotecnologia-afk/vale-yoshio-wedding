// src/components/invitation/FormularioConfirmacion.tsx
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Space,
  Alert,
  Card,
  Steps,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Title, Text } = Typography;

type Invitado = {
  id: string;
  nombre: string;
  respuesta: "SI" | "NO" | null;
};

type ConfirmacionInvitado = {
  invitadoId: string;
  respuesta: "SI" | "NO";
};

type Confirmacion = {
  confirmacionInvitados: ConfirmacionInvitado[];
};

type InvitacionAPIResponse = {
  exists: boolean;
  estado: string;
  invitados: { id: string; nombre: string }[];
  confirmaciones: Confirmacion[];
  dedicatoria?: string;
};

type TipoMensaje = "success" | "info" | "warning" | "error";

type ConfirmInvitationProps = {
  numero?: string | null;
  intentosRealizados?: number; // desde inicio
};

export default function ConfirmInvitation({
  numero: numeroProp,
  intentosRealizados = 0,
}: ConfirmInvitationProps) {
  const [form] = Form.useForm();
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: TipoMensaje;
    texto: string;
  } | null>(null);
  const [dedicatoria, setDedicatoria] = useState("");
  const [fechaLimite, setFechaLimite] = useState<Date | null>(null);
  const [maxIntentos, setMaxIntentos] = useState(2);
  const [cerradoPorFecha, setCerradoPorFecha] = useState(false);
  const [cerradoPorIntentos, setCerradoPorIntentos] = useState(false);
  const [intentosRealizadosState, setIntentosRealizadosState] =
    useState(intentosRealizados);

  // Cargar parámetros globales y determinar bloqueos desde inicio
  useEffect(() => {
    const fetchParametros = async () => {
      try {
        const res = await fetch("/api/parametrosGlobales");
        if (!res.ok)
          throw new Error("No se pudieron obtener parámetros globales");
        const data = await res.json();

        let fechaCorte: Date | null = null;
        if (data.fechaLimite) {
          const [year, month, day] = data.fechaLimite.split("-").map(Number);
          fechaCorte = new Date(year, month - 1, day);
          fechaCorte.setHours(23, 59, 59, 999);
        }

        const now = new Date();
        const bloqueadoFecha = fechaCorte
          ? now.getTime() > fechaCorte.getTime()
          : false;
        const bloqueadoIntentos =
          intentosRealizadosState >= (data.maxIntentos || 2);

        setFechaLimite(fechaCorte);
        setMaxIntentos(data.maxIntentos || 2);
        setCerradoPorFecha(bloqueadoFecha);
        setCerradoPorIntentos(bloqueadoIntentos);
      } catch (error) {
        console.error(error);
      }
    };
    fetchParametros();
  }, []);

  // Precargar número si viene por props
  useEffect(() => {
    if (numeroProp) form.setFieldsValue({ numero: numeroProp });
  }, [numeroProp, form]);

  // Cada vez que cambien los intentos o el máximo, recalcula si está cerrado por intentos
  useEffect(() => {
    setCerradoPorIntentos(intentosRealizadosState >= maxIntentos);
  }, [intentosRealizadosState, maxIntentos]);

  const fechaFormateada = fechaLimite
    ? fechaLimite.toLocaleDateString("es-MX", { day: "numeric", month: "long" })
    : "";

  const cancelarSeleccion = () => {
    setCurrentStep(0); // Regresa al step 0
    setSeleccionados([]); // Limpia la selección
    setDedicatoria(""); // Limpia la dedicatoria
    setMensaje(null); // Limpia mensajes
  };

  const buscarInvitacion = async () => {
    const numero = form.getFieldValue("numero")?.trim();
    if (!numero) {
      setMensaje({ tipo: "error", texto: "Ingresa un número de invitación" });
      return;
    }
    setMensaje(null);

    try {
      const res = await fetch(
        `/api/invitaciones/${encodeURIComponent(numero)}`,
      );
      if (!res.ok) throw new Error("Invitación no encontrada");
      const data: InvitacionAPIResponse = await res.json();

      const invitadosConRespuesta = data.invitados.map((inv) => {
        let respuesta: "SI" | "NO" | null = null;
        for (const confirmacion of data.confirmaciones) {
          const cInvitado = confirmacion.confirmacionInvitados.find(
            (ci) => ci.invitadoId === inv.id,
          );
          if (cInvitado) {
            respuesta = cInvitado.respuesta;
            break;
          }
        }
        return { ...inv, respuesta };
      });

      setInvitados(invitadosConRespuesta);
      setDedicatoria(data.dedicatoria || "");
      form.setFieldsValue({ dedicatoria: data.dedicatoria || "" });

      const preSeleccionados = invitadosConRespuesta
        .filter((inv) => inv.respuesta === "SI")
        .map((inv) => inv.id);
      setSeleccionados(preSeleccionados);

      if (!cerradoPorFecha && !cerradoPorIntentos) {
        setCurrentStep(1);
      }
    } catch (error: any) {
      setMensaje({
        tipo: "error",
        texto: error.message || "Error buscando invitación",
      });
      setInvitados([]);
      setSeleccionados([]);
      setCurrentStep(0);
      setDedicatoria("");
      form.resetFields();
    }
  };

  const enviarConfirmacion = async () => {
    const dedicatoriaForm = form.getFieldValue("dedicatoria")?.trim() || "";

    if (seleccionados.length === 0 && dedicatoriaForm === "") {
      setMensaje({
        tipo: "error",
        texto: "Selecciona al menos un invitado o escribe una dedicatoria",
      });
      return;
    }

    // Bloqueos por fecha o intentos
    if (cerradoPorFecha || cerradoPorIntentos) {
      setMensaje({
        tipo: "warning",
        texto: cerradoPorFecha
          ? `La fecha límite para confirmar (${fechaFormateada}) ya pasó.`
          : `Ya se alcanzó el máximo de ${maxIntentos} intentos permitidos.`,
      });
      setCurrentStep(2); // Mostrar paso final con mensaje
      return;
    }

    setEnviando(true);
    setMensaje(null);

    try {
      const numero = form.getFieldValue("numero");
      const res = await fetch("/api/invitaciones/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero,
          asistentes: seleccionados,
          dedicatoria: dedicatoriaForm,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al confirmar");
      }

      setMensaje({ tipo: "success", texto: "¡Confirmado correctamente!" });
      setDedicatoria(dedicatoriaForm);

      // Incrementar intentos y automáticamente actualizar cerradoPorIntentos por useEffect
      setIntentosRealizadosState((c) => c + 1);

      setCurrentStep(2);
    } catch (error: any) {
      setMensaje({
        tipo: "error",
        texto: error.message || "Error al enviar confirmación",
      });
    } finally {
      setEnviando(false);
    }
  };

  const editarMiConfirmacion = async () => {
    await buscarInvitacion();
    setCurrentStep(1);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <Card
        style={{
          borderRadius: 24,
          background: "linear-gradient(180deg, #F6F1EB 0%, #fffef8 100%)",
          boxShadow:
            "0 12px 24px rgba(122,139,117,0.15),0 8px 16px rgba(203,178,120,0.3)",
          border: `1px solid rgb(206, 167, 150)`,
        }}
        title={
          <>
            <Title
              level={2}
              style={{
                textAlign: "center",
                fontSize: "clamp(1.2rem,5vw,2rem)",
                margin: "1rem 0 0",
              }}
              className="title-decorative"
            >
              Confirma tu asistencia
            </Title>
            <Text
              style={{
                display: "block",
                textAlign: "center",
                color: "rgb(206, 167, 150)",
                fontSize: "clamp(1rem,2vw,1.2rem)",
                margin: "0 auto",
                lineHeight: 1.5,
                fontWeight: 100,
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
              className="font-manjari"
            >
              Nos encantará contar contigo. Por favor confirma tu asistencia
              antes del <strong>{fechaFormateada}</strong> para ayudarnos a
              preparar todo con cariño.
            </Text>
          </>
        }
      >
        <Steps
          current={currentStep}
          size="small"
          style={{ marginBottom: 24 }}
          items={[
            {
              title: "Buscar",
              icon: <MailOutlined />,
              className: "font-manjari",
            },
            {
              title: "Seleccionar",
              icon: <UserOutlined />,
              className: "font-manjari",
            },
            {
              title: "Confirmado",
              icon: <CheckCircleOutlined />,
              className: "font-manjari",
            },
          ]}
        />

        {/* Mostrar alerta si está cerrado por fecha o max intentos */}
        {(cerradoPorFecha || cerradoPorIntentos) && (
          <Alert
            message={
              cerradoPorIntentos
                ? `Formulario cerrado por intentos alcanzados`
                : "Formulario cerrado por fecha"
            }
            description={
              cerradoPorIntentos
                ? `Ya se han realizado los ${maxIntentos} intentos permitidos. Ponte en contacto con los novios.`
                : `La fecha límite para confirmar (${fechaFormateada}) ha terminado. Ponte en contacto con los novios.`
            }
            type="warning"
            showIcon
            style={{ marginBottom: 12 }}
            className="font-manjari"
          />
        )}

        {/* Step 0 */}
        {currentStep === 0 && !cerradoPorFecha && !cerradoPorIntentos && (
          <Form form={form} layout="vertical" onFinish={buscarInvitacion}>
            <Form.Item
              label="Número de invitación"
              name="numero"
              rules={[
                {
                  required: true,
                  message: "Ingresa tu número de invitación",
                },
              ]}
              className="font-manjari"
            >
              <Input
                placeholder="Comienza por VY"
                className="font-manjari"
                style={{ borderRadius: 8, padding: 12, color: "black" }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{
                  backgroundColor: "rgb(206, 167, 150)",
                  borderColor: "rgb(206, 167, 150)",
                  borderRadius: 8,
                  fontWeight: "bold",
                }}
              >
                Buscar invitados
              </Button>
            </Form.Item>
          </Form>
        )}

        {/* Step 1 */}
        {!cerradoPorFecha && !cerradoPorIntentos && currentStep === 1 && (
          <>
            <Alert
              message="Selecciona quién asistirá"
              description="Marca los nombres que confirmarán asistencia."
              type="info"
              showIcon
              style={{ marginBottom: 5 }}
              className="font-manjari"
            />
            <Form form={form} layout="vertical" onFinish={enviarConfirmacion}>
              <Form.Item label="¿Quiénes asistirán?">
                <Checkbox.Group
                  style={{ width: "100%" }}
                  value={seleccionados}
                  onChange={setSeleccionados}
                  className="font-manjari"
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {invitados.map(({ id, nombre, respuesta }) => (
                      <Checkbox key={id} value={id}>
                        <span
                          style={{ fontWeight: 500 }}
                          className="font-manjari"
                        >
                          {nombre}
                        </span>
                        {respuesta === "SI" && (
                          <Text type="success" style={{ marginLeft: 8 }}>
                            (Confirmado)
                          </Text>
                        )}
                        {respuesta === "NO" && (
                          <Text type="danger" style={{ marginLeft: 8 }}>
                            (No asistirá)
                          </Text>
                        )}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item label="Dedicatoria (opcional)" name="dedicatoria">
                <TextArea
                  rows={4}
                  placeholder="Escribe unas palabras..."
                  className="font-manjari"
                  style={{ borderRadius: 8, color: "black" }}
                  value={dedicatoria} // sincronizado con estado
                  onChange={(e) => setDedicatoria(e.target.value)}
                />
              </Form.Item>

              <Form.Item style={{}}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={enviando}
                  disabled={seleccionados.length === 0 && !dedicatoria}
                  style={{
                    backgroundColor: "rgb(206, 167, 150)",
                    borderColor: "rgb(206, 167, 150)",
                    borderRadius: 8,
                    fontWeight: "bold",
                    marginTop: 24,
                  }}
                  block
                >
                  Confirmar
                </Button>
                <Button
                  type="default"
                  onClick={() => {
                    setCurrentStep(0);
                    setSeleccionados([]);
                    setDedicatoria("");
                    form.setFieldsValue({ dedicatoria: "" });
                    setMensaje(null);
                  }}
                  style={{
                    borderRadius: 8,
                    fontWeight: "bold",
                    marginTop: 12,
                  }}
                  block
                >
                  Cancelar
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {/* Step 2 */}
        {currentStep === 2 && !cerradoPorFecha && !cerradoPorIntentos && (
          <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
            <CheckCircleOutlined
              style={{ fontSize: 64, color: "#52c41a", marginBottom: 16 }}
            />
            <Title level={4} style={{ color: "rgb(206, 167, 150)" }}>
              {cerradoPorFecha
                ? `La fecha límite para confirmar (${fechaFormateada}) ya pasó.`
                : cerradoPorIntentos
                  ? `Ya se alcanzó el máximo de ${maxIntentos} intentos permitidos.`
                  : "¡Gracias por confirmar!"}
            </Title>
            {!cerradoPorIntentos && !cerradoPorFecha && (
              <>
                <Text
                  style={{ color: "rgb(206, 167, 150)" }}
                  className="font-manjari"
                >
                  Estamos felices de contar contigo en este evento tan especial.
                </Text>
                <Button
                  type="primary"
                  onClick={editarMiConfirmacion}
                  style={{
                    backgroundColor: "rgb(206, 167, 150)",
                    borderColor: "rgb(206, 167, 150)",
                    borderRadius: 8,
                    fontWeight: "bold",
                    marginTop: 24,
                  }}
                  block
                >
                  Editar mi confirmación
                </Button>
              </>
            )}
          </div>
        )}

        {mensaje && currentStep !== 2 && (
          <Alert
            message={mensaje.texto}
            type={mensaje.tipo}
            showIcon
            style={{ marginBottom: 12 }}
          />
        )}
      </Card>
    </div>
  );
}
