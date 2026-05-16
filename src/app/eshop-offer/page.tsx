import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import EshopOfferPageContent from "@/components/EshopOfferPageContent";


export const metadata: Metadata = {
  title: "Προσφορά Κατασκευής Eshop | SGK Digital",
  description: "Δημιουργήστε το δικό σας Eshop με την πιο σύγχρονη τεχνολογία (Next.js & Headless WooCommerce) από μόλις 2.300€. Υψηλή ταχύτητα, κορυφαίο SEO και μοναδική εμπειρία χρήστη.",
  openGraph: {
    title: "Προσφορά Κατασκευής Eshop | SGK Digital",
    description: "Δημιουργήστε ένα Eshop που πουλάει. Next.js & Headless WooCommerce από μόλις 2.300€.",
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
    title: "Προσφορά Κατασκευής Eshop | SGK Digital",
    description: "Δημιουργήστε ένα Eshop που πουλάει. Next.js & Headless WooCommerce από μόλις 2.300€.",
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
    "price": "2300.00",
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
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <div className="container mx-auto px-6 pt-10 pb-2">
        <div className="flex justify-center lg:justify-start">
          <Link href="/" className="flex items-center">
            <Image 
              src="/sgk-logo.png" 
              alt="SGK Digital" 
              width={200}
              height={80}
              className="h-16 md:h-20 w-auto brightness-0 invert" 
              priority
              loading="eager"
            />
          </Link>
        </div>
      </div>

      <EshopOfferPageContent />
      {/* Minimal Footer */}
      <footer className="py-12 border-t border-border mt-20">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} SGK Digital. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
