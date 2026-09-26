import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "Η Εταιρεία | SGK Digital",
  description: "Γνωρίστε τον Σπύρο Τσάβο και την ομάδα πίσω από την SGK Digital. Εξειδίκευση στο full-stack development, AI Chat Agents και καινοτόμες λύσεις.",
  alternates: {
    canonical: "https://www.sgk.gr/about",
  },
  openGraph: {
    title: "Η Εταιρεία | SGK Digital",
    description: "Γνωρίστε τον Σπύρο Τσάβο και την ομάδα πίσω από την SGK Digital. Εξειδίκευση στο full-stack development, AI Chat Agents και καινοτόμες λύσεις.",
    url: "https://www.sgk.gr/about",
    type: "website",
    siteName: "SGK Digital Agency",
    images: [
      {
        url: "https://www.sgk.gr/social-preview.png",
        width: 1200,
        height: 630,
        alt: "SGK Digital Agency About Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Η Εταιρεία | SGK Digital",
    description: "Γνωρίστε τον Σπύρο Τσάβο και την ομάδα πίσω από την SGK Digital. Εξειδίκευση στο full-stack development, AI Chat Agents και καινοτόμες λύσεις.",
    images: ["https://www.sgk.gr/social-preview.png"],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
