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
    // Στατικά sites χρειάζονται αυτό για τις εικόνες
    unoptimized: true,
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
    ];
  },
};

export default nextConfig;
