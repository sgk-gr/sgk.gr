import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import EshopOfferPageContent from "@/components/EshopOfferPageContent";


export const metadata: Metadata = {
  title: "Κατασκευή Eshop | Προσφορά SGK Digital",
  description: "Επαγγελματική κατασκευή eshop με σύνδεση Skroutz & ERP, μόνο με 1.500€. Υψηλές επιδόσεις PageSpeed εγγυημένα.",
  alternates: {
    canonical: "https://sgk.gr/eshop-offer",
  },
  openGraph: {
    title: "Κατασκευή Eshop | Προσφορά SGK Digital",
    description: "Επαγγελματική κατασκευή eshop με σύνδεση Skroutz & ERP, μόνο με 1.500€. Υψηλές επιδόσεις PageSpeed εγγυημένα.",
    url: "https://sgk.gr/eshop-offer",
    siteName: "SGK Digital",
    images: [
      {
        url: "https://sgk.gr/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Προσφορά Κατασκευής Eshop - SGK Digital",
      },
    ],
    locale: "el_GR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Κατασκευή Eshop | Προσφορά SGK Digital",
    description: "Επαγγελματική κατασκευή eshop με σύνδεση Skroutz & ERP, μόνο με 1.500€. Υψηλές επιδόσεις PageSpeed εγγυημένα.",
    images: ["https://sgk.gr/social-preview.png"],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Κατασκευή Eshop (Next.js & Headless WooCommerce)",
  "description": "Υπηρεσία κατασκευής eshop υψηλής ταχύτητας με Next.js και Headless WooCommerce.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "SGK Software Development",
    "url": "https://sgk.gr"
  },
  "offers": {
    "@type": "Offer",
    "price": "1500.00",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": "https://sgk.gr/eshop-offer"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Greece"
  }
};

export default function EshopOfferPage() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Merriweather:wght@300;400;700;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <EshopOfferPageContent />
    </>
  );
}
