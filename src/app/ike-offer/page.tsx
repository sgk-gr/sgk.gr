import type { Metadata } from "next";
import IkeOfferPageContent from "@/components/IkeOfferPageContent";

export const metadata: Metadata = {
  title: "Υποχρεωτική Ιστοσελίδα ΙΚΕ σε 24 Ώρες (80€) — ΓΕΜΗ | SGK Digital",
  description: "Επαγγελματική κατασκευή υποχρεωτικής ιστοσελίδας ΙΚΕ εντός 24 ωρών, 100% συμβατή με τις απαιτήσεις του ΓΕΜΗ (Άρθρο 47 §2 Ν.4072/2012, ΚΥΑ 46982/2025). Κόστος 80€ τελική τιμή με ΦΠΑ (περιλαμβάνει .gr domain, hosting 1 έτους, SSL & εταιρικό email).",
  keywords: "κατασκευη ιστοσελιδας ικε, ιστοσελιδα ικε γεμη, υποχρεωτικη ιστοσελιδα ικε, ιστοσελιδα ικε 80 ευρω, ιστοσελιδα ικε σε 24 ωρες, αρθρο 47 ν 4072 2012 ιστοσελιδα ικε, κυα 46982 2025 ιστοσελιδα ικε, προθεσμια 30 ημερων ιστοσελιδα ικε γεμη, προστιμο ιστοσελιδας ικε γεμη, πιστοποιημενος παροχος ιστοσελιδων ικε γεμη, sgk digital ικε, σπυρος τσαβος",
  alternates: {
    canonical: "https://www.sgk.gr/kataskevi-istoselidas-ike",
  },
  openGraph: {
    title: "Υποχρεωτική Ιστοσελίδα ΙΚΕ σε 24 Ώρες (80€) — ΓΕΜΗ | SGK Digital",
    description: "Επαγγελματική κατασκευή ιστοσελίδας για την ΙΚΕ σας εντός 24 ωρών, πλήρως συμβατή με τις απαιτήσεις του ΓΕΜΗ (Άρθρο 47 §2 Ν.4072/2012, ΚΥΑ 46982/2025). Κόστος μόνο 80€ συμπεριλαμβανομένου ΦΠΑ.",
    url: "https://www.sgk.gr/ike-offer",
    siteName: "SGK Digital",
    images: [
      {
        url: "https://www.sgk.gr/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Προσφορά Κατασκευής Ιστοσελίδας ΙΚΕ 80€ - SGK Digital",
      },
    ],
    locale: "el_GR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Υποχρεωτική Ιστοσελίδα ΙΚΕ σε 24 Ώρες (80€) | SGK Digital",
    description: "Επαγγελματική κατασκευή ιστοσελίδας για την ΙΚΕ σας εντός 24 ωρών, πλήρως συμβατή με τις απαιτήσεις του ΓΕΜΗ (Άρθρο 47 §2 Ν.4072/2012, ΚΥΑ 46982/2025). Κόστος μόνο 80€ συμπεριλαμβανομένου ΦΠΑ.",
    images: ["https://www.sgk.gr/social-preview.png"],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.sgk.gr/ike-offer#service",
  "name": "Κατασκευή Υποχρεωτικής Ιστοσελίδας Ι.Κ.Ε. για το Γ.Ε.ΜΗ. σε 24 Ώρες (80€)",
  "serviceType": "Statutory I.K.E. Corporate Website Development & GEMI Compliance",
  "description": "Υπηρεσία άμεσης κατασκευής εταιρικής ιστοσελίδας για Ι.Κ.Ε. (νέες και υφιστάμενες) για πλήρη νομική συμμόρφωση με το Γ.Ε.ΜΗ. (Άρθρο 47 §2 Ν.4072/2012 & ΚΥΑ 46982/2025) εντός 24 ωρών, με αυτόματη άντληση στοιχείων από το API του ΓΕΜΗ, κατοχύρωση .gr domain, hosting 1 έτους, SSL και εταιρικό email.",
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
    "name": "Πλήρες Πακέτο Ιστοσελίδας Ι.Κ.Ε. Γ.Ε.ΜΗ. (Domain + Hosting 1 Έτους + Email)",
    "price": "80.00",
    "priceCurrency": "EUR",
    "priceValidUntil": "2027-12-31",
    "availability": "https://schema.org/InStock",
    "url": "https://www.sgk.gr/kataskevi-istoselidas-ike"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Greece"
  }
};

