import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin/', '/liveavatar-demo', '/liveavatar-demo2', '/ai-video-call'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'Twitterbot', 'facebookexternalhit'],
        allow: '/',
        disallow: ['/admin', '/api/admin/', '/liveavatar-demo', '/liveavatar-demo2', '/ai-video-call'],
      },
      {
        userAgent: ['OAI-SearchBot', 'GPTBot', 'Google-Extended', 'PerplexityBot', 'ClaudeBot', 'Applebot', 'Amazonbot', 'Bytespider', 'cohere-ai', 'Diffbot'],
        allow: '/',
        disallow: ['/admin', '/api/admin/', '/liveavatar-demo', '/liveavatar-demo2', '/ai-video-call'],
      }
    ],
    sitemap: 'https://www.sgk.gr/sitemap.xml',
  };
}
