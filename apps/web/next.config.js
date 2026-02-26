const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel 배포용 설정 (output: 'export' 제거)
  images: {
    unoptimized: true,
    // Vercel Blob 이미지 도메인 허용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
  // ESLint 9 + next/core-web-vitals circular structure 버그 회피 (로컬 lint는 정상 동작)
  eslint: { ignoreDuringBuilds: true },
  devIndicators: false,
  // 모노레포: workspace 루트를 기준으로 모듈/파일 추적 (Next.js 15+)
  outputFileTracingRoot: path.join(__dirname, "../.."),
  // @next-auth/prisma-adapter 등 workspace hoisted 패키지 명시적 transpile
  transpilePackages: ["@next-auth/prisma-adapter"],
  // /api/upload 는 클라이언트가 직접 Blob에 올리므로 토큰 발급 요청만 처리 (소형 JSON)
  // 그 외 API는 이미지를 받지 않지만 만약을 위한 안전망
  experimental: {
    serverBodySizeLimit: '5mb',
  },
};

module.exports = nextConfig;
