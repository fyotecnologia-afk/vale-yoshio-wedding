// src/components/admin/AdminList.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Input,
  Tag,
  Space,
  Modal,
  message,
  Select,
  Switch,
  notification,
  Grid,
} from "antd";
import { useSpring, animated } from "@react-spring/web";
import Link from "next/link";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { useBreakpoint } = Grid;

export default function AdminList() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState<string | undefined>(undefined);
  const [especial, setEspecial] = useState<boolean | undefined>(undefined);
  const [openCreate, setOpenCreate] = useState(false);
  const [ultimoNumero, setUltimoNumero] = useState("");

  const spring = useSpring({
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
  });

  const fetchAllItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invitaciones?pageSize=10000");
      const json = await res.json();
      const items = (json.items || []).map((item: any) => ({
        ...item,
        _count: item._count || { invitados: 0, confirmaciones: 0 },
      }));
      setData(items);
    } catch (e: any) {
      message.error("Error al cargar datos: " + e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllItems();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const text = q.toLowerCase();
      const matchesQ =
        item.numero?.toLowerCase().includes(text) ||
        item.familia?.toLowerCase().includes(text) ||
        item.tipo?.toLowerCase().includes(text) ||
        item.hostedBy?.toLowerCase().includes(text);

      const matchesEstado = estado ? item.estado === estado : true;

      const matchesEspecial =
        especial === undefined
          ? true
          : especial
            ? item.invitados?.some((inv: any) => inv.especial)
            : !item.invitados?.some((inv: any) => inv.especial);

      return matchesQ && matchesEstado && matchesEspecial;
    });
  }, [data, q, estado, especial]);

  const exportToExcel = async () => {
    try {
      const rows = filteredData.flatMap((inv: any) => {
        const orderedConfirmations = (inv.confirmaciones || []).sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        const confirmMap: Record<string, string> = {};
        orderedConfirmations.forEach((c: any) => {
          c.confirmacionInvitados?.forEach((ci: any) => {
            if (!(ci.invitadoId in confirmMap)) {
              confirmMap[ci.invitadoId] = ci.respuesta;
            }
          });
        });

        return (inv.invitados || []).map((guest: any) => ({
          Tipo: inv.tipo ?? "",
          "Numero de invitacion": inv.numero ?? "",
          Familia: inv.familia ?? "",
          Principal: guest.principal ? 1 : 0,
          "Nombre Invitado": guest.nombre ?? "",
          "Adulto | Niño": guest.categoria ?? "",
          Especial: guest.especial ? 1 : 0,
          CONFIRMADO:
            confirmMap[guest.id] === "SI"
              ? "CONFIRMADO"
              : confirmMap[guest.id] === "NO"
                ? "NO CONFIRMADO"
                : "SIN RESPUESTA",
        }));
      });

      const safeRows =
        rows.length > 0 ? rows : [{ Tipo: "", "Numero de invitacion": "" }];

      const ws = XLSX.utils.json_to_sheet(safeRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Invitados");

      if (ws["!ref"]) (ws as any)["!autofilter"] = { ref: ws["!ref"] };

      const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([buf]), `invitados.xlsx`);
    } catch (e: any) {
      message.error("Error al exportar: " + e.message);
    }
  };

  return (
    <animated.div
      style={{
        ...spring,
        width: "100%",
      }}
    >
      {/* FILTROS RESPONSIVE */}
      <Space
        direction={isMobile ? "vertical" : "horizontal"}
        style={{ marginBottom: 12, width: "100%" }}
        size={isMobile ? "middle" : "small"}
        wrap
      >
        <Input.Search
          placeholder="Buscar..."
          allowClear
          enterButton={!isMobile}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ width: "100%" }}
        />

        <Space wrap style={{ width: "100%" }}>
          <Select
            placeholder="Estado"
            allowClear
            style={{ flex: 1, minWidth: 120 }}
            value={estado}
            onChange={setEstado}
            options={[
              { value: "ACTIVO", label: "ACTIVO" },
              { value: "INACTIVO", label: "INACTIVO" },
            ]}
          />

          <Select
            placeholder="Especial"
            allowClear
            style={{ flex: 1, minWidth: 120 }}
            value={especial === undefined ? undefined : especial ? "SI" : "NO"}
            onChange={(val) => {
              if (val === "SI") setEspecial(true);
              else if (val === "NO") setEspecial(false);
              else setEspecial(undefined);
            }}
            options={[
              { value: "SI", label: "Sí" },
              { value: "NO", label: "No" },
            ]}
          />
        </Space>

        <Space wrap style={{ width: "100%" }}>
          <Button
            block={isMobile}
            type="primary"
            onClick={() => setOpenCreate(true)}
          >
            Nueva invitación
          </Button>

          <Button block={isMobile} onClick={exportToExcel}>
            Exportar
          </Button>
        </Space>
      </Space>

      {/* TABLA */}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={filteredData}
        size={isMobile ? "small" : "middle"}
        expandable={
          isMobile
            ? {
                expandedRowRender: (r) => (
                  <div style={{ fontSize: 12 }}>
                    <Space wrap>
                      <Tag color="blue">Invitados: {r.conteoInvitados}</Tag>
                      <Tag color="green">Conf: {r.conteoConfirmados}</Tag>
                      <Tag color="red">No Conf: {r.conteoNoConfirmados}</Tag>
                      <Tag>Sin resp: {r.conteoSinRespuesta}</Tag>
                    </Space>
                  </div>
                ),
              }
            : undefined
        }
        columns={[
          { title: "Número", dataIndex: "numero" },
          { title: "Familia", dataIndex: "familia" },
          { title: "Tipo", dataIndex: "tipo", responsive: ["md"] },
          { title: "Hosted By", dataIndex: "hostedBy", responsive: ["lg"] },
          {
            title: "Estado",
            dataIndex: "estado",
            render: (v, r) => (
              <Switch
                checked={v === "ACTIVO"}
                onChange={async (checked) => {
                  const nuevoEstado = checked ? "ACTIVO" : "INACTIVO";
                  try {
                    await fetch(`/api/admin/invitaciones/${r.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ estado: nuevoEstado }),
                    });
                    message.success(`Estado actualizado`);
                    fetchAllItems();
                  } catch (e: any) {
                    message.error(e.message);
                  }
                }}
              />
            ),
          },
          {
            title: "Conteo",
            render: (_, r) => (
              <Space size="small" wrap>
                <Tag color="blue">Invitados: {r.conteoInvitados}</Tag>
                <Tag color="green">Sí: {r.conteoConfirmados}</Tag>
                <Tag color="red">No: {r.conteoNoConfirmados}</Tag>
                <Tag>Sin Respuesta: {r.conteoSinRespuesta}</Tag>
              </Space>
            ),
            responsive: ["md"],
          },
          {
            title: "Acciones",
            fixed: isMobile ? undefined : "right",
            render: (_, r) => (
              <Link href={`/admin/${r.id}`}>
                <Button size={isMobile ? "small" : "middle"}>Editar</Button>
              </Link>
            ),
          },
        ]}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />

      {/* MODAL */}
      <Modal
        title="Nueva invitación"
        open={openCreate}
        onCancel={() => setOpenCreate(false)}
        footer={null}
        width={isMobile ? "100%" : 600}
        style={isMobile ? { top: 0 } : {}}
        destroyOnHidden
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          {React.createElement(
            require("@/components/admin/InvitationForm").default,
            {
              onSubmit: async (values: any) => {
                const res = await fetch("/api/admin/invitaciones", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                });

                if (!res.ok) {
                  const err = await res.json();
                  message.error(err.error || "Error al crear");
                  return;
                }

                const created = await res.json();
                setUltimoNumero(created.numero);
                notification.success({
                  message: `Invitación creada`,
                  description: `Número: ${created.numero}`,
                  duration: 0,
                });
                setOpenCreate(false);
                fetchAllItems();
              },
              submitText: "Crear",
            },
          )}
        </Space>
      </Modal>
    </animated.div>
  );
}
