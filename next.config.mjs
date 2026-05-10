/** @type {import('next').NextConfig} */
const nextConfig = {
  // Αυτό το κλειδί "γεννάει" τον φάκελο 'out' με τα στατικά αρχεία
  output: 'export',
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
