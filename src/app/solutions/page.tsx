import type { Metadata } from 'next';
import SolutionsClient from './SolutionsClient';

export const metadata: Metadata = {
  title: 'Ψηφιακές Λύσεις | SGK Digital',
  description: 'Ανακαλύψτε τις ψηφιακές λύσεις της SGK Digital για e-shop, custom εφαρμογές, AI και digital marketing.',
  alternates: {
    canonical: "https://sgk.gr/solutions",
  },
  openGraph: {
    title: 'Ψηφιακές Λύσεις | SGK Digital',
    description: 'Ανακαλύψτε τις ψηφιακές λύσεις της SGK Digital για e-shop, custom εφαρμογές, AI και digital marketing.',
    url: "https://sgk.gr/solutions",
    type: "website",
    images: ["https://sgk.gr/social-preview.png"],
    siteName: "SGK Software Development",
  },
  twitter: {
    card: "summary_large_image",
    title: 'Ψηφιακές Λύσεις | SGK Digital',
    description: 'Ανακαλύψτε τις ψηφιακές λύσεις της SGK Digital για e-shop, custom εφαρμογές, AI και digital marketing.',
    images: ["https://sgk.gr/social-preview.png"],
  },
};

export default function SolutionsPage() {
  return <SolutionsClient />;
}
