"use client";
import { EngineerSignatureModal } from "./EngineerSignatureModal";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAutopsia as supabase } from "@/lib/autopsia/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Users, Search, Image, ExternalLink, ChevronDown, ChevronUp, X, Phone, Save, Plus, Loader2, Camera, MessageSquare, MapPin, Layers, UserCircle, LogOut, Filter, Shovel, Zap, Edit2, AlertTriangle, PenLine, FileSpreadsheet, Eye, Settings, Package, FolderClosed, Database, XCircle, History, CheckCircle2, Navigation, Trash2 } from "lucide-react";
import { CommentsTimelineDialog } from "./CommentsTimelineDialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ExcelViewer } from "./ExcelViewer";
import type { User } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import { SafeImage } from "./SafeImage";
import { cn, getTimestampedUrl, getContractorCardClass } from "@/lib/autopsia/utils";
import { ImageEditor } from "./ImageEditor";
import { uploadToR2, deleteFromR2 } from "@/lib/autopsia/r2";
import { FileText } from "lucide-react";
import { TechDescriptionModal, type TechDescriptionData } from "./TechDescriptionModal";
import { ThemeToggle } from "./ThemeToggle";
import { NewAutopsiaModal } from "./NewAutopsiaModal";


const catNamesGreek: Record<string, string> = {
    'aut_decl': 'YD_Diaxeiristi',
    'aut_cab': 'Kampina',
    'aut_wait': 'Anamoni',
    'aut_tech': 'Texn_Perigrafi',
    'aut_hedm': 'XEDM',
    'aut_form1': 'Entypo_1',
    'aut_report': 'Ekthesi_Epith'
};

const categoryTemplates: Record<string, string> = {
    'aut_decl': '/templates/aut_decl_template.png',
    'aut_form1': '/templates/aut_form1_template.jpg',
    'aut_report': '/templates/aut_report_template.png',
    'aut_tech': '/templates/aut_tech_template.png',
};

// Map coordinates for where the name should be placed on each template
// Map percentage coordinates (0 to 1) for where the name should be placed on each template
const templateNameOffsets: Record<string, { x: number, y: number, fontSize: number } | null> = {
    'aut_decl': { x: 0.23, y: 0.142, fontSize: 0.022 },
    'aut_form1': { x: 0.23, y: 0.142, fontSize: 0.022 },
    'aut_report': null,
    'aut_tech': null,
};

// Digital Template Generator for Declaration (aut_decl)
const drawDigitalDecl = async (customer: any, adt: string, signatureUrl?: string | null): Promise<string> => {
    const canvas = document.createElement("canvas");
    // A4 Paper proportions at 300 DPI (approx)
    canvas.width = 2480; 
    canvas.height = 3508;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // Background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- HEADER ---
    // OTE Logo (Using the official OTELOGO.jpg provided by user)
    const logoImg = new window.Image();
    logoImg.src = "/OTELOGO.jpg";
    
    await new Promise((resolve) => {
        logoImg.onload = () => {
        logoImg.onerror = () => resolve(null);
            // Draw the official logo
            ctx.drawImage(logoImg, 50, 40, 380, 240);
            
            // Add "ΟΜΙΛΟΣ ΕΤΑΙΡΕΙΩΝ" below logo
            ctx.fillStyle = "#0054a6";
            ctx.font = "bold 32px Arial";
            ctx.textAlign = "center";
            ctx.fillText("ΟΜΙΛΟΣ ΕΤΑΙΡΕΙΩΝ", 240, 320);
            
            resolve(null);
        };
        logoImg.onerror = () => resolve(null);
    });

        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.font = "bold 48px Arial";
        ctx.fillText("ΥΠΕΥΘΥΝΗ ΔΗΛΩΣΗ", canvas.width / 2 + 150, 160);
        ctx.font = "bold 38px Arial";
        ctx.fillText("ΔΙΑΧΕΙΡΙΣΤΗ/ ΕΚΠΡΟΣΩΠΟΥ ΓΕΝΙΚΗΣ ΣΥΝΕΛΕΥΣΗΣ", canvas.width / 2 + 150, 220);
        
        ctx.fillStyle = "#0054a6";
        ctx.font = "bold 34px Arial";
        ctx.fillText("ΠΡΩΤΟΤΥΠΟ", canvas.width / 2 + 150, 280);
        
        ctx.fillStyle = "black";
        ctx.font = "32px Arial";
        ctx.fillText("(ΥΠΟΓΡΑΦΕΤΑΙ ΥΠΟΧΡΕΩΤΙΚΑ ΜΟΝΟ ΜΙΑ από τις ΔΥΟ ΕΠΙΛΟΓΕΣ)", canvas.width / 2 + 150, 340);

        // --- SECTION A ---
        ctx.fillStyle = "#4a76c0";
        ctx.fillRect(80, 420, canvas.width - 160, 60);
        ctx.fillStyle = "white";
        ctx.font = "bold 34px Arial";
        ctx.textAlign = "left";
        ctx.fillText("ΕΠΙΛΟΓΗ (Α) – ΕΓΚΡΙΝΩ ΑΜΕΣΗ ΕΝΑΡΞΗ ΕΡΓΑΣΙΩΝ", 110, 465);

        // Form Fields Text
        ctx.fillStyle = "black";
        ctx.font = "34px Arial";
        ctx.fillText("Ο/Η κάτωθι υπογεγραμμένος/η", 150, 560);
        
        // Fill Name
        const fullName = `${customer.last_name || ""} ${customer.first_name || ""}`.trim().toUpperCase();
        ctx.font = "bold 38px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(fullName, 650, 560);
        
        ctx.fillStyle = "black";
        ctx.font = "34px Arial";
        ctx.fillText(", με ΑΔΤ", 1250, 560);

        // Fill ADT
        if (adt) {
            ctx.font = "bold 38px Arial";
            ctx.fillText(adt.toUpperCase(), 1420, 560);
        }
        
        ctx.font = "34px Arial";
        ctx.fillText("..............................................,", 1400, 560);
        
        ctx.fillStyle = "black";
        ctx.font = "34px Arial";
        ctx.fillText("κάτοικος", 150, 640);
        
        // Fill Resident City
        const currentCity = customer.is_florina ? "ΦΛΩΡΙΝΑ" : "ΚΑΣΤΟΡΙΑ";
        ctx.font = "bold 34px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(currentCity, 320, 640);
        
        ctx.fillStyle = "black";
        ctx.font = "34px Arial";
        ctx.fillText(", Οδός", 600, 640);
        
        // Fill Address
        if (customer.address) {
            ctx.font = "bold 34px Arial";
            ctx.fillStyle = "black";
            ctx.fillText(customer.address.toUpperCase(), 720, 640);
        }

        ctx.fillStyle = "black";
        ctx.font = "34px Arial";
        ctx.fillText(".............................................. Αρ. ........., Τ.Κ. |__|__|__|__|__|", 720, 640);
        
        // Fill TK digits
        const tk = customer.is_florina ? "53100" : "52100";
        ctx.font = "bold 34px Arial";
        ctx.fillStyle = "black";
        const tkStartX = 1410; // Moved to the left to start from the first box
        for (let i = 0; i < tk.length; i++) {
            ctx.fillText(tk[i], tkStartX + (i * 44), 640);
        }
        
        ctx.fillStyle = "black";
        ctx.font = "34px Arial";
        ctx.fillText("......................................", 300, 645); // Dotted line for city
        
        ctx.fillText("υπό την ιδιότητα μου ως Διαχειριστή, Εκπροσώπου Γενικής Συνέλευσης του κτιρίου που αναφέρεται στη Σελίδα 1 της παρούσας", 150, 720);
        ctx.fillText("(«ΣΤΟΙΧΕΙΑ ΚΤΙΡΙΟΥ») δηλώνω ότι έλαβα γνώση:", 150, 800);

        // Points
        ctx.font = "bold 32px Arial";
        ctx.fillText("1) της ανωτέρω Έκθεσης και των απαιτούμενων εργασιών από την ΟΤΕ Α.Ε. στους κοινόκτητους/κοινόχρηστους χώρους του κτιρίου, για την κατασκευή", 150, 880);
        ctx.fillText("Οπτικού Κατανεμητή ή/και Οπτικής Ίνας για την παροχή της υπηρεσίας Fiber To The Home (FTTH) στο κτίριο.", 150, 930);
        
        ctx.fillText("2) ότι το κόστος των εργασιών και των υλικών κατασκευής για την παροχή της υπηρεσίας Fiber To The Home (FTTH) στους κοινόκτητους/κοινόχρηστους", 150, 1010);
        ctx.fillText("χώρους του οικοπέδου (παρακαλώ να σηματοδοτηθεί μία από τις παρακάτω επιλογές αναλόγως της περίπτωσης του κτιρίου):", 150, 1060);

        // Checkboxes Section A
        ctx.lineWidth = 4;
        ctx.strokeRect(150, 1140, 50, 50);
        
        // Draw X in first checkbox (Option i)
        ctx.beginPath();
        ctx.moveTo(160, 1150);
        ctx.lineTo(190, 1180);
        ctx.moveTo(190, 1150);
        ctx.lineTo(160, 1180);
        ctx.stroke();

        ctx.font = "30px Arial";
        ctx.fillText("i) επιβαρύνουν αποκλειστικά την ΟΤΕ Α.Ε. η οποία θα αποκαταστήσει πλήρως τους κοινόκτητους/κοινόχρηστους χώρους του κτιρίου που", 230, 1165);
        ctx.fillText("επηρεάζονται από τις ανωτέρω εργασίες.", 260, 1210);

        // Draw X in second checkbox (Option ii)
        ctx.strokeRect(150, 1280, 50, 50);
        ctx.beginPath();
        ctx.moveTo(160, 1290);
        ctx.lineTo(190, 1320);
        ctx.moveTo(190, 1290);
        ctx.lineTo(160, 1320);
        ctx.stroke();

        ctx.font = "30px Arial";
        ctx.fillText("ii) δεν επιβαρύνουν την ΟΤΕ Α.Ε..", 230, 1315);

        ctx.font = "bold 34px Arial";
        ctx.fillText("και εγκρίνω την άμεση έναρξη των ανωτέρω εργασιών.", 150, 1420);

        ctx.font = "32px Arial";
        ctx.fillText("Τόπος & Ημερομηνία: .........................................................., |__|__| / |__|__| / |__|__|__|__|", 150, 1500);
        
        // Fill Place (Kastoria / Florina)
        ctx.font = "bold 34px Arial";
        ctx.fillText(currentCity, 520, 1500);

        // Fill Date
        const now = new Date();
        const d = String(now.getDate()).padStart(2, '0');
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const y = String(now.getFullYear());
        
        ctx.font = "bold 34px Arial";
        // Day
        ctx.fillText(d[0], 1005, 1500);
        ctx.fillText(d[1], 1050, 1500);
        // Month
        ctx.fillText(m[0], 1135, 1500);
        ctx.fillText(m[1], 1180, 1500);
        // Year
        ctx.fillText(y[0], 1275, 1500);
        ctx.fillText(y[1], 1320, 1500);
        ctx.fillText(y[2], 1365, 1500);
        ctx.fillText(y[3], 1410, 1500);
        
        ctx.fillText("Ονοματεπώνυμο & Υπογραφή:", 150, 1650);

        // Draw Signature if exists
        if (signatureUrl) {
            const sigImg = new window.Image();
            sigImg.crossOrigin = "anonymous";
            sigImg.src = getTimestampedUrl(signatureUrl);
            await new Promise((resolve) => {
                sigImg.onload = () => {
        sigImg.onerror = () => resolve(null);
                    try {
                        // Create a temporary canvas to tint the signature blue
                        const tempCanvas = document.createElement("canvas");
                        tempCanvas.width = sigImg.naturalWidth || sigImg.width || 500;
                        tempCanvas.height = sigImg.naturalHeight || sigImg.height || 250;
                        const tempCtx = tempCanvas.getContext("2d");
                        if (tempCtx) {
                            tempCtx.drawImage(sigImg, 0, 0);
                            tempCtx.globalCompositeOperation = 'source-in';
                            tempCtx.fillStyle = '#0000FF';
                            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                            // Draw the tinted signature under the text
                            ctx.drawImage(tempCanvas, 200, 1680, 500, 250);
                        } else {
                            ctx.drawImage(sigImg, 200, 1680, 500, 250);
                        }
                    } catch (err) {
                        console.error("Error drawing signature:", err);
                        try {
                            ctx.drawImage(sigImg, 200, 1680, 500, 250);
                        } catch (_) {}
                    }
                    resolve(null);
                };
                sigImg.onerror = (err) => {
                    console.error("Error loading signature in drawDigitalDecl:", err);
                    resolve(null);
                };
            });
        }

        // Separator line
        ctx.setLineDash([20, 20]);
        ctx.beginPath();
        ctx.moveTo(100, 1850);
        ctx.lineTo(canvas.width - 100, 1850);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = "24px Arial";
        ctx.fillText("✂", 120, 1860);

        // --- SECTION B ---
        ctx.fillStyle = "#4a76c0";
        ctx.fillRect(80, 1950, canvas.width - 160, 60);
        ctx.fillStyle = "white";
        ctx.font = "bold 34px Arial";
        ctx.fillText("ΕΠΙΛΟΓΗ (Β)", 110, 1995);

        // Form Fields Text Section B (Keep Blank as per user request)
        ctx.fillStyle = "black";
        ctx.font = "32px Arial";
        ctx.fillText("Ο/Η κάτωθι υπογεγραμμένος/η .................................................................................................., με ΑΔΤ ..............................................,", 150, 2080);
        ctx.fillText("κάτοικος ............................................................., Οδός .............................................. Αρ. ........., Τ.Κ. |__|__|__|__|__|", 150, 2160);
        
        ctx.fillText("......................................", 290, 2165); // Just dotted line
        ctx.fillText("υπό την ιδιότητα μου ως Διαχειριστή, Εκπροσώπου Γενικής Συνέλευσης του κτιρίου που αναφέρεται στη Σελίδα 1 της παρούσας", 150, 2240);
        ctx.fillText("(«ΣΤΟΙΧΕΙΑ ΚΤΙΡΙΟΥ») δηλώνω ότι έλαβα γνώση:", 150, 2320);

        ctx.font = "bold 32px Arial";
        ctx.fillText("1) της ανωτέρω Έκθεσης και των απαιτούμενων εργασιών από την ΟΤΕ Α.Ε. στους κοινόκτητους/κοινόχρηστους χώρους του κτιρίου, για την κατασκευή", 150, 2400);
        ctx.fillText("Οπτικού Κατανεμητή ή/και Οπτικής Ίνας για την παροχή της υπηρεσίας Fiber To The Home (FTTH) στο κτίριο.", 150, 2450);
        
        ctx.fillText("2) ότι το κόστος των εργασιών και των υλικών κατασκευής για την παροχή της υπηρεσίας Fiber To The Home (FTTH) που αποτυπώνονται στο ανωτέρω", 150, 2530);
        ctx.fillText("σκαρίφημα (παρακαλώ να σηματοδοτηθεί μία από τις παρακάτω επιλογές αναλόγως της περίπτωσης του κτιρίου):", 150, 2580);

        // Checkboxes Section B (Empty)
        ctx.strokeRect(150, 2660, 50, 50);
        ctx.strokeRect(150, 2850, 50, 50);
        
        ctx.font = "30px Arial";
        ctx.fillText("i) επιβαρύνουν αποκλειστικά την ΟΤΕ Α.Ε. η οποία θα αποκαταστήσει πλήρως τους κοινόκτητους/κοινόχρηστους χώρους του κτιρίου που", 230, 2685);
        ctx.fillText("επηρεάζονται από το ανωτέρω έργο. Η έναρξη των εργασιών θα πραγματοποιηθεί εάν εντός τριάντα (30) ημερολογιακών ημερών από σήμερα...", 260, 2730);

        ctx.fillText("ii) δεν επιβαρύνουν την ΟΤΕ Α.Ε.. Η έναρξη των εργασιών θα πραγματοποιηθεί εάν εντός τριάντα (30) ημερολογιακών ημερών από σήμερα...", 230, 2885);

        ctx.font = "32px Arial";
        ctx.fillText("Τόπος & Ημερομηνία: .........................................................., |__|__| / |__|__| / |__|__|__|__|", 150, 3100);
        ctx.fillText("Ονοματεπώνυμο & Υπογραφή:", 150, 3250);

    return canvas.toDataURL("image/jpeg", 0.95);
};

