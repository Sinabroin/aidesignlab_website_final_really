import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import SessionProvider from "@/components/providers/SessionProvider";
import ActivityTracker from "@/components/providers/ActivityTracker";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

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
    <html lang="ko" className={notoSansKr.variable}>
      <body className={notoSansKr.className}>
        <SessionProvider>
          <ActivityTracker />
          <main>
            {children}
          </main>
          <CookieBanner />
        </SessionProvider>
      </body>
    </html>
  );
}
