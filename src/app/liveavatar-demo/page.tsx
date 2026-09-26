"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
    Mic, 
    MicOff, 
    Video as VideoIcon, 
    VideoOff, 
    ScreenShare, 
    PhoneOff, 
    Phone, 
    Paperclip, 
    Smile, 
    Send, 
    X, 
    Bot, 
    Loader2,
    ShieldCheck,
    MessageSquare,
    Building2,
    CheckCircle2,
    FileText
} from "lucide-react";

interface Message {
    id: string;
    sender: "agent" | "user";
    text: string;
    time: string;
}

// Normalization of common Greek speech-to-text misrecognitions for IKE / GEMI / AFM
function cleanGreekSTT(text: string): string {
    if (!text) return text;
    let cleaned = text;

    cleaned = cleaned.replace(/\bτη\s+νίκη\s+μου\b/gi, "την Ι.Κ.Ε. μου");
    cleaned = cleaned.replace(/\bτη\s+νικη\s+μου\b/gi, "την Ι.Κ.Ε. μου");
    cleaned = cleaned.replace(/\bτη\s+νίκη\b/gi, "την Ι.Κ.Ε.");
    cleaned = cleaned.replace(/\bτη\s+νικη\b/gi, "την Ι.Κ.Ε.");
    cleaned = cleaned.replace(/\bγια\s+νίκη\b/gi, "για Ι.Κ.Ε.");
    cleaned = cleaned.replace(/\bγια\s+νικη\b/gi, "για Ι.Κ.Ε.");
    cleaned = cleaned.replace(/\bσε\s+νίκη\b/gi, "σε Ι.Κ.Ε.");
    cleaned = cleaned.replace(/\bμια\s+νίκη\b/gi, "μια Ι.Κ.Ε.");
    cleaned = cleaned.replace(/\bνίκη\s+μου\b/gi, "Ι.Κ.Ε. μου");
    cleaned = cleaned.replace(/\bνικη\s+μου\b/gi, "Ι.Κ.Ε. μου");
    cleaned = cleaned.replace(/\bήκει\b/gi, "Ι.Κ.Ε.");
    cleaned = cleaned.replace(/\bυική\b/gi, "Ι.Κ.Ε.");
    cleaned = cleaned.replace(/\bικε\b/gi, "Ι.Κ.Ε.");
    cleaned = cleaned.replace(/\bικα\b/gi, "Ι.Κ.Ε.");
    cleaned = cleaned.replace(/\bγεμη\b/gi, "Γ.Ε.ΜΗ.");
    cleaned = cleaned.replace(/\bγέμη\b/gi, "Γ.Ε.ΜΗ.");
    cleaned = cleaned.replace(/\bαφμ\b/gi, "Α.Φ.Μ.");
    cleaned = cleaned.replace(/\bάφουμου\b/gi, "Α.Φ.Μ.");
    cleaned = cleaned.replace(/\bαφου\s+μου\b/gi, "Α.Φ.Μ.");
    cleaned = cleaned.replace(/\bέκανα\s+ένα\b/gi, "έκανα έναρξη");

    return cleaned;
}

