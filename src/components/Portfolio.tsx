"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Lemon tree 1 Paros",
    category: "Booking System",
    description: "Κατασκευή custom ιστοσελίδας και συστήματος κρατήσεων (booking) για ενοικιαζόμενα studios & apartments στην Πάρο (Κυκλάδες).",
    tags: ["Booking System", "Airbnb", "Paros"],
    link: "/case-study/lemon-tree-paros",
    websiteLink: "https://lemontree1.gr/",
  },
  {
    title: "vaiacharms.gr",
    category: "Exclusive Jewelry Boutique",
    description: "Κατασκευή Headless e-shop νέας γενιάς για exclusive κοσμήματα. Υλοποίηση με custom React frontend για ασύγκριτη ταχύτητα φόρτωσης.",
    tags: ["React Frontend", "WooCommerce", "E-commerce"],
    link: "/case-study/vaia-charms",
    websiteLink: "https://www.vaiacharms.gr/",
  },
  {
    title: "diador.eu",
    category: "Headless E-commerce",
    description: "Κατασκευή Headless e-shop νέας γενιάς για ρούχα εργασίας. Υλοποίηση με custom React frontend για μέγιστη ταχύτητα φόρτωσης.",
    tags: ["React Frontend", "WooCommerce", "E-commerce"],
    link: "/case-study/diador",
    websiteLink: "https://diador.eu/",
  },
  {
    title: "toptravelgreece.com",
    category: "Travel & Booking Platform",
    description: "Σύγχρονη πλατφόρμα κρατήσεων και παρουσίασης private/shared εκδρομών και υπηρεσιών ενοικίασης αυτοκινήτων στα Χανιά.",
    tags: ["React", "Booking System", "Car Rental"],
    link: "/case-study/top-travel-greece",
    websiteLink: "https://toptravelgreece.com/",
  },
  {
    title: "KM-FIBER",
    category: "Telecom Operations Platform",
    description: "Ολοκληρωμένο σύστημα διαχείρισης οπτικών ινών για συνεργάτη της Cosmote. Live tracking, AI αναγνώριση φωτογραφιών.",
    tags: ["React", "Supabase", "AI Vision"],
    link: "/case-study/km-fiber",
  },
  {
    title: "High Travel",
    category: "Travel Platform & React Admin",
    description: "Σύγχρονη ταξιδιωτική πλατφόρμα με Next.js 15 και custom React διαχειριστικό πάνελ για πακέτα, προσφορές, posters και κρατήσεις.",
    tags: ["Next.js", "React Admin", "Travel & Tourism"],
    link: "/case-study/high-travel",
    websiteLink: "https://www.hightravel.gr/",
  },
  {
    title: "ELV8 Energy Drink",
    category: "Headless E-commerce & Brand",
    description: "Η νέα εποχή στην ενέργεια. Το επίσημο ηλεκτρονικό κατάστημα (E-shop) της ELV8 Energy Drink — 0% Ζάχαρη, 200mg Φυσική Καφεΐνη, Ηλεκτρολύτες & Βιταμίνες για μέγιστη απόδοση.",
    tags: ["Headless E-shop", "Next.js", "WooCommerce", "Energy Drink"],
    link: "https://www.elv8now.com/",
    websiteLink: "https://www.elv8now.com/",
  },
  {
    title: "Sellas Country Houses IKE",
    category: "ΓΕΜΗ & Corporate Website ΙΚΕ",
    description: "Κατασκευή σύγχρονης εταιρικής ιστοσελίδας & ψηφιακής πλατφόρμας δημοσιότητας ΓΕΜΗ για τη SELLAS COUNTRY HOUSES ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε., με SSL ασφάλεια και αυτόματη διασύνδεση δεδομένων ΓΕΜΗ.",
    tags: ["ΓΕΜΗ Compliance", "Next.js", "Hospitality", "SSL"],
    link: "https://www.sellascountryhouses.gr/",
    websiteLink: "https://www.sellascountryhouses.gr/",
  },
  {
    title: "PNP Constructions IKE",
    category: "ΓΕΜΗ & Corporate Website ΙΚΕ",
    description: "Κατασκευή εταιρικής ιστοσελίδας & ψηφιακής πλατφόρμας δημοσιότητας ΓΕΜΗ για την PNP CONSTRUCTIONS ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε. (Άρθρο 47 §2 Ν. 4072/2012) με πλήρη συμμόρφωση GDPR.",
    tags: ["ΓΕΜΗ Compliance", "Constructions", "Next.js", "SSL"],
    link: "https://www.pnpconstructions.com/",
    websiteLink: "https://www.pnpconstructions.com/",
  },
  {
    title: "MIMI AND NONI IKE",
    category: "ΓΕΜΗ & Corporate Website ΙΚΕ",
    description: "Κατασκευή εταιρικής ιστοσελίδας & ψηφιακής πλατφόρμας δημοσιότητας ΓΕΜΗ για την MIMI AND NONI ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε. (Άρθρο 47 §2 Ν. 4072/2012).",
    tags: ["ΓΕΜΗ Compliance", "Next.js", "SSL", "Corporate Website"],
    link: "https://www.miminoni.com/",
    websiteLink: "https://www.miminoni.com/",
  },
  {
    title: "Sigmalabs AI",
    category: "Agentic AI",
    description: "Το πρώτο παγκοσμίως Agentic AI για e-commerce που ελέγχει και εκτελεί εργασίες σε WooCommerce και Shopify.",
    tags: ["Agentic AI", "OpenAI", "E-commerce"],
    link: "/case-study/sigmalabs-ai",
    websiteLink: "https://sigmalabs.gr/",
  },
];

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const CardWrapper = project.link ? Link : "div";
  const wrapperProps = project.link
    ? {
      href: project.link,
      ...(project.link.startsWith('http') ? { target: "_blank", rel: "noopener noreferrer" } : {})
    }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative h-full"
    >
      <CardWrapper
        {...(wrapperProps as any)}
        className={`group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col h-full overflow-hidden ${project.link ? "cursor-pointer" : ""}`}
      >
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-heading font-bold text-[#4ade80] uppercase tracking-wider bg-[#4ade80]/10 px-3 py-1 rounded-full">
            {project.category}
          </span>
          <ArrowUpRight size={20} className="text-gray-500 group-hover:text-white transition-colors" />
        </div>
        
        <h3 className="text-2xl font-heading font-bold mb-3 text-white group-hover:text-[#4ade80] transition-colors">
          {project.title}
        </h3>
        
        <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1 group-hover:text-gray-300 transition-colors">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-bold bg-white/10 text-white rounded-xl"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardWrapper>
    </motion.div>
  );
};

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-24 bg-[#111111] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="font-heading font-bold text-xs tracking-[0.2em] uppercase mb-4 text-[#facc15]">
              Portfolio
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white">
              Δουλειές μας
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#facc15] transition-colors"
          >
            Δείτε όλα τα projects <ArrowUpRight size={16} />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/5 border border-white/10 shadow-lg">
            <Counter value={50} />
            <span className="text-lg font-heading font-bold text-gray-300">
              ακόμα ολοκληρωμένα projects
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Counter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-4xl font-heading font-black text-[#4ade80]">
      +{count}
    </span>
  );
};

export default Portfolio;
