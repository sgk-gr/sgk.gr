"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useInView } from "framer-motion";

const projects = [
  {
    title: "Lemon tree 1 Paros",
    category: "Booking System",
    description: "Κατασκευή custom ιστοσελίδας και συστήματος κρατήσεων (booking) για ενοικιαζόμενα studios & apartments στην Πάρο (Κυκλάδες).",
    tags: ["Booking System", "Airbnb", "Paros", "Tourism"],
    link: "https://lemontree1.gr/",
  },
  {
    title: "vaiacharms.gr",
    category: "Exclusive Jewelry Boutique",
    description: "Κατασκευή Headless e-shop νέας γενιάς για exclusive κοσμήματα. Υλοποίηση με custom React frontend για ασύγκριτη ταχύτητα φόρτωσης, με πλήρη διασύνδεση στο WooCommerce backend για τη διαχείριση των παραγγελιών.",
    tags: ["React Frontend", "WooCommerce", "Headless E-commerce"],
    link: "/case-study/vaia-charms",
  },
  {
    title: "KM-FIBER",
    category: "Telecom Operations Platform",
    description: "Ολοκληρωμένο σύστημα διαχείρισης οπτικών ινών για συνεργάτη της Cosmote. Καταχώρηση πελατών Cosmote/Vodafone, οργάνωση συνεργείων με live tracking, real-time σύστημα βλαβών, AI αναγνώριση φωτογραφιών αυτοψιών και live κλείσιμο συνδέσεων.",
    tags: ["React", "Supabase", "PostgreSQL", "Google Maps API", "AI Vision", "Real-time"],
    link: "/case-study/km-fiber",
  },
  {
    title: "Sigmalabs AI",
    category: "Agentic AI",
    description: "Το πρώτο παγκοσμίως Agentic AI για e-commerce που ελέγχει και εκτελεί εργασίες σε WooCommerce και Shopify.",
    tags: ["Agentic AI", "WooCommerce", "Shopify", "React", "OpenAI", "Stripe"],
    link: "/case-study/sigmalabs-ai",
  },
  {
    title: "Skinnera IKE",
    category: "Business Services",
    description: "Πλατφόρμα διαχείρισης συνεργατών με σύστημα επιβράβευσης, real-time notifications και mobile app για tracking αιτήσεων ΕΣΠΑ/ΔΥΠΑ.",
    tags: ["Flutter", "Firebase", "Android", "OneSignal", "ΕΣΠΑ"],
    link: "/case-study/skinnera",
  },
  {
    title: "Harmony Apartments",
    category: "Booking System",
    description: "Ιστοσελίδα και custom διαχειριστικό κρατήσεων & τιμών με αυτόματο συγχρονισμό σε Booking, Airbnb, VRBO, TripAdvisor κ.α.",
    tags: ["Website", "Booking System", "Channel Manager", "Price Management", "V1"],
    link: "/case-study/harmony-apartments",
  },
  {
    title: "yolo8",
    category: "Booking & AI",
    description: "Smart booking system με AI customer support για ενοικιάσεις αυτοκινήτων, Stripe πληρωμές και VPS hosting.",
    tags: ["React", "AI Agent", "Booking System", "Stripe", "PostgreSQL"],
    link: "/case-study/yolo8",
  },
  {
    title: "Glavinas Energy Solutions",
    category: "Landing Page & SEO",
    description: "Γρήγορο landing page με SEO και Google Business για ενεργειακές λύσεις, με focus στο local lead generation.",
    tags: ["React", "SEO", "Google Business Profile", "VPS", "Tailwind CSS"],
    link: "/case-study/energy-solutions",
  },
  {
    title: "Rekrua",
    category: "AI HR Platform",
    description: "AI HR πλατφόρμα με candidate rating system για έξυπνο hiring, intelligent screening και GPT-5 integration.",
    tags: ["React", "Supabase", "AI", "GPT-5.2 Mini", "PostgreSQL"],
    link: "/case-study/rekrua",
  },
  {
    title: "Live Tour Guide (LTG)",
    category: "Mobile App",
    description: "Mobile app για private taxi tours στην Αθήνα με real-time tracking, Stripe πληρωμές και push notifications.",
    tags: ["Flutter", "Firebase", "Stripe", "Android", "Realtime DB"],
    link: "/case-study/live-tour-guide",
  },
  {
    title: "EvolisAI",
    category: "AI / Tourism / RE",
    description: "Web app για δημιουργία AI agents για customer support σε τουρισμό και real estate με Flutter και Firebase.",
    tags: ["Flutter", "Firebase", "AI Agents", "NoSQL", "VPS"],
    link: "/case-study/evolis-ai",
  },
  {
    title: "Super App",
    category: "Consumer App",
    description: "Mobile app με προσφορές από γνωστές αλυσίδες σούπερ μάρκετ (Μασούτης, Σκλαβενίτης κ.α.) με smart notifications.",
    tags: ["Flutter", "Firebase", "NoSQL", "Notifications", "Video Player"],
    link: "/case-study/super-app",
  },
];

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const CardWrapper = project.link ? Link : "div";
  const wrapperProps = project.link 
    ? { 
        href: project.link,
        ...(project.link.startsWith('http') ? { target: "_blank", rel: "noopener noreferrer" } : {})
      } 
    : {};

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative"
    >
      <CardWrapper
        {...(wrapperProps as any)}
        className={`group p-7 rounded-lg bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-500 flex flex-col h-full overflow-hidden ${project.link ? "cursor-pointer" : ""}`}
      >
        {/* Spotlight Effect */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300 z-10"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, hsl(var(--primary) / 0.15), transparent 80%)`,
          }}
        />

        <span className="text-xs font-heading font-medium text-primary uppercase tracking-wider mb-3 relative z-20">
          {project.category}
        </span>
        <h3 className="text-xl font-heading font-semibold mb-3 flex items-center gap-2 relative z-20">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1 relative z-20">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 relative z-20">
          {project.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
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
    <section id="portfolio" className="py-16 sm:py-28 relative">
      {/* Background glow for section */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3 px-1 border-l-2 border-primary">
            Portfolio
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            Δουλειές μας
          </h2>
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

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-secondary/50 border border-border">
            <Counter value={50} />
            <span className="text-lg font-heading font-medium text-muted-foreground">
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
    <span ref={ref} className="text-3xl font-heading font-bold text-primary">
      +{count}
    </span>
  );
};

export default Portfolio;
