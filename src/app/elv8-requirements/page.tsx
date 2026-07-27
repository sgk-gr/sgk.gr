"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Check, 
  Palette, 
  Package, 
  Flame, 
  Trash2, 
  Loader2,
  FileCheck,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import confetti from "canvas-confetti";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";

export default function Elv8Questionnaire() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [brandIdentity, setBrandIdentity] = useState({
    colors: "",
    logoUrl: "",
    logoName: "",
    mediaUrls: [] as string[],
    mediaNames: [] as string[]
  });
  const [productPackaging, setProductPackaging] = useState({
    flavors: "1 Βασική Γεύση",
    packages: [] as string[],
    starterPack: "Ναι",
    erpIntegration: "",
    bankPayment: ""
  });
  const [audienceVibe, setAudienceVibe] = useState({
    targetAudience: [] as string[],
    styleVibe: "Neon / Cyberpunk",
    usps: [] as string[],
    customUsps: "",
    brandVision: ""
  });

  // Upload States
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("elv8_form_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.brandIdentity) setBrandIdentity(parsed.brandIdentity);
        if (parsed.productPackaging) setProductPackaging(parsed.productPackaging);
        if (parsed.audienceVibe) setAudienceVibe(parsed.audienceVibe);
      }
    } catch (e) {
      console.error("Error reading from localStorage", e);
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    try {
      const stateToSave = {
        currentStep,
        brandIdentity,
        productPackaging,
        audienceVibe
      };
      localStorage.setItem("elv8_form_state", JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Error writing to localStorage", e);
    }
  }, [currentStep, brandIdentity, productPackaging, audienceVibe]);

  // File Upload Helper
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload-file", {
      method: "POST",
      body: formData
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "File upload failed");
    }
    const data = await response.json();
    return data.publicUrl;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const url = await uploadFile(file);
      setBrandIdentity(prev => ({ ...prev, logoUrl: url, logoName: file.name }));
    } catch (err) {
      console.error(err);
      alert("Αποτυχία ανεβάσματος λογοτύπου. Δοκιμάστε ξανά.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingMedia(true);
    try {
      const urls: string[] = [];
      const names: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i]);
        urls.push(url);
        names.push(files[i].name);
      }
      setBrandIdentity(prev => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, ...urls],
        mediaNames: [...prev.mediaNames, ...names]
      }));
    } catch (err) {
      console.error(err);
      alert("Αποτυχία ανεβάσματος αρχείων. Δοκιμάστε ξανά.");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleCheckboxToggle = (
    value: string, 
    selectedArray: string[], 
    setter: (arr: string[]) => void
  ) => {
    if (selectedArray.includes(value)) {
      setter(selectedArray.filter(item => item !== value));
    } else {
      setter([...selectedArray, value]);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-elv8-requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandIdentity,
          productPackaging,
          audienceVibe
        })
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setIsSuccess(true);
      
      // Clear localStorage on success
      try {
        localStorage.removeItem("elv8_form_state");
      } catch (e) {
        console.error(e);
      }

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b5bdb", "#4ade80", "#111111"]
      });
    } catch (err) {
      console.error(err);
      alert("Υπήρξε ένα σφάλμα κατά την υποβολή. Παρακαλώ προσπαθήστε ξανά.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI Stepper Steps
  const steps = [
    { id: 1, name: "Ταυτότητα", icon: Palette, color: "bg-[#3b5bdb]" },
    { id: 2, name: "Προϊόν", icon: Package, color: "bg-[#4ade80]" },
    { id: 3, name: "Αισθητική", icon: Flame, color: "bg-[#facc15]" }
  ];

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-body selection:bg-[#3b5bdb]/10 selection:text-[#3b5bdb]">
      {/* Real Brand Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-24 px-4 md:px-8 max-w-3xl w-full mx-auto">
        
        {/* Step Indicator Header */}
        <div className="w-full mb-8 space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 tracking-widest block uppercase">
                Βήμα {currentStep} από 3
              </span>
              <h1 className="text-3xl md:text-4xl font-heading font-medium tracking-tight text-gray-900">
                elv8
              </h1>
            </div>
            <span className="text-xs font-bold text-[#3b5bdb] tracking-wide">
              {Math.round(progressPercentage)}% Ολοκληρώθηκε
            </span>
          </div>

          {/* Simple Progress Bar */}
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#3b5bdb]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Horizontal Stepper (Desktop) */}
          <div className="hidden md:flex justify-between items-center pt-3">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = currentStep >= step.id;
              const isCurrent = currentStep === step.id;
              return (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCurrent
                      ? "bg-[#3b5bdb] border-[#3b5bdb] text-white shadow-sm"
                      : isActive 
                        ? "bg-[#3b5bdb]/5 border-[#3b5bdb]/40 text-[#3b5bdb]" 
                        : "border-gray-200 text-gray-400 bg-white"
                  }`}>
                    <StepIcon size={14} />
                  </div>
                  <span className={`text-xs font-bold ${isCurrent ? "text-gray-900" : "text-gray-400"}`}>
                    {step.name}
                  </span>
                  {step.id < 3 && <div className="w-10 h-[1.5px] bg-gray-100 mx-2" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Clean Paper Container */}
        <div className="w-full bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative">
          
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* STEP 1 */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl md:text-2xl font-heading font-medium text-gray-900 tracking-tight flex items-center gap-2.5">
                        <Palette className="text-[#3b5bdb]" size={20} />
                        1. Χρώματα & Εταιρική Ταυτότητα
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Βοηθήστε μας να αποτυπώσουμε σωστά την ταυτότητα του elv8.
                      </p>
                    </div>

                    {/* Colors Field */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        1.1 Ποια είναι τα κύρια χρώματα που θέλετε να κυριαρχούν στο e-shop;
                      </label>
                      <textarea
                        placeholder="Περιγράψτε τα χρώματα που επιθυμείτε (π.χ. Μαύρο και Νέον Πράσινο, ή συγκεκριμένους κωδικούς HEX)..."
                        value={brandIdentity.colors}
                        onChange={(e) => setBrandIdentity(prev => ({ ...prev, colors: e.target.value }))}
                        rows={3}
                        className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-800 focus:outline-none focus:border-[#3b5bdb] focus:ring-1 focus:ring-[#3b5bdb]/20 transition-all resize-none"
                      />
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        1.2 Ανεβάστε το Λογότυπό σας (Logo)
                      </label>
                      <div className="border-2 border-dashed border-gray-200 hover:border-[#3b5bdb]/30 bg-gray-50/50 rounded-xl p-6 transition-colors flex flex-col items-center justify-center text-center relative">
                        <input
                          type="file"
                          accept=".svg,.png,.ai,.pdf"
                          onChange={handleLogoUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploadingLogo}
                        />
                        {uploadingLogo ? (
                          <div className="space-y-2">
                            <Loader2 className="animate-spin text-[#3b5bdb] mx-auto" size={24} />
                            <span className="text-xs text-gray-400 font-medium">Ανέβασμα αρχείου...</span>
                          </div>
                        ) : brandIdentity.logoUrl ? (
                          <div className="space-y-1">
                            <FileCheck className="text-[#4ade80] mx-auto" size={24} />
                            <span className="text-xs text-gray-700 font-bold block truncate max-w-xs">{brandIdentity.logoName}</span>
                            <span className="text-[10px] text-[#4ade80] font-bold tracking-wider block">Επιτυχής Μεταφόρτωση</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="text-gray-400 mx-auto" size={24} />
                            <span className="text-xs text-gray-500 font-medium block">Κάντε κλικ ή σύρετε το αρχείο του λογοτύπου εδώ</span>
                            <span className="text-[10px] text-gray-400 block">Υποστηρίζονται μορφές: SVG, PNG (διαφανές), AI, PDF</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Renders Multiple Upload */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        1.3 Ανεβάστε 3D Renders, Φωτογραφίες ή Βίντεο του προϊόντος
                      </label>
                      <div className="border-2 border-dashed border-gray-200 hover:border-[#3b5bdb]/30 bg-gray-50/50 rounded-xl p-6 transition-colors flex flex-col items-center justify-center text-center relative">
                        <input
                          type="file"
                          multiple
                          accept=".zip,.png,.jpg,.jpeg,.mp4,.mov"
                          onChange={handleMediaUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploadingMedia}
                        />
                        {uploadingMedia ? (
                          <div className="space-y-2">
                            <Loader2 className="animate-spin text-[#3b5bdb] mx-auto" size={24} />
                            <span className="text-xs text-gray-400 font-medium">Ανέβασμα αρχείων...</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="text-gray-400 mx-auto" size={24} />
                            <span className="text-xs text-gray-500 font-medium block">Επιλέξτε ή σύρετε renders & φωτογραφίες</span>
                            <span className="text-[10px] text-gray-400 block">Υποστηρίζονται: ZIP, PNG, JPG, MP4, MOV (Πολλαπλά)</span>
                          </div>
                        )}
                      </div>

                      {brandIdentity.mediaNames.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 divide-y divide-gray-200/50">
                          {brandIdentity.mediaNames.map((name, index) => (
                            <div key={index} className="flex justify-between items-center py-2 text-xs">
                              <span className="truncate max-w-[250px] text-gray-600 font-medium">{name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setBrandIdentity(prev => ({
                                    ...prev,
                                    mediaUrls: prev.mediaUrls.filter((_, i) => i !== index),
                                    mediaNames: prev.mediaNames.filter((_, i) => i !== index)
                                  }));
                                }}
                                className="text-rose-600 hover:text-rose-500 transition-colors p-1"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl md:text-2xl font-heading font-medium text-gray-900 tracking-tight flex items-center gap-2.5">
                        <Package className="text-[#3b5bdb]" size={20} />
                        2. Προϊόν & Συσκευασίες
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Σχεδιάζουμε το κατάλληλο σύστημα καλαθιού αγορών ανάλογα με τη διαμόρφωση των συσκευασιών σας.
                      </p>
                    </div>

                    {/* Flavors count */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        2.1 Πόσες γεύσεις θα υπάρχουν στο λανσάρισμα;
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {["1 Βασική Γεύση", "2-3 Γεύσεις", "Περισσότερες από 3"].map((flavorOpt) => (
                          <button
                            key={flavorOpt}
                            type="button"
                            onClick={() => setProductPackaging(prev => ({ ...prev, flavors: flavorOpt }))}
                            className={`p-4 rounded-xl border text-center transition-all ${
                              productPackaging.flavors === flavorOpt 
                                ? "bg-[#3b5bdb]/5 border-[#3b5bdb] text-gray-900 font-bold shadow-sm" 
                                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            <span className="text-xs tracking-wider">{flavorOpt}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Packages (Checkboxes) */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        2.2 Σε τι συσκευασίες θα διατίθεται το ποτό; (Επιλέξτε όσα ισχύουν)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {["Μεμονωμένο Κουτί", "4-Pack", "12-Pack", "24-Pack Tray", "Starter Kit / Sampler"].map((packOpt) => {
                          const isSelected = productPackaging.packages.includes(packOpt);
                          return (
                            <button
                              key={packOpt}
                              type="button"
                              onClick={() => handleCheckboxToggle(packOpt, productPackaging.packages, (arr) => setProductPackaging(prev => ({ ...prev, packages: arr })))}
                              className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                                isSelected 
                                  ? "bg-[#3b5bdb]/5 border-[#3b5bdb] text-gray-900 font-bold" 
                                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              <span className="text-xs tracking-wider">{packOpt}</span>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                isSelected ? "bg-[#3b5bdb] border-[#3b5bdb] text-white" : "border-gray-300 bg-white"
                              }`}>
                                {isSelected && <Check size={10} strokeWidth={4} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Starter Pack */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        2.3 Θέλετε να διαθέσουμε Starter Pack (Δοκιμαστικό πακέτο) για νέους πελάτες;
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {["Ναι", "Όχι", "Υπό συζήτηση"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setProductPackaging(prev => ({ ...prev, starterPack: opt }))}
                            className={`p-4 rounded-xl border text-center transition-all ${
                              productPackaging.starterPack === opt 
                                ? "bg-[#3b5bdb]/5 border-[#3b5bdb] text-gray-900 font-bold" 
                                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            <span className="text-xs tracking-wider">{opt}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ERP Integration */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        2.4 Θα χρειαστεί σύνδεση με ERP / σύστημα τιμολόγησης; (π.χ. Softone, Pylon)
                      </label>
                      <input
                        type="text"
                        placeholder="Πληκτρολογήστε το σύστημα ERP σας (Softone, Pylon κ.λπ.) ή αφήστε κενό..."
                        value={productPackaging.erpIntegration}
                        onChange={(e) => setProductPackaging(prev => ({ ...prev, erpIntegration: e.target.value }))}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#3b5bdb] focus:ring-1 focus:ring-[#3b5bdb]/20 transition-all"
                      />
                    </div>

                    {/* Bank / Payments */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        2.5 Ποια Τράπεζα θα χρησιμοποιήσετε για την πύλη πληρωμών; (IRIS, Πειραιώς, Eurobank κ.λπ.)
                      </label>
                      <input
                        type="text"
                        placeholder="Πληκτρολογήστε την Τράπεζα συνεργασίας σας..."
                        value={productPackaging.bankPayment}
                        onChange={(e) => setProductPackaging(prev => ({ ...prev, bankPayment: e.target.value }))}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#3b5bdb] focus:ring-1 focus:ring-[#3b5bdb]/20 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl md:text-2xl font-heading font-medium text-gray-900 tracking-tight flex items-center gap-2.5">
                        <Flame className="text-[#3b5bdb]" size={20} />
                        3. Κοινό Στόχος & Αισθητική
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Βοηθήστε μας να σχεδιάσουμε μια σελίδα που θα μιλάει στη γλώσσα του κοινού σας.
                      </p>
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        3.1 Σε ποιο κοινό στοχεύει κυρίως το elv8; (Επιλέξτε όσα ισχύουν)
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          "Athletic / Gym & Fitness (Αθλητές, Γυμναστήριο)",
                          "Gamers / Content Creators / Students (Δημιουργοί Περιεχομένου, Φοιτητές)",
                          "Active Lifestyle & Professionals (Ενεργός τρόπος ζωής, Επαγγελματίες)"
                        ].map((audienceOpt) => {
                          const isSelected = audienceVibe.targetAudience.includes(audienceOpt);
                          return (
                            <button
                              key={audienceOpt}
                              type="button"
                              onClick={() => handleCheckboxToggle(audienceOpt, audienceVibe.targetAudience, (arr) => setAudienceVibe(prev => ({ ...prev, targetAudience: arr })))}
                              className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                                isSelected 
                                  ? "bg-[#3b5bdb]/5 border-[#3b5bdb] text-gray-900 font-bold" 
                                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              <span className="text-xs tracking-wider">{audienceOpt}</span>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                isSelected ? "bg-[#3b5bdb] border-[#3b5bdb] text-white" : "border-gray-300 bg-white"
                              }`}>
                                {isSelected && <Check size={10} strokeWidth={4} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Style Vibe */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        3.2 Ποιο εικαστικό στυλ (Vibe) εκφράζει το brand;
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Neon / Cyberpunk", "Clean / Minimalist", "Dark / Aggressive", "Athletic Dynamic"].map((vibeOpt) => (
                          <button
                            key={vibeOpt}
                            type="button"
                            onClick={() => setAudienceVibe(prev => ({ ...prev, styleVibe: vibeOpt }))}
                            className={`p-4 rounded-xl border text-center transition-all flex flex-col justify-center items-center h-16 ${
                              audienceVibe.styleVibe === vibeOpt 
                                ? "bg-[#3b5bdb]/5 border-[#3b5bdb] text-gray-900 font-bold shadow-sm" 
                                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            <span className="text-xs tracking-wider">{vibeOpt}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* USPs */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        3.3 Ποια είναι τα κύρια οφέλη (USPs) του elv8 που θέλετε να τονίσουμε;
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {["Zero Sugar", "Φυσική Καφεΐνη", "Ηλεκτρολύτες & Βιταμίνες", "0 Θερμίδες", "Vegan", "Nootropics / Focus"].map((uspOpt) => {
                          const isSelected = audienceVibe.usps.includes(uspOpt);
                          return (
                            <button
                              key={uspOpt}
                              type="button"
                              onClick={() => handleCheckboxToggle(uspOpt, audienceVibe.usps, (arr) => setAudienceVibe(prev => ({ ...prev, usps: arr })))}
                              className={`p-3 rounded-xl border text-left flex justify-between items-center transition-all ${
                                isSelected 
                                  ? "bg-[#3b5bdb]/5 border-[#3b5bdb] text-gray-900 font-bold" 
                                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              <span className="text-xs tracking-wider">{uspOpt}</span>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                isSelected ? "bg-[#3b5bdb] border-[#3b5bdb] text-white" : "border-gray-300 bg-white"
                              }`}>
                                {isSelected && <Check size={10} strokeWidth={4} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <input
                        type="text"
                        placeholder="Άλλα οφέλη (π.χ. 100% Φυσικά Συστατικά - διαχωρίστε με κόμμα)"
                        value={audienceVibe.customUsps}
                        onChange={(e) => setAudienceVibe(prev => ({ ...prev, customUsps: e.target.value }))}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#3b5bdb] transition-colors mt-2"
                      />
                    </div>

                    {/* Brand Vision / Strengths */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        3.4 Ποια είναι τα δυνατά σημεία του προϊόντος και πώς θέλετε να παρουσιαστεί; (Γιατί ξεχωρίζει;)
                      </label>
                      <textarea
                        placeholder="Περιγράψτε τι κάνει το elv8 μοναδικό και πώς οραματίζεστε την προβολή του..."
                        value={audienceVibe.brandVision}
                        onChange={(e) => setAudienceVibe(prev => ({ ...prev, brandVision: e.target.value }))}
                        rows={4}
                        className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-800 focus:outline-none focus:border-[#3b5bdb] focus:ring-1 focus:ring-[#3b5bdb]/20 transition-all resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1 || isSubmitting}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider text-gray-500 hover:text-gray-950 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={14} />
                    Πίσω
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center gap-1 px-5 py-2.5 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white rounded-lg text-xs font-bold tracking-wider shadow-sm transition-all"
                    >
                      Επόμενο
                      <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1.5 px-7 py-3 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-bold tracking-wider shadow-md transition-all animate-pulse"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={14} />
                          Αποστολή...
                        </>
                      ) : (
                        <>
                          Αποστολή
                          <Check size={14} strokeWidth={2.5} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-5 flex flex-col items-center justify-center"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#4ade80] flex items-center justify-center border border-emerald-100 mb-2">
                  <Check size={28} strokeWidth={2.5} />
                </div>
                <div className="space-y-2 max-w-md">
                  <h2 className="text-2xl md:text-3xl font-heading font-medium text-gray-900 tracking-tight">
                    Επιτυχής Υποβολή!
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Οι απαιτήσεις για το e-shop του <strong>elv8</strong> καταχωρήθηκαν επιτυχώς.
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed pt-2 tracking-wide font-semibold">
                    Ένας εκπρόσωπος της SGK Software Development θα επικοινωνήσει μαζί σας σύντομα.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Dynamic Section Divider before Footer */}
      <SectionDivider leftColor="bg-[#3b5bdb]" rightColor="bg-[#101010]" />
      
      {/* Brand Footer */}
      <Footer />
    </div>
  );
}
