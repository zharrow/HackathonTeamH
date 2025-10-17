"use client";

import { usePathname, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
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
  const params = useParams();
  const t = useTranslations("admin");
  const [tableName, setTableName] = useState<string | null>(null);

  // Remove locale from pathname and split into segments
  const segments = pathname
    .replace(/^\/(en|fr)/, "")
    .split("/")
    .filter(Boolean);

  // Check if we're on a table detail page
  const tableId = params.tableId as string | undefined;
  const isTableDetailPage = segments.includes("reservations") && tableId;

  // Fetch table name if we're on a table detail page
  useEffect(() => {
    if (isTableDetailPage && tableId) {
      fetch(`/api/admin/tables/${tableId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setTableName(data.data.name);
          }
        })
        .catch(() => {
          setTableName(null);
        });
    }
  }, [isTableDetailPage, tableId]);

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

  // Render breadcrumb for table detail page
  if (isTableDetailPage) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/admin">{t("administration")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${params.locale}/admin/reservations`}>
              {t("reservationsLink")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{tableName || "Loading..."}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Regular breadcrumb
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
