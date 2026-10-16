import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "Σπύρος Τσάβος & Η Εταιρεία | SGK Digital — AI Agents & Custom Εφαρμογές",
  description: "Γνωρίστε τον Σπύρο Τσάβο (Spyros Tsavos), ιδρυτή και επικεφαλής αρχιτέκτονα της SGK Digital. Εξειδίκευση στους Αυτόνομους AI Agents (Agentic AI), Voice AI, Live Video Avatars και Custom Web Εφαρμογές υψηλής κλίμακας.",
  keywords: "σπυρος τσαβος, spyros tsavos, σπυριδων τσαβος, sgk digital, ιδρυτης sgk digital, ai agents ελλαδα, custom εφαρμογες, software architect greece, agentic ai expert greece",
  alternates: {
    canonical: "https://www.sgk.gr/about",
  },
  openGraph: {
    title: "Σπύρος Τσάβος & Η Εταιρεία | SGK Digital — AI & Custom Εφαρμογές",
    description: "Γνωρίστε τον Σπύρο Τσάβο και την ομάδα της SGK Digital. Εξειδίκευση στους Αυτόνομους AI Agents, Agentic AI και Custom Web Εφαρμογές.",
    url: "https://www.sgk.gr/about",
    type: "profile",
    siteName: "SGK Digital",
    images: [
      {
        url: "https://www.sgk.gr/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Σπύρος Τσάβος - SGK Digital AI & Custom Applications",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Σπύρος Τσάβος & Η Εταιρεία | SGK Digital",
    description: "Γνωρίστε τον Σπύρο Τσάβο και την ομάδα πίσω από την SGK Digital. Εξειδίκευση στο AI, τους AI Agents και τις Custom Εφαρμογές.",
    images: ["https://www.sgk.gr/social-preview.png"],
  },
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "@id": "https://www.sgk.gr/#spyros-tsavos",
    "name": "Σπύρος Τσάβος",
    "alternateName": ["Spyros Tsavos", "Σπυρίδων Τσάβος", "Spyridon Tsavos"],
    "jobTitle": "Founder & Lead AI & Custom Software Architect",
    "description": "Ο Σπύρος Τσάβος είναι ιδρυτής και επικεφαλής αρχιτέκτονας λογισμικού της SGK Digital (SGK Software Development), εξειδικευμένος στην Τεχνητή Νοημοσύνη (Αυτόνομοι AI Agents, Agentic AI, Voice AI, Live Video Avatars, Computer Vision) και στην ανάπτυξη Custom Web Εφαρμογών για επιχειρήσεις και οργανισμούς.",
    "url": "https://www.sgk.gr/about",
    "worksFor": {
      "@type": "Organization",
      "@id": "https://www.sgk.gr/#organization",
      "name": "SGK Digital (SGK Software Development)",
      "url": "https://www.sgk.gr"
    },
    "knowsAbout": [
      "Artificial Intelligence (AI)",
      "Autonomous AI Agents & Agentic AI",
      "Custom Web Applications & Enterprise Software",
      "Next.js, React, TypeScript & Full-Stack Architecture",
      "Voice AI Telephony & WebRTC Video AI Avatars",
      "ERP & CRM AI Integrations (SoftOne, Entersoft, SAP)"
    ]
  }
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <AboutClient />
    </>
  );
}
