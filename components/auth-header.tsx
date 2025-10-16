"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { UserDropdownMenuContent } from "@/components/user-dropdown-menu";

export function AuthHeader() {
  const { data: session, isPending } = useSession();
  const t = useTranslations("common");

  if (isPending) {
    return <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />;
  }

  if (session) {
    const user = session.user;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.image || undefined} alt="User avatar" />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name?.[0] || user?.email?.[0]}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <UserDropdownMenuContent
          user={{
            name: user?.name || "",
            email: user?.email || "",
            avatar: user?.image,
            role: (user as any)?.role,
          }}
          showAdminLink={true}
          showBackToSite={false}
        />
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/sign-in">
        <Button variant="secondary">{t("signIn")}</Button>
      </Link>
      <Link href="/sign-up">
        <Button variant="default">{t("signUp")}</Button>
      </Link>
    </div>
  );
}