// Digital Template Generator for Inspection Report (aut_report)
const drawDigitalReport = async (customer: any, fatherName: string): Promise<string> => {
    const canvas = document.createElement("canvas");
    canvas.width = 2480; 
    canvas.height = 3508;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // Background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- HEADER ---
    const logoImg = new window.Image();
    logoImg.src = "/OTELOGO.jpg";
    
    await new Promise((resolve) => {
        logoImg.onload = () => {
        logoImg.onerror = () => resolve(null);
            ctx.drawImage(logoImg, 150, 150, 380, 240);
            ctx.fillStyle = "#0054a6";
            ctx.font = "bold 32px Arial";
            ctx.fillText("ΟΜΙΛΟΣ ΕΤΑΙΡΕΙΩΝ", 155, 430);
            resolve(null);
        };
        logoImg.onerror = () => resolve(null);
    });

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "bold 48px Arial";
    ctx.fillText("ΕΚΘΕΣΗ ΤΕΧΝΙΚΗΣ ΕΠΙΘΕΩΡΗΣΗΣ ΚΤΙΡΙΟΥ", canvas.width / 2 + 150, 280);
    ctx.font = "italic 38px Arial";
    ctx.fillText("(Έντυπο για Διαχειριστή)", canvas.width / 2 + 150, 340);
    ctx.textAlign = "left";

    let currentY = 550;
    const blueColor = "#4472c4";

    const drawSection = (title: string) => {
        ctx.fillStyle = blueColor;
        ctx.fillRect(80, currentY, canvas.width - 160, 50);
        ctx.fillStyle = "white";
        ctx.font = "bold 32px Arial";
        ctx.fillText(title, 100, currentY + 35);
        currentY += 100;
    };

    // --- SECTION 1: Στοιχεία πελάτη ---
    drawSection("Στοιχεία πελάτη");
    
    ctx.fillStyle = "black";
    ctx.font = "bold 32px Arial";
    ctx.fillText("ΟΝΟΜΑΤΕΠΩΝΥΜΟ/ΕΠΩΝΥΜΙΑ:", 100, currentY);
    ctx.font = "bold 38px Arial";
    ctx.fillStyle = "black";
    const fullName = `${customer.last_name || ""} ${customer.first_name || ""}`.trim().toUpperCase();
    ctx.fillText(fullName, 660, currentY); // Moved further right (from 585 to 660)
    
    ctx.fillStyle = "black";
    ctx.font = "bold 32px Arial";
    ctx.fillText("ΟΝΟΜΑ ΠΑΤΡΟΣ:", 1600, currentY);
    if (fatherName) {
        ctx.font = "bold 38px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(fatherName.toUpperCase(), 1880, currentY);
    }
    
    currentY += 40;
    ctx.beginPath();
    ctx.moveTo(100, currentY);
    ctx.lineTo(2380, currentY);
    ctx.stroke();

    currentY += 80;
    ctx.fillText("ΤΗΛΕΦΩΝΟ (κινητό):", 100, currentY);
    // Fill Phone
    if (customer.phone) {
        ctx.font = "bold 36px Arial"; 
        ctx.fillStyle = "black";
        const phone = customer.phone.replace(/\D/g, '');
        for(let i=0; i<Math.min(phone.length, 10); i++) {
            ctx.fillText(phone[i], 500 + (i * 30), currentY); // Less spacing, moved right
        }
    }

    currentY += 40;
    ctx.beginPath(); ctx.moveTo(100, currentY); ctx.lineTo(2380, currentY); ctx.stroke();

    currentY += 80;
    ctx.fillStyle = "black";
    ctx.font = "bold 32px Arial";
    ctx.fillText("ΤΗΛΕΦΩΝΟ (σταθερό):", 100, currentY);
    currentY += 40;
    ctx.beginPath(); ctx.moveTo(100, currentY); ctx.lineTo(2380, currentY); ctx.stroke();

    currentY += 80;
    ctx.fillText("EMAIL:", 100, currentY);
    if (customer.email) {
        ctx.font = "bold 38px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(customer.email.toLowerCase(), 250, currentY);
    }
    currentY += 40;
    ctx.beginPath(); ctx.moveTo(100, currentY); ctx.lineTo(2380, currentY); ctx.stroke();

    currentY += 80;
    drawSection(""); // Spacer
    currentY -= 50;

    ctx.fillStyle = "black";
    ctx.font = "bold 32px Arial";
    ctx.fillText("ΟΔΟΣ:", 100, currentY + 45); 
    ctx.font = "bold 38px Arial";
    ctx.fillStyle = "black";
    ctx.fillText((customer.address || "").toUpperCase(), 250, currentY + 45);
    
    ctx.fillStyle = "black";
    ctx.font = "bold 32px Arial";
    ctx.fillText("ΑΡΙΘ.:", 1100, currentY + 45);
    
    ctx.fillText("Τ.Κ.:", 1600, currentY + 45);
    ctx.font = "bold 36px Arial";
    ctx.fillStyle = "black";
    const tk = "52100";
    for(let i=0; i<tk.length; i++) {
        ctx.fillText(tk[i], 1720 + (i * 30), currentY + 45); // Less spacing
    }

    currentY += 85; 
    ctx.beginPath(); ctx.moveTo(100, currentY); ctx.lineTo(2380, currentY); ctx.stroke();

    currentY += 80;
    ctx.fillStyle = "black";
    ctx.font = "bold 32px Arial";
    ctx.fillText("ΟΡΟΦΟΣ:", 100, currentY);
    if (customer.floor) {
        ctx.font = "bold 38px Arial";
        ctx.fillText(customer.floor.toUpperCase(), 260, currentY);
    }
    
    const currentCityGen = customer.is_florina ? "ΦΛΩΡΙΝΑΣ" : "ΚΑΣΤΟΡΙΑΣ";
    ctx.font = "bold 32px Arial";
    ctx.fillText("ΚΩΔ. ΔΙΑΜ/ΤΟΣ:", 500, currentY);
    ctx.fillText("ΝΟΜΟΣ :", 1200, currentY);
    ctx.font = "bold 38px Arial";
    ctx.fillText(currentCityGen, 1350, currentY);

    ctx.font = "bold 32px Arial";
    ctx.fillText("ΔΗΜΟΣ:", 1900, currentY);
    ctx.font = "bold 38px Arial";
    ctx.fillText(currentCityGen, 2050, currentY);
    // Line removed from here

    currentY += 100;
    ctx.fillStyle = "black";
    ctx.font = "bold 32px Arial";
    ctx.fillText("Παρατηρήσεις", 100, currentY);
    ctx.font = "32px Arial";
    ctx.fillText("..................................................................................................................................................................", 450, currentY);
    currentY += 80;
    ctx.fillText("............................................................................................................................................................................................", 100, currentY);
    currentY += 80;
    ctx.fillText("............................................................................................................................................................................................", 100, currentY);
    currentY += 80;
    ctx.fillText("............................................................................................................................................................................................", 100, currentY);

    currentY += 100;
    drawSection("Στοιχεία διαχειριστή");
    ctx.fillStyle = "black";
    ctx.fillText("ΟΝΟΜΑΤΕΠΩΝΥΜΟ:", 100, currentY);
    currentY += 40;
    ctx.beginPath(); ctx.moveTo(100, currentY); ctx.lineTo(2380, currentY); ctx.stroke();
    
    currentY += 80;
    ctx.fillText("ΤΗΛΕΦΩΝΟ ΕΠΙΚΟΙΝΩΝΙΑΣ (κινητό): |__|__|__|__|__|__|__|__|__|__|", 100, currentY);
    currentY += 40;
    ctx.beginPath(); ctx.moveTo(100, currentY); ctx.lineTo(2380, currentY); ctx.stroke();

    currentY += 80;
    ctx.fillText("EMAIL:", 100, currentY);
    currentY += 40;
    ctx.beginPath(); ctx.moveTo(100, currentY); ctx.lineTo(2380, currentY); ctx.stroke();

    currentY += 60;
    ctx.font = "italic 28px Arial";
    ctx.fillText("Ειδικό πεδίο που συμπληρώνεται διότι απαιτείται επικοινωνία με τον Διαχειριστή του κτιρίου. Τα στοιχεία του Διαχειριστή θα χρησιμοποιηθούν αποκλειστικά και", 100, currentY);
    currentY += 40;
    ctx.fillText("μόνο για τους σκοπούς της παρούσας.", 100, currentY);

    currentY += 60;
    drawSection(""); // Spacer
    currentY -= 50;
    ctx.fillStyle = "black";
    ctx.font = "bold 32px Arial";
    ctx.fillText("ΑΡΜΟΔΙΑ ΤΕΧΝΙΚΗ ΥΠΗΡΕΣΙΑ:", 100, currentY + 45); // Moved down
    currentY += 40;
    ctx.beginPath(); ctx.moveTo(100, currentY); ctx.lineTo(2380, currentY); ctx.stroke();

    currentY += 80;
    ctx.fillText("ΔΙΕΥΘΥΝΣΗ ΑΛΛΗΛΟΓΡΑΦΙΑΣ:", 100, currentY);
    currentY += 40;
    ctx.beginPath(); ctx.moveTo(100, currentY); ctx.lineTo(2380, currentY); ctx.stroke();

    currentY += 80;
    ctx.fillText("ΤΗΛΕΦΩΝΟ ΕΠΙΚΟΙΝΩΝΙΑΣ (σταθερό): |__|__|__|__|__|__|__|__|__|__|", 100, currentY);
    currentY += 40;
    ctx.beginPath(); ctx.moveTo(100, currentY); ctx.lineTo(2380, currentY); ctx.stroke();

    currentY += 80;
    ctx.fillText("EMAIL:", 100, currentY);
    currentY += 40;
    ctx.beginPath(); ctx.moveTo(100, currentY); ctx.lineTo(2380, currentY); ctx.stroke();

    currentY += 80;
    ctx.fillText("ΟΝΟΜΑΤΕΠΩΝΥΜΟ ΤΕΧΝΙΚΟΥ ΠΟΥ ΕΠΙΤΕΛΕΣΕ ΤΗΝ ΑΥΤΟΨΙΑ:", 100, currentY);
    currentY += 40;
    ctx.beginPath(); ctx.moveTo(100, currentY); ctx.lineTo(2380, currentY); ctx.stroke();

    currentY += 60;
    ctx.font = "italic 26px Arial";
    ctx.fillText("Ο Πελάτης ή ο Διαχειριστής μπορεί να επικοινωνεί με τον Τεχνικό Υπεύθυνο για περισσότερες τεχνικές διευκρινήσεις ως προς την κατασκευή του FTTH στο", 100, currentY);
    currentY += 40;
    ctx.fillText("προαναφερόμενο κτίριο. Ώρες επικοινωνίας: Δευτέρα έως Παρασκευή 08:00-15:00", 100, currentY);

    return canvas.toDataURL("image/jpeg", 0.95);
};

// Digital Template Generator for Technical Description (aut_tech)
const drawDigitalTech = async (customer: any, techData: TechDescriptionData, signatureUrl?: string | null): Promise<string> => {
    const canvas = document.createElement("canvas");

    canvas.width = 2480;
    canvas.height = 3508;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // Background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Helpers
    const drawBox = (x: number, y: number, isChecked?: boolean) => {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, 60, 60);

        if (isChecked) {
            ctx.beginPath();
            ctx.moveTo(x + 10, y + 10);
            ctx.lineTo(x + 50, y + 50);
            ctx.moveTo(x + 50, y + 10);
            ctx.lineTo(x + 10, y + 50);
            ctx.stroke();
        }
    };


    const drawDots = (x: number, y: number, len: number) => {
        let dots = "";
        for(let i=0; i<len; i++) dots += ".";
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(dots, x, y);
    };

    const blueOTE = "#0054a6";
    const lightBlueGrid = "#cfe2f3";
    const sectionBlue = "#4472c4";

    // --- HEADER ---
    const logoImg = new window.Image();
    logoImg.src = "/OTELOGO.jpg";
    await new Promise((resolve) => {
        logoImg.onload = () => {
        logoImg.onerror = () => resolve(null);
            ctx.drawImage(logoImg, 100, 80, 280, 180);
            ctx.fillStyle = blueOTE;
            ctx.font = "bold 28px Arial";
            ctx.textAlign = "center";
            ctx.fillText("ΟΜΙΛΟΣ ΕΤΑΙΡΕΙΩΝ", 240, 300);
            resolve(null);
        };
        logoImg.onerror = () => resolve(null);
    });

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "bold 46px Arial";
    ctx.fillText("ΕΝΤΥΠΟ ΤΕΧΝΙΚΗΣ ΠΕΡΙΓΡΑΦΗΣ – ΕΠΙΘΕΩΡΗΣΗΣ", canvas.width / 2 + 100, 150);
    
    ctx.textAlign = "left";
    let currentY = 380;

    // --- SECTION 1 ---
    ctx.font = "bold 34px Arial";
    ctx.fillText("1. ΟΔΕΥΣΗ ΜΕΧΡΙ ΤΟΝ ΚΕΝΤΡΙΚΟ ΟΠΤΙΚΟ ΚΑΤΑΝΕΜΗΤΗ ΚΤΙΡΙΟΥ (B.E.P.)", 100, currentY);
    
    currentY += 40;
    ctx.strokeStyle = sectionBlue;
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(100, currentY); ctx.lineTo(2380, currentY); ctx.stroke();

    // Four Columns with blue separators
    const colX = [100, 750, 1450, 2000];
    ctx.lineWidth = 2;
    for(let i=1; i<4; i++) {
        ctx.beginPath(); ctx.moveTo(colX[i]-30, currentY + 10); ctx.lineTo(colX[i]-30, currentY + 460); ctx.stroke();
    }

    ctx.fillStyle = "black"; 
    ctx.font = "bold 24px Arial";
    // Col 1
    ctx.fillText("ΜΕ ΧΡΗΣΗ ΕΣΚΑΛΙΤ", 100, currentY + 60);
    ctx.fillText("(Εισαγωγή χαλκού)", 100, currentY + 100);
    drawBox(colX[1] - 120, currentY + 40);

    ctx.font = "26px Arial";
    ctx.fillText("Εκσκαφή πεζοδρομίου", 100, currentY + 220);
    ctx.fillText("έως σωλήνα εισαγωγής", 100, currentY + 265);
    drawBox(colX[1] - 120, currentY + 40, techData.use_escalit);
    drawBox(380, currentY + 210, techData.escalit_excavation === "NAI"); 
    drawBox(540, currentY + 210, techData.escalit_excavation === "OXI");
    ctx.font = "bold 22px Arial";
    ctx.fillText("ΝΑΙ", 390, currentY + 310); ctx.fillText("ΟΧΙ", 550, currentY + 310);


    // Col 2
    ctx.font = "bold 24px Arial";
    ctx.fillText("ΕΞΩΤΕΡΙΚΗ ΟΔΕΥΣΗ ΜΕ", colX[1], currentY + 60);
    ctx.fillText("ΧΡΗΣΗ ΣΙΔΗΡΟΣΩΛΗΝΑ", colX[1], currentY + 100);
    drawBox(colX[2] - 120, currentY + 40);

    ctx.font = "26px Arial";
    ctx.fillText("Εκσκαφή πεζοδρομίου", colX[1], currentY + 220);
    ctx.fillText("έως ΡΓ", colX[1], currentY + 265);
    drawBox(colX[2] - 120, currentY + 40, techData.external_pipe);
    drawBox(colX[1] + 280, currentY + 210, techData.pipe_excavation === "NAI"); 
    drawBox(colX[1] + 440, currentY + 210, techData.pipe_excavation === "OXI");
    ctx.font = "bold 22px Arial";
    ctx.fillText("ΝΑΙ", colX[1] + 290, currentY + 310); ctx.fillText("ΟΧΙ", colX[1] + 450, currentY + 310);


    ctx.font = "bold 24px Arial"; ctx.fillStyle = "black"; ctx.textAlign = "center";
    ctx.fillText("Τοποθέτηση Σιδηροσωλήνα", colX[1] + 280, currentY + 360);
    // Underline
    ctx.beginPath(); ctx.moveTo(colX[1] + 130, currentY + 368); ctx.lineTo(colX[1] + 430, currentY + 368); ctx.stroke();
    
    ctx.textAlign = "left"; 
    ctx.font = "24px Arial";
    ctx.fillText("Στήριξη επί τοιχοποιίας", colX[1], currentY + 410);
    ctx.fillText("περίφραξης ή/και κτιρίου", colX[1], currentY + 445);
    drawBox(colX[2] - 120, currentY + 400, techData.pipe_support_fence);

    ctx.fillText("Εκσκαφή έως το κτίριο και", colX[1], currentY + 500);
    ctx.fillText("στήριξη επί του κτιρίου", colX[1], currentY + 535);
    drawBox(colX[2] - 120, currentY + 490, techData.pipe_support_building);


    // Col 3
    ctx.font = "bold 24px Arial";
    ctx.fillText("ΕΝΑΕΡΙΟ", colX[2], currentY + 60);
    drawBox(colX[3] - 120, currentY + 40, techData.aerial);
    for(let i=0; i<6; i++) drawDots(colX[2], currentY + 150 + (i*70), 65);

    // Col 4
    ctx.fillText("ΑΛΛΟΣ ΤΡΟΠΟΣ", colX[3], currentY + 60);
    drawBox(canvas.width - 160, currentY + 40, techData.other_way_1);
    if (techData.other_way_1 && techData.other_way_1_text) {
        ctx.font = "30px Arial";
        ctx.fillText(techData.other_way_1_text, colX[3], currentY + 150);
    } else {
        for(let i=0; i<6; i++) drawDots(colX[3], currentY + 150 + (i*70), 35);
    }


    // --- SECTION 2 ---
    currentY += 650;
    ctx.textAlign = "center"; ctx.font = "bold 34px Arial"; ctx.fillStyle = "black";
    ctx.fillText("2. ΘΕΣΗ B.E.P", canvas.width / 2, currentY);
    ctx.textAlign = "left";
    
    currentY += 60;
    const drawBepOption = (text1: string, text2: string, x: number, y: number, isChecked1?: boolean, isChecked2?: boolean) => {
        ctx.font = "bold 20px Arial";
        ctx.fillText(text1, x, y);
        ctx.fillText(text2, x, y + 45);
        drawBox(x + 240, y - 35, isChecked1);
        drawBox(x + 240, y + 10, isChecked2);
    };

    drawBepOption("ΕΣΩΤΕΡΙΚΑ", "ΕΞΩΤΕΡΙΚΑ", 100, currentY, techData.bep_internal, techData.bep_external);
    drawBepOption("ΣΤΗΝ ΠΕΡΙΦΡΑΞΗ", "ΣΤΟ ΚΤΙΡΙΟ", 550, currentY, techData.bep_fence, techData.bep_building);
    drawBepOption("ΕΠΙ ΣΤΥΛΟΥ", "PILAR", 1050, currentY, techData.bep_pole, techData.bep_pilar);
    drawBepOption("ΥΠΟΓΕΙΟ", "ΙΣΟΓΕΙΟ", 1550, currentY, techData.bep_underground, techData.bep_ground);
    drawBepOption("ΤΑΡΑΤΣΑ", "ΠΥΛΩΤΗ", 2050, currentY, techData.bep_roof, techData.bep_piloti);


    // --- SECTION 3 ---
    currentY += 180;
    ctx.textAlign = "center"; ctx.font = "bold 34px Arial";
    ctx.fillText("3. ΚΑΤΑΚΟΡΥΦΗ ΟΔΕΥΣΗ ΠΡΟΣ ΤΑ ΚΟΥΤΙΑ ΔΙΑΝΟΜΗΣ ΟΡΟΦΩΝ (F.B.)", canvas.width / 2, currentY);
    ctx.textAlign = "left";
    
    currentY += 60;
    const drawFbOption = (text1: string, text2: string, x: number, y: number, boxOffset = 350, isChecked1?: boolean, isChecked2?: boolean) => {
        ctx.font = "bold 20px Arial";
        ctx.fillText(text1, x, y);
        ctx.fillText(text2, x, y + 45);
        drawBox(x + boxOffset, y - 35, isChecked1);
        drawBox(x + boxOffset, y + 10, isChecked2);
    };

    drawFbOption("ΦΡΕΑΤΙΟ", "ΑΝΕΛΚΥΣΤΗΡΑ", 100, currentY, 260, techData.fb_shaft, techData.fb_elevator);
    drawFbOption("ΚΛΙΜΑΚΟΣΤΑΣΙΟ", "ΕΣΩΤΕΡΙΚΑ / ΕΞΩΤΕΡΙΚΑ", 500, currentY, 440, techData.fb_staircase, techData.fb_internal_external);
    drawFbOption("ΦΩΤΑΓΩΓΟΣ", "ΦΑΝΑΡΙ ΣΚΑΛΑΣ", 1150, currentY, 320, techData.fb_lightwell, techData.fb_stairwell);
    
    ctx.font = "bold 20px Arial";
    ctx.fillText("ΑΛΛΟΣ ΤΡΟΠΟΣ", 1650, currentY);
    drawBox(2000, currentY - 35, techData.fb_other_way);
    if (techData.fb_other_way && techData.fb_other_way_text) {
        ctx.font = "30px Arial";
        ctx.fillText(techData.fb_other_way_text, 1650, currentY + 60);
    } else {
        drawDots(1650, currentY + 60, 80);
    }


    // --- SKETCH AREA ---
    currentY += 200;
    ctx.font = "bold 36px Arial"; ctx.fillText("ΣΚΑΡΙΦΜΑΤΑ", 100, currentY);
    
    currentY += 40;
    const sketchHeight = 750;
    const sketchWidth = 1800;
    const sketchX = 350;
    
    // Grid (Right Side)
    ctx.strokeStyle = lightBlueGrid; ctx.lineWidth = 1;
    for(let i=0; i<=sketchWidth/2; i+=40) {
        ctx.beginPath(); ctx.moveTo(sketchX + sketchWidth/2 + i, currentY); ctx.lineTo(sketchX + sketchWidth/2 + i, currentY + sketchHeight - 150); ctx.stroke();
    }
    for(let i=0; i<=sketchHeight-150; i+=40) {
        ctx.beginPath(); ctx.moveTo(sketchX + sketchWidth/2, currentY + i); ctx.lineTo(sketchX + sketchWidth, currentY + i); ctx.stroke();
    }

    // Building Box (Left Side)
    ctx.strokeStyle = sectionBlue; ctx.lineWidth = 3;
    ctx.setLineDash([15, 10, 3, 10]);
    ctx.strokeRect(sketchX + 50, currentY + 20, 800, 550);
    ctx.setLineDash([]);
    
    // Inner Solid Box (Building Floors)
    const buildingX = sketchX + 150;
    const buildingY = currentY + 50;
    const buildingW = 600;
    const buildingH = 500;
    ctx.strokeStyle = "black"; ctx.lineWidth = 2;
    ctx.strokeRect(buildingX, buildingY, buildingW, buildingH);

    // Dynamic Floors & Labels
    const customerIdx = techData.customer_floor_index !== undefined ? techData.customer_floor_index : 3;
    const floorLabels = [
        "Υπόγειο", "Ημιυπόγειο", "Ημιόροφος", "Ισόγειο", 
        "1ος", "2ος", "3ος", "4ος", "5ος", "6ος",
        "7ος", "8ος", "9ος", "10ος"
    ];
    
    let activeFloors = techData.active_floors;
    if (!activeFloors || activeFloors.length === 0) {
        const totalFloorsFallback = techData.total_floors || 1;
        const baseFloorIdxFallback = techData.base_floor_index !== undefined 
            ? techData.base_floor_index 
            : Math.max(0, customerIdx - Math.max(0, Math.min(totalFloorsFallback - 1, customerIdx - 3)));
        activeFloors = Array.from({ length: totalFloorsFallback }).map((_, i) => baseFloorIdxFallback + i);
    }
    
    const totalFloors = Math.max(1, activeFloors.length);
    const floorHeight = buildingH / totalFloors;

    for (let i = 0; i < totalFloors; i++) {
        const floorIndex = activeFloors[i];
        const floorY = buildingY + buildingH - (i * floorHeight) - (floorHeight / 2);
        
        // Draw floor separator line (except for the bottom which is the box edge)
        if (i > 0) {
            const lineY = buildingY + buildingH - (i * floorHeight);
            ctx.beginPath();
            ctx.strokeStyle = "black"; ctx.lineWidth = 2;
            ctx.moveTo(buildingX, lineY);
            ctx.lineTo(buildingX + buildingW, lineY);
            ctx.stroke();
        }

        // Draw Apartments & Shops
        const numApts = techData.apartments_per_floor?.[floorIndex] || 0;
        const numShops = techData.shops_per_floor?.[floorIndex] || 0;
        const totalUnits = numApts + numShops;

        if (totalUnits > 0) {
            const unitWidth = buildingW / totalUnits;
            ctx.strokeStyle = "black"; ctx.lineWidth = 1.5;
            
            for (let j = 1; j < totalUnits; j++) {
                const unitX = buildingX + (j * unitWidth);
                ctx.beginPath();
                ctx.moveTo(unitX, buildingY + buildingH - (i * floorHeight));
                ctx.lineTo(unitX, buildingY + buildingH - ((i + 1) * floorHeight));
                ctx.stroke();
            }

            // Draw Labels for each unit
            ctx.font = floorHeight < 40 ? "italic 13px Arial" : "italic 16px Arial";
            ctx.textAlign = "center";
            for (let j = 0; j < totalUnits; j++) {
                const labelX = buildingX + (j * unitWidth) + (unitWidth / 2);
                const labelY = floorY + (floorHeight / 3);
                
                if (j < numApts) {
                    ctx.fillStyle = "#888888";
                    ctx.fillText("διαμέρισμα", labelX, labelY);
                } else {
                    ctx.fillStyle = "#6b7280"; // Slightly darker for shops
                    ctx.fillText("κατάστημα", labelX, labelY);
                }
            }
            ctx.textAlign = "left";
        }


        // Draw Arrow
        const arrowStartX = buildingX + buildingW + 20;
        const arrowEndX = buildingX + buildingW + 120;
        ctx.strokeStyle = "red"; ctx.lineWidth = floorHeight < 40 ? 2 : 3;
        ctx.beginPath();
        ctx.moveTo(arrowStartX, floorY);
        ctx.lineTo(arrowEndX, floorY);
        // Arrow head
        const arrowHeadSize = Math.min(15, Math.max(8, floorHeight * 0.3));
        ctx.moveTo(arrowStartX + 20, floorY - arrowHeadSize);
        ctx.lineTo(arrowStartX, floorY);
        ctx.lineTo(arrowStartX + 20, floorY + arrowHeadSize);
        ctx.stroke();

        // Draw Floor Label
        const floorLabel = floorLabels[floorIndex] || `${floorIndex}ος`;
        ctx.fillStyle = "red";
        ctx.font = floorHeight < 36 ? "bold 20px Arial" : floorHeight < 45 ? "bold 24px Arial" : "bold 32px Arial";
        ctx.textAlign = "left";
        ctx.fillText(floorLabel, arrowEndX + 20, floorY + (floorHeight < 36 ? 7 : 10));

        // Check if this is the Ground Floor (Ισόγειο) for BEP/BMO
        if (floorLabel === "Ισόγειο") {
            const boxH = Math.min(50, Math.max(24, floorHeight - 6));
            const boxTop = floorY - (boxH / 2);
            const boxFont = `bold ${Math.min(22, Math.max(13, Math.round(boxH * 0.45)))}px Arial`;
            const textOffsetY = Math.round(boxH * 0.2);

            // BEP Box
            const bepX = buildingX + 200;
            ctx.strokeStyle = "#2e7d32"; // Dark Green
            ctx.lineWidth = 2;
            ctx.strokeRect(bepX, boxTop, 100, boxH);
            ctx.fillStyle = "#2e7d32";
            ctx.font = boxFont;
            ctx.textAlign = "center";
            ctx.fillText("BEP", bepX + 50, floorY + textOffsetY);

            // BMO Box
            const bmoX = buildingX + 320;
            ctx.strokeStyle = "#8d6e63"; // Brownish for BMO
            ctx.lineWidth = 2;
            ctx.strokeRect(bmoX, boxTop, 100, boxH);
            ctx.fillStyle = "#8d6e63";
            ctx.font = boxFont;
            ctx.textAlign = "center";
            ctx.fillText("BMO", bmoX + 50, floorY + textOffsetY);
            
            ctx.textAlign = "left";
        }

        // Draw FB Box if enabled AND there are apartments on this floor
        const hasFbOnFloor = techData.fb_per_floor?.[floorIndex] !== false;
        if (techData.use_fb && hasFbOnFloor && numApts > 0) {
            const fbX = buildingX + buildingW - 150;
            const boxH = Math.min(50, Math.max(24, floorHeight - 6));
            const boxTop = floorY - (boxH / 2);
            ctx.strokeStyle = "#4472c4"; // Blue color for FB
            ctx.lineWidth = 2;
            ctx.strokeRect(fbX, boxTop, 100, boxH);
            
            ctx.fillStyle = "#4472c4";
            ctx.font = `bold ${Math.min(24, Math.max(13, Math.round(boxH * 0.48)))}px Arial`;
            ctx.textAlign = "center";
            ctx.fillText("FB", fbX + 50, floorY + Math.round(boxH * 0.2));
            ctx.textAlign = "left";
        }
    }

    // OTO Box
    const srStr = customer?.sr ? String(customer.sr).trim() : "";
    const isSixDigitSr = /^\d{6}$/.test(srStr);

    if (techData.customer_floor_index !== undefined && !isSixDigitSr) {
        const targetLevel = activeFloors.indexOf(customerIdx);
        if (targetLevel !== -1) {
            const otoY = buildingY + buildingH - (targetLevel * floorHeight) - (floorHeight / 2);
            const boxH = Math.min(50, Math.max(24, floorHeight - 6));
            const boxTop = otoY - (boxH / 2);
            
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.strokeRect(buildingX + 50, boxTop, 100, boxH);
            
            ctx.fillStyle = "red";
            ctx.font = `bold ${Math.min(24, Math.max(13, Math.round(boxH * 0.48)))}px Arial`;
            ctx.textAlign = "center";
            ctx.fillText("OTO", buildingX + 100, otoY + Math.round(boxH * 0.2));
            ctx.textAlign = "left";
        }
    }


    // Horizontal Lines (OG, RG)
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = sectionBlue;
    ctx.beginPath(); ctx.moveTo(sketchX, currentY + 620); ctx.lineTo(sketchX + sketchWidth/2, currentY + 620); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sketchX, currentY + 680); ctx.lineTo(sketchX + sketchWidth/2, currentY + 680); ctx.stroke();
    ctx.setLineDash([]);


    ctx.font = "italic 32px Arial"; ctx.fillStyle = "black";
    ctx.fillText("Ο.Γ.", sketchX + 10, currentY + 610);
    ctx.fillText("Ρ.Γ.", sketchX + 10, currentY + 670);
    ctx.fillText("Κράσπεδο", sketchX + 50, currentY + 740);

    // Kraspedo diagonal pattern
    ctx.save();
    ctx.beginPath();
    ctx.rect(sketchX, currentY + 680, sketchWidth/2, 70);
    ctx.clip();
    ctx.strokeStyle = lightBlueGrid; ctx.lineWidth = 1;
    for(let i=-200; i<sketchWidth; i+=25) {
        ctx.beginPath(); ctx.moveTo(sketchX + i, currentY + 680); ctx.lineTo(sketchX + i + 100, currentY + 750); ctx.stroke();
    }
    ctx.restore();

    // --- OBSERVATIONS ---
    currentY += 850;
    ctx.font = "bold 34px Arial"; ctx.fillText("ΠΑΡΑΤΗΡΗΣΕΙΣ - ΠΕΡΙΓΡΑΦΗ", 100, currentY);
    ctx.lineWidth = 1; ctx.strokeStyle = "black";
    for(let i=0; i<5; i++) {
        ctx.beginPath(); ctx.moveTo(100, currentY + 50 + (i*65)); ctx.lineTo(2380, currentY + 50 + (i*65)); ctx.stroke();
    }

    if (techData.general_remarks) {
        ctx.font = "28px Arial";
        ctx.fillStyle = "black";
        
        const drawWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
            const paragraphs = text.split('\n');
            let tempY = y;
            
            paragraphs.forEach(paragraph => {
                const words = paragraph.split(' ');
                let line = '';
                
                for (let i = 0; i < words.length; i++) {
                    const testLine = line + words[i] + ' ';
                    const metrics = ctx.measureText(testLine);
                    const testWidth = metrics.width;
                    
                    if (testWidth > maxWidth && i > 0) {
                        ctx.fillText(line, x, tempY);
                        line = words[i] + ' ';
                        tempY += lineHeight;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, x, tempY);
                tempY += lineHeight;
            });
        };

        drawWrappedText(techData.general_remarks, 110, currentY + 40, 2200, 65);
    }


    // --- FOOTER ---
    currentY += 450;
    ctx.font = "bold 30px Arial";
    ctx.fillText("Θέση Οπτικής Πρίζας", 100, currentY);
    drawDots(450, currentY, 95);
    
    ctx.fillText("Υπογραφή Μηχανικού", 1400, currentY);
    
    // --- Permanent Engineer Signature ---
    const engSigImg = new window.Image();
    engSigImg.src = window.localStorage.getItem("autopsia_engineer_signature") || "/engineer_sig.jpg";
    await new Promise((resolve) => {
        engSigImg.onload = () => {
        engSigImg.onerror = () => resolve(null);
            // Tint it blue like the others
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = engSigImg.width;
            tempCanvas.height = engSigImg.height;
            const tempCtx = tempCanvas.getContext("2d");
            if (tempCtx) {
                tempCtx.drawImage(engSigImg, 0, 0);
                
                // Get image data to remove white background and tint blue
                const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                const data = imgData.data;
                
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i+1];
                    const b = data[i+2];
                    
                    // Calculate brightness (average)
                    const brightness = (r + g + b) / 3;
                    
                    // Make it transparent based on brightness (white = transparent)
                    data[i+3] = 255 - brightness;
                    
                    // Force it to be Blue
                    data[i] = 0;   // R
                    data[i+1] = 0; // G
                    data[i+2] = 255; // B
                }
                
                tempCtx.putImageData(imgData, 0, 0);
                ctx.drawImage(tempCanvas, 1750, currentY - 120, 450, 200);
            }
            resolve(null);
        };
        engSigImg.onerror = () => resolve(null); // Continue if image not found
    });

    currentY += 70;
    // Materials Box
    ctx.strokeStyle = "black"; ctx.lineWidth = 2;
    ctx.strokeRect(100, currentY, 1200, 220);
    ctx.font = "bold 24px Arial";
    ctx.fillText("ΥΛΙΚΑ ΠΟΥ ΧΡΗΣΙΜΟΠΟΙΟΥΝΤΑΙ ΣΕ ΤΥΠΙΚΗ ΚΑΤΑΣΚΕΥΗ:", 130, currentY + 50);
    ctx.font = "22px Arial";
    ctx.fillText("- Γαλβανισμένος Σιδηροσωλήνας Φ20.", 130, currentY + 95);
    ctx.fillText("- Σύστημα Πλαστικών Σωλήνων Βαρέος Τύπου Condur – Conflex Φ16 έως Φ25.", 130, currentY + 140);
    ctx.fillText("- Από το F.B. έως την οπτική πρίζα του πελάτη: Πλαστικό Κανάλι Διανομής.", 130, currentY + 185);
    
    ctx.textAlign = "right"; ctx.font = "italic 20px Arial";
    ctx.fillText("*B.E.P.: Building Entry Point  –  F.B.: Floor Box", 1290, currentY + 245);
    ctx.textAlign = "left";

    // Signature Area
    ctx.font = "bold 28px Arial";
    ctx.fillText("Όνομα & Υπογραφή Πελάτη", 1400, currentY + 90);
    drawDots(1850, currentY + 90, 45);
    
    ctx.fillText("Όνομα & Υπογραφή Διαχειριστή", 1400, currentY + 200);
    drawDots(1950, currentY + 200, 35);

    // Signatures rendering (Blue)
    if (signatureUrl) {
        const sigImg = new window.Image();
        sigImg.crossOrigin = "anonymous";
        sigImg.src = getTimestampedUrl(signatureUrl);
        await new Promise((resolve) => {
            sigImg.onload = () => {
        sigImg.onerror = () => resolve(null);
                try {
                    const tempCanvas = document.createElement("canvas");
                    tempCanvas.width = sigImg.naturalWidth || sigImg.width || 450;
                    tempCanvas.height = sigImg.naturalHeight || sigImg.height || 120;
                    const tempCtx = tempCanvas.getContext("2d");
                    if (tempCtx) {
                        tempCtx.drawImage(sigImg, 0, 0);
                        tempCtx.globalCompositeOperation = 'source-in';
                        tempCtx.fillStyle = '#0000FF'; // Blue Pen
                        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                        
                        // Draw for Customer and Manager
                        ctx.drawImage(tempCanvas, 1900, currentY + 10, 450, 120);
                        ctx.drawImage(tempCanvas, 1900, currentY + 120, 450, 120);
                    } else {
                        ctx.drawImage(sigImg, 1900, currentY + 10, 450, 120);
                        ctx.drawImage(sigImg, 1900, currentY + 120, 450, 120);
                    }
                } catch (err) {
                    console.error("Error drawing signature in tech:", err);
                    try {
                        ctx.drawImage(sigImg, 1900, currentY + 10, 450, 120);
                        ctx.drawImage(sigImg, 1900, currentY + 120, 450, 120);
                    } catch (_) {}
                }
                resolve(null);
            };
            sigImg.onerror = (err) => {
                console.error("Error loading signature in drawDigitalTech:", err);
                resolve(null);
            };
        });
    }

    // Bottom Legal Text
    ctx.font = "italic 24px Arial"; ctx.fillStyle = "#555";
    ctx.fillText("Η υποδομή που απαιτείται προκειμένου να διασυνδεθεί η πολυκατοικία με το δίκτυο οπτικών ινών θα βαρύνει αποκλειστικά τον αιτούντα την υπηρεσία FTTH,", 100, canvas.height - 100);
    ctx.fillText("ο οποίος έχει ενημερωθεί για τη χρέωση βάσει του συμβολαίου του με τον τηλεπικοινωνιακό πάροχο.", 100, canvas.height - 60);

    return canvas.toDataURL("image/jpeg", 0.95);
};

