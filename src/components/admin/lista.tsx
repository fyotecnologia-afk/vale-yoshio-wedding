// src/pages/admin/lista.tsx
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ListaInvitaciones from "@/components/admin/ListaInvitaciones";

export default function ListaPage() {
  return (
    <AdminLayout>
      <ListaInvitaciones />
    </AdminLayout>
  );
}
