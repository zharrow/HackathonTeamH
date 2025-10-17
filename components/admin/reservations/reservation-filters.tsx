"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BabyfootTable {
  id: string;
  name: string;
}

interface ReservationFiltersProps {
  tables: BabyfootTable[];
  selectedTable: string;
  onTableChange: (value: string) => void;
}

export function ReservationFilters({
  tables,
  selectedTable,
  onTableChange,
}: ReservationFiltersProps) {
  const t = useTranslations("reservation");

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Select value={selectedTable} onValueChange={onTableChange}>
        <SelectTrigger className="w-full sm:w-[250px]">
          <SelectValue placeholder={t("filterByTable")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t("allTables")}</SelectItem>
          {tables.map((table) => (
            <SelectItem key={table.id} value={table.id}>
              {table.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
