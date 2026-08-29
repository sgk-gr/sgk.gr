import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin/'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'Twitterbot', 'facebookexternalhit'],
        allow: '/',
        disallow: ['/admin', '/api/admin/'],
      },
      {
        userAgent: ['OAI-SearchBot', 'GPTBot', 'Google-Extended', 'PerplexityBot', 'ClaudeBot', 'Applebot'],
        allow: '/',
      }
    ],
    sitemap: 'https://sgk.gr/sitemap.xml',
  };
}