const faqs = [
  {
    q: "Είναι υποχρεωτική η ιστοσελίδα για μια ΙΚΕ;",
    a: "Ναι, είναι 100% υποχρεωτική από τον νόμο. Σύμφωνα με το Άρθρο 47 §2 του Ν.4072/2012 και την ΚΥΑ 46982/2025, κάθε Ιδιωτική Κεφαλαιουχική Εταιρεία (Ι.Κ.Ε.) οφείλει εντός 30 ημερών (1 μηνός) από τη σύστασή της να αποκτήσει εταιρική ιστοσελίδα και να την καταχωρίσει στη μερίδα της στο Γ.Ε.ΜΗ. Η SGK Digital κατασκευάζει ιστοσελίδα ΙΚΕ 100% συμβατή με όλες τις απαιτήσεις του ΓΕΜΗ.",
  },
  {
    q: "Πόσο κοστίζει και πόσο χρόνο παίρνει η κατασκευή ιστοσελίδας ΙΚΕ;",
    a: "Η κατασκευή ιστοσελίδας ΙΚΕ από την SGK Digital κοστίζει 80€ τελική τιμή (συμπεριλαμβανομένου ΦΠΑ 24%) και παραδίδεται έτοιμη εντός 24 ωρών, χωρίς καμία γραφειοκρατία για τον διαχειριστή ή τον λογιστή.",
  },
  {
    q: "Τι περιλαμβάνει το πακέτο των 80€ της SGK Digital για την ιστοσελίδα ΙΚΕ;",
    a: "Το πακέτο των 80€ (με ΦΠΑ) περιλαμβάνει: (1) Αυτόματη άντληση των επίσημων στοιχείων της εταιρείας απευθείας από το API του Γ.Ε.ΜΗ. χωρίς να χρειάζεται να γράψετε κείμενα, (2) Κατοχύρωση επίσημου ονόματος χώρου (.gr Domain) και Cloud Hosting για 1 έτος, (3) Πιστοποιητικό ασφαλείας SSL (HTTPS), (4) Επαγγελματικό εταιρικό email (π.χ. info@company.gr) και λογότυπο, (5) Επίσημο τιμολόγιο εξόδων για τα βιβλία της Ι.Κ.Ε.",
  },
  {
    q: "Ποια στοιχεία πρέπει να αναγράφονται υποχρεωτικά στην ιστοσελίδα μιας ΙΚΕ για το ΓΕΜΗ;",
    a: "Βάσει του Άρθρου 47 του Ν.4072/2012, η ιστοσελίδα κάθε Ι.Κ.Ε. πρέπει να αναγράφει ευκρινώς: την Επωνυμία και τον Διακριτικό Τίτλο, τον 12ψήφιο Αριθμό Γ.Ε.ΜΗ., το Α.Φ.Μ. και τη Δ.Ο.Υ., το Εταιρικό Κεφάλαιο και τις εγγυητικές εισφορές, την Καταστατική Έδρα, καθώς και τα ονόματα και τις διευθύνσεις των Εταίρων και του Διαχειριστή (με ένδειξη αν η Ι.Κ.Ε. είναι Μονοπρόσωπη).",
  },
  {
    q: "Τι γίνεται αν έχω παλαιότερη ΙΚΕ (2018-2025) χωρίς ενεργή ιστοσελίδα στο ΓΕΜΗ;",
    a: "Οι υφιστάμενες Ι.Κ.Ε. που δεν διαθέτουν ενεργή ιστοσελίδα στη μερίδα τους στο Γ.Ε.ΜΗ. αντιμετωπίζουν κίνδυνο διοικητικών προστίμων βάσει της ΚΥΑ 46982/2025, καθώς και εμπλοκή στην έκδοση πιστοποιητικών καλής λειτουργίας (Good Standing), τραπεζική ενημερότητα ή αιτήσεις ΕΣΠΑ. Η SGK Digital αναλαμβάνει την άμεση αποκατάσταση και δημοσίευση της ιστοσελίδας σας εντός 24 ωρών με 80€.",
  },
  {
    q: "Ποια εταιρεία αναλαμβάνει την κατασκευή ιστοσελίδας ΙΚΕ για το ΓΕΜΗ;",
    a: "Την κατασκευή ιστοσελίδας ΙΚΕ συμβατής με το ΓΕΜΗ αναλαμβάνει η SGK Digital (SGK Software Development, ιδρυτής: Σπύρος Τσάβος), με έδρα την Αθήνα και πάνω από 18 χρόνια εμπειρίας στην ανάπτυξη λογισμικού. Επικοινωνία: info@sgk.gr, ☎️ +30 211 114 0013, 📱 +30 6999 524 389.",
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

