// src/components/admin/GuestsTable.tsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  Switch,
  message,
  Grid,
} from "antd";

const { useBreakpoint } = Grid;

type Props = {
  invitacionId: string;
};

const GuestsTable: React.FC<Props> = ({ invitacionId }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<any | null>(null);
  const [form] = Form.useForm();

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/invitados/${invitacionId}`);
    const json = await res.json();
    setItems(json);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [invitacionId]);

  const openCreate = () => {
    setEdit(null);
    form.resetFields();
    form.setFieldsValue({
      principal: false,
      especial: false,
      estado: "ACTIVO",
    });
    setOpen(true);
  };

  const openEdit = (row: any) => {
    setEdit(row);
    form.setFieldsValue({
      nombre: row.nombre,
      principal: !!row.principal,
      especial: !!row.especial,
      categoria: row.categoria ?? undefined,
      estado: row.estado,
    });
    setOpen(true);
  };

  const submit = async () => {
    const values = await form.validateFields();
    const isEdit = !!edit;

    const url = isEdit
      ? `/api/admin/invitados/item/${edit.id}`
      : `/api/admin/invitados/${invitacionId}`;

    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setOpen(false);
    await fetchItems();
  };

  const toggleEstado = async (row: any) => {
    await fetch(`/api/admin/invitados/item/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        estado: row.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO",
      }),
    });
    await fetchItems();
  };

  const toggleEspecial = async (row: any) => {
    try {
      await fetch(`/api/admin/invitados/item/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          especial: !row.especial,
        }),
      });
      message.success("Especial actualizado");
      await fetchItems();
    } catch (e: any) {
      message.error(e.message || "Error");
    }
  };

  const renderRespuesta = (r: any) => {
    if (!r.confirmacionInvitados?.length) {
      return <Tag color="default">Sin respuesta</Tag>;
    }

    const resp = r.confirmacionInvitados[0].respuesta;

    if (resp === "SI") return <Tag color="green">Confirmó</Tag>;
    if (resp === "NO") return <Tag color="red">Rechazó</Tag>;

    return <Tag>Sin respuesta</Tag>;
  };

  return (
    <>
      <Space style={{ marginBottom: 12, width: "100%" }}>
        <Button block={isMobile} type="primary" onClick={openCreate}>
          Agregar invitado
        </Button>
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={items}
        size={isMobile ? "small" : "middle"}
        scroll={{ x: true }}
        pagination={{ pageSize: 8 }}
        // 🔥 MOBILE EXPANDIBLE
        expandable={
          isMobile
            ? {
                expandedRowRender: (r) => (
                  <div style={{ fontSize: 12 }}>
                    <Space direction="vertical" size={4}>
                      <div>
                        <b>Categoría:</b>{" "}
                        {r.categoria ? <Tag>{r.categoria}</Tag> : "-"}
                      </div>

                      <div>
                        <b>Principal:</b>{" "}
                        {r.principal ? (
                          <Tag color="blue">Sí</Tag>
                        ) : (
                          <Tag>No</Tag>
                        )}
                      </div>

                      <div>
                        <b>Respuesta:</b> {renderRespuesta(r)}
                      </div>

                      <div>
                        <b>Especial:</b>{" "}
                        <Switch
                          size="small"
                          checked={r.especial}
                          onChange={() => toggleEspecial(r)}
                        />
                      </div>

                      <div>
                        <b>Estado:</b>{" "}
                        <Switch
                          size="small"
                          checked={r.estado === "ACTIVO"}
                          onChange={() => toggleEstado(r)}
                        />
                      </div>

                      <Button size="small" onClick={() => openEdit(r)}>
                        Editar
                      </Button>
                    </Space>
                  </div>
                ),
              }
            : undefined
        }
        columns={[
          {
            title: "Nombre",
            dataIndex: "nombre",
          },

          {
            title: "Principal",
            dataIndex: "principal",
            render: (v) => (v ? <Tag color="blue">Sí</Tag> : <Tag>No</Tag>),
            responsive: ["md"],
          },

          {
            title: "Especial",
            dataIndex: "especial",
            render: (v, row) => (
              <Switch checked={v} onChange={() => toggleEspecial(row)} />
            ),
            responsive: ["md"],
          },

          {
            title: "Categoría",
            dataIndex: "categoria",
            render: (v) => (v ? <Tag>{v}</Tag> : "-"),
            responsive: ["lg"],
          },

          {
            title: "Respuesta",
            render: (_, r) => renderRespuesta(r),
          },

          {
            title: "Acciones",
            render: (_, row) => (
              <Space wrap>
                <Button
                  size={isMobile ? "small" : "middle"}
                  onClick={() => openEdit(row)}
                >
                  Editar
                </Button>

                <Switch
                  size={isMobile ? "small" : "default"}
                  checked={row.estado === "ACTIVO"}
                  onChange={() => toggleEstado(row)}
                  checkedChildren="ACTIVO"
                  unCheckedChildren="INACTIVO"
                />
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={edit ? "Editar invitado" : "Agregar invitado"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submit}
        okText={edit ? "Guardar cambios" : "Agregar"}
        width={isMobile ? "100%" : 500}
        style={isMobile ? { top: 0 } : {}}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Nombre" name="nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Principal" name="principal" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Especial" name="especial" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Categoría" name="categoria">
            <Select
              allowClear
              options={[
                { value: "ADULTO", label: "ADULTO" },
                { value: "NINO", label: "NIÑO" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Estado" name="estado" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "ACTIVO", label: "ACTIVO" },
                { value: "INACTIVO", label: "INACTIVO" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default GuestsTable;
