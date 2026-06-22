"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, User, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { sendContactEmail } from "@/lib/resend";

const slides = [
  {
    title: (
      <>
        Pay As <br /> You Grow <br /> Μοντέλο.
      </>
    ),
    description: "Ξεκίνα το νέο σου E-shop ή Web App με μηδενικό ρίσκο. Πληρώνεις σταδιακά με την πρόοδο του έργου: 50% προκαταβολή, 25% στο Design, 25% πριν το Live. Απόλυτη διαφάνεια.",
    image: "/hero_slide_4.png",
    linkText: "Μάθε για τις πληρωμές",
    linkUrl: "/pay-as-you-grow"
  },
  {
    title: (
      <>
        Ψηφιακές <br /> Εμπειρίες Που <br /> Χτίζουν Εμπιστοσύνη.
      </>
    ),
    description: "Δημιουργούμε e-shops και web εφαρμογές που κάνουν τη ζωή του πελάτη σου πιο εύκολη.",
    image: "/hero_slide_1.png"
  },
  {
    title: (
      <>
        Agentic AI <br /> Που Σου Λύνει <br /> Τα Χέρια.
      </>
    ),
    description: "Οι έξυπνοι AI agents αναλαμβάνουν τις χρονοβόρες εργασίες και την 24/7 εξυπηρέτηση.",
    image: "/hero_slide_2.png"
  },
  {
    title: (
      <>
        E-Commerce <br /> Σχεδιασμένο <br /> Για Τον Άνθρωπο.
      </>
    ),
    description: "Χτίζουμε Headless E-shops που μετατρέποντας τους απλούς επισκέπτες σε αληθινούς, πιστούς πελάτες.",
    image: "/hero_slide_3.png"
  }
];

const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.error("Audio error:", e);
  }
};

