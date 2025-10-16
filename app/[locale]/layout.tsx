import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import "../globals.css";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Babyfoot Booking - Ynov Toulouse",
  description: "Service de réservation de babyfoot pour Ynov Toulouse",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const messages = await getMessages();
  const t = await getTranslations("common");

  return (
    <ClerkProvider>
      <html>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NextIntlClientProvider messages={messages}>
            <header className="flex justify-between items-center p-4 gap-4 h-16 bg-background border-b border-border">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-foreground">
                  Babyfoot Booking
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <SignedOut>
                  <SignInButton>
                    <Button variant="secondary">{t("signIn")}</Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button variant="default">{t("signUp")}</Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <LanguageSwitcher />
              </div>
            </header>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
