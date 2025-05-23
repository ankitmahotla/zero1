import { useSessionStore } from "@/store/session";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthLayout() {
  const isAuthenticated = useSessionStore((state) => !!state.user_id);

  if (isAuthenticated) return <Navigate to="/" replace />;

  return <Outlet />;
}
