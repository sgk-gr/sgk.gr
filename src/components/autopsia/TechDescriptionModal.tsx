import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface TechDescriptionData {
    // Section 1
    use_escalit?: boolean;
    escalit_excavation?: "NAI" | "OXI" | null;
    external_pipe?: boolean;
    pipe_excavation?: "NAI" | "OXI" | null;
    pipe_support_fence?: boolean;
    pipe_support_building?: boolean;
    aerial?: boolean;
    other_way_1?: boolean;
    other_way_1_text?: string;

    // Section 2
    bep_internal?: boolean;
    bep_external?: boolean;
    bep_fence?: boolean;
    bep_building?: boolean;
    bep_pole?: boolean;
    bep_pilar?: boolean;
    bep_underground?: boolean;
    bep_ground?: boolean;
    bep_roof?: boolean;
    bep_piloti?: boolean;

    // Section 3
    fb_shaft?: boolean;
    fb_elevator?: boolean;
    fb_staircase?: boolean;
    fb_internal_external?: boolean;
    fb_lightwell?: boolean;
    fb_stairwell?: boolean;
    fb_other_way?: boolean;
    fb_other_way_text?: string;

    // Building Info for Sketch
    total_floors?: number;
    customer_floor_index?: number; // 0 for Υπόγειο, 1 for Ημιυπόγειο, etc.
    base_floor_index?: number; // 0 for Υπόγειο, 1 for Ημιυπόγειο, etc.
    use_fb?: boolean;
    fb_per_floor?: Record<number, boolean>; // level index -> whether it has FB enabled
    apartments_per_floor?: Record<number, number>; // level index -> number of apartments
    shops_per_floor?: Record<number, number>; // level index -> number of shops
    active_floors?: number[]; // Array of selected floor indices from FLOOR_OPTIONS
    general_remarks?: string;
}





const FLOOR_OPTIONS = [
    "Υπόγειο", "Ημιυπόγειο", "Ημιόροφος", "Ισόγειο", 
    "1ος Όροφος", "2ος Όροφος", "3ος Όροφος", "4ος Όροφος", "5ος Όροφος", "6ος Όροφος",
    "7ος Όροφος", "8ος Όροφος", "9ος Όροφος", "10ος Όροφος"
];

interface TechDescriptionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: TechDescriptionData;
    onSave: (data: TechDescriptionData) => void;
}

