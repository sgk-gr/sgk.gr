import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const sharedDisallow = ['/admin', '/api/admin/', '/liveavatar-demo', '/liveavatar-demo2', '/ai-video-call'];

  return {
    rules: [
      // Tier 1: Core Search Engines & AI Search (citations & indexing)
      {
        userAgent: ['Googlebot', 'Bingbot', 'Twitterbot', 'facebookexternalhit'],
        allow: '/',
        disallow: sharedDisallow,
      },
      // Tier 2: AI Search Bots (power AI answer citations)
      {
        userAgent: ['OAI-SearchBot', 'PerplexityBot', 'Claude-SearchBot', 'Applebot', 'Amazonbot'],
        allow: '/',
        disallow: sharedDisallow,
      },
      // Tier 3: AI User-Fetch Agents (when users paste URLs into ChatGPT/Claude)
      {
        userAgent: ['ChatGPT-User', 'Claude-User', 'Perplexity-User'],
        allow: '/',
        disallow: sharedDisallow,
      },
      // Tier 4: AI Training & Bulk Scrapers (block - does NOT affect AI search citations)
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Bytespider', 'CCBot', 'cohere-ai', 'Diffbot'],
        disallow: ['/'],
      },
      // Default fallback
      {
        userAgent: '*',
        allow: '/',
        disallow: sharedDisallow,
      },
    ],
    sitemap: 'https://www.sgk.gr/sitemap.xml',
  };
}
