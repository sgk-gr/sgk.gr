"use client";

import { motion } from "framer-motion";

export default function TermsClient() {
    return (
        <main className="pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8">
                        Όροι Χρήσης
                    </h1>
                    <div className="prose prose-invert prose-primary max-w-none space-y-6 text-muted-foreground leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                                1. Αποδοχή Όρων
                            </h2>
                            <p>
                                Χρησιμοποιώντας την ιστοσελίδα της SGK Software Development, αποδέχεστε πλήρως τους παρόντες όρους χρήσης. Εάν δεν συμφωνείτε, παρακαλούμε να μην χρησιμοποιείτε την υπηρεσία.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                                2. Υπηρεσίες & Ευθύνη
                            </h2>
                            <p>
                                Παρέχουμε υπηρεσίες ανάπτυξης λογισμικού, AI λύσεων και e-commerce. Καταβάλλουμε κάθε δυνατή προσπάθεια για την ακρίβεια των πληροφοριών και την ασφάλεια των συστημάτων μας.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                                3. Πνευματική Ιδιοκτησία
                            </h2>
                            <p>
                                Όλο το περιεχόμενο της ιστοσελίδας, συμπεριλαμβανομένων των κειμένων, γραφικών και κώδικα, αποτελεί πνευματική ιδιοκτησία της SGK Software Development εκτός αν αναφέρεται διαφορετικά.
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
