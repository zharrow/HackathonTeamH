"use client";

import { useTranslations } from "next-intl";
import { Plus, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TableEmptyStateProps {
  onCreate: () => void;
}

export function TableEmptyState({ onCreate }: TableEmptyStateProps) {
  const t = useTranslations("table");

  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Table2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t("noTables")}
        </h3>
        <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
          {t("emptyStateMessage")}
        </p>
        <Button onClick={onCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("addTable")}
        </Button>
      </CardContent>
    </Card>
  );
}
