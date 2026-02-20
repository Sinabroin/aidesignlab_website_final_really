import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto-sans-kr)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        "tight-editorial": "-0.02em",
        "wider-caption": "0.08em",
      },
      colors: {
        // 텍스트/라인 (블루 사용 금지 영역)
        ink: "#111111",
        muted: "#6B6B6B",
        line: "#D9D6D3",

        // CTA 버튼 그라데이션
        cobalt: {
          start: "#0057FF",
          end: "#00A3FF",
        },

        // Hero 배경 끝색 (3단계 토글용)
        heroEnd: {
          level6: "#96C2FF",
          safe1: "#A6CEFF",
          safe2: "#B7DAFF",
        },

        // 기존 호환
        primary: {
          DEFAULT: "#171717",
          light: "#404040",
          dark: "#0a0a0a",
        },
        accent: {
          DEFAULT: "#525252",
          dark: "#262626",
        },
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.04)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
