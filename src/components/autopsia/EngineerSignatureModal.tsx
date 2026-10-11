import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PenLine, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface EngineerSignatureModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EngineerSignatureModal({ open, onOpenChange }: EngineerSignatureModalProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [hasExistingSaved, setHasExistingSaved] = useState(false);

    const loadSignatureToCanvas = useCallback((canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Fill background white
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#0000FF";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";

        const saved = typeof window !== "undefined" ? localStorage.getItem("autopsia_engineer_signature") : null;
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

    const setupCanvas = (canvas: HTMLCanvasElement | null) => {
        canvasRef.current = canvas;
        if (canvas) {
            loadSignatureToCanvas(canvas);
        }
    };

    useEffect(() => {
        if (open && canvasRef.current) {
            loadSignatureToCanvas(canvasRef.current);
        }
    }, [open, loadSignatureToCanvas]);

    const handleClear = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        setHasDrawn(false);
    };

    const handleSave = () => {
        if (!hasDrawn) {
            toast.error("Παρακαλώ υπογράψτε πριν αποθηκεύσετε.");
            return;
        }
        if (!canvasRef.current) return;
        
        const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.95);
        localStorage.setItem("autopsia_engineer_signature", dataUrl);
        setHasExistingSaved(true);
        toast.success("Η υπογραφή τεχνικού/μηχανικού αποθηκεύτηκε επιτυχώς!");
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
                        <span>Υπάρχει αποθηκευμένη υπογραφή (προβάλλεται στο πλαίσιο παρακάτω)</span>
                    </div>
                )}

                <div className="py-2">
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 overflow-hidden touch-none relative shadow-inner">
                        <canvas
                            ref={setupCanvas}
                            width={450}
                            height={250}
                            className="w-full cursor-crosshair bg-white"
                            onMouseDown={(e) => {
                                const canvas = e.currentTarget;
                                const ctx = canvas.getContext('2d');
                                if (!ctx) return;
                                ctx.beginPath();
                                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                                (canvas as any).isDrawing = true;
                                setHasDrawn(true);
                            }}
                            onMouseMove={(e) => {
                                const canvas = e.currentTarget;
                                if (!(canvas as any).isDrawing) return;
                                const ctx = canvas.getContext('2d');
                                if (!ctx) return;
                                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                                ctx.stroke();
                            }}
                            onMouseUp={(e) => (e.currentTarget as any).isDrawing = false}
                            onTouchStart={(e) => {
                                const canvas = e.currentTarget;
                                const rect = canvas.getBoundingClientRect();
                                const touch = e.touches[0];
                                const ctx = canvas.getContext('2d');
                                if (!ctx) return;
                                ctx.beginPath();
                                ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
                                (canvas as any).isDrawing = true;
                                setHasDrawn(true);
                            }}
                            onTouchMove={(e) => {
                                const canvas = e.currentTarget;
                                if (!(canvas as any).isDrawing) return;
                                const rect = canvas.getBoundingClientRect();
                                const touch = e.touches[0];
                                const ctx = canvas.getContext('2d');
                                if (!ctx) return;
                                ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
                                ctx.stroke();
                            }}
                            onTouchEnd={(e) => (e.currentTarget as any).isDrawing = false}
                        />
                        <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full shadow-md z-10 opacity-80 hover:opacity-100 transition-opacity"
                            onClick={handleClear}
                            title="Καθαρισμός υπογραφής"
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
