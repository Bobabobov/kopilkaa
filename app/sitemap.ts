import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kopilka.ru';
  
  const routes = [
    '',
    '/news',
    '/stories',
    '/applications',
    '/reports',
    '/games',
    '/heroes',
    '/advertising',
    '/support',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}

