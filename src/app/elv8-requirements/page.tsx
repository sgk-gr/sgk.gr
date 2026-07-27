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

export default function Elv8Questionnaire() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [clientInfo, setClientInfo] = useState({ name: "", email: "", phone: "", company: "" });
  const [brandIdentity, setBrandIdentity] = useState({
    colors: "Μαύρο/Νέον Πράσινο",
    customColors: "",
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
        particleCount: 150,
        spread: 80,
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

  // UI Config
  const steps = [
    { id: 1, name: "Ταυτότητα", icon: Palette },
    { id: 2, name: "Προϊόν", icon: Package },
    { id: 3, name: "Αισθητική", icon: Flame },
    { id: 4, name: "Social Proof", icon: Share2 },
    { id: 5, name: "Υποβολή", icon: User }
  ];

  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-[#4ade80]/30 selection:text-[#4ade80]">
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50 px-4 py-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tight text-white">
              sgk<span className="text-[#3b5bdb]">.</span>
            </span>
            <div className="h-4 w-px bg-slate-800 hidden md:block"></div>
            <span className="text-slate-500 font-medium text-xs tracking-wider uppercase hidden md:block">
              Software Development
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#3b5bdb]/10 text-[#3b5bdb] border border-[#3b5bdb]/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              elv8 Requirements
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-4xl w-full mx-auto">
        
        {/* Progress Bar Container */}
        <div className="w-full mb-8 space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Βήμα {currentStep} από 5
            </span>
            <span className="text-xs font-black text-[#4ade80] tracking-wider">
              {Math.round(progressPercentage)}% ΟΛΟΚΛΗΡΩΘΗΚΕ
            </span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/50 p-[2px]">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#3b5bdb] to-[#4ade80] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Stepper Steps (Desktop) */}
          <div className="hidden md:flex justify-between items-center pt-2">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = currentStep >= step.id;
              return (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    isActive 
                      ? "bg-[#3b5bdb]/10 border-[#3b5bdb] text-[#3b5bdb] shadow-[0_0_15px_rgba(59,91,219,0.2)]" 
                      : "border-slate-800 text-slate-600 bg-slate-950"
                  }`}>
                    <StepIcon size={14} />
                  </div>
                  <span className={`text-xs font-bold ${isActive ? "text-slate-200" : "text-slate-600"}`}>
                    {step.name}
                  </span>
                  {step.id < 5 && <div className="w-12 h-[1px] bg-slate-800 mx-2" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {/* STEP 1 */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase italic flex items-center gap-3">
                        <Palette className="text-[#3b5bdb]" />
                        1. Χρώματα & Εταιρική Ταυτότητα
                      </h2>
                      <p className="text-xs text-slate-400">
                        Ορίστε το εικαστικό προφίλ και τα υλικά της ταυτότητας του elv8 Energy Drink.
                      </p>
                    </div>

                    {/* Colors Field */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-300">
                        1.1 Ποια είναι τα κύρια χρώματα που θέλετε να κυριαρχούν στο e-shop;
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { id: "Μαύρο/Νέον Πράσινο", label: "Μαύρο / Νέον Πράσινο", colors: ["#000000", "#39FF14"] },
                          { id: "Μαύρο/Χρυσό", label: "Μαύρο / Χρυσό", colors: ["#000000", "#FFD700"] },
                          { id: "Μπλε/Λευκό", label: "Μπλε / Λευκό", colors: ["#0000FF", "#FFFFFF"] },
                          { id: "Μαύρο/Κόκκινο", label: "Μαύρο / Κόκκινο", colors: ["#000000", "#FF0000"] },
                          { id: "Άλλο", label: "Άλλο (Hex codes)", colors: ["#334155", "#475569"] }
                        ].map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setBrandIdentity(prev => ({ ...prev, colors: option.id }))}
                            className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all ${
                              brandIdentity.colors === option.id 
                                ? "bg-slate-900/90 border-[#3b5bdb] text-white shadow-lg" 
                                : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800"
                            }`}
                          >
                            <div className="flex gap-1">
                              {option.colors.map((c, i) => (
                                <div key={i} className="w-4 h-4 rounded-full border border-slate-800" style={{ backgroundColor: c }} />
                              ))}
                            </div>
                            <span className="text-xs font-extrabold uppercase tracking-wide">{option.label}</span>
                          </button>
                        ))}
                      </div>

                      {brandIdentity.colors === "Άλλο" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pt-2"
                        >
                          <input
                            type="text"
                            placeholder="Π.χ. Primary #1E293B, Secondary #4ADE80"
                            value={brandIdentity.customColors}
                            onChange={(e) => setBrandIdentity(prev => ({ ...prev, customColors: e.target.value }))}
                            className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b5bdb] transition-colors"
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-300">
                        1.2 Ανεβάστε το Λογότυπό σας (Logo)
                      </label>
                      <div className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/20 rounded-2xl p-6 transition-colors flex flex-col items-center justify-center text-center relative">
                        <input
                          type="file"
                          accept=".svg,.png,.ai,.pdf"
                          onChange={handleLogoUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploadingLogo}
                        />
                        {uploadingLogo ? (
                          <div className="space-y-2">
                            <Loader2 className="animate-spin text-[#4ade80] mx-auto" size={32} />
                            <span className="text-xs text-slate-500 font-bold">Ανέβασμα λογοτύπου...</span>
                          </div>
                        ) : brandIdentity.logoUrl ? (
                          <div className="space-y-2">
                            <FileCheck className="text-[#4ade80] mx-auto" size={32} />
                            <span className="text-xs text-slate-200 font-extrabold block truncate max-w-xs">{brandIdentity.logoName}</span>
                            <span className="text-[10px] text-[#4ade80] font-black uppercase">✓ Επιτυχές Ανέβασμα</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="text-[#3b5bdb] mx-auto" size={32} />
                            <span className="text-xs text-slate-400 font-bold block">Κάντε κλικ ή σύρετε το λογότυπο εδώ</span>
                            <span className="text-[10px] text-slate-600 block">Αποδεκτά αρχεία: SVG, PNG (transparent), AI, PDF</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Renders Multiple Upload */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-300">
                        1.3 Ανεβάστε 3D Renders, Φωτογραφίες ή Βίντεο του προϊόντος
                      </label>
                      <div className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/20 rounded-2xl p-6 transition-colors flex flex-col items-center justify-center text-center relative">
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
                            <Loader2 className="animate-spin text-[#4ade80] mx-auto" size={32} />
                            <span className="text-xs text-slate-500 font-bold">Ανέβασμα αρχείων...</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="text-[#3b5bdb] mx-auto" size={32} />
                            <span className="text-xs text-slate-400 font-bold block">Κάντε κλικ ή σύρετε renders & υλικό εδώ</span>
                            <span className="text-[10px] text-slate-600 block">Αποδεκτά αρχεία: ZIP, PNG, JPG, MP4, MOV (Πολλαπλά)</span>
                          </div>
                        )}
                      </div>

                      {brandIdentity.mediaNames.length > 0 && (
                        <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-900 divide-y divide-slate-900/50">
                          {brandIdentity.mediaNames.map((name, index) => (
                            <div key={index} className="flex justify-between items-center py-2 text-xs">
                              <span className="truncate max-w-[200px] text-slate-400 font-medium">{name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setBrandIdentity(prev => ({
                                    ...prev,
                                    mediaUrls: prev.mediaUrls.filter((_, i) => i !== index),
                                    mediaNames: prev.mediaNames.filter((_, i) => i !== index)
                                  }));
                                }}
                                className="text-rose-500 hover:text-rose-400 transition-colors p-1"
                              >
                                <Trash2 size={14} />
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
                    <div className="space-y-2">
                      <h2 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase italic flex items-center gap-3">
                        <Package className="text-[#3b5bdb]" />
                        2. Προϊόν & Συσκευασίες
                      </h2>
                      <p className="text-xs text-slate-400">
                        Δώστε πληροφορίες για τις γεύσεις και τις συσκευασίες διάθεσης του προϊόντος.
                      </p>
                    </div>

                    {/* Flavors count */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-300">
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
                                ? "bg-slate-900/90 border-[#3b5bdb] text-white" 
                                : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800"
                            }`}
                          >
                            <span className="text-xs font-extrabold uppercase tracking-wider">{flavorOpt}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Packages (Checkboxes) */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-300">
                        2.2 Σε τι συσκευασίες θα διατίθεται το ποτό; (Επιλέξτε όσα ισχύουν)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {["Μεμονωμένο Κουτί", "4-Pack", "12-Pack", "24-Pack Tray", "Starter Kit / Sampler"].map((packOpt) => {
                          const isSelected = productPackaging.packages.includes(packOpt);
                          return (
                            <button
                              key={packOpt}
                              type="button"
                              onClick={() => handleCheckboxToggle(packOpt, productPackaging.packages, (arr) => setProductPackaging(prev => ({ ...prev, packages: arr })))}
                              className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                                isSelected 
                                  ? "bg-slate-900/90 border-[#3b5bdb] text-white" 
                                  : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800"
                              }`}
                            >
                              <span className="text-xs font-extrabold uppercase tracking-wider">{packOpt}</span>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                isSelected ? "bg-[#3b5bdb] border-[#3b5bdb] text-white" : "border-slate-800"
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
                      <label className="text-sm font-bold text-slate-300">
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
                                ? "bg-slate-900/90 border-[#3b5bdb] text-white" 
                                : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800"
                            }`}
                          >
                            <span className="text-xs font-extrabold uppercase tracking-wider">{opt}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase italic flex items-center gap-3">
                        <Flame className="text-[#3b5bdb]" />
                        3. Κοινό Στόχος & Αισθητική
                      </h2>
                      <p className="text-xs text-slate-400">
                        Προσδιορίστε το ιδανικό κοινό του elv8 και το γενικότερο vibe του brand.
                      </p>
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-300">
                        3.1 Σε ποιο κοινό στοχεύει κυρίως το elv8; (Επιλέξτε όσα ισχύουν)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          "Athletic / Gym & Fitness",
                          "Gamers / Creators / Students",
                          "Active Lifestyle & Professionals"
                        ].map((audienceOpt) => {
                          const isSelected = audienceVibe.targetAudience.includes(audienceOpt);
                          return (
                            <button
                              key={audienceOpt}
                              type="button"
                              onClick={() => handleCheckboxToggle(audienceOpt, audienceVibe.targetAudience, (arr) => setAudienceVibe(prev => ({ ...prev, targetAudience: arr })))}
                              className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                                isSelected 
                                  ? "bg-slate-900/90 border-[#3b5bdb] text-white shadow-md" 
                                  : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800"
                              }`}
                            >
                              <span className="text-xs font-extrabold uppercase tracking-wider">{audienceOpt.split(' / ')[0]}</span>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                isSelected ? "bg-[#3b5bdb] border-[#3b5bdb] text-white" : "border-slate-800"
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
                      <label className="text-sm font-bold text-slate-300">
                        3.2 Ποιο εικαστικό στυλ (Vibe) εκφράζει το brand;
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {["Neon / Cyberpunk", "Clean / Minimalist", "Dark / Aggressive", "Athletic Dynamic"].map((vibeOpt) => (
                          <button
                            key={vibeOpt}
                            type="button"
                            onClick={() => setAudienceVibe(prev => ({ ...prev, styleVibe: vibeOpt }))}
                            className={`p-4 rounded-xl border text-center transition-all h-20 flex flex-col justify-center items-center ${
                              audienceVibe.styleVibe === vibeOpt 
                                ? "bg-slate-900/90 border-[#3b5bdb] text-white" 
                                : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800"
                            }`}
                          >
                            <span className="text-[10px] font-extrabold uppercase tracking-widest">{vibeOpt}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* USPs */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-300">
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
                                  ? "bg-slate-900/90 border-[#3b5bdb] text-white" 
                                  : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800"
                              }`}
                            >
                              <span className="text-xs font-extrabold uppercase tracking-wider">{uspOpt}</span>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                isSelected ? "bg-[#3b5bdb] border-[#3b5bdb] text-white" : "border-slate-800"
                              }`}>
                                {isSelected && <Check size={10} strokeWidth={4} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <input
                        type="text"
                        placeholder="Άλλα οφέλη / USPs (διαχωρίστε με κόμμα)"
                        value={audienceVibe.customUsps}
                        onChange={(e) => setAudienceVibe(prev => ({ ...prev, customUsps: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b5bdb] transition-colors mt-2"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase italic flex items-center gap-3">
                        <Share2 className="text-[#3b5bdb]" />
                        4. Social Proof & Influencers
                      </h2>
                      <p className="text-xs text-slate-400">
                        Ρυθμίστε τη διασύνδεση με social media και το υλικό των συνεργατών/influencers.
                      </p>
                    </div>

                    {/* Influencers field */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-300 block">
                        4.1 Έχετε συνεργασίες με Αθλητές / Influencers που θα εμφανιστούν στο site;
                      </label>
                      <textarea
                        placeholder="Γράψτε ονόματα, social media links ή σύντομες περιγραφές των influencers..."
                        value={socialProof.influencerDetails}
                        onChange={(e) => setSocialProof(prev => ({ ...prev, influencerDetails: e.target.value }))}
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-900 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-[#3b5bdb] transition-colors resize-none"
                      />
                      
                      {/* Photo Upload */}
                      <div className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/20 rounded-2xl p-6 transition-colors flex flex-col items-center justify-center text-center relative mt-2">
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
                            <Loader2 className="animate-spin text-[#4ade80] mx-auto" size={32} />
                            <span className="text-xs text-slate-500 font-bold">Ανέβασμα φωτογραφιών...</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="text-[#3b5bdb] mx-auto" size={32} />
                            <span className="text-xs text-slate-400 font-bold block">Ανεβάστε φωτογραφίες των Influencers εδώ</span>
                            <span className="text-[10px] text-slate-600 block">Αποδεκτά αρχεία: JPG, PNG, WEBP (Πολλαπλά)</span>
                          </div>
                        )}
                      </div>

                      {socialProof.influencerPhotoNames.length > 0 && (
                        <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-900 divide-y divide-slate-900/50">
                          {socialProof.influencerPhotoNames.map((name, index) => (
                            <div key={index} className="flex justify-between items-center py-2 text-xs">
                              <span className="truncate max-w-[200px] text-slate-400 font-medium">{name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSocialProof(prev => ({
                                    ...prev,
                                    influencerPhotoUrls: prev.influencerPhotoUrls.filter((_, i) => i !== index),
                                    influencerPhotoNames: prev.influencerPhotoNames.filter((_, i) => i !== index)
                                  }));
                                }}
                                className="text-rose-500 hover:text-rose-400 transition-colors p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Social Feeds */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-300">
                        4.2 Θα ενσωματώσουμε Instagram/TikTok Feed ή Αξιολογήσεις;
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {["Instagram Feed", "TikTok Feed", "Αξιολογήσεις Πελατών (Reviews)", "Όλα τα παραπάνω"].map((feedOpt) => {
                          const isSelected = socialProof.socialFeeds.includes(feedOpt);
                          return (
                            <button
                              key={feedOpt}
                              type="button"
                              onClick={() => handleCheckboxToggle(feedOpt, socialProof.socialFeeds, (arr) => setSocialProof(prev => ({ ...prev, socialFeeds: arr })))}
                              className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                                isSelected 
                                  ? "bg-slate-900/90 border-[#3b5bdb] text-white" 
                                  : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800"
                              }`}
                            >
                              <span className="text-xs font-extrabold uppercase tracking-wider">{feedOpt}</span>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                isSelected ? "bg-[#3b5bdb] border-[#3b5bdb] text-white" : "border-slate-800"
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

                {/* STEP 5 (Final Contact details) */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase italic flex items-center gap-3">
                        <User className="text-[#3b5bdb]" />
                        5. Στοιχεία Επικοινωνίας
                      </h2>
                      <p className="text-xs text-slate-400">
                        Συμπληρώστε τα στοιχεία σας για την αποστολή των απαιτήσεων στην SGK Digital.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                          Όνομα / Υπεύθυνος <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Π.χ. Γιάννης Παπαδόπουλος"
                          value={clientInfo.name}
                          onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b5bdb] transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                          Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={clientInfo.email}
                          onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b5bdb] transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                          Τηλέφωνο Επικοινωνίας
                        </label>
                        <input
                          type="tel"
                          placeholder="69XXXXXXXX"
                          value={clientInfo.phone}
                          onChange={(e) => setClientInfo(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b5bdb] transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                          Επωνυμία Εταιρείας
                        </label>
                        <input
                          type="text"
                          placeholder="Π.χ. elv8 Energy I.K.E."
                          value={clientInfo.company}
                          onChange={(e) => setClientInfo(prev => ({ ...prev, company: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b5bdb] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-950/30 border border-slate-900 rounded-2xl p-4 flex gap-3 text-xs text-slate-400">
                      <AlertCircle className="text-[#3b5bdb] shrink-0" size={16} />
                      <p className="leading-relaxed">
                        Πατώντας <strong>Υποβολή</strong>, τα στοιχεία και οι απαιτήσεις που συμπληρώσατε θα σταλούν αυτόματα στην ομάδα της <strong>SGK Software Development</strong> για την έναρξη του σχεδιασμού του E-shop σας.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-900/50">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1 || isSubmitting}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all disabled:opacity-30 ${
                      currentStep === 1 
                        ? "bg-transparent text-slate-700" 
                        : "bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300"
                    }`}
                  >
                    <ChevronLeft size={14} />
                    Προηγούμενο
                  </button>

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3b5bdb] text-white hover:bg-[#3b5bdb]/90 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-lg transition-all"
                    >
                      Επόμενο
                      <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting || !clientInfo.email || !clientInfo.name}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#3b5bdb] to-[#4ade80] text-slate-950 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={14} />
                          Αποστολη...
                        </>
                      ) : (
                        <>
                          Υποβολη Απαιτησεων
                          <Check size={14} strokeWidth={3} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6 flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#4ade80]/10 text-[#4ade80] flex items-center justify-center shadow-[0_0_20px_rgba(74,222,128,0.2)] border border-[#4ade80]/20 mb-2">
                  <Check size={32} strokeWidth={3} />
                </div>
                <div className="space-y-2 max-w-md">
                  <h2 className="text-2xl font-black text-white tracking-wide uppercase italic">
                    Η υποβολή ολοκληρώθηκε!
                  </h2>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Ευχαριστούμε για το χρόνο σας. Οι απαιτήσεις για το e-shop του **elv8 Energy Drink** στάλθηκαν επιτυχώς στην **SGK Software Development**.
                  </p>
                  <p className="text-slate-500 text-[11px] leading-relaxed pt-2">
                    Ένας εξειδικευμένος συνεργάτης μας θα μελετήσει τα στοιχεία και θα επικοινωνήσει μαζί σας πολύ σύντομα για τα επόμενα βήματα.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-6 px-4 text-center text-[10px] text-slate-600 font-medium uppercase tracking-wider">
        &copy; {new Date().getFullYear()} SGK Software Development. All rights reserved. | 
        <a href="https://sgk.gr/privacy" className="hover:text-[#3b5bdb] transition-colors ml-1">Privacy Policy</a>
      </footer>
    </div>
  );
}
