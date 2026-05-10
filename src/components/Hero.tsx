"use client";

import { motion } from "framer-motion";
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a] pt-20">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-90"
        >
          <source src="/sgkvideo.mp4" type="video/mp4" />
        </video>
        {/* Subtle Overlay for Readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl pt-12 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-heading font-normal leading-[0.95] tracking-tight mb-10">
              Modern <br />
              <span className="text-[#00d563] drop-shadow-[0_0_15px_rgba(0,213,99,0.3)]">
                commerce
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white max-w-lg mb-12 leading-relaxed font-light">
              Ενισχύουμε το ψηφιακό εμπόριο με AI-driven πλατφόρμες,
              επεκτάσιμες αγορές και καινοτόμες ψηφιακές εμπειρίες.
            </p>

            {/* Trusted By Section */}
            <div className="mt-20">
              <p className="text-[11px] text-white uppercase tracking-[0.2em] font-semibold mb-6">Μας εμπιστεύονται:</p>
              <div className="flex flex-wrap items-center gap-8 transition-all duration-500">
                {/* Real company names as logos */}
                <span className="text-lg font-bold text-white tracking-widest">SKINNERA</span>
                <span className="text-lg font-bold text-white tracking-tighter">KM-FIBER</span>
                <span className="text-lg font-bold text-white uppercase">REKRUA</span>
                <span className="text-lg font-bold text-white">H20</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Content - Glow Only (Bubble and Photo removed) */}
        <div className="flex-1 relative w-full lg:w-auto h-[400px] lg:h-[600px] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative"
          >
            {/* Bottom Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#00d563]/20 blur-[100px] rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Decorative Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
};

export default Hero;
