"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { useTransition, useEffect } from "react";
import { setPreferredLanguage } from "@/lib/language";

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Restore language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("babyfoot-booking-language");
    if (savedLanguage && savedLanguage !== locale) {
      // Only redirect if the saved language is different from current locale
      const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
      router.push(`/${savedLanguage}${pathWithoutLocale}`);
    }
  }, [locale, pathname, router]);

  const handleLanguageChange = (newLocale: string) => {
    // Save language preference to localStorage
    setPreferredLanguage(newLocale);

    startTransition(() => {
      // Remove the current locale from the pathname
      const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
      // Navigate to the new locale
      router.push(`/${newLocale}${pathWithoutLocale}`);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-secondary border border-border hover:border-primary/50 transition-all duration-200"
          disabled={isPending}
        >
          <Globe className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          <span className="sr-only">Changer la langue</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-card border-border shadow-xl"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-secondary focus:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{language.flag}</span>
              <span className="text-foreground">{language.name}</span>
            </div>
            {locale === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
