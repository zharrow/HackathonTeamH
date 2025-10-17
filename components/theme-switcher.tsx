"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const t = useTranslations("common");

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-secondary border border-border hover:border-primary/50 transition-all duration-200"
      >
        <Sun className="h-4 w-4 text-muted-foreground" />
        <span className="sr-only">{t("toggleTheme")}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-secondary border border-border hover:border-primary/50 transition-all duration-200"
        >
          {theme === "dark" ? (
            <Moon className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          ) : (
            <Sun className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          )}
          <span className="sr-only">{t("toggleTheme")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-card border-border shadow-xl"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-secondary focus:bg-secondary transition-colors"
        >
          <div className="flex items-center gap-3">
            <Sun className="h-4 w-4" />
            <span className="text-foreground">{t("lightTheme")}</span>
          </div>
          {theme === "light" && (
            <div className="h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-secondary focus:bg-secondary transition-colors"
        >
          <div className="flex items-center gap-3">
            <Moon className="h-4 w-4" />
            <span className="text-foreground">{t("darkTheme")}</span>
          </div>
          {theme === "dark" && (
            <div className="h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-secondary focus:bg-secondary transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded border border-muted-foreground/50 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
            </div>
            <span className="text-foreground">{t("systemTheme")}</span>
          </div>
          {theme === "system" && (
            <div className="h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
