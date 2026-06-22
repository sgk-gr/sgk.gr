"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import JoJoChatModal from "./JoJoChatModal";

const navItems = [
  { label: "Υπηρεσίες", href: "/services", color: "bg-[#4ade80]" },
  { label: "Λύσεις", href: "/solutions", color: "bg-[#facc15]" },
  { label: "Πελάτες", href: "/portfolio", color: "bg-[#3b5bdb]" },
  { 
    label: "Η Εταιρεία", 
    href: "/about", 
    color: "bg-[#4ade80]",
    submenu: [
      { label: "Καινοτομία στην SGK", href: "/innovation" }
    ]
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="w-full flex items-center justify-between h-12 lg:pr-16 xl:pr-24">
        
        {/* Left side (Language + Logo + Badge) */}
        <div className="flex items-center h-full">
          {/* Language Selector (Blue Box on the left) */}
          <div className="hidden lg:flex items-center justify-center gap-1 bg-[#3b5bdb] text-white h-full w-40 lg:w-64 xl:w-80 font-medium text-[14px] cursor-pointer">
            ΕΛ <ChevronDown size={16} className="opacity-90" />
          </div>

          {/* Logo & Badge */}
          <div className="flex items-center gap-1 pl-8 lg:pl-12 xl:pl-16">
            <Link href="/" className="flex items-center">
              <span className="font-heading font-bold text-3xl tracking-tighter text-black transition-colors duration-300">
                sgk<span className="text-[#3b5bdb]">.</span>
              </span>
            </Link>
            <Link href="/pay-as-you-grow" className="flex flex-col items-start cursor-pointer mt-0.5 ml-1.5 hover:opacity-85 transition-opacity" title="Πληρωμή με βάση την πρόοδο του έργου (Pay as you grow)">
              <div className="bg-[#80ff9f] text-black text-[12px] font-bold px-1.5 py-[2px] leading-none tracking-tight">
                Pay as
              </div>
              <div className="bg-[#3b5bdb] text-white text-[12px] font-bold px-1.5 py-[2px] leading-none tracking-tight">
                you grow
              </div>
            </Link>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              <Link
                href={item.href}
                className="relative text-[14px] xl:text-[15px] font-bold text-black transition-colors duration-300 block py-4"
              >
                {item.label}
                <span className={`absolute left-0 bottom-3 w-full h-[3px] ${item.color} origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 rounded-full`}></span>
              </Link>
              
              {/* Dropdown Menu */}
              {item.submenu && (
                <div className="absolute top-[calc(100%-10px)] left-0 w-52 bg-white border border-gray-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-50">
                  <div className="py-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block px-4 py-2 text-xs font-bold text-gray-700 hover:text-[#3b5bdb] hover:bg-gray-50 transition-colors"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Floating Action Buttons for Desktop */}
        <div className="hidden lg:flex flex-col fixed top-28 right-0 z-50 items-end drop-shadow-md gap-2">
          {/* Top Button: Estimate */}
          <button
            onClick={() => setIsAppModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold text-[12px] tracking-wider px-4 py-2 rounded-l-md transition-all duration-300 border border-r-0 border-[#22c55e]/30 relative z-20 shadow-sm"
          >
            <div className="w-3.5 h-3.5 bg-black text-[#4ade80] flex items-center justify-center rounded-sm text-[9px] font-black">
              +
            </div>
            Κατέβασε το app
          </button>
          
          {/* Bottom Button: AI Chat */}
          <button
            onClick={() => setIsChatModalOpen(true)}
            className="flex items-center gap-2 bg-[#b482ff] hover:bg-[#a068f7] text-white font-bold text-[12px] tracking-wider px-4 py-2 rounded-l-md transition-all duration-300 border border-r-0 border-white/20 relative z-10 shadow-sm"
          >
            <img
              src="/tzitzi.png"
              alt="Jo-Jo"
              className="w-5 h-5 rounded-full object-cover border border-white/60 shrink-0"
            />
            Έχεις απορίες; Jo-Jo εδώ
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-black transition-colors duration-300"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 shadow-xl overflow-hidden absolute top-full left-0 w-full"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navItems.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <Link
                    href={item.href}
                    className="text-lg font-medium text-gray-800 hover:text-[#3b5bdb] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.submenu && (
                    <div className="flex flex-col mt-3 pl-4 border-l-2 border-gray-200 gap-3">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="text-base font-medium text-gray-500 hover:text-[#3b5bdb] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/estimate"
                className="mt-4 py-3 text-base font-bold bg-[#4ade80] text-black rounded-xl text-center shadow-sm"
                onClick={() => setIsOpen(false)}
              >
                Εκτίμηση Έργου
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsChatModalOpen(true);
                }}
                className="py-3 text-base font-bold bg-[#b482ff] text-white rounded-xl text-center shadow-sm flex items-center justify-center gap-2"
              >
                <img
                  src="/tzitzi.png"
                  alt="Jo-Jo"
                  className="w-5 h-5 rounded-full object-cover border border-white/60 shrink-0"
                />
                Έχεις απορίες; Jo-Jo εδώ
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <JoJoChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />

      {/* Mobile Floating Jo-Jo Chat Button */}
      <button
        onClick={() => setIsChatModalOpen(true)}
        className="lg:hidden fixed bottom-14 right-4 z-40 w-12 h-12 bg-[#b482ff] active:bg-[#a068f7] rounded-full border-2 border-black shadow-lg flex items-center justify-center transition-all hover:scale-105 no-print animate-bounce"
        style={{ animationDuration: '3s' }}
        aria-label="Μίλα με τον Jo-Jo"
      >
        <img
          src="/tzitzi.png"
          alt="Jo-Jo"
          className="w-10 h-10 rounded-full object-cover border border-white/60 shrink-0"
        />
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#4ade80] border border-black rounded-full flex items-center justify-center text-[8px] font-black text-black">
          ●
        </span>
      </button>
      
      {/* App Download Info Modal */}
      <AnimatePresence>
        {isAppModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAppModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-[#f4f2ea] border-2 border-black p-6 rounded-xl shadow-2xl z-10 flex flex-col items-center text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsAppModalOpen(false)}
                className="absolute top-4 right-4 text-black hover:opacity-70 transition-opacity"
              >
                <X size={20} />
              </button>
              
              {/* App Icon / Mascot */}
              <div className="w-16 h-16 bg-[#3b5bdb] rounded-2xl flex items-center justify-center mb-4 mt-2 border-2 border-black shadow-md text-white font-black text-2xl">
                sgk
              </div>
              
              <h3 className="text-xl font-bold text-black mb-2">
                Σύντομα διαθέσιμο
              </h3>
              
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                Η εφαρμογή μας για κινητά τηλέφωνα είναι υπό κατασκευή και θα είναι διαθέσιμη σύντομα σε App Store και Google Play!
              </p>
              
              <button
                onClick={() => setIsAppModalOpen(false)}
                className="w-full py-3 bg-[#4ade80] hover:bg-[#22c55e] text-black font-bold rounded-lg border-2 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[2px] translate-y-[2px] hover:translate-x-0 hover:translate-y-0"
              >
                Κλείσιμο
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
