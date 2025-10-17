import { redirect } from "next/navigation";
import { getCurrentUser, getCurrentUserRole } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DynamicBreadcrumb } from "@/components/admin/dynamic-breadcrumb";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Roles } from "@prisma/client";
import { getTranslations } from "next-intl/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const role = await getCurrentUserRole(user?.id || "");
  const t = await getTranslations("admin");

  if (!user) {
    redirect("/sign-in");
  }
  if (role !== Roles.ADMIN) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AdminSidebar
        user={{
          name: user?.name || t("defaultAdminName"),
          email: user?.email || "",
          avatar: user?.image || null,
          role: role || Roles.USER,
        }}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DynamicBreadcrumb />
          <div className="ml-auto flex items-center gap-4">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("backToSite")}
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
