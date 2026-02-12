/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel 배포용 설정 (output: 'export' 제거)
  // GitHub Pages는 정적 사이트만 지원하므로 동적 인증 사용 불가
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
