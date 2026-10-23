"use client";

import React, { useState, useEffect } from "react";
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
import { UserCog, Loader2, Save, X } from "lucide-react";
import { getCustomerTk } from "./AutopsiaView";

const DEFAULT_CITIES = ["Καστοριά", "Φλώρινα", "Αθήνα"];
const DEFAULT_CONTRACTORS = [
    { name: "OTE", email: "info@sgk.gr" },
    { name: "Pralios", email: "info@sgk.gr" },
    { name: "Beyondwire", email: "info@sgk.gr" },
];

interface EditCustomerModalProps {
    customer: any | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditCustomerModal({ customer, open, onOpenChange }: EditCustomerModalProps) {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    // Form states
    const [sr, setSr] = useState("");
    const [buildingId, setBuildingId] = useState("");
    const [chimney, setChimney] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [adt, setAdt] = useState("");
    const [phone, setPhone] = useState("");
    const [managerPhone, setManagerPhone] = useState("");
    const [address, setAddress] = useState("");
    const [tk, setTk] = useState("52100");
    const [floor, setFloor] = useState("");
    const [city, setCity] = useState("Καστοριά");
    const [contractor, setContractor] = useState("OTE");
    const [recipientEmail, setRecipientEmail] = useState("info@sgk.gr");
    const [priority, setPriority] = useState<"A" | "B" | "C">("B");
    const [notes, setNotes] = useState("");

    const [savedCities, setSavedCities] = useState<string[]>(DEFAULT_CITIES);
    const [savedContractors, setSavedContractors] = useState<{ name: string; email: string }[]>(DEFAULT_CONTRACTORS);

    // Sync state when customer changes or modal opens
    useEffect(() => {
        if (!customer) return;

        setSr(customer.sr || "");
        setBuildingId(customer.building_id || "");
        setChimney(customer.chimney_type || customer.chimney_number || customer.autopsia_tech_data?.chimney_number || "");
        setFirstName(customer.first_name || "");
        setLastName(customer.last_name || "");
        setFatherName(customer.father_name || "");
        setAdt(customer.adt || "");
        setPhone(customer.phone || "");
        setManagerPhone(customer.manager_phone || "");
        setAddress(customer.address || "");
        setTk(getCustomerTk(customer));
        setFloor(customer.floor || "");
        setCity(customer.city || "Καστοριά");
        setContractor(customer.contractor || "OTE");
        setRecipientEmail(customer.contractor_email || customer.autopsia_tech_data?.recipient_email || "info@sgk.gr");
        setPriority((customer.autopsia_tech_data?.priority as any) || "B");
        setNotes(customer.notes || "");

        // Load saved cities and contractors from localStorage
        try {
            const storedCities = localStorage.getItem("autopsia_saved_cities");
            if (storedCities) {
                const parsed = JSON.parse(storedCities);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setSavedCities(Array.from(new Set([...DEFAULT_CITIES, ...parsed])));
                }
            }
            const storedContractors = localStorage.getItem("autopsia_saved_contractors");
            if (storedContractors) {
                const parsed = JSON.parse(storedContractors);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setSavedContractors(parsed);
                }
            }
        } catch {}
    }, [customer, open]);

    const getDefaultTkForCity = (cityName: string) => {
        const l = cityName.toLowerCase();
        if (l.includes("φλώρινα")) return "53100";
        if (l.includes("καστοριά")) return "52100";
        if (l.includes("αθήνα") || l.includes("athens")) return "10431";
        return "52100";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customer) return;

        if (!lastName.trim()) {
            toast.error("Παρακαλώ συμπληρώστε το Επίθετο.");
            return;
        }

        if (!address.trim()) {
            toast.error("Παρακαλώ συμπληρώστε τη Διεύθυνση.");
            return;
        }

        setLoading(true);

        try {
            const finalCityName = city.trim();
            const finalContractorName = contractor.trim();
            const finalRecipientEmail = recipientEmail.trim() || "info@sgk.gr";
            const finalTk = tk.trim() || getDefaultTkForCity(finalCityName);
            const cleanChimney = chimney.trim().replace(/^[gG]/i, '').trim();

            const isKastoria = finalCityName.toLowerCase().includes("καστοριά") || finalCityName.toLowerCase().includes("kastoria");
            const isFlorina = finalCityName.toLowerCase().includes("φλώρινα") || finalCityName.toLowerCase().includes("florina");

            const currentTech = customer.autopsia_tech_data || {};
            const updatedTechData = {
                ...currentTech,
                priority: priority,
                postal_code: finalTk,
                tk: finalTk,
                chimney_number: cleanChimney,
                contractor: finalContractorName,
                contractor_email: finalRecipientEmail,
                recipient_email: finalRecipientEmail,
            };

            const updatePayload: any = {
                sr: sr.trim() || customer.sr,
                first_name: firstName.trim() || "",
                last_name: lastName.trim(),
                father_name: fatherName.trim() || null,
                adt: adt.trim() || null,
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
                autopsia_tech_data: updatedTechData,
            };

            const { error } = await supabase
                .from("customers")
                .update(updatePayload as any)
                .eq("id", customer.id);

            if (error) throw error;

            toast.success("Τα στοιχεία του πελάτη ενημερώθηκαν επιτυχώς!");
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            onOpenChange(false);
        } catch (err: any) {
            console.error("Edit customer error:", err);
            toast.error("Σφάλμα κατά την ενημέρωση: " + (err.message || "Αποτυχία"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={undefined} className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white border-slate-200 text-slate-900 shadow-2xl p-4 sm:p-6 rounded-2xl">
                <DialogHeader className="border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                            <UserCog className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900">
                                Επεξεργασία Στοιχείων Πελάτη
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm text-slate-500 font-medium">
                                Ενημερώστε τα στοιχεία της αυτοψίας για {customer?.address || customer?.sr}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* Identification Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="edit-sr" className="text-xs font-bold text-slate-700">SR</Label>
                            <Input
                                id="edit-sr"
                                value={sr}
                                onChange={(e) => setSr(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="edit-buildingId" className="text-xs font-bold text-slate-700">Building ID</Label>
                            <Input
                                id="edit-buildingId"
                                value={buildingId}
                                onChange={(e) => setBuildingId(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="edit-chimney" className="text-xs font-bold text-slate-700">Αρ. Καμπίνας</Label>
                            <Input
                                id="edit-chimney"
                                value={chimney}
                                onChange={(e) => setChimney(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Customer Personal Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2 space-y-1">
                            <Label htmlFor="edit-lastName" className="text-xs font-bold text-slate-700">
                                Επίθετο <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                            <Label htmlFor="edit-firstName" className="text-xs font-bold text-slate-700">Όνομα</Label>
                            <Input
                                id="edit-firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                            <Label htmlFor="edit-fatherName" className="text-xs font-bold text-slate-700">Όνομα Πατρός</Label>
                            <Input
                                id="edit-fatherName"
                                value={fatherName}
                                onChange={(e) => setFatherName(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                            <Label htmlFor="edit-adt" className="text-xs font-bold text-slate-700">Α.Δ.Τ.</Label>
                            <Input
                                id="edit-adt"
                                value={adt}
                                onChange={(e) => setAdt(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Phones */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="edit-phone" className="text-xs font-bold text-slate-700">Τηλέφωνο Πελάτη</Label>
                            <Input
                                id="edit-phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="edit-managerPhone" className="text-xs font-bold text-slate-700">Τηλ. Διαχειριστή</Label>
                            <Input
                                id="edit-managerPhone"
                                value={managerPhone}
                                onChange={(e) => setManagerPhone(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Address, TK & Floor */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2 space-y-1">
                            <Label htmlFor="edit-address" className="text-xs font-bold text-slate-700">
                                Διεύθυνση <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="sm:col-span-1 space-y-1">
                            <Label htmlFor="edit-tk" className="text-xs font-bold text-slate-700">
                                Τ.Κ.
                            </Label>
                            <Input
                                id="edit-tk"
                                value={tk}
                                onChange={(e) => setTk(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="sm:col-span-1 space-y-1">
                            <Label htmlFor="edit-floor" className="text-xs font-bold text-slate-700">Όροφος</Label>
                            <Input
                                id="edit-floor"
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* City & Contractor */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="edit-city" className="text-xs font-bold text-slate-700">Πόλη</Label>
                            <Select value={city} onValueChange={(val) => {
                                setCity(val);
                                setTk(getDefaultTkForCity(val));
                            }}>
                                <SelectTrigger className="h-9 bg-white border-slate-300 text-slate-900 text-xs font-semibold">
                                    <SelectValue placeholder="Επιλέξτε πόλη" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-lg">
                                    {savedCities.map(c => (
                                        <SelectItem key={c} value={c} className="text-xs font-semibold cursor-pointer">
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="edit-contractor" className="text-xs font-bold text-slate-700">Εργολάβος</Label>
                            <Select value={contractor} onValueChange={(val) => {
                                setContractor(val);
                                const match = savedContractors.find(c => c.name === val);
                                if (match) setRecipientEmail(match.email);
                            }}>
                                <SelectTrigger className="h-9 bg-white border-slate-300 text-slate-900 text-xs font-semibold">
                                    <SelectValue placeholder="Επιλέξτε εργολάβο" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-lg">
                                    {savedContractors.map(c => (
                                        <SelectItem key={c.name} value={c.name} className="text-xs font-semibold cursor-pointer">
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="edit-priority" className="text-xs font-bold text-slate-700">Προτεραιότητα</Label>
                            <Select value={priority} onValueChange={(val: "A" | "B" | "C") => setPriority(val)}>
                                <SelectTrigger className="h-9 bg-white border-slate-300 text-slate-900 text-xs font-semibold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-lg">
                                    <SelectItem value="A" className="text-xs font-bold text-rose-600">Επείγουσα (A)</SelectItem>
                                    <SelectItem value="B" className="text-xs font-bold text-blue-600">Κανονική (B)</SelectItem>
                                    <SelectItem value="C" className="text-xs font-bold text-slate-600">Χαμηλή (C)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Email Recipient */}
                    <div className="space-y-1">
                        <Label htmlFor="edit-recipientEmail" className="text-xs font-bold text-slate-700">Email Παραλήπτη Εργολάβου</Label>
                        <Input
                            id="edit-recipientEmail"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                        <Label htmlFor="edit-notes" className="text-xs font-bold text-slate-700">Σημειώσεις</Label>
                        <Textarea
                            id="edit-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ειδικές παρατηρήσεις για την αυτοψία..."
                            rows={2}
                            className="bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500 resize-none"
                        />
                    </div>

                    <DialogFooter className="gap-2 pt-3 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="h-10 text-xs font-bold bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
                        >
                            <X className="h-4 w-4 mr-1.5" />
                            Ακύρωση
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-10 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                                    Αποθήκευση...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-1.5" />
                                    Αποθήκευση Αλλαγών
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
