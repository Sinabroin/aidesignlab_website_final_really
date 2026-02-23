const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel 배포용 설정 (output: 'export' 제거)
  // GitHub Pages는 정적 사이트만 지원하므로 동적 인증 사용 불가
  images: {
    unoptimized: true,
  },
  // ESLint 9 + next/core-web-vitals circular structure 버그 회피 (로컬 lint는 정상 동작)
  eslint: { ignoreDuringBuilds: true },
  devIndicators: false,
  // 모노레포: workspace 루트를 기준으로 모듈/파일 추적 (다중 lock 파일 경고 해소)
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../.."),
  },
  // @next-auth/prisma-adapter 등 workspace hoisted 패키지 명시적 transpile
  transpilePackages: ["@next-auth/prisma-adapter"],
};

module.exports = nextConfig;
