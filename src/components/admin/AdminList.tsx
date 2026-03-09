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
} from "antd";
import { useSpring, animated } from "@react-spring/web";
import Link from "next/link";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function AdminList() {
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
      const res = await fetch("/api/admin/invitaciones?pageSize=10000"); // traemos todos
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

  // Filtrado en el cliente
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
        // Ordenar confirmaciones por fecha (de más reciente a más antigua)
        const orderedConfirmations = (inv.confirmaciones || []).sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Mapeamos la respuesta más reciente por invitadoId
        const confirmMap: Record<string, string> = {};
        orderedConfirmations.forEach((c: any) => {
          c.confirmacionInvitados?.forEach((ci: any) => {
            // Solo actualizamos si aún no existe una respuesta previa (la primera encontrada será la más reciente)
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
        maxWidth: "100%",
        margin: "0 auto",
        overflowX: "auto",
      }}
    >
      <Space style={{ marginBottom: 12, flexWrap: "wrap" }}>
        <Input.Search
          placeholder="Buscar por número, familia, tipo, hostedBy..."
          allowClear
          enterButton="Buscar"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ minWidth: 260, flex: "1 1 300px" }}
        />

        <Select
          placeholder="Estado"
          allowClear
          style={{ width: 180 }}
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
          style={{ width: 180 }}
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

        <Button type="primary" onClick={() => setOpenCreate(true)}>
          Nueva invitación
        </Button>

        <Button onClick={exportToExcel} type="default">
          Exportar a Excel
        </Button>
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={filteredData}
        columns={[
          { title: "Número", dataIndex: "numero", responsive: ["sm"] },
          { title: "Familia", dataIndex: "familia", responsive: ["sm"] },
          { title: "Tipo", dataIndex: "tipo", responsive: ["md"] },
          { title: "Hosted By", dataIndex: "hostedBy", responsive: ["md"] },
          {
            title: "Estado",
            dataIndex: "estado",
            render: (v, r) => (
              <Switch
                checked={v === "ACTIVO"}
                checkedChildren="ACTIVO"
                unCheckedChildren="INACTIVO"
                onChange={async (checked) => {
                  const nuevoEstado = checked ? "ACTIVO" : "INACTIVO";
                  try {
                    await fetch(`/api/admin/invitaciones/${r.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ estado: nuevoEstado }),
                    });
                    message.success(`Estado actualizado a ${nuevoEstado}`);
                    fetchAllItems(); // recargamos todos los datos
                  } catch (e: any) {
                    message.error(e.message);
                  }
                }}
              />
            ),
            responsive: ["sm"],
          },
          {
            title: "Flags",
            render: (_, r) => (
              <Space size="small" wrap>
                {r.invitados?.some((inv: any) => inv.especial) && (
                  <Tag color="yellow">Especial</Tag>
                )}
              </Space>
            ),
            responsive: ["md"],
          },
          {
            title: "Conteo",
            render: (_, r) => (
              <Space size="small" wrap>
                <Tag>Invitados: {r.conteoInvitados}</Tag>
                <Tag>Conf.: {r.conteoConfirmados}</Tag>
                <Tag>No Conf.: {r.conteoNoConfirmados}</Tag>
                <Tag>Sin resp.: {r.conteoSinRespuesta}</Tag>
              </Space>
            ),
            responsive: ["sm"],
          },
          {
            title: "Acciones",
            render: (_, r) => (
              <Space>
                <Link href={`/admin/${r.id}`}>
                  <Button>Editar</Button>
                </Link>
              </Space>
            ),
          },
        ]}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />

      {/* Modal para nueva invitación */}
      <Modal
        title="Nueva invitación"
        open={openCreate}
        onCancel={() => setOpenCreate(false)}
        footer={null}
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
                  description: `Número de invitación: ${created.numero}`,
                  duration: 0,
                });
                setOpenCreate(false);
                fetchAllItems();
              },
              submitText: "Crear",
            }
          )}
        </Space>
      </Modal>
    </animated.div>
  );
}
