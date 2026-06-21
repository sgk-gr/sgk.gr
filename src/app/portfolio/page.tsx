import { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Πελάτες | SGK Digital",
  description: "Δείτε τα κορυφαία έργα μας: από headless e-shops και AI platforms μέχρι custom web portals και mobile apps.",
  alternates: {
    canonical: "https://sgk.gr/portfolio",
  },
  openGraph: {
    title: "Τα Έργα & Οι Πελάτες Μας | SGK Digital",
    description: "Δείτε τα κορυφαία έργα μας: από headless e-shops και AI platforms μέχρι custom web portals και mobile apps.",
    url: "https://sgk.gr/portfolio",
    type: "website",
    siteName: "SGK Digital Agency",
    images: [
      {
        url: "https://sgk.gr/social-preview.png",
        width: 1200,
        height: 630,
        alt: "SGK Digital Agency Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Τα Έργα & Οι Πελάτες Μας | SGK Digital",
    description: "Δείτε τα κορυφαία έργα μας: από headless e-shops και AI platforms μέχρι custom web portals και mobile apps.",
    images: ["https://sgk.gr/social-preview.png"],
  },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
