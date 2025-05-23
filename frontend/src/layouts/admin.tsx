import { useSessionStore } from "@/store/session";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const role = useSessionStore((state) => state.role);

  if (role !== "ADMIN") return <Navigate to="/" replace />;

  return <Outlet />;
}
