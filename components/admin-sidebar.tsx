import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Users,
  Table2,
  Gamepad2,
  BarChart3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";

export function AdminSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
    role?: string;
  };
}) {
  const t = useTranslations();

  const adminNavItems = [
    {
      title: t("admin.dashboardLink"),
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: t("admin.tablesLink"),
      url: "/admin/tables",
      icon: Table2,
    },
    {
      title: t("admin.playersLink"),
      url: "/admin/players",
      icon: Users,
    },
    {
      title: t("admin.reservationsLink"),
      url: "/admin/reservations",
      icon: Gamepad2,
    },
    {
      title: t("admin.statsLink"),
      url: "/admin/stats",
      icon: BarChart3,
    },
  ];
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip={t("common.adminDashboard")}
            >
              <Link href="/admin">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">
                    {t("common.adminDashboard")}
                  </span>
                  <span className="text-xs">{t("common.appTitle")}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {adminNavItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
