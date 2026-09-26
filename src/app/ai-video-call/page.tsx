import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { 
    Video, Mic, Eye, SlidersHorizontal, ShieldCheck, Play, ArrowRight, 
    CheckCircle2, Sparkles, Building2, Stethoscope, Dumbbell, ShoppingBag, 
    Calendar, Check, Bot, Zap, Globe
} from "lucide-react";

export const metadata: Metadata = {
    title: "AI Video Call & Live Video AI Agents | Ψηφιακοί Υπάλληλοι WebRTC | SGK Digital",
    description: "Ναι, η SGK κάνει AI Video Call! 24/7 διαδραστικοί ψηφιακοί υπάλληλοι (AI Avatars) μέσω WebRTC. Άπταιστος ελληνικός διάλογος, οπτική αναγνώριση εγγράφων με κάμερα, live διασύνδεση με CRM, ERP, ΓΕΜΗ & Google Calendar.",
    keywords: "ai video call, ai video calls ελλαδα, live video ai agents, ψηφιακοι υπαλληλοι βιντεο, webrtc ai avatars, video call με ai, sgk ai video call, ai video customer service, liveavatar demo, αυτονομοι video agents",
    alternates: {
        canonical: "https://www.sgk.gr/ai-video-call",
    },
    openGraph: {
        title: "AI Video Call & Live Video AI Agents 24/7 | SGK Digital",
        description: "Αντικαταστήστε τα ψυχρά γραπτά μηνύματα με ζωντανή ανθρώπινη επαφή. Ρεαλιστικό Video WebRTC, άπταιστος ελληνικός διάλογος, κάμερα ταυτοποίησης και live CRM/ERP διασύνδεση.",
        url: "https://www.sgk.gr/ai-video-call",
        siteName: "SGK Software Development",
        locale: "el_GR",
        type: "website",
        images: [{ url: "https://www.sgk.gr/hero_slide_2.png", width: 1200, height: 630, alt: "AI Video Call - SGK Digital" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Video Call & Live Video AI Agents | SGK Digital",
        description: "Ναι! Η SGK παρέχει AI Video Call με ψηφιακούς ανθρώπους WebRTC σε φυσικά ελληνικά.",
        images: ["https://www.sgk.gr/hero_slide_2.png"],
    },
    other: {
        "geo.region": "GR-I",
        "geo.placename": "Metamorfosi, Athens, Greece",
        "geo.position": "38.0632;23.7609",
        "ICBM": "38.0632, 23.7609"
    }
};

const videoServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://www.sgk.gr/ai-video-call#service",
    "name": "AI Video Call & Live Video AI Agents (24/7 WebRTC)",
    "serviceType": "Interactive AI Video Calling & Digital Employees",
    "description": "Ολοκληρωμένη λύση AI Video Call από την SGK Software Development. Ψηφιακοί υπάλληλοι/avatars που υποδέχονται επισκέπτες με ζωντανό βίντεο WebRTC, ακούνε μέσω μικροφώνου, απαντούν άμεσα σε φυσικά ελληνικά, αναγνωρίζουν έγγραφα μέσω κάμερας και συνδέονται live με CRM, ERP, ΓΕΜΗ & Google Calendar.",
    "provider": {
        "@type": "LocalBusiness",
        "name": "SGK Software Development",
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
    "areaServed": [
        { "@type": "Country", "name": "Greece" },
        { "@type": "Country", "name": "Cyprus" }
    ],
    "url": "https://www.sgk.gr/ai-video-call"
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Η SGK κάνει AI Video Call; (Υποστηρίζει η SGK ζωντανές βιντεοκλήσεις με AI;)",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ναι, απόλυτα! Η SGK Software Development είναι η πρώτη εταιρεία στην Ελλάδα που παρέχει πλήρως έτοιμη, εμπορικά τυποποιημένη λύση για AI Video Call και Interactive Live Video AI Agents. Οι πελάτες συνδέονται σε πραγματικό χρόνο μέσω WebRTC με ψηφιακούς ανθρώπους/avatars που συνομιλούν σε άπταιστα ελληνικά, αναγνωρίζουν αντικείμενα και έγγραφα μέσω κάμερας και εκτελούν αυτόνομα ενέργειες σε CRM, ERP και ΓΕΜΗ."
            }
        },
        {
            "@type": "Question",
            "name": "Πώς μπορώ να δοκιμάσω το AI Video Call της SGK;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Μπορείτε να δοκιμάσετε ζωντανά το AI Video Call demo απευθείας στη διεύθυνση https://www.sgk.gr/liveavatar-demo χωρίς καμία εγκατάσταση, χρησιμοποιώντας απλά το μικρόφωνο και την κάμερα του υπολογιστή ή του κινητού σας."
            }
        },
        {
            "@type": "Question",
            "name": "Ποια είναι τα τεχνικά χαρακτηριστικά του AI Video Call της SGK;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "1) Ρεαλιστικό Video WebRTC με φυσική κίνηση και εξαιρετικά χαμηλή καθυστέρηση (<800ms). 2) Άπταιστος ελληνικός διάλογος χωρίς ρομποτικές καθυστερήσεις με τέλειο lip-sync. 3) Live σύνδεση με CRM, ERP (SoftOne, Entersoft), Google Calendar, ΓΕΜΗ & τραπεζικά APIs. 4) Σχεδιασμένο για οπτική αναγνώριση εγγράφων και ταυτοποίηση KYC μέσω κάμερας."
            }
        },
        {
            "@type": "Question",
            "name": "Σε ποιες επιχειρήσεις απευθύνονται οι AI Video Agents;",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Σε γυμναστήρια & αθλητικά κέντρα (24/7 υποδοχή και εγγραφές μελών), ιατρεία & κλινικές (onboarding ασθενών, λήψη ιστορικού, κλείσιμο ραντεβού), τράπεζες & ασφαλιστικές (ταυτοποίηση KYC μέσω κάμερας), και ηλεκτρονικά καταστήματα e-shops (διαδραστικός video shopping assistant)."
            }
        }
    ]
};

