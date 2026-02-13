import type { MetadataRoute } from 'next';

const routes = ['', '/how-it-works', '/what-we-test', '/reviews', '/gift', '/faqs', '/for-teams', '/blog', '/our-why', '/legal/privacy', '/legal/terms', '/legal/consent'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({ url: `https://vitalspring.example.com${route}`, lastModified: new Date() }));
}
