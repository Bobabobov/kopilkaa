/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  
  // Заголовки безопасности
  async headers() {
    return [
      {
        // Применяем ко всем путям
        source: "/(.*)",
        headers: [
          // XSS Protection
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Prevent MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // DNS Prefetch Control
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          // Download Options
          {
            key: "X-Download-Options",
            value: "noopen",
          },
        ],
      },
      {
        // Специальные заголовки для API роутов
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        ],
      },
    ];
  },
};
export default nextConfig;