export default function LiveAvatarVideoCallPage() {
    // Call States
    const [isCallActive, setIsCallActive] = useState<boolean>(false);
    const [isLoadingAvatar, setIsLoadingAvatar] = useState<boolean>(false);
    const [statusText, setStatusText] = useState<string>("Έτοιμο για εκκίνηση");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [hasNativeStream, setHasNativeStream] = useState<boolean>(false);
    
    // Chat visibility (hidden by default as requested)
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

    // Interactive White Container for AFM / Email Entry
    const [isAfmModalOpen, setIsAfmModalOpen] = useState<boolean>(false);
    const [afmInput, setAfmInput] = useState<string>("");
    const [emailInput, setEmailInput] = useState<string>("");
    const [isSubmittingAfm, setIsSubmittingAfm] = useState<boolean>(false);
    const [afmSuccess, setAfmSuccess] = useState<boolean>(false);
    
    // Controls States
    const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
    const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
    const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);

    // Call Timer
    const [callSeconds, setCallSeconds] = useState<number>(0);

    // Refs for Audio / Video
    const avatarVideoRef = useRef<HTMLVideoElement | null>(null);
    const sessionRef = useRef<any>(null);

    // User Camera Stream for PiP
    const userVideoRef = useRef<HTMLVideoElement | null>(null);
    const [hasUserMedia, setHasUserMedia] = useState<boolean>(false);

    // Chat Messages
    const [messages, setMessages] = useState<Message[]>([
        { 
            id: "1", 
            sender: "agent", 
            text: "Γεια σας! Είμαι ο Bryan (Μπράιαν), Senior Tech Expert της SGK Digital. Είμαι εδώ για να σας ενημερώσω για την υποχρεωτική ιστοσελίδα της ΙΚΕ σας για το ΓΕΜΗ.", 
            time: "3:00 μμ" 
        },
        { 
            id: "2", 
            sender: "user", 
            text: "Γεια σου Bryan! Τι ακριβώς προβλέπει ο νόμος για τις ΙΚΕ και ποιο είναι το κόστος;", 
            time: "3:02 μμ" 
        },
        { 
            id: "3", 
            sender: "agent", 
            text: "Βάσει του Ν.4072/2012, κάθε ΙΚΕ υποχρεούται εντός 30 ημερών να έχει ιστοσελίδα για δημοσίευση ισολογισμών. Στην SGK Digital την παραδίδουμε σε μόλις 24 ώρες με μόνο 150€ τελική τιμή με ΦΠΑ!", 
            time: "3:02 μμ" 
        },
        { 
            id: "4", 
            sender: "user", 
            text: "Τέλεια, θέλω να ξεκινήσουμε τη βιντεοκλήση να τα πούμε ζωντανά!", 
            time: "3:03 μμ" 
        }
    ]);
    const [inputText, setInputText] = useState("");
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCallActive) {
            interval = setInterval(() => {
                setCallSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCallActive]);

    const formatTimer = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
        const s = (totalSeconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    // Initialize User Webcam for PiP (if permitted)
    useEffect(() => {
        let stream: MediaStream | null = null;
        async function setupCamera() {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                    if (userVideoRef.current) {
                        userVideoRef.current.srcObject = stream;
                        setHasUserMedia(true);
                    }
                }
            } catch (err) {
                setHasUserMedia(false);
            }
        }
        setupCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Connect to LiveAvatar API & Initialize SDK WebRTC Session
    const handleStartCall = async () => {
        setIsLoadingAvatar(true);
        setStatusText("Προετοιμασία συνεδρίας & σύνδεση με Gemini...");

        try {
            // 1. Fetch Session Token & Embed Fallback
            const res = await fetch("/api/liveavatar/setup", {
                method: "POST"
            });
            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Αποτυχία εκκίνησης LiveAvatar");
            }

            if (data.url) {
                setAvatarUrl(data.url);
            }

            // 2. Try native WebRTC connection via @heygen/liveavatar-web-sdk
            if (data.sessionToken && typeof window !== "undefined") {
                try {
                    setStatusText("Σύνδεση Native WebRTC Stream...");
                    const { LiveAvatarSession, SessionEvent, AgentEventsEnum } = await import("@heygen/liveavatar-web-sdk");

                    const session = new LiveAvatarSession(data.sessionToken, {
                        autoKeepAlive: true
                    });
                    sessionRef.current = session;

                    // Stream Ready Event: Attach to native video tag
                    session.on(SessionEvent.SESSION_STREAM_READY, () => {
                        if (avatarVideoRef.current) {
                            session.attach(avatarVideoRef.current);
                            setHasNativeStream(true);
                        }
                    });

                    // Live Speech-to-Text from Avatar
                    session.on(AgentEventsEnum.AVATAR_TRANSCRIPTION, (evt: any) => {
                        if (evt?.text) {
                            const now = new Date();
                            const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                            setMessages(prev => [
                                ...prev,
                                { id: Date.now().toString(), sender: "agent", text: evt.text, time: timeStr }
                            ]);

                            // Auto trigger white modal when Bryan asks for AFM, email or mentions the box
                            const textLower = evt.text.toLowerCase();
                            if (
                                textLower.includes("αφμ") || 
                                textLower.includes("α.φ.μ.") || 
                                textLower.includes("email") || 
                                textLower.includes("κουτάκι") || 
                                textLower.includes("κουτι") || 
                                textLower.includes("στοιχεία")
                            ) {
                                setIsAfmModalOpen(true);
                            }
                        }
                    });

                    // Live Speech-to-Text from User's Voice
                    session.on(AgentEventsEnum.USER_TRANSCRIPTION, (evt: any) => {
                        if (evt?.text) {
                            const now = new Date();
                            const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                            const cleanedText = cleanGreekSTT(evt.text);
                            setMessages(prev => [
                                ...prev,
                                { id: Date.now().toString(), sender: "user", text: cleanedText, time: timeStr }
                            ]);
                        }
                    });

                    await session.start();
                    try {
                        await session.voiceChat.start();
                    } catch (vcErr) {
                        console.warn("Voice chat auto-start:", vcErr);
                    }
                } catch (sdkErr: any) {
                    console.warn("Native WebRTC SDK session error:", sdkErr);
                    const errMsg = sdkErr?.message || String(sdkErr);
                    sessionRef.current = null;
                    if (errMsg.toLowerCase().includes("credit") || errMsg.includes("403")) {
                        throw new Error("Εξαντλήθηκαν τα credits στο λογαριασμό σας στο LiveAvatar (No credits available). Χρειάζεται προσθήκη credits στο LiveAvatar Dashboard (app.liveavatar.com) για να εκκινήσει νέα ζωντανή κλήση.");
                    }
                }
            }

            setIsCallActive(true);
            setCallSeconds(1);
        } catch (err: any) {
            console.error("Failed to start LiveAvatar call:", err);
            setStatusText(err?.message || "Σφάλμα εκκίνησης");
            alert(err?.message || "Ελέγξτε τη σύνδεσή σας ή τα credits του LiveAvatar API.");
        } finally {
            setIsLoadingAvatar(false);
        }
    };

    const handleEndCall = async () => {
        setIsCallActive(false);
        setHasNativeStream(false);
        setAvatarUrl(null);
        setCallSeconds(0);

        if (sessionRef.current) {
            const activeSession = sessionRef.current;
            sessionRef.current = null;
            try {
                await activeSession.stop();
            } catch (e) {
                // Ignore session stop error if it was already closed or expired
            }
        }

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setMessages(prev => [
            ...prev,
            { 
                id: Date.now().toString(), 
                sender: "agent", 
                text: "Η κλήση τερματίστηκε. Μπορείτε να μου γράψετε στο chat αν χρειάζεστε κάποια άλλη πληροφορία για την ΙΚΕ σας!", 
                time: timeStr 
            }
        ]);
    };

    const handleToggleMic = async () => {
        const nextState = !isMicMuted;
        setIsMicMuted(nextState);

        if (sessionRef.current?.voiceChat) {
            try {
                if (nextState) {
                    await sessionRef.current.voiceChat.mute();
                } else {
                    await sessionRef.current.voiceChat.unmute();
                }
            } catch (err) {
                console.warn("Failed to toggle voiceChat mic:", err);
            }
        }
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const userText = inputText.trim();

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: "user",
            text: userText,
            time: timeStr
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText("");

        // If SDK session is active, send text message to avatar so it speaks the reply
        if (sessionRef.current && typeof sessionRef.current.message === "function") {
            try {
                sessionRef.current.message(userText);
            } catch (err) {
                console.warn("Error sending message to avatar session:", err);
            }
        } else {
            // Simulated fallback response if avatar session isn't live
            setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    {
                        id: (Date.now() + 1).toString(),
                        sender: "agent",
                        text: "Σας ακούω! Για την κατασκευή ιστοσελίδας της ΙΚΕ σας (150€ με ΦΠΑ), χρειαζόμαστε μόνο το ΑΦΜ σας και παραδίδεται σε 24 ώρες.",
                        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    }
                ]);
            }, 1200);
        }
    };

    const handleSubmitAfmModal = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedAfm = afmInput.trim();
        const trimmedEmail = emailInput.trim();
        if (!trimmedAfm && !trimmedEmail) return;

        setIsSubmittingAfm(true);
        setAfmSuccess(true);

        const promptSummary = [
            trimmedAfm ? `Το ΑΦΜ της εταιρείας μου είναι ${trimmedAfm}` : "",
            trimmedEmail ? `το email επικοινωνίας μου είναι ${trimmedEmail}` : ""
        ].filter(Boolean).join(" και ");

        const fullUserMessage = `Ορίστε τα στοιχεία μου: ${promptSummary}. Παρακαλώ επαναλάβετε και επιβεβαιώστε τα.`;

        // Add to transcript
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), sender: "user", text: fullUserMessage, time: timeStr }
        ]);

        // Send to Bryan session so he speaks it for verbal confirmation
        if (sessionRef.current && typeof sessionRef.current.message === "function") {
            try {
                sessionRef.current.message(fullUserMessage);
            } catch (err) {
                console.warn("Error sending AFM message to session:", err);
            }
        }

        // Auto close after 2.5s
        setTimeout(() => {
            setIsAfmModalOpen(false);
            setIsSubmittingAfm(false);
            setAfmSuccess(false);
        }, 2200);
    };

    return (
        <div className="w-full h-[100dvh] bg-[#0a0b0e] flex items-center justify-center p-0 sm:p-4 select-none font-sans overflow-hidden">
            {/* Main Window Frame Container (Full-screen on mobile, elegant window on desktop) */}
            <div className="w-full sm:max-w-[1440px] h-full sm:h-[96vh] sm:max-h-[880px] bg-[#14151b] rounded-none sm:rounded-[28px] overflow-hidden shadow-2xl border-0 sm:border-4 border-[#252630] flex relative">
                
                {/* Mobile Backdrop when Chat Drawer is Open */}
                {isChatOpen && (
                    <div 
                        onClick={() => setIsChatOpen(false)}
                        className="fixed sm:hidden inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
                    />
                )}

                {/* ================= SLIDE-IN OVERLAY DRAWER: CHAT (Hidden by default) ================= */}
                <div className={`fixed sm:absolute top-0 left-0 bottom-0 z-50 w-full sm:w-[380px] md:w-[400px] flex flex-col bg-white h-full border-r border-[#26272e] shadow-2xl transition-transform duration-300 ease-in-out ${
                    isChatOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
                }`}>
                    {/* Header */}
                    <div className="h-16 px-4 sm:px-5 bg-[#5b36f5] flex items-center justify-between text-white shadow-md flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-[#5b36f5] shadow-sm relative flex-shrink-0">
                                <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-sm sm:text-base font-semibold leading-tight tracking-wide flex items-center gap-1.5 truncate">
                                    Bryan (Tech Expert)
                                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-normal">AI Consultant</span>
                                </h2>
                                <span className="text-[11px] text-white/80 font-normal truncate block">Υπηρεσία Ιστοσελίδας Ι.Κ.Ε. (150€)</span>
                            </div>
                        </div>

                        {/* Close Chat Button */}
                        <button 
                            type="button"
                            onClick={() => setIsChatOpen(false)}
                            className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-white"
                            title="Απόκρυψη Chat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Quick Badge info */}
                    <div className="bg-slate-50 px-4 py-2 border-b border-gray-100 flex items-center justify-between text-[11px] text-gray-600 flex-shrink-0">
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold truncate">
                            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" /> Νόμος 4072/2012 Γ.Ε.ΜΗ.
                        </span>
                        <span className="font-bold text-[#5b36f5] flex-shrink-0">150€ • 24 Ώρες</span>
                    </div>

                    {/* Chat Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-white">
                        {messages.map((m) => (
                            <div 
                                key={m.id} 
                                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                            >
                                <span className="text-[10px] text-gray-400 font-medium mb-1 px-1">
                                    {m.time}
                                </span>
                                <div 
                                    className={`max-w-[85%] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-[13px] sm:text-[13.5px] leading-relaxed shadow-xs ${
                                        m.sender === "user"
                                            ? "bg-[#5b36f5] text-white rounded-tr-xs"
                                            : "bg-[#f1f3f6] text-[#1f2937] rounded-tl-xs"
                                    }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}

                        {/* Call Started System Pill */}
                        {isCallActive && (
                            <div className="text-center py-2 my-2">
                                <span className="text-[10px] text-gray-400 font-medium block">
                                    {formatTimer(callSeconds)}
                                </span>
                                <span className="inline-block mt-0.5 text-xs font-bold text-gray-900 tracking-wide bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                                    ● Ζωντανή Βιντεοκλήση σε εξέλιξη
                                </span>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input Bar */}
                    <form 
                        onSubmit={handleSendMessage}
                        className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 flex-shrink-0"
                    >
                        <input 
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ρωτήστε τον Bryan για την ΙΚΕ σας..."
                            className="flex-1 text-sm bg-gray-50 rounded-full py-2 px-3.5 outline-none text-gray-800 placeholder-gray-400 focus:bg-gray-100"
                        />
                        
                        <button 
                            type="submit" 
                            disabled={!inputText.trim()}
                            className="p-2 rounded-full bg-[#5b36f5] text-white hover:bg-[#4927d6] disabled:bg-gray-200 disabled:text-gray-400 transition-colors flex-shrink-0"
                            title="Αποστολή"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>

                {/* ================= MAIN VIDEO CALL STAGE (Full screen / Responsive) ================= */}
                <div className="flex-1 w-full h-full relative bg-[#13141a] overflow-hidden flex items-center justify-center">
                    
                    {/* Top Right Header Controls Overlay */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-5 z-30 flex items-center gap-2 sm:gap-3 text-white/90">
                        {isCallActive && (
                            <div className="text-xs sm:text-sm font-medium tracking-wider text-emerald-400 font-mono bg-black/50 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 sm:gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                {formatTimer(callSeconds)}
                            </div>
                        )}

                        {isCallActive && (
                            <button 
                                onClick={() => setIsAfmModalOpen(!isAfmModalOpen)}
                                className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
                                    isAfmModalOpen 
                                        ? "bg-white text-[#5b36f5] border-white shadow-white/20" 
                                        : "bg-white/90 hover:bg-white text-gray-900 border-white/60 hover:scale-105 active:scale-95"
                                }`}
                                title="Συμπλήρωση ΑΦΜ ή Email"
                            >
                                <Building2 className="w-3.5 h-3.5 text-[#5b36f5]" />
                                <span>ΑΦΜ / Email</span>
                            </button>
                        )}

                        <button 
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all shadow-md ${
                                isChatOpen 
                                    ? "bg-[#5b36f5] border-[#5b36f5] text-white" 
                                    : "bg-black/50 backdrop-blur-md border-white/20 text-white/90 hover:text-white hover:border-white/40"
                            }`}
                            title="Συνομιλία / Chat"
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="hidden xs:inline">Chat</span>
                        </button>
                    </div>

                    {/* ================= WHITE INTERACTIVE CONTAINER (AFM / EMAIL) ================= */}
                    {isAfmModalOpen && (
                        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
                            <div className="w-full max-w-[420px] bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
                                {/* Close Button */}
                                <button
                                    type="button"
                                    onClick={() => setIsAfmModalOpen(false)}
                                    className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                    title="Κλείσιμο"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5b36f5] flex-shrink-0">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <div className="pr-6">
                                        <h3 className="text-base font-bold text-gray-900 leading-tight">
                                            Στοιχεία Ι.Κ.Ε. για το Γ.Ε.ΜΗ.
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Γράψτε το ΑΦΜ ή το Email σας και ο Bryan θα τα επιβεβαιώσει ζωντανά
                                        </p>
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmitAfmModal} className="space-y-3.5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            Α.Φ.Μ. Εταιρείας (9 ψηφία)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={9}
                                                value={afmInput}
                                                onChange={(e) => setAfmInput(e.target.value.replace(/\D/g, ""))}
                                                placeholder="π.χ. 998877665"
                                                className="w-full text-base font-mono tracking-wider bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#5b36f5] focus:ring-2 focus:ring-[#5b36f5]/20 transition-all"
                                                autoFocus
                                            />
                                            {afmInput.length === 9 && (
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                    ✓ 9 ψηφία
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            Email Επικοινωνίας
                                        </label>
                                        <input
                                            type="email"
                                            value={emailInput}
                                            onChange={(e) => setEmailInput(e.target.value)}
                                            placeholder="π.χ. info@mycompany.gr"
                                            className="w-full text-sm bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#5b36f5] focus:ring-2 focus:ring-[#5b36f5]/20 transition-all"
                                        />
                                    </div>

                                    <div className="pt-1">
                                        <button
                                            type="submit"
                                            disabled={(!afmInput.trim() && !emailInput.trim()) || isSubmittingAfm}
                                            className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                                                afmSuccess
                                                    ? "bg-emerald-600 text-white shadow-emerald-500/20"
                                                    : "bg-[#5b36f5] hover:bg-[#4927d6] text-white shadow-indigo-500/30"
                                            }`}
                                        >
                                            {afmSuccess ? (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                    <span>Εστάλη στον Bryan! Επιβεβαιώνει...</span>
                                                </>
                                            ) : isSubmittingAfm ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Αποστολή...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Επιβεβαίωση & Αποστολή</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-gray-400 text-center">
                                        🔒 Ασφαλής καταχώρηση για δήλωση στο Γ.Ε.ΜΗ. και παράδοση σε 24 ώρες.
                                    </p>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Main Video Stream Container */}
                    <div className="w-full h-full relative flex items-center justify-center bg-black">
                        {/* Native WebRTC Video Element (Bound via SDK) */}
                        <video 
                            ref={avatarVideoRef}
                            autoPlay 
                            playsInline 
                            className={`w-full h-full avatar-video-responsive transition-opacity duration-500 ${hasNativeStream ? "opacity-100" : "hidden opacity-0"}`}
                        />

                        {/* Iframe Fallback */}
                        {isCallActive && !hasNativeStream && avatarUrl && (
                            <iframe 
                                src={avatarUrl}
                                allow="microphone; camera; display-capture; autoplay"
                                className="w-full h-full border-none object-cover"
                            />
                        )}

                        {/* Call Active but connecting state */}
                        {isCallActive && !hasNativeStream && !avatarUrl && (
                            <div className="text-center p-6 sm:p-8 space-y-4 max-w-sm">
                                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#5b36f5] animate-spin mx-auto" />
                                <h3 className="text-base sm:text-lg font-medium text-white">{statusText}</h3>
                                <p className="text-xs text-white/60">Σύνδεση με Live Video WebRTC...</p>
                            </div>
                        )}

                        {/* Call Inactive / Standby Screen (Pure Video Avatar, No marketing text overlays) */}
                        {!isCallActive && (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Photorealistic Avatar Background Preview */}
                                <img 
                                    src="https://files2.heygen.ai/avatar/v3/33c9ac4aead44dfc8bc0082a35062a70_45580/preview_talk_3.webp" 
                                    alt="Bryan - Tech Expert" 
                                    className="w-full h-full avatar-video-responsive"
                                />

                                {/* Center Clean Start Call Button */}
                                <div className="absolute z-20 flex flex-col items-center text-center px-4">
                                    <button
                                        onClick={handleStartCall}
                                        disabled={isLoadingAvatar}
                                        className="px-8 py-4 sm:px-10 sm:py-4.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base sm:text-lg flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        {isLoadingAvatar ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                <span>Σύνδεση...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Phone className="w-6 h-6 fill-current" />
                                                <span>Έναρξη Video Call</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ================= BOTTOM FLOATING ACTION BAR ================= */}
                    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 bg-black/60 backdrop-blur-md px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/10 shadow-2xl">
                        {/* Mic Button */}
                        <button 
                            onClick={handleToggleMic}
                            className={`p-2.5 sm:p-3 rounded-full transition-all ${
                                isMicMuted 
                                    ? "bg-red-500/80 hover:bg-red-600 text-white" 
                                    : "bg-white/15 hover:bg-white/25 text-white"
                            }`}
                            title={isMicMuted ? "Ενεργοποίηση μικροφώνου" : "Σίγαση μικροφώνου"}
                        >
                            {isMicMuted ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>

                        {/* Camera Button */}
                        <button 
                            onClick={() => setIsVideoOff(!isVideoOff)}
                            className={`p-2.5 sm:p-3 rounded-full transition-all ${
                                isVideoOff 
                                    ? "bg-red-500/80 hover:bg-red-600 text-white" 
                                    : "bg-white/15 hover:bg-white/25 text-white"
                            }`}
                            title={isVideoOff ? "Ενεργοποίηση κάμερας" : "Απενεργοποίηση κάμερας"}
                        >
                            {isVideoOff ? <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>

                        {/* Screen Share Button (Desktop only) */}
                        <button 
                            onClick={() => setIsScreenSharing(!isScreenSharing)}
                            className={`hidden sm:flex p-2.5 sm:p-3 rounded-full transition-all ${
                                isScreenSharing 
                                    ? "bg-cyan-500/80 hover:bg-cyan-600 text-white" 
                                    : "bg-white/15 hover:bg-white/25 text-white"
                            }`}
                            title="Διαμοιρασμός οθόνης"
                        >
                            <ScreenShare className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        {/* Chat Toggle Button */}
                        <button 
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            className={`p-2.5 sm:p-3 rounded-full transition-all relative ${
                                isChatOpen 
                                    ? "bg-[#5b36f5] text-white shadow-lg shadow-indigo-500/40" 
                                    : "bg-white/15 hover:bg-white/25 text-white"
                            }`}
                            title={isChatOpen ? "Απόκρυψη Chat" : "Εμφάνιση Chat"}
                        >
                            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                            {!isChatOpen && messages.length > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
                            )}
                        </button>

                        {/* Red Hangup / Green Start Button */}
                        {isCallActive ? (
                            <button 
                                onClick={handleEndCall}
                                className="p-3 sm:p-3.5 rounded-full bg-[#eb4335] hover:bg-[#d63b2f] text-white shadow-lg shadow-red-500/40 hover:scale-105 active:scale-95 transition-all"
                                title="Τερματισμός κλήσης"
                            >
                                <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        ) : (
                            <button 
                                onClick={handleStartCall}
                                className="p-3 sm:p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all"
                                title="Έναρξη κλήσης"
                            >
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        )}
                    </div>

                    {/* ================= PiP (User Camera: top-left on mobile, bottom-right on desktop) ================= */}
                    <div className="absolute top-3 left-3 sm:top-auto sm:left-auto sm:bottom-6 sm:right-6 z-20 w-24 sm:w-44 aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-[#1e2029]">
                        {hasUserMedia && !isVideoOff ? (
                            <video 
                                ref={userVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover -scale-x-100"
                            />
                        ) : (
                            <img 
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop" 
                                alt="Εσείς" 
                                className="w-full h-full object-cover"
                            />
                        )}

                        {/* Bottom Overlay Label */}
                        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 flex items-center gap-1 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-md">
                            {!isMicMuted && (
                                <div className="flex items-center gap-0.5">
                                    <span className="w-0.5 h-1.5 sm:h-2 bg-cyan-400 rounded-full animate-pulse" />
                                    <span className="w-0.5 h-2.5 sm:h-3 bg-cyan-400 rounded-full animate-pulse delay-75" />
                                    <span className="w-0.5 h-1 sm:h-1.5 bg-cyan-400 rounded-full animate-pulse delay-150" />
                                </div>
                            )}
                            <span className="text-[9px] sm:text-[10px] font-medium text-white/90">
                                Εσείς
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
