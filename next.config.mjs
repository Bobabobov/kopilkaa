/** @type {import('next').NextConfig} */
const nextConfig = {
  // Оптимизация производительности
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    // optimizeCss: true, // Отключено из-за проблем с модулем critters
  },

  // Отключение source maps в продакшене для ускорения
  productionBrowserSourceMaps: false,

  // Оптимизация изображений. Для внешних URL историй/аватаров добавьте hostname в remotePatterns.
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 дней
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatarko.ru",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "static-cse.canva.com",
      },
      {
        protocol: "https",
        hostname: "t.me",
      },
    ],
  },

  // Сжатие
  compress: true,

  // Оптимизация сборки
  swcMinify: true,

  // Оптимизация webpack
  webpack: (config, { dev, isServer }) => {
    // Оптимизация для продакшена
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            enforce: true,
          },
        },
      };
    }

    return config;
  },

  // Оптимизация headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      // По умолчанию API не кешируем: персональные данные и сессия.
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, must-revalidate",
          },
        ],
      },
      // Статика из uploads — долгий кеш в браузере
      {
        source: "/api/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Summary — переопределяем: короткий кеш (последнее правило выигрывает).
      {
        source: "/api/stories/summary",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=60",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
