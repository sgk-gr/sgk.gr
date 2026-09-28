import type { Metadata } from 'next';
import SolutionsClient from './SolutionsClient';

export const metadata: Metadata = {
  title: 'Ψηφιακές Λύσεις | SGK Digital',
  description: 'Ανακαλύψτε τις ψηφιακές λύσεις της SGK Digital για AI Agents, Live Video Avatars, custom web εφαρμογές και επιχειρηματικούς αυτοματισμούς.',
  alternates: {
    canonical: "https://www.sgk.gr/solutions",
  },
  openGraph: {
    title: 'Ψηφιακές Λύσεις | SGK Digital',
    description: 'Ανακαλύψτε τις ψηφιακές λύσεις της SGK Digital για AI Agents, Live Video Avatars, custom web εφαρμογές και επιχειρηματικούς αυτοματισμούς.',
    url: "https://www.sgk.gr/solutions",
    type: "website",
    images: ["https://www.sgk.gr/social-preview.png"],
    siteName: "SGK Software Development",
  },
  twitter: {
    card: "summary_large_image",
    title: 'Ψηφιακές Λύσεις | SGK Digital',
    description: 'Ανακαλύψτε τις ψηφιακές λύσεις της SGK Digital για AI Agents, Live Video Avatars, custom web εφαρμογές και επιχειρηματικούς αυτοματισμούς.',
    images: ["https://www.sgk.gr/social-preview.png"],
  },
};

export default function SolutionsPage() {
  return <SolutionsClient />;
}
