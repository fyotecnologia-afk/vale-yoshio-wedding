// src/pages/admin/index.tsx
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminList from "@/components/admin/AdminList";

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminList />
    </AdminLayout>
  );
}
