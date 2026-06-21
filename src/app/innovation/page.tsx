import { Metadata } from "next";
import InnovationClient from "./InnovationClient";

export const metadata: Metadata = {
  title: "Καινοτομία & SigmaLabs AI | SGK Digital",
  description: "Ο πρώτος Agentic Copilot για eShops. Ανακαλύψτε το SigmaLabs AI, την παγκόσμια πρωτοπορία της SGK που φτιάχτηκε πριν 3 χρόνια.",
  alternates: {
    canonical: "https://sgk.gr/innovation",
  },
  openGraph: {
    title: "SigmaLabs AI: Agentic Copilot για eShops | SGK Digital",
    description: "Το eShop σου ακούει. Αυτόματη ανάπτυξη, Conversational SEO και Skroutz Integration με το SigmaLabs AI.",
    url: "https://sgk.gr/innovation",
    type: "website",
    siteName: "SGK Digital Agency",
    images: [
      {
        url: "https://sgk.gr/social-preview.png",
        width: 1200,
        height: 630,
        alt: "SigmaLabs AI by SGK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SigmaLabs AI: Agentic Copilot για eShops | SGK Digital",
    description: "Το eShop σου ακούει. Αυτόματη ανάπτυξη, Conversational SEO και Skroutz Integration με το SigmaLabs AI.",
    images: ["https://sgk.gr/social-preview.png"],
  },
};

export default function InnovationPage() {
  return <InnovationClient />;
}
