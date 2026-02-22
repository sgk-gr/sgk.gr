import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, ArrowRight, Phone, CheckCircle2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/resend";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !phone) {
      toast.error("Παρακαλούμε συμπληρώστε όλα τα πεδία");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user came from eshop demo with an offer price
      const storedOfferPrice = localStorage.getItem("sgk_demo_offer_price");
      const offerPrice = storedOfferPrice ? parseInt(storedOfferPrice) : undefined;

      // Πραγματική αποστολή μέσω Resend στο spiros@sigmalabs.gr
      await sendContactEmail(email, phone, offerPrice);

      console.log("Η αποστολή ολοκληρώθηκε για:", { email, phone, offerPrice });

      // Clear the offer data after successful submission
      if (storedOfferPrice) {
        localStorage.removeItem("sgk_demo_offer_price");
        localStorage.removeItem("sgk_demo_offer_end");
      }

      setShowSuccessModal(true);

      setEmail("");
      setPhone("");
    } catch (error) {
      toast.error("Κάτι πήγε στραβά. Δοκιμάστε ξανά αργότερα.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-28 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <Mail className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-6">
            Ας συνεργαστούμε
          </h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Έχετε ένα project στο μυαλό σας; Στείλτε μας τα στοιχεία σας και θα επικοινωνήσουμε μαζί σας εντός 24 ωρών.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Το email σας"
                  required
                  className="w-full px-5 py-3.5 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all pl-12"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              <div className="relative flex-1">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Τηλέφωνο"
                  required
                  className="w-full px-5 py-3.5 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all pl-12"
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3.5 bg-primary text-primary-foreground font-heading font-semibold rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 glow-border"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Αποστολή...
                </>
              ) : (
                <>
                  Στείλτε τα στοιχεία σας
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md border-primary/20 bg-card/95 backdrop-blur-xl">
          <div className="flex flex-col items-center text-center py-6">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1
              }}
              className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading font-bold text-center mb-2">
                  Ευχαριστούμε!
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground text-center">
                  Τα στοιχεία σας στάλθηκαν με επιτυχία. Θα επικοινωνήσουμε μαζί σας εντός 24 ωρών.
                </DialogDescription>
              </DialogHeader>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setShowSuccessModal(false)}
              className="mt-8 px-8 py-2.5 bg-primary text-primary-foreground font-heading font-semibold rounded-full hover:opacity-90 transition-opacity"
            >
              Κλείσιμο
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Contact;
