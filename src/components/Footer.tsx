import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/resend";
import logo from "../assets/sgk-logo.png";
import linkedinIcon from "../assets/linkedin.png";
import githubIcon from "../assets/github.png";
import behanceIcon from "../assets/behance.png";

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
      setNewsletterEmail("");
    } catch (error) {
      toast.error("Κάτι πήγε στραβά. Δοκιμάστε ξανά.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#0b0b0b] text-white pt-20 pb-10 border-t border-white/5 font-sans">
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
            </div>
          </div>
        </div>

        {/* Bottom Main - Company Info & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-white/5 mb-20">
          <div className="lg:col-span-6 flex flex-col gap-8">
            <img src={logo} alt="SGK Logo" className="h-16 w-auto self-start brightness-0 invert" />
            <div className="space-y-1 text-sm text-white">
              <p className="font-bold text-white mb-2 text-base">SGK Software Development</p>

              <p className="pt-4">
                <a href="mailto:hello@sgk.gr" className="hover:text-primary transition-colors">hello@sgk.gr</a>
              </p>
              <div className="flex items-center gap-6 pt-6">
                <a href="https://github.com/sgk-developers/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-all duration-300" aria-label="GitHub">
                  <img src={githubIcon} alt="GitHub" className="w-5 h-5 brightness-0 invert" />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-8">
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
            <Link to="/privacy" className="hover:text-primary transition-colors">Πολιτική Απορρήτου</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Όροι Χρήσης</Link>
            <a href="/sitemap.xml" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