interface JoJoChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoJoChatModal({ isOpen, onClose }: JoJoChatModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState("Γεια! Είμαι ο Jo-Jo 👋");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-slide logic for the left side
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Greeting logic
  useEffect(() => {
    const hour = new Date().getHours();
    let text = "Γεια! Είμαι ο Jo-Jo 👋";
    if (hour >= 5 && hour < 12) text = "Καλημέρα! 👋 Είμαι ο Jo-Jo!";
    else if (hour >= 12 && hour < 20) text = "Καλησπέρα! 👋 Είμαι ο Jo-Jo!";
    
    setGreeting(text);
    
    // Add initial message automatically
    setMessages(prev => {
      if (prev.length === 0) {
        return [{
          id: Date.now().toString(),
          role: "assistant",
          content: `${text} Πώς μπορώ να βοηθήσω την επιχείρησή σου να αναπτυχθεί σήμερα;`
        }];
      }
      return prev;
    });
  }, []);

  // Chat logic
  const append = async (message: any) => {
    const newMessages = [...messages, message];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error(`API Error ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: "" }]);

      let done = false;
      let text = "";
      let soundPlayed = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const content = JSON.parse(line.substring(2));
                text += content;
                if (!soundPlayed && text.trim().length > 0 && !text.includes("<SEND_EMAIL>")) {
                  playNotificationSound();
                  soundPlayed = true;
                }
              } catch (e) {}
            }
          }
          
          const displayText = text.split("<SEND_EMAIL>")[0];

          setMessages((prev) => {
            const newArray = [...prev];
            newArray[newArray.length - 1] = { ...newArray[newArray.length - 1], content: displayText };
            return newArray;
          });
        }
      }

      const sendEmailRegex = /<SEND_EMAIL>([\s\S]*?)<\/SEND_EMAIL>/;
      const match = text.match(sendEmailRegex);
      if (match) {
        try {
          const emailData = JSON.parse(match[1]);
          await sendContactEmail({
            ...emailData,
            message: emailData.message ? `[ΑΠΟ AI CHATBOT (FULL SCREEN)]\n\n${emailData.message}` : undefined
          });

          if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "conversion", {
              "send_to": "AW-18166808794/sHuvCLrHgq4cENqBztZD",
              "value": 1.0,
              "currency": "EUR"
            });
          }
        } catch(e) {}
      }
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: "Συγγνώμη, υπήρξε ένα σφάλμα. Παρακαλώ δοκιμάστε ξανά." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input?.trim() || isLoading) return;
    append({ id: Date.now().toString(), role: "user", content: input });
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderMessageContent = (content: string, role: string) => {
    if (!content) return null;
    
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        let href = part;
        // Strip trailing punctuation like dot or comma from link if present
        let cleanPart = part;
        const lastChar = part[part.length - 1];
        if (['.', ',', '!', '?'].includes(lastChar)) {
          cleanPart = part.slice(0, -1);
          href = cleanPart;
        }

        const isSgkLink = cleanPart.startsWith("https://sgk.gr") || cleanPart.startsWith("http://sgk.gr");
        const linkClass = role === "user"
          ? "text-white underline font-semibold break-all hover:opacity-90"
          : "text-[#8b5cf6] underline hover:text-[#7c3aed] font-semibold break-all";
        
        if (isSgkLink) {
          try {
            const urlObj = new URL(cleanPart);
            href = urlObj.pathname + urlObj.search + urlObj.hash;
          } catch (e) {}
          
          return (
            <span key={index}>
              <Link
                href={href}
                onClick={onClose}
                className={linkClass}
              >
                {cleanPart}
              </Link>
              {part !== cleanPart ? lastChar : ""}
            </span>
          );
        } else {
          return (
            <span key={index}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {cleanPart}
              </a>
              {part !== cleanPart ? lastChar : ""}
            </span>
          );
        }
      }
      return part;
    });
  };

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex bg-white font-body">
      {/* LEFT SIDE: Slider (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#111] overflow-hidden flex-col justify-center px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5 }}
            className="z-10 relative"
          >
            <h2 className="text-5xl xl:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              {slides[currentSlide].title}
            </h2>
            <p className="text-xl text-gray-300 max-w-md">
              {slides[currentSlide].description}
            </p>
            {slides[currentSlide].linkText && slides[currentSlide].linkUrl && (
              <div className="mt-8">
                <Link 
                  href={slides[currentSlide].linkUrl}
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#b482ff] hover:bg-[#a068f7] text-white font-bold rounded-lg transition-all duration-300 text-sm shadow-md"
                >
                  {slides[currentSlide].linkText}
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
 
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
          <Image src={slides[currentSlide].image} alt="Background" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-0" />
        
        {/* Slider dots */}
        <div className="absolute bottom-12 left-16 z-20 flex gap-3">
          {slides.map((_, i) => (
            <div 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${i === currentSlide ? "bg-[#b482ff] scale-125" : "bg-white/30 hover:bg-white/60"}`}
            />
          ))}
        </div>
      </div>
 
      {/* RIGHT SIDE: Chat Interface (SGK Colors) */}
      <div className="w-full lg:w-1/2 h-full flex flex-col bg-[#fafafa] relative">
        {/* Header */}
        <div className="bg-white px-6 py-5 flex items-center justify-between border-b border-gray-200 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full border-2 border-[#b482ff] p-0.5 shadow-sm">
              <img src="/tzitzi.png" alt="Jo-Jo" className="w-full h-full object-cover rounded-full" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4ade80] rounded-full border-2 border-white z-10" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-black">Jo-Jo</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 bg-[#4ade80] rounded-full animate-pulse" />
                Σε σύνδεση
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
 
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden shrink-0 shadow-sm mt-1">
                  <img src="/tzitzi.png" alt="Jo-Jo" className="w-full h-full object-cover" />
                </div>
              )}
              <div className={`px-5 py-4 max-w-[85%] text-[15px] leading-relaxed shadow-sm ${
                m.role === "user" 
                  ? "bg-[#b482ff] text-white rounded-2xl rounded-tr-sm" 
                  : "bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100"
              }`}>
                {renderMessageContent(m.content, m.role)}
              </div>
              {m.role === "user" && (
                <div className="w-10 h-10 rounded-full bg-[#111] text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start gap-3">
              <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden shrink-0 shadow-sm">
                <img src="/tzitzi.png" alt="Jo-Jo" className="w-full h-full object-cover grayscale-[20%]" />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-white border border-gray-100 rounded-tl-sm flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-[#b482ff]/60 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#b482ff]/60 rounded-full animate-bounce [animation-delay:-.3s]" />
                  <div className="w-2 h-2 bg-[#b482ff]/60 rounded-full animate-bounce [animation-delay:-.5s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 lg:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10">
          <form onSubmit={handleCustomSubmit} className="relative flex items-center max-w-4xl mx-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Γράψε το μήνυμά σου..."
              className="w-full pl-6 pr-16 py-4 bg-gray-50 border border-gray-200 rounded-full text-base focus:outline-none focus:border-[#b482ff] focus:ring-2 focus:ring-[#b482ff]/20 transition-all text-black"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input?.trim()}
              className="absolute right-2 w-12 h-12 bg-[#4ade80] hover:bg-[#22c55e] text-black rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:bg-[#4ade80]"
            >
              <Send size={18} className="mr-0.5 mt-0.5" />
            </button>
          </form>
          <div className="text-center mt-3 text-xs text-gray-400 font-medium">
            AI Assistant Powered by SGK
          </div>
        </div>
      </div>
    </div>
  );
}
