// src/pages/admin/config/index.tsx
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import GlobalSettings from "@/components/admin/config/GlobalSettings";

const ConfigPage: React.FC = () => {
  return (
    <AdminLayout>
      <GlobalSettings />
    </AdminLayout>
  );
};

export default ConfigPage;
