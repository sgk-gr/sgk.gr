"use client";


import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { sendContactEmail } from '@/lib/resend';

const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
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

export default function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState("Γεια! Είμαι η Ελένη 👋");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Καλημέρα! 👋");
    else if (hour >= 12 && hour < 20) setGreeting("Καλησπέρα! 👋");
    else setGreeting("Γεια! Είμαι η Ελένη 👋");
  }, []);

  const append = async (message: any) => {
    const newMessages = [...messages, message];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: '' }]);

      let done = false;
      let text = '';
      let soundPlayed = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const content = JSON.parse(line.substring(2));
                text += content;
                if (!soundPlayed && text.trim().length > 0 && !text.includes('<SEND_EMAIL>')) {
                  playNotificationSound();
                  soundPlayed = true;
                }
              } catch (e) {}
            }
          }
          
          const displayText = text.split('<SEND_EMAIL>')[0];

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
            name: emailData.name,
            email: emailData.email,
            phone: emailData.phone,
            message: `[ΑΠΟ AI CHATBOT]\n\n${emailData.message}`
          });
        } catch(e) { 
          console.error('Failed to parse or send email data', e); 
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Συγγνώμη, υπήρξε ένα σφάλμα. Παρακαλώ δοκιμάστε ξανά.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input?.trim() || isLoading) return;
    append({ id: Date.now().toString(), role: 'user', content: input });
    setInput('');
  };

  const isExcluded = pathname?.includes("/eshop-demo");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isExcluded) return null;

  return (
    <AnimatePresence>
      {(isVisible || isOpen) && (
        <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-[90] flex flex-col items-end no-print">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="mb-4 w-[90vw] sm:w-[400px] h-[500px] max-h-[80vh] bg-card border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden"
              >
                {/* Header */}
                <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden shadow-sm">
                      <img src="/amalia-avatar.png" alt="Ελένη Παπαϊωάννου" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-primary z-10"></div>
                    </div>
                    <div>
                      <span className="block font-heading font-bold text-lg leading-none">Ελένη</span>
                      <span className="text-[11px] opacity-90 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        Online - 24/7 Support
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="hover:bg-primary/20 p-2 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/95">
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground mt-8">
                      <div className="relative w-24 h-24 rounded-full border-4 border-primary/20 overflow-hidden mx-auto mb-4 shadow-lg">
                        <img src="/amalia-avatar.png" alt="Ελένη Παπαϊωάννου" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-base font-semibold text-foreground">Γεια σας! Είμαι η Ελένη 👋</p>
                      <p className="text-sm mt-1 max-w-[250px] mx-auto">Ο AI Assistant της SGK. Είμαι εδώ για να σας βοηθήσω με απορίες, υπηρεσίες, και προσφορές!</p>
                    </div>
                  )}
                  {messages.map(m => (
                    <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {m.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full border border-border overflow-hidden shrink-0 shadow-sm">
                          <img src="/amalia-avatar.png" alt="Ελένη" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className={`px-4 py-3 max-w-[85%] text-sm whitespace-pre-wrap ${
                        m.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm shadow-sm' 
                          : 'bg-muted/80 rounded-2xl rounded-tl-sm border border-border/50 shadow-sm'
                      }`}>
                        {m.content || (m.toolInvocations && (
                          <div className="flex items-center gap-2 opacity-70 italic text-xs">
                            <Bot className="w-3 h-3 animate-spin" />
                            Αποστολή στοιχείων...
                          </div>
                        ))}
                      </div>
                      {m.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 shadow-sm">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="w-8 h-8 rounded-full border border-border overflow-hidden shrink-0 shadow-sm mr-3">
                        <img src="/amalia-avatar.png" alt="Ελένη" className="w-full h-full object-cover grayscale-[20%]" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-muted/80 border border-border/50 rounded-tl-sm flex items-center gap-2 h-[44px]">
                        <span className="text-xs text-muted-foreground font-medium italic mr-1">Η Ελένη πληκτρολογεί</span>
                        <div className="flex gap-1.5">
                          <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-.3s]" />
                          <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-.5s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleCustomSubmit} className="p-3 border-t border-border bg-card">
                  <div className="relative flex items-center">
                    <input
                      value={input || ""}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Γράψτε το μήνυμά σας στην Ελένη..."
                      className="w-full pl-4 pr-12 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input?.trim()}
                      className="absolute right-1.5 p-2 bg-primary text-primary-foreground rounded-full hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-md"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {!isOpen && (
            <div className="relative flex flex-col items-center">
              {/* Tooltip speech bubble */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
                className="absolute -top-14 bg-card text-foreground px-4 py-2 rounded-2xl shadow-xl border border-border text-sm font-semibold whitespace-nowrap z-50 flex items-center gap-2"
              >
                {greeting}
                {/* Pointer arrow */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-b border-r border-border rotate-45" />
              </motion.div>

              {/* Floating Avatar Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setIsOpen(true)}
                className="group relative w-16 h-16 rounded-full shadow-[0_0_30px_rgba(180,255,68,0.25)] hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                {/* Image and Shimmer Container */}
                <div className="absolute inset-0 rounded-full border-2 border-primary overflow-hidden bg-white">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none z-10" />
                  
                  {/* Image */}
                  <img src="/amalia-avatar.png" alt="Ελένη Παπαϊωάννου AI" className="w-full h-full object-cover relative z-0" />
                </div>
                
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full z-20 shadow-sm" />
              </motion.button>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
