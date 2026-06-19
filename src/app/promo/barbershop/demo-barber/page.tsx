"use client";

import React, { useState, useEffect, Suspense } from "react";
import Head from "next/head";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Calendar, User, Phone, Check, Facebook, Twitter, Youtube, Linkedin, ChevronRight, ShoppingCart, Trash2, Plus, Minus
} from "lucide-react";
import confetti from "canvas-confetti";

function getInCityPhrase(city: string): string {
  if (!city) return "";
  const trimmed = city.trim();
  
  const pluralNeuterCities = [
    "Χανιά", "Γρεβενά", "Τρίκαλα", "Ιωάννινα", "Γιαννιτσά", 
    "Καλάβρυτα", "Μέγαρα", "Φάρσαλα", "Λεχαινά", "Κύθηρα", 
    "Ψαρά", "Κουφονήσια", "Λιμενάρια", "Μάλια", "Καμένα Βούρλα",
    "Λουτρά", "Λιμάνια", "Μέθανα"
  ];
  
  if (pluralNeuterCities.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
    return `στα ${trimmed}`;
  }

  const feminineOsCities = [
    "Ρόδος", "Μύκονος", "Νάξος", "Πάρος", "Μήλος", "Σίφνος", 
    "Σέριφος", "Κύθνος", "Κίμωλος", "Αμοργός", "Αλόννησος", 
    "Σκόπελος", "Σκιάθος", "Ζάκυνθος", "Κάρπαθος", "Λέρος", 
    "Πάτμος", "Σύρος", "Τήνος", "Άνδρος", "Κόρινθος", "Πύλος"
  ];
  
  const isFeminineOs = feminineOsCities.some(c => c.toLowerCase() === trimmed.toLowerCase());
  
  if (isFeminineOs) {
    const accusative = trimmed.endsWith("ς") ? trimmed.slice(0, -1) : trimmed;
    const firstChar = accusative.charAt(0).toUpperCase();
    const firstTwo = accusative.slice(0, 2).toLowerCase();
    
    const vowels = ["Α", "Ε", "Η", "Ι", "Ο", "Υ", "Ω", "Ά", "Έ", "Ή", "Ί", "Ό", "Ύ", "Ώ"];
    const stopConsonants = ["Κ", "Π", "Τ", "Ξ", "Ψ"];
    const stopClusters = ["μπ", "ντ", "γκ", "τσ", "τζ"];
    
    const needsN = vowels.includes(firstChar) || 
                   stopConsonants.includes(firstChar) || 
                   stopClusters.some(cluster => firstTwo.startsWith(cluster));
                   
    return needsN ? `στην ${accusative}` : `στη ${accusative}`;
  }

  if (trimmed.endsWith("ς") || trimmed.endsWith("Σ")) {
    const accusative = trimmed.slice(0, -1);
    if (trimmed.toLowerCase() === "άργος") {
      return `στο ${trimmed}`;
    }
    return `στο ${accusative}`;
  }

  const lastChar = trimmed.slice(-1).toLowerCase();
  if (["ο", "ό", "ι", "ί", "υ", "ύ"].includes(lastChar)) {
    return `στο ${trimmed}`;
  }

  const firstChar = trimmed.charAt(0).toUpperCase();
  const firstTwo = trimmed.slice(0, 2).toLowerCase();
  
  const vowels = ["Α", "Ε", "Η", "Ι", "Ο", "Υ", "Ω", "Ά", "Έ", "Ή", "Ί", "Ό", "Ύ", "Ώ"];
  const stopConsonants = ["Κ", "Π", "Τ", "Ξ", "Ψ"];
  const stopClusters = ["μπ", "ντ", "γκ", "τσ", "τζ"];
  
  const needsN = vowels.includes(firstChar) || 
                 stopConsonants.includes(firstChar) || 
                 stopClusters.some(cluster => firstTwo.startsWith(cluster));
                 
  return needsN ? `στην ${trimmed}` : `στη ${trimmed}`;
}

const defaultServices = [
  { id: "1", name: "Παραδοσιακό Κούρεμα", price: 15, duration: "30 λεπτά", desc: "Μία από τις πιο δημοφιλείς υπηρεσίες που παρέχουν οι κουρείς μας." },
  { id: "2", name: "Παραδοσιακό Ξύρισμα", price: 12, duration: "25 λεπτά", desc: "Οι υπηρεσίες ξυρίσματος μας θα σας κάνουν να δείχνετε πραγματικά γοητευτικός." },
  { id: "3", name: "Περιποίηση Μουστακιού", price: 8, duration: "15 λεπτά", desc: "Το μουστάκι χρειάζεται επίσης τακτική περιποίηση και τριμάρισμα." },
  { id: "4", name: "Περιποίηση Γενειάδας", price: 10, duration: "20 λεπτά", desc: "Μια καλοσχηματισμένη γενειάδα είναι απαραίτητο στοιχείο για την εμφάνιση κάθε άνδρα." }
];

const shopProducts = [
  {
    id: "p1",
    name: "Beard Oil Premium (30ml)",
    price: 18,
    image: "/promo/product_beard_oil.png",
    desc: "Premium λάδι με φυσικά εκχυλίσματα για απαλότητα, ενυδάτωση και λάμψη στη γενειάδα σου."
  },
  {
    id: "p2",
    name: "Hair Clay Matte Pomade",
    price: 20,
    image: "/promo/product_hair_pomade.png",
    desc: "Πηλός δυνατού κρατήματος με ματ τελείωμα για φυσικό look που διαρκεί όλη μέρα."
  },
  {
    id: "p3",
    name: "Organic Beard Balm",
    price: 16,
    image: "/promo/product_beard_balm.png",
    desc: "Μπάλσαμ για θρέψη, σχήμα και έλεγχο της γενειάδας με διακριτικό άρωμα ξύλου."
  },
  {
    id: "p4",
    name: "Vintage Shaving Cream",
    price: 15,
    image: "/promo/product_shaving_cream.png",
    desc: "Πλούσια κρέμα ξυρίσματος για βαθύ ξύρισμα χωρίς ερεθισμούς και βαθιά ενυδάτωση."
  }
];

const barbersList = ["Οποιοσδήποτε", "Γιάννης Βασιλείου", "Βασίλης Ανδρέου", "Ανδρέας Φιλίππου"];
const timeSlots = ["09:00", "10:00", "11:30", "13:00", "15:00", "17:00", "18:30"];

