import { useMemo, useState } from "react";
import { BabyfootTable } from "@/components/admin/tables/table-columns";

export function useTableFilters(tables: BabyfootTable[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === "" ||
        table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.location?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status
      const matchesStatus =
        statusFilter === "ALL" || table.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tables, searchQuery, statusFilter]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredTables,
  };
}
