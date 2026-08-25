import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { BRAND_NAME } from "@/lib/config";

import "./globals.css";

export const metadata: Metadata = {
  title: `${BRAND_NAME} — интерактивы для болельщиков`,
  description: "Соберите состав, сделайте прогноз и скачайте свою футбольную карточку.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071126",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