const SVGMustache = ({ className = "w-12 h-6 fill-black" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M 3,14 C 3,11 6,11 8,13 C 10,15 11,15 12,14 C 13,15 14,15 16,13 C 18,11 21,11 21,14 C 21,17 17,18 14,16 C 12,15 12,15 12,15 C 12,15 12,15 10,16 C 7,18 3,17 3,14 Z" />
  </svg>
);

const SVGCrossedRazors = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto mb-4 fill-[#e0a916]">
    <path d="M25,80 L75,30 L80,35 L30,85 Z" />
    <path d="M75,80 L25,30 L20,35 L70,85 Z" opacity="0.8" />
  </svg>
);

const SVGBlade = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12 fill-[#e0a916] mx-auto mt-10 opacity-90 animate-bounce cursor-pointer" xmlns="http://www.w3.org/2000/svg">
    <rect x="28" y="12" width="8" height="40" rx="2" />
    <circle cx="32" cy="32" r="3" fill="#111" />
  </svg>
);

const SVGScissorsComb = () => (
  <svg viewBox="0 0 64 64" className="w-16 h-16 fill-[#e0a916] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="22" width="52" height="5" rx="1" />
    <rect x="10" y="27" width="2.5" height="15" rx="0.5" />
    <rect x="15" y="27" width="2.5" height="15" rx="0.5" />
    <rect x="20" y="27" width="2.5" height="15" rx="0.5" />
    <rect x="25" y="27" width="2.5" height="15" rx="0.5" />
    <rect x="30" y="27" width="2.5" height="15" rx="0.5" />
    <rect x="35" y="27" width="2.5" height="15" rx="0.5" />
    <rect x="40" y="27" width="2.5" height="15" rx="0.5" />
    <rect x="45" y="27" width="2.5" height="15" rx="0.5" />
    <rect x="50" y="27" width="2.5" height="15" rx="0.5" />
    <g transform="rotate(-15 32 32)">
      <circle cx="20" cy="46" r="5" fill="none" stroke="#e0a916" strokeWidth="3" />
      <circle cx="44" cy="46" r="5" fill="none" stroke="#e0a916" strokeWidth="3" />
      <path d="M22 41 L32 16 L29 14 Z" />
      <path d="M42 41 L32 16 L35 14 Z" />
      <circle cx="32" cy="31" r="2" fill="black" stroke="#e0a916" strokeWidth="1.5" />
    </g>
  </svg>
);

const SVGRazorOpen = () => (
  <svg viewBox="0 0 64 64" className="w-16 h-16 fill-[#e0a916] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg">
    <rect x="27" y="26" width="7" height="30" rx="3" transform="rotate(-30 30 40)" />
    <circle cx="38" cy="48" r="1.5" fill="black" />
    <g transform="rotate(40 32 30)">
      <path d="M27 10 L37 10 L35 30 L29 30 Z" />
      <rect x="29.5" y="30" width="5" height="7" />
    </g>
  </svg>
);

const SVGMustacheYellow = () => (
  <svg viewBox="0 0 100 40" className="w-20 h-10 fill-[#e0a916] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg">
    <path d="M 10,25 C 20,15 32,15 46,24 C 48,26 52,26 54,24 C 68,15 80,15 90,25 C 98,34 94,40 84,33 C 74,26 64,28 50,35 C 36,28 26,26 16,33 C 6,40 2,34 10,25 Z" />
  </svg>
);

const SVGBeard = () => (
  <svg viewBox="0 0 64 64" className="w-16 h-16 fill-[#e0a916] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 24c0 14 6 26 16 26s16-12 16-26h-4c0 10-5 22-12 22S20 34 20 24h-4z" />
    <path d="M22 20c3-2 7-2 10 0 3-2 7-2 10 0 2 2 0 6-4 4-3-1.5-5 0-6 2-1-2-3-3.5-6-2-4 2-6-2-4-4z" />
  </svg>
);

const SawtoothLogo = () => (
  <div className="relative w-20 h-24 flex flex-col items-center justify-start pt-3 text-black z-10">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 120" preserveAspectRatio="none">
      <path d="M5,5 L95,5 L95,102 L87,112 L79,102 L71,112 L63,102 L55,112 L47,102 L39,112 L31,102 L23,112 L15,102 L5,112 Z" fill="#e0a916" stroke="black" strokeWidth="4" />
    </svg>
    <span className="text-[9px] tracking-[0.25em] font-black uppercase leading-none mb-1 relative z-20">LOCAL</span>
    <span className="font-chunky text-lg uppercase leading-none tracking-tighter mb-2 relative z-20">BARBER</span>
    <SVGMustache className="w-12 h-6 fill-black relative z-20" />
  </div>
);

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

function BarbershopDemoContent() {
  const searchParams = useSearchParams();
  const queryName = searchParams.get("name") || "";
  const queryCity = searchParams.get("city") || "";
  const queryPhoneInput = searchParams.get("phone") || "";
  
  const inCityPhrase = getInCityPhrase(queryCity) || "στη Θεσσαλονίκη";
  const businessDisplayName = queryName || "Local Barber";
  const queryPhone = queryPhoneInput || "6999 524 389";

  // Booking States
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedServices, setSelectedServices] = useState<typeof defaultServices>([]);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Cart & Shop States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);

  // Form inputs
  const [clientName, setClientName] = useState("Γιάννης Παπαδόπουλος");
  const [clientPhone, setClientPhone] = useState("6999 524 389");
  const [clientEmail, setClientEmail] = useState("demo@example.com");

  // Shipping Inputs for Checkout
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("Θεσσαλονίκη");

  const [scrolled, setScrolled] = useState(false);
  const [currentHours, setCurrentHours] = useState(0);
  const [currentMinutes, setCurrentMinutes] = useState(0);

  useEffect(() => {
    const now = new Date();
    setCurrentHours(now.getHours());
    setCurrentMinutes(now.getMinutes());
    if (queryName) setClientName(queryName);
    if (queryPhoneInput) setClientPhone(queryPhoneInput);
    if (queryCity) setShippingCity(queryCity);

    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [queryName, queryPhoneInput, queryCity]);

  const startBooking = (service?: typeof defaultServices[0]) => {
    if (service) {
      setSelectedServices([service]);
    } else {
      setSelectedServices([]);
    }
    setBookingStep(1);
    setBookingOpen(true);
  };

  const resetBooking = () => {
    setBookingStep(1);
    setSelectedServices([]);
    setSelectedBarber(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setClientName(queryName || "Γιάννης Παπαδόπουλος");
    setClientPhone(queryPhoneInput || "6999 524 389");
    setClientEmail("demo@example.com");
  };

  const toggleService = (service: typeof defaultServices[0]) => {
    setSelectedServices(prev => {
      if (prev.some(s => s.id === service.id)) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const isSlotBooked = (date: string, time: string) => {
    if (date === "Σήμερα") {
      const slotMinutes = timeToMinutes(time);
      const nowMinutes = currentHours * 60 + currentMinutes;
      if (slotMinutes <= nowMinutes + 15) {
        return true;
      }
      if (time === "17:00") return true;
    }
    if (date === "Αύριο") {
      return time === "11:30" || time === "17:00";
    }
    if (date === "Μεθαύριο") {
      return time === "13:00" || time === "15:00";
    }
    return false;
  };

  // E-Shop Actions
  const addToCart = (product: typeof shopProducts[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getCartTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const startCheckout = () => {
    setCartOpen(false);
    setCheckoutStep(1);
    setCheckoutOpen(true);
  };

  const completeCheckout = () => {
    setCheckoutStep(2);
    confetti({ particleCount: 80, spread: 60, colors: ["#e0a916", "#ffffff"] });
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-body relative overflow-x-hidden selection:bg-[#e0a916] selection:text-black">
      {/* Styles for Retro Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700;800&display=swap');
        .font-chunky { font-family: 'Alfa Slab One', serif; }
        .font-serif-body { font-family: 'Playfair Display', serif; }
        .font-sans-body { font-family: 'Inter', sans-serif; }
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        .custom-scroll::-webkit-scrollbar-thumb { background: #e0a916; border-radius: 4px; }
      `}} />

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingOpen && (
          <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/90 backdrop-blur-md sm:px-4 sm:py-6 md:py-12 flex justify-center items-start sm:items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111111] w-full min-h-screen sm:min-h-0 sm:max-w-xl text-white relative p-6 sm:p-8 md:p-12 sm:border-4 sm:border-black sm:shadow-[8px_8px_0px_0px_#e0a916] flex flex-col justify-start"
            >
              <button 
                onClick={() => { setBookingOpen(false); resetBooking(); }} 
                className="absolute top-4 right-4 text-gray-400 hover:text-[#e0a916] transition-colors z-10"
              >
                <X size={26} />
              </button>

              <div className="text-center mb-6 md:mb-8 relative">
                <div className="flex justify-center mb-2">
                  <SVGMustache className="w-14 h-7 md:w-18 md:h-9 fill-[#e0a916]" />
                </div>
                <h4 className="text-2xl md:text-3xl font-black tracking-wide text-[#e0a916] font-sans-body">Online Ραντεβού</h4>
                <div className="w-20 h-[2.5px] bg-[#e0a916] mx-auto my-3" />
                <p className="text-xs md:text-sm text-gray-300 font-sans-body">Επιλέξτε την υπηρεσία σας και κλείστε τη θέση σας σε 30 δευτερόλεπτα</p>
              </div>

              {bookingStep === 1 && (
                <div className="space-y-4">
                  <p className="text-sm md:text-base font-bold text-gray-400">1. Επιλέξτε Υπηρεσία:</p>
                  <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-2 custom-scroll">
                    {defaultServices.map(s => {
                      const isSelected = selectedServices.some(item => item.id === s.id);
                      return (
                        <div 
                          key={s.id} 
                          onClick={() => toggleService(s)}
                          className={`w-full p-4 sm:p-5 rounded-none text-left flex justify-between items-center bg-neutral-900 border-2 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer group ${isSelected ? 'border-[#e0a916] bg-[#e0a916]/10 shadow-none translate-x-[2px] translate-y-[2px]' : 'border-black hover:border-[#e0a916]'}`}
                        >
                          <div>
                            <span className={`font-extrabold block text-sm sm:text-base md:text-lg transition-colors font-sans-body ${isSelected ? 'text-[#e0a916]' : 'text-white group-hover:text-[#e0a916]'}`}>{s.name}</span>
                            <span className="text-[10px] sm:text-xs md:text-sm text-gray-400 font-sans-body">{s.duration}</span>
                          </div>
                          <span className={`font-black text-sm sm:text-base md:text-lg px-3 py-1.5 sm:px-4 sm:py-2 border transition-colors ${isSelected ? 'bg-[#e0a916] text-black border-black' : 'bg-black/60 text-[#e0a916] border-black'}`}>{s.price}€</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <button 
                    disabled={selectedServices.length === 0}
                    onClick={() => setBookingStep(2)}
                    className="w-full py-4 rounded-none text-sm md:text-base font-black border-2 border-black transition-all duration-300 bg-[#e0a916] text-black hover:bg-[#c99513] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 mt-4"
                  >
                    Επόμενο ({selectedServices.length} {selectedServices.length === 1 ? "υπηρεσία" : "υπηρεσίες"})
                  </button>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm md:text-base mb-2">
                    <span className="font-bold text-gray-400">2. Επιλέξτε Barber:</span>
                    <button onClick={() => setBookingStep(1)} className="text-xs underline text-gray-400 hover:text-white">Πίσω</button>
                  </div>
                  <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-2 custom-scroll">
                    {barbersList.map(barber => (
                      <div 
                        key={barber} 
                        onClick={() => { setSelectedBarber(barber); setBookingStep(3); }}
                        className="w-full p-4 sm:p-5 rounded-none text-left bg-neutral-900 border-2 border-black transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:border-[#e0a916] cursor-pointer flex items-center gap-4 group"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#e0a916]/10 text-[#e0a916] flex items-center justify-center border border-[#e0a916]/20 group-hover:bg-[#e0a916] group-hover:text-black transition-colors">
                          <User size={18} />
                        </div>
                        <span className="font-extrabold text-sm sm:text-base md:text-lg text-white group-hover:text-[#e0a916] transition-colors">{barber}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm md:text-base mb-2">
                    <span className="font-bold text-gray-400">3. Ημερομηνία & Ώρα:</span>
                    <button onClick={() => setBookingStep(2)} className="text-xs underline text-gray-400 hover:text-white">Πίσω</button>
                  </div>
                  
                  {/* Dates */}
                  <div className="grid grid-cols-3 gap-3">
                    {["Σήμερα", "Αύριο", "Μεθαύριο"].map(d => (
                      <button 
                        key={d} 
                        onClick={() => setSelectedDate(d)}
                        className={`p-3 sm:p-4 rounded-none text-xs sm:text-sm md:text-base font-extrabold text-center border-2 border-black transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] ${selectedDate === d ? 'bg-[#e0a916] text-black shadow-none translate-x-[1px] translate-y-[1px]' : 'bg-neutral-900 text-white'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  {/* Times */}
                  <div className="grid grid-cols-4 gap-2 pt-2 max-h-[160px] overflow-y-auto pr-1 custom-scroll">
                    {timeSlots.map(t => {
                      const booked = isSlotBooked(selectedDate || "Σήμερα", t);
                      return (
                        <button 
                          key={t} 
                          disabled={booked}
                          onClick={() => setSelectedTime(t)}
                          className={`p-2.5 rounded-none text-xs sm:text-sm text-center border-2 transition-all ${booked ? 'bg-neutral-900/50 text-neutral-600 border-neutral-800 line-through cursor-not-allowed' : selectedTime === t ? 'bg-[#e0a916] text-black border-black shadow-none translate-x-[0.5px] translate-y-[0.5px]' : 'bg-neutral-900 text-gray-300 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px]'}`}
                        >
                          {t} {booked && <span className="text-red-500 font-extrabold ml-1">✕</span>}
                        </button>
                      );
                    })}
                  </div>

                  <button 
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => {
                      setBookingStep(4);
                    }}
                    className="w-full py-4 rounded-none text-sm md:text-base font-black border-2 border-black transition-all duration-300 bg-[#e0a916] text-black hover:bg-[#c99513] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 mt-4 font-sans-body"
                  >
                    Επόμενο Βήμα
                  </button>
                </div>
              )}

              {bookingStep === 4 && (
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-center">
                    <p className="text-sm md:text-base font-bold text-gray-400">4. Στοιχεία Επικοινωνίας:</p>
                    <button 
                      onClick={() => setBookingStep(3)} 
                      className="text-xs text-gray-400 hover:text-[#e0a916] underline font-sans-body"
                    >
                      Πίσω
                    </button>
                  </div>
                  
                  <div className="space-y-4 font-sans-body">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Όνοματεπώνυμο</label>
                      <input 
                        type="text" 
                        value={clientName} 
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-neutral-900 border-2 border-black p-3.5 text-white text-sm focus:border-[#e0a916] focus:outline-none transition-colors rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        placeholder="π.χ. Γιάννης Παπαδόπουλος"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Κινητό Τηλέφωνο</label>
                      <input 
                        type="tel" 
                        value={clientPhone} 
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full bg-neutral-900 border-2 border-black p-3.5 text-white text-sm focus:border-[#e0a916] focus:outline-none transition-colors rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        placeholder="π.χ. 6999 524 389"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Email</label>
                      <input 
                        type="email" 
                        value={clientEmail} 
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full bg-neutral-900 border-2 border-black p-3.5 text-white text-sm focus:border-[#e0a916] focus:outline-none transition-colors rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        placeholder="π.χ. client@example.com"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={!clientName.trim() || !clientPhone.trim() || !clientEmail.trim()}
                    onClick={() => {
                      setBookingStep(5);
                      confetti({ particleCount: 60, spread: 50, colors: ["#e0a916", "#ffffff"] });
                    }}
                    className="w-full py-4 rounded-none text-sm md:text-base font-black border-2 border-black transition-all duration-300 bg-[#e0a916] text-black hover:bg-[#c99513] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 mt-6 font-sans-body"
                  >
                    Επιβεβαίωση Ραντεβού
                  </button>
                </div>
              )}

              {bookingStep === 5 && (
                <div className="text-center py-2 md:py-4 space-y-4 md:space-y-6">
                  <h5 className="font-sans-body font-black text-xl md:text-2xl text-[#e0a916] tracking-wide">Το ραντεβού επιβεβαιώθηκε!</h5>
                  <p className="text-xs xs:text-sm md:text-base text-gray-300">
                    Ένα SMS επιβεβαίωσης στάλθηκε στο κινητό <span className="whitespace-nowrap">{clientPhone || "σας"}</span>.
                  </p>
                  
                  <div className="text-xs sm:text-sm md:text-base text-gray-200 bg-neutral-900 border-2 border-black p-4 sm:p-6 rounded-none text-left space-y-2 sm:space-y-3 max-w-md mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-sans-body">
                    <p><strong>Πελάτης:</strong> {clientName}</p>
                    <p><strong>Κατάστημα:</strong> {businessDisplayName}</p>
                    <p><strong>Υπηρεσίες:</strong> {selectedServices.map(s => s.name).join(", ")}</p>
                    <p><strong>Barber:</strong> {selectedBarber}</p>
                    <p><strong>Ημέρα/Ώρα:</strong> {selectedDate}, στις {selectedTime}</p>
                    <p className="border-t border-white/10 pt-2 mt-2"><strong>Συνολικό Κόστος:</strong> <span className="text-[#e0a916] font-extrabold">{selectedServices.reduce((sum, s) => sum + s.price, 0)}€</span></p>
                  </div>
                  
                  <button 
                    onClick={() => { setBookingOpen(false); resetBooking(); }} 
                    className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 border-2 border-black text-white font-black text-sm md:text-base tracking-wider transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2.5px] hover:translate-y-[2.5px]"
                  >
                    Κλείσιμο Παραθύρου
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Modal / Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex justify-end">
            <div className="absolute inset-0" onClick={() => setCartOpen(false)} />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-full max-w-md bg-[#111111] border-l-4 border-black h-full flex flex-col p-6 shadow-2xl z-10 text-white"
            >
              <button 
                onClick={() => setCartOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-[#e0a916]"
              >
                <X size={24} />
              </button>

              <h4 className="text-xl md:text-2xl font-black text-[#e0a916] mb-6 uppercase tracking-wider font-sans-body pt-2 flex items-center gap-2">
                <ShoppingCart size={24} /> Το Καλάθι σου
              </h4>
              
              <div className="w-16 h-[2px] bg-[#e0a916] mb-6" />

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-gray-400 text-sm font-sans-body">Το καλάθι σου είναι άδειο.</p>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="border-2 border-dashed border-[#e0a916] text-[#e0a916] hover:bg-[#e0a916] hover:text-black transition-colors px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                  >
                    Συνέχεια Αγορών
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scroll">
                    {cart.map(item => (
                      <div key={item.id} className="bg-neutral-900 border-2 border-black p-3.5 flex gap-4 items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <div className="relative w-16 h-16 shrink-0 bg-neutral-800 border border-neutral-700">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-extrabold text-sm block truncate font-sans-body">{item.name}</span>
                          <span className="text-[#e0a916] font-bold text-xs font-sans-body block mb-2">{item.price}€</span>
                          
                          {/* Qty Controls */}
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 border border-neutral-700 flex items-center justify-center hover:bg-neutral-800"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-xs w-6 text-center font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 border border-neutral-700 flex items-center justify-center hover:bg-neutral-800"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-500 hover:text-red-500 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Summary & Checkout Button */}
                  <div className="border-t border-neutral-800 pt-6 mt-4 space-y-4">
                    <div className="flex justify-between font-bold text-sm text-gray-400">
                      <span>Προϊόντα:</span>
                      <span>{getCartCount()}</span>
                    </div>
                    <div className="flex justify-between font-black text-lg text-white">
                      <span>Σύνολο:</span>
                      <span className="text-[#e0a916]">{getCartTotal()}€</span>
                    </div>
                    
                    <button 
                      onClick={() => startCheckout()}
                      className="w-full py-4 bg-[#e0a916] text-black font-black text-xs md:text-sm tracking-[0.2em] uppercase border-2 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                      Ολοκλήρωση Αγοράς
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Checkout Mockup Modal */}
      <AnimatePresence>
        {checkoutOpen && (
          <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md sm:px-4 sm:py-6 md:py-12 flex justify-center items-start sm:items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111111] w-full min-h-screen sm:min-h-0 sm:max-w-xl text-white relative p-6 sm:p-8 md:p-12 sm:border-4 sm:border-black sm:shadow-[8px_8px_0px_0px_#e0a916] flex flex-col justify-start"
            >
              <button 
                onClick={() => setCheckoutOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-[#e0a916]"
              >
                <X size={26} />
              </button>

              <div className="text-center mb-6 md:mb-8">
                <div className="flex justify-center mb-2">
                  <ShoppingCart size={36} className="text-[#e0a916]" />
                </div>
                <h4 className="text-2xl md:text-3xl font-black text-[#e0a916] font-sans-body uppercase tracking-wider">Ολοκλήρωση Παραγγελίας</h4>
                <div className="w-20 h-[2.5px] bg-[#e0a916] mx-auto my-3" />
              </div>

              {checkoutStep === 1 ? (
                <div className="space-y-4 text-left">
                  <p className="text-sm font-bold text-gray-400 mb-2 font-sans-body">1. Στοιχεία Αποστολής & Παράδοσης:</p>
                  
                  <div className="space-y-4 font-sans-body text-xs sm:text-sm">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Όνοματεπώνυμο</label>
                      <input 
                        type="text" 
                        value={clientName} 
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-neutral-900 border-2 border-black p-3 text-white focus:border-[#e0a916] focus:outline-none transition-colors rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Κινητό Τηλέφωνο</label>
                        <input 
                          type="tel" 
                          value={clientPhone} 
                          onChange={(e) => setClientPhone(e.target.value)}
                          className="w-full bg-neutral-900 border-2 border-black p-3 text-white focus:border-[#e0a916] focus:outline-none transition-colors rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Email</label>
                        <input 
                          type="email" 
                          value={clientEmail} 
                          onChange={(e) => setClientEmail(e.target.value)}
                          className="w-full bg-neutral-900 border-2 border-black p-3 text-white focus:border-[#e0a916] focus:outline-none transition-colors rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Διεύθυνση Αποστολής (Οδός, Αριθμός)</label>
                      <input 
                        type="text" 
                        value={shippingAddress} 
                        required
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="π.χ. Τσιμισκή 45"
                        className="w-full bg-neutral-900 border-2 border-black p-3 text-white focus:border-[#e0a916] focus:outline-none transition-colors rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Πόλη</label>
                      <input 
                        type="text" 
                        value={shippingCity} 
                        onChange={(e) => setShippingCity(e.target.value)}
                        className="w-full bg-neutral-900 border-2 border-black p-3 text-white focus:border-[#e0a916] focus:outline-none transition-colors rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      />
                    </div>
                  </div>

                  {/* Order Summary in Checkout */}
                  <div className="bg-neutral-950 p-4 border-2 border-black font-sans-body text-xs space-y-2 mt-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-extrabold text-[#e0a916] mb-1">ΣΥΝΟΨΗ ΠΑΡΑΓΓΕΛΙΑΣ</p>
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-gray-300">
                        <span>{item.name} x {item.quantity}</span>
                        <span>{item.price * item.quantity}€</span>
                      </div>
                    ))}
                    <div className="border-t border-white/10 pt-2 flex justify-between font-black text-sm text-white">
                      <span>Σύνολο:</span>
                      <span className="text-[#e0a916]">{getCartTotal()}€</span>
                    </div>
                  </div>

                  <button 
                    disabled={!clientName.trim() || !clientPhone.trim() || !clientEmail.trim() || !shippingAddress.trim() || !shippingCity.trim()}
                    onClick={() => completeCheckout()}
                    className="w-full py-4 rounded-none text-xs md:text-sm font-black border-2 border-black transition-all bg-[#e0a916] text-black hover:bg-[#c99513] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 mt-6 uppercase tracking-widest font-sans-body"
                  >
                    Υποβολή Παραγγελίας (Αντικαταβολή)
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 space-y-6">
                  <h5 className="font-sans-body font-black text-xl md:text-2xl text-[#e0a916] tracking-wide uppercase">Η παραγγελία σου καταχωρήθηκε! 🎉</h5>
                  
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans-body max-w-sm mx-auto">
                    Συγχαρητήρια! Η παραγγελία σου λήφθηκε επιτυχώς και θα αποσταλεί με δωρεάν αντικαταβολή στη διεύθυνση **{shippingAddress}, {shippingCity}**.
                  </p>

                  <div className="text-xs sm:text-sm text-gray-200 bg-neutral-900 border-2 border-black p-5 rounded-none text-left space-y-2.5 max-w-md mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-sans-body">
                    <p><strong>Παραλήπτης:</strong> {clientName}</p>
                    <p><strong>Τηλέφωνο:</strong> {clientPhone}</p>
                    <p><strong>Προιόντα:</strong> {cart.map(item => `${item.name} (x${item.quantity})`).join(", ")}</p>
                    <p className="border-t border-white/10 pt-2 mt-2"><strong>Τελικό Ποσό:</strong> <span className="text-[#e0a916] font-extrabold">{getCartTotal()}€</span></p>
                  </div>

                  <button 
                    onClick={() => { setCheckoutOpen(false); setCart([]); }} 
                    className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 border-2 border-black text-white font-black text-sm md:text-base tracking-wider transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2.5px] hover:translate-y-[2.5px]"
                  >
                    Επιστροφή στο Κατάστημα
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Cart Badge Button */}
      {getCartCount() > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#e0a916] text-black border-2 border-black p-4 rounded-full shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center"
        >
          <ShoppingCart size={22} />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-black animate-pulse">
            {getCartCount()}
          </span>
        </button>
      )}

      {/* 1. Header/Navbar */}
      <header className="fixed top-0 left-0 w-full z-40 bg-black/90 backdrop-blur-sm h-16 flex items-center justify-between px-6 md:px-12">
        <nav className="flex-1 hidden md:flex justify-end gap-8 text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase">
          <a href="#about" className="hover:text-[#e0a916] transition-colors relative py-1">ΣΧΕΤΙΚΑ</a>
          <a href="#services" className="hover:text-[#e0a916] transition-colors relative py-1">ΥΠΗΡΕΣΙΕΣ</a>
          <a href="#shop" className="hover:text-[#e0a916] transition-colors relative py-1">ΠΡΟΪΟΝΤΑ</a>
        </nav>

        {/* Center Sawtooth Logo */}
        <div className="mx-4 md:mx-8 shrink-0 z-50 translate-y-3">
          <SawtoothLogo />
        </div>

        <nav className="flex-1 hidden md:flex justify-start gap-8 text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase">
          <a href="#barbers" className="hover:text-[#e0a916] transition-colors relative py-1">ΚΟΥΡΕΙΣ</a>
          <a href="#contacts" className="hover:text-[#e0a916] transition-colors relative py-1">ΕΠΙΚΟΙΝΩΝΙΑ</a>
          
          {/* Cart link in header */}
          <button 
            onClick={() => setCartOpen(true)}
            className="hover:text-[#e0a916] transition-colors relative py-1 flex items-center gap-1 font-bold text-[10px] tracking-[0.25em]"
          >
            ΚΑΛΑΘΙ ({getCartCount()})
          </button>
        </nav>

        {/* Mobile menu trigger */}
        <button 
          onClick={() => startBooking()}
          className={`md:hidden bg-[#e0a916] text-black font-extrabold text-[10px] tracking-wider px-4 py-2 uppercase border border-black shadow absolute right-6 top-1/2 -translate-y-1/2 transition-all duration-300 ${scrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        >
          ΡΑΝΤΕΒΟΥ
        </button>

        {/* Desktop Book Button */}
        <button 
          onClick={() => startBooking()}
          className={`hidden md:block bg-[#e0a916] hover:bg-[#c99513] text-black font-extrabold text-[10px] tracking-[0.15em] px-4 py-2.5 uppercase border-2 border-black transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] absolute right-6 md:right-12 top-1/2 -translate-y-1/2 transition-all duration-300 ${scrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        >
          ΚΛΕΙΣΤΕ ΡΑΝΤΕΒΟΥ
        </button>
      </header>

      {/* 2. Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 text-center pt-28">
        <div className="absolute inset-0 z-0 bg-black">
          <Image
            src="/promo/barbershop_hero_young.png"
            alt="Barber cutting hair"
            fill
            className="object-cover object-center grayscale contrast-115 brightness-[0.45] opacity-75"
            priority
          />
        </div>
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10 pt-12">
          <div className="text-[11px] text-[#e0a916] font-bold uppercase tracking-[0.45em] leading-none mb-2">
            THE BEST
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-chunky text-white leading-tight uppercase tracking-tight max-w-3xl mx-auto">
            Masters <br/>of the Blade
          </h1>

          <div className="w-20 h-[3px] bg-[#e0a916] mx-auto my-6" />
          
          <p className="text-base md:text-lg lg:text-xl text-neutral-200 max-w-2xl mx-auto leading-relaxed font-medium font-serif-body">
            Δημιούργησε τη νέα σου εντυπωσιακή εμφάνιση με τις υπηρεσίες του {businessDisplayName}! Από κουρέματα μέχρι παραδοσιακά ξυρίσματα, μπορείς να ζήσεις το καλύτερο επίπεδο περιποίησης {inCityPhrase}.
          </p>

          <div className="pt-2">
            <button 
              onClick={() => startBooking()}
              className={`bg-[#e0a916] hover:bg-[#c99513] text-black font-extrabold text-xs tracking-[0.2em] px-8 py-4 uppercase border-2 border-black transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] ${scrolled ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
            >
              ΚΛΕΙΣΤΕ ΡΑΝΤΕΒΟΥ
            </button>
          </div>
          
          <SVGBlade />
        </div>
      </section>

      {/* 3. About Section */}
      <section id="about" className="py-28 px-6 md:px-12 bg-white text-black relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="w-full md:w-1/2 relative aspect-[4/5] overflow-hidden shadow-2xl">
            <Image 
              src="/promo/barbershop_about_young.png" 
              alt="Barber Styling"
              fill
              className="object-cover grayscale contrast-120 brightness-95"
            />
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">ΣΧΕΤΙΚΑ</span>
              <div className="flex-1 h-[2.5px] bg-[#e0a916]" />
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-tight tracking-tight text-neutral-900 font-serif-body">
              Σε Βοηθάμε <br/>να Δείχνεις Υπέροχος
            </h2>

            <p className="text-base md:text-lg lg:text-xl text-neutral-800 leading-relaxed font-normal font-sans-body">
              Το <strong>{businessDisplayName}</strong> είναι το κορυφαίο barbershop {inCityPhrase} για άνδρες που αναζητούν έναν χώρο όπου μπορούν να νιώσουν άνετα, να εκφραστούν ελεύθερα και να φύγουν απόλυτα ικανοποιημένοι.
            </p>
            <p className="text-sm md:text-base lg:text-lg text-neutral-500 leading-relaxed font-normal font-sans-body">
              Δίνουμε έμφαση στη λεπτομέρεια και χρησιμοποιούμε αποκλειστικά premium προϊόντα περιποίησης, συνδυάζοντας την κλασική σχολή κουρείου με τις σύγχρονες τάσεις του ανδρικού στυλ.
            </p>

            <div className="pt-4">
              <button 
                onClick={() => startBooking()}
                className="bg-black hover:bg-[#e0a916] hover:text-black hover:border-black text-white font-extrabold text-xs tracking-[0.2em] px-8 py-4 uppercase border-2 border-black transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(224,169,22,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                ΚΛΕΙΣΤΕ ΡΑΝΤΕΒΟΥ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Services Section */}
      <section id="services" className="py-28 px-6 md:px-12 relative overflow-hidden text-center bg-[#181818] border-t border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <Image
            src="/promo/barbershop_hero.png"
            alt="Barbershop interior blurred"
            fill
            className="object-cover grayscale brightness-[0.1] blur-[3px]"
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-[2.5px] bg-[#e0a916]" />
            <span className="text-xs font-bold tracking-widest text-[#e0a916] uppercase">ΥΠΗΡΕΣΙΕΣ</span>
            <div className="w-16 h-[2.5px] bg-[#e0a916]" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold uppercase mb-4 text-white font-serif-body">Οι Υπηρεσίες Μας</h2>
          <p className="text-sm md:text-base text-gray-300 max-w-lg mx-auto mb-20 leading-relaxed font-normal font-serif-body">
            Το {businessDisplayName} προσφέρει παγκοσμίου επιπέδου ανδρικά κουρέματα, περιποίηση γενειάδας και παραδοσιακό ξύρισμα. Δες μερικές από τις υπηρεσίες για τις οποίες φημιζόμαστε:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div 
              onClick={() => startBooking(defaultServices[0])}
              className="bg-black/60 border border-white/5 p-8 flex flex-col items-center text-center space-y-4 hover:border-[#e0a916]/40 hover:bg-black/80 transition-all cursor-pointer group"
            >
              <SVGScissorsComb />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#e0a916]">{defaultServices[0].name}</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed font-serif-body">{defaultServices[0].desc}</p>
            </div>

            <div 
              onClick={() => startBooking(defaultServices[1])}
              className="bg-black/60 border border-white/5 p-8 flex flex-col items-center text-center space-y-4 hover:border-[#e0a916]/40 hover:bg-black/80 transition-all cursor-pointer group"
            >
              <SVGRazorOpen />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#e0a916]">{defaultServices[1].name}</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed font-serif-body">{defaultServices[1].desc}</p>
            </div>

            <div 
              onClick={() => startBooking(defaultServices[2])}
              className="bg-black/60 border border-white/5 p-8 flex flex-col items-center text-center space-y-4 hover:border-[#e0a916]/40 hover:bg-black/80 transition-all cursor-pointer group"
            >
              <SVGMustacheYellow />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#e0a916]">{defaultServices[2].name}</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed font-serif-body">{defaultServices[2].desc}</p>
            </div>

            <div 
              onClick={() => startBooking(defaultServices[3])}
              className="bg-black/60 border border-white/5 p-8 flex flex-col items-center text-center space-y-4 hover:border-[#e0a916]/40 hover:bg-black/80 transition-all cursor-pointer group"
            >
              <SVGBeard />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#e0a916]">{defaultServices[3].name}</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed font-serif-body">{defaultServices[3].desc}</p>
            </div>
          </div>

          <div className="mt-16">
            <button 
              onClick={() => startBooking()}
              className="bg-[#e0a916] hover:bg-[#c99513] text-black font-extrabold text-xs tracking-[0.2em] px-8 py-4 uppercase border-2 border-black transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              ΚΛΕΙΣΤΕ ΡΑΝΤΕΒΟΥ ONLINE
            </button>
          </div>
        </div>
      </section>

      {/* 5. E-Shop Section */}
      <section id="shop" className="py-28 px-6 md:px-12 bg-[#111111] text-white relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs font-bold tracking-widest text-[#e0a916] uppercase">ΠΡΟΪΟΝΤΑ ΠΕΡΙΠΟΙΗΣΗΣ</span>
            <div className="flex-1 h-[2px] bg-neutral-800" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold uppercase mb-4 text-white font-serif-body">Premium E-Shop</h2>
          <p className="text-sm md:text-base text-gray-400 max-w-xl mb-16 leading-relaxed font-serif-body">
            Διάλεξε από την αποκλειστική γκάμα προϊόντων του {businessDisplayName} για τη φροντίδα της γενειάδας, του μουστακιού και των μαλλιών σου στο σπίτι.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {shopProducts.map(product => (
              <div 
                key={product.id}
                className="bg-neutral-900 border-2 border-black flex flex-col h-full shadow-[5px_5px_0px_0px_rgba(224,169,22,0.15)] hover:shadow-[5px_5px_0px_0px_#e0a916] transition-all group"
              >
                {/* Product Image container */}
                <div className="relative aspect-square overflow-hidden bg-neutral-950 border-b border-black">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute bottom-3 left-3 bg-[#e0a916] text-black font-black text-sm px-3 py-1.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {product.price}€
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-base text-white tracking-wide uppercase font-sans-body">{product.name}</h3>
                    <p className="text-xs text-gray-400 font-light leading-relaxed font-sans-body">{product.desc}</p>
                  </div>

                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full py-3 bg-black hover:bg-[#e0a916] hover:text-black text-white font-bold text-xs tracking-wider uppercase border border-black transition-colors"
                  >
                    Προσθήκη στο Καλάθι
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Barbers Section */}
      <section id="barbers" className="py-28 px-6 md:px-12 bg-white text-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#e0a916] pointer-events-none hidden md:block overflow-hidden">
          <Image 
            src="/promo/barbershop_hero_young.png" 
            alt="Barbershop background split" 
            fill 
            className="object-cover grayscale contrast-125 opacity-[0.18] mix-blend-multiply"
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-24 h-[2.5px] bg-[#e0a916]" />
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">ΚΟΥΡΕΙΣ</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold uppercase mb-4 font-serif-body">Οι Κουρείς Μας</h2>
          <p className="text-sm md:text-base text-neutral-700 max-w-xl mb-16 leading-relaxed font-normal font-serif-body">
            Απασχολούμε μόνο εξειδικευμένους κουρείς που δεν είναι απλώς επαγγελματίες, αλλά απολαμβάνουν επίσης να διατηρούν την αυθεντική ατμόσφαιρα ενός κλασικού κουρείου.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 bg-white p-4 shadow-xl border border-neutral-100">
              <div className="relative aspect-square overflow-hidden shadow-inner bg-neutral-100">
                <Image src="/promo/barber_giannis.png" alt="Γιάννης Βασιλείου" fill className="object-cover grayscale contrast-115" />
              </div>
              <h4 className="font-bold text-sm uppercase tracking-widest pt-2">ΓΙΑΝΝΗΣ ΒΑΣΙΛΕΙΟΥ</h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed px-2 font-serif-body">
                Ο Γιάννης είναι ο ιδρυτής και Senior Barber του κουρείου μας, με ξυρισμένο στυλ, πυκνή γενειάδα και πάθος για την κλασική περιποίηση.
              </p>
            </div>

            <div className="text-center space-y-4 bg-white p-4 shadow-xl border border-neutral-100">
              <div className="relative aspect-square overflow-hidden shadow-inner bg-neutral-100">
                <Image src="/promo/barber_vasilis.png" alt="Βασίλης Ανδρέου" fill className="object-cover grayscale contrast-115" />
              </div>
              <h4 className="font-bold text-sm uppercase tracking-widest pt-2">ΒΑΣΙΛΗΣ ΑΝΔΡΕΟΥ</h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed px-2 font-serif-body">
                Ο Βασίλης είναι ένας μοντέρνος barber με εντυπωσιακά τατουάζ και σχολαστική προσέγγιση στο σύγχρονο styling.
              </p>
            </div>

            <div className="text-center space-y-4 bg-white p-4 shadow-xl border border-neutral-100">
              <div className="relative aspect-square overflow-hidden shadow-inner bg-neutral-100">
                <Image src="/promo/barber_andreas.png" alt="Ανδρέας Φιλίππου" fill className="object-cover grayscale contrast-115" />
              </div>
              <h4 className="font-bold text-sm uppercase tracking-widest pt-2">ΑΝΔΡΕΑΣ ΦΙΛΙΠΠΟΥ</h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed px-2 font-serif-body">
                Ο Ανδρέας συνδυάζει το εναλλακτικό στυλ με τατουάζ και την εξειδίκευση στις premium θεραπείες γενειάδας.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Contacts Section */}
      <section id="contacts" className="py-28 px-6 md:px-12 bg-white text-black border-t border-neutral-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch gap-12">
          <div className="w-full md:w-1/2 min-h-[400px] relative border-2 border-neutral-200 shadow-md">
            <iframe 
              src={`https://maps.google.com/maps?q=${encodeURIComponent("Θεσσαλονίκη")}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full min-h-[400px] border-none grayscale contrast-125 opacity-90"
              allowFullScreen
              loading="lazy"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-8 pl-0 md:pl-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">ΕΠΙΚΟΙΝΩΝΙΑ</span>
                <div className="flex-1 h-[2.5px] bg-[#e0a916]" />
              </div>

              <h2 className="text-3xl font-extrabold uppercase text-neutral-900 font-serif-body">Διεύθυνση</h2>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-light font-serif-body">
                123 Street W., <br/>
                Θεσσαλονίκη, Ελλάδα <br/>
                Τηλέφωνο: <strong>{queryPhone}</strong> <br/>
                Email: <strong>info@sgk.gr</strong>
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold uppercase text-neutral-900 font-serif-body">Ωράριο Λειτουργίας</h2>
              <div className="text-sm md:text-base text-neutral-600 space-y-2 font-light font-serif-body">
                <p className="flex justify-between max-w-xs border-b border-neutral-100 pb-1">
                  <span>Δευτέρα – Παρασκευή:</span> 
                  <strong>9:00 π.μ. – 9:00 μ.μ.</strong>
                </p>
                <p className="flex justify-between max-w-xs border-b border-neutral-100 pb-1">
                  <span>Σάββατο και Κυριακή:</span> 
                  <strong>10:00 π.μ. – 4:00 μ.μ.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-[#111111] border-t border-white/5 text-center text-xs text-gray-500 relative flex flex-col items-center">
        <div className="mb-6 -translate-y-3">
          <SawtoothLogo />
        </div>

        <h3 className="font-chunky text-2xl text-[#e0a916] uppercase tracking-wider mb-4">{businessDisplayName}</h3>
        
        <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto leading-relaxed font-normal font-serif-body mb-8">
          Το {businessDisplayName} είναι το Νο.1 μέρος για ανδρικό κούρεμα. Εδώ μπορείς να απολαύσεις μια premium εμπειρία περιποίησης σε προσιτή τιμή.
        </p>

        <div className="flex gap-8 text-[11px] font-bold tracking-widest uppercase mb-8">
          <a href="#about" className="text-[#e0a916] hover:text-white transition-colors">ΣΧΕΤΙΚΑ</a>
          <a href="#services" className="text-[#e0a916] hover:text-white transition-colors">ΥΠΗΡΕΣΙΕΣ</a>
          <a href="#shop" className="text-white hover:text-[#e0a916] transition-colors">ΠΡΟΪΟΝΤΑ</a>
          <a href="#barbers" className="text-[#e0a916] hover:text-white transition-colors">ΚΟΥΡΕΙΣ</a>
          <a href="#contacts" className="text-[#e0a916] hover:text-white transition-colors">ΕΠΙΚΟΙΝΩΝΙΑ</a>
        </div>

        <div className="flex gap-6 mb-8 text-white">
          <a href="#" className="hover:text-[#e0a916] transition-colors"><Facebook size={18} /></a>
          <a href="#" className="hover:text-[#e0a916] transition-colors"><Twitter size={18} /></a>
          <a href="#" className="hover:text-[#e0a916] transition-colors"><Youtube size={18} /></a>
          <a href="#" className="hover:text-[#e0a916] transition-colors"><Linkedin size={18} /></a>
        </div>

        <p className="text-[10px] text-gray-600 mt-2">© {new Date().getFullYear()} {businessDisplayName}. Όλα τα δικαιώματα διατηρούνται. Σχεδιάστηκε από την SGK.</p>
      </footer>
    </div>
  );
}

export default function BarbershopDemo() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-[#e0a916] font-heading font-medium text-lg">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e0a916]"></div>
          <span>Φόρτωση Demo...</span>
        </div>
      </div>
    }>
      <BarbershopDemoContent />
    </Suspense>
  );
}
