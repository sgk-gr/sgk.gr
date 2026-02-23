import { motion } from "framer-motion";
import TextReveal from "./TextReveal";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Dynamic Tech Background */}
      <div className="absolute inset-0 z-0">
        {/* Deep Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />

        {/* Glowing Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px), 
                              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
          }}
        />

        {/* Floating Particles/Glows */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-primary/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-64 sm:w-[500px] h-64 sm:h-[500px] bg-blue-500/10 rounded-full blur-[120px]"
        />

        {/* Software Development Focused Visual */}
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072"
          alt="Software Development and Coding"
          className="w-full h-full object-cover opacity-10 mix-blend-overlay"
          width="1920"
          height="1080"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-heading font-semibold tracking-wider uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Premium Digital Agency
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-heading font-bold leading-[0.9] mb-6 sm:mb-8 tracking-tighter flex flex-col items-center text-center">
            <TextReveal text="Χτίζουμε το" delay={0.0} />
            <span className="text-gradient drop-shadow-[0_0_30px_rgba(180,255,68,0.3)]">
              <TextReveal text="ψηφιακό μέλλον" delay={0.05} />
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed font-light px-2">
            Custom Eshops, Web Applications & Agentic AI λύσεις
            <br className="hidden md:block" />
            που μετατρέπουν την τεχνολογία σε <span className="text-foreground font-medium">κέρδος</span>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <a
            href="#contact"
            className="group relative px-8 sm:px-10 py-3.5 sm:py-4 bg-primary text-primary-foreground font-heading font-bold rounded-md transition-all hover:scale-105 active:scale-95 glow-border overflow-hidden text-sm sm:text-base"
            aria-label="Ξεκινήστε ένα νέο Project"
          >
            <span className="relative z-10">Ξεκινήστε ένα Project</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
          <a
            href="#services"
            className="px-8 sm:px-10 py-3.5 sm:py-4 border border-border text-foreground font-heading font-semibold rounded-md hover:bg-secondary transition-all hover:border-primary/50 text-sm sm:text-base"
          >
            Οι Υπηρεσίες μας
          </a>
        </motion.div>
      </div>

      {/* Futuristic Bottom Decor */}
      <div className="absolute bottom-0 left-0 right-0 h-[20vh] bg-gradient-to-t from-background to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_hsl(var(--primary))]" />
    </section>
  );
};

export default Hero;
