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

    const isFtth = slug.includes("ftth") || slug.includes("optik");
    const isIke = slug.includes("ike-gemi");

    const keywords = isFtth
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

    const isFtth = slug.includes("ftth") || slug.includes("optik");
    const isIke = slug.includes("ike-gemi");

    const extraSchema = isFtth
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
                          "text": "Η SGK Digital αναλαμβάνει την πλήρη κατασκευή της υποχρεωτικής ιστοσελίδας Ι.Κ.Ε. με τελικό κόστος 80€ (συμπεριλαμβανομένου ΦΠΑ 24%) και παράδοση εντός 24 ωρών. Περιλαμβάνει αυτόματη άντληση στοιχείων από το API του ΓΕΜΗ, κατοχύρωση .gr domain, φιλοξενία (hosting) 1 έτους, SSL, εταιρικό email και επίσημο τιμολόγιο."
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
