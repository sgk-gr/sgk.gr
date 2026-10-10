import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { X, Undo, Type, Minus, MousePointer2, Save, Trash2, Palette, Check, ArrowRight, Square, Circle, Hand } from 'lucide-react';
import { cn, getTimestampedUrl } from '@/lib/autopsia/utils';
import { toast } from 'sonner';

interface ImageEditorProps {
    isOpen: boolean;
    imageSrc: string;
    initialText?: string;
    onSave: (blob: Blob) => void;
    onCancel: () => void;
}

type AnnotationType = 'arrow' | 'text' | 'rect' | 'circle' | 'check';

interface Annotation {
    id: string;
    type: AnnotationType;
    points: { x: number, y: number }[]; // [start, end] for shapes/arrow. [pos] for text.
    text?: string;
    fontSize?: number;
    color: string;
}

const COLORS = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' },
];

export const ImageEditor: React.FC<ImageEditorProps> = ({ isOpen, imageSrc, initialText, onSave, onCancel }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Editor State
    const [mode, setMode] = useState<AnnotationType | 'select'>('arrow');
    const [color, setColor] = useState('#ef4444');
    const [fontSize, setFontSize] = useState(40); // Default font size
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState<{ x: number, y: number } | null>(null);
    const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
    const [scale, setScale] = useState(1);

    // Text Entry State
    const [textInput, setTextInput] = useState('');
    const [tempTextPos, setTempTextPos] = useState<{ x: number, y: number } | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && imageSrc) {
            setIsLoading(true);
            // Automatically proxy r2.dev URLs through r2-media to avoid net::ERR_CONNECTION_REFUSED
            const resolvedSrc = getTimestampedUrl(imageSrc, true);
            if (!resolvedSrc) {
                console.error("ImageEditor: Invalid imageSrc:", imageSrc);
                setIsLoading(false);
                toast.error("Μη έγκυρη διεύθυνση εικόνας.");
                onCancel();
                return;
            }

            const img = new Image();
            if (!resolvedSrc.startsWith('data:')) {
                img.crossOrigin = "anonymous";
                const separator = resolvedSrc.includes('?') ? '&' : '?';
                img.src = `${resolvedSrc}${separator}nocache=${new Date().getTime()}`;
            } else {
                img.src = resolvedSrc;
            }
            img.onload = () => {
                setImageObj(img);
                
                // If initialText is provided, add it as a draggable annotation at a default position
                if (initialText) {
                    const baseFontSize = (img.width / 100) * 4;
                    setAnnotations([{
                        id: 'initial-text',
                        type: 'text',
                        text: initialText.toUpperCase(),
                        fontSize: (img.width / 100) * 4,
                        points: [{ x: img.width * 0.25, y: img.height * 0.15 }],
                        color: '#3b82f6' // Blue
                    }]);
                    setMode('select'); // Start in select mode so they can drag it immediately
                    setSelectedId('initial-text');
                } else {
                    setAnnotations([]);
                }
                
                setCurrentAnnotation(null);
                setIsLoading(false);
            };
            img.onerror = (err) => {
                console.error("ImageEditor: Failed to load image", resolvedSrc, err);
                setIsLoading(false);
                toast.error("Σφάλμα φόρτωσης εικόνας. Ελέγξτε τη σύνδεση.");
                onCancel();
            };
        }
    }, [isOpen, imageSrc, initialText]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !imageObj) return;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);

        const drawSingleAnnotation = (ann: Annotation) => {
            const isSelected = ann.id === selectedId;
            ctx.strokeStyle = ann.color;
            ctx.fillStyle = ann.color;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            const thickness = (canvas.width / 100) * 0.8;
            ctx.lineWidth = thickness;

            if (isSelected) {
                ctx.shadowColor = 'rgba(255,255,255,1)';
                ctx.shadowBlur = thickness * 2;
            } else {
                ctx.shadowBlur = 0;
            }

            const start = ann.points[0];
            const end = ann.points[1] || start;

            if (ann.type === 'arrow') {
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();

                const angle = Math.atan2(end.y - start.y, end.x - start.x);
                const headLen = thickness * 4;
                ctx.beginPath();
                ctx.moveTo(end.x, end.y);
                ctx.lineTo(end.x - headLen * Math.cos(angle - Math.PI / 6), end.y - headLen * Math.sin(angle - Math.PI / 6));
                ctx.lineTo(end.x - headLen * Math.cos(angle + Math.PI / 6), end.y - headLen * Math.sin(angle + Math.PI / 6));
                ctx.closePath();
                ctx.fill();
            } else if (ann.type === 'rect') {
                const x = Math.min(start.x, end.x);
                const y = Math.min(start.y, end.y);
                const w = Math.abs(end.x - start.x);
                const h = Math.abs(end.y - start.y);
                ctx.strokeRect(x, y, w, h);
            } else if (ann.type === 'circle') {
                const centerX = (start.x + end.x) / 2;
                const centerY = (start.y + end.y) / 2;
                const radiusX = Math.abs(end.x - start.x) / 2;
                const radiusY = Math.abs(end.y - start.y) / 2;
                ctx.beginPath();
                ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
                ctx.stroke();
            } else if (ann.type === 'text' && ann.text) {
                const baseFontSize = ann.fontSize || (canvas.width / 100) * 4;
                ctx.font = `bold ${baseFontSize}px Arial`;
                const padding = baseFontSize * 0.3;
                const metrics = ctx.measureText(ann.text);

                ctx.shadowBlur = 0;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fillRect(start.x - padding, start.y - baseFontSize, metrics.width + padding * 2, baseFontSize + padding);

                ctx.fillStyle = ann.color;
                ctx.fillText(ann.text, start.x, start.y);
            } else if (ann.type === 'check') {
                const size = (canvas.width / 100) * 3;
                ctx.beginPath();
                ctx.lineWidth = size * 0.25;
                ctx.moveTo(start.x - size * 0.5, start.y);
                ctx.lineTo(start.x - size * 0.1, start.y + size * 0.4);
                ctx.lineTo(start.x + size * 0.6, start.y - size * 0.5);
                ctx.stroke();
            }

            ctx.shadowBlur = 0;
        };

        annotations.forEach(drawSingleAnnotation);
        if (currentAnnotation) drawSingleAnnotation(currentAnnotation);
    }, [imageObj, annotations, currentAnnotation, selectedId]);

    useEffect(() => {
        const calculateScale = () => {
            if (imageObj && canvasRef.current && containerRef.current) {
                const container = containerRef.current;
                const containerWidth = container.clientWidth;
                const containerHeight = container.clientHeight;
                if (containerWidth === 0 || containerHeight === 0) {
                    requestAnimationFrame(calculateScale);
                    return;
                }
                const imgRatio = imageObj.width / imageObj.height;
                const containerRatio = containerWidth / containerHeight;
                let dWidth, dHeight;
                if (imgRatio > containerRatio) {
                    dWidth = containerWidth;
                    dHeight = containerWidth / imgRatio;
                } else {
                    dHeight = containerHeight;
                    dWidth = containerHeight * imgRatio;
                }
                canvasRef.current.width = imageObj.width;
                canvasRef.current.height = imageObj.height;
                canvasRef.current.style.width = `${dWidth}px`;
                canvasRef.current.style.height = `${dHeight}px`;
                setScale(imageObj.width / dWidth);
                draw();
            }
        };
        calculateScale();
    }, [imageObj, draw]);

    const findAnnotationUnder = (x: number, y: number) => {
        // Reverse order to pick the topmost
        for (let i = annotations.length - 1; i >= 0; i--) {
            const ann = annotations[i];
            const start = ann.points[0];
            const end = ann.points[1] || start;

            if (ann.type === 'text') {
                const baseFontSize = ann.fontSize || (canvasRef.current!.width / 100) * 4;
                const ctx = canvasRef.current!.getContext('2d')!;
                ctx.font = `bold ${baseFontSize}px Arial`;
                const metrics = ctx.measureText(ann.text || '');
                if (x >= start.x - 30 && x <= start.x + metrics.width + 30 && y >= start.y - baseFontSize - 30 && y <= start.y + 30) return ann;
            } else if (ann.type === 'rect') {
                const minX = Math.min(start.x, end.x);
                const maxX = Math.max(start.x, end.x);
                const minY = Math.min(start.y, end.y);
                const maxY = Math.max(start.y, end.y);
                if (x >= minX - 10 && x <= maxX + 10 && y >= minY - 10 && y <= maxY + 10) return ann;
            } else if (ann.type === 'check') {
                const size = (canvasRef.current!.width / 100) * 5; 
                const dist = Math.sqrt(Math.pow(x - start.x, 2) + Math.pow(y - start.y, 2));
                if (dist <= size) return ann;
            } else {
                // Circle/Arrow simple hit test: distance to center/line
                const centerX = (start.x + end.x) / 2;
                const centerY = (start.y + end.y) / 2;
                const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                const radiusX = Math.abs(end.x - start.x) / 2 + 20;
                const radiusY = Math.abs(end.y - start.y) / 2 + 20;
                if (dist <= Math.max(radiusX, radiusY)) return ann;
            }
        }
        return null;
    };

    const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();

        let clientX, clientY;
        if ('touches' in e && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        return {
            x: (clientX - rect.left) * scale,
            y: (clientY - rect.top) * scale
        };
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (tempTextPos) return;
        const coords = getCoords(e);

        if (mode === 'select') {
            const ann = findAnnotationUnder(coords.x, coords.y);
            if (ann) {
                // If it's text and already selected, open edit dialog
                if (ann.type === 'text' && selectedId === ann.id) {
                    setEditingId(ann.id);
                    setTextInput(ann.text || '');
                    setTempTextPos(ann.points[0]);
                    if (ann.fontSize) setFontSize(ann.fontSize);
                    if (ann.color) setColor(ann.color);
                }
                setSelectedId(ann.id);
                setDragOffset({ x: coords.x - ann.points[0].x, y: coords.y - ann.points[0].y });
            } else {
                setSelectedId(null);
            }
        } else if (mode === 'text') {
            setEditingId(null);
            setTempTextPos(coords);
            if (!fontSize) setFontSize(Math.round((canvasRef.current!.width / 100) * 4));
            setTextInput('');
        } else if (mode === 'check') {
            setAnnotations(prev => [...prev, {
                id: Math.random().toString(36).substr(2, 9),
                type: 'check',
                points: [coords],
                color: color
            }]);
            setMode('select'); // Auto switch to allow dragging
        } else {
            setCurrentAnnotation({
                id: Math.random().toString(36).substr(2, 9),
                type: mode as AnnotationType,
                points: [coords, coords],
                color: color
            });
        }
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        const coords = getCoords(e);

        if (mode === 'select' && selectedId && dragOffset) {
            setAnnotations(prev => prev.map(ann => {
                if (ann.id !== selectedId) return ann;
                const dx = coords.x - (ann.points[0].x + dragOffset.x);
                const dy = coords.y - (ann.points[0].y + dragOffset.y);
                const newPoints = ann.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
                return { ...ann, points: newPoints };
            }));
            const ann = annotations.find(a => a.id === selectedId);
            if (ann) {
                setDragOffset({ x: coords.x - ann.points[0].x, y: coords.y - ann.points[0].y });
            }
        } else if (currentAnnotation) {
            setCurrentAnnotation(prev => ({
                ...prev!,
                points: [prev!.points[0], coords]
            }));
        }
    };

    const handleEnd = () => {
        if (currentAnnotation) {
            setAnnotations(prev => [...prev, currentAnnotation]);
            setCurrentAnnotation(null);
        } else if (mode === 'select') {
            setDragOffset(null);
        }
    };

    const handleAddText = () => {
        if (textInput.trim() && tempTextPos) {
            if (editingId) {
                setAnnotations(prev => prev.map(ann => 
                    ann.id === editingId 
                    ? { ...ann, text: textInput.trim(), fontSize: fontSize, color: color } 
                    : ann
                ));
            } else {
                setAnnotations(prev => [...prev, {
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'text',
                    text: textInput.trim(),
                    fontSize: fontSize,
                    points: [tempTextPos],
                    color: color
                }]);
            }
        }
        setTempTextPos(null);
        setEditingId(null);
        setMode('select');
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.toBlob((blob) => {
            if (blob) onSave(blob);
        }, 'image/jpeg', 0.9);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent aria-describedby={undefined} className="max-w-4xl h-[95vh] flex flex-col p-0 overflow-hidden bg-slate-900 border-slate-700">
                <DialogTitle className="sr-only">Επεξεργασία Εικόνας</DialogTitle>
                <DialogDescription className="sr-only">
                    Εργαλείο για την προσθήκη σημειώσεων και βελών πάνω στην εικόνα.
                </DialogDescription>
                <div className="bg-slate-800 p-2 sm:p-3 border-b border-slate-700 shrink-0 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                        <Button variant={mode === 'select' ? 'default' : 'secondary'} onClick={() => setMode('select')} size="sm" className="h-10 px-3 font-bold"><Hand className="h-4 w-4 mr-1.5" /><span className="hidden xs:inline">Επιλογή</span></Button>
                        <Button variant={mode === 'arrow' ? 'default' : 'secondary'} onClick={() => { setMode('arrow'); setSelectedId(null); }} size="sm" className="h-10 px-3 font-bold"><ArrowRight className="h-4 w-4 mr-1.5" /><span className="hidden xs:inline">Βέλος</span></Button>
                        <Button variant={mode === 'rect' ? 'default' : 'secondary'} onClick={() => { setMode('rect'); setSelectedId(null); }} size="sm" className="h-10 px-3 font-bold"><Square className="h-4 w-4 mr-1.5" /><span className="hidden xs:inline">Ορθογώνιο</span></Button>
                        <Button variant={mode === 'circle' ? 'default' : 'secondary'} onClick={() => { setMode('circle'); setSelectedId(null); }} size="sm" className="h-10 px-3 font-bold"><Circle className="h-4 w-4 mr-1.5" /><span className="hidden xs:inline">Κύκλος</span></Button>
                        <Button variant={mode === 'text' ? 'default' : 'secondary'} onClick={() => { setMode('text'); setSelectedId(null); }} size="sm" className="h-10 px-3 font-bold"><Type className="h-4 w-4 mr-1.5" /><span className="hidden xs:inline">Κείμενο</span></Button>
                        <Button variant={mode === 'check' ? 'default' : 'secondary'} onClick={() => { setMode('check'); setSelectedId(null); setColor('#000000'); }} size="sm" className="h-10 px-3 font-bold"><Check className="h-4 w-4 mr-1.5" /><span className="hidden xs:inline">Check</span></Button>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900/50 rounded-full border border-slate-700">
                        {COLORS.map((c) => (
                            <button key={c.value} onClick={() => setColor(c.value)} className={cn("w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-transform", color === c.value ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60")} style={{ backgroundColor: c.value }} />
                        ))}
                    </div>

                    {mode === 'text' && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 rounded-full border border-slate-700">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Size</span>
                            <Input 
                                type="number" 
                                value={fontSize} 
                                onChange={(e) => setFontSize(Number(e.target.value))} 
                                className="w-16 h-7 bg-transparent border-none text-white text-center font-bold focus-visible:ring-0"
                            />
                        </div>
                    )}

                    <div className="flex gap-1">
                        <Button variant="secondary" size="icon" onClick={() => setAnnotations(prev => prev.slice(0, -1))} disabled={annotations.length === 0} className="h-10 w-10"><Undo className="h-4 w-4" /></Button>
                        <Button variant="destructive" size="icon" onClick={() => (selectedId ? setAnnotations(prev => prev.filter(p => p.id !== selectedId)) : setAnnotations([]))} disabled={annotations.length === 0} className="h-10 w-10"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                </div>

                <div ref={containerRef} className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden touch-none select-none" onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd} onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}>
                    {isLoading ? <div className="animate-pulse text-slate-500">Φόρτωση...</div> : <canvas ref={canvasRef} className={cn("max-w-full max-h-full shadow-2xl bg-white/5 transition-opacity duration-300", mode === 'select' ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair')} style={{ opacity: isLoading ? 0 : 1 }} />}

                    {tempTextPos && (
                        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                            <div className="bg-slate-800 p-5 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-sm flex flex-col gap-4 animate-in zoom-in-95">
                                <h3 className="text-white font-bold flex items-center gap-2"><Type className="h-4 w-4 text-purple-400" />{editingId ? 'Επεξεργασία Κειμένου' : 'Προσθήκη Κειμένου'}</h3>
                                <Input autoFocus value={textInput} onChange={(e) => setTextInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddText()} placeholder="Γράψε εδώ..." className="bg-slate-900 border-slate-600 text-white h-12 text-lg" />
                                <div className="flex gap-2">
                                    <Button onClick={handleAddText} className="flex-1 bg-purple-600 font-bold">{editingId ? 'Ενημέρωση' : 'Προσθήκη'}</Button>
                                    <Button variant="secondary" onClick={() => { setTempTextPos(null); setEditingId(null); }}>Ακύρωση</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-800 border-t border-slate-700 flex flex-col sm:flex-row gap-3 justify-between items-center shrink-0">
                    <div className="text-slate-400 text-[10px] sm:text-xs">Χρησιμοποίησε το "Επιλογή" για να μετακινήσεις σημειώσεις.</div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="ghost" onClick={onCancel} className="flex-1 sm:flex-none text-slate-300 h-10 px-6">Ακύρωση</Button>
                        <Button onClick={handleSave} className="flex-1 sm:flex-none bg-emerald-600 text-white font-bold h-10 px-8 shadow-lg active:scale-95 transition-all"><Save className="h-4 w-4 mr-2" />Ολοκλήρωση</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
