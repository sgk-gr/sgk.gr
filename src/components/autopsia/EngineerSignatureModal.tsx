import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PenLine, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabaseAutopsia as supabase } from "@/lib/autopsia/supabase";

const AUTOPSIA_CONFIG_ID = "c0000000-0000-0000-0000-000000000001";

interface EngineerSignatureModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EngineerSignatureModal({ open, onOpenChange }: EngineerSignatureModalProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [hasExistingSaved, setHasExistingSaved] = useState(false);

    const initCanvas = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Fill background white
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#0000FF";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        let saved = typeof window !== "undefined" ? localStorage.getItem("autopsia_engineer_signature") : null;
        if (!saved) {
            try {
                const { data } = await supabase
                    .from("customers")
                    .select("signature_url, autopsia_tech_data")
                    .eq("id", AUTOPSIA_CONFIG_ID)
                    .single();
                const cloudSig = data?.autopsia_tech_data?.engineer_signature || data?.signature_url;
                if (cloudSig) {
                    saved = cloudSig;
                    localStorage.setItem("autopsia_engineer_signature", cloudSig);
                }
            } catch (err) {
                console.warn("Could not check Supabase for engineer signature:", err);
            }
        }

        if (saved) {
            setHasExistingSaved(true);
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                setHasDrawn(true);
            };
            img.src = saved;
        } else {
            setHasExistingSaved(false);
            setHasDrawn(false);
        }
    }, []);

    useEffect(() => {
        if (!open) return;
        const timer = setTimeout(() => {
            initCanvas();
        }, 60);
        return () => clearTimeout(timer);
    }, [open, initCanvas]);

    const getCanvasCoordinates = (clientX: number, clientY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / (rect.width || 1);
        const scaleY = canvas.height / (rect.height || 1);
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "#0000FF";
            ctx.lineWidth = 3;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
        }
        setHasDrawn(false);
    };

    const handleSave = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Check if canvas has non-white drawing
        let hasContent = hasDrawn;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            try {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i] < 240 || data[i + 1] < 240 || data[i + 2] < 240) {
                        hasContent = true;
                        break;
                    }
                }
            } catch {
                hasContent = true;
            }
        }

        if (!hasContent) {
            toast.error("Παρακαλώ υπογράψτε πριν αποθηκεύσετε.");
            return;
        }
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        localStorage.setItem("autopsia_engineer_signature", dataUrl);
        setHasExistingSaved(true);
        setHasDrawn(true);

        // Also persist to Supabase row c0000000-0000-0000-0000-000000000001
        try {
            const { data: existing } = await supabase
                .from("customers")
                .select("autopsia_tech_data")
                .eq("id", AUTOPSIA_CONFIG_ID)
                .single();

            const curTech = existing?.autopsia_tech_data || {};
            await supabase.from("customers").update({
                signature_url: dataUrl,
                autopsia_tech_data: {
                    ...curTech,
                    engineer_signature: dataUrl
                }
            } as any).eq("id", AUTOPSIA_CONFIG_ID);
        } catch (dbErr) {
            console.warn("Could not sync engineer signature with Supabase:", dbErr);
        }

        toast.success("Η υπογραφή Μηχανικού αποθηκεύτηκε επιτυχώς!");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={undefined} className="sm:max-w-[500px] bg-white text-slate-950 border-slate-200 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-slate-950 font-bold">
                        <PenLine className="h-5 w-5 text-blue-600" />
                        Ψηφιακή Υπογραφή Τεχνικού / Μηχανικού
                    </DialogTitle>
                    <DialogDescription className="text-slate-700 font-medium text-xs sm:text-sm">
                        Παρακαλούμε υπογράψτε μέσα στο παρακάτω πλαίσιο. Αυτή η υπογραφή αποθηκεύεται στη συσκευή σας και μπαίνει αυτόματα σε κάθε νέο έγγραφο Τεχνικής Περιγραφής.
                    </DialogDescription>
                </DialogHeader>

                {hasExistingSaved && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>Υπάρχει αποθηκευμένη υπογραφή (μπορείτε να υπογράψετε ξανά)</span>
                    </div>
                )}

                <div className="py-2">
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 overflow-hidden touch-none relative shadow-inner">
                        <canvas
                            ref={canvasRef}
                            width={450}
                            height={250}
                            className="w-full cursor-crosshair bg-white block"
                            onMouseDown={(e) => {
                                const canvas = canvasRef.current;
                                if (!canvas) return;
                                const ctx = canvas.getContext('2d');
                                if (!ctx) return;
                                const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
                                ctx.beginPath();
                                ctx.moveTo(x, y);
                                (canvas as any).isDrawing = true;
                                setHasDrawn(true);
                            }}
                            onMouseMove={(e) => {
                                const canvas = canvasRef.current;
                                if (!canvas || !(canvas as any).isDrawing) return;
                                const ctx = canvas.getContext('2d');
                                if (!ctx) return;
                                const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
                                ctx.lineTo(x, y);
                                ctx.stroke();
                                setHasDrawn(true);
                            }}
                            onMouseUp={() => {
                                if (canvasRef.current) (canvasRef.current as any).isDrawing = false;
                            }}
                            onMouseLeave={() => {
                                if (canvasRef.current) (canvasRef.current as any).isDrawing = false;
                            }}
                            onTouchStart={(e) => {
                                const canvas = canvasRef.current;
                                if (!canvas || !e.touches[0]) return;
                                const ctx = canvas.getContext('2d');
                                if (!ctx) return;
                                const touch = e.touches[0];
                                const { x, y } = getCanvasCoordinates(touch.clientX, touch.clientY);
                                ctx.beginPath();
                                ctx.moveTo(x, y);
                                (canvas as any).isDrawing = true;
                                setHasDrawn(true);
                            }}
                            onTouchMove={(e) => {
                                const canvas = canvasRef.current;
                                if (!canvas || !(canvas as any).isDrawing || !e.touches[0]) return;
                                const ctx = canvas.getContext('2d');
                                if (!ctx) return;
                                const touch = e.touches[0];
                                const { x, y } = getCanvasCoordinates(touch.clientX, touch.clientY);
                                ctx.lineTo(x, y);
                                ctx.stroke();
                                setHasDrawn(true);
                            }}
                            onTouchEnd={() => {
                                if (canvasRef.current) (canvasRef.current as any).isDrawing = false;
                            }}
                        />
                        <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full shadow-md z-10 opacity-80 hover:opacity-100 transition-opacity"
                            onClick={handleClear}
                            title="Καθαρισμός"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <DialogFooter className="flex gap-2 justify-end">
                    <Button variant="outline" className="rounded-xl font-semibold" onClick={() => onOpenChange(false)}>
                        Ακύρωση
                    </Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm">
                        Αποθήκευση
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
