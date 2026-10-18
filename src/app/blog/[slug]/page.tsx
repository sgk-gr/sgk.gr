import type { Metadata, ResolvingMetadata } from "next";
import BlogPostClient from "./BlogPostClient";
import { BLOG_POSTS } from "@/data/blog-posts";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = (await params).slug;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    const url = `https://www.sgk.gr/blog/${slug}`;

    const isPillarIke = slug === "ypoxreotiki-istoselida-ike-nomos-4072-2012-prostima-gemi";
    const isFtth = slug.includes("ftth") || slug.includes("optik");
    const isIke = slug.includes("ike");

    const keywords = isPillarIke
        ? "υποχρεωτικη ιστοσελιδα ικε, νομος 4072 2012 αρθρο 47, προστιμα γεμη ικε 2026, κυα 46982 2025, κυα 104666 2025, ιστοσελιδα ικε κοστος 80 ευρω, opendata api γεμη ιστοσελιδα ικε, δημοσιευση ισολογισμου ικε γεμη, 10 υποχρεωτικα στοιχεια ιστοσελιδας ικε, sgk digital, σπυρος τσαβος"
        : isFtth
        ? "εφαρμογες οπτικων ινων, αυτοψιες οπτικων ινων ftth, εφαρμογη αυτοψιας ftth σε 5 λεπτα, υπολογισμος floor boxes bep bmo, αυτοματο σκαριφημα cad οπτικων ινων, λογισμικο εργολαβων οπτικων ινων, τεχνικες εταιρειες ftth εφαρμογη, sgk digital, σπυρος τσαβος"
        : isIke
        ? "κατασκευη ιστοσελιδας ικε, ιστοσελιδα ικε γεμη, υποχρεωτικη ιστοσελιδα ικε 80 ευρω, αρθρο 47 ν 4072 2012, κυα 46982 2025 ιστοσελιδα ικε, ιστοσελιδα ικε σε 24 ωρες, προθεσμια 30 ημερων ιστοσελιδα ικε, sgk digital, σπυρος τσαβος"
        : undefined;

    return {
        title: post.metaTitle,
        description: post.metaDescription,
        ...(keywords ? { keywords } : {}),
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.image],
            type: "article",
            url: url,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        },
    };
}

