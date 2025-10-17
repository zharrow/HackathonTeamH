import type { Metadata } from "next";
import { Orbitron, Rajdhani, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Babyfoot Booking - Ynov Toulouse",
  description: "Service de réservation de babyfoot pour Ynov Toulouse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${inter.variable} antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#0f1923",
              border: "1px solid #334155",
              color: "#ffffff",
            },
          }}
          richColors
        />
      </body>
    </html>
  );
}
