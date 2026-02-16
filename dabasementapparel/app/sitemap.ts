import type { MetadataRoute } from 'next';
import { posts } from '@/content/posts';
import { products } from '@/content/products';

const base = 'https://dabasementapparel.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/shop', '/journal', '/about', '/privacy', '/disclosure'];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.7
    })),
    ...products.map((product) => ({
      url: `${base}/product/${product.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8
    })),
    ...posts.map((post) => ({
      url: `${base}/journal/${post.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6
    }))
  ];
}
