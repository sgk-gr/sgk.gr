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
import { MapPin, Plus, Loader2, Navigation, Building2, User, Phone, CheckCircle2 } from "lucide-react";

interface NewAutopsiaModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NewAutopsiaModal({ open, onOpenChange }: NewAutopsiaModalProps) {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false);

    // Form state
    const [sr, setSr] = useState("");
    const [buildingId, setBuildingId] = useState("");
    const [chimney, setChimney] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [priority, setPriority] = useState<"A" | "B" | "C">("B");
    const [phone, setPhone] = useState("");
    const [managerPhone, setManagerPhone] = useState("");
    const [address, setAddress] = useState("");
    const [floor, setFloor] = useState("");
    const [city, setCity] = useState<"kastoria" | "florina" | "other">("kastoria");
    const [customCity, setCustomCity] = useState("");
    const [contractor, setContractor] = useState<string>("OTE");
    const [notes, setNotes] = useState("");

    const resetForm = () => {
        setSr("");
        setBuildingId("");
        setChimney("");
        setFirstName("");
        setLastName("");
        setLatitude("");
        setLongitude("");
        setPriority("B");
        setPhone("");
        setManagerPhone("");
        setAddress("");
        setFloor("");
        setCity("kastoria");
        setCustomCity("");
        setContractor("OTE");
        setNotes("");
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Η γεωγραφική τοποθεσία δεν υποστηρίζεται από τη συσκευή σας.");
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLatitude(pos.coords.latitude.toFixed(6));
                setLongitude(pos.coords.longitude.toFixed(6));
                setLocating(false);
                toast.success("Επιτυχής λήψη συντεταγμένων GPS!");
            },
            (err) => {
                setLocating(false);
                toast.error("Αποτυχία λήψης τοποθεσίας: " + err.message);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
            const isKastoria = city === "kastoria";
            const isFlorina = city === "florina";
            const cityName = city === "kastoria" ? "Καστοριά" : city === "florina" ? "Φλώρινα" : (customCity.trim() || "Άλλη");

            const finalSr = sr.trim() || `SR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
            const cleanChimney = chimney.trim().replace(/^[gG]/i, '').trim();

            const parsedLat = latitude.trim() ? parseFloat(latitude.trim()) : null;
            const parsedLng = longitude.trim() ? parseFloat(longitude.trim()) : null;

            const payload: any = {
                sr: finalSr,
                first_name: firstName.trim() || "",
                last_name: lastName.trim(),
                address: address.trim(),
                city: cityName,
                is_kastoria: isKastoria,
                is_florina: isFlorina,
                building_id: buildingId.trim() || null,
                chimney_type: cleanChimney || null,
                floor: floor.trim() || null,
                phone: phone.trim() || null,
                manager_phone: managerPhone.trim() || null,
                contractor: contractor,
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
                    chimney_number: cleanChimney,
                    contractor: contractor,
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

                    {/* Address & Floor */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

                        <div className="space-y-1">
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

                    {/* City & Contractor Selection (Requested specifically by user) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        {/* City Selection */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-purple-600" />
                                Πόλη
                            </Label>
                            <div className="grid grid-cols-3 gap-1.5">
                                <Button
                                    type="button"
                                    variant={city === "kastoria" ? "default" : "outline"}
                                    size="sm"
                                    className={`h-8 text-xs font-bold transition-all ${
                                        city === "kastoria"
                                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                                    }`}
                                    onClick={() => setCity("kastoria")}
                                >
                                    Καστοριά
                                </Button>
                                <Button
                                    type="button"
                                    variant={city === "florina" ? "default" : "outline"}
                                    size="sm"
                                    className={`h-8 text-xs font-bold transition-all ${
                                        city === "florina"
                                            ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                                    }`}
                                    onClick={() => setCity("florina")}
                                >
                                    Φλώρινα
                                </Button>
                                <Button
                                    type="button"
                                    variant={city === "other" ? "default" : "outline"}
                                    size="sm"
                                    className={`h-8 text-xs font-bold transition-all ${
                                        city === "other"
                                            ? "bg-slate-800 hover:bg-slate-900 text-white"
                                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                                    }`}
                                    onClick={() => setCity("other")}
                                >
                                    Άλλη
                                </Button>
                            </div>
                            {city === "other" && (
                                <Input
                                    placeholder="Εισαγωγή ονόματος πόλης..."
                                    value={customCity}
                                    onChange={(e) => setCustomCity(e.target.value)}
                                    className="h-8 mt-1.5 bg-white border-slate-300 text-xs text-slate-900"
                                />
                            )}
                        </div>

                        {/* Contractor Selection */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <Building2 className="h-3.5 w-3.5 text-blue-600" />
                                Εργολάβος
                            </Label>
                            <Select value={contractor} onValueChange={setContractor}>
                                <SelectTrigger className="h-8 bg-white border-slate-300 text-slate-900 text-xs font-semibold">
                                    <SelectValue placeholder="Επιλέξτε εργολάβο" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-lg">
                                    <SelectItem value="OTE" className="text-xs font-semibold cursor-pointer">
                                        OTE (SGK Digital)
                                    </SelectItem>
                                    <SelectItem value="THISEAS" className="text-xs font-semibold text-blue-700 cursor-pointer">
                                        🔹 THISEAS
                                    </SelectItem>
                                    <SelectItem value="BEYONDWIRE" className="text-xs font-semibold text-violet-700 cursor-pointer">
                                        🟣 BEYONDWIRE
                                    </SelectItem>
                                    <SelectItem value="ERGATIKAT" className="text-xs font-semibold text-orange-700 cursor-pointer">
                                        🔸 ERGATIKAT
                                    </SelectItem>
                                    <SelectItem value="KASOS" className="text-xs font-semibold text-green-700 cursor-pointer">
                                        🟢 KASOS
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* GPS Coordinates & Priority */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="latitude" className="text-xs font-bold text-slate-700">Latitude</Label>
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    disabled={locating}
                                    className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5"
                                >
                                    <Navigation className={`h-2.5 w-2.5 ${locating ? "animate-spin" : ""}`} />
                                    {locating ? "Λήψη..." : "GPS"}
                                </button>
                            </div>
                            <Input
                                id="latitude"
                                placeholder="π.χ. 40.5116"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="longitude" className="text-xs font-bold text-slate-700">Longitude</Label>
                            <Input
                                id="longitude"
                                placeholder="π.χ. 21.2513"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                className="h-9 bg-white border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-700">PRIORITY</Label>
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
