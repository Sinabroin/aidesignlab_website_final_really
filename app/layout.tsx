import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI 디자인랩 - 현대건설",
  description: "현대건설 워크이노베이션센터 AI디자인랩의 내부 플레이그라운드 & 지식 허브",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <main>
          {children}
        </main>
        <CookieBanner />
      </body>
    </html>
  );
}
