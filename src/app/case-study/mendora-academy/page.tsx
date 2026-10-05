import Script from "next/script";
import type { Metadata } from "next";
import MendoraCaseStudyClient from "./MendoraCaseStudyClient";

export const metadata: Metadata = {
  title: "Mendora Academy Case Study | AI Socratic Voice Tutor & EdTech — SGK Digital",
  description:
    "Case Study: Πώς η SGK Digital σχεδίασε και υλοποίησε την πρωτοποριακή πλατφόρμα Mendora Academy με Socratic Voice AI σε πραγματικό χρόνο (<600ms), αυτόματη διόρθωση χειρόγραφων ασκήσεων με Vision OCR και δυναμικό Knowledge Graph ύλης.",
  alternates: {
    canonical: "https://www.sgk.gr/case-study/mendora-academy",
  },
  openGraph: {
    title: "Mendora Academy Case Study | AI Socratic Voice Tutor & EdTech — SGK Digital",
    description:
      "Case Study: Voice-First AI Φροντιστήριο, WebRTC Realtime Audio, Vision OCR Αυτόματη Βαθμολόγηση και Supabase pgvector RAG από την SGK Digital.",
    url: "https://www.sgk.gr/case-study/mendora-academy",
    type: "article",
    images: [
      {
        url: "https://www.sgk.gr/mend.png",
        width: 1200,
        height: 630,
        alt: "Mendora Academy Case Study - SGK Digital",
      },
    ],
    siteName: "SGK Software Development",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mendora Academy Case Study | AI Socratic Voice Tutor & EdTech — SGK Digital",
    description:
      "Case Study: Voice-First AI Φροντιστήριο, WebRTC Realtime Audio και Vision OCR από την SGK Digital.",
    images: ["https://www.sgk.gr/mend.png"],
  },
};


const caseStudySchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Mendora Academy Case Study: AI Socratic Voice Tutor & EdTech by SGK Digital",
  "description": "Full-stack case study of Mendora Academy, custom-developed by SGK Digital for British ELC with OpenAI Realtime WebRTC, Vision OCR grading, and Supabase pgvector.",
  "image": "https://www.sgk.gr/mend.png",
  "author": {
    "@type": "Organization",
    "name": "SGK Digital",
    "url": "https://www.sgk.gr"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SGK Digital",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.sgk.gr/logo.png"
    }
  },
  "about": [
    {
      "@type": "SoftwareApplication",
      "name": "Mendora Academy",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web",
      "creator": {
        "@type": "Organization",
        "name": "SGK Digital",
        "url": "https://www.sgk.gr"
      }
    }
  ]
};

export default function MendoraCaseStudyPage() {
  return (
    <>
      <Script
        id="mendora-case-study-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />
      <MendoraCaseStudyClient />
    </>
  );
}
