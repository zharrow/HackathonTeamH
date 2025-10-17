import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Inter, Orbitron, Rajdhani } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Toaster } from "sonner";
import "../globals.css";
import { Button } from "@/components/ui/button";

// Brand Guidelines Fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

const rajdhani = Rajdhani({
  weight: ["400", "600", "700"],
  variable: "--font-rajdhani",
  subsets: ["latin"],
  display: "swap",
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
          className={`${inter.variable} ${orbitron.variable} ${rajdhani.variable} font-sans antialiased`}
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <NextIntlClientProvider messages={messages}>
            <header className="flex justify-between items-center p-4 gap-4 h-16 bg-[#0D0D0D] border-b border-[#00FFF7]/20">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-[#F2F2F2] tracking-wider" style={{ fontFamily: "var(--font-orbitron)" }}>
                  BABYFOOT BOOKING
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
            <Toaster
              position="top-right"
              theme="dark"
              toastOptions={{
                style: {
                  background: '#0D0D0D',
                  border: '1px solid #00FFF7',
                  color: '#F2F2F2',
                },
              }}
              richColors
            />
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
