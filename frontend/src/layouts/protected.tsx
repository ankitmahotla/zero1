import { useSessionStore } from "@/store/session";
import { useRefreshTokenSync } from "@/sync/auth";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  const { mutate, isPending } = useRefreshTokenSync();
  const isAuthenticated = useSessionStore((state) => !!state.user_id);

  const hasExpiredToken = useSessionStore(
    (state) => state.expiresAt !== null && Date.now() > state.expiresAt,
  );

  if (hasExpiredToken) {
    mutate();
  }

  if (isPending) return <p>Loading...</p>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
