import type { Metadata } from "next";
import IkeOfferPageContent from "@/components/IkeOfferPageContent";

export const metadata: Metadata = {
  title: "Υποχρεωτική Ιστοσελίδα ΙΚΕ σε 24 Ώρες | SGK Digital",
  description: "Επαγγελματική κατασκευή ιστοσελίδας για την ΙΚΕ σας εντός 24 ωρών, πλήρως συμβατή με τις απαιτήσεις του ΓΕΜΗ (Νόμος 4072/2012). Κόστος μόνο 124€ συμπεριλαμβανομένου ΦΠΑ.",
  alternates: {
    canonical: "https://sgk.gr/ike-offer",
  },
  openGraph: {
    title: "Υποχρεωτική Ιστοσελίδα ΙΚΕ σε 24 Ώρες | SGK Digital",
    description: "Επαγγελματική κατασκευή ιστοσελίδας για την ΙΚΕ σας εντός 24 ωρών, πλήρως συμβατή με τις απαιτήσεις του ΓΕΜΗ (Νόμος 4072/2012). Κόστος μόνο 124€ συμπεριλαμβανομένου ΦΠΑ.",
    url: "https://sgk.gr/ike-offer",
    siteName: "SGK Digital",
    images: [
      {
        url: "https://sgk.gr/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Προσφορά Κατασκευής Ιστοσελίδας ΙΚΕ - SGK Digital",
      },
    ],
    locale: "el_GR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Υποχρεωτική Ιστοσελίδα ΙΚΕ σε 24 Ώρες | SGK Digital",
    description: "Επαγγελματική κατασκευή ιστοσελίδας για την ΙΚΕ σας εντός 24 ωρών, πλήρως συμβατή με τις απαιτήσεις του ΓΕΜΗ (Νόμος 4072/2012). Κόστος μόνο 124€ συμπεριλαμβανομένου ΦΠΑ.",
    images: ["https://sgk.gr/social-preview.png"],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Κατασκευή Ιστοσελίδας ΙΚΕ (ΓΕΜΗ)",
  "description": "Υπηρεσία άμεσης κατασκευής ιστοσελίδας για ΙΚΕ για συμμόρφωση με το ΓΕΜΗ εντός 24 ωρών.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "SGK Software Development",
    "url": "https://sgk.gr"
  },
  "offers": {
    "@type": "Offer",
    "price": "124.00",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": "https://sgk.gr/ike-offer"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Greece"
  }
};

export default function IkeOfferPage() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Merriweather:wght@300;400;700;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <IkeOfferPageContent />
    </>
  );
}
