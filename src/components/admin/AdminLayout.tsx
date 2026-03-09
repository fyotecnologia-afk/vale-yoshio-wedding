// src/components/admin/AdminLayout.tsx
import React, { ReactNode, useState } from "react";
import { Layout, Menu, Avatar, Button, theme } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import type { MenuProps } from "antd";

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true); // 👉 siempre inicia colapsado
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.reload();
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "/admin",
      icon: <TeamOutlined />,
      label: "Invitados",
    },
    {
      key: "/admin/lista",
      icon: <FileTextOutlined />,
      label: "Lista Invitaciones",
    },
    {
      key: "/admin/config",
      icon: <SettingOutlined />,
      label: "Configuraciones de Parámetros",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar con colapso */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            paddingLeft: collapsed ? 0 : 16,
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {!collapsed ? "Admin Panel" : "A"}
        </div>

        <div style={{ textAlign: "center", margin: "16px 0" }}>
          <Avatar size={64} icon={<UserOutlined />} />
          {!collapsed && (
            <div style={{ color: "#fff", marginTop: 8 }}>Administrador</div>
          )}
        </div>

        {/* Menú principal */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[router.pathname]}
          onClick={({ key }) => {
            if (!key.startsWith("config")) router.push(key);
          }}
          items={menuItems}
          style={{ flex: 1 }}
        />

        {/* Botón de cerrar sesión siempre al fondo */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ color: "#fff", width: "100%", textAlign: "left" }}
          >
            {!collapsed && "Cerrar sesión"}
          </Button>
        </div>
      </Sider>

      {/* Contenido */}
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />

          <h2 style={{ margin: "auto" }}>
            {router.pathname === "/admin" &&
              "Configuración de Invitaciones/Invitados"}
            {router.pathname === "/admin/lista" && "Listado de Invitaciones"}
            {router.pathname === "/admin/config" &&
              "Configuración Parámetros Globales"}
          </h2>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
