import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/resend";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const Estimate = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.howDidYouHear || !formData.projectInfo) {
            toast.error("Παρακαλούμε συμπληρώστε όλα τα απαιτούμενα πεδία (*)");
            return;
        }

        setIsSubmitting(true);

        try {
            await sendContactEmail(formData);
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
        } catch (error) {
            toast.error("Κάτι πήγε στραβά. Δοκιμάστε ξανά αργότερα.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0b0b] text-white">
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight flex flex-wrap gap-x-3">
                            <span>Χρειάζεστε έναν συνεργάτη.</span>
                            <span className="text-[#00D16B]">Είμαστε εδώ για να βοηθήσουμε.</span>
                        </h1>
                        <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
                            Θα θέλαμε να κατανοήσουμε τις ανάγκες σας. Πριν ξεκινήσουμε, παρακαλούμε συμπληρώστε τη φόρμα ή στείλτε μας το αίτημά σας μέσω email στο <a href="mailto:hello@sgk.gr" className="text-white underline hover:text-[#00D16B] transition-colors">hello@sgk.gr</a>.
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* First Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-white/50">Όνομα*</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="bg-white/5 border-b border-white/20 px-0 py-3 focus:outline-none focus:border-[#00D16B] transition-colors"
                                    required
                                />
                            </div>
                            {/* Last Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-white/50">Επώνυμο*</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="bg-white/5 border-b border-white/20 px-0 py-3 focus:outline-none focus:border-[#00D16B] transition-colors"
                                    required
                                />
                            </div>
                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-white/50">Email*</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-white/5 border-b border-white/20 px-0 py-3 focus:outline-none focus:border-[#00D16B] transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                            {/* Phone */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-white/50">Τηλέφωνο</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="bg-white/5 border-b border-white/20 px-0 py-3 focus:outline-none focus:border-[#00D16B] transition-colors"
                                />
                            </div>
                            {/* Company Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-white/50">Όνομα Εταιρείας</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="bg-white/5 border-b border-white/20 px-0 py-3 focus:outline-none focus:border-[#00D16B] transition-colors"
                                />
                            </div>
                            {/* Source */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-white/50">Πώς μας μάθατε;*</label>
                                <input
                                    type="text"
                                    name="howDidYouHear"
                                    value={formData.howDidYouHear}
                                    onChange={handleChange}
                                    className="bg-white/5 border-b border-white/20 px-0 py-3 focus:outline-none focus:border-[#00D16B] transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-white/50">Πείτε μας για το έργο σας*</label>
                                    <textarea
                                        name="projectInfo"
                                        rows={6}
                                        value={formData.projectInfo}
                                        onChange={handleChange}
                                        className="bg-white/5 border-b border-white/20 px-0 py-3 focus:outline-none focus:border-[#00D16B] transition-colors resize-none"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="lg:col-span-4">
                                <div className="flex flex-col gap-4">
                                    <label className="text-sm font-bold uppercase tracking-wider text-white/50">Χρειάζεστε NDA πρώτα;</label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleNDAClick("Yes")}
                                            className={`px-8 py-2 border rounded-sm transition-all ${formData.needsNDA === 'Yes' ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white'}`}
                                        >
                                            Ναι
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleNDAClick("No")}
                                            className={`px-8 py-2 border rounded-sm transition-all ${formData.needsNDA === 'No' ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white'}`}
                                        >
                                            Όχι
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-8">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.marketingConsent}
                                    onChange={handleCheckboxChange}
                                    className="mt-1 w-4 h-4 rounded border-white/20 bg-transparent text-[#00D16B] focus:ring-offset-0 focus:ring-[#00D16B]"
                                />
                                <span className="text-sm text-white/50 group-hover:text-white transition-colors leading-snug">
                                    Συμφωνώ να λαμβάνω ενημερώσεις και επικοινωνία μάρκετινγκ από την SGK Digital.
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full md:w-auto px-12 py-5 bg-[#00D16B] text-black font-bold text-lg rounded-sm hover:brightness-110 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? "Αποστολή..." : "Λήψη Δωρεάν Εκτίμησης"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />

            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="sm:max-w-md border-white/10 bg-[#0b0b0b] text-white">
                    <div className="flex flex-col items-center text-center py-6">
                        <div className="w-16 h-16 bg-[#00D16B]/10 rounded-full flex items-center justify-center mb-6">
                            <span className="text-[#00D16B] text-3xl font-bold">✓</span>
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-center mb-2">
                                Το αίτημα ελήφθη!
                            </DialogTitle>
                            <DialogDescription className="text-white/70 text-center">
                                Ευχαριστούμε για την εμπιστοσύνη σας. Η ομάδα μας θα αναλύσει το αίτημά σας και θα επικοινωνήσει μαζί σας πολύ σύντομα.
                            </DialogDescription>
                        </DialogHeader>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="mt-8 px-10 py-3 bg-white text-black font-bold rounded-sm hover:bg-white/90 transition-colors"
                        >
                            Κλείσιμο
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Estimate;
