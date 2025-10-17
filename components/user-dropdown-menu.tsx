"use client";

import { LogOut, Shield, Settings, User, Home } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface UserDropdownMenuContentProps {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
    role?: string;
  };
  showAdminLink?: boolean;
  showBackToSite?: boolean;
}

export function UserDropdownMenuContent({
  user,
  showAdminLink = false,
  showBackToSite = false,
}: UserDropdownMenuContentProps) {
  const t = useTranslations("common");

  const handleSignOut = async () => {
    await signOut();
  };

  const isAdmin = user.role === "ADMIN";

  return (
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{user.name}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {user.email}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{t("profile")}</span>
          </Link>
        </DropdownMenuItem>

        {showAdminLink && isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span>{t("adminDashboard")}</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>{t("settings")}</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      {showBackToSite && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                <span>{t("backToSite")}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </>
      )}

      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
        <LogOut className="mr-2 h-4 w-4" />
        <span>{t("signOut")}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
