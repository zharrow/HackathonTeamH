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
import { useTransition } from "react";

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      // Remove the current locale from the pathname
      const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
      // Navigate to the new locale
      router.push(`/${newLocale}${pathWithoutLocale}`);
    });
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-800/50 border border-gray-700 hover:border-[#6c47ff]/50 transition-all duration-200"
          disabled={isPending}
        >
          <Globe className="h-4 w-4 text-gray-300 hover:text-[#6c47ff] transition-colors" />
          <span className="sr-only">Changer la langue</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-gray-900 border-gray-700 shadow-xl"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-800/50 focus:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{language.flag}</span>
              <span className="text-gray-200">{language.name}</span>
            </div>
            {locale === language.code && (
              <Check className="h-4 w-4 text-[#6c47ff]" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
