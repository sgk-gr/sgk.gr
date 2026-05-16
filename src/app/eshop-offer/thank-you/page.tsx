import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Layout, Gift } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Ευχαριστούμε | SGK Digital",
  description: "Ευχαριστούμε για το ενδιαφέρον σας. Θα επικοινωνήσουμε μαζί σας σύντομα.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <div className="container mx-auto px-6 pt-10 pb-2">
        <div className="flex justify-center lg:justify-start">
          <Link href="/" className="flex items-center">
            <img 
              src="/sgk-logo.png" 
              alt="SGK Digital" 
              className="h-16 md:h-20 w-auto brightness-0 invert" 
            />
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-20 px-6">
        <div className="max-w-2xl w-full text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary mb-10 animate-in zoom-in duration-500">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tighter mb-6 animate-in slide-in-from-bottom duration-500">
            Ευχαριστούμε για το <span className="text-primary">ενδιαφέρον</span> σας!
          </h1>

          <p className="text-xl text-muted-foreground mb-12 animate-in slide-in-from-bottom delay-100 duration-500">
            Θα επικοινωνήσουμε μαζί σας εντός 24 ωρών για να συζητήσουμε τις ανάγκες της επιχείρησής σας.
          </p>

          <div className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 mb-12 relative overflow-hidden group animate-in slide-in-from-bottom delay-200 duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Gift className="w-24 h-24 -rotate-12" />
            </div>
            <div className="relative z-10">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                Exclusive Offer
              </span>
              <p className="text-xl md:text-2xl font-bold leading-relaxed">
                🎁 Δώρο για εσάς: <span className="text-primary">Δωρεάν 1 χρόνο hosting</span> αξίας €150 με την ολοκλήρωση της κατασκευής σας
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in slide-in-from-bottom delay-300 duration-500">
            <Link 
              href="/eshop-demo" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-heading font-bold rounded-2xl hover:opacity-90 transition-all group shadow-xl shadow-primary/20"
            >
              <Layout className="w-5 h-5" />
              <span>Δείτε το Live Demo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-2"
            >
              Επιστροφή στην αρχική
            </Link>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} SGK Digital. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
