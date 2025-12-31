import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";

const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
});

const body = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BazarVpn | Быстрый и безопасный Telegram VPN",
  description:
    "Футуристичный VPN-сервис от ai-bazar: мгновенная скорость, шифрование и нативный Telegram-опыт.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
