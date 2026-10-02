"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const slides = [
  {
    title: (
      <>
        Αυτόνομοι AI Agents <br /> Για Επιχειρήσεις <br /> Στην Ελλάδα.
      </>
    ),
    description: "Ηγετική εταιρεία στην Ελλάδα για Custom AI Agents & Agentic AI. Αυτοματοποιήστε ERP (SoftOne, Entersoft), τηλεφωνικά κέντρα Voice AI, διαχείριση emails, μαζική ανάλυση PDFs και ψηφιακούς υπαλλήλους 24/7.",
    buttonText: "Ανακαλύψτε τους AI Agents",
    buttonLink: "/ai-agents",
    image: "/hero_slide_2.webp"
  },
  {
    title: (
      <>
        Live Video AI Avatars <br /> 24/7 Ψηφιακός Βοηθός <br /> Σε Ζωντανή Κλήση.
      </>
    ),
    description: "Η νέα εποχή στην εξυπηρέτηση: Διαδραστικός AI βοηθός με ζωντανό video call πρόσωπο με πρόσωπο και φυσική ομιλία. Απαντάει άμεσα στις ερωτήσεις των πελατών σας και ολοκληρώνει εργασίες 24/7.",
    buttonText: "Δοκιμάστε το Live Demo",
    buttonLink: "/order-ai-agent",
    image: "/images/hero_ai_video_agent.webp"
  },
  {
    title: (
      <>
        Κατασκευή Ιστοσελίδας <br /> Για Ι.Κ.Ε. & ΓΕΜΗ <br /> Σε 24 Ώρες.
      </>
    ),
    description: "Ολοκληρωμένη εταιρική ιστοσελίδα για τη νέα σας Ι.Κ.Ε. με 100% συμμόρφωση στις προδιαγραφές ΓΕΜΗ. Περιλαμβάνει .gr domain για 2 έτη, ταχύτατο hosting, εταιρικό email, SSL και δημοσίευση ισολογισμών μόνο με 150€.",
    buttonText: "Δες την προσφορά (150€)",
    buttonLink: "/ike-offer",
    image: "/hero_slide_4.webp"
  },
  {
    title: (
      <>
        Custom Web Apps <br /> & Συστήματα <br /> Υψηλών Απαιτήσεων.
      </>
    ),
    description: "Ανάπτυξη εξειδικευμένων web εφαρμογών, portals διαχείρισης και SaaS πλατφορμών σε Next.js & React. Απόλυτη ταχύτητα, αξιοπιστία και ασφάλεια σχεδιασμένα για τις δικές σας ανάγκες.",
    buttonText: "Ανακάλυψε τις λύσεις μας",
    buttonLink: "/web-development",
    image: "/hero_slide_3.webp"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const slideVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 50 : -50,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -50 : 50,
      transition: { duration: 0.6, ease: "easeIn" }
    })
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, delay: 0.2, ease: "easeOut" } 
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row bg-white lg:overflow-hidden">
      
      {/* Right Image (Background on Mobile, 50% on Desktop) */}
      <div className="absolute top-0 left-0 w-full h-full lg:w-1/2 lg:right-0 lg:left-auto lg:top-0 bg-gray-100 overflow-hidden z-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={`image-${currentSlide}`}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={slides[currentSlide].image}
              alt="SGK Digital Hero"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
              className="object-cover object-center"
              priority={currentSlide === 0}
            />
            {/* Dark overlay for mobile readability, light overlay for desktop */}
            <div className="absolute inset-0 bg-black/60 lg:bg-black/5" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 hidden md:flex">
          <button 
            onClick={prevSlide}
            aria-label="Προηγούμενο slide"
            className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors border border-white/40 shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            aria-label="Επόμενο slide"
            className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors border border-white/40 shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Progress Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 1 : -1);
                setCurrentSlide(index);
              }}
              aria-label={`Slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
            />
          ))}
        </div>
      </div>

      {/* Left Content (Overlay on Mobile, 50% on Desktop) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center pt-32 pb-40 lg:pb-16 px-8 lg:pl-[110px] lg:pr-16 xl:pl-[142px] xl:pr-24 z-10 bg-transparent lg:bg-white relative min-h-screen lg:min-h-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`text-${currentSlide}`}
            custom={direction}
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-xl"
          >
            {/* Big Brand Logo */}
            <div className="mb-6 lg:mb-8">
              <span className="font-heading font-bold text-6xl lg:text-7xl xl:text-8xl tracking-tighter text-white lg:text-black drop-shadow-md lg:drop-shadow-none">
                sgk<span className="text-[#3b5bdb]">.</span>
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-heading font-medium tracking-tight leading-[1.05] mb-8 text-white lg:text-black drop-shadow-md lg:drop-shadow-none">
              {slides[currentSlide].title}
            </h1>
            
            <p className="text-lg text-white/90 lg:text-gray-600 mb-10 leading-relaxed font-body max-w-md drop-shadow-sm lg:drop-shadow-none">
              {slides[currentSlide].description}
            </p>

            <Link
              href={slides[currentSlide].buttonLink}
              className="inline-flex items-center justify-center bg-[#3b5bdb] hover:bg-[#2b4bba] text-white font-medium px-8 py-4 rounded-lg transition-all duration-300 text-lg shadow-sm"
            >
              {slides[currentSlide].buttonText}
            </Link>
            
          </motion.div>
        </AnimatePresence>

        {/* Trusted By Section (Static at bottom) */}
        <div className="absolute bottom-8 left-8 lg:left-[110px] xl:left-[142px]">
          <p className="text-[10px] text-white/60 lg:text-gray-400 tracking-widest font-bold mb-3">Μας εμπιστεύονται:</p>
          <div className="flex flex-wrap items-center gap-5 opacity-80 lg:opacity-50 grayscale">
            <span className="text-xs font-bold text-white lg:text-black tracking-widest font-heading">Skinnera</span>
            <span className="text-xs font-bold text-white lg:text-black tracking-tighter font-heading">KM-Fiber</span>
            <span className="text-xs font-bold text-white lg:text-black font-heading">Rekrua</span>
            <span className="text-xs font-bold text-white lg:text-black font-heading">H2O</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
