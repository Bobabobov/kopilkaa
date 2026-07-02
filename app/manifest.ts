import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka.ru"
  ).replace(/\/$/, "");

  return {
    name: "Копилка Online — платформа живых историй",
    short_name: "Копилка",
    description:
      "Медиа-платформа уникальных жизненных историй с выплатой поощрительных гонораров авторам",
    start_url: "/",
    display: "standalone",
    background_color: "#004643",
    theme_color: "#004643",
    icons: [
      {
        src: "/PWA1.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/PWA1.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/PWA2.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/PWA2.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
