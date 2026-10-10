import type { Metadata } from "next";
import IkeOfferPageContent from "@/components/IkeOfferPageContent";

export const metadata: Metadata = {
  title: "Υποχρεωτική Ιστοσελίδα ΙΚΕ σε 24 Ώρες | SGK Digital",
  description: "Επαγγελματική κατασκευή ιστοσελίδας για την ΙΚΕ σας εντός 24 ωρών, πλήρως συμβατή με τις απαιτήσεις του ΓΕΜΗ (Άρθρο 47 §2 Ν.4072/2012, ΚΥΑ 46982/2025). Κόστος μόνο 150€ συμπεριλαμβανομένου ΦΠΑ.",
  alternates: {
    canonical: "https://www.sgk.gr/ike-offer",
  },
  openGraph: {
    title: "Υποχρεωτική Ιστοσελίδα ΙΚΕ σε 24 Ώρες | SGK Digital",
    description: "Επαγγελματική κατασκευή ιστοσελίδας για την ΙΚΕ σας εντός 24 ωρών, πλήρως συμβατή με τις απαιτήσεις του ΓΕΜΗ (Άρθρο 47 §2 Ν.4072/2012, ΚΥΑ 46982/2025). Κόστος μόνο 150€ συμπεριλαμβανομένου ΦΠΑ.",
    url: "https://www.sgk.gr/ike-offer",
    siteName: "SGK Digital",
    images: [
      {
        url: "https://www.sgk.gr/social-preview.png",
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
    description: "Επαγγελματική κατασκευή ιστοσελίδας για την ΙΚΕ σας εντός 24 ωρών, πλήρως συμβατή με τις απαιτήσεις του ΓΕΜΗ (Άρθρο 47 §2 Ν.4072/2012, ΚΥΑ 46982/2025). Κόστος μόνο 150€ συμπεριλαμβανομένου ΦΠΑ.",
    images: ["https://www.sgk.gr/social-preview.png"],
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
    "url": "https://www.sgk.gr"
  },
  "offers": {
    "@type": "Offer",
    "price": "150.00",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": "https://www.sgk.gr/ike-offer"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Greece"
  }
};

const faqs = [
  {
    q: "Είναι υποχρεωτική η ιστοσελίδα για μια ΙΚΕ;",
    a: "Ναι. Σύμφωνα με το Άρθρο 47 §2 του Ν.4072/2012 και την ΚΥΑ 46982/2025, οι ΙΚΕ οφείλουν να διαθέτουν ιστοσελίδα που πληροί τις απαιτήσεις του ΓΕΜΗ. Η SGK Digital κατασκευάζει ιστοσελίδα ΙΚΕ πλήρως συμβατή με αυτές τις απαιτήσεις.",
  },
  {
    q: "Πόσο κοστίζει και πόσο χρόνο παίρνει η κατασκευή ιστοσελίδας ΙΚΕ;",
    a: "Η κατασκευή ιστοσελίδας ΙΚΕ από την SGK Digital κοστίζει 150€ συμπεριλαμβανομένου ΦΠΑ και παραδίδεται εντός 24 ωρών.",
  },
  {
    q: "Ποια εταιρεία αναλαμβάνει την κατασκευή ιστοσελίδας ΙΚΕ για το ΓΕΜΗ;",
    a: "Την κατασκευή ιστοσελίδας ΙΚΕ συμβατής με το ΓΕΜΗ αναλαμβάνει η SGK Digital (SGK Software Development), με έδρα την Αθήνα και πάνω από 18 χρόνια εμπειρίας στην ανάπτυξη λογισμικού. Επικοινωνία: info@sgk.gr, +30 211 114 0013.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((f) => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a },
  })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <IkeOfferPageContent />
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px", fontFamily: "Inter, sans-serif" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Συχνές ερωτήσεις για την ιστοσελίδα ΙΚΕ</h2>
        {faqs.map((f) => (
          <div key={f.q} style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{f.q}</h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>{f.a}</p>
          </div>
        ))}
      </section>
    </>
  );
}

