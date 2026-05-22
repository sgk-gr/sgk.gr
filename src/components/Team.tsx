"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const teamSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "name": "Σπύρος Τσάβος",
      "jobTitle": "Founder & Lead Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "SGK Software Development",
        "url": "https://sgk.gr"
      },
      "description": "Ο Σπύρος είναι ο άνθρωπος πίσω από την τεχνολογική κατεύθυνση της εταιρείας. Με πολυετή εμπειρία στο full-stack development και πάθος για την καινοτομία, εξειδικεύεται στη δημιουργία high-end e-shop και στην ενσωμάτωση προηγμένων AI Chat Agents.",
      "image": "https://sgk.gr/tsavos.png",
      "url": "https://sgk.gr/#team"
    },
    {
      "@type": "Person",
      "name": "Χρυσή Μουσορλή",
      "jobTitle": "UI/UX Designer & Web Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "SGK Software Development",
        "url": "https://sgk.gr"
      },
      "description": "Η Χρυσή ειδικεύεται στον σχεδιασμό και την ανάπτυξη σύγχρονων, λειτουργικών ιστοσελίδων. Διαθέτει εκτενή εξειδίκευση στο WordPress και στο Web UI/UX Design.",
      "image": "https://sgk.gr/mousorli.png",
      "url": "https://sgk.gr/#team"
    }
  ]
};

const Team = () => {
  return (
    <section id="team" className="py-16 sm:py-28 relative border-t border-border bg-slate-950/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
      />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-3">
            Η ΟΜΑΔΑ ΜΑΣ
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4">
            Οι Άνθρωποι Πίσω Από την <span className="text-gradient">Τεχνολογία</span>
          </h2>
        </div>

        <div className="max-w-5xl mx-auto space-y-10">
          {/* Spyros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-10 bg-card border border-border rounded-3xl p-8 lg:p-12 shadow-xl hover:shadow-primary/5 transition-all"
          >
            <div className="w-36 h-36 sm:w-44 sm:h-44 shrink-0 relative rounded-full overflow-hidden border-4 border-primary/20 bg-background">
              <Image 
                src="/tsavos.png" 
                alt="Σπύρος Τσάβος - Founder & Lead Developer"
                fill
                className="object-contain p-3"
                sizes="(max-width: 768px) 144px, 176px"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-heading font-bold mb-2">Σπύρος Τσάβος</h3>
              <p className="text-primary font-semibold mb-6">Founder & Lead Developer</p>
              
              <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                <p>
                  Ο Σπύρος είναι ο άνθρωπος πίσω από την τεχνολογική κατεύθυνση της εταιρείας. Με πολυετή εμπειρία στο full-stack development και πάθος για την καινοτομία, εξειδικεύεται στη δημιουργία high-end e-shop και στην ενσωμάτωση προηγμένων AI Chat Agents που μεταμορφώνουν την εξυπηρέτηση πελατών.
                </p>
                <p>
                  Παράλληλα με την επιχειρηματική του δραστηριότητα, διατηρεί ενεργή παρουσία στην επιστημονική κοινότητα. Είναι ενεργό μέλος της παγκόσμιας ερευνητικής πλατφόρμας ResearchGate, ενώ το 2025 συμμετείχε ως εισηγητής στο διεθνές συνέδριο INTED στη Βαλένθια της Ισπανίας, παρουσιάζοντας καινοτόμες λύσεις στον τομέα του mobile application development. Συνδυάζοντας τη στρατηγική σκέψη, την ακαδημαϊκή έρευνα και τον καθαρό κώδικα, βοηθάει τις επιχειρήσεις να αναβαθμίσουν την ψηφιακή τους παρουσία και να αυτοματοποιήσουν τις πωλήσεις τους.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Chrysi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row items-center gap-10 bg-card border border-border rounded-3xl p-8 lg:p-12 shadow-xl hover:shadow-primary/5 transition-all"
          >
            <div className="w-36 h-36 sm:w-44 sm:h-44 shrink-0 relative rounded-full overflow-hidden border-4 border-primary/20 bg-background">
              <Image 
                src="/mousorli.png" 
                alt="Χρυσή Μουσορλή - UI/UX Designer & Web Developer"
                fill
                className="object-contain p-3"
                sizes="(max-width: 768px) 144px, 176px"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-heading font-bold mb-2">Χρυσή Μουσορλή</h3>
              <p className="text-primary font-semibold mb-6">UI/UX Designer & Web Developer</p>
              
              <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                <p>
                  Με background που συνδυάζει τη Γραφιστική, την Τεχνολογία Πληροφορικής και τις Ψηφιακές Τεχνολογίες, η Χρυσή ειδικεύεται στον σχεδιασμό και την ανάπτυξη σύγχρονων, λειτουργικών ιστοσελίδων. Διαθέτει εκτενή εξειδίκευση στο WordPress και στο Web UI/UX Design, εστιάζοντας στη δημιουργία e-commerce εμπειριών που ξεχωρίζουν αισθητικά και αποδίδουν εμπορικά.
                </p>
                <p>
                  Η ικανότητά της να συνδυάζει τη δημιουργικότητα με καθαρές δομές κώδικα εξασφαλίζει ότι κάθε project της εταιρείας προσφέρει κορυφαία εμπειρία χρήστη.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Team;
