"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AuthHeader } from "@/components/auth-header";

export function ConditionalHeader() {
  const pathname = usePathname();
  const t = useTranslations("common");

  // Ne pas afficher la navbar sur les routes admin
  const isAdminRoute = pathname.includes("/admin");

  if (isAdminRoute) {
    return null;
  }

  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 bg-background border-b border-border">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-foreground">{t("appTitle")}</h1>
      </div>

      <div className="flex items-center gap-2">
        <AuthHeader />
        <LanguageSwitcher />
      </div>
    </header>
  );
}
