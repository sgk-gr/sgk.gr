"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SectionDivider from "@/components/SectionDivider";
import Navbar from "@/components/Navbar";

// Dynamically import the Footer
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

// ----------------------------------------------------
// DATA: FEATURED PROJECTS (Top 4)
// ----------------------------------------------------
const featuredProjects = [
  {
    title: "KM-FIBER",
    subtitle: "Telecom Operations Platform",
    description: "Ολοκληρωμένο σύστημα διαχείρισης οπτικών ινών για συνεργάτη της Cosmote. Καταχώρηση πελατών Cosmote/Vodafone, οργάνωση συνεργείων με live tracking, real-time σύστημα βλαβών, AI αναγνώριση φωτογραφιών αυτοψιών και live κλείσιμο συνδέσεων.",
    tags: ["React", "Supabase", "PostgreSQL", "Google Maps API", "AI Vision", "Real-time"],
    accentColor: "bg-[#3b5bdb]",
    textColor: "text-[#3b5bdb]",
    hoverBg: "hover:bg-[#2e4aa8]",
    image: "/images/solutions/unsplash_web.jpg", 
    link: "/case-study/km-fiber",
    badge: "Enterprise Platform"
  },
  {
    title: "Sigmalabs AI",
    subtitle: "Agentic AI",
    description: "Το πρώτο παγκοσμίως Agentic AI για e-commerce που ελέγχει και εκτελεί εργασίες σε WooCommerce και Shopify.",
    tags: ["Agentic AI", "WooCommerce", "Shopify", "React", "OpenAI", "Stripe"],
    accentColor: "bg-[#a855f7]",
    textColor: "text-[#a855f7]",
    hoverBg: "hover:bg-[#9333ea]",
    image: "/screen.png", 
    link: "/case-study/sigmalabs-ai",
    badge: "AI Innovation",
    reversed: true
  },
  {
    title: "Top Travel Greece",
    subtitle: "toptravelgreece.com",
    description: "Σύγχρονη πλατφόρμα κρατήσεων και παρουσίασης private/shared εκδρομών και υπηρεσιών ενοικίασης αυτοκινήτων για το κορυφαίο ταξιδιωτικό γραφείο στα Χανιά. Υλοποίηση με διαδραστικό Vibe Quiz.",
    tags: ["React", "Tailwind CSS", "Booking System", "Car Rental", "Crete Tourism"],
    accentColor: "bg-[#facc15]",
    textColor: "text-[#eab308]",
    hoverBg: "hover:bg-[#eab308]",
    image: "/images/solutions/unsplash_marketing.jpg", 
    link: "/case-study/top-travel-greece",
    badge: "Travel & Booking"
  },
  {
    title: "Vaia Charms",
    subtitle: "vaiacharms.gr",
    description: "Κατασκευή Headless e-shop νέας γενιάς για exclusive κοσμήματα. Υλοποίηση με custom React frontend για ασύγκριτη ταχύτητα φόρτωσης, με πλήρη διασύνδεση στο WooCommerce backend για τη διαχείριση των παραγγελιών.",
    tags: ["React Frontend", "WooCommerce", "Headless E-commerce"],
    accentColor: "bg-[#4ade80]",
    textColor: "text-[#22c55e]",
    hoverBg: "hover:bg-[#22c55e]",
    image: "/images/solutions/unsplash_eshop.jpg", 
    link: "/case-study/vaia-charms",
    badge: "Exclusive E-Commerce",
    reversed: true
  }
];

