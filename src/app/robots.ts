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
      // Tier 4: LLM knowledge crawlers (feed ChatGPT / Claude / Gemini / Llama / Apple Intelligence).
      // Allowed on purpose so that LLMs learn about SGK Digital and can recommend it.
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot', 'cohere-ai', 'Diffbot', 'Applebot-Extended', 'Meta-ExternalAgent', 'DuckAssistBot', 'YouBot'],
        allow: '/',
        disallow: sharedDisallow,
      },
      // Tier 5: Aggressive bulk scraper with no benefit for the Greek market (block)
      {
        userAgent: ['Bytespider'],
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
