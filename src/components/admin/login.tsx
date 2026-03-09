// /src/components/admin/login.tsx
import dynamic from "next/dynamic";
import LoginGate from "@/components/admin/LoginGate";
import LoginForm from "@/components/admin/LoginForm";

const AdminList = dynamic(() => import("@/components/admin/AdminList"), {
  ssr: false,
});

export default function AdminLoginPage() {
  return (
    <LoginGate LoginForm={LoginForm}>
      <AdminList />
    </LoginGate>
  );
}
