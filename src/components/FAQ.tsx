import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Πόσο κοστίζει ένα project;",
    answer:
      "Κάθε project είναι μοναδικό. Η τιμή εξαρτάται από το scope, τις λειτουργίες και τα deadlines. Επικοινωνήστε μαζί μας για δωρεάν εκτίμηση κόστους χωρίς καμία δέσμευση.",
  },
  {
    question: "Πόσο χρόνο παίρνει ένα eshop;",
    answer:
      "Οι πελάτες μας λαμβάνουν έτοιμο το eshop τους νέας γενιάς σε μία εβδομάδα.",
  },
  {
    question: "Μπορείτε να υλοποιήσετε ακριβώς αυτό που έχω στο μυαλό μου;",
    answer:
      "Απολύτως. Ειδικευόμαστε σε custom λύσεις. Δεν χρησιμοποιούμε έτοιμα templates που περιορίζουν τη δημιουργικότητα. Ξεκινάμε από λευκό χαρτί και χτίζουμε την εφαρμογή πάνω στις δικές σας ανάγκες, ώστε το τελικό αποτέλεσμα να είναι ακριβώς όπως το φανταστήκατε.",
  },
  {
    question: "Είναι ασφαλή τα δεδομένα μου και η εφαρμογή μου;",
    answer:
      "Η ασφάλεια είναι προτεραιότητά μας. Χρησιμοποιούμε κορυφαίες τεχνολογίες (Supabase, Firebase, Stripe) και ακολουθούμε τα πιο αυστηρά πρωτόκολλα κρυπτογράφησης και προστασίας δεδομένων (GDPR). Η εφαρμογή σας θα είναι θωρακισμένη απέναντι σε επιθέσεις και οι συναλλαγές σας απόλυτα ασφαλείς.",
  },
  {
    question: "Τι γίνεται αν χρειαστώ αλλαγές μετά την παράδοση;",
    answer:
      "Είμαστε δίπλα σας και μετά το λανσάρισμα. Προσφέρουμε 30 ημέρες δωρεάν υποστήριξη για οτιδήποτε προκύψει, ενώ υπάρχουν ευέλικτα πακέτα συντήρησης για να εξελίσσουμε το project σας καθώς μεγαλώνει η επιχείρησή σας.",
  },
  {
    question: "Τι είναι τα AI Agentic Systems;",
    answer:
      "Είναι αυτόνομα AI συστήματα που εκτελούν εργασίες χωρίς ανθρώπινη παρέμβαση — π.χ. απαντούν σε emails, διαχειρίζονται tickets, αναλύουν data ή αυτοματοποιούν workflows, γλιτώνοντάς σας χρόνο και κόστος.",
  },
  {
    question: "Δουλεύετε με εταιρείες εκτός Ελλάδας;",
    answer:
      "Ναι, έχουμε συνεργασίες σε όλη την Ευρώπη. Η επικοινωνία γίνεται απρόσκοπτα μέσω video calls και σύγχρονων εργαλείων project management, διασφαλίζοντας ότι είστε πάντα ενημερωμένοι για την πρόοδο του έργου.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-16 sm:py-28 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            Συχνές Ερωτήσεις
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card border border-border rounded-lg px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left font-heading font-medium text-sm hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
