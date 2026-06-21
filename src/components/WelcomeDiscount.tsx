"use client";

import React from "react";
import { motion } from "framer-motion";

export default function WelcomeDiscount() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-white relative">
      {/* Top decorative lines */}
      <div className="absolute top-0 left-0 w-full h-4">
        <div className="absolute top-0 left-0 w-[55%] h-2 bg-[#4ade80]"></div>
        <div className="absolute top-2 left-[55%] w-[45%] h-2 bg-[#facc15]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative mt-4">
        {/* Top-left yellow square */}
        <div className="absolute -top-3 left-[30%] w-4 h-4 bg-[#facc15] z-0 hidden md:block shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
        {/* Bottom-left yellow square */}
        <div className="absolute -bottom-3 left-2 w-4 h-4 bg-[#facc15] z-0 hidden md:block shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>

        <div 
          className="bg-[#3b5bdb] w-full flex flex-col md:flex-row items-stretch relative z-10 shadow-2xl overflow-hidden border border-[#3b5bdb]"
        >
          {/* Left section: Welcome Rewards */}
          <div className="flex flex-col justify-center shrink-0 pl-6 md:pl-10 py-8 relative">
            <div className="bg-[#facc15] self-start px-3 py-1 mb-1">
              <span className="text-black font-black text-xs md:text-sm tracking-widest uppercase">Welcome</span>
            </div>
            <div className="bg-[#111111] self-start px-5 py-2 -ml-4 relative z-10 shadow-md">
              <h2 className="text-white font-black text-3xl md:text-5xl uppercase tracking-wide">Rewards</h2>
            </div>
          </div>

          {/* Middle section: Text */}
          <div className="flex-1 flex flex-col justify-center px-6 md:px-10 py-6 md:py-8 border-y md:border-y-0 md:border-l md:border-r border-white/20 md:mx-6">
            <h3 className="text-white font-bold text-xl md:text-2xl leading-tight mb-2">
              Οι νέοι πελάτες μας κερδίζουν αμέσως 150€ έκπτωση!
            </h3>
            <p className="text-white/80 text-sm md:text-base">
              Για όποιο project (E-shop, Web App, Portal) θέλουν να φτιάξουν. Ξεκινήστε σήμερα με πλεονέκτημα.
            </p>
          </div>

          {/* Right section: Logos */}
          <div className="shrink-0 flex items-center justify-center px-6 md:px-10 py-8">
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => {
                const isDarkBg = i === 1 || i === 2;
                return (
                  <div 
                    key={i} 
                    className={`w-24 h-14 transition-all duration-200 rounded flex items-center justify-center p-1.5 border shadow-sm ${
                      isDarkBg 
                        ? "bg-[#010101] border-white/10 hover:bg-[#111111]" 
                        : "bg-white border-black/5 hover:bg-slate-50"
                    }`}
                  >
                    <img
                      src={`/images/logos/client-${i}.png?v=5`}
                      alt={`Client logo ${i}`}
                      className="max-w-full max-h-full object-contain opacity-90 hover:opacity-100 transition-opacity"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
