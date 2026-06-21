"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { ArrowRight, BookOpen, Award, Globe } from "lucide-react";

const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

const values = [
  {
    icon: <BookOpen className="w-5 h-5 text-[#3b5bdb]" />,
    title: "Τεχνογνωσία",
    desc: "Full-stack development, AI systems και headless e-commerce. Γράφουμε καθαρό κώδικα που κλιμακώνεται.",
  },
  {
    icon: <Award className="w-5 h-5 text-[#3b5bdb]" />,
    title: "Ακαδημαϊκή έρευνα",
    desc: "Ενεργό μέλος του ResearchGate και εισηγητής στο διεθνές συνέδριο INTED 2025 στη Βαλένθια.",
  },
  {
    icon: <Globe className="w-5 h-5 text-[#3b5bdb]" />,
    title: "Pay As You Grow",
    desc: "Πληρώνετε μόνο ό,τι χρειάζεστε. Μεγαλώνουμε μαζί σας, χωρίς κρυφά κόστη.",
  },
];

export default function AboutClient() {
  return (
    <div className="bg-[#f4f2ea] min-h-screen text-black font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow flex flex-col">

        {/* Hero — Founder */}
        <section className="w-full pt-28 pb-0 md:pt-36">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-12 md:mb-16"
            >
              <p className="text-[#3b5bdb] font-semibold text-xs tracking-wider uppercase mb-4">
                Η ομάδα μας
              </p>
              <h1 className="text-5xl md:text-7xl font-light tracking-tight text-black leading-tight">
                Πίσω από{" "}
                <span className="font-bold">την SGK</span>
              </h1>
            </motion.div>
          </div>

          {/* Founder card — full-width split */}
          <div className="w-full bg-white border-y border-black/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-stretch min-h-[560px]">
                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="w-full md:w-2/5 relative min-h-[360px] md:min-h-0"
                >
                  <Image
                    src="/tsavos.png"
                    alt="Σπύρος Τσάβος — Founder & Lead Developer"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </motion.div>

                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="w-full md:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center"
                >
                  <p className="text-[#3b5bdb] font-semibold text-xs tracking-wider uppercase mb-4">
                    Founder & Lead Developer
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
                    Σπύρος Τσάβος
                  </h2>
                  <p className="text-black/50 text-sm mb-6">MSc · Full-stack Engineer · AI Developer</p>

                  <p className="text-black/70 leading-relaxed mb-5 font-light">
                    Ο Σπύρος είναι ο άνθρωπος πίσω από την τεχνολογική κατεύθυνση της
                    εταιρείας. Με πολυετή εμπειρία στο full-stack development και πάθος
                    για καινοτομία, εξειδικεύεται στη δημιουργία high-end e-shop και
                    στην ενσωμάτωση προηγμένων AI agents που μεταμορφώνουν την
                    εξυπηρέτηση πελατών.
                  </p>
                  <p className="text-black/70 leading-relaxed font-light">
                    Είναι ενεργό μέλος του{" "}
                    <a
                      href="https://www.researchgate.net/profile/Spiros-Tsavos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3b5bdb] font-medium hover:underline"
                    >
                      ResearchGate
                    </a>
                    {" "}και το 2025 παρουσίασε ως εισηγητής στο διεθνές συνέδριο
                    INTED στη Βαλένθια, με θέμα τα mobile application innovations στην εκπαίδευση.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {["React / Next.js", "Node.js", "Python", "AI / LLMs", "WooCommerce", "PostgreSQL"].map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600">
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="w-full py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-4xl font-light text-black">
                Τι μας <span className="font-bold">ξεχωρίζει</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="p-8 bg-white rounded-2xl border border-black/10 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
                    {v.icon}
                  </div>
                  <h3 className="text-lg font-bold text-black mb-3">{v.title}</h3>
                  <p className="text-black/60 text-sm leading-relaxed font-light">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team photo */}
        <section className="w-full bg-white border-y border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-stretch min-h-[480px]">
              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center"
              >
                <p className="text-[#3b5bdb] font-semibold text-xs tracking-wider uppercase mb-4">
                  Η φιλοσοφία μας
                </p>
                <h2 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
                  Η δύναμη της τεχνολογίας{" "}
                  <span className="font-bold">στα χέρια σου</span>
                </h2>
                <p className="text-black/60 leading-relaxed mb-5 font-light">
                  Ο ψηφιακός μετασχηματισμός δεν πρέπει να σου προκαλεί άγχος.
                  Θέλουμε να κάνουμε την τεχνολογία προσιτή σε όλους, όπου κι αν
                  ανήκουν, σε όποιον κλάδο κι αν δραστηριοποιούνται.
                </p>
                <p className="text-black/60 leading-relaxed font-light">
                  Με αξιοπιστία και διαφάνεια, σε ενδυναμώνουμε με καινοτόμες
                  λύσεις — e-shops, AI agents, portals — και το υποστηρικτικό μοντέλο{" "}
                  <span className="font-medium text-black">Pay As You Grow</span>, για
                  να είναι η επιχείρησή σου πιο ανταγωνιστική κάθε μέρα.
                </p>
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="w-full md:w-1/2 relative min-h-[320px] md:min-h-0"
              >
                <Image
                  src="/sgk-team.png"
                  alt="Η ομάδα της SGK"
                  fill
                  className="object-cover object-center"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-24 bg-[#3b5bdb]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
              Θέλετε να{" "}
              <span className="font-bold">δουλέψουμε μαζί;</span>
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto font-light">
              Επικοινωνήστε μαζί μας σήμερα για να συζητήσουμε τις ιδέες σας
              και να ξεκινήσουμε το επόμενο μεγάλο ψηφιακό βήμα.
            </p>
            <Link
              href="/estimate"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold text-lg rounded-lg transition-all duration-300 shadow-md"
            >
              Εκτίμηση έργου <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
