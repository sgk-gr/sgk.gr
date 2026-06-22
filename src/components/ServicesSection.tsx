"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ServicesSection() {
  return (
    <section className="w-full bg-[#f4f2ea] py-20 overflow-hidden">
      
      {/* --- Feature 1: Image on Right, Box on Left --- */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-[44px] font-light text-black mb-4 tracking-tight">
            Η ιδέα σου, με τον δικό σου τρόπο
          </h2>
          <p className="text-black/70 text-sm md:text-base leading-relaxed">
            Ό,τι ακριβώς φαντάζεσαι για το ψηφιακό σου project μπορεί να γίνει πραγματικότητα. Δεσμευόμαστε να κάνουμε την υλοποίηση της ιδέας σου μια δημιουργική εμπειρία, σχεδιασμένη γύρω από εσένα και τις ανάγκες σου.
          </p>
        </div>

        <div className="flex flex-col-reverse md:flex-row relative items-center">
          
          {/* Left Box */}
          <div className="w-full md:w-[45%] bg-[#111111] p-8 md:p-12 relative z-10 md:-mr-[10%] mt-[-40px] md:mt-0 shadow-2xl">
            <h3 className="text-white text-3xl md:text-4xl font-light mb-8">
              Όλα στον απόλυτο έλεγχό σου:
            </h3>
            
            <ul className="space-y-5 mb-10">
              <li className="flex items-start text-white/90 text-sm md:text-[15px]">
                <span className="w-3 h-3 bg-[#4ade80] mr-4 shrink-0 mt-1"></span>
                <span>Υλοποίηση της ιδέας σου εύκολα, γρήγορα και χωρίς τεχνικό άγχος</span>
              </li>
              <li className="flex items-start text-white/90 text-sm md:text-[15px]">
                <span className="w-3 h-3 bg-[#4ade80] mr-4 shrink-0 mt-1"></span>
                <span>Custom εφαρμογές και E-shops 100% προσαρμοσμένα στις απαιτήσεις σου</span>
              </li>
              <li className="flex items-start text-white/90 text-sm md:text-[15px]">
                <span className="w-3 h-3 bg-[#4ade80] mr-4 shrink-0 mt-1"></span>
                <span>Μηδενικές κρυφές χρεώσεις και "ψιλά γράμματα" σε κάθε βήμα</span>
              </li>
              <li className="flex items-start text-white/90 text-sm md:text-[15px]">
                <span className="w-3 h-3 bg-[#4ade80] mr-4 shrink-0 mt-1"></span>
                <span>SGK Pay as you grow – Ξεκίνα το project σου τώρα & πλήρωσε καθώς μεγαλώνεις</span>
              </li>
              <li className="flex items-start text-white/90 text-sm md:text-[15px]">
                <span className="w-3 h-3 bg-[#4ade80] mr-4 shrink-0 mt-1"></span>
                <span>Έξυπνες ενσωματώσεις AI για να αυτοματοποιήσεις την καθημερινότητά σου</span>
              </li>
              <li className="flex items-start text-white/90 text-sm md:text-[15px]">
                <span className="w-3 h-3 bg-[#4ade80] mr-4 shrink-0 mt-1"></span>
                <span>Εξυπηρέτηση 24/7 από τους ανθρώπους μας και από AI Agents, εκπαιδευμένους να γνωρίζουν τα πάντα για το δικό σου project.</span>
              </li>
            </ul>
            
            <div>
              <Link 
                href="/services"
                className="inline-block bg-[#4ade80] text-black hover:bg-[#22c55e] transition-colors duration-300 font-bold py-3 px-8 rounded-sm shadow-lg text-center"
              >
                Μάθε περισσότερα
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-[60%] relative h-[400px] md:h-[650px] z-0">
            <Image 
              src="/cool.jpg" 
              alt="Happy Client with their Digital Project" 
              fill
              className="object-cover shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* --- Feature 2: Image on Left, Box on Right --- */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-[44px] font-light text-black mb-4 tracking-tight">
            Όλα για την επιχείρησή σου
          </h2>
          <p className="text-black/70 text-sm md:text-base leading-relaxed">
            Η SGK σου παρέχει ψηφιακές λύσεις που σε βοηθούν να προσπεράσεις κάθε εμπόδιο που συναντάς, ώστε να έχεις τον απόλυτο έλεγχο της επιχείρησής σου. Από αστραπιαία E-shops μέχρι έξυπνα συστήματα AI, ό,τι ψάχνεις για την επιχείρησή σου βρίσκεται εδώ.
          </p>
        </div>

        <div className="flex flex-col md:flex-row relative items-center">
          
          {/* Left Image */}
          <div className="w-full md:w-[60%] relative h-[400px] md:h-[550px] z-0">
            <Image 
              src="/et.jpg" 
              alt="AI for Business" 
              fill
              className="object-cover shadow-xl"
            />
          </div>

          {/* Right Box */}
          <div className="w-full md:w-[45%] bg-[#111111] p-8 md:p-12 relative z-10 md:-ml-[10%] mt-[-40px] md:mt-0 shadow-2xl">
            <h3 className="text-white text-3xl md:text-4xl font-light mb-8">
              Ετοιμάσου για:
            </h3>
            
            <ul className="space-y-5 mb-10">
              <li className="flex items-start text-white/90 text-sm md:text-[15px]">
                <span className="w-3 h-3 bg-[#4ade80] mr-4 shrink-0 mt-1"></span>
                <span>Ευέλικτες και αξιόπιστες ψηφιακές λύσεις για την επιχείρησή σου.</span>
              </li>
              <li className="flex items-start text-white/90 text-sm md:text-[15px]">
                <span className="w-3 h-3 bg-[#4ade80] mr-4 shrink-0 mt-1"></span>
                <span>Αύξηση των παραγγελιών και της μέσης αξίας καλαθιού.</span>
              </li>
              <li className="flex items-start text-white/90 text-sm md:text-[15px]">
                <span className="w-3 h-3 bg-[#4ade80] mr-4 shrink-0 mt-1"></span>
                <span>Νέες πηγές εσόδων.</span>
              </li>
              <li className="flex items-start text-white/90 text-sm md:text-[15px]">
                <span className="w-3 h-3 bg-[#4ade80] mr-4 shrink-0 mt-1"></span>
                <span>Ενίσχυση της ικανοποίησης και της αφοσίωσης των πελατών σου.</span>
              </li>
            </ul>
            
            <div>
              <Link 
                href="/services"
                className="inline-block bg-[#4ade80] text-black hover:bg-[#22c55e] transition-colors duration-300 font-bold py-3 px-8 rounded-sm shadow-lg text-center"
              >
                Μάθε περισσότερα
              </Link>
            </div>
          </div>

        </div>
      </div>
      
    </section>
  );
}
