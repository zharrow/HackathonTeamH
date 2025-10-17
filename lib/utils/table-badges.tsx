import { Badge } from "@/components/ui/badge";

type BabyfootStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
type TableCondition = "EXCELLENT" | "BON" | "MOYEN" | "MAINTENANCE";

interface StatusBadgeProps {
  status: BabyfootStatus;
  label: string;
}

interface ConditionBadgeProps {
  condition?: TableCondition;
  labels: {
    EXCELLENT: string;
    BON: string;
    MOYEN: string;
    MAINTENANCE: string;
  };
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const variants = {
    AVAILABLE: "default",
    OCCUPIED: "secondary",
    MAINTENANCE: "destructive",
  } as const;

  return (
    <Badge variant={variants[status]} className="font-medium">
      {label}
    </Badge>
  );
}

export function ConditionBadge({ condition, labels }: ConditionBadgeProps) {
  if (!condition) {
    return <span className="text-muted-foreground">-</span>;
  }

  const variants: Record<
    TableCondition,
    "default" | "secondary" | "outline" | "destructive"
  > = {
    EXCELLENT: "default",
    BON: "secondary",
    MOYEN: "outline",
    MAINTENANCE: "destructive",
  };

  return (
    <Badge variant={variants[condition]} className="font-medium">
      {labels[condition]}
    </Badge>
  );
}
