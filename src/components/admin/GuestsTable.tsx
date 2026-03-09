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
} from "antd";

type Props = {
  invitacionId: string;
};

const GuestsTable: React.FC<Props> = ({ invitacionId }) => {
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
      message.success(`Especial actualizado`);
      await fetchItems();
    } catch (e: any) {
      message.error(e.message || "Error al actualizar especial");
    }
  };

  return (
    <>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={openCreate}>
          Agregar invitado
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={items}
        scroll={{ x: "max-content" }}
        columns={[
          { title: "Nombre", dataIndex: "nombre", responsive: ["sm"] },
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
              <Switch
                checked={v}
                onChange={() => toggleEspecial(row)}
                checkedChildren="Sí"
                unCheckedChildren="No"
              />
            ),
            responsive: ["md"],
          },
          {
            title: "Categoría",
            dataIndex: "categoria",
            render: (v) => (v ? <Tag>{v}</Tag> : "-"),
            responsive: ["md"],
          },
          {
            title: "Respuesta",
            render: (_, r) => {
              if (
                !r.confirmacionInvitados ||
                r.confirmacionInvitados.length === 0
              )
                return <Tag color="gray">Sin respuesta</Tag>;

              const resp = r.confirmacionInvitados[0].respuesta;
              if (resp === "SI") return <Tag color="green">Confirmó</Tag>;
              if (resp === "NO") return <Tag color="red">Rechazó</Tag>;
              return <Tag color="gray">Sin respuesta</Tag>;
            },
            responsive: ["sm"],
          },
          {
            title: "Acciones",
            render: (_, row) => (
              <Space wrap>
                <Button onClick={() => openEdit(row)}>Editar</Button>
                <Switch
                  checked={row.estado === "ACTIVO"}
                  onChange={() => toggleEstado(row)}
                  checkedChildren="ACTIVO"
                  unCheckedChildren="INACTIVO"
                />
              </Space>
            ),
            responsive: ["sm"],
          },
        ]}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={edit ? "Editar invitado" : "Agregar invitado"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submit}
        okText={edit ? "Guardar cambios" : "Agregar"}
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