// ----------------------------------------------------
// DATA: GRID PROJECTS (The rest 11)
// ----------------------------------------------------
const gridProjects = [
  {
    title: "MIMI AND NONI IKE",
    category: "ΓΕΜΗ & Corporate Website ΙΚΕ",
    description: "Κατασκευή εταιρικής ιστοσελίδας & ψηφιακής πλατφόρμας δημοσιότητας ΓΕΜΗ για την MIMI AND NONI ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε. (Άρθρο 47 §2 Ν. 4072/2012).",
    tags: ["ΓΕΜΗ Compliance", "Next.js", "SSL", "Corporate Website"],
    image: "/images/solutions/unsplash_web.jpg",
    link: "https://www.miminoni.com/",
  },
  {
    title: "Lyroudis Consulting Services",
    category: "ΓΕΜΗ & Corporate Website ΙΚΕ",
    description: "Κατασκευή εταιρικής ιστοσελίδας & ψηφιακής πλατφόρμας δημοσιότητας ΓΕΜΗ / Ισολογισμών για τη LYROUDIS CONSULTING SERVICES Μ.Ι.Κ.Ε. (Άρθρο 47 §2 Ν. 4072/2012).",
    tags: ["ΓΕΜΗ Compliance", "Ισολογισμοί PDF", "Next.js", "SSL"],
    image: "/images/solutions/unsplash_web.jpg",
    link: "/case-study/lyroudis",
  },
  {
    title: "High Travel",
    category: "Travel Platform & React Admin",
    description: "Σύγχρονη ταξιδιωτική πλατφόρμα με Next.js 15, φίλτρα προορισμών & custom React διαχειριστικό πάνελ για πακέτα, προσφορές, posters και κρατήσεις.",
    tags: ["Next.js", "React Admin", "Travel", "Agrio"],
    image: "/images/solutions/unsplash_marketing.jpg",
    link: "/case-study/high-travel",
  },
  {
    title: "Lemon tree 1 Paros",
    category: "Booking System",
    description: "Κατασκευή custom ιστοσελίδας και συστήματος κρατήσεων (booking) για ενοικιαζόμενα studios & apartments στην Πάρο (Κυκλάδες).",
    tags: ["Airbnb", "Paros", "Tourism"],
    image: "/images/solutions/unsplash_web.jpg",
    link: "/case-study/lemon-tree-paros",
  },
  {
    title: "diador.eu",
    category: "Headless E-commerce",
    description: "Κατασκευή Headless e-shop νέας γενιάς για ρούχα εργασίας και διαφημιστικά είδη. React frontend για μέγιστη ταχύτητα φόρτωσης.",
    tags: ["React Frontend", "WooCommerce", "Headless"],
    image: "/images/solutions/unsplash_eshop.jpg",
    link: "/case-study/diador",
  },
  {
    title: "Skinnera IKE",
    category: "Business Services",
    description: "Πλατφόρμα διαχείρισης συνεργατών με σύστημα επιβράβευσης, real-time notifications και mobile app για tracking αιτήσεων ΕΣΠΑ/ΔΥΠΑ.",
    tags: ["Flutter", "Firebase", "Android", "ΕΣΠΑ"],
    image: "/images/solutions/unsplash_marketing.jpg",
    link: "/case-study/skinnera",
  },
  {
    title: "Harmony Apartments",
    category: "Booking System",
    description: "Ιστοσελίδα και custom διαχειριστικό κρατήσεων & τιμών με αυτόματο συγχρονισμό σε Booking, Airbnb, VRBO, TripAdvisor κ.α.",
    tags: ["Channel Manager", "Price Management", "V1"],
    image: "/screen.png",
    link: "/case-study/harmony-apartments",
  },
  {
    title: "yolo8",
    category: "Booking & AI",
    description: "Smart booking system με AI customer support για ενοικιάσεις αυτοκινήτων, Stripe πληρωμές και VPS hosting.",
    tags: ["React", "AI Agent", "Stripe", "PostgreSQL"],
    image: "/images/solutions/unsplash_web.jpg",
    link: "/case-study/yolo8",
  },
  {
    title: "Glavinas Energy",
    category: "Landing Page & SEO",
    description: "Γρήγορο landing page με SEO και Google Business για ενεργειακές λύσεις, με focus στο local lead generation.",
    tags: ["React", "SEO", "Google Business Profile", "Tailwind"],
    image: "/images/solutions/unsplash_marketing.jpg",
    link: "/case-study/energy-solutions",
  },
  {
    title: "Rekrua",
    category: "AI HR Platform",
    description: "AI HR πλατφόρμα με candidate rating system για έξυπνο hiring, intelligent screening και GPT-5 integration.",
    tags: ["React", "Supabase", "GPT-5.2 Mini", "PostgreSQL"],
    image: "/images/solutions/unsplash_eshop.jpg",
    link: "/case-study/rekrua",
  },
  {
    title: "Live Tour Guide",
    category: "Mobile App",
    description: "Mobile app για private taxi tours στην Αθήνα με real-time tracking, Stripe πληρωμές και push notifications.",
    tags: ["Flutter", "Firebase", "Stripe", "Realtime DB"],
    image: "/screen.png",
    link: "/case-study/live-tour-guide",
  },
  {
    title: "EvolisAI",
    category: "AI / Tourism / RE",
    description: "Web app για δημιουργία AI agents για customer support σε τουρισμό και real estate με Flutter και Firebase.",
    tags: ["Flutter", "Firebase", "AI Agents", "NoSQL"],
    image: "/images/solutions/unsplash_web.jpg",
    link: "/case-study/evolis-ai",
  },
  {
    title: "Super App",
    category: "Consumer App",
    description: "Mobile app με προσφορές από γνωστές αλυσίδες σούπερ μάρκετ (Μασούτης, Σκλαβενίτης κ.α.) με smart notifications.",
    tags: ["Flutter", "Firebase", "Notifications", "Video Player"],
    image: "/images/solutions/unsplash_marketing.jpg",
    link: "/case-study/super-app",
  },
  {
    title: "ΚΑΒΕ Α.Ε. Καστανίδης",
    category: "WooCommerce E-shop",
    description: "Κατασκευή καθαρού WordPress & WooCommerce e-shop για την εταιρεία εμπορίας ειδών υγιεινής και θέρμανσης.",
    tags: ["WordPress", "WooCommerce", "Custom Theme"],
    image: "/images/solutions/unsplash_eshop.jpg",
    link: "/case-study/kastanidis",
  }
];

