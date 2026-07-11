import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "QRcode 內用點餐系統 Demo",
  description: "前端 Demo（mock 資料）- 顧客掃碼點餐流程",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className="h-full">
      <body className="min-h-full bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
