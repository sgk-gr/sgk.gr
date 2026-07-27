"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Check, 
  AlertCircle, 
  Palette, 
  Package, 
  Flame, 
  Share2, 
  User, 
  Trash2, 
  Loader2,
  FileCheck
} from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

export default function Elv8Questionnaire() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [clientInfo, setClientInfo] = useState({ name: "", email: "", phone: "", company: "" });
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
    starterPack: "Ναι"
  });
  const [audienceVibe, setAudienceVibe] = useState({
    targetAudience: [] as string[],
    styleVibe: "Neon / Cyberpunk",
    usps: [] as string[],
    customUsps: ""
  });
  const [socialProof, setSocialProof] = useState({
    influencerDetails: "",
    influencerPhotoUrls: [] as string[],
    influencerPhotoNames: [] as string[],
    socialFeeds: [] as string[]
  });

  // Upload States
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

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

  const handleInfluencerPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingPhotos(true);
    try {
      const urls: string[] = [];
      const names: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i]);
        urls.push(url);
        names.push(files[i].name);
      }
      setSocialProof(prev => ({
        ...prev,
        influencerPhotoUrls: [...prev.influencerPhotoUrls, ...urls],
        influencerPhotoNames: [...prev.influencerPhotoNames, ...names]
      }));
    } catch (err) {
      console.error(err);
      alert("Αποτυχία ανεβάσματος φωτογραφιών. Δοκιμάστε ξανά.");
    } finally {
      setUploadingPhotos(false);
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

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientInfo.email || !clientInfo.name) {
      alert("Παρακαλώ συμπληρώστε τα υποχρεωτικά πεδία (Όνομα & Email)");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-elv8-requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientInfo,
          brandIdentity,
          productPackaging,
          audienceVibe,
          socialProof
        })
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setIsSuccess(true);
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
    { id: 1, name: "Ταυτότητα", icon: Palette },
    { id: 2, name: "Προϊόν", icon: Package },
    { id: 3, name: "Αισθητική", icon: Flame },
    { id: 4, name: "Social Proof", icon: Share2 },
    { id: 5, name: "Υποβολή", icon: User }
  ];

  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 flex flex-col font-sans selection:bg-[#3b5bdb]/10 selection:text-[#3b5bdb]">
      {/* Brand Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50 px-6 py-5 md:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-3xl font-bold tracking-tighter text-black font-heading">
              sgk<span className="text-[#3b5bdb]">.</span>
            </span>
            <div className="h-5 w-px bg-gray-200 hidden md:block"></div>
            <span className="text-gray-400 font-medium text-xs tracking-wider uppercase hidden md:block">
              Software Development
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
              Φόρμα Απαιτήσεων E-Shop
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 md:px-8 max-w-3xl w-full mx-auto">
        
        {/* Step Indicator Header */}
        <div className="w-full mb-8 space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                Βήμα {currentStep} από 5
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-heading">
                elv8 Energy Drink
              </h1>
            </div>
            <span className="text-xs font-bold text-[#3b5bdb] tracking-wide">
              {Math.round(progressPercentage)}% Ολοκληρώθηκε
            </span>
          </div>

          {/* Simple Progress Bar */}
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
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
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    isCurrent
                      ? "bg-[#3b5bdb] border-[#3b5bdb] text-white shadow-sm"
                      : isActive 
                        ? "bg-[#3b5bdb]/5 border-[#3b5bdb]/40 text-[#3b5bdb]" 
                        : "border-gray-200 text-gray-400 bg-white"
                  }`}>
                    <StepIcon size={13} />
                  </div>
                  <span className={`text-xs font-semibold ${isCurrent ? "text-gray-900 font-bold" : "text-gray-400"}`}>
                    {step.name}
                  </span>
                  {step.id < 5 && <div className="w-8 h-[1px] bg-gray-100 mx-1" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Clean Paper Container */}
        <div className="w-full bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative">
          
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
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
                        <Palette className="text-[#3b5bdb]" size={20} />
                        1. Χρώματα & Εταιρική Ταυτότητα (Brand Identity)
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Βοηθήστε μας να αποτυπώσουμε σωστά την ταυτότητα του elv8 Energy Drink.
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
                      <div className="border-2 border-dashed border-gray-200 hover:border-gray-300 bg-gray-50/50 rounded-xl p-6 transition-colors flex flex-col items-center justify-center text-center relative">
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
                            <span className="text-[10px] text-[#4ade80] font-bold uppercase tracking-wider block">Επιτυχής Μεταφόρτωση</span>
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
                      <div className="border-2 border-dashed border-gray-200 hover:border-gray-300 bg-gray-50/50 rounded-xl p-6 transition-colors flex flex-col items-center justify-center text-center relative">
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
                            <span className="text-[10px] text-gray-400 block">Υποστηρίζονται: ZIP, PNG, JPG, MP4, MOV (Μπορείτε να επιλέξετε πολλαπλά)</span>
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
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
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
                            <span className="text-xs uppercase tracking-wider">{flavorOpt}</span>
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
                              <span className="text-xs uppercase tracking-wider">{packOpt}</span>
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
                            <span className="text-xs uppercase tracking-wider">{opt}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
                        <Flame className="text-[#3b5bdb]" size={20} />
                        3. Κοινό Στόχος & Αισθητική (Target Audience & Vibe)
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
                              <span className="text-xs uppercase tracking-wider">{audienceOpt}</span>
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
                            <span className="text-xs uppercase tracking-wider">{vibeOpt}</span>
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
                              <span className="text-xs uppercase tracking-wider">{uspOpt}</span>
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
                  </div>
                )}

                {/* STEP 4 */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
                        <Share2 className="text-[#3b5bdb]" size={20} />
                        4. Social Proof & Influencers
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Το elv8 βασίζεται πολύ στην κοινότητα και το marketing. Ας ορίσουμε τα κοινωνικά κανάλια προβολής.
                      </p>
                    </div>

                    {/* Influencers field */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 block">
                        4.1 Έχετε συνεργασίες με Αθλητές / Influencers που θα εμφανιστούν στο site;
                      </label>
                      <textarea
                        placeholder="Πληκτρολογήστε ονόματα, links από τα προφίλ τους, ή σχόλια..."
                        value={socialProof.influencerDetails}
                        onChange={(e) => setSocialProof(prev => ({ ...prev, influencerDetails: e.target.value }))}
                        rows={3}
                        className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-800 focus:outline-none focus:border-[#3b5bdb] transition-colors resize-none"
                      />
                      
                      {/* Photo Upload */}
                      <div className="border-2 border-dashed border-gray-200 hover:border-gray-300 bg-gray-50/50 rounded-xl p-6 transition-colors flex flex-col items-center justify-center text-center relative mt-2">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleInfluencerPhotoUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploadingPhotos}
                        />
                        {uploadingPhotos ? (
                          <div className="space-y-2">
                            <Loader2 className="animate-spin text-[#3b5bdb] mx-auto" size={24} />
                            <span className="text-xs text-gray-400 font-medium">Ανέβασμα φωτογραφιών...</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="text-gray-400 mx-auto" size={24} />
                            <span className="text-xs text-gray-500 font-medium block">Μεταφορτώστε φωτογραφίες των Influencers</span>
                            <span className="text-[10px] text-gray-400 block">Υποστηρίζονται μορφές: JPG, PNG, WEBP (Πολλαπλά)</span>
                          </div>
                        )}
                      </div>

                      {socialProof.influencerPhotoNames.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 divide-y divide-gray-200/50">
                          {socialProof.influencerPhotoNames.map((name, index) => (
                            <div key={index} className="flex justify-between items-center py-2 text-xs">
                              <span className="truncate max-w-[250px] text-gray-600 font-medium">{name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSocialProof(prev => ({
                                    ...prev,
                                    influencerPhotoUrls: prev.influencerPhotoUrls.filter((_, i) => i !== index),
                                    influencerPhotoNames: prev.influencerPhotoNames.filter((_, i) => i !== index)
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

                    {/* Social Feeds */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        4.2 Θα ενσωματώσουμε Instagram/TikTok Feed ή Αξιολογήσεις; (Επιλέξτε όσα ισχύουν)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {["Instagram Feed", "TikTok Feed", "Αξιολογήσεις Πελατών (Reviews)", "Όλα τα παραπάνω"].map((feedOpt) => {
                          const isSelected = socialProof.socialFeeds.includes(feedOpt);
                          return (
                            <button
                              key={feedOpt}
                              type="button"
                              onClick={() => handleCheckboxToggle(feedOpt, socialProof.socialFeeds, (arr) => setSocialProof(prev => ({ ...prev, socialFeeds: arr })))}
                              className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                                isSelected 
                                  ? "bg-[#3b5bdb]/5 border-[#3b5bdb] text-gray-900 font-bold" 
                                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              <span className="text-xs uppercase tracking-wider">{feedOpt}</span>
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
                  </div>
                )}

                {/* STEP 5 */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
                        <User className="text-[#3b5bdb]" size={20} />
                        5. Στοιχεία Επικοινωνίας
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Συμπληρώστε τα στοιχεία σας για να καταχωρήσουμε το αίτημα και να ξεκινήσουμε το σχεδιασμό.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                          Ονοματεπώνυμο <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Π.χ. Γιάννης Παπαδόπουλος"
                          value={clientInfo.name}
                          onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#3b5bdb] transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                          Email Επικοινωνίας <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={clientInfo.email}
                          onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#3b5bdb] transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                          Τηλέφωνο
                        </label>
                        <input
                          type="tel"
                          placeholder="69XXXXXXXX"
                          value={clientInfo.phone}
                          onChange={(e) => setClientInfo(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#3b5bdb] transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                          Εταιρεία / Brand
                        </label>
                        <input
                          type="text"
                          placeholder="Π.χ. elv8 Energy"
                          value={clientInfo.company}
                          onChange={(e) => setClientInfo(prev => ({ ...prev, company: e.target.value }))}
                          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#3b5bdb] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 text-xs text-blue-900/80">
                      <AlertCircle className="text-[#3b5bdb] shrink-0" size={16} />
                      <p className="leading-relaxed">
                        Πατώντας <strong>Υποβολή Απαιτήσεων</strong>, τα στοιχεία σας θα αποσταλούν αυτόματα στην ομάδα της <strong>SGK Software Development</strong> για την ανάλυση του project σας.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1 || isSubmitting}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={14} />
                    Πίσω
                  </button>

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center gap-1 px-5 py-2.5 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                    >
                      Επόμενο
                      <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting || !clientInfo.email || !clientInfo.name}
                      className="inline-flex items-center gap-1.5 px-7 py-3 bg-[#3b5bdb] hover:bg-[#2b4bba] text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={14} />
                          Υποβολή...
                        </>
                      ) : (
                        <>
                          Υποβολή Απαιτήσεων
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
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 mb-2">
                  <Check size={28} strokeWidth={2.5} />
                </div>
                <div className="space-y-2 max-w-md">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight font-heading uppercase">
                    Επιτυχής Υποβολή!
                  </h2>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Οι απαιτήσεις για το e-shop του <strong>elv8 Energy Drink</strong> καταχωρήθηκαν επιτυχώς.
                  </p>
                  <p className="text-gray-400 text-[10px] leading-relaxed pt-2 uppercase tracking-wide font-semibold">
                    Ένας εκπρόσωπος της SGK Software Development θα επικοινωνήσει μαζί σας σύντομα.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Brand Footer */}
      <footer className="border-t border-gray-100 bg-white py-6 px-6 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} SGK Software Development. All rights reserved. | 
        <a href="https://sgk.gr/privacy" className="hover:text-[#3b5bdb] transition-colors ml-1">Privacy Policy</a>
      </footer>
    </div>
  );
}
