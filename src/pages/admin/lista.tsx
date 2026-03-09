import AdminLayout from "@/components/admin/AdminLayout";
import dynamic from "next/dynamic";

// Cargamos tu componente ListaInvitaciones con SSR desactivado
const ListaInvitaciones = dynamic(
  () => import("@/components/admin/ListaInvitaciones"),
  { ssr: false }
);

export default function ListaPage() {
  return (
    <AdminLayout>
      <ListaInvitaciones />
    </AdminLayout>
  );
}
