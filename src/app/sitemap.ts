import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/data/blog-posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sgk.gr';
  const now = new Date();

  const corePages = [
    { url: `${baseUrl}/`, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/kataskevi-eshop`, priority: 0.95, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/kataskevi-istoselidas-ike`, priority: 0.95, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/pay-as-you-grow`, priority: 0.95, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/kataskevi-eshop-woocommerce`, priority: 0.90, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/kataskevi-istoselidon`, priority: 0.90, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/web-development`, priority: 0.85, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/ai-agents`, priority: 0.85, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/portfolio`, priority: 0.85, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/services`, priority: 0.80, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/solutions`, priority: 0.80, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/about`, priority: 0.80, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/innovation`, priority: 0.80, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/estimate`, priority: 0.85, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/blog`, priority: 0.85, changeFrequency: 'weekly' as const },
  ];

  const caseStudies = [
    'diador', 'energy-solutions', 'evolis-ai', 'harmony-apartments', 'high-travel',
    'kastanidis', 'km-fiber', 'lemon-tree-paros', 'live-tour-guide', 'lyroudis',
    'rekrua', 'sigmalabs-ai', 'skinnera', 'super-app', 'top-travel-greece',
    'vaia-charms', 'yolo8'
  ].map((slug) => ({
    url: `${baseUrl}/case-study/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  const blogUrls = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.80,
  }));

  return [
    ...corePages.map(page => ({
      ...page,
      lastModified: now,
    })),
    ...caseStudies,
    ...blogUrls,
  ];
}
