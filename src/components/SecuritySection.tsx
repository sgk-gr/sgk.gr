"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function SecuritySection() {
  return (
    <section className="w-full bg-[#3b5bdb] py-16 md:py-24 relative overflow-hidden">
      {/* Top Right Button */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-20">
        <Link 
          href="/estimate"
          className="inline-block bg-[#4ade80] text-black hover:bg-[#22c55e] transition-colors duration-300 font-bold py-2.5 px-6 rounded-sm shadow-lg text-xs md:text-sm tracking-wide text-center"
        >
          ΞΕΚΙΝΑ ΤΩΡΑ
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row relative items-center gap-10 md:gap-16 lg:gap-24">
          
          {/* Left Side: 3D Image/Icon */}
          <div className="w-full md:w-[40%] flex justify-center items-center relative h-[300px] md:h-[500px]">
            <div className="relative w-full max-w-[300px] aspect-square flex justify-center items-center">
                {/* 3D Glassmorphic Lock Built with CSS */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="relative flex flex-col items-center mt-10"
                >
                  {/* Floating blue small square */}
                  <div className="absolute top-8 -left-8 w-8 h-8 bg-[#1d4ed8] rounded-md shadow-xl transform -rotate-12 z-0"></div>
                  
                  {/* Pink Lock Shackle */}
                  <div className="w-28 h-20 border-t-[14px] border-l-[14px] border-r-[14px] border-[#d884cb] rounded-t-full relative z-0 shadow-inner"></div>
                  
                  {/* Glassmorphic Body */}
                  <div className="w-48 h-48 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-3xl relative z-10 flex flex-col items-center justify-center -mt-2 overflow-hidden">
                    {/* Inner highlight for 3D effect */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent"></div>
                    
                    {/* User Icon inside the glass */}
                    <div className="w-16 h-16 bg-[#0033cc] rounded-full mb-3 shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2)] relative z-20"></div>
                    <div className="w-28 h-16 bg-[#0033cc] rounded-t-full shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2)] relative z-20"></div>
                  </div>
                </motion.div>
            </div>
          </div>

          {/* Right Side: Text Content */}
          <div className="w-full md:w-[60%] flex flex-col justify-center max-w-2xl">
            <h2 className="text-white text-3xl md:text-5xl font-light mb-6 tracking-wide leading-tight">
              Θέλουμε να νιώθεις <br className="hidden md:block" /> ασφάλεια
            </h2>
            
            <p className="text-white/90 text-sm md:text-base mb-6 leading-relaxed">
              Η <span className="font-bold">SGK</span> προστατεύει τα δεδομένα σου και εφαρμόζει αυστηρά μέτρα για την <span className="font-bold">ασφάλεια του project και των χρηστών σου</span>:
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-white text-sm md:text-[15px]">
                <span className="w-2.5 h-2.5 bg-[#4ade80] mr-4 shrink-0"></span>
                ασφαλείς συναλλαγές με ψηφιακά πιστοποιητικά SSL
              </li>
              <li className="flex items-center text-white text-sm md:text-[15px]">
                <span className="w-2.5 h-2.5 bg-[#4ade80] mr-4 shrink-0"></span>
                καθημερινά Backups (Daily Backups)
              </li>
              <li className="flex items-center text-white text-sm md:text-[15px]">
                <span className="w-2.5 h-2.5 bg-[#4ade80] mr-4 shrink-0"></span>
                φιλοξενία σε ταχύτατους, πανίσχυρους Cloud Servers (Premium Hosting)
              </li>
              <li className="flex items-center text-white text-sm md:text-[15px]">
                <span className="w-2.5 h-2.5 bg-[#4ade80] mr-4 shrink-0"></span>
                υπηρεσίες ασφαλείας υψηλού επιπέδου κατά επιθέσεων
              </li>
              <li className="flex items-center text-white text-sm md:text-[15px]">
                <span className="w-2.5 h-2.5 bg-[#4ade80] mr-4 shrink-0"></span>
                πλήρης συμμόρφωση με τους κανονισμούς GDPR
              </li>
            </ul>
            
            <p className="text-white/80 text-sm leading-relaxed">
              Αλλά δεν μένουμε στα απαραίτητα. Είμαστε σε διαρκή αναζήτηση νέων <span className="text-white font-medium">τεχνολογιών και συστημάτων</span> για να διαθέτουμε πάντα το ασφαλέστερο σύστημα προστασίας. Και μέσα από τη δική μας τεχνογνωσία, θέλουμε να σε εκπαιδεύσουμε ώστε να προστατεύεσαι κι εσύ από τους κινδύνους. Παράλληλα, υπογράφουμε ψηφιακά συμφωνητικά μέσω gov.gr πριν από οποιαδήποτε προκαταβολή, ώστε να είσαι απόλυτα εξασφαλισμένος, αλλιώς σου επιστρέφουμε κάθε ευρώ πίσω.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
