import { Navigate, redirect, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import { useEffect } from "react";
import { useThemeStore } from "./store/theme";
import Navbar from "./components/navbar";
import { useSessionStore } from "./store/session";
import { useRefreshTokenSync } from "./sync/auth";
import RootLayout from "./layouts/root";

function App() {
  const isAuthenticated = useSessionStore((state) => !!state.user_id);
  const { mutate } = useRefreshTokenSync();

  if (!isAuthenticated) {
    redirect("/login");
  }

  const hasExpiredToken = useSessionStore(
    (state) => state.expiresAt !== null && Date.now() > state.expiresAt,
  );

  if (hasExpiredToken) {
    mutate();
  }

  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route
          path="/"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;
