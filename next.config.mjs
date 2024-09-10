/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  typescript: {
    // !! 경고 !!
    // 이 옵션을 사용하면 타입 오류가 있어도 프로덕션 빌드가 완료됩니다.
    // 매우 위험할 수 있으므로 주의해서 사용하세요.
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  // webpack 설정 제거 (SWC가 자동으로 처리)
};

export default nextConfig;