// Digital Template Generator for Form 1 (aut_form1)
const drawDigitalForm1 = async (customer: any, techData?: TechDescriptionData): Promise<string> => {
    const canvas = document.createElement("canvas");

    canvas.width = 2480;
    canvas.height = 3508;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // Background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Helpers
    const drawBox = (x: number, y: number, w: number, h: number, lineWidth = 2) => {
        ctx.strokeStyle = "black";
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, w, h);
    };

    const drawDottedLine = (x1: number, y1: number, x2: number, y2: number) => {
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    };

    // --- HEADER ---
    drawBox(100, 100, 2280, 150, 4);
    ctx.fillStyle = "black";
    ctx.font = "bold 32px Arial";
    ctx.fillText("ΔΙΕΥΘΥΝΣΗ:", 120, 160);
    ctx.font = "32px Arial";
    ctx.fillText((customer.address || "").toUpperCase(), 350, 160);
    drawDottedLine(350, 170, 2350, 170);

    ctx.font = "bold 32px Arial";
    ctx.fillText("ΟΡΟΦΟΣ ΠΕΛΑΤΗ:", 120, 225);
    ctx.font = "32px Arial";
    
    let displayFloor = customer.floor || "";
    if (techData && techData.customer_floor_index !== undefined) {
        const floorLabels = [
            "ΥΠΟΓΕΙΟ", "ΗΜΙΥΠΟΓΕΙΟ", "ΗΜΙΟΡΟΦΟΣ", "ΙΣΟΓΕΙΟ", 
            "1ΟΣ ΟΡΟΦΟΣ", "2ΟΣ ΟΡΟΦΟΣ", "3ΟΣ ΟΡΟΦΟΣ", "4ΟΣ ΟΡΟΦΟΣ", "5ΟΣ ΟΡΟΦΟΣ", "6ΟΣ ΟΡΟΦΟΣ",
            "7ΟΣ ΟΡΟΦΟΣ", "8ΟΣ ΟΡΟΦΟΣ", "9ΟΣ ΟΡΟΦΟΣ", "10ΟΣ ΟΡΟΦΟΣ"
        ];
        displayFloor = floorLabels[techData.customer_floor_index] || displayFloor;
    }
    ctx.fillText(displayFloor.toUpperCase(), 450, 225);


    ctx.font = "bold 32px Arial";
    ctx.fillText("Building Id:", 1100, 225);
    ctx.font = "32px Arial";
    ctx.fillText((customer.building_id || "").toString().toUpperCase(), 1300, 225);

    // --- FLOOR BLOCKS ---
    const floorListLeft = ["ΥΠΟΓΕΙΟ", "ΙΣΟΓΕΙΟ", "1ΟΣ ΟΡΟΦΟΣ", "3ΟΣ ΟΡΟΦΟΣ", "5ΟΣ ΟΡΟΦΟΣ", "7ΟΣ ΟΡΟΦΟΣ", "9ΟΣ ΟΡΟΦΟΣ"];
    const floorListRight = ["ΗΜΙΥΠΟΓΕΙΟ", "ΗΜΙΟΡΟΦΟΣ", "2ΟΣ ΟΡΟΦΟΣ", "4ΟΣ ΟΡΟΦΟΣ", "6ΟΣ ΟΡΟΦΟΣ", "8ΟΣ ΟΡΟΦΟΣ", "10ΟΣ ΟΡΟΦΟΣ"];
    const floorOptionsMap = [
        "ΥΠΟΓΕΙΟ", "ΗΜΙΥΠΟΓΕΙΟ", "ΗΜΙΟΡΟΦΟΣ", "ΙΣΟΓΕΙΟ", 
        "1ΟΣ ΟΡΟΦΟΣ", "2ΟΣ ΟΡΟΦΟΣ", "3ΟΣ ΟΡΟΦΟΣ", "4ΟΣ ΟΡΟΦΟΣ", "5ΟΣ ΟΡΟΦΟΣ", "6ΟΣ ΟΡΟΦΟΣ",
        "7ΟΣ ΟΡΟΦΟΣ", "8ΟΣ ΟΡΟΦΟΣ", "9ΟΣ ΟΡΟΦΟΣ", "10ΟΣ ΟΡΟΦΟΣ"
    ];
    
    let floorY = 300;
    const boxWidth = 900;
    const boxHeight = 130;
    const spacing = 190;

    let totalApts = 0;
    const getFloorDetails = (floorName: string) => {
        if (!techData) return "";
        
        let activeFloors = techData.active_floors;
        if (!activeFloors || activeFloors.length === 0) {
            if (techData.total_floors === undefined) return "";
            const totalFloorsFallback = techData.total_floors || 1;
            const customerIdx = techData.customer_floor_index !== undefined ? techData.customer_floor_index : 3;
            const baseFloorIdxFallback = techData.base_floor_index !== undefined 
                ? techData.base_floor_index 
                : Math.max(0, customerIdx - Math.max(0, Math.min(totalFloorsFallback - 1, customerIdx - 3)));
            activeFloors = Array.from({ length: totalFloorsFallback }).map((_, i) => baseFloorIdxFallback + i);
        }

        for (let i = 0; i < activeFloors.length; i++) {
            const floorIndex = activeFloors[i];
            const currentFloorName = floorOptionsMap[floorIndex];
            if (currentFloorName === floorName) {
                const aptsCount = techData.apartments_per_floor?.[floorIndex] || 0;
                const shopsCount = techData.shops_per_floor?.[floorIndex] || 0;
                
                if (aptsCount > 0) totalApts += aptsCount;
                
                if (aptsCount > 0 && shopsCount > 0) {
                    return `${aptsCount} ΔΙΑΜ. / ${shopsCount} ΚΑΤ.`;
                } else if (aptsCount > 0) {
                    return `${aptsCount} ΔΙΑΜ.`;
                } else if (shopsCount > 0) {
                    return `${shopsCount} ΚΑΤ.`;
                }
            }
        }
        return "";
    };

    floorListLeft.forEach((floor, i) => {
        const y = floorY + (i * spacing);
        ctx.font = "bold 28px Arial";
        ctx.fillText(floor, 100, y - 15);
        drawBox(100, y, boxWidth, boxHeight, 3);
        
        const details = getFloorDetails(floor);
        if (details) {
            ctx.font = "bold 40px Arial";
            ctx.fillStyle = "black"; 
            ctx.textAlign = "center";
            ctx.fillText(details, 100 + boxWidth / 2, y + boxHeight / 2 + 15);
            ctx.textAlign = "left";
        }
    });

    floorListRight.forEach((floor, i) => {
        const y = floorY + (i * spacing);
        ctx.font = "bold 28px Arial";
        ctx.fillText(floor, 1400, y - 15);
        drawBox(1400, y, boxWidth, boxHeight, 3);

        const details = getFloorDetails(floor);
        if (details) {
            ctx.font = "bold 40px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(details, 1400 + boxWidth / 2, y + boxHeight / 2 + 15);
            ctx.textAlign = "left";
        }
    });

    // --- STATS SECTION ---
    let statsY = floorY + (floorListLeft.length * spacing) + 40;

    // Calculate total shops and total spaces upfront
    let totalShops = 0;
    let computedTotalFloors = 0;
    
    if (techData) {
        let activeFloors = techData.active_floors;
        if (!activeFloors || activeFloors.length === 0) {
            const totalFloorsFallback = techData.total_floors || 1;
            const customerIdx = techData.customer_floor_index !== undefined ? techData.customer_floor_index : 3;
            const baseFloorIdxFallback = techData.base_floor_index !== undefined 
                ? techData.base_floor_index 
                : Math.max(0, customerIdx - Math.max(0, Math.min(totalFloorsFallback - 1, customerIdx - 3)));
            activeFloors = Array.from({ length: totalFloorsFallback }).map((_, i) => baseFloorIdxFallback + i);
        }
        
        computedTotalFloors = activeFloors.length;
        
        if (techData.shops_per_floor) {
            for (let i = 0; i < activeFloors.length; i++) {
                totalShops += techData.shops_per_floor[activeFloors[i]] || 0;
            }
        }
    }
    const totalSpaces = totalApts + totalShops;

    ctx.font = "bold 30px Arial";
    ctx.fillText("ΣΥΝΟΛΟ ΔΙΑΜΕΡΙΣΜΑΤΩΝ:", 100, statsY); 
    if (totalApts > 0) {
        ctx.font = "bold 36px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(totalApts.toString(), 520, statsY);
    }
    drawDottedLine(500, statsY + 5, 1000, statsY + 5);
    
    ctx.fillText("SR ID:", 1400, statsY); 
    ctx.font = "30px Arial";
    ctx.fillText((customer.sr || "").toString().toUpperCase(), 1550, statsY);
    drawDottedLine(1500, statsY + 5, 2100, statsY + 5);
    
    statsY += 70;
    ctx.font = "bold 30px Arial";
    ctx.fillText("ΣΥΝΟΛΟ ΚΑΤΑΣΤΗΜΑΤΩΝ:", 100, statsY); 
    if (totalShops > 0) {
        ctx.font = "bold 36px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(totalShops.toString(), 520, statsY);
    }
    drawDottedLine(500, statsY + 5, 1000, statsY + 5);
    ctx.fillText("ΣΥΝΤΕΤΑΓΜΕΝΕΣ ΚΤΙΡΙΟΥ:", 1400, statsY);
    
    statsY += 70;
    ctx.fillText("ΣΥΝΟΛΟ ΧΩΡΩΝ:", 100, statsY); 
    if (totalSpaces > 0) {
        ctx.font = "bold 36px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(totalSpaces.toString(), 520, statsY);
    }
    drawDottedLine(500, statsY + 5, 1000, statsY + 5);

    ctx.fillText("X:", 1400, statsY); 
    drawDottedLine(1450, statsY + 5, 2100, statsY + 5);
    
    statsY += 70;
    ctx.font = "bold 30px Arial";
    ctx.fillText("ΣΥΝΟΛΟ ΟΡΟΦΩΝ/ΕΠΙΠΕΔΩΝ:", 100, statsY); 
    if (techData && computedTotalFloors > 0) {
        ctx.font = "bold 36px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(computedTotalFloors.toString(), 570, statsY);
    }
    drawDottedLine(550, statsY + 5, 1000, statsY + 5);

    ctx.fillText("Y:", 1400, statsY); 
    drawDottedLine(1450, statsY + 5, 2100, statsY + 5);

    // Compute checkmarks for the tables based on total spaces
    let bepSmallCheck = "";
    let bepMediumCheck = "";
    let bepLargeCheck = "";
    
    let bmoSmallCheck = "";
    let bmoMediumCheck = "";
    let bmoLargeCheck = "";
    
    if (totalSpaces >= 1 && totalSpaces <= 2) {
        bepSmallCheck = "✓";
        bmoSmallCheck = "✓";
    } else if (totalSpaces >= 3 && totalSpaces <= 8) {
        bepMediumCheck = "✓";
        bmoSmallCheck = "✓";
    } else if (totalSpaces >= 9 && totalSpaces <= 16) {
        bepLargeCheck = "✓";
        bmoMediumCheck = "✓";
    }

    // --- TABLES ---
    const drawTable = (x: number, y: number, headers: string[], rows: string[][], colWidths: number[]) => {
        const rowHeight = 60;
        let currentY = y;
        
        // Draw Headers
        ctx.font = "bold 24px Arial";
        headers.forEach((h, i) => {
            const cellX = x + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
            drawBox(cellX, currentY, colWidths[i], rowHeight);
            ctx.fillText(h, cellX + 10, currentY + 40);
        });
        
        // Draw Rows
        currentY += rowHeight;
        rows.forEach(row => {
            row.forEach((cell, i) => {
                const cellX = x + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
                drawBox(cellX, currentY, colWidths[i], rowHeight);
                if (cell === "✓") {
                    ctx.save();
                    ctx.font = "bold 36px Arial";
                    ctx.fillStyle = "#0054a6"; // Premium blue checkmark
                    ctx.textAlign = "center";
                    ctx.fillText(cell, cellX + colWidths[i] / 2, currentY + 42);
                    ctx.restore();
                } else {
                    ctx.fillText(cell, cellX + 10, currentY + 40);
                }
            });
            currentY += rowHeight;
        });
    };

    let tableY = statsY + 100;
    
    // BCP Table
    const bcpSmallCheck = customer.autopsia_bcp ? "✓" : "";
    drawTable(100, tableY, ["BCP", "RAYCAP", "ZTT", "CANNOVATE"], [
        ["SMALL", bcpSmallCheck, "", ""], 
        ["MEDIUM", "", "", ""]
    ], [300, 250, 250, 300]);
    
    // Splitter & Cabin info (Right)
    ctx.font = "bold 28px Arial";
    ctx.fillText("SPLITTER: ____ 1:8 ____ 1:2", 1400, tableY + 40);
    
    // Dynamic measurement for premium checkmark placement
    const wSplitter = ctx.measureText("SPLITTER: ").width;
    const wLine1 = ctx.measureText("____").width;
    const wText2 = ctx.measureText(" 1:8 ").width;
    
    const check18X = 1400 + wSplitter + wLine1 / 2;
    const check12X = 1400 + wSplitter + wLine1 + wText2 + wLine1 / 2;
    
    ctx.save();
    ctx.font = "bold 36px Arial";
    ctx.fillStyle = "#0054a6"; // Premium blue checkmark
    ctx.textAlign = "center";
    if (totalSpaces >= 1 && totalSpaces <= 2) {
        ctx.fillText("✓", check12X, tableY + 38);
    } else {
        ctx.fillText("✓", check18X, tableY + 38);
    }
    ctx.restore();
    
    ctx.fillText("ΚΑΜΠΙΝΑ:", 1400, tableY + 110); 
    drawDottedLine(1550, tableY + 115, 2100, tableY + 115);
    const cabinetVal = (customer.kampina || customer.cabinet_number || customer.chimney_number || "").toString().toUpperCase();
    if (cabinetVal) {
        ctx.save();
        ctx.font = "bold 32px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(cabinetVal, 1570, tableY + 110);
        ctx.restore();
    }
    
    ctx.fillText("ΑΝΑΜΟΝΗ:", 1400, tableY + 180); 
    drawDottedLine(1550, tableY + 185, 2100, tableY + 185);
    const anamoniVal = (customer.anamoni || "").toString().toUpperCase();
    if (anamoniVal) {
        ctx.save();
        ctx.font = "bold 32px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(anamoniVal, 1570, tableY + 180);
        ctx.restore();
    }

    tableY += 250;
    // BEP Table
    drawTable(100, tableY, ["BEP", "RAYCAP", "ZTT", "CANNOVATE"], [
        ["SMALL", bepSmallCheck, "", ""], 
        ["MEDIUM", bepMediumCheck, "", ""], 
        ["LARGE", bepLargeCheck, "", ""], 
        ["XLARGE", "", "", ""]
    ], [300, 250, 250, 300]);

    // Floorbox Table (Right)
    let count2Drop = 0;
    let count4Drop = 0;
    let count6Drop = 0;
    let count12Drop = 0;

    if (techData && techData.apartments_per_floor) {
        let activeFloors = techData.active_floors;
        if (!activeFloors || activeFloors.length === 0) {
            const totalFloorsFallback = techData.total_floors || 1;
            const customerIdx = techData.customer_floor_index !== undefined ? techData.customer_floor_index : 3;
            const baseFloorIdxFallback = techData.base_floor_index !== undefined 
                ? techData.base_floor_index 
                : Math.max(0, customerIdx - Math.max(0, Math.min(totalFloorsFallback - 1, customerIdx - 3)));
            activeFloors = Array.from({ length: totalFloorsFallback }).map((_, i) => baseFloorIdxFallback + i);
        }

        for (let i = 0; i < activeFloors.length; i++) {
            const floorIndex = activeFloors[i];
            const numApts = techData.apartments_per_floor[floorIndex] || 0;
            const numShops = techData.shops_per_floor?.[floorIndex] || 0;
            const spaces = numApts + numShops;
            const hasFbOnFloor = techData.fb_per_floor?.[floorIndex] !== false;
            
            if (techData.use_fb && hasFbOnFloor && spaces > 0) {
                if (spaces <= 2) {
                    count4Drop++;
                } else if (spaces === 3) {
                    count6Drop++;
                } else if (spaces >= 4) {
                    count12Drop++;
                }
            }
        }
    }

    const val2Drop = count2Drop > 0 ? count2Drop.toString() : "";
    const val4Drop = count4Drop > 0 ? count4Drop.toString() : "";
    const val6Drop = count6Drop > 0 ? count6Drop.toString() : "";
    const val12Drop = count12Drop > 0 ? count12Drop.toString() : "";

    drawTable(1400, tableY, ["FLOORBOX", "2 Drop", "4 Drop", "6 Drop", "12 Drop"], [
        ["ΠΟΣΟΤΗΤΑ", val2Drop, val4Drop, val6Drop, val12Drop]
    ], [280, 180, 180, 180, 180]);
    
    ctx.fillText("ΠΑΡΑΤΗΡΗΣΕΙΣ:", 1400, tableY + 220);
    drawDottedLine(1400, tableY + 280, 2350, tableY + 280);
    drawDottedLine(1400, tableY + 340, 2350, tableY + 340);

    tableY += 380;
    // BMO Table (Bottom Left)
    drawTable(100, tableY, ["BMO", "RAYCAP", "ZTT", "CANNOVATE", "ΠΟΣΟΤΗΤΑ"], [
        ["SMALL", bmoSmallCheck, "", "", ""], 
        ["MEDIUM", bmoMediumCheck, "", "", ""], 
        ["LARGE", bmoLargeCheck, "", "", ""], 
        ["XLARGE", "", "", "", ""]
    ], [200, 230, 230, 230, 230]);

    // BMO Small Table (Bottom Right)
    drawTable(1450, tableY, ["BMO", "RAYCAP", "FIBERHOME"], [
        ["SMALL (16 ΘΕΣΕΩΝ)", "", ""], 
        ["MEDIUM (48 ΘΕΣΕΩΝ)", "", ""], 
        ["LARGE (80 ΘΕΣΕΩΝ)", "", ""]
    ], [400, 230, 250]);

    return canvas.toDataURL("image/jpeg", 0.95);
};

