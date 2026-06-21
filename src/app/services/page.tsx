import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Οι Υπηρεσίες Μας | SGK Digital',
  description: 'Ανακαλύψτε τις ψηφιακές λύσεις της SGK. Κατασκευή E-shop, Custom Web Apps, AI Agents και Digital Marketing με τη φιλοσοφία Pay As You Grow.',
  alternates: {
    canonical: "https://sgk.gr/services",
  },
  openGraph: {
    title: 'Οι Υπηρεσίες Μας | SGK Digital',
    description: 'Ανακαλύψτε τις ψηφιακές λύσεις της SGK. Κατασκευή E-shop, Custom Web Apps, AI Agents και Digital Marketing με τη φιλοσοφία Pay As You Grow.',
    url: "https://sgk.gr/services",
    type: "website",
    images: ["https://sgk.gr/social-preview.png"],
    siteName: "SGK Software Development",
  },
  twitter: {
    card: "summary_large_image",
    title: 'Οι Υπηρεσίες Μας | SGK Digital',
    description: 'Κατασκευή E-shop, Custom Web Apps, AI Agents και Digital Marketing με τη φιλοσοφία Pay As You Grow.',
    images: ["https://sgk.gr/social-preview.png"],
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
