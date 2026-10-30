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
      // 1. IKE Legacy URLs
      {
        source: '/ike-offer',
        destination: '/kataskevi-istoselidas-ike',
        permanent: true,
      },
      {
        source: '/ike-offer/:path*',
        destination: '/kataskevi-istoselidas-ike',
        permanent: true,
      },
      {
        source: '/kataskevi-selidas-ike',
        destination: '/kataskevi-istoselidas-ike',
        permanent: true,
      },
      {
        source: '/kataskevi-selidas-ike/:path*',
        destination: '/kataskevi-istoselidas-ike',
        permanent: true,
      },

      // 2. E-shop & Web Development Legacy URLs
      {
        source: '/eshop',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/eshop/:path*',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/eshops',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/eshops/:path*',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/e-shop',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/e-shop/:path*',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/kataskevi-eshop',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/kataskevi-eshop/:path*',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/kataskevi-eshop-woocommerce',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/kataskevi-eshop-woocommerce/:path*',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/eshop-offer',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/eshop-offer/:path*',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/eshop-compliance',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/eshop-compliance/:path*',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/website-offer',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/website-offer/:path*',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/pay-as-you-grow',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/pay-as-you-grow/:path*',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/payg',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/payg/:path*',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },

      // 3. AI Agents & Order Demos
      {
        source: '/eshop-demo',
        destination: '/order-ai-agent',
        permanent: true,
      },
      {
        source: '/eshop-demo/:path*',
        destination: '/order-ai-agent',
        permanent: true,
      },
      {
        source: '/ai-video-call',
        destination: '/order-ai-agent',
        permanent: true,
      },
      {
        source: '/ai-video-call/:path*',
        destination: '/order-ai-agent',
        permanent: true,
      },
      {
        source: '/live',
        destination: '/order-ai-agent',
        permanent: true,
      },
      {
        source: '/live/:path*',
        destination: '/order-ai-agent',
        permanent: true,
      },

      // 4. Case Study & Portfolio
      {
        source: '/case-study',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/case-studies',
        destination: '/portfolio',
        permanent: true,
      },

      // 5. Old Directories & Promo / Doc
      {
        source: '/promo',
        destination: '/',
        permanent: true,
      },
      {
        source: '/doc',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog-seo/:path*',
        destination: '/blog',
        permanent: true,
      },

      // 6. Old Indexed Eshop Blog Posts (Redirected to Kataskevi Istoselidon)
      {
        source: '/blog/poso-kostizei-i-kataskevi-eshop-odigos-times-2026',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/blog/poso-kostizei-kataskevi-eshop-2025',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/blog/kataskevi-eshop-2026-taseis-poliseis',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/blog/kataskevi-eshop-ellada-2026-ti-proteinei-to-ai',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/blog/pay-as-you-grow-to-mellon-tou-ecommerce',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/blog/pay-as-you-grow-vs-shopify-vs-isocommerce-ellada',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },
      {
        source: '/blog/pos-na-anoixo-eshop-me-liga-lefta-ellada-2026',
        destination: '/kataskevi-istoselidon',
        permanent: true,
      },

      // 7. External Partners
      {
        source: '/mendora',
        destination: 'https://mendoraacademy.vercel.app/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
