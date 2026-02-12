"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

/**
 * Aurora Background Component
 * 
 * 오로라 효과를 가진 배경 컴포넌트
 * Sky Blue 계열로 커스터마이징
 */
export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main className="relative">
      <div
        className={cn(
          "relative flex flex-col h-screen items-center justify-center bg-white text-slate-950 overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Aurora 효과 레이어 */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              "absolute -inset-[10px] opacity-50",
              "bg-[length:300%_200%] bg-[position:50%_50%]",
              "animate-aurora",
              "blur-[10px]",
              showRadialGradient && "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
            )}
            style={{
              backgroundImage: `
                repeating-linear-gradient(100deg, var(--white) 0%, var(--white) 7%, var(--transparent) 10%, var(--transparent) 12%, var(--white) 16%),
                repeating-linear-gradient(100deg, var(--blue-500) 10%, var(--indigo-300) 15%, var(--blue-300) 20%, var(--violet-200) 25%, var(--blue-400) 30%)
              `,
            }}
          ></div>
          
          {/* 추가 Aurora 레이어 */}
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: `
                repeating-linear-gradient(100deg, var(--white) 0%, var(--white) 7%, var(--transparent) 10%, var(--transparent) 12%, var(--white) 16%),
                repeating-linear-gradient(100deg, var(--blue-500) 10%, var(--indigo-300) 15%, var(--blue-300) 20%, var(--violet-200) 25%, var(--blue-400) 30%)
              `,
              backgroundSize: '200% 100%',
              animation: 'aurora 60s linear infinite',
              backgroundAttachment: 'fixed',
            }}
          ></div>
        </div>
        
        {/* 컨텐츠 */}
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </main>
  );
};
