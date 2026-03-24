// src/components/admin/InvitationForm.tsx
import React from "react";
import { Form, Input, Button, Row, Col, Grid, Space } from "antd";

const { useBreakpoint } = Grid;

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
  const screens = useBreakpoint();
  const isMobile = !screens.md;

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
      {/* 🔥 GRID RESPONSIVE */}
      <Row gutter={[16, 0]}>
        <Col xs={24} md={8}>
          <Form.Item
            label="Hosted By"
            name="hostedBy"
            rules={[{ required: true }]}
          >
            <Input placeholder="Novio / Novia / Ambos" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="Tipo" name="tipo" rules={[{ required: true }]}>
            <Input placeholder="Familiar / Amigos / ..." />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            label="Familia"
            name="familia"
            rules={[{ required: true }]}
          >
            <Input placeholder="Apellido(s) Familia" />
          </Form.Item>
        </Col>
      </Row>

      {/* 🔥 BOTÓN RESPONSIVE */}
      <Form.Item>
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block={isMobile}
          >
            {submitText}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default InvitationForm;
