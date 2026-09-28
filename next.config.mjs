/** @type {import('next').NextConfig} */
const nextConfig = {
  // Αυτό το κλειδί "γεννάει" τον φάκελο 'out' με τα στατικά αρχεία
  // output: 'export', // Commented out for Vercel deployment to support SSR/ISR and better SEO
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      { source: '/.well-known/llms.txt', destination: '/llms.txt' },
      { source: '/.well-known/llms-full.txt', destination: '/llms-full.txt' },
    ];
  },
  async redirects() {
    return [
      {
        source: '/kataskevi-istoselidas-ike',
        destination: '/ike-offer',
        permanent: true,
      },
      {
        source: '/kataskevi-eshop',
        destination: '/ai-agents',
        permanent: true,
      },
      {
        source: '/kataskevi-eshop-woocommerce',
        destination: '/ai-agents',
        permanent: true,
      },
      {
        source: '/pay-as-you-grow',
        destination: '/ai-agents',
        permanent: true,
      },
      {
        source: '/eshop-offer/:path*',
        destination: '/ai-agents',
        permanent: true,
      },
      {
        source: '/eshop-compliance',
        destination: '/ai-agents',
        permanent: true,
      },
      {
        source: '/eshop-demo',
        destination: '/order-ai-agent',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
