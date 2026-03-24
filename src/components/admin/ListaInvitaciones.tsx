// src/components/admin/ListaInvitaciones.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  message,
  Space,
  Button,
  Collapse,
  Input,
  Card,
  Tag,
} from "antd";
import {
  CopyOutlined,
  DownloadOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";

const { Panel } = Collapse;

type Respuesta = "SI" | "NO" | null;

interface Invitado {
  id: string;
  nombre: string;
  respuesta: Respuesta;
  principal?: boolean;
  categoria?: string;
}

interface Dedicatoria {
  id: string;
  texto: string;
  fecha: string;
}

interface InvitacionData {
  id: string;
  numeroInvitacion: string;
  url: string;
  familia?: string;
  invitados: Invitado[];
  dedicatorias: Dedicatoria[];
}

export default function ListaInvitaciones() {
  const [datos, setDatos] = useState<InvitacionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const obtenerDatos = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/invitaciones/lista");
        if (!res.ok) throw new Error("Error al cargar los datos");
        const json = await res.json();
        setDatos(json.datos || []);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    obtenerDatos();
  }, []);

  const copiarAlPortapapeles = async (url: string) => {
    const textoCompleto = `Nos llena de alegría compartir contigo que inos casamos! 💍✨
Queremos invitarte con mucho cariño a nuestra boda.

Será un honor contar con tu presencia.
Con cariño,
Valeria y Yoshio❤️\n\n${url}`;

    try {
      await navigator.clipboard.writeText(textoCompleto);
      message.success("Texto copiado");
    } catch {
      message.error("No se pudo copiar");
    }
  };

  const exportarExcel = () => {
    if (datos.length === 0) {
      message.warning("No hay datos para exportar");
      return;
    }

    const rows: any[] = [];

    datos.forEach((inv) => {
      const invitadosText = inv.invitados
        .map(
          (i) =>
            `${i.nombre} — ${
              i.respuesta === "SI"
                ? "Confirmado"
                : i.respuesta === "NO"
                  ? "No asistirá"
                  : "Sin respuesta"
            }`,
        )
        .join("\n");

      rows.push({
        "Número Invitación": inv.numeroInvitacion,
        Familia: inv.familia || "",
        Invitados: invitadosText,
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invitaciones");
    XLSX.writeFile(workbook, "Invitaciones.xlsx");
  };

  // TABLE (DESKTOP)
  const columnas = [
    {
      title: "Número",
      dataIndex: "numeroInvitacion",
      key: "numeroInvitacion",
    },
    {
      title: "Familia",
      dataIndex: "familia",
      key: "familia",
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (url: string) => (
        <Space direction="vertical">
          <Space>
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => window.open(url, "_blank")}
            />

            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copiarAlPortapapeles(url)}
            />
          </Space>
        </Space>
      ),
    },
    {
      title: "Invitados",
      dataIndex: "invitados",
      key: "invitados",
      render: (invitados: Invitado[]) => (
        <ul style={{ paddingLeft: 16 }}>
          {invitados.map((i) => (
            <li key={i.id}>
              {i.nombre} —{" "}
              <strong>
                {i.respuesta === "SI" ? "✔" : i.respuesta === "NO" ? "✘" : "-"}
              </strong>
            </li>
          ))}
        </ul>
      ),
    },
  ];

  // MOBILE UI (CARDS)
  const renderMobile = () => (
    <Space direction="vertical" style={{ width: "100%" }} size={16}>
      {datosFiltrados.map((inv) => (
        <Card
          key={inv.id}
          style={{ borderRadius: 16 }}
          title={`Invitación ${inv.numeroInvitacion}`}
          extra={
            <Space>
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => window.open(inv.url, "_blank")}
              />
              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={() => copiarAlPortapapeles(inv.url)}
              />
            </Space>
          }
        >
          <p>
            <strong>Familia:</strong> {inv.familia || "-"}
          </p>

          <div style={{ marginBottom: 10 }}>
            <strong>Invitados:</strong>
            <ul style={{ paddingLeft: 18 }}>
              {inv.invitados.map((i) => (
                <li key={i.id}>
                  {i.nombre}{" "}
                  {i.respuesta === "SI" && <Tag color="green">Asiste</Tag>}
                  {i.respuesta === "NO" && <Tag color="red">No</Tag>}
                  {i.respuesta === null && <Tag>Sin respuesta</Tag>}
                </li>
              ))}
            </ul>
          </div>

          <Collapse>
            {inv.dedicatorias.map((d) => (
              <Panel header={new Date(d.fecha).toLocaleDateString()} key={d.id}>
                <p style={{ whiteSpace: "pre-wrap" }}>{d.texto}</p>
              </Panel>
            ))}
          </Collapse>
        </Card>
      ))}
    </Space>
  );

  // FILTRO
  const datosFiltrados = datos.filter((inv) => {
    const invitadosText = inv.invitados.map((i) => i.nombre).join(" ");
    return (
      inv.numeroInvitacion.toLowerCase().includes(busqueda.toLowerCase()) ||
      (inv.familia || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      invitadosText.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  return (
    <div>
      {/* HEADER */}
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Input
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ width: isMobile ? "100%" : 300 }}
          allowClear
          prefix={<SearchOutlined />}
        />

        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={exportarExcel}
          block={isMobile}
        >
          Exportar
        </Button>
      </Space>

      {/* CONTENIDO */}
      {datos.length > 0 &&
        (isMobile ? (
          renderMobile()
        ) : (
          <Table
            columns={columnas}
            dataSource={datosFiltrados}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        ))}
    </div>
  );
}