const compressImage = (file: File | Blob, watermark?: string): Promise<Blob | File> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new window.Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const MAX_WIDTH = 1280;
                const MAX_HEIGHT = 1280;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0, width, height);

                if (watermark && ctx) {
                    const fontSize = Math.max(Math.floor(width / 20), 24);
                    ctx.font = `bold ${fontSize}px Arial`;
                    ctx.textAlign = "right";
                    ctx.textBaseline = "bottom";
                    const padding = 20;

                    // Add semi-transparent background for better visibility
                    const textMetrics = ctx.measureText(watermark);
                    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
                    ctx.fillRect(
                        width - textMetrics.width - padding - 10,
                        height - fontSize - padding - 5,
                        textMetrics.width + 20,
                        fontSize + 10
                    );

                    // Draw text
                    ctx.fillStyle = "#ff0000";
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 1;
                    ctx.strokeText(watermark, width - padding, height - padding);
                    ctx.fillText(watermark, width - padding, height - padding);
                }

                canvas.toBlob((blob) => {
                    resolve(blob || file);
                }, "image/jpeg", 0.75);
            };
            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
};



export default function AutopsiaPage() {
    const [showEngineerSigSetup, setShowEngineerSigSetup] = useState(false);
    useEffect(() => {
        if (!localStorage.getItem("autopsia_engineer_signature")) {
            setShowEngineerSigSetup(true);
        }
    }, []);

    const searchParams = useSearchParams();
    const customerUrlParam = searchParams ? searchParams.get("customer") : null;
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        document.title = "Αυτοψίες FTTH | Field Engineering System";
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    const [searchQuery, setSearchQuery] = useState(() => {
        try {
            return typeof window !== "undefined" ? localStorage.getItem("autopsia2_searchQuery") || "" : "";
        } catch {
            return "";
        }
    });
    const [visibleCount, setVisibleCount] = useState(20);
    const [selectedCustomerPhotos, setSelectedCustomerPhotos] = useState<string[] | null>(null);
    const [selectedCustomerName, setSelectedCustomerName] = useState<string>("");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [timelineCustomer, setTimelineCustomer] = useState<any | null>(null);
    const [timelineOpen, setTimelineOpen] = useState(false);
    const [isNewAutopsiaOpen, setIsNewAutopsiaOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<any | null>(null);
    const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; category: string, floor?: string } | null>(null);
    const [fbFloors, setFbFloors] = useState<Record<string, string[]>>({});
    const [newFloorInput, setNewFloorInput] = useState<Record<string, string>>({});
    const [cityFilter, setCityFilter] = useState<"all" | "kastoria" | "florina">(() => {
        try {
            return (typeof window !== "undefined" ? (localStorage.getItem("autopsia2_cityFilter") as any) : null) || "all";
        } catch {
            return "all";
        }
    });
    const [statusFilter, setStatusFilter] = useState<"pending" | "ready" | "all">(() => {
        try {
            return (typeof window !== "undefined" ? (localStorage.getItem("autopsia2_statusFilter") as any) : null) || "pending";
        } catch {
            return "pending";
        }
    });
    const [expandedCustomers, setExpandedCustomers] = useState<Record<string, boolean>>(() => {
        try {
            const saved = typeof window !== "undefined" ? localStorage.getItem("autopsia2_expandedCustomers") : null;
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });
    const [activeCustomerId, setActiveCustomerId] = useState<string | null>(() => {
        try {
            return typeof window !== "undefined" ? localStorage.getItem("autopsia2_activeCustomerId") : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (activeCustomerId) {
            localStorage.setItem("autopsia2_activeCustomerId", activeCustomerId);
        } else {
            localStorage.removeItem("autopsia2_activeCustomerId");
        }
    }, [activeCustomerId]);

    const scrollToActiveCustomer = (id?: string | null) => {
        const targetId = id || activeCustomerId;
        if (!targetId) return;
        setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 150);
    };
    const [editingImage, setEditingImage] = useState<{ src: string, category: string, customerId: string, floor?: string, isExisting?: boolean, existingUrl?: string, initialText?: string } | null>(null);
    const [previewExcelUrl, setPreviewExcelUrl] = useState<string | null>(null);
    const [commentEditOpen, setCommentEditOpen] = useState(false);
    const [editingCustomerForComment, setEditingCustomerForComment] = useState<any>(null);
    const [tempComment, setTempComment] = useState("");
    const [cancellationDialogOpen, setCancellationDialogOpen] = useState(false);
    const [cancellingCustomer, setCancellingCustomer] = useState<any>(null);
    const [cancellationReason, setCancellationReason] = useState("");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [currentCustomerForAdt, setCurrentCustomerForAdt] = useState<any>(null);
    const [tempAdt, setTempAdt] = useState<string>("");
    const [verifyingCustomerId, setVerifyingCustomerId] = useState<string | null>(null);
    const [verificationResult, setVerificationResult] = useState<{
        customer: any;
        userLat: number;
        userLng: number;
        accuracy: number;
        buildingLat: number;
        buildingLng: number;
        officialAddress: string;
        buildingId: string;
        distanceMeters: number;
        isAtLocation: boolean;
    } | null>(null);

    const calculateDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371e3;
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleVerifyLocation = async (customer: any) => {
        if (!navigator.geolocation) {
            toast.error("Η συσκευή σας δεν υποστηρίζει Geolocation/GPS.");
            return;
        }

        const bid = String(customer.building_id || "").trim();
        const address = String(customer.address || "").trim();

        if (!bid && !address) {
            toast.error("Ο πελάτης δεν έχει δηλωμένο Building ID ή διεύθυνση.");
            return;
        }

        setVerifyingCustomerId(customer.id);
        const toastId = toast.loading("Λήψη GPS & επαλήθευση θέσης κτιρίου...");

        try {
            const userPos = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0,
                });
            }).catch((err) => {
                if (err.code === 1) throw new Error("Απαιτείται άδεια πρόσβασης στην τοποθεσία (GPS). Παρακαλώ ενεργοποιήστε το GPS.");
                if (err.code === 2) throw new Error("Δεν ήταν δυνατός ο εντοπισμός του GPS σας.");
                if (err.code === 3) throw new Error("Έληξε το χρονικό όριο λήψης GPS. Παρακαλώ δοκιμάστε ξανά σε ανοιχτό χώρο.");
                throw err;
            });

            const userLat = userPos.coords.latitude;
            const userLng = userPos.coords.longitude;
            const accuracy = userPos.coords.accuracy;

            let buildingLat: number | null = null;
            let buildingLng: number | null = null;
            let officialAddress = address;
            let foundBid = bid;

            if (bid && /^\d+$/.test(bid)) {
                try {
                    const res = await fetch(`https://home.teletronic.gr/api.php?coverid=${encodeURIComponent(bid)}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data) && data.length > 0 && data[0].point?.coordinates) {
                            buildingLng = data[0].point.coordinates[0];
                            buildingLat = data[0].point.coordinates[1];
                            if (data[0].address) officialAddress = data[0].address;
                        }
                    }
                } catch (_e) {}

                if (buildingLat === null) {
                    try {
                        const res = await fetch(`https://www.broadband-assist.gov.gr/api/a3b_coverpointftthcoax?coverid=eq.${encodeURIComponent(bid)}&select=*`);
                        if (res.ok) {
                            const data = await res.json();
                            if (Array.isArray(data) && data.length > 0 && data[0].point?.coordinates) {
                                buildingLng = data[0].point.coordinates[0];
                                buildingLat = data[0].point.coordinates[1];
                                if (data[0].address) officialAddress = data[0].address;
                            }
                        }
                    } catch (_e) {}
                }
            }

            if (buildingLat === null && address) {
                try {
                    const query = `${address}, Ελλάδα`;
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=gr&limit=1&accept-language=el`, {
                        headers: { 'User-Agent': 'KmFiberApp/1.0' }
                    });
                    if (res.ok) {
                        const geo = await res.json();
                        if (Array.isArray(geo) && geo.length > 0) {
                            buildingLat = parseFloat(geo[0].lat);
                            buildingLng = parseFloat(geo[0].lon);
                            officialAddress = geo[0].display_name || address;
                        }
                    }
                } catch (_e) {}
            }

            if (buildingLat === null || buildingLng === null) {
                throw new Error(`Δεν βρέθηκαν γεωγραφικές συντεταγμένες για το Building ID: ${bid || address}`);
            }

            const distanceMeters = calculateDistanceMeters(userLat, userLng, buildingLat, buildingLng);
            // Threshold: 35 meters (strictly right outside the building)
            const isAtLocation = distanceMeters <= 35;

            const result = {
                customer,
                userLat,
                userLng,
                accuracy,
                buildingLat,
                buildingLng,
                officialAddress,
                buildingId: foundBid,
                distanceMeters,
                isAtLocation,
            };

            setVerificationResult(result);
            toast.dismiss(toastId);

            if (isAtLocation) {
                toast.success(`✅ Είστε στο σωστό κτίριο! (${Math.round(distanceMeters)}m)`);
            } else {
                toast.error(`⚠️ ΠΡΟΣΟΧΗ: Ίσως το BID είναι λάθος! Απέχετε ${distanceMeters >= 1000 ? (distanceMeters / 1000).toFixed(1) + 'km' : Math.round(distanceMeters) + 'm'}`);
            }
        } catch (err: any) {
            toast.dismiss(toastId);
            toast.error(err.message || "Σφάλμα κατά την επαλήθευση τοποθεσίας.");
        } finally {
            setVerifyingCustomerId(null);
        }
    };
    
    const [currentCustomerForSignature, setCurrentCustomerForSignature] = useState<any>(null);
    const [tempSignatureDataUrl, setTempSignatureDataUrl] = useState<string | null>(null);
    const [isSavingSignature, setIsSavingSignature] = useState<boolean>(false);

    const [currentCustomerForFatherName, setCurrentCustomerForFatherName] = useState<any>(null);
    const [tempFatherName, setTempFatherName] = useState<string>("");
    const [currentCustomerForChimney, setCurrentCustomerForChimney] = useState<any>(null);
    const [tempChimney, setTempChimney] = useState<string>("");
    const [isTechModalOpen, setIsTechModalOpen] = useState(false);
    const [selectedCustomerIdForTech, setSelectedCustomerIdForTech] = useState<string | null>(null);
    const [customersTechData, setCustomersTechData] = useState<Record<string, TechDescriptionData>>(() => {
        try {
            const saved = localStorage.getItem("autopsia2_customersTechData");
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error("Failed to load customersTechData from localStorage", e);
            return {};
        }
    });
    const queryClient = useQueryClient();


    // Persist filters
    useEffect(() => {
        localStorage.setItem("autopsia2_searchQuery", searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        localStorage.setItem("autopsia2_cityFilter", cityFilter);
    }, [cityFilter]);

    useEffect(() => {
        localStorage.setItem("autopsia2_statusFilter", statusFilter);
    }, [statusFilter]);

    useEffect(() => {
        localStorage.setItem("autopsia2_expandedCustomers", JSON.stringify(expandedCustomers));
    }, [expandedCustomers]);

    useEffect(() => {
        localStorage.setItem("autopsia2_customersTechData", JSON.stringify(customersTechData));
    }, [customersTechData]);

    const isAutopsiaReady = (customer: any): boolean => {
        if (!customer) return false;
        const tech = customer.autopsia_tech_data || customersTechData[customer.id];
        return !!(
            customer.autopsia_ready === true ||
            customer.is_ready_for_send === true ||
            tech?.is_ready_for_send === true ||
            customer.tech_data?.is_ready_for_send === true
        );
    };

    // Handle scroll position persistence
    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            // Ignore scroll to 0 if we have an active customer to prevent background scroll resets
            if (y === 0 && activeCustomerId) {
                return;
            }
            localStorage.setItem("autopsia2_scrollPosition", y.toString());
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [activeCustomerId]);


    const { data: customers, isLoading } = useQuery({
        queryKey: ["customers-autopsia2-pending"],
        queryFn: async () => {
            const { data, error } = await (supabase
                .from("customers")
                .select("*") as any)
                .eq("is_upcoming", true)
                .eq("autopsia_completed", false)
                .or("is_iosif.eq.false,is_iosif.is.null")
                .order("created_at", { ascending: false })
                .order("address", { ascending: true })
                .order("id", { ascending: true });
            if (error) throw error;
            return data as any[];
        },
    });

    // Sync fetched customers autopsia_tech_data into state
    useEffect(() => {
        if (customers && customers.length > 0) {
            setCustomersTechData(prev => {
                const updated = { ...prev };
                let changed = false;
                customers.forEach(c => {
                    if (c.autopsia_tech_data && Object.keys(c.autopsia_tech_data).length > 0) {
                        updated[c.id] = c.autopsia_tech_data;
                        changed = true;
                    }
                });
                return changed ? updated : prev;
            });
        }
    }, [customers]);

    // Restore scroll position when data is loaded
    useEffect(() => {
        if (!isLoading && customers) {
            if (activeCustomerId) {
                scrollToActiveCustomer(activeCustomerId);
            } else {
                const savedPosition = localStorage.getItem("autopsia2_scrollPosition");
                if (savedPosition) {
                    const timeoutId = setTimeout(() => {
                        window.scrollTo({
                            top: parseInt(savedPosition),
                            behavior: 'instant'
                        });
                    }, 300);
                    return () => clearTimeout(timeoutId);
                }
            }
        }
    }, [isLoading, !!customers]);

    useEffect(() => {
        if (activeCustomerId) {
            scrollToActiveCustomer(activeCustomerId);
        }
    }, [activeCustomerId]);

    const uploadPhotosMutation = useMutation({
        mutationFn: async ({ customerId, category, files, floor }: { customerId: string, category: string, files: File[], floor?: string }) => {
            const customer = customers?.find(c => c.id === customerId);
            const existingPhotos = customer?.photo_urls || [];

            const categoryPhotos = existingPhotos.filter((url: string) => {
                const fileName = decodeURIComponent(url.toLowerCase().split('/').pop() || "");
                if (floor && category === 'aut_fb') {
                    return fileName.includes(`aut_fb_${floor.toLowerCase()}_`) || fileName.startsWith(`aut_fb_${floor.toLowerCase()}_`);
                }

                const greeklishPrefix = catNamesGreek[category.toLowerCase()];
                const cleanFileName = fileName.replace(/[_\s.]/g, '');

                // Keep compatibility with legacy Greek names
                const legacyGreekMap: Record<string, string[]> = {
                    'aut_decl': ['υδ_διαχειριστή', 'υ.δ. διαχειριστή'],
                    'aut_cab': ['καμπίνα'],
                    'aut_wait': ['αναμονή'],
                    'aut_tech': ['τεχν_περιγραφή', 'τεχν. περιγραφή'],
                    'aut_hedm': ['χεδμ'],
                    'aut_form1': ['έντυπο_1', 'έντυπο 1'],
                    'aut_report': ['έκθεση_επιθ', 'έκθεση επιθ']
                };
                const legacyGreek = legacyGreekMap[category.toLowerCase()] || [];

                const cleanGreeklish = greeklishPrefix ? greeklishPrefix.toLowerCase().replace(/[_\s.]/g, '') : '';
                return fileName.includes(category.toLowerCase()) ||
                    (cleanGreeklish && cleanFileName.includes(cleanGreeklish)) ||
                    legacyGreek.some(lg => cleanFileName.includes(lg.replace(/[_\s.]/g, '')));
            });

            let currentIndex = categoryPhotos.length + 1;
            const newUrls: string[] = [];

            setUploadProgress({ current: 0, total: files.length, category, floor });

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const watermark = (category === 'aut_fb' && floor) ? floor : undefined;
                const compressedBlob = await compressImage(file, watermark);
                const uploadFile = compressedBlob instanceof Blob ? compressedBlob : file;
                const fileExt = file.name.split(".").pop();
                let fileName;

                const customerPrefix = customer?.sr || customer?.id || customerId;
                const basePrefix = catNamesGreek[category.toLowerCase()] || category.toLowerCase();

                if (floor && category === 'aut_fb') {
                    fileName = `${customerPrefix}_aut_fb_${floor.toLowerCase()}_${currentIndex}.${fileExt}`;
                } else {
                    const indexSuffix = currentIndex > 1 ? `_${currentIndex}` : "";
                    fileName = `${customerPrefix}_${basePrefix}${indexSuffix}.${fileExt}`;
                }

                const filePath = `${fileName}`;

                const publicUrl = await uploadToR2(uploadFile, filePath);
                if (!publicUrl) throw new Error("R2 Upload failed");

                newUrls.push(publicUrl);
                currentIndex++;
                setUploadProgress(prev => prev ? { ...prev, current: i + 1 } : null);
            }

            const { error: updateError } = await supabase
                .from("customers")
                .update({
                    photo_urls: [...existingPhotos, ...newUrls]
                } as any)
                .eq("id", customerId);

            if (updateError) throw updateError;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            toast.success("Οι φωτογραφίες ανέβηκαν!");
            setUploadProgress(null);
        },
        onError: (error) => {
            console.error(error);
            toast.error("Σφάλμα κατά το ανέβασμα.");
            setUploadProgress(null);
        }
    });

    const editPhotoMutation = useMutation({
        mutationFn: async ({ customerId, originalUrl, editedBlob }: { customerId: string, originalUrl: string, editedBlob: Blob }) => {
            let originalFileName = "";
            if (originalUrl.includes("file=")) {
                originalFileName = decodeURIComponent(originalUrl.split("file=")[1].split("&")[0]);
            } else {
                originalFileName = originalUrl.split("?")[0].split("/").pop() || "";
            }
            if (!originalFileName) return;

            // Generate versioned filename so browser & email cache update immediately
            const ext = originalFileName.includes(".") ? originalFileName.split(".").pop() : "jpg";
            const baseWithoutExt = originalFileName.replace(/\.[^/.]+$/, "");
            const cleanBase = baseWithoutExt.replace(/_(v\d+|edited_\d+)$/, "");
            const newFileName = `${cleanBase}_v${Date.now()}.${ext}`;

            // 1. Upload edited image to R2 under the new versioned name
            const publicUrl = await uploadToR2(editedBlob, newFileName);
            if (!publicUrl) throw new Error("R2 Update failed");

            // 2. Update customers.photo_urls in database
            const { data: currentCust, error: fetchErr } = await supabase
                .from("customers")
                .select("photo_urls")
                .eq("id", customerId)
                .single();

            if (fetchErr) throw fetchErr;

            const existingPhotos: string[] = currentCust?.photo_urls || [];
            const updatedPhotos = existingPhotos.map((u: string) => {
                const uFileName = u.includes("file=") 
                    ? decodeURIComponent(u.split("file=")[1].split("&")[0])
                    : u.split("?")[0].split("/").pop();
                if (u === originalUrl || uFileName === originalFileName) {
                    return publicUrl;
                }
                return u;
            });

            const { error: updateErr } = await supabase
                .from("customers")
                .update({ photo_urls: updatedPhotos } as any)
                .eq("id", customerId);

            if (updateErr) throw updateErr;

            // 3. Clean up the old unedited file from R2
            if (originalFileName && originalFileName !== newFileName) {
                deleteFromR2(originalFileName).catch(console.error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            toast.success("Η φωτογραφία ενημερώθηκε!");
            setEditingImage(null);
        },
        onError: (error) => {
            console.error(error);
            toast.error("Σφάλμα κατά την ενημέρωση.");
        }
    });

    const completeAutopsiaMutation = useMutation({
        mutationFn: async (customer: any) => {
            const hasEarthworksPhotos = (customer.photo_urls || []).some((url: string) => {
                const fileName = decodeURIComponent(url.toLowerCase().split('/').pop() || "");
                return fileName.includes('aut_earth');
            });

            const updatePayload: any = {
                autopsia_completed: true,
                is_upcoming: false,
                autopsia_completed_at: new Date().toISOString(),
                show_in_earthworks: customer.den_thelei_xwmatoyrgiko ? false : hasEarthworksPhotos,
                checklist_forms: true,
                checklist_route: true,
                exoterika_fb: !!customer.exoterika_fb,
                den_thelei_xwmatoyrgiko: !!customer.den_thelei_xwmatoyrgiko,
            };

            if (customer.den_thelei_xwmatoyrgiko) {
                updatePayload.close_xwmatoyrgiko = true;
                updatePayload.etimo_emfysisi = true;
                updatePayload.thanasis_pliromi_xwma = true;
                updatePayload.thanasis_amount_xwma = 0;
            }

            const { error } = await supabase
                .from("customers")
                .update(updatePayload as any)
                .eq("id", customer.id);

            if (error) throw error;

            // Fetch the absolute latest data to ensure email has all photos
            const { data: latestCustomer, error: fetchError } = await supabase
                .from("customers")
                .select("*")
                .eq("id", customer.id)
                .single();

            if (fetchError) throw fetchError;

            // Send the original autopsia-mail (to spiros39t@gmail.com and kmfiber@teletronic.gr)
            await supabase.functions.invoke("autopsia-mail", {
                body: {
                    customer: latestCustomer,
                    userEmail: user?.email
                },
            });

            // Send the autopsia-zip-mail with ENTYPA documents (always to spiros39t@gmail.com)
            await supabase.functions.invoke("autopsia-zip-mail", {
                body: {
                    customer: latestCustomer
                },
            });

            // If contractor is BEYONDWIRE, automatically upload the 7 ENTYPA to Beyondwire portal
            if (latestCustomer.is_beyondwire) {
                try {
                    const { data: bwData, error: bwError } = await supabase.functions.invoke("beyondwire-autopsy-sync", {
                        body: {
                            customerId: latestCustomer.id,
                            sr: latestCustomer.sr
                        }
                    });
                    if (bwError) {
                        console.warn("Beyondwire sync error:", bwError);
                    } else {
                        console.log("Beyondwire sync success:", bwData);
                    }
                } catch (bwErr: any) {
                    console.warn("Beyondwire upload error:", bwErr);
                }
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            toast.success("Η αυτοψία ολοκληρώθηκε και τα emails απεστάλησαν!");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Σφάλμα κατά την ολοκλήρωση.");
        }
    });

    const cancelAutopsiaMutation = useMutation({
        mutationFn: async ({ customer, reason }: { customer: any, reason: string }) => {
            const { error } = await supabase
                .from("customers")
                .update({
                    project_status: "cancelled",
                    thanasis_akyri: true,
                    is_upcoming: false,
                    thanasis_comments: (customer.thanasis_comments || "") + (customer.thanasis_comments ? "\n" : "") + `ΛΟΓΟΣ ΑΚΥΡΩΣΗΣ: ${reason}`
                } as any)
                .eq("id", customer.id);

            if (error) throw error;

            await supabase.functions.invoke("autopsia-akyrosi-mail", {
                body: {
                    customer,
                    reason,
                    userEmail: user?.email
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            toast.success("Η αυτοψία ακυρώθηκε και το email απεστάλη.");
            setCancellationDialogOpen(false);
            setCancellationReason("");
            setCancellingCustomer(null);
        },
        onError: (error) => {
            console.error(error);
            toast.error("Σφάλμα κατά την ακύρωση.");
        }
    });

    const deletePhotoMutation = useMutation({
        mutationFn: async ({ customerId, photoUrl }: { customerId: string, photoUrl: string }) => {
            const fileName = photoUrl.split("/").pop();
            if (!fileName) return;

            await deleteFromR2(fileName);

            const customer = customers?.find(c => c.id === customerId);
            const updatedPhotos = (customer.photo_urls || []).filter((url: string) => url !== photoUrl);

            await supabase.from("customers")
                .update({ photo_urls: updatedPhotos } as any)
                .eq("id", customerId);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] }),
    });

    const saveCommentMutation = useMutation({
        mutationFn: async ({ id, comments }: { id: string; comments: string }) => {
            const { error } = await supabase
                .from("customers")
                .update({ thanasis_comments: comments } as any)
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            toast.success("Οι παρατηρήσεις ενημερώθηκαν!");
            setCommentEditOpen(false);
        },
        onError: (error) => {
            console.error(error);
            toast.error("Σφάλμα κατά την αποθήκευση.");
        }
    });

    const saveAnamoniMutation = useMutation({
        mutationFn: async ({ id, anamoni }: { id: string; anamoni: string }) => {
            const { error } = await supabase
                .from("customers")
                .update({ anamoni } as any)
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            toast.success("Η αναμονή ενημερώθηκε!");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Σφάλμα κατά την αποθήκευση της αναμονής.");
        }
    });

    const saveBcpMutation = useMutation({
        mutationFn: async ({ id, bcp }: { id: string; bcp: boolean }) => {
            const { error } = await supabase
                .from("customers")
                .update({ autopsia_bcp: bcp } as any)
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            toast.success("Το BCP ενημερώθηκε!");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Σφάλμα κατά την αποθήκευση του BCP.");
        }
    });

    const saveExoterikaFbMutation = useMutation({
        mutationFn: async ({ id, exoterika_fb, count }: { id: string; exoterika_fb: boolean; count?: number }) => {
            const { error } = await supabase
                .from("customers")
                .update({ 
                    exoterika_fb,
                    exoterika_fb_count: count ?? 1
                } as any)
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            toast.success("Ενημερώθηκε η επιλογή ΕΞΩΤΕΡΙΚΑ FB!");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Σφάλμα κατά την ενημέρωση.");
        }
    });

    const saveTechDataMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: TechDescriptionData }) => {
            const { error } = await supabase
                .from("customers")
                .update({ autopsia_tech_data: data } as any)
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            toast.success("Η Τεχνική Περιγραφή αποθηκεύτηκε στη βάση!");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Σφάλμα κατά την αποθήκευση της Τεχνικής Περιγραφής.");
        }
    });

    const saveDenTheleiXwmatoyrgikoMutation = useMutation({
        mutationFn: async ({ id, den_thelei_xwmatoyrgiko }: { id: string; den_thelei_xwmatoyrgiko: boolean }) => {
            const { error } = await supabase
                .from("customers")
                .update({ den_thelei_xwmatoyrgiko } as any)
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            toast.success("Ενημερώθηκε η επιλογή ΔΕΝ ΘΕΛΕΙ ΧΩΜΑΤΟΥΡΓΙΚΟ!");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Σφάλμα κατά την ενημέρωση.");
        }
    });

    const saveAdtMutation = useMutation({
        mutationFn: async ({ id, adt }: { id: string; adt: string }) => {
            const { error } = await supabase.from("customers").update({ adt } as any).eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            toast.success("Το ΑΔΤ αποθηκεύτηκε!");
            setCurrentCustomerForAdt(null);
        },
    });

    const saveChimneyNumberMutation = useMutation({
        mutationFn: async ({ id, chimney_number }: { id: string; chimney_number: string }) => {
            const clean = chimney_number ? chimney_number.trim().replace(/^[gG]/i, '').trim() : chimney_number;
            const customer = customers?.find(c => c.id === id);
            const currentTech = customer?.autopsia_tech_data || {};
            const { error } = await supabase.from("customers").update({
                chimney_type: clean,
                autopsia_tech_data: {
                    ...currentTech,
                    chimney_number: clean
                }
            } as any).eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            toast.success("Ο αριθμός καμπίνας αποθηκεύτηκε!");
            setCurrentCustomerForChimney(null);
        },
    });

    const saveFatherNameMutation = useMutation({
        mutationFn: async ({ id, father_name }: { id: string; father_name: string }) => {
            const { error } = await supabase.from("customers").update({ father_name } as any).eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            toast.success("Το πατρώνυμο αποθηκεύτηκε!");
            setCurrentCustomerForFatherName(null);
        },
    });

    const deleteCustomerMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("customers").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            toast.success("Η αυτοψία διαγράφηκε επιτυχώς!");
            setCustomerToDelete(null);
        },
        onError: (err: any) => {
            toast.error("Σφάλμα κατά τη διαγραφή: " + err.message);
        }
    });

    const saveSignatureMutation = useMutation({
        mutationFn: async ({ id, signature_url }: { id: string; signature_url: string }) => {
            const { error } = await supabase.from("customers").update({ signature_url } as any).eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            toast.success("Η υπογραφή αποθηκεύτηκε!");
            setCurrentCustomerForSignature(null);
            setIsSavingSignature(false);
        },
        onError: () => setIsSavingSignature(false),
    });

    const toggleReadyMutation = useMutation({
        mutationFn: async ({ id, isReady, customer }: { id: string; isReady: boolean; customer: any }) => {
            const currentTechData = customer.autopsia_tech_data || customersTechData[id] || {};
            const updatedTechData = {
                ...currentTechData,
                is_ready_for_send: isReady
            };

            const { error } = await supabase
                .from("customers")
                .update({
                    autopsia_tech_data: updatedTechData,
                } as any)
                .eq("id", id);

            if (error) throw error;
            return { id, isReady, updatedTechData };
        },
        onMutate: async ({ id, isReady }) => {
            queryClient.setQueryData(["customers-autopsia2-pending"], (old: any[] | undefined) => {
                if (!old) return old;
                return old.map(c => {
                    if (c.id === id) {
                        return {
                            ...c,
                            autopsia_tech_data: {
                                ...(c.autopsia_tech_data || {}),
                                is_ready_for_send: isReady
                            }
                        };
                    }
                    return c;
                });
            });
        },
        onSuccess: (data) => {
            setCustomersTechData(prev => ({
                ...prev,
                [data.id]: data.updatedTechData
            }));
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
            if (data.isReady) {
                toast.success("✅ Η αυτοψία σημειώθηκε ως Έτοιμη για Αποστολή!");
            } else {
                toast.info("Η αυτοψία μεταφέρθηκε στις Εκκρεμείς.");
            }
        },
        onError: (error: any) => {
            toast.error("Σφάλμα κατά την ενημέρωση: " + error.message);
            queryClient.invalidateQueries({ queryKey: ["customers-autopsia2-pending"] });
        }
    });

    const validCustomers = useMemo(() => {
        return (customers || []).filter(c => !c.thanasis_akyri && c.project_status !== "cancelled" && c.project_status !== "canceled" && c.project_status !== "se-anamoni");
    }, [customers]);

    const pendingCount = validCustomers.filter(c => !isAutopsiaReady(c)).length;
    const readyCount = validCustomers.filter(c => isAutopsiaReady(c)).length;
    const allCount = validCustomers.length;

    const filteredCustomers = validCustomers.filter((customer) => {
        if (customerUrlParam) {
            return customer.id === customerUrlParam;
        }

        // Status Filter (Pending / Ready / All)
        if (statusFilter === "pending" && isAutopsiaReady(customer)) {
            return false;
        }
        if (statusFilter === "ready" && !isAutopsiaReady(customer)) {
            return false;
        }

        // City Filter
        if (cityFilter !== "all") {
            if (cityFilter === "kastoria" && !(customer as any).is_kastoria) return false;
            if (cityFilter === "florina" && !(customer as any).is_florina) return false;
        }

        if (!searchQuery) return true;
        const search = searchQuery.toLowerCase().trim();
        return (
            String(customer.address || "").toLowerCase().includes(search) ||
            String(customer.sr || "").toLowerCase().includes(search) ||
            String(customer.first_name || "").toLowerCase().includes(search) ||
            String(customer.last_name || "").toLowerCase().includes(search) ||
            String(customer.building_id || "").toLowerCase().includes(search) ||
            String(customer.phone || "").toLowerCase().includes(search)
        );
    });

    const displayedCustomers = filteredCustomers?.slice(0, visibleCount) || [];



    const renderPhotoCategory = (customer: any, cat: string, label: string) => {
        const catPhotos = (customer.photo_urls || []).filter((url: string) => {
            const fileName = decodeURIComponent(url.toLowerCase().split('/').pop() || "");
            const greeklishPrefix = catNamesGreek[cat.toLowerCase()];
            const cleanFileName = fileName.replace(/[_\s.]/g, '');

            const legacyGreekMap: Record<string, string[]> = {
                'aut_decl': ['υδ_διαχειριστή', 'υ.δ. διαχειριστή'],
                'aut_cab': ['καμπίνα'],
                'aut_wait': ['αναμονή'],
                'aut_tech': ['τεχν_περιγραφή', 'τεχν. περιγραφή'],
                'aut_hedm': ['χεδμ'],
                'aut_form1': ['έντυπο_1', 'έντυπο 1'],
                'aut_report': ['έκθεση_επιθ', 'έκθεση επιθ']
            };
            const legacyGreek = legacyGreekMap[cat.toLowerCase()] || [];

            const cleanGreeklish = greeklishPrefix ? greeklishPrefix.toLowerCase().replace(/[_\s.]/g, '') : '';
            return fileName.includes(cat.toLowerCase()) ||
                (cleanGreeklish && cleanFileName.includes(cleanGreeklish)) ||
                legacyGreek.some(lg => cleanFileName.includes(lg.replace(/[_\s.]/g, '')));
        });

        const template = categoryTemplates[cat.toLowerCase()];

        const handleUseTemplate = async () => {
            if (!template) return;
            
            const toastId = toast.loading("Δημιουργία ψηφιακού προτύπου...");
            
            try {
                let generatedUrl = "";
                
                // If it's the declaration, generate it digitally from scratch
                if (cat.toLowerCase() === 'aut_decl') {
                    generatedUrl = await drawDigitalDecl(customer, customer.adt || "", customer.signature_url || null);
                } else if (cat.toLowerCase() === 'aut_report') {
                    generatedUrl = await drawDigitalReport(customer, customer.father_name || "");
                } else if (cat.toLowerCase() === 'aut_tech') {
                    const techData = customersTechData[customer.id] || {};
                    generatedUrl = await drawDigitalTech(customer, techData, customer.signature_url || null);
                } else if (cat.toLowerCase() === 'aut_form1') {
                    const techData = customersTechData[customer.id] || {};
                    generatedUrl = await drawDigitalForm1(customer, techData);

                } else {
                    // For others (until we make them digital too), use the background approach
                    const img = new window.Image();
                    img.src = template;
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                    });

                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) throw new Error("Could not get context");

                    ctx.drawImage(img, 0, 0);

                    const fullName = `${customer.last_name || ""} ${customer.first_name || ""}`.trim().toUpperCase();
                    const offset = templateNameOffsets[cat.toLowerCase()];
                    if (offset && fullName) {
                        const posX = canvas.width * offset.x;
                        const posY = canvas.height * offset.y;
                        const fontSize = Math.max(canvas.width * offset.fontSize, 16);
                        
                        ctx.font = `bold ${fontSize}px Arial`;
                        ctx.fillStyle = "#3b82f6";
                        ctx.fillText(fullName, posX, posY);
                    }
                    generatedUrl = canvas.toDataURL("image/jpeg", 0.95);
                }

                if (generatedUrl) {
                    const response = await fetch(generatedUrl);
                    const blob = await response.blob();
                    const file = new File([blob], `digital_${cat.toLowerCase()}_${Date.now()}.jpg`, { type: 'image/jpeg' });
                    await uploadPhotosMutation.mutateAsync({ customerId: customer.id, category: cat, files: [file] });
                    toast.success(`Το ψηφιακό πρότυπο ${label} δημιουργήθηκε!`);
                }
                toast.dismiss(toastId);
            } catch (err) {
                console.error(err);
                toast.dismiss(toastId);
                toast.error("Σφάλμα κατά τη δημιουργία");
            }
        };

        const handleOpenTechModal = (e: React.MouseEvent) => {
            e.stopPropagation();
            setSelectedCustomerIdForTech(customer.id);
            setIsTechModalOpen(true);
        };

        return (
            <div key={cat} className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{label}</span>
                            {cat.toLowerCase() === 'aut_tech' && (
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-6 px-2 text-[10px] bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                                    onClick={handleOpenTechModal}
                                >
                                    Επιλογές
                                </Button>
                            )}
                        </div>

                        <div className="flex gap-1">
                            <Label htmlFor={`camera-${cat}-${customer.id}`} className="cursor-pointer p-1.5 hover:bg-slate-200 rounded-full transition-colors">
                                <Camera className="h-4 w-4 text-primary" />
                                <input
                                    type="file"
                                    id={`camera-${cat}-${customer.id}`}
                                    className="hidden"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                setEditingImage({
                                                    src: event.target?.result as string,
                                                    category: cat,
                                                    customerId: customer.id
                                                });
                                            };
                                            reader.readAsDataURL(e.target.files[0]);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </Label>
                            <Label htmlFor={`upload-${cat}-${customer.id}`} className="cursor-pointer p-1.5 hover:bg-slate-200 rounded-full transition-colors">
                                <Plus className="h-4 w-4 text-primary" />
                                <input
                                    type="file"
                                    id={`upload-${cat}-${customer.id}`}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            const files = Array.from(e.target.files);
                                            uploadPhotosMutation.mutate({ customerId: customer.id, category: cat, files });
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </Label>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 items-center">
                        {template && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-2 text-[10px] bg-blue-600 text-white hover:bg-blue-700 border-0 shadow-sm"
                                onClick={handleUseTemplate}
                            >
                                <FileText className="h-3 w-3 mr-1" />
                                Πρότυπο
                            </Button>
                        )}
                        {cat === 'aut_wait' && (
                            <>
                                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 h-7 shadow-sm">
                                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Αρ. Αναμονής:</span>
                                    <Input
                                        type="text"
                                        placeholder="-"
                                        defaultValue={customer.anamoni || ""}
                                        onBlur={async (e) => {
                                            const newVal = e.target.value;
                                            if (newVal !== (customer.anamoni || "")) {
                                                saveAnamoniMutation.mutate({ id: customer.id, anamoni: newVal });
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const newVal = (e.target as HTMLInputElement).value;
                                                if (newVal !== (customer.anamoni || "")) {
                                                    saveAnamoniMutation.mutate({ id: customer.id, anamoni: newVal });
                                                }
                                                (e.target as HTMLInputElement).blur();
                                            }
                                        }}
                                        className="h-5 px-1.5 text-[11px] font-bold w-16 border border-slate-200 bg-white rounded focus:ring-1 focus:ring-blue-500 text-center"
                                    />
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 h-7 shadow-sm">
                                    <input
                                        type="checkbox"
                                        id={`bcp-chk-${customer.id}`}
                                        defaultChecked={customer.autopsia_bcp || false}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            saveBcpMutation.mutate({ id: customer.id, bcp: checked });
                                        }}
                                        className="h-3.5 w-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                                    />
                                    <label
                                        htmlFor={`bcp-chk-${customer.id}`}
                                        className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
                                    >
                                        BCP
                                    </label>
                                </div>
                            </>
                        )}
                        {cat === 'aut_decl' && (
                            <>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className={cn(
                                        "h-7 px-2 text-[10px] border border-slate-200 shadow-sm transition-all",
                                        customer.adt ? "bg-slate-800 text-white hover:bg-slate-900" : "bg-white text-slate-600 hover:bg-slate-50"
                                    )}
                                    onClick={() => {
                                        setCurrentCustomerForAdt(customer);
                                        setTempAdt(customer.adt || "");
                                    }}
                                >
                                    <UserCircle className="h-3 w-3 mr-1" />
                                    ΑΔΤ {customer.adt && `✓`}
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className={cn(
                                        "h-7 px-2 text-[10px] border border-slate-200 shadow-sm transition-all",
                                        customer.signature_url ? "bg-green-600 text-white hover:bg-green-700" : "bg-white text-slate-600 hover:bg-slate-50"
                                    )}
                                    onClick={() => setCurrentCustomerForSignature(customer)}
                                >
                                    <PenLine className="h-3 w-3 mr-1" />
                                    Υπογραφή {customer.signature_url && "✓"}
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className={cn(
                                        "h-7 px-2 text-[10px] border border-slate-200 shadow-sm transition-all",
                                        customer.father_name ? "bg-slate-800 text-white hover:bg-slate-900" : "bg-white text-slate-600 hover:bg-slate-50"
                                    )}
                                    onClick={() => {
                                        setCurrentCustomerForFatherName(customer);
                                        setTempFatherName(customer.father_name || "");
                                    }}
                                >
                                    <UserCircle className="h-3 w-3 mr-1" />
                                    ΠΑΤΡΩΝΥΜΟ {customer.father_name && "✓"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-1 min-h-[32px]">
                    {catPhotos.map((url: string, idx: number) => (
                        <div key={idx} className="relative group">
                            <button onClick={() => { setSelectedCustomerPhotos(catPhotos); setSelectedCustomerName(`${customer.address} - ${label}`); setLightboxIndex(idx); }} className="w-14 h-14 rounded-lg overflow-hidden border-2 border-white shadow-sm hover:border-primary/50 transition-colors">
                                <img src={getTimestampedUrl(url)} className="w-full h-full object-cover" />
                            </button>
                            <div className="absolute -top-2 -right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        setEditingImage({ src: getTimestampedUrl(url), category: cat, customerId: customer.id, isExisting: true, existingUrl: url }); 
                                    }}
                                    className="bg-blue-600 text-white rounded-full p-1 shadow-md hover:bg-blue-700 active:scale-90 transition-all border border-white"
                                >
                                    <Edit2 className="h-3 w-3" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); confirm("Διαγραφή;") && deletePhotoMutation.mutate({ customerId: customer.id, photoUrl: url }); }}
                                    className="bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 active:scale-90 transition-all border border-white"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20 p-4 md:p-6 transition-colors duration-200">
            {customerUrlParam && (
                <div className="mb-6 flex items-center justify-between bg-white border-slate-200 p-4 rounded-2xl shadow-sm border max-w-2xl mx-auto">
                    <div className="flex items-center gap-2">
                        <UserCircle className="h-6 w-6 text-purple-600" />
                        <span className="font-bold text-base md:text-lg text-slate-800">Καρτέλα Πελάτη (Αυτοψία 2)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => { window.location.href = '/ftth-autopsia'; }}
                            className="gap-1.5 h-8 text-xs font-semibold bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                            <X className="h-3.5 w-3.5" /> Κλείσιμο
                        </Button>
                    </div>
                </div>
            )}
            {editingImage && (
                <ImageEditor
                    isOpen={!!editingImage}
                    imageSrc={editingImage.src}
                    initialText={editingImage.initialText}
                    onCancel={() => {
                        setEditingImage(null);
                        if (activeCustomerId) scrollToActiveCustomer(activeCustomerId);
                    }}
                    onSave={(blob) => {
                        if (editingImage.isExisting && editingImage.existingUrl) {
                            editPhotoMutation.mutate({
                                customerId: editingImage.customerId,
                                originalUrl: editingImage.existingUrl,
                                editedBlob: blob
                            });
                        } else {
                            const watermark = (editingImage.category === 'aut_fb' && editingImage.floor) ? editingImage.floor : undefined;
                            compressImage(blob, watermark).then((finalBlob) => {
                                const file = new File([finalBlob], `edited_${Date.now()}.jpg`, { type: 'image/jpeg' });
                                uploadPhotosMutation.mutate({
                                    customerId: editingImage.customerId,
                                    category: editingImage.category,
                                    files: [file],
                                    floor: editingImage.floor
                                });
                                setEditingImage(null);
                                scrollToActiveCustomer(editingImage.customerId);
                            });
                        }
                    }}
                />
            )}
            <div className={cn("flex items-center justify-between gap-4 mb-8", customerUrlParam && "hidden")}>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl">
                        <Users className="h-7 w-7 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight">Αυτοψίες FTTH</h1>
                        <p className="text-sm font-semibold text-slate-700 hidden sm:block">
                            {pendingCount} σε εκκρεμότητα • {readyCount} έτοιμες για αποστολή • Σύστημα 7 Εντύπων ΟΤΕ
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Button 
                        onClick={() => setIsNewAutopsiaOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-3.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all text-xs sm:text-sm cursor-pointer"
                    >
                        <Plus className="h-4 w-4 stroke-[2.5]" />
                        <span>Νέα Αυτοψία</span>
                    </Button>

                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border-slate-200 shadow-xs border rounded-full text-sm font-medium text-slate-700">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>{customers?.length || 0} Κτήρια</span>
                    </div>

                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white shadow-sm border">
                                    <UserCircle className="h-6 w-6 text-purple-600" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 mt-2">
                                <DropdownMenuLabel className="font-normal border-b pb-2 mb-2">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">Ο λογαριασμός μου</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <div className="max-h-[300px] overflow-y-auto">
                                    <DropdownMenuItem onClick={() => setIsNewAutopsiaOpen(true)} className="cursor-pointer flex items-center gap-2 text-blue-600 font-bold">
                                        <Plus className="h-4 w-4" /> Νέα Αυτοψία
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setStatusFilter("pending")} className="cursor-pointer flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-amber-500" /> Εκκρεμείς Αυτοψίες
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("ready")} className="cursor-pointer flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Έτοιμες για Αποστολή
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("all")} className="cursor-pointer flex items-center gap-2">
                                        <Layers className="h-4 w-4 text-blue-500" /> Όλες οι Αυτοψίες
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setCityFilter("all")} className="cursor-pointer flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-purple-500" /> Όλες οι Πόλεις
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setShowEngineerSigSetup(true)} className="cursor-pointer flex items-center gap-2">
                                        <PenLine className="h-4 w-4 text-blue-500" /> Υπογραφή Τεχνικού
                                    </DropdownMenuItem>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => supabase.auth.signOut()}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Αποσύνδεση
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Filters Section (Mobile) */}
            <div className={cn("lg:hidden bg-white border-slate-200/90 rounded-2xl shadow-sm border p-4 mb-6 space-y-3", customerUrlParam && "hidden")}>
                <div className="flex flex-col gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Αναζήτηση (διεύθυνση, όνομα, SR, Building ID)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 bg-white border-slate-300 text-slate-950 placeholder:text-slate-500 font-medium focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                    </div>

                    {/* Quick Status Tabs on Mobile */}
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                        <Button
                            variant={statusFilter === "pending" ? "default" : "ghost"}
                            size="sm"
                            className={cn(
                                "h-8 px-1 text-[11px] font-black rounded-lg transition-all",
                                statusFilter === "pending" ? "bg-slate-950 text-white shadow-xs" : "text-slate-900 hover:bg-slate-200 hover:text-black"
                            )}
                            onClick={() => setStatusFilter("pending")}
                        >
                            ⏳ Εκκρεμείς ({pendingCount})
                        </Button>
                        <Button
                            variant={statusFilter === "ready" ? "default" : "ghost"}
                            size="sm"
                            className={cn(
                                "h-8 px-1 text-[11px] font-black rounded-lg transition-all",
                                statusFilter === "ready" ? "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700" : "text-slate-900 hover:bg-slate-200 hover:text-black"
                            )}
                            onClick={() => setStatusFilter("ready")}
                        >
                            📦 Έτοιμες ({readyCount})
                        </Button>
                        <Button
                            variant={statusFilter === "all" ? "default" : "ghost"}
                            size="sm"
                            className={cn(
                                "h-8 px-1 text-[11px] font-black rounded-lg transition-all",
                                statusFilter === "all" ? "bg-blue-600 text-white shadow-xs hover:bg-blue-700" : "text-slate-900 hover:bg-slate-200 hover:text-black"
                            )}
                            onClick={() => setStatusFilter("all")}
                        >
                            📁 Όλες ({allCount})
                        </Button>
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full h-10 gap-2 bg-white border-dashed text-slate-700 hover:bg-slate-50 text-xs">
                                <Filter className="h-4 w-4" />
                                Φίλτρα Πόλης
                                {cityFilter !== "all" && (
                                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px]">1</span>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white text-slate-900">
                            <SheetHeader>
                                <SheetTitle className="text-slate-900">Φίλτρα</SheetTitle>
                            </SheetHeader>
                            <div className="py-6 space-y-6">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Κατάσταση:</p>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { key: "pending", label: "⏳ Σε Εκκρεμότητα", count: pendingCount },
                                            { key: "ready", label: "📦 Έτοιμες για Αποστολή", count: readyCount },
                                            { key: "all", label: "📁 Όλες οι Αυτοψίες", count: allCount },
                                        ].map((f) => (
                                            <Button
                                                key={f.key}
                                                variant={statusFilter === f.key ? "default" : "outline"}
                                                size="sm"
                                                className={cn(
                                                    "justify-between font-bold",
                                                    statusFilter === f.key && f.key === "ready" && "bg-emerald-600 hover:bg-emerald-700 text-white",
                                                    statusFilter === f.key && f.key === "pending" && "bg-slate-900 hover:bg-slate-800 text-white",
                                                    statusFilter === f.key && f.key === "all" && "bg-blue-600 hover:bg-blue-700 text-white",
                                                    statusFilter !== f.key && "bg-white text-slate-700 hover:bg-slate-50"
                                                )}
                                                onClick={() => setStatusFilter(f.key as any)}
                                            >
                                                <span>{f.label}</span>
                                                <span className="text-xs opacity-80">({f.count})</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Πόλη:</p>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { key: "all", label: "Όλες οι Πόλεις" },
                                            { key: "kastoria", label: "📍 Καστοριά" },
                                            { key: "florina", label: "📍 Φλώρινα" },
                                        ].map((filter) => (
                                            <Button
                                                key={filter.key}
                                                variant={cityFilter === filter.key ? "default" : "outline"}
                                                size="sm"
                                                className={cn(
                                                    "justify-between font-semibold",
                                                    cityFilter === filter.key && filter.key === "kastoria" && "bg-purple-600 hover:bg-purple-700 text-white",
                                                    cityFilter === filter.key && filter.key === "florina" && "bg-cyan-600 hover:bg-cyan-700 text-white",
                                                    cityFilter === filter.key && filter.key === "all" && "bg-slate-800 hover:bg-slate-900 text-white",
                                                    cityFilter !== filter.key && "bg-white text-slate-700 hover:bg-slate-50"
                                                )}
                                                onClick={() => setCityFilter(filter.key as any)}
                                            >
                                                <span>{filter.label}</span>
                                                {validCustomers && (
                                                    <span className="ml-auto text-xs opacity-70">
                                                        ({filter.key === "all" ? validCustomers.length : validCustomers.filter(c => (c as any)[`is_${filter.key}`]).length})
                                                    </span>
                                                )}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Desktop Filters */}
            <div className={cn("hidden lg:flex flex-col gap-4 mb-8", customerUrlParam && "hidden")}>
                <div className="bg-white border-slate-200/90 rounded-2xl shadow-sm border p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="relative flex-1 min-w-[280px] max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Αναζήτηση βάσει διεύθυνσης, ονόματος, SR ή Building ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 bg-white border-slate-300 text-slate-950 placeholder:text-slate-500 font-medium focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Status Filter Tabs */}
                        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-xs">
                            <Button
                                variant={statusFilter === "pending" ? "default" : "ghost"}
                                size="sm"
                                className={cn(
                                    "h-9 px-3.5 rounded-lg text-xs font-black transition-all",
                                    statusFilter === "pending" ? "bg-slate-950 text-white shadow-sm" : "text-slate-900 hover:bg-slate-200 hover:text-black"
                                )}
                                onClick={() => setStatusFilter("pending")}
                            >
                                ⏳ Σε Εκκρεμότητα
                                <span className={cn(
                                    "ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-black",
                                    statusFilter === "pending" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-950"
                                )}>
                                    {pendingCount}
                                </span>
                            </Button>
                            <Button
                                variant={statusFilter === "ready" ? "default" : "ghost"}
                                size="sm"
                                className={cn(
                                    "h-9 px-3.5 rounded-lg text-xs font-black transition-all",
                                    statusFilter === "ready" ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" : "text-slate-900 hover:bg-slate-200 hover:text-black"
                                )}
                                onClick={() => setStatusFilter("ready")}
                            >
                                📦 Έτοιμες για Αποστολή
                                <span className={cn(
                                    "ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-black",
                                    statusFilter === "ready" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-900"
                                )}>
                                    {readyCount}
                                </span>
                            </Button>
                            <Button
                                variant={statusFilter === "all" ? "default" : "ghost"}
                                size="sm"
                                className={cn(
                                    "h-9 px-3.5 rounded-lg text-xs font-black transition-all",
                                    statusFilter === "all" ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm" : "text-slate-900 hover:bg-slate-200 hover:text-black"
                                )}
                                onClick={() => setStatusFilter("all")}
                            >
                                📁 Όλες
                                <span className={cn(
                                    "ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-black",
                                    statusFilter === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-950"
                                )}>
                                    {allCount}
                                </span>
                            </Button>
                        </div>

                        {/* City Filters */}
                        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                            {[
                                { key: "all", label: "Όλες οι Πόλεις" },
                                { key: "kastoria", label: "📍 Καστοριά" },
                                { key: "florina", label: "📍 Φλώρινα" },
                            ].map((filter) => (
                                <Button
                                    key={filter.key}
                                    variant={cityFilter === filter.key ? "default" : "ghost"}
                                    size="sm"
                                    className={cn(
                                        "h-9 px-3 rounded-lg text-xs font-black transition-all",
                                        cityFilter === filter.key && filter.key === "kastoria" && "bg-purple-600 hover:bg-purple-700 text-white",
                                        cityFilter === filter.key && filter.key === "florina" && "bg-cyan-700 hover:bg-cyan-800 text-white",
                                        cityFilter === filter.key && filter.key === "all" && "bg-slate-950 hover:bg-black text-white",
                                        cityFilter !== filter.key && "text-slate-900 hover:bg-slate-200 hover:text-black"
                                    )}
                                    onClick={() => setCityFilter(filter.key as any)}
                                >
                                    {filter.label}
                                    {validCustomers && (
                                        <span className={cn("ml-1.5", cityFilter === filter.key ? "opacity-90" : "opacity-80 font-black")}>
                                            ({filter.key === "all" ? validCustomers.length : validCustomers.filter(c => (c as any)[`is_${filter.key}`]).length})
                                        </span>
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {displayedCustomers.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-md mx-auto shadow-sm my-8">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
                        <Users className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">Δεν βρέθηκαν αυτοψίες</h3>
                    <p className="text-xs text-slate-500 mb-4 font-medium">
                        {customers?.length === 0 ? "Δεν υπάρχει καμία καταχωρημένη αυτοψία. Πατήστε παρακάτω για προσθήκη." : "Δεν βρέθηκαν αποτελέσματα με τα επιλεγμένα φίλτρα."}
                    </p>
                    <Button
                        onClick={() => setIsNewAutopsiaOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-4 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Προσθήκη Νέας Αυτοψίας
                    </Button>
                </div>
            ) : (
                <div className={cn("grid gap-6 items-start", customerUrlParam ? "grid-cols-1 max-w-2xl mx-auto" : "md:grid-cols-2 lg:grid-cols-3")}>
                    {displayedCustomers.map((customer) => {
                    const isExpanded = expandedCustomers[customer.id] !== undefined ? expandedCustomers[customer.id] : !!customerUrlParam;

                    return (
                        <Card id={customer.id} key={customer.id} className={cn(
                            "border shadow-sm overflow-hidden h-fit transition-all duration-300",
                            isAutopsiaReady(customer) && "ring-2 ring-emerald-500/60 bg-emerald-50/15",
                            getContractorCardClass(customer)
                        )}>
                            <CardContent className="p-4">
                                <div
                                    className="flex items-start justify-between cursor-pointer group"
                                    onClick={() => {
                                        const nextExpanded = !isExpanded;
                                        setExpandedCustomers(prev => ({ ...prev, [customer.id]: nextExpanded }));
                                        if (nextExpanded) {
                                            setActiveCustomerId(customer.id);
                                        } else {
                                            setActiveCustomerId(null);
                                        }
                                    }}
                                >
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors text-slate-800">
                                            {customer.address || 'Χωρίς διεύθυνση'}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 flex-wrap">
                                            SR: {customer.sr} 
                                            {(customer.chimney_number || customer.chimney_type || customer.autopsia_tech_data?.chimney_number) ? (
                                                <span> • <span className="font-bold text-blue-900 cursor-pointer hover:underline" onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    const chim = customer.chimney_number || customer.chimney_type || customer.autopsia_tech_data?.chimney_number || "";
                                                    setCurrentCustomerForChimney(customer); 
                                                    setTempChimney(chim); 
                                                }}>Καμπίνα: {customer.chimney_number || customer.chimney_type || customer.autopsia_tech_data?.chimney_number} <PenLine className="inline h-3 w-3" /></span></span>
                                            ) : (
                                                <span> • <span className="font-bold text-blue-900 cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); setCurrentCustomerForChimney(customer); setTempChimney(""); }}>Προσθήκη Καμπίνας</span></span>
                                            )} 
                                            {customer.floor && <span> • <span className="font-bold text-orange-900">Όροφος: {customer.floor}</span></span>} {customer.building_id && `• ID: ${customer.building_id}`} • {customer.first_name} {customer.last_name}

                                            <span className="flex items-center gap-1 mt-0.5 flex-wrap">
                                                <a
                                                    href={`/ftth-autopsia?customer=${customer.id}`}
                                                    className="inline-flex items-center justify-center h-5 w-5 rounded-full border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shrink-0"
                                                    title="Προβολή Πελάτη"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCustomerToDelete(customer);
                                                    }}
                                                    className="inline-flex items-center justify-center h-5 w-5 rounded-full border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shrink-0 cursor-pointer"
                                                    title="Διαγραφή Αυτοψίας"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                                {isAutopsiaReady(customer) && <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 flex items-center gap-1">📦 ΕΤΟΙΜΗ</span>}
                                                {customer.is_kastoria && <span className="text-[9px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200">📍 ΚΑΣΤΟΡΙΑ</span>}
                                                {customer.is_florina && <span className="text-[9px] font-bold bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded border border-cyan-200">📍 ΦΛΩΡΙΝΑ</span>}
                                                {(customer.is_thiseas || customer.contractor?.toUpperCase() === 'THISEAS') && <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">👷 THISEAS</span>}
                                                {(customer.is_ergatikat || customer.contractor?.toUpperCase() === 'ERGATIKAT') && <span className="text-[9px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200">👷 ERGATIKAT</span>}
                                                {((customer as any).is_beyondwire || customer.contractor?.toUpperCase() === 'BEYONDWIRE') && <span className="text-[9px] font-bold bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded border border-violet-200">🔷 BEYONDWIRE</span>}
                                                {(customer.is_kasos || customer.contractor?.toUpperCase() === 'KASOS') && <span className="text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200">🟢 KASOS</span>}
                                            </span>
                                        </p>

                                        {/* Contact info */}
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {customer.phone && (
                                                <a href={`tel:${customer.phone}`} className="inline-flex items-center gap-2 text-xs font-bold text-white bg-slate-800 px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-900 transition-colors shadow-sm">
                                                    <Phone className="h-3.5 w-3.5 text-emerald-400" />
                                                    ΚΛΗΣΗ: {customer.phone}
                                                </a>
                                            )}
                                            {customer.manager_phone && (
                                                <a href={`tel:${customer.manager_phone}`} className="inline-flex items-center gap-2 text-xs font-bold text-white bg-blue-700 px-3 py-2 rounded-lg border border-blue-600 hover:bg-blue-800 transition-colors shadow-sm">
                                                    <Phone className="h-3.5 w-3.5 text-white" />
                                                    ΔΙΑΧΕΙΡΙΣΤΗΣ: {customer.manager_phone}
                                                </a>
                                            )}
                                            {(customer as any).building_id && (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-sm h-auto"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText((customer as any).building_id);
                                                        toast.success("Το BID αντέγραφηκε!");
                                                        window.open("https://home.teletronic.gr/", "_blank");
                                                    }}
                                                >
                                                    <Search className="h-3.5 w-3.5" />
                                                    ΠΛΟΗΓΗΣΗ ΣΤΟΝ ΠΕΛΑΤΗ
                                                </Button>
                                            )}

                                            {customer.excel_url && (
                                                <div className="flex items-center gap-2">
                                                    <a href={getTimestampedUrl(customer.excel_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors shadow-sm">
                                                        <FileSpreadsheet className="h-3.5 w-3.5" />
                                                        ΓΡΑΜΜΟΓΡΑΦΗΣΗ
                                                    </a>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 shadow-sm"
                                                        onClick={() => setPreviewExcelUrl(getTimestampedUrl(customer.excel_url))}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Comments Display */}
                                        <div 
                                            className="mt-4 p-3 bg-amber-50/50 rounded-xl border border-amber-100 shadow-sm cursor-pointer group hover:border-purple-300 hover:bg-purple-50/30 transition-all"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setTimelineCustomer(customer);
                                                setTimelineOpen(true);
                                            }}
                                            title="Κάντε κλικ για προβολή Σχολίων & Ιστορικού"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-1.5">
                                                    <MessageSquare className="h-3.5 w-3.5 text-amber-600" />
                                                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Παρατηρήσεις / Σχόλια</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 px-2 text-[11px] font-bold text-purple-700 bg-purple-100/60 hover:bg-purple-200/60 rounded flex items-center gap-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setTimelineCustomer(customer);
                                                        setTimelineOpen(true);
                                                    }}
                                                >
                                                    <MessageSquare className="h-3 w-3" />
                                                    <span>Σχόλιο</span>
                                                </Button>
                                            </div>
                                            {customer.thanasis_comments ? (
                                                <p className="text-xs text-amber-900 leading-relaxed font-medium whitespace-pre-wrap">
                                                    {customer.thanasis_comments}
                                                </p>
                                            ) : (
                                                <p className="text-[10px] text-amber-600/60 italic">Δεν υπάρχουν σχόλια (Κάντε κλικ για προσθήκη)...</p>
                                            )}
                                            <div className="mt-2 pt-1 border-t border-amber-200/40 flex items-center justify-between text-[10px] text-purple-600 font-semibold">
                                                <span className="flex items-center gap-1 group-hover:underline">
                                                    <MessageSquare className="h-3 w-3" /> Ιστορικό Σημειώσεων & Ώρα
                                                </span>
                                            </div>
                                        </div>

                                        {isExpanded && (customer.autopsia_latitude || customer.autopsia_tech_data?.latitude) && (
                                            <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600 font-mono">
                                                <MapPin className="h-3 w-3" />
                                                {customer.autopsia_latitude || customer.autopsia_tech_data?.latitude}, {customer.autopsia_longitude || customer.autopsia_tech_data?.longitude}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {/* Ready for Send Checkbox Toggle */}
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const nextReady = !isAutopsiaReady(customer);
                                                toggleReadyMutation.mutate({
                                                    id: customer.id,
                                                    isReady: nextReady,
                                                    customer
                                                });
                                            }}
                                            className={cn(
                                                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-xs select-none",
                                                isAutopsiaReady(customer)
                                                    ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200"
                                                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                                            )}
                                            title={isAutopsiaReady(customer) ? "Κάντε κλικ για επαναφορά στις Εκκρεμείς" : "Κάντε κλικ για σημείωση ως Έτοιμη για Αποστολή"}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isAutopsiaReady(customer)}
                                                onChange={() => {}}
                                                className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer pointer-events-none"
                                            />
                                            <span>{isAutopsiaReady(customer) ? "Έτοιμη ✓" : "Έτοιμη"}</span>
                                        </div>

                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                        </Button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="space-y-4 mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider tabular-nums">Φωτογραφίες ΟΔΕΥΣΗΣ</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {renderPhotoCategory(customer, "aut_earth", "Χωματουργικό")}
                                                {renderPhotoCategory(customer, "aut_route", "Οδευση")}
                                                {renderPhotoCategory(customer, "aut_bepbmo", "BEP & BMO")}
                                                <div className="col-span-2 space-y-2 mt-2">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">FB (Fiber Box) & ΟΡΟΦΟΙ</p>
                                                        <div className="flex items-center gap-1">
                                                            <Input
                                                                placeholder="+01"
                                                                className="h-6 w-16 text-xs px-1 bg-white"
                                                                value={newFloorInput[customer.id] || ""}
                                                                onChange={(e) => setNewFloorInput(prev => ({ ...prev, [customer.id]: e.target.value }))}
                                                            />
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-6 px-2 text-xs bg-white"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    const floor = newFloorInput[customer.id];
                                                                    if (floor) {
                                                                        setFbFloors(prev => ({
                                                                            ...prev,
                                                                            [customer.id]: [...(prev[customer.id] || []), floor]
                                                                        }));
                                                                        setNewFloorInput(prev => ({ ...prev, [customer.id]: "" }));
                                                                    }
                                                                }}
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {(() => {
                                                            const existingFloors = new Set<string>();
                                                            (customer.photo_urls || []).forEach((url: string) => {
                                                                const fileName = decodeURIComponent(url.toLowerCase().split('/').pop() || "");
                                                                if (fileName.includes('aut_fb_')) {
                                                                    const parts = fileName.split('_');
                                                                    // Handle both legacy (aut_fb_floor...) and new (SR_aut_fb_floor...)
                                                                    const floorIndex = fileName.startsWith('aut_fb_') ? 2 : 3;
                                                                    if (parts.length > floorIndex) {
                                                                        existingFloors.add(parts[floorIndex].toUpperCase());
                                                                    }
                                                                }
                                                            });
                                                            const allFloors = Array.from(new Set([...Array.from(existingFloors), ...(fbFloors[customer.id] || [])])).sort();

                                                            return allFloors.map(floor => (
                                                                <div key={floor} className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-1">
                                                                            <Layers className="h-3 w-3 text-slate-400" />
                                                                            <span className="text-[10px] font-bold text-slate-700">ΟΡΟΦΟΣ {floor}</span>
                                                                        </div>
                                                                        <div className="flex gap-1">
                                                                            <Label htmlFor={`camera-fb-${floor}-${customer.id}`} className="cursor-pointer p-1 hover:bg-slate-200 rounded-full xl:hidden">
                                                                                <Camera className="h-4 w-4 text-primary" />
                                                                                <input
                                                                                    type="file"
                                                                                    id={`camera-fb-${floor}-${customer.id}`}
                                                                                    className="hidden"
                                                                                    accept="image/*"
                                                                                    capture="environment"
                                                                                    onChange={(e) => {
                                                                                        if (e.target.files && e.target.files[0]) {
                                                                                            const reader = new FileReader();
                                                                                            reader.onload = (event) => {
                                                                                                setEditingImage({
                                                                                                    src: event.target?.result as string,
                                                                                                    category: 'aut_fb',
                                                                                                    customerId: customer.id,
                                                                                                    floor
                                                                                                });
                                                                                            };
                                                                                            reader.readAsDataURL(e.target.files[0]);
                                                                                            e.target.value = '';
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </Label>
                                                                            <Label htmlFor={`upload-fb-${floor}-${customer.id}`} className="cursor-pointer p-1 hover:bg-slate-200 rounded-full">
                                                                                <Plus className="h-4 w-4 text-primary" />
                                                                                <input
                                                                                    type="file"
                                                                                    id={`upload-fb-${floor}-${customer.id}`}
                                                                                    className="hidden"
                                                                                    accept="image/*"
                                                                                    multiple
                                                                                    onChange={(e) => {
                                                                                        if (e.target.files && e.target.files.length > 0) {
                                                                                            const files = Array.from(e.target.files);
                                                                                            if (files.length === 1) {
                                                                                                const reader = new FileReader();
                                                                                                reader.onload = (event) => {
                                                                                                    setEditingImage({
                                                                                                        src: event.target?.result as string,
                                                                                                        category: 'aut_fb',
                                                                                                        customerId: customer.id,
                                                                                                        floor
                                                                                                    });
                                                                                                };
                                                                                                reader.readAsDataURL(files[0]);
                                                                                            } else {
                                                                                                uploadPhotosMutation.mutate({ customerId: customer.id, category: 'aut_fb', floor, files });
                                                                                            }
                                                                                            e.target.value = '';
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </Label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-1 min-h-[32px]">
                                                                        {(customer.photo_urls || []).filter((url: string) => {
                                                                            const fileName = decodeURIComponent(url.toLowerCase().split('/').pop() || "");
                                                                            return fileName.includes(`aut_fb_${floor.toLowerCase()}_`) || fileName.startsWith(`aut_fb_${floor.toLowerCase()}_`);
                                                                        }).map((url: string, idx: number, floorPhotos: string[]) => (
                                                                            <div key={idx} className="relative group">
                                                                                <button onClick={() => { setSelectedCustomerPhotos(floorPhotos); setSelectedCustomerName(`${customer.address} - FB Όροφος ${floor}`); setLightboxIndex(idx); }} className="w-14 h-14 rounded-lg overflow-hidden border-2 border-white shadow-sm hover:border-primary/50 transition-colors">
                                                                                    <img src={getTimestampedUrl(url)} className="w-full h-full object-cover" />
                                                                                </button>
                                                                                <div className="absolute -top-2 -right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                                                    <button
                                                                                        onClick={(e) => { 
                                                                                            e.stopPropagation(); 
                                                                                            const timestampedUrl = getTimestampedUrl(url);
                                                                                            setEditingImage({ src: timestampedUrl, category: 'aut_fb', customerId: customer.id, floor, isExisting: true, existingUrl: url }); 
                                                                                        }}
                                                                                        className="bg-blue-600 text-white rounded-full p-1 shadow-md hover:bg-blue-700 active:scale-90 transition-all border border-white"
                                                                                    >
                                                                                        <Edit2 className="h-3 w-3" />
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={(e) => { e.stopPropagation(); confirm("Διαγραφή;") && deletePhotoMutation.mutate({ customerId: customer.id, photoUrl: url }); }}
                                                                                        className="bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 active:scale-90 transition-all border border-white"
                                                                                    >
                                                                                        <X className="h-3 w-3" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ));
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ΕΝΤΥΠΑ</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {renderPhotoCategory(customer, "aut_decl", "Υ.Δ. Διαχειριστή")}
                                                {renderPhotoCategory(customer, "aut_cab", "Καμπίνα")}
                                                {renderPhotoCategory(customer, "aut_wait", "Αναμονή")}
                                                {renderPhotoCategory(customer, "aut_tech", "Τεχν. Περιγραφή")}
                                                {renderPhotoCategory(customer, "aut_hedm", "ΧΕΔΜ")}
                                                {renderPhotoCategory(customer, "aut_form1", "Έντυπο 1")}
                                                {renderPhotoCategory(customer, "aut_report", "Έκθεση Επιθ.")}
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 mt-4">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ΕΠΙΠΛΕΟΝ ΕΠΙΛΟΓΕΣ ΑΥΤΟΨΙΑΣ</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-100/50 transition-colors">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={customer.exoterika_fb || false}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                saveExoterikaFbMutation.mutate({ 
                                                                    id: customer.id, 
                                                                    exoterika_fb: checked,
                                                                    count: customer.exoterika_fb_count || 1 
                                                                });
                                                            }}
                                                            className="h-4 w-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500 cursor-pointer"
                                                        />
                                                        <span className="text-xs font-bold text-slate-700">📦 ΕΞΩΤΕΡΙΚΑ FB (Βάλε BEP)</span>
                                                    </label>
                                                    {customer.exoterika_fb && (
                                                        <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 rounded-md px-2 py-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                            <span className="text-[10px] font-extrabold text-purple-700 uppercase">Ποσότητα:</span>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                max="99"
                                                                defaultValue={customer.exoterika_fb_count || 1}
                                                                onBlur={(e) => {
                                                                    const count = Math.max(1, parseInt(e.target.value) || 1);
                                                                    saveExoterikaFbMutation.mutate({ 
                                                                        id: customer.id, 
                                                                        exoterika_fb: true, 
                                                                        count 
                                                                    });
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        (e.target as HTMLInputElement).blur();
                                                                    }
                                                                }}
                                                                className="w-12 h-6 text-xs font-bold text-center border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100/50 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={customer.den_thelei_xwmatoyrgiko || false}
                                                        onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            saveDenTheleiXwmatoyrgikoMutation.mutate({ id: customer.id, den_thelei_xwmatoyrgiko: checked });
                                                        }}
                                                        className="h-4 w-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500 cursor-pointer"
                                                    />
                                                    <span className="text-xs font-bold text-slate-700">🚫 ΔΕΝ ΘΕΛΕΙ ΧΩΜΑΤΟΥΡΓΙΚΟ</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 mt-4">
                                            <Button
                                                variant="outline"
                                                className="h-11 font-bold border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs px-2"
                                                onClick={() => setCustomerToDelete(customer)}
                                                disabled={deleteCustomerMutation.isPending}
                                            >
                                                <Trash2 className="h-3.5 w-3.5 mr-1 text-rose-500" />
                                                ΔΙΑΓΡΑΦΗ
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-11 font-bold border-amber-300 text-amber-700 hover:bg-amber-50 text-xs px-2"
                                                onClick={() => {
                                                    setCancellingCustomer(customer);
                                                    setCancellationReason("");
                                                    setCancellationDialogOpen(true);
                                                }}
                                                disabled={cancelAutopsiaMutation.isPending}
                                            >
                                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                                ΑΚΥΡΩΣΗ
                                            </Button>
                                            <Button
                                                className="h-11 font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md text-xs px-2 transition-all"
                                                onClick={() => confirm("Ολοκλήρωση Αυτοψίας;") && completeAutopsiaMutation.mutate(customer)}
                                                disabled={completeAutopsiaMutation.isPending}
                                            >
                                                ΟΛΟΚΛΗΡΩΣΗ
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            )}
            
            {filteredCustomers && visibleCount < filteredCustomers.length && (
                <div className="flex justify-center mt-8 mb-4 w-full">
                    <Button variant="outline" size="lg" onClick={() => setVisibleCount(v => v + 20)} className="w-full sm:w-auto shadow-sm">
                        Φόρτωση Περισσότερων (Έχουν εμφανιστεί {displayedCustomers.length} από {filteredCustomers.length})
                    </Button>
                </div>
            )}

            <Dialog open={lightboxIndex !== null} onOpenChange={() => setLightboxIndex(null)}>
                <DialogContent aria-describedby={undefined} className="max-w-4xl p-0 h-[80vh] bg-black">
                    <DialogTitle className="sr-only">Προβολή Φωτογραφίας</DialogTitle>
                    <DialogDescription className="sr-only">Προβολή της επιλεγμένης φωτογραφίας σε πλήρη οθόνη.</DialogDescription>
                    {selectedCustomerPhotos && lightboxIndex !== null && (
                        <img src={getTimestampedUrl(selectedCustomerPhotos[lightboxIndex])} className="w-full h-full object-contain" />
                    )}
                </DialogContent>
            </Dialog>

            {uploadProgress && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-6">
                    <Card className="w-full max-w-md p-6 text-center">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
                        <h3 className="font-bold">Ανέβασμα {uploadProgress.category}</h3>
                        <p className="text-sm text-muted-foreground mb-4">Αρχείο {uploadProgress.current} από {uploadProgress.total}</p>
                        <Progress value={(uploadProgress.current / uploadProgress.total) * 100} />
                    </Card>
                </div>
            )}

            <Dialog open={commentEditOpen} onOpenChange={setCommentEditOpen}>
                <DialogContent aria-describedby={undefined} className="sm:max-w-[425px] bg-white text-slate-950 border-slate-200 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-slate-950 font-bold">
                            <PenLine className="h-5 w-5 text-primary" />
                            Παρατηρήσεις Αυτοψίας
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            Επεξεργασία των παρατηρήσεων για την επιλεγμένη αυτοψία.
                        </DialogDescription>
                        <p className="text-sm text-slate-700 font-semibold">
                            {editingCustomerForComment?.address}
                        </p>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <textarea
                            className="min-h-[150px] w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-950 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            placeholder="Γράψτε εδώ τις παρατηρήσεις σας..."
                            value={tempComment}
                            onChange={(e) => setTempComment(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" className="border-slate-300 text-slate-800 hover:bg-slate-200 hover:text-black font-bold" onClick={() => setCommentEditOpen(false)}>
                            Ακύρωση
                        </Button>
                        <Button
                            onClick={() => saveCommentMutation.mutate({ id: editingCustomerForComment.id, comments: tempComment })}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                            disabled={saveCommentMutation.isPending}
                        >
                            {saveCommentMutation.isPending ? "Αποθήκευση..." : "Αποθήκευση"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ADT Input Dialog */}
            <Dialog open={!!currentCustomerForAdt} onOpenChange={(open) => !open && setCurrentCustomerForAdt(null)}>
                <DialogContent aria-describedby={undefined} className="sm:max-w-[425px] bg-white text-slate-950 border-slate-200 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-slate-950 font-bold">
                            <UserCircle className="h-5 w-5 text-primary" />
                            Εισαγωγή ΑΔΤ Πελάτη
                        </DialogTitle>
                        <DialogDescription className="text-slate-700 font-medium">
                            Πληκτρολογήστε τον αριθμό ταυτότητας για να συμπληρωθεί αυτόματα στην Υπεύθυνη Δήλωση.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            placeholder="π.χ. ΑΝ 123456"
                            value={tempAdt}
                            onChange={(e) => setTempAdt(e.target.value.toUpperCase())}
                            className="text-lg font-black uppercase h-12 bg-white text-slate-950 border-slate-300"
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" className="border-slate-300 text-slate-800 hover:bg-slate-200 hover:text-black font-bold" onClick={() => setCurrentCustomerForAdt(null)}>Άκυρο</Button>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold" 
                            disabled={saveAdtMutation.isPending}
                            onClick={() => saveAdtMutation.mutate({ id: currentCustomerForAdt?.id, adt: tempAdt })}
                        >
                            Αποθήκευση
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Chimney Number Dialog */}
            <Dialog open={!!currentCustomerForChimney} onOpenChange={(open) => !open && setCurrentCustomerForChimney(null)}>
                <DialogContent aria-describedby={undefined} className="sm:max-w-[425px] bg-white text-slate-950 border-slate-200 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-slate-950 font-bold">
                            <PenLine className="h-4 w-4 text-primary" />
                            Αριθμός Καμπίνας
                        </DialogTitle>
                        <DialogDescription className="text-slate-700 font-medium">
                            Εισάγετε τον αριθμό καμπίνας για {currentCustomerForChimney?.address}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input
                            placeholder="π.χ. 123"
                            value={tempChimney}
                            onChange={(e) => setTempChimney(e.target.value)}
                            className="bg-white text-slate-950 border-slate-300 font-bold"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    saveChimneyNumberMutation.mutate({
                                        id: currentCustomerForChimney.id,
                                        chimney_number: tempChimney
                                    });
                                }
                            }}
                        />
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                            onClick={() => saveChimneyNumberMutation.mutate({
                                id: currentCustomerForChimney.id,
                                chimney_number: tempChimney
                            })}
                            disabled={saveChimneyNumberMutation.isPending}
                        >
                            {saveChimneyNumberMutation.isPending ? "Αποθήκευση..." : "Αποθήκευση"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Signature Dialog */}
            <Dialog open={!!currentCustomerForSignature} onOpenChange={(open) => !open && setCurrentCustomerForSignature(null)}>
                <DialogContent aria-describedby={undefined} className="sm:max-w-[500px] bg-white text-slate-950 border-slate-200 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-slate-950 font-bold">
                            <PenLine className="h-5 w-5 text-primary" />
                            Ψηφιακή Υπογραφή Πελάτη
                        </DialogTitle>
                        <DialogDescription className="text-slate-700 font-medium">
                            Παρακαλούμε υπογράψτε μέσα στο παρακάτω πλαίσιο.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 overflow-hidden touch-none">
                            <canvas
                                id="signature-canvas"
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
                                ref={(canvas) => {
                                    if (canvas) {
                                        const ctx = canvas.getContext('2d');
                                        if (ctx) {
                                            ctx.strokeStyle = "#0000FF";
                                            ctx.lineWidth = 3;
                                            ctx.lineCap = "round";
                                            ctx.lineJoin = "round";
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between gap-3">
                        <Button 
                            variant="outline" 
                            className="border-slate-300 text-slate-800 hover:bg-slate-200 hover:text-black font-bold"
                            onClick={() => {
                                const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;
                                const ctx = canvas?.getContext('2d');
                                if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                                setTempSignatureDataUrl(null);
                            }}
                        >
                            Καθαρισμός
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="outline" className="border-slate-300 text-slate-800 hover:bg-slate-200 hover:text-black font-bold" onClick={() => setCurrentCustomerForSignature(null)}>Άκυρο</Button>
                            <Button 
                                className="bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-2" 
                                disabled={isSavingSignature}
                                onClick={async () => {
                                    const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;
                                    if (canvas && currentCustomerForSignature) {
                                        setIsSavingSignature(true);
                                        const dataUrl = canvas.toDataURL("image/png");
                                        const res = await fetch(dataUrl);
                                        const blob = await res.blob();
                                        const file = new File([blob], `signature_${currentCustomerForSignature.id}_${Date.now()}.png`, { type: 'image/png' });
                                        
                                        try {
                                            const publicUrl = await uploadToR2(file, file.name);
                                            if (publicUrl) {
                                                saveSignatureMutation.mutate({ id: currentCustomerForSignature.id, signature_url: publicUrl });
                                            } else {
                                                toast.error("Αποτυχία ανεβάσματος υπογραφής");
                                                setIsSavingSignature(false);
                                            }
                                        } catch (e) {
                                            toast.error("Σφάλμα αποθήκευσης");
                                            setIsSavingSignature(false);
                                        }
                                    }
                                }}
                            >
                                {isSavingSignature ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                Αποθήκευση
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            
            {/* Father's Name Dialog */}
            <Dialog open={!!currentCustomerForFatherName} onOpenChange={(open) => !open && setCurrentCustomerForFatherName(null)}>
                <DialogContent aria-describedby={undefined} className="sm:max-w-[425px] bg-white text-slate-950 border-slate-200 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-slate-950 font-bold">
                            <UserCircle className="h-5 w-5 text-primary" />
                            Ονοματεπώνυμο Πατρός
                        </DialogTitle>
                        <DialogDescription className="text-slate-700 font-medium">
                            Εισάγετε το όνομα πατρός του πελάτη για το έντυπο.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="father-name" className="text-sm font-bold text-slate-900">Όνομα Πατρός</label>
                            <Input
                                id="father-name"
                                placeholder="π.χ. ΙΩΑΝΝΗΣ"
                                value={tempFatherName}
                                onChange={(e) => setTempFatherName(e.target.value.toUpperCase())}
                                className="col-span-3 uppercase bg-white text-slate-950 border-slate-300 font-bold"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" className="border-slate-300 text-slate-800 hover:bg-slate-200 hover:text-black font-bold" onClick={() => setCurrentCustomerForFatherName(null)}>Πίσω</Button>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold" 
                            disabled={saveFatherNameMutation.isPending}
                            onClick={() => saveFatherNameMutation.mutate({ id: currentCustomerForFatherName?.id, father_name: tempFatherName })}
                        >
                            Αποθήκευση
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Excel Preview Dialog */}
            <Dialog open={!!previewExcelUrl} onOpenChange={(open) => !open && setPreviewExcelUrl(null)}>
                <DialogContent aria-describedby={undefined} className="max-w-[95vw] w-[1200px] h-[90vh] p-0 overflow-hidden flex flex-col bg-white text-slate-950 border-slate-200 shadow-2xl">
                    <DialogHeader className="p-4 border-b border-slate-200 flex-shrink-0">
                        <DialogTitle className="flex items-center gap-2 text-slate-950 font-bold">
                            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                            Προεπισκόπηση Γραμμογράφησης (Excel)
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 w-full bg-slate-50 relative overflow-hidden flex flex-col">
                        {previewExcelUrl && (
                            (previewExcelUrl.toLowerCase().includes('.xlsx') || previewExcelUrl.toLowerCase().includes('.xls') || previewExcelUrl.toLowerCase().includes('.csv')) ? (
                                <ExcelViewer url={previewExcelUrl} />
                            ) : (
                                <iframe
                                    src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(previewExcelUrl)}`}
                                    className="w-full h-full border-none"
                                    title="Excel Preview"
                                />
                            )
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Cancellation Reason Dialog */}
            <Dialog open={cancellationDialogOpen} onOpenChange={setCancellationDialogOpen}>
                <DialogContent aria-describedby={undefined} className="sm:max-w-[425px] bg-white text-slate-950 border-slate-200 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600 font-bold">
                            <AlertTriangle className="h-5 w-5" />
                            Ακύρωση Αυτοψίας
                        </DialogTitle>
                        <DialogDescription className="text-slate-700 font-medium">
                            Παρακαλώ εισάγετε τον λόγο για τον οποίο ακυρώνεται η αυτοψία στη διεύθυνση:
                            <div className="font-bold text-slate-950 mt-1">{cancellingCustomer?.address}</div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <textarea
                            className="min-h-[120px] w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-950 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 font-medium"
                            placeholder="Λόγος ακύρωσης..."
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" className="border-slate-300 text-slate-800 hover:bg-slate-200 hover:text-black font-bold" onClick={() => setCancellationDialogOpen(false)}>
                            Πίσω
                        </Button>
                        <Button
                            onClick={() => {
                                if (!cancellationReason.trim()) {
                                    toast.error("Παρακαλώ εισάγετε έναν λόγο ακύρωσης.");
                                    return;
                                }
                                cancelAutopsiaMutation.mutate({
                                    customer: cancellingCustomer,
                                    reason: cancellationReason
                                });
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold"
                            disabled={cancelAutopsiaMutation.isPending}
                        >
                            {cancelAutopsiaMutation.isPending ? "Ακύρωση..." : "ΕΠΙΒΕΒΑΙΩΣΗ ΑΚΥΡΩΣΗΣ"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <TechDescriptionModal 
                open={isTechModalOpen}
                onOpenChange={setIsTechModalOpen}
                data={selectedCustomerIdForTech ? (customersTechData[selectedCustomerIdForTech] || {}) : {}}
                onSave={(data) => {
                    if (selectedCustomerIdForTech) {
                        setCustomersTechData(prev => ({
                            ...prev,
                            [selectedCustomerIdForTech]: data
                        }));
                        saveTechDataMutation.mutate({ id: selectedCustomerIdForTech, data });
                    }
                }}
            />

            {/* GPS Location Verification Modal */}
            <Dialog open={!!verificationResult} onOpenChange={(open) => !open && setVerificationResult(null)}>
                <DialogContent aria-describedby={undefined} className="w-[92vw] sm:max-w-md p-4 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto box-border">
                    {verificationResult && (
                        <div className="flex flex-col w-full min-w-0 space-y-3.5">
                            {/* Icon */}
                            <div className="flex justify-center">
                                {verificationResult.isAtLocation ? (
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50 animate-bounce">
                                        <CheckCircle2 className="h-8 w-8 sm:h-9 sm:w-9 stroke-[2.5]" />
                                    </div>
                                ) : (
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center ring-8 ring-rose-50 animate-pulse">
                                        <AlertTriangle className="h-8 w-8 sm:h-9 sm:w-9 stroke-[2.5]" />
                                    </div>
                                )}
                            </div>

                            {/* Header Titles */}
                            <div className="text-center px-1">
                                <DialogTitle className={cn(
                                    "text-lg sm:text-xl font-black tracking-tight",
                                    verificationResult.isAtLocation ? "text-emerald-700" : "text-rose-600"
                                )}>
                                    {verificationResult.isAtLocation ? "ΕΙΣΤΕ ΣΤΟ ΣΩΣΤΟ ΚΤΙΡΙΟ!" : "ΠΡΟΣΟΧΗ: ΔΕΝ ΕΙΣΤΕ ΕΚΕΙ!"}
                                </DialogTitle>
                                {!verificationResult.isAtLocation && (
                                    <div className="mt-1.5 px-3 py-1 bg-rose-100 text-rose-800 rounded-lg text-xs font-bold border border-rose-200 inline-block shadow-sm">
                                        ⚠️ ΠΡΟΣΟΧΗ: Ίσως το BID είναι λάθος!
                                    </div>
                                )}
                                <DialogDescription className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium">
                                    {verificationResult.isAtLocation 
                                        ? "Επαληθεύτηκε: Βρίσκεστε ακριβώς έξω από το κτίριο (≤35m)" 
                                        : "Πρέπει να είστε ακριβώς έξω από το κτίριο (Όριο: 35 μέτρα)"}
                                </DialogDescription>
                            </div>

                            {/* Big Distance Badge */}
                            <div className={cn(
                                "w-full p-3 sm:p-4 rounded-xl border flex flex-col items-center justify-center text-center",
                                verificationResult.isAtLocation 
                                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-900" 
                                    : "bg-rose-50/80 border-rose-200 text-rose-900"
                            )}>
                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-75">
                                    Αποσταση απο το κτιριο
                                </span>
                                <span className="text-2xl sm:text-3xl font-black tracking-tight my-0.5 sm:my-1">
                                    {verificationResult.distanceMeters >= 1000 
                                        ? `${(verificationResult.distanceMeters / 1000).toFixed(2)} km` 
                                        : `${Math.round(verificationResult.distanceMeters)} μέτρα`}
                                </span>
                                <span className="text-[10px] sm:text-[11px] font-semibold">
                                    {verificationResult.isAtLocation 
                                        ? "✓ Βρίσκεστε ακριβώς έξω/εντός του κτιρίου" 
                                        : "⛔ Εκτός ορίου (Απόσταση > 35m) — Ελέγξτε αν είναι λάθος το BID"}
                                </span>
                            </div>

                            {/* Info Box */}
                            <div className="w-full min-w-0 bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200 text-xs space-y-2.5 text-slate-700">
                                {verificationResult.buildingId && (
                                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 gap-2">
                                        <span className="font-semibold text-slate-500 text-[11px]">Building ID (BID):</span>
                                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 text-[11px] shrink-0">
                                            {verificationResult.buildingId}
                                        </span>
                                    </div>
                                )}
                                <div className="border-b border-slate-200/80 pb-2 min-w-0">
                                    <span className="font-semibold text-slate-500 block mb-0.5 text-[11px]">Επίσημη Διεύθυνση BID:</span>
                                    <span className="font-medium text-slate-900 block text-[11px] break-words leading-snug">
                                        {verificationResult.officialAddress}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                                    <div className="bg-white p-2 rounded-lg border border-slate-200 min-w-0">
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold truncate">Συντεταγμενες BID</span>
                                        <span className="font-mono text-[11px] font-semibold text-slate-800 block truncate">
                                            {verificationResult.buildingLat.toFixed(5)}, {verificationResult.buildingLng.toFixed(5)}
                                        </span>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg border border-slate-200 min-w-0">
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold truncate">Το GPS σας (±{Math.round(verificationResult.accuracy)}m)</span>
                                        <span className="font-mono text-[11px] font-semibold text-slate-800 block truncate">
                                            {verificationResult.userLat.toFixed(5)}, {verificationResult.userLng.toFixed(5)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="w-full space-y-2 pt-1">
                                <Button
                                    className="w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 text-xs shadow-sm"
                                    onClick={() => {
                                        window.open(
                                            `https://www.google.com/maps/dir/?api=1&destination=${verificationResult.buildingLat},${verificationResult.buildingLng}`,
                                            "_blank"
                                        );
                                    }}
                                >
                                    <Navigation className="h-4 w-4 text-emerald-400 shrink-0" />
                                    <span className="truncate">Οδηγίες Google Maps προς το Κτίριο</span>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full gap-2 border-slate-300 text-slate-700 font-semibold h-9 text-xs hover:bg-slate-50"
                                    onClick={() => {
                                        if (verificationResult.buildingId) {
                                            navigator.clipboard.writeText(verificationResult.buildingId);
                                        }
                                        window.open("https://home.teletronic.gr/", "_blank");
                                    }}
                                >
                                    <ExternalLink className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                                    <span className="truncate">Προβολή στο Teletronic / Street View</span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="w-full text-slate-500 hover:text-slate-700 h-8 text-xs font-medium"
                                    onClick={() => setVerificationResult(null)}
                                >
                                    Κλείσιμο
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Comments Timeline Modal */}
            <CommentsTimelineDialog
                open={timelineOpen}
                onOpenChange={setTimelineOpen}
                customer={timelineCustomer}
                sourcePageName="Παρατηρήσεις Αυτοψίας (Autopsia2Page)"
                queryKeyToInvalidate={["customers-autopsia2"]}
            />

            {/* New Autopsy Modal */}
            <EngineerSignatureModal open={showEngineerSigSetup} onOpenChange={setShowEngineerSigSetup} />
            <NewAutopsiaModal
                open={isNewAutopsiaOpen}
                onOpenChange={setIsNewAutopsiaOpen}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!customerToDelete} onOpenChange={(open) => !open && setCustomerToDelete(null)}>
                <DialogContent className="sm:max-w-md bg-white border border-slate-200 text-slate-900 rounded-2xl shadow-2xl p-5">
                    <DialogHeader>
                        <DialogTitle className="text-rose-600 flex items-center gap-2 text-base font-bold">
                            <Trash2 className="h-5 w-5" /> Επιβεβαίωση Διαγραφής
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 text-xs sm:text-sm pt-1">
                            Είστε βέβαιοι ότι θέλετε να διαγράψετε οριστικά την αυτοψία{" "}
                            <span className="font-bold text-slate-900">{customerToDelete?.address || customerToDelete?.sr}</span>;
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-2">
                        <Button
                            variant="outline"
                            onClick={() => setCustomerToDelete(null)}
                            disabled={deleteCustomerMutation.isPending}
                            className="h-9 text-xs font-semibold bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                            Ακύρωση
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => customerToDelete && deleteCustomerMutation.mutate(customerToDelete.id)}
                            disabled={deleteCustomerMutation.isPending}
                            className="h-9 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
                        >
                            {deleteCustomerMutation.isPending ? "Διαγραφή..." : "Οριστική Διαγραφή"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

