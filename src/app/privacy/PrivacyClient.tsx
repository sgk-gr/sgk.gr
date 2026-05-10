"use client";

import { motion } from "framer-motion";

export default function PrivacyClient() {
    return (
        <main className="pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8">
                        Πολιτική Απορρήτου
                    </h1>
                    <div className="prose prose-invert prose-primary max-w-none space-y-6 text-muted-foreground leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                                1. Εισαγωγή
                            </h2>
                            <p>
                                Στην SGK Software Development, σεβόμαστε την ιδιωτικότητά σας και δεσμευόμαστε για την προστασία των προσωπικών σας δεδομένων. Η παρούσα πολιτική περιγράφει πώς συλλέγουμε και χρησιμοποιούμε τα δεδομένα σας.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                                2. Δεδομένα που Συλλέγουμε
                            </h2>
                            <p>
                                Συλλέγουμε μόνο τα απαραίτητα στοιχεία που μας παρέχετε μέσω της φόρμας επικοινωνίας (όπως email και τηλέφωνο) με σκοπό την εξυπηρέτησή σας.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                                3. Χρήση Δεδομένων
                            </h2>
                            <p>
                                Τα δεδομένα σας χρησιμοποιούνται αποκλειστικά για την επικοινωνία μαζί σας σχετικά με τα projects που σας ενδιαφέρουν. Δεν μοιραζόμαστε ούτε πουλάμε τα στοιχεία σας σε τρίτους.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                                4. GDPR και Δικαιώματα
                            </h2>
                            <p>
                                Σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR), έχετε το δικαίωμα πρόσβασης, διόρθωσης ή διαγραφής των δεδομένων σας ανά πάσα στιγμή.
                            </p>
                        </section>

                        <p className="pt-10 text-sm italic">
                            Τελευταία ενημέρωση: Φεβρουάριος 2026
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
