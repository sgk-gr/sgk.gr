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
  }
};

export default nextConfig;
