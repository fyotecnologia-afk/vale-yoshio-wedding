// src/components/admin/AdminLayout.tsx
import React, { ReactNode, useState, useEffect } from "react";
import { Layout, Menu, Avatar, Button, Grid, theme, Drawer } from "antd";
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
const { useBreakpoint } = Grid;

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const screens = useBreakpoint();

  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const isMobile = !screens.md; // md breakpoint hacia abajo = mobile

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

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
      label: "Configuraciones",
    },
  ];

  const renderMenu = () => (
    <>
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

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[router.pathname]}
        onClick={({ key }) => {
          router.push(key);
          if (isMobile) setMobileOpen(false);
        }}
        items={menuItems}
        style={{ flex: 1 }}
      />

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
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* DESKTOP SIDEBAR */}
      {!isMobile && (
        <Sider trigger={null} collapsible collapsed={collapsed}>
          {renderMenu()}
        </Sider>
      )}

      {/* MOBILE DRAWER */}
      {isMobile && (
        <Drawer
          placement="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ height: "100%", background: "#001529" }}>
            {renderMenu()}
          </div>
        </Drawer>
      )}

      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Button
            type="text"
            icon={
              isMobile ? (
                <MenuUnfoldOutlined />
              ) : collapsed ? (
                <MenuUnfoldOutlined />
              ) : (
                <MenuFoldOutlined />
              )
            }
            onClick={() => {
              if (isMobile) setMobileOpen(true);
              else setCollapsed(!collapsed);
            }}
            style={{ fontSize: 16 }}
          />

          <h2
            style={{
              margin: 0,
              fontSize: isMobile ? 14 : 18,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {router.pathname === "/admin" && "Configuración de Invitados"}
            {router.pathname === "/admin/lista" && "Listado de Invitaciones"}
            {router.pathname === "/admin/config" && "Configuración Global"}
          </h2>
        </Header>

        <Content
          style={{
            margin: isMobile ? "12px" : "24px 16px",
            padding: isMobile ? 12 : 24,
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
