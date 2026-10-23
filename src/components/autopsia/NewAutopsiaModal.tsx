"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabaseAutopsia as supabase } from "@/lib/autopsia/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MapPin, Plus, Loader2, Building2, User, Phone, CheckCircle2, Trash2, Mail } from "lucide-react";

const AUTOPSIA_CONFIG_ID = "c0000000-0000-0000-0000-000000000001";
const DEFAULT_CITIES = ["Καστοριά", "Φλώρινα", "Αθήνα"];
const DEFAULT_CONTRACTORS = [
    { name: "OTE", email: "info@sgk.gr" },
    { name: "Pralios", email: "info@sgk.gr" },
    { name: "Beyondwire", email: "info@sgk.gr" },
];

interface NewAutopsiaModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOpenEngineerSig?: () => void;
}

export function NewAutopsiaModal({ open, onOpenChange, onOpenEngineerSig }: NewAutopsiaModalProps) {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    

    // Form state
    const [sr, setSr] = useState("");
    const [buildingId, setBuildingId] = useState("");
    const [chimney, setChimney] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    
    
    const [priority, setPriority] = useState<"A" | "B" | "C">("B");
    const [phone, setPhone] = useState("");
    const [managerPhone, setManagerPhone] = useState("");
    const [address, setAddress] = useState("");
    const [tk, setTk] = useState("52100");
    const [floor, setFloor] = useState("");
    const [city, setCity] = useState<string>("Καστοριά");
    const [savedCities, setSavedCities] = useState<string[]>(DEFAULT_CITIES);
    const [newCityName, setNewCityName] = useState("");
    const [isAddingCity, setIsAddingCity] = useState(false);

    const [contractor, setContractor] = useState<string>("OTE");
    const [recipientEmail, setRecipientEmail] = useState<string>("info@sgk.gr");
    const [savedContractors, setSavedContractors] = useState<{name: string, email: string}[]>(DEFAULT_CONTRACTORS);
    const [newContractorName, setNewContractorName] = useState("");
    const [newContractorEmail, setNewContractorEmail] = useState("");
    const [isAddingContractor, setIsAddingContractor] = useState(false);

    const [notes, setNotes] = useState("");

    // Load initial configuration (both from localStorage and Supabase)
    const loadConfig = React.useCallback(async () => {
        let localCities = DEFAULT_CITIES;
        let localContractors = DEFAULT_CONTRACTORS;
        try {
            const storedCities = localStorage.getItem("autopsia_saved_cities");
            if (storedCities) {
                const parsed = JSON.parse(storedCities);
                if (Array.isArray(parsed) && parsed.length > 0) localCities = parsed;
            }
            const storedContractors = localStorage.getItem("autopsia_saved_contractors");
            if (storedContractors) {
                const parsed = JSON.parse(storedContractors);
                if (Array.isArray(parsed) && parsed.length > 0) localContractors = parsed;
            }
            setSavedCities(localCities);
            setSavedContractors(localContractors);
            if (localCities.length > 0) setCity(prev => prev || localCities[0]);
            if (localContractors.length > 0) {
                setContractor(prev => prev || localContractors[0].name);
                setRecipientEmail(prev => prev || localContractors[0].email);
            }
        } catch {}

        // Fetch fresh cloud config from Supabase to guarantee cross-device persistence
        try {
            const { data } = await supabase
                .from("customers")
                .select("autopsia_tech_data")
                .eq("id", AUTOPSIA_CONFIG_ID)
                .single();

            if (data?.autopsia_tech_data) {
                const dbCities: string[] = Array.isArray(data.autopsia_tech_data.cities)
                    ? data.autopsia_tech_data.cities
                    : [];
                const dbContractors: { name: string; email: string }[] = Array.isArray(data.autopsia_tech_data.contractors)
                    ? data.autopsia_tech_data.contractors
                    : [];

                const mergedCities = Array.from(new Set([...DEFAULT_CITIES, ...localCities, ...dbCities].map(s => s.trim()).filter(Boolean)));
                
                const cMap = new Map<string, string>();
                DEFAULT_CONTRACTORS.forEach(c => cMap.set(c.name, c.email));
                localContractors.forEach(c => cMap.set(c.name, c.email));
                dbContractors.forEach(c => cMap.set(c.name, c.email));
                const mergedContractors = Array.from(cMap.entries()).map(([name, email]) => ({ name, email }));

                setSavedCities(mergedCities);
                setSavedContractors(mergedContractors);
                localStorage.setItem("autopsia_saved_cities", JSON.stringify(mergedCities));
                localStorage.setItem("autopsia_saved_contractors", JSON.stringify(mergedContractors));

                setCity(prev => (prev && mergedCities.includes(prev)) ? prev : mergedCities[0]);
                setContractor(prev => {
                    const match = mergedContractors.find(c => c.name === prev);
                    if (match) {
                        setRecipientEmail(match.email);
                        return prev;
                    }
                    if (mergedContractors.length > 0) {
                        setRecipientEmail(mergedContractors[0].email);
                        return mergedContractors[0].name;
                    }
                    return "";
                });
            }
        } catch (err) {
            console.warn("Could not sync config with Supabase:", err);
        }
    }, []);

    React.useEffect(() => {
        loadConfig();
    }, [open, loadConfig]);

    const getDefaultTkForCity = (cityName: string) => {
        const l = cityName.toLowerCase();
        if (l.includes("φλώρινα")) return "53100";
        if (l.includes("καστοριά")) return "52100";
        if (l.includes("αθήνα") || l.includes("athens")) return "10431";
        return "52100";
    };

    const resetForm = () => {
        setSr("");
        setBuildingId("");
        setChimney("");
        setFirstName("");
        setLastName("");
        setPriority("B");
        setPhone("");
        setManagerPhone("");
        setAddress("");
        setTk("52100");
        setFloor("");
        setIsAddingCity(false);
        setNewCityName("");
        setIsAddingContractor(false);
        setNewContractorName("");
        setNewContractorEmail("");
        setNotes("");
    };

    const handleAddCity = async (cityNameToAdd?: string) => {
        const val = (cityNameToAdd || newCityName).trim();
        if (!val) return;
        const updated = Array.from(new Set([...savedCities, val]));
        setSavedCities(updated);
        setCity(val);
        setNewCityName("");
        setIsAddingCity(false);
        try {
            localStorage.setItem("autopsia_saved_cities", JSON.stringify(updated));
            await supabase.from("customers").update({
                autopsia_tech_data: {
                    cities: updated,
                    contractors: savedContractors
                }
            }).eq("id", AUTOPSIA_CONFIG_ID);
            toast.success(`Η πόλη "${val}" αποθηκεύτηκε επιτυχώς!`);
        } catch (e) {
            console.error("Save city error:", e);
        }
    };

    const handleDeleteCity = async (cityToDelete: string) => {
        if (savedCities.length <= 1) {
            toast.error("Πρέπει να παραμείνει τουλάχιστον μία πόλη.");
            return;
        }
        const updated = savedCities.filter(c => c !== cityToDelete);
        setSavedCities(updated);
        if (city === cityToDelete) {
            setCity(updated[0]);
        }
        try {
            localStorage.setItem("autopsia_saved_cities", JSON.stringify(updated));
            await supabase.from("customers").update({
                autopsia_tech_data: {
                    cities: updated,
                    contractors: savedContractors
                }
            }).eq("id", AUTOPSIA_CONFIG_ID);
            toast.success(`Η πόλη "${cityToDelete}" διαγράφηκε!`);
        } catch (e) {
            console.error("Delete city error:", e);
        }
    };

    const handleAddContractor = async (cName?: string, cEmail?: string) => {
        const nameVal = (cName || newContractorName).trim();
        const emailVal = (cEmail || newContractorEmail).trim() || "info@sgk.gr";
        if (!nameVal) {
            toast.error("Παρακαλώ συμπληρώστε όνομα εργολάβου.");
            return;
        }
        const filtered = savedContractors.filter(c => c.name.toLowerCase() !== nameVal.toLowerCase());
        const updated = [...filtered, { name: nameVal, email: emailVal }];
        setSavedContractors(updated);
        setContractor(nameVal);
        setRecipientEmail(emailVal);
        setNewContractorName("");
        setNewContractorEmail("");
        setIsAddingContractor(false);
        try {
            localStorage.setItem("autopsia_saved_contractors", JSON.stringify(updated));
            await supabase.from("customers").update({
                autopsia_tech_data: {
                    cities: savedCities,
                    contractors: updated
                }
            }).eq("id", AUTOPSIA_CONFIG_ID);
            toast.success(`Ο εργολάβος "${nameVal}" αποθηκεύτηκε επιτυχώς!`);
        } catch (e) {
            console.error("Save contractor error:", e);
        }
    };

    const handleDeleteContractor = async (contractorToDelete: string) => {
        if (savedContractors.length <= 1) {
            toast.error("Πρέπει να παραμείνει τουλάχιστον ένας εργολάβος.");
            return;
        }
        const updated = savedContractors.filter(c => c.name !== contractorToDelete);
        setSavedContractors(updated);
        if (contractor === contractorToDelete) {
            setContractor(updated[0].name);
            setRecipientEmail(updated[0].email);
        }
        try {
            localStorage.setItem("autopsia_saved_contractors", JSON.stringify(updated));
            await supabase.from("customers").update({
                autopsia_tech_data: {
                    cities: savedCities,
                    contractors: updated
                }
            }).eq("id", AUTOPSIA_CONFIG_ID);
            toast.success(`Ο εργολάβος "${contractorToDelete}" διαγράφηκε!`);
        } catch (e) {
            console.error("Delete contractor error:", e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Verify engineer signature exists before creating an autopsy
        const engineerSig = typeof window !== "undefined" ? window.localStorage.getItem("autopsia_engineer_signature") : null;
        if (!engineerSig) {
            toast.error("Απαιτείται υπογραφή μηχανικού πριν την προσθήκη αυτοψίας! Παρακαλώ καταχωρήστε πρώτα την υπογραφή σας.");
            return;
        }

        if (!lastName.trim()) {
            toast.error("Παρακαλώ συμπληρώστε το Επίθετο.");
            return;
        }
        if (!address.trim()) {
            toast.error("Παρακαλώ συμπληρώστε τη Διεύθυνση.");
            return;
        }
        if (!city.trim() && !newCityName.trim()) {
            toast.error("Παρακαλώ επιλέξτε ή προσθέστε πόλη.");
            return;
        }
        if (!contractor.trim() && !newContractorName.trim()) {
            toast.error("Παρακαλώ επιλέξτε ή προσθέστε εργολάβο.");
            return;
        }

        setLoading(true);

        try {
            const finalCityName = isAddingCity ? newCityName.trim() : city;
            const finalContractorName = isAddingContractor ? newContractorName.trim() : contractor;
            const finalRecipientEmail = isAddingContractor ? (newContractorEmail.trim() || "info@sgk.gr") : recipientEmail;
            const finalTk = (tk.trim() || getDefaultTkForCity(finalCityName));
            
            // Auto-add if they typed it but didn't click save
            if (isAddingCity && finalCityName) {
                await handleAddCity(finalCityName);
            }
            if (isAddingContractor && finalContractorName) {
                await handleAddContractor(finalContractorName, finalRecipientEmail);
            }

            // Keep backwards compatibility for legacy flags
            const isKastoria = finalCityName.toLowerCase() === "καστοριά" || finalCityName.toLowerCase() === "kastoria";
            const isFlorina = finalCityName.toLowerCase() === "φλώρινα" || finalCityName.toLowerCase() === "florina";

            const finalSr = sr.trim() || `SR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
            const cleanChimney = chimney.trim().replace(/^[gG]/i, '').trim();

            const parsedLat = null;
            const parsedLng = null;

            const payload: any = {
                sr: finalSr,
                first_name: firstName.trim() || "",
                last_name: lastName.trim(),
                address: address.trim(),
                city: finalCityName,
                is_kastoria: isKastoria,
                is_florina: isFlorina,
                building_id: buildingId.trim() || null,
                chimney_type: cleanChimney || null,
                floor: floor.trim() || null,
                phone: phone.trim() || null,
                manager_phone: managerPhone.trim() || null,
                contractor: finalContractorName,
                notes: notes.trim() || null,
                is_upcoming: true,
                autopsia_completed: false,
                autopsia_ready: false,
                is_iosif: false,
                project_status: "pending",
                photo_urls: [],
                autopsia_tech_data: {
                    priority: priority,
                    latitude: parsedLat,
                    longitude: parsedLng,
                    postal_code: finalTk,
                    tk: finalTk,
                    chimney_number: cleanChimney,
                    contractor: finalContractorName,
                    contractor_email: finalRecipientEmail,
                    recipient_email: finalRecipientEmail,
                    created_at: new Date().toISOString()
                }
            };

            const { data, error } = await supabase.from("customers").insert([payload]).select();

            if (error) throw error;

            toast.success("Η νέα αυτοψία προστέθηκε με επιτυχία!");
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            resetForm();
            onOpenChange(false);
        } catch (err: any) {
            console.error("Error creating autopsy:", err);
            toast.error("Σφάλμα κατά την αποθήκευση: " + (err.message || "Άγνωστο σφάλμα"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto bg-white text-slate-950 border border-slate-200 shadow-2xl p-5 sm:p-6 rounded-2xl">
                <DialogHeader className="border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-100 rounded-xl text-blue-700">
                            <Plus className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900">
                                Νέα Αυτοψία FTTH
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm text-slate-500 font-medium">
                                Συμπληρώστε τα στοιχεία του κτηρίου, πελάτη, πόλης και εργολάβου
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {typeof window !== "undefined" && !window.localStorage.getItem("autopsia_engineer_signature") && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                            <div className="flex items-center gap-2">
                                <span className="text-base">⚠️</span>
                                <span><strong>Προσοχή:</strong> Δεν έχει καταχωρηθεί ψηφιακή υπογραφή μηχανικού.</span>
                            </div>
                            {onOpenEngineerSig && (
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={onOpenEngineerSig}
                                    className="h-7 px-2.5 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-xs"
                                >
                                    Υπογραφή Τώρα
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Identification Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="sr" className="text-xs font-bold text-slate-700">SR</Label>
                            <Input
                                id="sr"
                                placeholder="π.χ. SR-2026-101"
                                value={sr}
                                onChange={(e) => setSr(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="buildingId" className="text-xs font-bold text-slate-700">Building ID</Label>
                            <Input
                                id="buildingId"
                                placeholder="π.χ. 152431"
                                value={buildingId}
                                onChange={(e) => setBuildingId(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="chimney" className="text-xs font-bold text-slate-700">Αρ. Καμπίνας</Label>
                            <Input
                                id="chimney"
                                placeholder="π.χ. 12"
                                value={chimney}
                                onChange={(e) => setChimney(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="firstName" className="text-xs font-bold text-slate-700">Όνομα</Label>
                            <Input
                                id="firstName"
                                placeholder="π.χ. Γεώργιος"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="lastName" className="text-xs font-bold text-slate-700">
                                Επίθετο <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="lastName"
                                placeholder="π.χ. Παπαδόπουλος"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Address, TK & Floor */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2 space-y-1">
                            <Label htmlFor="address" className="text-xs font-bold text-slate-700">
                                Διεύθυνση <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="address"
                                placeholder="π.χ. Μητροπόλεως 14, Καστοριά"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="sm:col-span-1 space-y-1">
                            <Label htmlFor="tk" className="text-xs font-bold text-slate-700">
                                Τ.Κ.
                            </Label>
                            <Input
                                id="tk"
                                placeholder="π.χ. 52100"
                                value={tk}
                                onChange={(e) => setTk(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="sm:col-span-1 space-y-1">
                            <Label htmlFor="floor" className="text-xs font-bold text-slate-700">Όροφος</Label>
                            <Input
                                id="floor"
                                placeholder="π.χ. 1ος, Ισόγειο"
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* City & Contractor Selection */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* City Selection */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-purple-600" />
                                        Πόλη
                                    </Label>
                                    {!isAddingCity && city && savedCities.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteCity(city)}
                                            className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-0.5 transition-colors cursor-pointer"
                                            title={`Διαγραφή πόλης "${city}"`}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                            <span>Διαγραφή</span>
                                        </button>
                                    )}
                                </div>

                                {!isAddingCity ? (
                                    <Select value={city} onValueChange={(val) => {
                                        if (val === "new") {
                                            setIsAddingCity(true);
                                            setNewCityName("");
                                        } else {
                                            setCity(val);
                                            setTk(getDefaultTkForCity(val));
                                        }
                                    }}>
                                        <SelectTrigger className="h-8 bg-white border-slate-300 text-slate-900 text-xs font-semibold">
                                            <SelectValue placeholder="Επιλέξτε πόλη" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-lg max-h-60">
                                            {savedCities.map(c => (
                                                <SelectItem key={c} value={c} className="text-xs font-semibold cursor-pointer">
                                                    {c}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="new" className="text-xs font-bold text-purple-600 cursor-pointer border-t mt-1 pt-1">
                                                + Προσθήκη νέας πόλης...
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="flex gap-1.5">
                                        <Input
                                            placeholder="Όνομα πόλης"
                                            value={newCityName}
                                            onChange={(e) => setNewCityName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleAddCity();
                                                }
                                            }}
                                            className="h-8 bg-white border-slate-300 text-xs text-slate-900"
                                            autoFocus
                                        />
                                        <Button type="button" onClick={() => handleAddCity()} size="sm" className="h-8 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-2.5">
                                            OK
                                        </Button>
                                        <Button type="button" onClick={() => setIsAddingCity(false)} variant="outline" size="sm" className="h-8 text-xs px-2 border-slate-300 text-slate-600">
                                            X
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Contractor Selection */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <Building2 className="h-3.5 w-3.5 text-blue-600" />
                                        Εργολάβος
                                    </Label>
                                    {!isAddingContractor && contractor && savedContractors.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteContractor(contractor)}
                                            className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-0.5 transition-colors cursor-pointer"
                                            title={`Διαγραφή εργολάβου "${contractor}"`}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                            <span>Διαγραφή</span>
                                        </button>
                                    )}
                                </div>

                                {!isAddingContractor ? (
                                    <Select value={contractor} onValueChange={(val) => {
                                        if (val === "new") {
                                            setIsAddingContractor(true);
                                            setNewContractorName("");
                                            setNewContractorEmail("");
                                        } else {
                                            setContractor(val);
                                            const found = savedContractors.find(c => c.name === val);
                                            if (found) setRecipientEmail(found.email);
                                        }
                                    }}>
                                        <SelectTrigger className="h-8 bg-white border-slate-300 text-slate-900 text-xs font-semibold">
                                            <SelectValue placeholder="Επιλέξτε εργολάβο" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-lg max-h-60">
                                            {savedContractors.map(c => (
                                                <SelectItem key={c.name} value={c.name} className="text-xs font-semibold cursor-pointer">
                                                    {c.name} <span className="text-[10px] text-slate-500 ml-1">({c.email})</span>
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="new" className="text-xs font-bold text-blue-600 cursor-pointer border-t mt-1 pt-1">
                                                + Προσθήκη νέου...
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="space-y-1.5">
                                        <Input
                                            placeholder="Όνομα εργολάβου"
                                            value={newContractorName}
                                            onChange={(e) => setNewContractorName(e.target.value)}
                                            className="h-8 bg-white border-slate-300 text-xs text-slate-900"
                                            autoFocus
                                        />
                                        <div className="flex gap-1.5">
                                            <Input
                                                type="email"
                                                placeholder="Email παραλήπτη"
                                                value={newContractorEmail}
                                                onChange={(e) => setNewContractorEmail(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleAddContractor();
                                                    }
                                                }}
                                                className="h-8 bg-white border-slate-300 text-xs text-slate-900"
                                            />
                                            <Button type="button" onClick={() => handleAddContractor()} size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-2.5">
                                                OK
                                            </Button>
                                            <Button type="button" onClick={() => setIsAddingContractor(false)} variant="outline" size="sm" className="h-8 text-xs px-2 border-slate-300 text-slate-600">
                                                X
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Email Αποστολής ZIP (Πλήρως ευθυγραμμισμένο και κομψό) */}
                        {!isAddingContractor && contractor && (
                            <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <Label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 shrink-0">
                                    <Mail className="h-3.5 w-3.5 text-blue-600" />
                                    Email Αποστολής (ZIP):
                                </Label>
                                <Input
                                    type="email"
                                    value={recipientEmail}
                                    onChange={(e) => setRecipientEmail(e.target.value)}
                                    className="h-8 text-xs bg-white border-slate-300 text-slate-800 font-medium focus-visible:ring-1 sm:max-w-xs"
                                    placeholder="Email εργολάβου"
                                />
                            </div>
                        )}
                    </div>

                    {/* Priority */}
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-slate-700">Προτεραιότητα</Label>
                        <Select value={priority} onValueChange={(val: any) => setPriority(val)}>
                            <SelectTrigger className="h-9 bg-white border-slate-300 text-slate-900 text-xs sm:text-sm font-semibold">
                                <SelectValue placeholder="Προτεραιότητα" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-lg">
                                <SelectItem value="A" className="text-xs font-bold text-red-600 cursor-pointer">
                                    A - Υψηλή
                                </SelectItem>
                                <SelectItem value="B" className="text-xs font-bold text-amber-600 cursor-pointer">
                                    B - Μεσαία (Κανονική)
                                </SelectItem>
                                <SelectItem value="C" className="text-xs font-bold text-slate-600 cursor-pointer">
                                    C - Χαμηλή
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Phones */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Τηλέφωνο</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="π.χ. 2467012345 ή 69..."
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="managerPhone" className="text-xs font-bold text-slate-700">Τηλέφωνο Διαχειριστή</Label>
                            <Input
                                id="managerPhone"
                                type="tel"
                                placeholder="π.χ. 6971234567"
                                value={managerPhone}
                                onChange={(e) => setManagerPhone(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                        <Label htmlFor="notes" className="text-xs font-bold text-slate-700">Σημειώσεις / Παρατηρήσεις</Label>
                        <Textarea
                            id="notes"
                            rows={2}
                            placeholder="π.χ. Έλεγχος εισόδου, συνεννόηση με διαχειριστή..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-white border-slate-300 text-slate-900 text-xs sm:text-sm font-medium focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                    </div>

                    <DialogFooter className="pt-2 sm:pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="w-full sm:w-auto h-9 text-xs font-bold bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                        >
                            Ακύρωση
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto h-9 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center justify-center gap-1.5"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Αποθήκευση...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    Προσθήκη Αυτοψίας
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