export function TechDescriptionModal({ open, onOpenChange, data, onSave }: TechDescriptionModalProps) {
    const [formData, setFormData] = React.useState<TechDescriptionData>(data);

    React.useEffect(() => {
        if (open) {
            setFormData(data || {});
        }
    }, [open]);

    const handleChange = (field: keyof TechDescriptionData, value: any) => {
        const updated = { ...formData, [field]: value };
        setFormData(updated);
        onSave(updated);
    };

    const handleSave = () => {
        onSave(formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={undefined} className="max-w-2xl max-h-[90vh] p-0 overflow-hidden bg-white">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold text-slate-800">Τεχνική Περιγραφή - Επιλογές</DialogTitle>
                </DialogHeader>
                
                <ScrollArea className="h-[60vh] px-6">
                    <div className="space-y-8 py-4">
                        {/* SECTION 1 */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg border-b pb-1 text-blue-700">
                                1. ΟΔΕΥΣΗ ΜΕΧΡΙ ΤΟΝ ΚΕΝΤΡΙΚΟ ΟΠΤΙΚΟ ΚΑΤΑΝΕΜΗΤΗ (B.E.P.)
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Escalit */}
                                <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="use_escalit" 
                                            checked={formData.use_escalit} 
                                            onCheckedChange={(v) => handleChange("use_escalit", v)} 
                                        />
                                        <Label htmlFor="use_escalit" className="font-semibold cursor-pointer">ΜΕ ΧΡΗΣΗ ΕΣΚΑΛΙΤ (Εισαγωγή χαλκού)</Label>
                                    </div>
                                    
                                    <div className="pl-6 space-y-2">
                                        <Label className="text-sm">Εκσκαφή πεζοδρομίου έως σωλήνα εισαγωγής:</Label>
                                        <RadioGroup 
                                            value={formData.escalit_excavation || ""} 
                                            onValueChange={(v) => handleChange("escalit_excavation", v)}
                                            className="flex space-x-4"
                                        >
                                            <div className="flex items-center space-x-1">
                                                <RadioGroupItem value="NAI" id="esc_yes" />
                                                <Label htmlFor="esc_yes" className="cursor-pointer">ΝΑΙ</Label>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <RadioGroupItem value="OXI" id="esc_no" />
                                                <Label htmlFor="esc_no" className="cursor-pointer">ΟΧΙ</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>

                                {/* External Pipe */}
                                <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="external_pipe" 
                                            checked={formData.external_pipe} 
                                            onCheckedChange={(v) => handleChange("external_pipe", v)} 
                                        />
                                        <Label htmlFor="external_pipe" className="font-semibold cursor-pointer">ΕΞΩΤΕΡΙΚΗ ΟΔΕΥΣΗ ΜΕ ΧΡΗΣΗ ΣΙΔΗΡΟΣΩΛΗΝΑ</Label>
                                    </div>
                                    
                                    <div className="pl-6 space-y-2">
                                        <Label className="text-sm">Εκσκαφή πεζοδρομίου έως ΡΓ:</Label>
                                        <RadioGroup 
                                            value={formData.pipe_excavation || ""} 
                                            onValueChange={(v) => handleChange("pipe_excavation", v)}
                                            className="flex space-x-4"
                                        >
                                            <div className="flex items-center space-x-1">
                                                <RadioGroupItem value="NAI" id="pipe_yes" />
                                                <Label htmlFor="pipe_yes" className="cursor-pointer">ΝΑΙ</Label>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <RadioGroupItem value="OXI" id="pipe_no" />
                                                <Label htmlFor="pipe_no" className="cursor-pointer">ΟΧΙ</Label>
                                            </div>
                                        </RadioGroup>
                                        
                                        <div className="mt-2 space-y-2 border-t pt-2">
                                            <Label className="text-[10px] font-bold uppercase underline text-slate-500">Τοποθέτηση Σιδηροσωλήνα</Label>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id="pipe_support_fence" 
                                                    checked={formData.pipe_support_fence} 
                                                    onCheckedChange={(v) => handleChange("pipe_support_fence", v)} 
                                                />
                                                <Label htmlFor="pipe_support_fence" className="text-xs cursor-pointer">Στήριξη επί τοιχοποιίας περίφραξης ή/και κτιρίου</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id="pipe_support_building" 
                                                    checked={formData.pipe_support_building} 
                                                    onCheckedChange={(v) => handleChange("pipe_support_building", v)} 
                                                />
                                                <Label htmlFor="pipe_support_building" className="text-xs cursor-pointer">Εκσκαφή έως το κτίριο και στήριξη επί του κτιρίου</Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Aerial & Other */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                        <Checkbox 
                                            id="aerial" 
                                            checked={formData.aerial} 
                                            onCheckedChange={(v) => handleChange("aerial", v)} 
                                        />
                                        <Label htmlFor="aerial" className="font-semibold cursor-pointer">ΕΝΑΕΡΙΟ</Label>
                                    </div>
                                    
                                    <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox 
                                                id="other_way_1" 
                                                checked={formData.other_way_1} 
                                                onCheckedChange={(v) => handleChange("other_way_1", v)} 
                                            />
                                            <Label htmlFor="other_way_1" className="font-semibold cursor-pointer">ΑΛΛΟΣ ΤΡΟΠΟΣ</Label>
                                        </div>
                                        {formData.other_way_1 && (
                                            <Input 
                                                placeholder="Περιγραφή άλλου τρόπου..." 
                                                value={formData.other_way_1_text || ""}
                                                onChange={(e) => handleChange("other_way_1_text", e.target.value)}
                                                className="mt-1 bg-white"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2 */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg border-b pb-1 text-blue-700">2. ΘΕΣΗ B.E.P</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="bep_internal" checked={formData.bep_internal} onCheckedChange={(v) => handleChange("bep_internal", v)} />
                                        <Label htmlFor="bep_internal" className="text-xs cursor-pointer">ΕΣΩΤΕΡΙΚΑ</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="bep_external" checked={formData.bep_external} onCheckedChange={(v) => handleChange("bep_external", v)} />
                                        <Label htmlFor="bep_external" className="text-xs cursor-pointer">ΕΞΩΤΕΡΙΚΑ</Label>
                                    </div>
                                </div>
                                <div className="space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="bep_fence" checked={formData.bep_fence} onCheckedChange={(v) => handleChange("bep_fence", v)} />
                                        <Label htmlFor="bep_fence" className="text-xs cursor-pointer">ΣΤΗΝ ΠΕΡΙΦΡΑΞΗ</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="bep_building" checked={formData.bep_building} onCheckedChange={(v) => handleChange("bep_building", v)} />
                                        <Label htmlFor="bep_building" className="text-xs cursor-pointer">ΣΤΟ ΚΤΙΡΙΟ</Label>
                                    </div>
                                </div>
                                <div className="space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="bep_pole" checked={formData.bep_pole} onCheckedChange={(v) => handleChange("bep_pole", v)} />
                                        <Label htmlFor="bep_pole" className="text-xs cursor-pointer">ΕΠΙ ΣΤΥΛΟΥ</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="bep_pilar" checked={formData.bep_pilar} onCheckedChange={(v) => handleChange("bep_pilar", v)} />
                                        <Label htmlFor="bep_pilar" className="text-xs cursor-pointer">PILAR</Label>
                                    </div>
                                </div>
                                <div className="space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="bep_underground" checked={formData.bep_underground} onCheckedChange={(v) => handleChange("bep_underground", v)} />
                                        <Label htmlFor="bep_underground" className="text-xs cursor-pointer">ΥΠΟΓΕΙΟ</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="bep_ground" checked={formData.bep_ground} onCheckedChange={(v) => handleChange("bep_ground", v)} />
                                        <Label htmlFor="bep_ground" className="text-xs cursor-pointer">ΙΣΟΓΕΙΟ</Label>
                                    </div>
                                </div>
                                <div className="space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="bep_roof" checked={formData.bep_roof} onCheckedChange={(v) => handleChange("bep_roof", v)} />
                                        <Label htmlFor="bep_roof" className="text-xs cursor-pointer">ΤΑΡΑΤΣΑ</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="bep_piloti" checked={formData.bep_piloti} onCheckedChange={(v) => handleChange("bep_piloti", v)} />
                                        <Label htmlFor="bep_piloti" className="text-xs cursor-pointer">ΠΥΛΩΤΗ</Label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3 */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg border-b pb-1 text-blue-700">3. ΚΑΤΑΚΟΡΥΦΗ ΟΔΕΥΣΗ ΠΡΟΣ ΤΑ ΚΟΥΤΙΑ ΔΙΑΝΟΜΗΣ ΟΡΟΦΩΝ (F.B.)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="fb_shaft" checked={formData.fb_shaft} onCheckedChange={(v) => handleChange("fb_shaft", v)} />
                                            <Label htmlFor="fb_shaft" className="text-xs cursor-pointer">ΦΡΕΑΤΙΟ</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="fb_elevator" checked={formData.fb_elevator} onCheckedChange={(v) => handleChange("fb_elevator", v)} />
                                            <Label htmlFor="fb_elevator" className="text-xs cursor-pointer">ΑΝΕΛΚΥΣΤΗΡΑ</Label>
                                        </div>
                                    </div>
                                    <div className="space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="fb_staircase" checked={formData.fb_staircase} onCheckedChange={(v) => handleChange("fb_staircase", v)} />
                                            <Label htmlFor="fb_staircase" className="text-xs cursor-pointer">ΚΛΙΜΑΚΟΣΤΑΣΙΟ</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="fb_internal_external" checked={formData.fb_internal_external} onCheckedChange={(v) => handleChange("fb_internal_external", v)} />
                                            <Label htmlFor="fb_internal_external" className="text-xs cursor-pointer">ΕΣΩΤΕΡΙΚΑ / ΕΞΩΤΕΡΙΚΑ</Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="fb_lightwell" checked={formData.fb_lightwell} onCheckedChange={(v) => handleChange("fb_lightwell", v)} />
                                            <Label htmlFor="fb_lightwell" className="text-xs cursor-pointer">ΦΩΤΑΓΩΓΟΣ</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="fb_stairwell" checked={formData.fb_stairwell} onCheckedChange={(v) => handleChange("fb_stairwell", v)} />
                                            <Label htmlFor="fb_stairwell" className="text-xs cursor-pointer">ΦΑΝΑΡΙ ΣΚΑΛΑΣ</Label>
                                        </div>
                                    </div>
                                    <div className="space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="fb_other_way" checked={formData.fb_other_way} onCheckedChange={(v) => handleChange("fb_other_way", v)} />
                                            <Label htmlFor="fb_other_way" className="text-xs cursor-pointer">ΑΛΛΟΣ ΤΡΟΠΟΣ</Label>
                                        </div>
                                        {formData.fb_other_way && (
                                            <Input 
                                                placeholder="Περιγραφή..." 
                                                value={formData.fb_other_way_text || ""}
                                                onChange={(e) => handleChange("fb_other_way_text", e.target.value)}
                                                className="bg-white h-8 text-xs"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 4: SKETCH DETAILS */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg border-b pb-1 text-blue-700">4. ΣΚΑΡΙΦΗΜΑ (ΣΤΟΙΧΕΙΑ ΚΤΙΡΙΟΥ)</h3>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="font-semibold text-slate-700">Επιλογή Ορόφων Κτιρίου (τσεκάρετε όσους υπάρχουν):</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                        {FLOOR_OPTIONS.map((floor, index) => {
                                            const isActive = formData.active_floors?.includes(index) ?? false;
                                            return (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <Checkbox 
                                                        id={`active-floor-${index}`} 
                                                        checked={isActive} 
                                                        onCheckedChange={(v) => {
                                                            let newActive = [...(formData.active_floors || [])];
                                                            if (v) {
                                                                if (!newActive.includes(index)) newActive.push(index);
                                                            } else {
                                                                newActive = newActive.filter(i => i !== index);
                                                            }
                                                            newActive.sort((a, b) => a - b);
                                                            handleChange("active_floors", newActive);
                                                            if (!v && formData.customer_floor_index === index) {
                                                                handleChange("customer_floor_index", undefined);
                                                            }
                                                        }} 
                                                    />
                                                    <Label htmlFor={`active-floor-${index}`} className="text-xs font-medium cursor-pointer text-slate-600">{floor}</Label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="font-semibold text-slate-700">Όροφος Πελάτη:</Label>
                                        {formData.customer_floor_index !== undefined && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleChange("customer_floor_index", undefined)}
                                            >
                                                Καθαρισμός (Χωρίς όροφο)
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                        {(formData.active_floors || []).map((floorIndex) => (
                                            <div key={floorIndex} className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id={`customer-floor-${floorIndex}`} 
                                                    checked={formData.customer_floor_index === floorIndex} 
                                                    onCheckedChange={(v) => {
                                                        handleChange("customer_floor_index", v ? floorIndex : undefined);
                                                    }} 
                                                />
                                                <Label htmlFor={`customer-floor-${floorIndex}`} className="text-xs font-bold cursor-pointer text-blue-700">
                                                    {FLOOR_OPTIONS[floorIndex]}
                                                </Label>
                                            </div>
                                        ))}
                                        {(!formData.active_floors || formData.active_floors.length === 0) && (
                                            <span className="text-xs text-slate-500 italic">Επιλέξτε πρώτα ορόφους παραπάνω</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Apartment Inputs */}
                            {formData.active_floors && formData.active_floors.length > 0 && (
                                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <Label className="font-bold text-sm block mb-3 underline">Διαμερίσματα ανά όροφο:</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {formData.active_floors.map((floorIndex) => {
                                            const floorLabel = FLOOR_OPTIONS[floorIndex];
                                            
                                            return (
                                                <div key={floorIndex} className="space-y-2 border border-slate-200 p-2 rounded bg-white shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-center border-b pb-1">
                                                        <Label className="text-[11px] font-bold text-blue-800">{floorLabel}</Label>
                                                        <div className="flex items-center space-x-1">
                                                            <Checkbox 
                                                                id={`fb-floor-${floorIndex}`} 
                                                                checked={formData.fb_per_floor?.[floorIndex] ?? true} 
                                                                onCheckedChange={(v) => {
                                                                    const newFb = { ...(formData.fb_per_floor || {}) };
                                                                    newFb[floorIndex] = !!v;
                                                                    handleChange("fb_per_floor", newFb);
                                                                }} 
                                                            />
                                                            <Label htmlFor={`fb-floor-${floorIndex}`} className="text-[9px] font-bold text-slate-600 cursor-pointer">FB</Label>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="space-y-1">
                                                            <Label className="text-[9px] text-slate-500">Διαμερίσματα:</Label>
                                                            <Input 
                                                                type="number" 
                                                                min="0"
                                                                max="10"
                                                                placeholder="Αρ." 
                                                                value={formData.apartments_per_floor?.[floorIndex] || ""}
                                                                onChange={(e) => {
                                                                    const val = parseInt(e.target.value);
                                                                    const newApts = { ...(formData.apartments_per_floor || {}) };
                                                                    if (isNaN(val)) delete newApts[floorIndex];
                                                                    else newApts[floorIndex] = val;
                                                                    handleChange("apartments_per_floor", newApts);
                                                                }}
                                                                className="h-8 text-xs bg-white"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label className="text-[9px] text-slate-500">Καταστήματα:</Label>
                                                            <Input 
                                                                type="number" 
                                                                min="0"
                                                                max="10"
                                                                placeholder="Αρ." 
                                                                value={formData.shops_per_floor?.[floorIndex] || ""}
                                                                onChange={(e) => {
                                                                    const val = parseInt(e.target.value);
                                                                    const newShops = { ...(formData.shops_per_floor || {}) };
                                                                    if (isNaN(val)) delete newShops[floorIndex];
                                                                    else newShops[floorIndex] = val;
                                                                    handleChange("shops_per_floor", newShops);
                                                                }}
                                                                className="h-8 text-xs bg-white"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-3 pt-4 border-t md:border-t-0 md:pt-0">
                                    <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <Checkbox 
                                            id="use_fb" 
                                            checked={formData.use_fb} 
                                            onCheckedChange={(v) => handleChange("use_fb", v)} 
                                        />
                                        <Label htmlFor="use_fb" className="font-bold text-blue-700 cursor-pointer">Χρήση FB (κουτί σε κάθε όροφο)</Label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 5: GENERAL REMARKS */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg border-b pb-1 text-blue-700">5. ΠΕΡΙΓΡΑΦΗ – ΠΑΡΑΤΗΡΗΣΕΙΣ</h3>
                            <div className="space-y-2">
                                <textarea 
                                    className="min-h-[120px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Γράψτε εδώ οποιαδήποτε άλλη παρατήρηση ή περιγραφή..."
                                    value={formData.general_remarks || ""}
                                    onChange={(e) => handleChange("general_remarks", e.target.value)}
                                />
                            </div>
                        </div>

                    </div>
                </ScrollArea>


                <DialogFooter className="p-6 pt-2 bg-slate-50 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Ακύρωση</Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Αποθήκευση Επιλογών</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
