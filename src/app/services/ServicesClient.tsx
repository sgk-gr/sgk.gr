"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SectionDivider from "@/components/SectionDivider";
import Navbar from "@/components/Navbar";

const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function ServicesClient() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="w-full bg-[#f4f2ea] overflow-hidden pt-32">
      
      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-24 md:mb-32 mt-12 md:mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-light text-black mb-8 tracking-tighter">
            Ψηφιακές Λύσεις <br className="hidden md:block" />
            <span className="font-bold text-[#3b5bdb]">Επόμενης Γενιάς</span>
          </h1>
          <p className="text-black/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Στην SGK συνδυάζουμε τον προηγμένο προγραμματισμό με την τεχνητή νοημοσύνη (AI) για να δημιουργήσουμε λύσεις που εκτοξεύουν την επιχείρησή σου, με το μοντέλο Pay As You Grow.
          </p>
        </motion.div>
      </div>

      <SectionDivider leftColor="bg-[#3b5bdb]" rightColor="bg-[#4ade80]" />

      {/* --- Service 1: E-shops (Image Right, Black Box Left) --- */}
      <section className="w-full bg-[#fcfcfc] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse md:flex-row relative items-center">
            
            {/* Left Box */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full md:w-[45%] bg-[#111111] p-8 md:p-14 relative z-10 md:-mr-[10%] mt-[-40px] md:mt-0 shadow-2xl"
            >
              <h2 className="text-white text-3xl md:text-5xl font-light mb-8 leading-tight">
                Κατασκευή E-shop <br /> <span className="font-bold text-[#4ade80]">Νέας Γενιάς</span>
              </h2>
              
              <ul className="space-y-6 mb-12">
                <li className="flex items-start text-white/90 text-[15px] md:text-lg">
                  <span className="w-3 h-3 bg-[#4ade80] mr-4 shrink-0 mt-2"></span>
                  <span>WooCommerce & Headless E-commerce για απόλυτη ευελιξία και ταχύτητα.</span>
                </li>
                <li className="flex items-start text-white/90 text-[15px] md:text-lg">
                  <span className="w-3 h-3 bg-[#4ade80] mr-4 shrink-0 mt-2"></span>
                  <span><strong>&lt; 1s Load Time:</strong> Optimized κώδικας, caching και CDN για instant page loads.</span>
                </li>
                <li className="flex items-start text-white/90 text-[15px] md:text-lg">
                  <span className="w-3 h-3 bg-[#4ade80] mr-4 shrink-0 mt-2"></span>
                  <span><strong>100/100 PageSpeed:</strong> Core Web Vitals στο πράσινο κάθε φορά, χωρίς συμβιβασμούς.</span>
                </li>
                <li className="flex items-start text-white/90 text-[15px] md:text-lg">
                  <span className="w-3 h-3 bg-[#4ade80] mr-4 shrink-0 mt-2"></span>
                  <span>Custom Design & Checkouts βελτιστοποιημένα για Maximum Conversion.</span>
                </li>
              </ul>
              
              <Link 
                href="/kataskevi-eshop"
                className="inline-block bg-[#4ade80] text-black hover:bg-[#22c55e] transition-colors duration-300 font-bold py-4 px-10 rounded-sm shadow-lg w-full sm:w-auto text-lg text-center"
              >
                Μάθε περισσότερα
              </Link>
            </motion.div>

            {/* Right Image */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-[60%] relative h-[450px] md:h-[700px] z-0"
            >
              <Image 
                src="/images/services/eshop_greek_fixed_1782041166365.png" 
                alt="Headless E-commerce Solutions" 
                fill
                className="object-cover shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider leftColor="bg-[#4ade80]" rightColor="bg-pink-500" />

      {/* --- Service 2: Websites (Image Left, Blue Box Right) --- */}
      <section className="w-full bg-[#f4f2ea] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row relative items-center">
            
            {/* Left Image */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-[60%] relative h-[450px] md:h-[700px] z-0"
            >
              <Image 
                src="/images/services/web_apps_greek_1782041048059.png" 
                alt="Premium Web Design and Apps" 
                fill
                className="object-cover shadow-xl"
              />
            </motion.div>

            {/* Right Box */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full md:w-[45%] bg-[#3b5bdb] p-8 md:p-14 relative z-10 md:-ml-[10%] mt-[-40px] md:mt-0 shadow-2xl"
            >
              <h2 className="text-white text-3xl md:text-5xl font-light mb-8 leading-tight">
                Premium Web Design & <br /> <span className="font-bold">Custom Apps</span>
              </h2>
              
              <ul className="space-y-6 mb-12">
                <li className="flex items-start text-white/90 text-[15px] md:text-lg">
                  <span className="w-3 h-3 bg-pink-500 mr-4 shrink-0 mt-2"></span>
                  <span>Εταιρικά Sites που ξεχωρίζουν, σχεδιασμένα με σύγχρονα UI/UX patterns.</span>
                </li>
                <li className="flex items-start text-white/90 text-[15px] md:text-lg">
                  <span className="w-3 h-3 bg-pink-500 mr-4 shrink-0 mt-2"></span>
                  <span>Ολοκληρωμένα συστήματα κρατήσεων (Booking) για τουρισμό, ξενοδοχεία και υπηρεσίες.</span>
                </li>
                <li className="flex items-start text-white/90 text-[15px] md:text-lg">
                  <span className="w-3 h-3 bg-pink-500 mr-4 shrink-0 mt-2"></span>
                  <span>Custom Web Apps: Εφαρμογές CRM, ERP Integrations & Διαχειριστικά Dashboards.</span>
                </li>
                <li className="flex items-start text-white/90 text-[15px] md:text-lg">
                  <span className="w-3 h-3 bg-pink-500 mr-4 shrink-0 mt-2"></span>
                  <span>Απόλυτη Ασφάλεια: Enterprise Security με SSL, firewall και αυτοματοποιημένα backups.</span>
                </li>
              </ul>
              
              <Link 
                href="/kataskevi-istoselidon"
                className="inline-block bg-white text-[#3b5bdb] hover:bg-gray-100 transition-colors duration-300 font-bold py-4 px-10 rounded-sm shadow-lg w-full sm:w-auto text-lg text-center"
              >
                Μάθε περισσότερα
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      <SectionDivider leftColor="bg-pink-500" rightColor="bg-[#facc15]" />

      {/* --- Service 3: AI Agents (Image Right, Yellow Box Left) --- */}
      <section className="w-full bg-[#111111] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse md:flex-row relative items-center">
            
            {/* Left Box */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full md:w-[45%] bg-[#facc15] p-8 md:p-14 relative z-10 md:-mr-[10%] mt-[-40px] md:mt-0 shadow-2xl"
            >
              <h2 className="text-black text-3xl md:text-5xl font-light mb-8 leading-tight">
                <span className="font-bold">AI Agentic</span> Systems
              </h2>
              
              <ul className="space-y-6 mb-12">
                <li className="flex items-start text-black/80 text-[15px] md:text-lg">
                  <span className="w-3 h-3 bg-black mr-4 shrink-0 mt-2"></span>
                  <span><strong>AI Support Agents:</strong> Αυτοματοποιημένη εξυπηρέτηση 24/7 που εκπαιδεύεται στα δεδομένα της επιχείρησής σας.</span>
                </li>
                <li className="flex items-start text-black/80 text-[15px] md:text-lg">
                  <span className="w-3 h-3 bg-black mr-4 shrink-0 mt-2"></span>
                  <span><strong>Workflow Automation:</strong> AI που συνδέει εφαρμογές, ελέγχει email, εκδίδει παραστατικά και ενημερώνει CRM αυτόματα.</span>
                </li>
                <li className="flex items-start text-black/80 text-[15px] md:text-lg">
                  <span className="w-3 h-3 bg-black mr-4 shrink-0 mt-2"></span>
                  <span><strong>HR & Analytics:</strong> Αυτοματοποιημένο screening υποψηφίων, Onboarding και ανάλυση δεδομένων με φυσική γλώσσα.</span>
                </li>
              </ul>
              
              <Link 
                href="/ai-agents"
                className="inline-block bg-black text-[#facc15] hover:bg-gray-900 transition-colors duration-300 font-bold py-4 px-10 rounded-sm shadow-lg w-full sm:w-auto text-lg text-center"
              >
                Γνώρισε τους AI Agents
              </Link>
            </motion.div>

            {/* Right Image */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-[60%] relative h-[450px] md:h-[700px] z-0"
            >
              <Image 
                src="/images/services/ai_agent_greek_1782041015796.png" 
                alt="AI Agents for Business" 
                fill
                className="object-cover shadow-xl opacity-90"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider leftColor="bg-[#facc15]" rightColor="bg-cyan-400" />

      {/* --- Service 4: Marketing (Image Left, Black Box Right) --- */}
      <section className="w-full bg-[#fcfcfc] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row relative items-center">
            
            {/* Left Image */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-[60%] relative h-[450px] md:h-[700px] z-0"
            >
              <Image 
                src="/images/services/marketing_greek_1782041036846.png" 
                alt="Digital Marketing and SEO" 
                fill
                className="object-cover shadow-xl"
              />
            </motion.div>

            {/* Right Box */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full md:w-[45%] bg-[#111111] p-8 md:p-14 relative z-10 md:-ml-[10%] mt-[-40px] md:mt-0 shadow-2xl"
            >
              <h2 className="text-white text-3xl md:text-5xl font-light mb-8 leading-tight">
                Performance Marketing <br /> & <span className="font-bold text-cyan-400">SEO</span>
              </h2>
              
              <ul className="space-y-6 mb-12">
                <li className="flex items-start text-white/90 text-[15px] md:text-lg">
                  <span className="w-3 h-3 bg-cyan-400 mr-4 shrink-0 mt-2"></span>
                  <span><strong>SEO-Ready:</strong> Schema markup, sitemap και meta optimization (built-in από την αρχή).</span>
                </li>
                <li className="flex items-start text-white/90 text-[15px] md:text-lg">
                  <span className="w-3 h-3 bg-cyan-400 mr-4 shrink-0 mt-2"></span>
                  <span>Οργανική ανάπτυξη για κυριαρχία στην πρώτη σελίδα της Google.</span>
                </li>
                <li className="flex items-start text-white/90 text-[15px] md:text-lg">
                  <span className="w-3 h-3 bg-cyan-400 mr-4 shrink-0 mt-2"></span>
                  <span>Google Ads & Meta Ads Campaigns σχεδιασμένες με Data-driven στρατηγική.</span>
                </li>
                <li className="flex items-start text-white/90 text-[15px] md:text-lg">
                  <span className="w-3 h-3 bg-cyan-400 mr-4 shrink-0 mt-2"></span>
                  <span>Conversion Rate Optimization (CRO) για να μετατρέπεις περισσότερους επισκέπτες σε πελάτες.</span>
                </li>
              </ul>
              
              <Link 
                href="/estimate"
                className="inline-block bg-cyan-400 text-black hover:bg-[#22d3ee] transition-colors duration-300 font-bold py-4 px-10 rounded-sm shadow-lg w-full sm:w-auto text-lg text-center"
              >
                Ξεκίνα Τώρα
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      <SectionDivider leftColor="bg-cyan-400" rightColor="bg-[#3b5bdb]" />

    </main>

    {/* Final CTA - Outside main to avoid padding gaps with the footer */}
    <section className="w-full bg-[#3b5bdb] py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-light text-white mb-8 tracking-tight">
          Έτοιμοι να δημιουργήσουμε το επόμενο μεγάλο project σου;
        </h2>
        <p className="text-white/80 text-lg mb-12 max-w-2xl mx-auto">
          Επικοινώνησε μαζί μας για να συζητήσουμε τις ανάγκες σου. Με το <strong>Pay as you grow</strong> της SGK, η επιτυχία σου είναι και δική μας επιτυχία.
        </p>
        <Link 
          href="/estimate"
          className="inline-block bg-[#4ade80] text-black hover:bg-[#22c55e] transition-colors duration-300 font-bold py-4 px-12 rounded-sm shadow-xl text-lg hover:scale-105 transform text-center"
        >
          Δωρεάν Εκτίμηση Έργου
        </Link>
      </div>
    </section>

    <SectionDivider leftColor="bg-[#3b5bdb]" rightColor="bg-[#101010]" />
    <Footer />
    </div>
  );
}
