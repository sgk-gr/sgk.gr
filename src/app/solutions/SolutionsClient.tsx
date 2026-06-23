"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { ArrowRight, ShoppingCart, Globe, Bot, TrendingUp } from "lucide-react";

const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

const solutions = [
  {
    icon: <ShoppingCart className="w-6 h-6 text-[#3b5bdb]" />,
    tag: "B2B & B2C Platforms",
    title: "Ηλεκτρονικό εμπόριο νέας γενιάς",
    desc: "Custom headless e-shops για απόλυτη ευελιξία και ταχύτητα. Αυτοματοποιημένες διασυνδέσεις με ERP, CRM και B2B portals με custom τιμοκαταλόγους.",
    bullets: [
      "Custom headless e-shops (WooCommerce & Next.js)",
      "Αυτοματοποιημένες διασυνδέσεις ERP / CRM",
      "B2B portals με custom τιμοκαταλόγους",
      "Core Web Vitals 95+ — speed σε < 1s",
    ],
    href: "/kataskevi-eshop",
    cta: "Δες τα e-shop projects",
    image: "/images/solutions/eshop_dashboard.png",
    imageAlt: "E-commerce solutions",
    reverse: false,
  },
  {
    icon: <Globe className="w-6 h-6 text-[#3b5bdb]" />,
    tag: "Custom development",
    title: "Εξειδικευμένες web εφαρμογές",
    desc: "Web portals και dashboards για τη διαχείριση της επιχείρησής σας. Booking engines, SaaS πλατφόρμες και custom internal tools σχεδιασμένα από το μηδέν.",
    bullets: [
      "Web portals & management dashboards",
      "Booking engines για ξενοδοχεία & υπηρεσίες",
      "SaaS πλατφόρμες (Software as a Service)",
      "CRM, ERP integrations & custom APIs",
    ],
    href: "/web-development",
    cta: "Δες web development",
    image: "/images/solutions/webapp_dashboard.png",
    imageAlt: "Custom web applications",
    reverse: true,
  },
  {
    icon: <Bot className="w-6 h-6 text-[#3b5bdb]" />,
    tag: "AI integrations",
    title: "Έξυπνες αυτοματοποιήσεις AI",
    desc: "Custom AI chatbots για 24/7 εξυπηρέτηση πελατών, ενσωμάτωση LLMs στα δικά σας δεδομένα και αυτοματοποίηση επαναλαμβανόμενων διαδικασιών.",
    bullets: [
      "Custom AI chatbots & AI agents 24/7",
      "LLM integrations στα δεδομένα σας",
      "Αυτοματισμοί email, CRM & operations",
      "GDPR-compliant, δυνατότητα on-premise",
    ],
    href: "/ai-agents",
    cta: "Δες AI agents",
    image: "/images/solutions/ai_dashboard.png",
    imageAlt: "AI automations and agents",
    reverse: false,
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-[#3b5bdb]" />,
    tag: "Performance marketing",
    title: "Στρατηγικές ανάπτυξης",
    desc: "Ολοκληρωμένες στρατηγικές SEO, Google Ads & Meta Ads για οργανική κυριαρχία και μέγιστο ROI. Data analytics και Conversion Rate Optimization (CRO).",
    bullets: [
      "SEO — οργανική κυριαρχία στη Google",
      "Google Ads & Meta Ads με focus στο ROI",
      "Data analytics & conversion optimization",
      "Schema markup, sitemap & meta SEO",
    ],
    href: "/estimate",
    cta: "Ζητήστε προσφορά",
    image: "/images/solutions/marketing_dashboard.png",
    imageAlt: "Digital marketing and growth strategies",
    reverse: true,
  },
];

export default function SolutionsClient() {
  return (
    <div className="bg-[#f4f2ea] min-h-screen text-black font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow flex flex-col">
        {/* Hero */}
        <section className="w-full pt-32 pb-16 md:pt-44 md:pb-24 px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="text-[#3b5bdb] font-semibold text-xs tracking-wider uppercase mb-4">
              Ψηφιακές λύσεις • SGK
            </p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 text-black leading-tight">
              Λύσεις για{" "}
              <span className="font-bold text-[#3b5bdb]">κάθε ανάγκη</span>
            </h1>
            <p className="text-xl text-black/60 max-w-2xl mx-auto font-light leading-relaxed">
              Εξειδικευμένα εργαλεία και στρατηγικές που μεταμορφώνουν την
              επιχείρησή σας και οδηγούν σε πραγματική ανάπτυξη.
            </p>
          </motion.div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-black/10 py-10 bg-white/60">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "18+", label: "Χρόνια εμπειρίας" },
              { value: "100+", label: "Projects παραδοθέντα" },
              { value: "95+", label: "Core Web Vitals score" },
              { value: "24/7", label: "AI αυτοματισμοί" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-bold text-[#3b5bdb] mb-1">{s.value}</p>
                <p className="text-sm text-black/50 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Solutions */}
        {solutions.map((sol, idx) => (
          <section
            key={sol.title}
            className={`w-full py-20 md:py-28 ${idx % 2 === 0 ? "bg-[#f4f2ea]" : "bg-white"}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`flex flex-col ${sol.reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12 md:gap-16`}
              >
                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, x: sol.reverse ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7 }}
                  className="w-full md:w-1/2 flex flex-col justify-center space-y-6"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                      {sol.icon}
                    </div>
                    <span className="text-xs font-bold text-[#3b5bdb] tracking-wider uppercase">
                      {sol.tag}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-light leading-tight text-black">
                    {sol.title.split(" ").slice(0, -2).join(" ")}{" "}
                    <span className="font-bold">
                      {sol.title.split(" ").slice(-2).join(" ")}
                    </span>
                  </h2>

                  <p className="text-black/60 font-light leading-relaxed">
                    {sol.desc}
                  </p>

                  <ul className="space-y-3">
                    {sol.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm text-black/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3b5bdb] mt-2 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <Link
                      href={sol.href}
                      className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-medium rounded-lg transition-all duration-200 text-sm shadow-sm"
                    >
                      {sol.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>

                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="w-full md:w-1/2 relative h-[360px] md:h-[520px] rounded-2xl overflow-hidden border border-black/10 shadow-xl"
                >
                  <Image
                    src={sol.image}
                    alt={sol.imageAlt}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </section>
        ))}

        {/* Final CTA */}
        <section className="w-full py-24 bg-[#3b5bdb]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
              Έτοιμοι να εξελίξετε την{" "}
              <span className="font-bold">επιχείρησή σας;</span>
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto font-light">
              Επικοινωνήστε μαζί μας για να βρούμε μαζί την κατάλληλη λύση. Με
              το <strong className="text-white font-medium">Pay as you grow</strong> μοντέλο
              της SGK, πληρώνετε μόνο ό,τι χρειάζεστε.
            </p>
            <Link
              href="/estimate"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold text-lg rounded-lg transition-all duration-300 shadow-md"
            >
              Ξεκινήστε το project σας <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
