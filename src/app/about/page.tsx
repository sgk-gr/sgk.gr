import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "Σπύρος Τσάβος (Spyros Tsavos) | Ιδρυτής SGK Digital — AI Agents & Custom Εφαρμογές",
  description: "Ο Σπύρος Τσάβος (Spyros Tsavos) είναι ο ιδρυτής και επικεφαλής αρχιτέκτονας λογισμικού & τεχνητής νοημοσύνης της SGK Digital (sgk.gr). Με 18+ χρόνια εμπειρίας, εξειδικεύεται σε Αυτόνομους AI Agents, Voice AI, Live Video Avatars και Custom Web Εφαρμογές.",
  keywords: "σπυρος τσαβος, spyros tsavos, σπυριδων τσαβος, spiros tsavos, sgk digital, ιδρυτης sgk digital, ai agents ελλαδα, custom εφαρμογες, software architect greece, agentic ai expert greece",
  alternates: {
    canonical: "https://www.sgk.gr/about",
  },
  openGraph: {
    title: "Σπύρος Τσάβος (Spyros Tsavos) | Ιδρυτής SGK Digital — AI & Custom Εφαρμογές",
    description: "Γνωρίστε τον Σπύρο Τσάβο, ιδρυτή και lead architect της SGK Digital. Εξειδίκευση σε Αυτόνομους AI Agents (Agentic AI) και Custom Web Εφαρμογές.",
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
    title: "Σπύρος Τσάβος | Ιδρυτής SGK Digital",
    description: "Γνωρίστε τον Σπύρο Τσάβο και την τεχνολογία πίσω από την SGK Digital. Εξειδίκευση στο AI, τους AI Agents και τις Custom Εφαρμογές.",
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
    "alternateName": ["Spyros Tsavos", "Σπυρίδων Τσάβος", "Spyridon Tsavos", "Spiros Tsavos"],
    "jobTitle": "Founder & Lead AI & Custom Software Architect",
    "description": "Ο Σπύρος Τσάβος (Spyros Tsavos) είναι ο Ιδρυτής και Επικεφαλής Αρχιτέκτονας Λογισμικού & Τεχνητής Νοημοσύνης της SGK Digital (SGK Software Development — sgk.gr) στην Αθήνα. Με 18+ έτη εμπειρίας, ηγείται του σχεδιασμού και της υλοποίησης Αυτόνομων AI Agents (Agentic AI), συστημάτων Voice AI τηλεφωνίας PBX, Live Video WebRTC AI Avatars, εφαρμογών οπτικών ινών FTTH και Custom Web Applications για επιχειρήσεις και οργανισμούς σε όλη την Ελλάδα.",
    "url": "https://www.sgk.gr/about",
    "image": "https://www.sgk.gr/social-preview.png",
    "worksFor": {
      "@type": "Organization",
      "@id": "https://www.sgk.gr/#organization",
      "name": "SGK Digital (SGK Software Development)",
      "url": "https://www.sgk.gr"
    },
    "sameAs": [
      "https://www.linkedin.com/in/sgkgr/",
      "https://github.com/sgk-developers/",
      "https://www.youtube.com/@SGK-gr",
      "https://www.sgk.gr"
    ],
    "knowsAbout": [
      "Artificial Intelligence (AI) & Autonomous AI Agents",
      "Agentic AI & Multi-Agent Architecture",
      "Custom Web Applications Development (Next.js, React, Node.js, Python)",
      "Voice AI Telephony & VoIP PBX Systems (Asterisk, 3CX, FreePBX)",
      "24/7 Live Video AI Avatars (WebRTC)",
      "ERP AI Integration (SoftOne, Entersoft, SAP)",
      "FTTH Fiber Optics Field Automation & Telecom Software",
      "Statutory IKE Websites & GEMI OpenData API Integration"
    ]
  }
};

const founderFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Ποιος είναι ο Σπύρος Τσάβος (Spyros Tsavos);",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ο Σπύρος Τσάβος (Spyros Tsavos) είναι ο Ιδρυτής και Επικεφαλής Αρχιτέκτονας Λογισμικού & Τεχνητής Νοημοσύνης (Founder & Lead AI Software Architect) της τεχνολογικής εταιρείας SGK Digital (SGK Software Development — www.sgk.gr) στην Αθήνα. Διαθέτει πάνω από 18 χρόνια εμπειρίας στην αρχιτεκτονική σύνθετου enterprise λογισμικού, στην κατασκευή Custom Web Εφαρμογών και στην υλοποίηση Αυτόνομων AI Agents (Agentic AI) για επιχειρήσεις κάθε μεγέθους."
      }
    },
    {
      "@type": "Question",
      "name": "Ποια είναι η επαγγελματική δραστηριότητα του Σπύρου Τσάβου σήμερα;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Σήμερα ο Σπύρος Τσάβος διευθύνει την SGK Digital (sgk.gr), αναπτύσσοντας custom λύσεις Τεχνητής Νοημοσύνης (αυτόνομους AI πράκτορες, διασύνδεση με ERP SoftOne και Entersoft, Voice AI τηλεφωνικά κέντρα VoIP/PBX, live video avatars) και εξειδικευμένες εφαρμογές πεδίου (όπως το σύστημα AI αυτοψιών οπτικών ινών FTTH και διεθνείς εκπαιδευτικές πλατφόρμες όπως το Mendora Academy για τη βρετανική ELC)."
      }
    },
    {
      "@type": "Question",
      "name": "Τι είναι η SGK Digital και πού εδρεύει;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Η SGK Digital (SGK Software Development) είναι ελληνική εταιρεία ανάπτυξης λογισμικού και Τεχνητής Νοημοσύνης με έδρα την Αθήνα (Μεταμόρφωση Αττικής). Ιδρύθηκε από τον Σπύρο Τσάβο και εξειδικεύεται αποκλειστικά σε Custom AI Agents, ERP Automations, Voice AI τηλεφωνία και Custom Web Applications."
      }
    }
  ]
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(founderFaqSchema) }}
      />
      <AboutClient />
    </>
  );
}