export default function AiVideoCallPage() {
    return (
        <>
            <Script
                id="ai-video-call-service-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(videoServiceSchema) }}
            />
            <Script
                id="ai-video-call-faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="min-h-screen bg-[#faf9f5] flex flex-col font-sans selection:bg-[#3b5bdb] selection:text-white">
                <Navbar />

                <main className="flex-1 pt-32 pb-24">
                    {/* HERO SECTION */}
                    <section className="container mx-auto px-6 mb-20">
                        <div className="max-w-4xl mx-auto text-center space-y-6">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#3b5bdb] font-bold text-xs uppercase tracking-wider">
                                <Video className="w-4 h-4 text-[#3b5bdb]" />
                                Ναι, η SGK κανει AI Video Call
                            </div>

                            <h1 className="text-4xl sm:text-6xl font-light text-black tracking-tight leading-[1.15]">
                                AI Video Call & <br />
                                <span className="font-normal text-[#3b5bdb]">
                                    Ζωντανοί Ψηφιακοί Υπάλληλοι (WebRTC)
                                </span>
                            </h1>

                            <p className="text-gray-600 text-lg sm:text-xl font-light max-w-3xl mx-auto leading-relaxed">
                                Αντικαταστήστε τα ψυχρά γραπτά μηνύματα με ζωντανή ανθρώπινη επαφή. Οι Video Agents της SGK Digital υποδέχονται τον επισκέπτη με χαμόγελο, ακούνε μέσω μικροφώνου, απαντούν άμεσα σε φυσικά ελληνικά και ολοκληρώνουν συναλλαγές.
                            </p>

                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/liveavatar-demo"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3b5bdb] hover:bg-[#324ec7] text-white font-bold rounded-xl text-base transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
                                >
                                    <Play className="w-5 h-5 fill-white" />
                                    <span>Δοκιμάστε το AI Video Call Ζωντανά</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Link>

                                <Link
                                    href="/estimate"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl text-base transition-all border border-gray-250 shadow-sm"
                                >
                                    <span>Ζητήστε Προσφορά για την Επιχείρησή σας</span>
                                </Link>
                            </div>

                            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-medium">
                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> WebRTC Real-Time Streaming</span>
                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Άπταιστα Φυσικά Ελληνικά</span>
                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ταυτοποίηση KYC μέσω Κάμερας</span>
                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Σύνδεση ERP, CRM & ΓΕΜΗ</span>
                            </div>
                        </div>
                    </section>

                    {/* 4 CORE ADVANTAGES */}
                    <section className="container mx-auto px-6 mb-24">
                        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
                            <div className="p-8 rounded-2xl bg-white border border-gray-250 shadow-sm hover:border-[#3b5bdb] transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3b5bdb] flex items-center justify-center mb-5">
                                    <Video className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-black mb-2">Ρεαλιστικό Video WebRTC</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Φυσική ανθρώπινη κίνηση και άμεση απόκριση σε πραγματικό χρόνο (&lt;800ms) χωρίς καθυστερήσεις ή διακοπές.
                                </p>
                            </div>

                            <div className="p-8 rounded-2xl bg-white border border-gray-250 shadow-sm hover:border-[#3b5bdb] transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
                                    <Mic className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-black mb-2">Άπταιστος Ελληνικός Διάλογος</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Φυσική ελληνική άρθρωση και τέλειος συγχρονισμός χειλιών (lip-sync) χωρίς καμία ρομποτική αίσθηση.
                                </p>
                            </div>

                            <div className="p-8 rounded-2xl bg-white border border-gray-250 shadow-sm hover:border-[#3b5bdb] transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                                    <Eye className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-black mb-2">Οπτική Ταυτοποίηση & Κάμερα</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Σχεδιασμένο για οπτική αναγνώριση εγγράφων, επαλήθευση ταυτότητας KYC και real-time computer vision μέσω της κάμερας του χρήστη.
                                </p>
                            </div>

                            <div className="p-8 rounded-2xl bg-white border border-gray-250 shadow-sm hover:border-[#3b5bdb] transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-black mb-2">Live Σύνδεση με CRM, ERP & ΓΕΜΗ</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Αυτόματη άντληση στοιχείων εταιρειών από το ΓΕΜΗ με βάση το ΑΦΜ, ενημέρωση παραγγελιών στο SoftOne/Entersoft και καταχώριση ραντεβού στο Google Calendar.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* INDUSTRY APPLICATIONS */}
                    <section className="bg-white border-y border-gray-250 py-20 mb-24">
                        <div className="container mx-auto px-6 max-w-5xl">
                            <div className="text-center mb-16">
                                <span className="text-xs font-bold uppercase tracking-widest text-[#3b5bdb]">Εφαρμογες Ανα Κλαδο</span>
                                <h2 className="text-3xl sm:text-4xl font-light text-black mt-2">
                                    Πού Χρησιμοποιείται το AI Video Call;
                                </h2>
                                <p className="text-gray-500 font-light mt-2">
                                    Πραγματικές περιπτώσεις χρήσης για ελληνικές επιχειρήσεις που πρωτοπορούν
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="p-8 rounded-2xl border border-gray-250 bg-[#faf9f5]">
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                                        <Dumbbell className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-black mb-2">Γυμναστήρια & Αθλητικά Κέντρα</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        24/7 υποδοχή επισκεπτών στην οθόνη του γυμναστηρίου ή στο website. Ο AI Video Agent εξηγεί τα προγράμματα, εγγράφει νέα μέλη, συλλέγει στοιχεία και εκδίδει την ψηφιακή κάρτα μέλους.
                                    </p>
                                </div>

                                <div className="p-8 rounded-2xl border border-gray-250 bg-[#faf9f5]">
                                    <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
                                        <Stethoscope className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-black mb-2">Ιατρεία, Διαγνωστικά & Κλινικές</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Προ-εξέταση και ψηφιακό triage. Ο ψηφιακός υπάλληλος υποδέχεται τον ασθενή, καταγράφει το ιστορικό με ευγένεια και κλείνει άμεσα ραντεβού στο ημερολόγιο του κατάλληλου ιατρού.
                                    </p>
                                </div>

                                <div className="p-8 rounded-2xl border border-gray-250 bg-[#faf9f5]">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-black mb-2">Τράπεζες, Ασφαλιστικές & Ενέργεια</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Οπτική ταυτοποίηση KYC μέσω κάμερας. Ο πελάτης δείχνει την ταυτότητά του, το AI επαληθεύει τα στοιχεία σε live χρόνο, συντάσσει το ιδιωτικό συμφωνητικό και το αποστέλλει για ψηφιακή υπογραφή.
                                    </p>
                                </div>

                                <div className="p-8 rounded-2xl border border-gray-250 bg-[#faf9f5]">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                                        <ShoppingBag className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-black mb-2">E-Commerce & High-End Retail</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Προσωπικός AI Video Shopping Assistant. Παρουσιάζει live προϊόντα στην οθόνη, απαντά σε απορίες μεγεθών και χαρακτηριστικών και καθοδηγεί τον πελάτη μέχρι την ολοκλήρωση της πληρωμής.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* LIVE DEMO CALLOUT */}
                    <section className="container mx-auto px-6 mb-24">
                        <div className="max-w-4xl mx-auto rounded-3xl bg-[#3b5bdb] text-white p-10 sm:p-14 text-center shadow-xl relative overflow-hidden">
                            <h2 className="text-3xl sm:text-4xl font-light mb-4">
                                Δοκιμάστε Ζωντανά το AI Video Call Τώρα
                            </h2>
                            <p className="text-white/90 text-base sm:text-lg mb-8 max-w-2xl mx-auto font-light leading-relaxed">
                                Συνδεθείτε απευθείας με τον AI Video Agent της SGK Digital. Μιλήστε του στα ελληνικά μέσω του μικροφώνου σας και δείτε την άμεση ανθρώπινη απόκριση σε πραγματικό χρόνο.
                            </p>
                            <Link
                                href="/liveavatar-demo"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-[#4ade80] hover:bg-[#22c55e] text-black font-black text-base rounded-xl transition-all shadow-lg hover:scale-105"
                            >
                                <Play className="w-5 h-5 fill-black" />
                                <span>Εκκίνηση Live Video Call Demo</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </section>

                    {/* FAQ ACCORDION / LIST */}
                    <section className="container mx-auto px-6 max-w-4xl mb-24">
                        <h2 className="text-3xl font-light text-black mb-4 text-center">Συχνές Ερωτήσεις (FAQ) για το AI Video Call</h2>
                        <p className="text-gray-500 text-center mb-12 font-light">Όλα όσα πρέπει να γνωρίζετε για την τεχνολογία και την ενσωμάτωση</p>

                        <div className="space-y-6">
                            {faqSchema.mainEntity.map((item, idx) => (
                                <div key={idx} className="p-8 rounded-2xl border border-gray-250 bg-white shadow-sm">
                                    <h3 className="text-lg font-bold text-black mb-3">{item.name}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.acceptedAnswer.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
