import { Badge } from "@/components/ui/badge";

type UserRole = "USER" | "ADMIN";

interface RoleBadgeProps {
  role: UserRole;
  label: string;
}

export function RoleBadge({ role, label }: RoleBadgeProps) {
  const variants = {
    USER: "secondary",
    ADMIN: "default",
  } as const;

  return (
    <Badge variant={variants[role]} className="font-medium">
      {label}
    </Badge>
  );
}
