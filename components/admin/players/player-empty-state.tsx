"use client";

import { useTranslations } from "next-intl";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function PlayerEmptyState() {
  const t = useTranslations("user");

  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t("noPlayers")}
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          {t("emptyStateMessage")}
        </p>
      </CardContent>
    </Card>
  );
}
