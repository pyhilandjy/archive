/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // 기존 Supabase 도메인
      {
        protocol: "https",
        hostname: "hylbiupmzgannjlhitxd.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // 추가: Cloudflare Tunnel 도메인
      {
        protocol: "https",
        hostname: "definitions-graphic-surrounding-leisure.trycloudflare.com",
        pathname: "/videos/**", // 썸네일, 영상 모두 포함됨
      },
    ],
  },
};

module.exports = nextConfig;
