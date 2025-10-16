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
            <header className="flex justify-between items-center p-4 gap-4 h-16 bg-gray-900 border-b border-gray-800">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-white">
                  Babyfoot Booking
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <SignedOut>
                  <SignInButton />
                  <SignUpButton>
                    <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#5a3ae6] transition-colors">
                      {t("signUp")}
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </header>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
