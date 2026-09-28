import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Οι Υπηρεσίες Μας | SGK Digital',
  description: 'Ανακαλύψτε τις ψηφιακές λύσεις της SGK. AI Agents, Live Video Avatars 24/7, Custom Web Applications και επιχειρηματικοί αυτοματισμοί.',
  alternates: {
    canonical: "https://www.sgk.gr/services",
  },
  openGraph: {
    title: 'Οι Υπηρεσίες Μας | SGK Digital',
    description: 'Ανακαλύψτε τις ψηφιακές λύσεις της SGK. AI Agents, Live Video Avatars 24/7, Custom Web Applications και επιχειρηματικοί αυτοματισμοί.',
    url: "https://www.sgk.gr/services",
    type: "website",
    images: ["https://www.sgk.gr/social-preview.png"],
    siteName: "SGK Software Development",
  },
  twitter: {
    card: "summary_large_image",
    title: 'Οι Υπηρεσίες Μας | SGK Digital',
    description: 'AI Agents, Live Video Avatars 24/7, Custom Web Applications και επιχειρηματικοί αυτοματισμοί.',
    images: ["https://www.sgk.gr/social-preview.png"],
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