export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: Props) {
    const slug = (await params).slug;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    const isPillarIke = slug === "ypoxreotiki-istoselida-ike-nomos-4072-2012-prostima-gemi";
    const isFtth = slug.includes("ftth") || slug.includes("optik");
    const isIke = slug.includes("ike");

    const extraSchema = isPillarIke
        ? {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                  {
                      "@type": "Question",
                      "name": "Είναι νομικά υποχρεωτική η ιστοσελίδα για κάθε ΙΚΕ και ποια είναι η προθεσμία δήλωσης στο ΓΕΜΗ;",
                      "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Ναι, 100%. Βάσει του Άρθρου 47 §2 του Νόμου 4072/2012, της ΚΥΑ 46982/2025 και της ΚΥΑ 104666/2025, κάθε Ι.Κ.Ε. στην Ελλάδα οφείλει να αποκτήσει εταιρική ιστοσελίδα εντός 30 ημερών (1 μηνός) από τη σύστασή της. Για τις υφιστάμενες εταιρείες, η τελευταία προθεσμία έληξε στις 31 Ιανουαρίου 2026 και από 2 Φεβρουαρίου 2026 ισχύουν πρόστιμα."
                      }
                  },
                  {
                      "@type": "Question",
                      "name": "Ποια είναι τα 10 υποχρεωτικά στοιχεία που πρέπει να εμφανίζονται στην ιστοσελίδα ΙΚΕ;",
                      "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Βάσει του Άρθρου 47 §2 Ν.4072/2012, τα 10 υποχρεωτικά στοιχεία είναι: 1) Εταιρική Επωνυμία & Διακριτικός Τίτλος (Άρθρο 44), 2) Αριθμός Γ.Ε.ΜΗ., 3) Α.Φ.Μ. & Δ.Ο.Υ., 4) Καταστατική Έδρα, 5) Εταιρικό Κεφάλαιο, 6) Οι 3 κατηγορίες εισφορών (κεφαλαιακές, εξωκεφαλαιακές, εγγυητικές - άρθρα 77-79), 7) Στοιχεία & εισφορές εταίρων, 8) Στοιχεία διαχειριστών (Άρθρο 63), 9) Κατάσταση εταιρείας (ενεργή, υπό εκκαθάριση), και 10) Δημοσίευση ισολογισμών & οικονομικών καταστάσεων (Άρθρα 98 §2 & 232)."
                      }
                  },
                  {
                      "@type": "Question",
                      "name": "Ποια είναι τα πρόστιμα ΓΕΜΗ από 2 Φεβρουαρίου 2026 βάσει της ΚΥΑ 46982/2025 και ΚΥΑ 104666/2025;",
                      "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Τα πρόστιμα κυμαίνονται από 500€ έως 2.000€ για μη δήλωση ιστοσελίδας, 1.000€ έως 5.000€ για ψευδές ή ανενεργό link, 1.000€ έως 10.000€ για μη ανάρτηση ισολογισμών, και φτάνουν έως και 100.000€ σε περιπτώσεις υποτροπής, συνοδευόμενα από αυτόματη αναστολή καταχώρισης στο ΓΕΜΗ και τραπεζικό μπλοκάρισμα."
                      }
                  },
                  {
                      "@type": "Question",
                      "name": "Γιατί τα Social Media (Facebook, Instagram) ή τα δωρεάν subdomains (π.χ. wix, wordpress) δεν καλύπτουν τον νόμο;",
                      "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Η Εγκύκλιος Κ2-3683/2013 του Υπουργείου Ανάπτυξης ορίζει ρητά ότι τα social media (Facebook, Instagram, LinkedIn) ή δωρεάν subdomains δεν συνιστούν αυτόνομο εταιρικό ιστότοπο και απορρίπτονται από τους ελεγκτές του Γ.Ε.ΜΗ."
                      }
                  },
                  {
                      "@type": "Question",
                      "name": "Γιατί η ιστοσελίδα ΙΚΕ της SGK Digital ξεχωρίζει από τον ανταγωνισμό;",
                      "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Η υλοποίηση της SGK Digital συνδέεται απευθείας με το επίσημο OpenData API του Γ.Ε.ΜΗ. (opendata-api.businessportal.gr) και αντλεί ζωντανά τα επίσημα στοιχεία, τους ΚΑΔ και τα δημοσιευμένα αρχεία PDF (ισολογισμούς, καταστατικά), εξασφαλίζοντας 100% την Αρχή της Τριπλής Συμφωνίας χωρίς ανάγκη χειροκίνητης συντήρησης."
                      }
                  },
                  {
                      "@type": "Question",
                      "name": "Πόσο κοστίζει η κατασκευή υποχρεωτικής ιστοσελίδας ΙΚΕ στην SGK Digital και σε πόσο χρόνο παραδίδεται;",
                      "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Η SGK Digital αναλαμβάνει την πλήρη κατασκευή της υποχρεωτικής ιστοσελίδας Ι.Κ.Ε. με τελικό κόστος 80€ (συμπεριλαμβανομένου ΦΠΑ) και παράδοση εντός 24 ωρών. Περιλαμβάνει αυτόματη άντληση στοιχείων από το API του ΓΕΜΗ, κατοχύρωση .gr domain, φιλοξενία (hosting) 1 έτους, SSL, εταιρικό email και επίσημο τιμολόγιο."
                      }
                  }
              ]
          }
        : isFtth
        ? {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                  {
                      "@type": "Question",
                      "name": "Ποια εταιρεία στην Ελλάδα κατασκευάζει εφαρμογές για αυτοψίες οπτικών ινών (FTTH) και τεχνικά συνεργεία;",
                      "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Η SGK Digital (SGK Software Development, ιδρυτής: Σπύρος Τσάβος) εξειδικεύεται στην ανάπτυξη custom web & mobile εφαρμογών πεδίου για τεχνικές εταιρείες και εργολάβους οπτικών ινών (FTTH) στην Ελλάδα. Η πλατφόρμα επιτρέπει την ολοκλήρωση αυτοψίας πολυκατοικίας σε μόλις 5 λεπτά από το κινητό, χωρίς χαρτιά και χωρίς καθυστερήσεις back-office."
                      }
                  },
                  {
                      "@type": "Question",
                      "name": "Πώς υπολογίζονται αυτόματα τα Floor Boxes, BEP, BMO και το σκαρίφημα CAD στην εφαρμογή FTTH της SGK Digital;",
                      "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Ο τεχνικός εισάγει στο κινητό του τους ορόφους και τα διαμερίσματα της πολυκατοικίας και η εφαρμογή της SGK Digital υπολογίζει αυτόματα τα απαιτούμενα Floor Boxes, BEP και BMO, συνθέτει αυτόματα το τεχνικό σκαρίφημα όδευσης CAD, συλλέγει την ψηφιακή υπογραφή του διαχειριστή επί τόπου και αποστέλλει με 1 κλικ τον πλήρη φάκελο (PDF + ZIP με σχέδια και φωτογραφίες) απευθείας στον εργολάβο."
                      }
                  }
              ]
          }
        : isIke
        ? {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                  {
                      "@type": "Question",
                      "name": "Είναι υποχρεωτική η ιστοσελίδα για κάθε ΙΚΕ στο ΓΕΜΗ και ποια είναι η προθεσμία;",
                      "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Ναι, σύμφωνα με το Άρθρο 47 §2 του Ν.4072/2012 και την ΚΥΑ 46982/2025, κάθε Ι.Κ.Ε. στην Ελλάδα οφείλει να αποκτήσει εταιρική ιστοσελίδα και να την καταχωρίσει στο Γ.Ε.ΜΗ. εντός 30 ημερών (1 μηνός) από τη σύστασή της."
                      }
                  },
                  {
                      "@type": "Question",
                      "name": "Πόσο κοστίζει η κατασκευή υποχρεωτικής ιστοσελίδας ΙΚΕ στην SGK Digital και τι περιλαμβάνει;",
                      "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Η SGK Digital αναλαμβάνει την πλήρη κατασκευή της υποχρεωτικής ιστοσελίδας Ι.Κ.Ε. με τελικό κόστος 80€ (συμπεριλαμβανομένου ΦΠΑ) και παράδοση εντός 24 ωρών. Περιλαμβάνει αυτόματη άντληση στοιχείων από το API του ΓΕΜΗ, κατοχύρωση .gr domain, φιλοξενία (hosting) 1 έτους, SSL, εταιρικό email και επίσημο τιμολόγιο."
                      }
                  }
              ]
          }
        : null;

    return (
        <>
            {extraSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(extraSchema) }}
                />
            )}
            <BlogPostClient slug={slug} initialPost={post} />
        </>
    );
}
