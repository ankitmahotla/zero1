import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/theme";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <nav className="w-full border-b bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg">Zero1</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
