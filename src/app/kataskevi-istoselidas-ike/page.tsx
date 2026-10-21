import type { Metadata } from "next";
import KataskeviIkePageContent from "@/components/KataskeviIkePageContent";

export const metadata: Metadata = {
  title: "Κατασκευή Σελίδας για ΙΚΕ σε 24h (80€ Τελική με ΦΠΑ) — ΓΕΜΗ | SGK Digital",
  description: "Επαγγελματική κατασκευή σελίδας για ΙΚΕ & ιστοσελίδας ΓΕΜΗ σε 24 ώρες, 100% συμβατή με τον Ν.4072/2012 και την ΚΥΑ 46982/2025. Κόστος 80€ τελική τιμή με ΦΠΑ (περιλαμβάνει .gr Domain, 1 έτος Hosting, SSL, Εταιρικό Email & αυτόματη άντληση από το OpenData API του ΓΕΜΗ).",
  keywords: "κατασκευη σελιδας για ικε, κατασκευη ιστοσελιδας ικε, σελιδα για ικε, ιστοσελιδα ικε γεμη, κοστοσ κατασκευησ σελιδασ ικε, ικε site, site ικε, υποχρεωτικη ιστοσελιδα ικε, αρθρο 47 ν 4072 2012, προστιμα γεμη ικε, sgk digital",
  alternates: {
    canonical: "https://www.sgk.gr/kataskevi-istoselidas-ike",
  },
  openGraph: {
    title: "Κατασκευή Σελίδας για ΙΚΕ σε 24h (80€ Τελική με ΦΠΑ) — ΓΕΜΗ | SGK Digital",
    description: "Επαγγελματική κατασκευή ιστοσελίδας για την ΙΚΕ σας εντός 24 ωρών, πλήρως συμβατή με τις απαιτήσεις του ΓΕΜΗ (Ν.4072/2012). Κόστος μόνο 80€ τελική τιμή με ΦΠΑ.",
    url: "https://www.sgk.gr/kataskevi-istoselidas-ike",
    siteName: "SGK Digital",
    images: [
      {
        url: "https://www.sgk.gr/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Κατασκευή Σελίδας για ΙΚΕ 80€ - SGK Digital",
      },
    ],
    locale: "el_GR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Κατασκευή Σελίδας για ΙΚΕ σε 24h (80€) | SGK Digital",
    description: "Κατασκευή ιστοσελίδας για ΙΚΕ εντός 24 ωρών, 100% συμβατή με το ΓΕΜΗ. Κόστος μόνο 80€ με ΦΠΑ.",
    images: ["https://www.sgk.gr/social-preview.png"],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.sgk.gr/kataskevi-istoselidas-ike#service",
  "name": "Κατασκευή Σελίδας για ΙΚΕ & Ιστοσελίδας ΓΕΜΗ σε 24 Ώρες (80€ Τελική με ΦΠΑ)",
  "serviceType": "Statutory I.K.E. Corporate Website Development & GEMI Compliance",
  "description": "Υπηρεσία άμεσης κατασκευής εταιρικής σελίδας για ΙΚΕ (νέες και υφιστάμενες) για πλήρη νομική συμμόρφωση με το Γ.Ε.ΜΗ. (Άρθρο 47 §2 Ν.4072/2012 & ΚΥΑ 46982/2025) εντός 24 ωρών, με αυτόματη άντληση στοιχείων από το OpenData API του ΓΕΜΗ, κατοχύρωση .gr domain, hosting 1 έτους, SSL και εταιρικό email.",
  "provider": {
    "@type": "LocalBusiness",
    "@id": "https://www.sgk.gr/#organization",
    "name": "SGK Digital (SGK Software Development)",
    "founder": {
      "@type": "Person",
      "@id": "https://www.sgk.gr/#spyros-tsavos",
      "name": "Σπύρος Τσάβος (Spyros Tsavos)"
    },
    "telephone": "+302111140013",
    "email": "info@sgk.gr",
    "url": "https://www.sgk.gr"
  },
  "offers": {
    "@type": "Offer",
    "name": "Πλήρες Πακέτο Ιστοσελίδας Ι.Κ.Ε. Γ.Ε.ΜΗ. (Domain + Hosting 1 Έτους + SSL + Email)",
    "price": "80.00",
    "priceCurrency": "EUR",
    "priceValidUntil": "2027-12-31",
    "availability": "https://schema.org/InStock",
    "url": "https://www.sgk.gr/kataskevi-istoselidas-ike"
  },
  "areaServed": "GR",
  "inLanguage": "el"
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Είναι υποχρεωτική η κατασκευή σελίδας για κάθε νέα ΙΚΕ;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ναι, βάσει του Άρθρου 47 §2 του Νόμου 4072/2012 και της ΚΥΑ 46982/2025, κάθε ΙΚΕ οφείλει να διαθέτει εταιρική ιστοσελίδα και να τη δηλώσει στο Γ.Ε.ΜΗ. εντός 30 ημερών από τη σύστασή της. Η μη συμμόρφωση επισύρει πρόστιμα από 500€ έως 100.000€."
      }
    },
    {
      "@type": "Question",
      "name": "Πόσο κοστίζει η κατασκευή σελίδας για ΙΚΕ στην SGK Digital;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Το πλήρες πακέτο κοστίζει 80€ ΤΕΛΙΚΗ ΤΙΜΗ ΜΕ ΦΠΑ. Περιλαμβάνει την κατασκευή της ιστοσελίδας, κατοχύρωση .gr domain name, φιλοξενία (hosting) 1 έτους σε ταχύτατους servers, πιστοποιητικό SSL και εταιρικό email. Από τον 2ο χρόνο, η ανανέωση hosting παραμένει 80€/έτος με ΦΠΑ, χωρίς καμία απολύτως δέσμευση."
      }
    },
    {
      "@type": "Question",
      "name": "Ποια είναι τα υποχρεωτικά στοιχεία που πρέπει να έχει η σελίδα της ΙΚΕ;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Η ιστοσελίδα πρέπει να αναγράφει υποχρεωτικά: 1) Επωνυμία & Διακριτικό Τίτλο, 2) Αριθμό Γ.Ε.ΜΗ. & Μητρώο Επιμελητηρίου, 3) ΑΦΜ & αρμόδια ΔΟΥ, 4) Διεύθυνση Έδρας & Επικοινωνία, 5) Εταιρικό Κεφάλαιο & Εισφορές Εταίρων, 6) Ημερομηνία λήξης πρώτης διαχειριστικής περιόδου, 7) Στοιχεία Διαχειριστών, 8) Στοιχεία Εταίρων, 9) Κατάσταση Εκκαθάρισης και 10) Οικονομικές Καταστάσεις / Ισολογισμούς."
      }
    },
    {
      "@type": "Question",
      "name": "Πόσος χρόνος χρειάζεται για να είναι έτοιμη η ιστοσελίδα;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Η παράδοση ολοκληρώνεται εντός 24 ωρών από την παραλαβή του ΑΦΜ της εταιρείας σας. Μέσω του επίσημου OpenData API του Γ.Ε.ΜΗ., αντλούμε αυτόματα τα στοιχεία της σύστασης, εκμηδενίζοντας τον χρόνο αναμονής και αποφεύγοντας τυπογραφικά λάθη."
      }
    },
    {
      "@type": "Question",
      "name": "Πώς δηλώνω την ιστοσελίδα στο Γ.Ε.ΜΗ. (businessportal.gr);",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Μόλις ολοκληρώσουμε την κατασκευή, σας στέλνουμε το επίσημο link (π.χ. https://mycompany.gr). Συνδέεστε στο businessportal.gr με τους κωδικούς Taxisnet της εταιρείας, επιλέγετε «Αίτηση Μεταβολής / Δήλωση Ιστοτόπου», επικολλάτε το link και η καταχώριση επικυρώνεται άμεσα."
      }
    }
  ]
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
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
      "name": "Υπηρεσίες",
      "item": "https://www.sgk.gr/services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Κατασκευή Σελίδας για ΙΚΕ (ΓΕΜΗ)",
      "item": "https://www.sgk.gr/kataskevi-istoselidas-ike"
    }
  ]
};

export default function KataskeviIkePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <KataskeviIkePageContent />
    </>
  );
}
