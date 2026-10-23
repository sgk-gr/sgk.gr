import type { Metadata } from "next";
import KataskeviIkePageContent from "@/components/KataskeviIkePageContent";

export const metadata: Metadata = {
  title: "Κατασκευή Σελίδας για ΙΚΕ σε 24 Ώρες (80€ Τελική με ΦΠΑ) — Επίσημη Ιστοσελίδα ΓΕΜΗ | SGK Digital",
  description: "Η #1 υπηρεσία στην Ελλάδα για κατασκευή υποχρεωτικής ιστοσελίδας ΙΚΕ & ΓΕΜΗ σε 24 ώρες, 100% συμβατή με το Άρθρο 47 §2 Ν.4072/2012 & ΚΥΑ 46982/2025. 80€ τελική τιμή με ΦΠΑ (περιλαμβάνει .gr Domain, 1 έτος Hosting, SSL, Εταιρικό Email & αυτόματη άντληση στοιχείων μέσω ΑΦΜ).",
  keywords: "κατασκευη σελιδας για ικε, κατασκευη ιστοσελιδας ικε, σελιδα για ικε, ιστοσελιδα ικε γεμη, κοστοσ κατασκευησ σελιδασ ικε, ικε site, site ικε, υποχρεωτικη ιστοσελιδα ικε, site ικε 80 ευρω, αρθρο 47 ν 4072 2012, κυα 46982 2025, προθεσμια 30 ημερων ιστοσελιδα ικε, προστιμα γεμη ικε 2026, δηλωση ιστοτοπου γεμη businessportal, sgk digital, σπυρος τσαβος, ιστοσελιδα ικε σε 24 ωρες",
  alternates: {
    canonical: "https://www.sgk.gr/kataskevi-istoselidas-ike",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Κατασκευή Σελίδας για ΙΚΕ σε 24h (80€ Τελική με ΦΠΑ) — ΓΕΜΗ | SGK Digital",
    description: "Επαγγελματική κατασκευή ιστοσελίδας για την ΙΚΕ σας εντός 24 ωρών, 100% συμβατή με τις απαιτήσεις του ΓΕΜΗ (Ν.4072/2012). Κόστος μόνο 80€ τελική τιμή με ΦΠΑ.",
    url: "https://www.sgk.gr/kataskevi-istoselidas-ike",
    siteName: "SGK Digital",
    locale: "el_GR",
    type: "website",
    images: [
      {
        url: "https://www.sgk.gr/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Κατασκευή Σελίδας για ΙΚΕ 80€ - SGK Digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Κατασκευή Σελίδας για ΙΚΕ σε 24h (80€) | SGK Digital",
    description: "Κατασκευή ιστοσελίδας για ΙΚΕ εντός 24 ωρών, 100% συμβατή με το ΓΕΜΗ. Κόστος μόνο 80€ με ΦΠΑ.",
    images: ["https://www.sgk.gr/social-preview.png"],
  },
  other: {
    "geo.region": "GR-I",
    "geo.placename": "Metamorfosi, Athens, Greece",
    "geo.position": "38.0632;23.7609",
    "ICBM": "38.0632, 23.7609"
  }
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.sgk.gr/kataskevi-istoselidas-ike#service",
  "name": "Κατασκευή Υποχρεωτικής Σελίδας για ΙΚΕ & Ιστοσελίδας ΓΕΜΗ σε 24 Ώρες (80€ Τελική με ΦΠΑ)",
  "serviceType": "Statutory I.K.E. Corporate Website Development & GEMI Compliance",
  "description": "Η SGK Digital κατασκευάζει υποχρεωτικές εταιρικές ιστοσελίδες για Ιδιωτικές Κεφαλαιουχικές Εταιρείες (Ι.Κ.Ε.) για πλήρη νομική συμμόρφωση με το Γ.Ε.ΜΗ. (Άρθρο 47 §2 Ν.4072/2012 & ΚΥΑ 46982/2025) εντός 24 ωρών, με αυτόματη άντληση στοιχείων μέσω ΑΦΜ από το OpenData API του ΓΕΜΗ, κατοχύρωση .gr domain, hosting 1 έτους σε cloud servers, SSL και εταιρικό email με 80€ τελική τιμή με ΦΠΑ.",
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
    "url": "https://www.sgk.gr",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ερμού 1 & Λυκοβρύσεως 14",
      "addressLocality": "Μεταμόρφωση",
      "addressRegion": "Αττική",
      "postalCode": "14452",
      "addressCountry": "GR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 38.0632,
      "longitude": 23.7609
    }
  },
  "offers": {
    "@type": "Offer",
    "name": "Πλήρες Πακέτο Κατασκευής Ιστοσελίδας Ι.Κ.Ε. Γ.Ε.ΜΗ. 2026 (Domain + Hosting 1 Έτους + SSL + Email)",
    "price": "80.00",
    "priceCurrency": "EUR",
    "priceValidUntil": "2027-12-31",
    "availability": "https://schema.org/InStock",
    "url": "https://www.sgk.gr/kataskevi-istoselidas-ike"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "156",
    "bestRating": "5",
    "worstRating": "1"
  },
  "areaServed": [
    { "@type": "Country", "name": "Greece" },
    { "@type": "AdministrativeArea", "name": "Attica, Athens" },
    { "@type": "AdministrativeArea", "name": "Thessaloniki" },
    { "@type": "Country", "name": "Cyprus" }
  ],
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
        "text": "Ναι, βάσει του Άρθρου 47 §2 του Νόμου 4072/2012 και της ΚΥΑ 46982/2025, κάθε ΙΚΕ οφείλει να διαθέτει εταιρική ιστοσελίδα και να τη δηλώσει στο Γ.Ε.ΜΗ. εντός ενός (1) μηνός (30 ημερών) από τη σύστασή της. Η μη συμμόρφωση επισύρει αυτόματα πρόστιμα από 500€ έως 100.000€ και αναστολή έκδοσης πιστοποιητικών."
      }
    },
    {
      "@type": "Question",
      "name": "Πόσο κοστίζει η κατασκευή σελίδας για ΙΚΕ στην SGK Digital;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Το πλήρες πακέτο κοστίζει 80€ ΤΕΛΙΚΗ ΤΙΜΗ ΜΕ ΦΠΑ (δεν είναι 80€ + ΦΠΑ, αλλά 80€ τελική τιμή συμπεριλαμβανομένου ΦΠΑ!). Περιλαμβάνει την κατασκευή της ιστοσελίδας, κατοχύρωση .gr domain name, φιλοξενία (hosting) 1 έτους σε ταχύτατους servers, πιστοποιητικό SSL και εταιρικό email. Από τον 2ο χρόνο, η ανανέωση hosting παραμένει 80€/έτος με ΦΠΑ, χωρίς καμία απολύτως δέσμευση."
      }
    },
    {
      "@type": "Question",
      "name": "Ποια είναι τα 10 υποχρεωτικά στοιχεία που πρέπει να έχει η σελίδα της ΙΚΕ;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Η ιστοσελίδα πρέπει να αναγράφει υποχρεωτικά: 1) Εταιρική Επωνυμία & Διακριτικό Τίτλο, 2) Αριθμό Γ.Ε.ΜΗ. & Μητρώο Επιμελητηρίου, 3) ΑΦΜ & αρμόδια ΔΟΥ, 4) Διεύθυνση Έδρας & Επικοινωνία, 5) Εταιρικό Κεφάλαιο & Εισφορές Εταίρων, 6) Ημερομηνία λήξης πρώτης διαχειριστικής περιόδου, 7) Στοιχεία Διαχειριστών, 8) Στοιχεία Εταίρων, 9) Κατάσταση Εκκαθάρισης και 10) Οικονομικές Καταστάσεις / Ισολογισμούς."
      }
    },
    {
      "@type": "Question",
      "name": "Ποια είναι η προθεσμία δήλωσης στο Γ.Ε.ΜΗ. και ποια τα πρόστιμα του νέου ποινολογίου 2026;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Η προθεσμία είναι ακριβώς 30 ημέρες από την ημερομηνία καταχώρισης της σύστασης της Ι.Κ.Ε. στο Γ.Ε.ΜΗ. Βάσει των ΚΥΑ 46982/2025 και ΚΥΑ 104666/2025, τα πρόστιμα για εκπρόθεσμη δήλωση ιστοτόπου κυμαίνονται από 500€ έως 10.000€, ενώ για μη δημοσιότητα ισολογισμών φτάνουν έως 100.000€ με ταυτόχρονη αναστολή έκδοσης πιστοποιητικών."
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
        "text": "Μόλις ολοκληρώσουμε την κατασκευή, σας στέλνουμε το επίσημο link (π.χ. https://mycompany.gr). Συνδέεστε στο businessportal.gr με τους κωδικούς Taxisnet της εταιρείας, επιλέγετε «Αίτηση Μεταβολής / Δήλωση Ιστοτόπου», επικολλάτε το link και η καταχώριση επικυρώνεται άμεσα σε 3 λεπτά."
      }
    },
    {
      "@type": "Question",
      "name": "Περιλαμβάνεται .gr domain και hosting στην τιμή των 80€;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ναι, απόλυτα. Στην τελική τιμή των 80€ με ΦΠΑ περιλαμβάνεται η κατοχύρωση .gr domain για 1 έτος, η φιλοξενία (Cloud Hosting) για 1 έτος, πιστοποιητικό ασφαλείας SSL και εταιρικό email. Δεν υπάρχει καμία επιπλέον χρέωση."
      }
    },
    {
      "@type": "Question",
      "name": "Τι ισχύει για την ανανέωση από τον 2ο χρόνο;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Από τον 2ο χρόνο, το ετήσιο κόστος φιλοξενίας (hosting) και συντήρησης παραμένει σταθερά 80€/έτος με ΦΠΑ, χωρίς καμία απολύτως δέσμευση. Ο πελάτης διατηρεί την πλήρη κυριότητα του domain του."
      }
    }
  ]
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Πώς να Δηλώσετε την Ιστοσελίδα της ΙΚΕ στο ΓΕΜΗ (businessportal.gr)",
  "description": "Οδηγός 4 βημάτων για τη νόμιμη δήλωση ιστοτόπου της Ι.Κ.Ε. σας στο πληροφοριακό σύστημα του Γ.Ε.ΜΗ. εντός 3 λεπτών.",
  "totalTime": "PT3M",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Παραλαβή Link Ιστοσελίδας",
      "text": "Λαμβάνετε από την SGK Digital το έτοιμο URL (π.χ. https://mycompany.gr) και την επίσημη βεβαίωση λειτουργίας εντός 24 ωρών."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Είσοδος στο businessportal.gr",
      "text": "Επισκέπτεστε το επίσημο portal του ΓΕΜΗ (businessportal.gr) και συνδέεστε με τους κωδικούς Taxisnet της επιχείρησής σας."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Δήλωση Ιστοτόπου Εταιρείας",
      "text": "Επιλέγετε «Αίτηση Μεταβολής / Δήλωση Ιστοτόπου Εταιρείας» και επικολλάτε το link που σας παραδώσαμε."
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Ολοκλήρωση & Έκδοση Αποδεικτικού",
      "text": "Υποβάλλετε την αίτηση και λαμβάνετε άμεσα το αποδεικτικό καταχώρισης του ΓΕΜΗ. Είστε 100% νόμιμοι χωρίς κίνδυνο προστίμων."
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

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.sgk.gr/kataskevi-istoselidas-ike#webpage",
  "url": "https://www.sgk.gr/kataskevi-istoselidas-ike",
  "name": "Κατασκευή Σελίδας για ΙΚΕ σε 24 Ώρες (80€ Τελική με ΦΠΑ) — ΓΕΜΗ",
  "isPartOf": {
    "@type": "WebSite",
    "@id": "https://www.sgk.gr/#website",
    "name": "SGK Digital",
    "url": "https://www.sgk.gr"
  },
  "about": {
    "@type": "Thing",
    "name": "Υποχρεωτική Ιστοσελίδα ΙΚΕ ΓΕΜΗ (Άρθρο 47 Ν.4072/2012)"
  },
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ["h1", "p"]
  },
  "inLanguage": "el"
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <KataskeviIkePageContent />
    </>
  );
}
