"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/resend";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

const EstimateClient = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [captcha, setCaptcha] = useState({ question: "", result: 0, answer: "" });
    const [honeypot, setHoneypot] = useState("");
    const [mounted, setMounted] = useState(false);

    const generateCaptcha = () => {
        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let n1, n2, res;
        if (op === '+') {
            n1 = Math.floor(Math.random() * 40) + 10;
            n2 = Math.floor(Math.random() * 40) + 10;
            res = n1 + n2;
        } else if (op === '-') {
            n1 = Math.floor(Math.random() * 30) + 20;
            n2 = Math.floor(Math.random() * 19) + 1;
            res = n1 - n2;
        } else {
            n1 = Math.floor(Math.random() * 8) + 2;
            n2 = Math.floor(Math.random() * 8) + 2;
            res = n1 * n2;
        }
        const sign = op === '*' ? 'x' : op;
        return { question: `${n1} ${sign} ${n2}`, result: res, answer: "" };
    };

    useEffect(() => {
        setMounted(true);
        setCaptcha(generateCaptcha());
    }, []);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        howDidYouHear: "",
        projectInfo: "",
        needsNDA: "No",
        marketingConsent: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, marketingConsent: e.target.checked }));
    };

    const handleNDAClick = (value: string) => {
        setFormData(prev => ({ ...prev, needsNDA: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (honeypot) return;

        if (parseInt(captcha.answer) !== captcha.result) {
            toast.error("Λάθος απάντηση ελέγχου ασφαλείας. Προσπαθήστε ξανά.");
            setCaptcha(generateCaptcha());
            return;
        }

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.howDidYouHear || !formData.projectInfo) {
            toast.error("Παρακαλούμε συμπληρώστε όλα τα απαιτούμενα πεδία (*)");
            return;
        }

        setIsSubmitting(true);

        try {
            await sendContactEmail(formData);
            // Google Ads Conversion tracking
            if (typeof window !== 'undefined' && (window as any).gtag) {
                console.log("🔔 [Analytics] Triggering Google Ads Conversion (Estimate Page)...");
                (window as any).gtag('event', 'conversion', {
                    'send_to': 'AW-18166808794/sHuvCLrHgq4cENqBztZD',
                    'value': 1.0,
                    'currency': 'EUR'
                });
                console.log("✅ [Analytics] Conversion sent to AW-18166808794");
            }

            setShowSuccessModal(true);

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                company: "",
                howDidYouHear: "",
                projectInfo: "",
                needsNDA: "No",
                marketingConsent: false
            });
            setCaptcha(generateCaptcha());
        } catch (error) {
            toast.error("Κάτι πήγε στραβά. Δοκιμάστε ξανά αργότερα.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f2ea] text-black font-sans selection:bg-[#3b5bdb] selection:text-white">
            <Navbar />

            <main className="pt-32 pb-24 px-4 sm:px-6">
                <div className="container mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-16 text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                            Χρειάζεστε συνεργάτη;<br/>
                            <span className="text-[#3b5bdb]">Είμαστε εδώ.</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Θα θέλαμε να κατανοήσουμε τις ανάγκες σας. Παρακαλούμε συμπληρώστε τη φόρμα ή στείλτε μας το αίτημά σας στο <a href="mailto:info@sgk.gr" className="text-[#3b5bdb] font-bold hover:underline transition-all">info@sgk.gr</a>.
                        </p>
                    </motion.div>

                    <div className="bg-white p-8 md:p-12 shadow-2xl rounded-sm">
                        <form onSubmit={handleSubmit} className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* First Name */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-500">Όνομα*</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="bg-transparent border-b-2 border-gray-200 px-0 py-3 focus:outline-none focus:border-[#3b5bdb] transition-colors text-black"
                                        required
                                    />
                                </div>
                                {/* Last Name */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-500">Επώνυμο*</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="bg-transparent border-b-2 border-gray-200 px-0 py-3 focus:outline-none focus:border-[#3b5bdb] transition-colors text-black"
                                        required
                                    />
                                </div>
                                {/* Email */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-500">Email*</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="bg-transparent border-b-2 border-gray-200 px-0 py-3 focus:outline-none focus:border-[#3b5bdb] transition-colors text-black"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Phone */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-500">Τηλέφωνο</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="bg-transparent border-b-2 border-gray-200 px-0 py-3 focus:outline-none focus:border-[#3b5bdb] transition-colors text-black"
                                    />
                                </div>
                                {/* Company Name */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-500">Όνομα Εταιρείας</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="bg-transparent border-b-2 border-gray-200 px-0 py-3 focus:outline-none focus:border-[#3b5bdb] transition-colors text-black"
                                    />
                                </div>
                                {/* Source */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-500">Πώς μας μάθατε;*</label>
                                    <input
                                        type="text"
                                        name="howDidYouHear"
                                        value={formData.howDidYouHear}
                                        onChange={handleChange}
                                        className="bg-transparent border-b-2 border-gray-200 px-0 py-3 focus:outline-none focus:border-[#3b5bdb] transition-colors text-black"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-500">Πείτε μας για το έργο σας*</label>
                                        <textarea
                                            name="projectInfo"
                                            rows={5}
                                            value={formData.projectInfo}
                                            onChange={handleChange}
                                            className="bg-transparent border-b-2 border-gray-200 px-0 py-3 focus:outline-none focus:border-[#3b5bdb] transition-colors resize-none text-black"
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="lg:col-span-4">
                                    <div className="flex flex-col gap-4">
                                        <label className="text-sm font-bold text-gray-500">Χρειάζεστε NDA;</label>
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => handleNDAClick("Yes")}
                                                className={`px-8 py-2 rounded-sm font-bold transition-all ${formData.needsNDA === 'Yes' ? 'bg-[#3b5bdb] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                            >
                                                Ναι
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleNDAClick("No")}
                                                className={`px-8 py-2 rounded-sm font-bold transition-all ${formData.needsNDA === 'No' ? 'bg-[#3b5bdb] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                            >
                                                Όχι
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-8 pt-4">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={formData.marketingConsent}
                                        onChange={handleCheckboxChange}
                                        className="mt-1 w-5 h-5 rounded border-gray-300 bg-transparent text-[#3b5bdb] focus:ring-offset-0 focus:ring-[#3b5bdb] cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-500 group-hover:text-black transition-colors leading-snug">
                                        Συμφωνώ να λαμβάνω ενημερώσεις και επικοινωνία μάρκετινγκ από την SGK Software Development.
                                    </span>
                                </label>

                                <input 
                                    type="text" 
                                    value={honeypot} 
                                    onChange={(e) => setHoneypot(e.target.value)} 
                                    style={{ display: 'none' }} 
                                    tabIndex={-1} 
                                    autoComplete="off" 
                                />
                                <div className="flex flex-col gap-2 max-w-xs">
                                    <label className="text-sm font-bold text-gray-500">
                                        Επαλήθευση: {mounted ? `Πόσο κάνει ${captcha.question} ;` : 'Φόρτωση...'} *
                                    </label>
                                    <input
                                        type="text"
                                        value={captcha.answer}
                                        onChange={(e) => setCaptcha({ ...captcha, answer: e.target.value })}
                                        className="bg-transparent border-b-2 border-gray-200 px-0 py-3 focus:outline-none focus:border-[#3b5bdb] transition-colors text-black"
                                        placeholder="Αποτέλεσμα"
                                        required
                                    />
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full md:w-auto px-12 py-5 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 shadow-xl rounded-sm"
                                    >
                                        {isSubmitting ? "Αποστολή..." : "Λήψη Δωρεάν Εκτίμησης"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />

            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="sm:max-w-md border-gray-200 bg-white text-black shadow-2xl">
                    <div className="flex flex-col items-center text-center py-6">
                        <div className="w-16 h-16 bg-[#4ade80]/20 rounded-full flex items-center justify-center mb-6">
                            <span className="text-[#4ade80] text-3xl font-bold">✓</span>
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-center mb-2">
                                Το αίτημα ελήφθη!
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 text-center text-lg">
                                Ευχαριστούμε για την εμπιστοσύνη σας. Η ομάδα μας θα αναλύσει το αίτημά σας και θα επικοινωνήσει μαζί σας πολύ σύντομα.
                            </DialogDescription>
                        </DialogHeader>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="mt-8 px-10 py-3 bg-black text-white font-bold rounded-sm hover:bg-gray-800 transition-colors shadow-lg"
                        >
                            Κλείσιμο
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EstimateClient;
