"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/resend";
import logo from "../assets/sgk-logo.png";
import linkedinIcon from "../assets/linkedin.png";
import githubIcon from "../assets/github.png";
import behanceIcon from "../assets/behance.png";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setIsSubmitting(true);
    try {
      await sendContactEmail({
        type: "newsletter",
        email: newsletterEmail
      });
      toast.success("Ευχαριστούμε για την εγγραφή!");

      // Google Ads Conversion tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          'send_to': 'AW-18166808794/sHuvCLrHgq4cENqBztZD',
          'value': 1.0,
          'currency': 'EUR'
        });
      }

      setNewsletterEmail("");
    } catch (error) {
      toast.error("Κάτι πήγε στραβά. Δοκιμάστε ξανά.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#101010] text-white pt-20 pb-10 border-t border-white/5 font-sans">
      <div className="container mx-auto px-6">
        {/* ... existing sections ... */}
        <div className="mb-16">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white mb-10">Πελάτες μας:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-2xl font-bold tracking-widest leading-none">SKINNERA</span>
              <p className="text-sm text-white leading-relaxed max-w-[200px]">
                Business Operations & Loyalty Platform
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-2xl font-bold tracking-tighter leading-none">KM-FIBER</span>
              <p className="text-sm text-white leading-relaxed max-w-[200px]">
                Telecom Infrastructure & Workforce Management
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-2xl font-bold uppercase leading-none">REKRUA</span>
              <p className="text-sm text-white leading-relaxed max-w-[200px]">
                AI-Powered HR & Candidate Screening
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-2xl font-bold uppercase leading-none tracking-tight underline decoration-primary decoration-4 underline-offset-4">SIGMALABS</span>
              <p className="text-sm text-white leading-relaxed max-w-[200px]">
                Agentic AI for E-commerce Operations
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section - Partnerships & Recognition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-12 border-t border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white mb-8">Συνεργασίες:</p>
            <div className="flex flex-wrap items-center gap-10 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-xl font-bold">Microsoft</span>
              <span className="text-xl font-bold italic">aws</span>
              <span className="text-xl font-bold">Google Cloud</span>
            </div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white mb-8">Αναγνώριση:</p>
            <div className="flex flex-wrap items-center gap-10 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-xl font-bold tracking-widest">INTED</span>
              <span className="text-xl font-bold tracking-widest">EDULEARN</span>
            </div>
          </div>
        </div>

        {/* Bottom Main - Company Info, Services Nav & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-white/5 mb-20">
          <div className="lg:col-span-4 flex flex-col gap-8">
            <img src="/sgk-logo.png" alt="SGK Logo" className="h-16 w-auto self-start brightness-0 invert" />
            <div className="space-y-1 text-sm text-white">
              <p className="font-bold text-white mb-2 text-base">SGK Software Development</p>

              <div className="flex flex-col gap-3 pt-4">
                <p className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                  <a href="mailto:info@sgk.gr">info@sgk.gr</a>
                </p>
                <p className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                  <a href="tel:6999524389">6999524389</a>
                </p>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span>ΕΡΜΟΥ 1 ΚΑΙ ΛΥΚΟΒΡΥΣΕΩΣ 14</span>
                    <span>14452 ΜΕΤΑΜΟΡΦΩΣΗ, ΑΤΤΙΚΗΣ</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 pt-6">
                <a href="https://github.com/sgk-developers/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-all duration-300" aria-label="GitHub">
                  <img src="/github.png" alt="GitHub" className="w-5 h-5 brightness-0 invert" />
                </a>
              </div>
            </div>
          </div>

          {/* Services Navigation */}
          <nav className="lg:col-span-3 flex flex-col gap-4" aria-label="Υπηρεσίες">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-2">Υπηρεσίες</h3>
            <Link href="/kataskevi-eshop" className="text-sm text-white hover:text-primary transition-colors">Κατασκευή Eshop</Link>
            <Link href="/kataskevi-eshop-woocommerce" className="text-sm text-white hover:text-primary transition-colors">Κατασκευή Eshop WooCommerce</Link>
            <Link href="/kataskevi-istoselidon" className="text-sm text-white hover:text-primary transition-colors">Κατασκευή Ιστοσελίδων</Link>
            <Link href="/web-development" className="text-sm text-white hover:text-primary transition-colors">Web Development</Link>
            <Link href="/ai-agents" className="text-sm text-white hover:text-primary transition-colors">AI Agents</Link>
            <Link href="/estimate" className="text-sm text-primary hover:underline font-bold transition-colors mt-2">→ Δωρεάν Εκτίμηση</Link>
          </nav>

          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 text-white">Εγγραφή στο Newsletter</h4>
              <p className="text-sm text-white mb-6 max-w-sm">
                Λάβετε τα τελευταία νέα για AI και Software Development απευθείας στο inbox σας.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex max-w-md">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Το email σας"
                  required
                  className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-all rounded-l-sm text-white"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-black px-6 py-3 text-sm font-bold hover:bg-white/90 transition-all rounded-r-sm disabled:opacity-50"
                >
                  {isSubmitting ? "..." : "Εγγραφή"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-white/5 gap-6 text-[11px] text-white uppercase tracking-widest">
          <p>© {new Date().getFullYear()} SGK Software Development S.A. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Πολιτική Απορρήτου</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Όροι Χρήσης</Link>
            <a href="/sitemap.xml" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">Sitemap</a>
            <a href="/llms.txt" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">AI Directory</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
