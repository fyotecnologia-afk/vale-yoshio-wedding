// src/pages/admin/index.tsx
import dynamic from "next/dynamic";
import LoginGate from "@/components/admin/LoginGate";
import LoginForm from "@/components/admin/LoginForm";
import AdminLayout from "@/components/admin/AdminLayout";

// Importa tus componentes administrativos con SSR desactivado
const AdminList = dynamic(() => import("@/components/admin/AdminList"), {
  ssr: false,
});
const ListaInvitaciones = dynamic(
  () => import("@/components/admin/ListaInvitaciones"),
  { ssr: false }
);

export default function AdminPage() {
  return (
    <LoginGate LoginForm={LoginForm}>
      <AdminLayout>
        <AdminList />
        {/* Si quieres también puedes renderizar la lista de invitaciones */}
        {/* <ListaInvitaciones /> */}
      </AdminLayout>
    </LoginGate>
  );
}
