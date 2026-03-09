// src/components/admin/InvitationForm.tsx
import React from "react";
import { Form, Input, Switch, InputNumber, Select, Button, Space } from "antd";

type Props = {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void> | void;
  loading?: boolean;
  submitText?: string;
};

const InvitationForm: React.FC<Props> = ({
  initialValues,
  onSubmit,
  loading,
  submitText = "Guardar",
}) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        estado: "ACTIVO",
        ...initialValues,
      }}
      onFinish={onSubmit}
    >
      <Space size="large" wrap>
        <Form.Item
          label="Hosted By"
          name="hostedBy"
          rules={[{ required: true }]}
        >
          <Input placeholder="Novio / Novia / Ambos" />
        </Form.Item>
        <Form.Item label="Tipo" name="tipo" rules={[{ required: true }]}>
          <Input placeholder="Familiar / Amigos / ..." />
        </Form.Item>
        <Form.Item label="Familia" name="familia" rules={[{ required: true }]}>
          <Input placeholder="Apellido(s) Familia" />
        </Form.Item>
      </Space>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {submitText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InvitationForm;
