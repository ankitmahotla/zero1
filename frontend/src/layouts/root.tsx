import Navbar from "@/components/navbar";
import { useThemeStore } from "@/store/theme";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
