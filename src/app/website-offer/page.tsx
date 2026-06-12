import type { Metadata } from "next";
import WebsiteOfferPageContent from "@/components/WebsiteOfferPageContent";

export const metadata: Metadata = {
  title: "Κατασκευή Ιστοσελίδας | Προσφορά SGK Digital",
  description: "Επαγγελματική κατασκευή ιστοσελίδας με Next.js & React, μόνο με 300€. Υψηλές επιδόσεις PageSpeed και κορυφαίο SEO εγγυημένα.",
  alternates: {
    canonical: "https://sgk.gr/website-offer",
  },
  openGraph: {
    title: "Κατασκευή Ιστοσελίδας | Προσφορά SGK Digital",
    description: "Επαγγελματική κατασκευή ιστοσελίδας με Next.js & React, μόνο με 300€. Υψηλές επιδόσεις PageSpeed και κορυφαίο SEO εγγυημένα.",
    url: "https://sgk.gr/website-offer",
    siteName: "SGK Digital",
    images: [
      {
        url: "https://sgk.gr/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Προσφορά Κατασκευής Ιστοσελίδας - SGK Digital",
      },
    ],
    locale: "el_GR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Κατασκευή Ιστοσελίδας | Προσφορά SGK Digital",
    description: "Επαγγελματική κατασκευή ιστοσελίδας με Next.js & React, μόνο με 300€. Υψηλές επιδόσεις PageSpeed και κορυφαίο SEO εγγυημένα.",
    images: ["https://sgk.gr/social-preview.png"],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Κατασκευή Ιστοσελίδας (Next.js & React)",
  "description": "Υπηρεσία κατασκευής ιστοσελίδων υψηλής ταχύτητας με Next.js και React.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "SGK Software Development",
    "url": "https://sgk.gr"
  },
  "offers": {
    "@type": "Offer",
    "price": "300.00",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": "https://sgk.gr/website-offer"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Greece"
  }
};

export default function WebsiteOfferPage() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Merriweather:wght@300;400;700;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <WebsiteOfferPageContent />
    </>
  );
}
