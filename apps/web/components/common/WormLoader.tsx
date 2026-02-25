/** 배너 로딩 액티브 로딩 로고 — 하늘색 웜 애니메이션 */
"use client";

import * as React from "react";

export const WormLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="128px"
        width="256px"
        viewBox="0 0 256 128"
        className="w-40 h-20"
      >
        <defs>
          <linearGradient y2={0} x2={1} y1={0} x1={0} id="sky-grad1">
            <stop stopColor="#7DD3FC" offset="0%" />
            <stop stopColor="#38BDF8" offset="33%" />
            <stop stopColor="#0EA5E9" offset="67%" />
            <stop stopColor="#0284C7" offset="100%" />
          </linearGradient>
          <linearGradient y2={0} x2={0} y1={0} x1={1} id="sky-grad2">
            <stop stopColor="#0284C7" offset="0%" />
            <stop stopColor="#0369A1" offset="33%" />
            <stop stopColor="#38BDF8" offset="67%" />
            <stop stopColor="#7DD3FC" offset="100%" />
          </linearGradient>
        </defs>
        <g strokeWidth={16} strokeLinecap="round" fill="none">
          <g stroke="rgba(255,255,255,0.5)">
            <path d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56" />
            <path d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64" />
          </g>
          <g strokeDasharray="180 656">
            <path
              d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56"
              stroke="url(#sky-grad1)"
              className="animate-worm1"
            />
            <path
              d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64"
              stroke="url(#sky-grad2)"
              className="animate-worm2"
            />
          </g>
        </g>
      </svg>
      <span className="text-sm text-white/80 tracking-wide animate-pulse">
        로딩 중...
      </span>
    </div>
  );
};
