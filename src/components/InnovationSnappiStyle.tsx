"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function InnovationSnappiStyle() {
  return (
    <section className="w-full bg-[#111111] py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row relative items-center gap-12 md:gap-20">
          
          {/* Left Side: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 flex flex-col justify-center max-w-xl"
          >
            <h2 className="text-white text-3xl md:text-5xl font-light mb-8 tracking-wide leading-tight">
              Η καινοτομία είναι <br /> στο DNA μας
            </h2>
            
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              Προηγμένα πρωτόκολλα ασφαλείας, χρήση AI, διαδικασίες σε πραγματικό χρόνο και εξατομικευμένες ψηφιακές λύσεις δημιουργούν μια ψηφιακή εμπειρία με επίκεντρο εσένα. <span className="font-bold text-white">Αξιοποιούμε την τεχνολογία και καινοτομούμε</span> με στόχο να βελτιώσουμε την εμπειρία σου, κάνοντας κάθε ψηφιακή διαδικασία πιο απλή, ώστε να ανταποκρινόμαστε πάντα στις ανάγκες σου, που εξελίσσονται μαζί με εσένα.
            </p>
          </motion.div>

          {/* Right Side: 3D AI Icon */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 flex justify-center items-center relative h-[300px] md:h-[400px]"
          >
            <div className="relative w-full max-w-[300px] aspect-square flex justify-center items-center">
                {/* 3D Glassmorphic AI Icon Built with CSS */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="relative flex flex-col items-center"
                >
                  {/* Floating blue small square */}
                  <div className="absolute -top-4 -left-6 w-10 h-10 bg-[#0033cc] rounded-lg shadow-xl transform -rotate-12 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-lg"></div>
                  </div>
                  
                  {/* Glassmorphic Body */}
                  <div className="w-56 h-56 bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[32px] relative z-10 flex flex-col items-center justify-center overflow-hidden">
                    {/* Inner highlight for 3D glass effect */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent"></div>
                    
                    {/* AI DNA Spinner */}
                    <div className="relative z-20 flex flex-col gap-3.5" style={{ perspective: '800px' }}>
                      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div 
                          key={i}
                          animate={{ rotateY: [i * 30, i * 30 + 360] }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 5, 
                            ease: "linear",
                          }}
                          className="flex items-center justify-between w-28 h-5"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          {/* Left DNA Node */}
                          <div 
                            className="w-5 h-5 bg-[#0033cc] rounded-full shadow-[inset_-2px_-3px_6px_rgba(0,0,0,0.4),0_5px_10px_rgba(0,51,204,0.5)] border border-white/20"
                            style={{ transform: 'rotateY(0deg)' }} // Reset rotation so the shading looks consistent? Actually, keeping it rotating gives a dynamic look.
                          ></div>
                          
                          {/* DNA Rung (Glowing Tech) */}
                          <div className="flex-1 h-[3px] bg-[#4ade80] shadow-[0_0_12px_#4ade80]"></div>
                          
                          {/* Right DNA Node */}
                          <div 
                            className="w-5 h-5 bg-[#0033cc] rounded-full shadow-[inset_-2px_-3px_6px_rgba(0,0,0,0.4),0_5px_10px_rgba(0,51,204,0.5)] border border-white/20"
                          ></div>
                        </motion.div>
                      ))}
                    </div>
                    
                  </div>
                </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
