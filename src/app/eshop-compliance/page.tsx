import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EshopCompliancePageContent from "@/components/EshopCompliancePageContent";

export const metadata: Metadata = {
  title: "Νέα Νομοθεσία Ε.Ε. για E-shop | Δωρεάν Έλεγχος Υπαναχώρησης",
  description: "Μάθετε αν το e-shop σας κινδυνεύει από τον νέο νόμο (Οδηγία Ε.Ε. 2023/2673) και το νέο Κουμπί Υπαναχώρησης. Δωρεάν έλεγχος συμμόρφωσης.",
  alternates: {
    canonical: "https://sgk.gr/eshop-compliance",
  },
  openGraph: {
    title: "Νέα Νομοθεσία Ε.Ε. για E-shop | Δωρεάν Έλεγχος Υπαναχώρησης",
    description: "Μάθετε αν το e-shop σας κινδυνεύει από τον νέο νόμο (Οδηγία Ε.Ε. 2023/2673) και το νέο Κουμπί Υπαναχώρησης. Δωρεάν έλεγχος συμμόρφωσης.",
    url: "https://sgk.gr/eshop-compliance",
    siteName: "SGK Digital",
    images: [
      {
        url: "https://sgk.gr/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Νέα Νομοθεσία Ε.Ε. για E-shop - SGK Digital",
      },
    ],
    locale: "el_GR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Νέα Νομοθεσία Ε.Ε. για E-shop | Δωρεάν Έλεγχος",
    description: "Μάθετε αν το e-shop σας κινδυνεύει από τον νέο νόμο.",
    images: ["https://sgk.gr/social-preview.png"],
  },
};

export default function EshopCompliancePage() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Merriweather:wght@300;400;700;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <EshopCompliancePageContent />
    </>
  );
}
