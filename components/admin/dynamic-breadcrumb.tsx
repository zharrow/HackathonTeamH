"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const t = useTranslations("admin");

  // Remove locale from pathname and split into segments
  const segments = pathname
    .replace(/^\/(en|fr)/, "")
    .split("/")
    .filter(Boolean);

  // Get page title based on current route
  const getPageTitle = () => {
    if (segments.length === 1 && segments[0] === "admin") {
      return t("dashboardLink");
    }

    const currentPage = segments[segments.length - 1];
    const pageMap: Record<string, string> = {
      tables: t("tablesLink"),
      players: t("playersLink"),
      reservations: t("reservationsLink"),
      stats: t("statsLink"),
    };

    return pageMap[currentPage] || t("dashboardLink");
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/admin">{t("administration")}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