export default function PortfolioClient() {
  return (
    <div className="bg-[#f4f2ea] min-h-screen text-black font-sans selection:bg-[#3b5bdb] selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-32 flex flex-col items-center justify-center text-center overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto px-4 z-10"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-black">
              Έργα που <span className="text-[#3b5bdb]">Ξεχωρίζουν</span>
            </h1>
            <p className="text-xl md:text-2xl text-black/70 max-w-3xl mx-auto font-light leading-relaxed">
              Ανακαλύψτε πώς βοηθάμε κορυφαίες επιχειρήσεις να μετασχηματιστούν ψηφιακά. Από Headless E-shops και AI Platforms μέχρι Custom Web Portals.
            </p>
          </motion.div>
        </section>

        <SectionDivider />

        {/* FEATURED PROJECTS (ALTERNATING SECTIONS) */}
        <div className="w-full bg-[#f4f2ea]">
          {featuredProjects.map((project, index) => (
            <section key={index} className={`w-full py-20 ${project.reversed ? 'bg-white' : 'bg-[#f4f2ea]'}`}>
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-start gap-8">
                  
                  {/* Text Content */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="w-full flex flex-col justify-center space-y-6 z-10"
                  >
                    <div className={`${project.textColor} font-bold text-sm tracking-widest uppercase mb-3`}>
                      {project.badge}
                    </div>
                    <div>
                      <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-2">
                        {project.title}
                      </h2>
                      <p className={`text-xl font-medium ${project.textColor}`}>
                        {project.subtitle}
                      </p>
                    </div>
                    <p className="text-black/80 text-lg font-light leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="pt-2 text-sm text-gray-500 font-medium">
                      {project.tags.join(" • ")}
                    </div>

                    <div className="pt-6 flex gap-4">
                      <Link 
                        href={project.link}
                        className={`${project.accentColor} ${project.textColor === 'text-[#3b5bdb]' || project.textColor === 'text-[#a855f7]' ? 'text-white' : 'text-black'} ${project.hoverBg} transition-colors duration-300 font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-2 w-fit`}
                      >
                        Case Study <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </motion.div>

                </div>
              </div>
            </section>
          ))}
        </div>

        <SectionDivider />

        {/* PORTFOLIO GRID SECTION (11 PROJECTS) */}
        <section className="w-full py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Περισσότερα Έργα</h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Εξερευνήστε μια συλλογή από εντυπωσιακά projects που δημιουργήσαμε για τους πελάτες μας, καλύπτοντας κάθε ψηφιακή ανάγκη.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridProjects.map((project, index) => (
                <Link
                  key={index}
                  href={project.link}
                  className="block cursor-pointer group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-[#f4f2ea] rounded-2xl border border-gray-200 hover:border-gray-400 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="text-[#3b5bdb] text-xs font-bold uppercase tracking-wider mb-2">{project.category}</div>
                      <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-[#3b5bdb] transition-colors">{project.title}</h3>
                      <p className="text-black/70 text-base font-light leading-relaxed mb-6 flex-grow">
                        {project.description}
                      </p>
                      
                      <div className="mt-auto pt-6 border-t border-gray-250 text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                        {project.tags.join(" • ")}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Final CTA */}
      <section className="w-full bg-[#facc15] py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-8">
            Θέλετε να είστε το επόμενο Success Story;
          </h2>
          <p className="text-xl text-black/80 mb-10 font-medium">
            Επικοινωνήστε μαζί μας σήμερα για να συζητήσουμε τις ιδέες σας και να δημιουργήσουμε κάτι μοναδικό.
          </p>
          <Link 
            href="/estimate"
            className="inline-block bg-black text-white hover:bg-gray-900 transition-colors duration-300 font-bold py-4 px-10 rounded-full text-lg shadow-xl"
          >
            Ξεκινήστε το Project Σας
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
