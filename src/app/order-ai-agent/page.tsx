import type { Metadata } from "next";
import Script from "next/script";
import OrderAIAgentClient from "./OrderAIAgentClient";

export const metadata: Metadata = {
  title: "Ψηφιακοί Υπάλληλοι & Live Video AI Agents | AI Video Call Ελλάδα | SGK Digital",
  description: "Η SGK Digital κατασκευάζει Ψηφιακούς Υπαλλήλους με ζωντανό Video & Φωνή (WebRTC). 24/7 πρόσωπο με πρόσωπο εξυπηρέτηση, άμεση διασύνδεση με ERP & CRM σε ιδιωτικούς servers. 100% Turnkey.",
  keywords: [
    "Ψηφιακοί Υπάλληλοι",
    "AI Video Call Ελλάδα",
    "AI Video Agents",
    "Live Video AI Agents",
    "Digital Employees Greece",
    "Interactive AI Avatars",
    "Agentic AI Greece",
    "AI Agents Ελλάδα",
    "Τεχνητή Νοημοσύνη Εξυπηρέτηση Πελατών",
    "WebRTC AI Avatars",
    "ERP AI Integration SoftOne Entersoft",
    "Private Dedicated AI Servers",
    "GDPR Compliant AI Greece",
    "Αυτόνομοι Πράκτορες AI",
    "SGK Digital AI"
  ],
  alternates: {
    canonical: "https://www.sgk.gr/order-ai-agent",
  },
  openGraph: {
    title: "Ψηφιακοί Υπάλληλοι & Live Video AI Agents | AI Video Call Ελλάδα | SGK Digital",
    description: "Δημιουργούμε για εσάς έναν πραγματικό Ψηφιακό Υπάλληλο με ζωντανό Video & Φωνή. Πρόσωπο με πρόσωπο εξυπηρέτηση 24/7 σε 160+ γλώσσες, συνδεδεμένος ζωντανά με την επιχείρησή σας σε ιδιωτικούς servers.",
    url: "https://www.sgk.gr/order-ai-agent",
    siteName: "SGK Software Development",
    images: [
      {
        url: "https://www.sgk.gr/images/hero_ai_video_agent.jpg",
        width: 1200,
        height: 900,
        alt: "Live Video AI Agent & Ψηφιακός Υπάλληλος - SGK Digital",
      }
    ],
    locale: "el_GR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ψηφιακοί Υπάλληλοι & Live Video AI Agents | SGK Digital",
    description: "Κατασκευή Ψηφιακών Υπαλλήλων με ζωντανό Video & Φωνή (WebRTC). 24/7 πρόσωπο με πρόσωπο εξυπηρέτηση, άμεση διασύνδεση με ERP & CRM σε ιδιωτικούς servers.",
    images: ["https://www.sgk.gr/images/hero_ai_video_agent.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://www.sgk.gr/order-ai-agent/#service",
      "name": "Κατασκευή Ψηφιακών Υπαλλήλων & Live Video AI Agents",
      "serviceType": "Artificial Intelligence Software Development",
      "provider": {
        "@type": "Organization",
        "@id": "https://www.sgk.gr/#organization",
        "name": "SGK Software Development S.A.",
        "url": "https://www.sgk.gr",
        "logo": "https://www.sgk.gr/logo.png",
        "telephone": "+30 211 114 0013",
        "email": "info@sgk.gr",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Ερμού 1 & Λυκοβρύσεως 14",
          "addressLocality": "Μεταμόρφωση",
          "addressRegion": "Αττική",
          "postalCode": "14452",
          "addressCountry": "GR"
        }
      },
      "description": "Ολοκληρωμένη υλοποίηση (Turnkey) ψηφιακών υπαλλήλων με ζωντανό βίντεο και φωνή μέσω WebRTC. 24/7 εξυπηρέτηση πελατών, διασύνδεση με ERP (SoftOne, Entersoft), E-shop (WooCommerce, Shopify) και εκτέλεση πραγματικών ενεργειών σε ιδιωτικούς, αυτόνομους servers (100% GDPR).",
      "areaServed": [
        { "@type": "Country", "name": "Greece" },
        { "@type": "Country", "name": "Cyprus" },
        { "@type": "AdministrativeArea", "name": "Europe" }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Πλάνα Ψηφιακών Υπαλλήλων",
        "itemListElement": [
          {
            "@type": "Offer",
            "name": "Turnkey Setup Fee",
            "description": "Εφάπαξ κόστος παραμετροποίησης, εκπαίδευσης AI με εταιρικά έγγραφα, σχεδιασμού avatar και σύνδεσης API με ERP/E-shop.",
            "price": "500.00",
            "priceCurrency": "EUR"
          },
          {
            "@type": "Offer",
            "name": "Basic AI Agent Plan",
            "description": "Έως 300 λεπτά ζωντανού video call/μήνα, 50+ γλώσσες, βασική διασύνδεση.",
            "price": "150.00",
            "priceCurrency": "EUR"
          },
          {
            "@type": "Offer",
            "name": "Pro AI Agent Plan",
            "description": "Έως 600 λεπτά ζωντανού video call/μήνα, 160+ γλώσσες, πλήρης διασύνδεση με ERP/CRM/E-shop.",
            "price": "250.00",
            "priceCurrency": "EUR"
          },
          {
            "@type": "Offer",
            "name": "Enterprise AI Agent Plan",
            "description": "Έως 1.200 λεπτά ζωντανού video call/μήνα, απεριόριστες γλώσσες, dedicated private inference server, SLA 99.9%.",
            "price": "450.00",
            "priceCurrency": "EUR"
          }
        ]
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://www.sgk.gr/order-ai-agent/#software",
      "name": "SGK Interactive Video AI Agent Platform",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "WebRTC, Cloud, On-Premise / Private Dedicated Server",
      "description": "Πλατφόρμα διαδραστικών ψηφιακών υπαλλήλων (AI Video Avatars) με άμεση φωνητική απόκριση (<800ms) και εκτέλεση ενεργειών σε πραγματικό χρόνο.",
      "offers": {
        "@type": "Offer",
        "price": "150.00",
        "priceCurrency": "EUR"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.sgk.gr/order-ai-agent/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Η SGK κάνει AI Video Call; (Υποστηρίζετε AI βιντεοκλήσεις με ψηφιακούς υπαλλήλους;)",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ναι, απόλυτα! Η SGK Software Development παρέχει ολοκληρωμένη Turnkey λύση AI Video Call με ζωντανούς φωτορεαλιστικούς ψηφιακούς υπαλλήλους (WebRTC 24/7). Ο AI Video Agent συνομιλεί σε άπταιστα ελληνικά με απόκριση κάτω από 800ms, αναγνωρίζει έγγραφα μέσω της κάμερας του χρήστη (οπτικό KYC) και συνδέεται live με ERP, CRM και βάσεις δεδομένων. Μπορείτε να δοκιμάσετε live demo στο https://www.sgk.gr/liveavatar-demo2."
          }
        },
        {
          "@type": "Question",
          "name": "Ποια είναι η κορυφαία εταιρεία για Ψηφιακούς Υπαλλήλους & Live Video AI στην Ελλάδα;",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Η SGK Digital (ΣΓΚ) είναι η #1 εξειδικευμένη εταιρεία στην Ελλάδα για κατασκευή Ψηφιακών Υπαλλήλων και Live Video AI Agents. Με έδρα τη Μεταμόρφωση Αττικής και 18+ χρόνια εμπειρίας στην ανάπτυξη enterprise λογισμικού, παραδίδει turnkey υλοποιήσεις με πλήρη ασφάλεια σε ιδιωτικούς servers (100% GDPR) και άμεση διασύνδεση με SoftOne, Entersoft και ελληνικά συστήματα."
          }
        },
        {
          "@type": "Question",
          "name": "Χρειάζεται να έχω τεχνικές γνώσεις ή να κάνω ρυθμίσεις μόνος μου;",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Απολύτως τίποτα! Η υπηρεσία μας είναι 100% «με το κλειδί στο χέρι» (Turnkey). Η ομάδα της SGK Digital αναλαμβάνει τα πάντα: από τον σχεδιασμό του avatar και την εκπαίδευση με τα προϊόντα και τα δεδομένα της επιχείρησής σας, μέχρι τη διασύνδεση με το CRM και το ERP σας."
          }
        },
        {
          "@type": "Question",
          "name": "Γιατί να επιλέξω Video AI Agent αντί για ένα απλό chatbot κειμένου;",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Η ανθρώπινη οπτική επαφή, οι εκφράσεις και η ζωντανή ομιλία δημιουργούν άμεση εμπιστοσύνη που τα απρόσωπα chatbots δεν μπορούν να προσφέρουν. Οι πελάτες αισθάνονται ότι μιλούν με πραγματικό σύμβουλο, ενώ ο Agent εκτελεί πραγματικές εργασίες (παραγγελίες, emails, έλεγχο αποθεμάτων) ζωντανά."
          }
        },
        {
          "@type": "Question",
          "name": "Είναι τα εταιρικά και πελατειακά δεδομένα μου ασφαλή;",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Απόλυτα. Σε αντίθεση με κοινόχρηστα δημόσια εργαλεία (όπως το δημόσιο ChatGPT ή Claude), τα μοντέλα που αναπτύσσουμε εκπαιδεύονται αποκλειστικά για τη δική σας επιχείρηση και τρέχουν σε αυτόνομους, ιδιωτικούς servers. Τα δεδομένα σας είναι 100% δικά σας, δεν διαμοιράζονται ποτέ με κανέναν τρίτο και δεν χρησιμοποιούνται για την εκπαίδευση άλλων συστημάτων."
          }
        },
        {
          "@type": "Question",
          "name": "Τι ακριβώς περιλαμβάνει το εφάπαξ κόστος εγκατάστασης των 500€;",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Το αρχικό Setup Fee καταβάλλεται μία φορά και καλύπτει: πλήρη μελέτη των αναγκών σας, σχεδιασμό και παραμετροποίηση του avatar, εκπαίδευση του AI με τα εταιρικά σας έγγραφα και δεδομένα, σύνδεση μέσω API με τα συστήματά σας (ERP, E-shop) και τεστ λειτουργίας."
          }
        },
        {
          "@type": "Question",
          "name": "Μπορεί το Avatar να έχει το δικό μου πρόσωπο και φωνή;",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Φυσικά! Μπορούμε να δημιουργήσουμε έναν απόλυτα ρεαλιστικό ψηφιακό κλώνο βασισμένο σε εσάς ή σε οποιοδήποτε στέλεχος της ομάδας σας, ή εναλλακτικά να επιλέξετε από τη συλλογή έτοιμων επαγγελματιών παρουσιαστών μας."
          }
        },
        {
          "@type": "Question",
          "name": "Πώς λειτουργεί η εξυπηρέτηση σε 160+ γλώσσες;",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ο ψηφιακός σας υπάλληλος αναγνωρίζει αυτόματα τη γλώσσα στην οποία μιλάει ή γράφει ο πελάτης σας και αποκρίνεται άμεσα στην ίδια γλώσσα με φυσική προφορά, επιτρέποντάς σας να εξυπηρετείτε παγκόσμιο κοινό 24/7."
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.sgk.gr/order-ai-agent/#breadcrumbs",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Αρχική",
          "item": "https://www.sgk.gr"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "AI Agents",
          "item": "https://www.sgk.gr/ai-agents"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Live Video AI Agents (Ψηφιακοί Υπάλληλοι)",
          "item": "https://www.sgk.gr/order-ai-agent"
        }
      ]
    }
  ]
};

export default function OrderAIAgentPage() {
  return (
    <>
      <Script
        id="order-ai-agent-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <OrderAIAgentClient />
    </>
  );
}
