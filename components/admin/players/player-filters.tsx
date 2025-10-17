"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlayerFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleChange: (value: string) => void;
}

export function PlayerFilters({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleChange,
}: PlayerFiltersProps) {
  const t = useTranslations("user");

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={roleFilter} onValueChange={onRoleChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder={t("filterByRole")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t("allRoles")}</SelectItem>
          <SelectItem value="ADMIN">{t("admin")}</SelectItem>
          <SelectItem value="USER">{t("user")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
