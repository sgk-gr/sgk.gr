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
    AlertCircle,
    FileText,
    Mail
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
    cleaned = cleaned.replace(/\bάφημή\b/gi, "Α.Φ.Μ.");
    cleaned = cleaned.replace(/\bάφημη\b/gi, "Α.Φ.Μ.");
    cleaned = cleaned.replace(/\bαφημη\b/gi, "Α.Φ.Μ.");
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

    // Compact single-purpose input: null | "afm" | "email"
    const [activePromptInput, setActivePromptInput] = useState<"afm" | "email" | null>(null);
    const [afmInput, setAfmInput] = useState<string>("");
    const [emailInput, setEmailInput] = useState<string>("");
    const [isSubmittingInput, setIsSubmittingInput] = useState<boolean>(false);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
    const [gemiStatus, setGemiStatus] = useState<"idle" | "searching" | "found" | "not_found">("idle");
    const [foundCompanyName, setFoundCompanyName] = useState<string>("");
    
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

                            // Auto trigger specific compact input when Bryan asks for AFM or Email
                            const textLower = evt.text.toLowerCase();
                            if (textLower.includes("αφμ") || textLower.includes("α.φ.μ.") || textLower.includes("φορολογικ")) {
                                setActivePromptInput("afm");
                            } else if (textLower.includes("email") || textLower.includes("e-mail") || textLower.includes("ταχυδρομεί")) {
                                setActivePromptInput("email");
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
                    try {
                        await session.stop().catch(() => {});
                    } catch (_) {}
                    if (errMsg.toLowerCase().includes("credit") || errMsg.includes("403")) {
                        throw new Error("Εξαντλήθηκαν τα credits στο λογαριασμό σας στο LiveAvatar (Insufficient credits). Χρειάζεται προσθήκη/ανανέωση credits στο LiveAvatar Dashboard (app.liveavatar.com) για να ξεκινήσει νέα ζωντανή κλήση.");
                    }
                    throw new Error(errMsg);
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

    const handleSubmitSingleInput = async (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        if (activePromptInput === "afm") {
            const trimmedAfm = afmInput.trim();
            if (!trimmedAfm || trimmedAfm.length < 9) return;

            setIsSubmittingInput(true);
            setGemiStatus("searching");

            let resolvedCompanyName = "";

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                const res = await fetch(`/api/gemi-lookup?query=${encodeURIComponent(trimmedAfm)}&quick=true`, {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.company) {
                        resolvedCompanyName = (data.company.companyName || data.company.tradeName || "").trim();
                    }
                }
            } catch (err) {
                console.warn("GEMI lookup error or timeout:", err);
            }

            if (resolvedCompanyName) {
                setFoundCompanyName(resolvedCompanyName);
                setGemiStatus("found");
                setSubmitSuccess(true);

                const userDisplayMsg = `Βρέθηκε στο ΓΕΜΗ: ${resolvedCompanyName} (ΑΦΜ: ${trimmedAfm})`;
                setMessages(prev => [
                    ...prev,
                    { id: Date.now().toString(), sender: "user", text: userDisplayMsg, time: timeStr }
                ]);

                // Prompt Bryan to say: «Ωραία, βρήκα την εταιρεία [Όνομα Εταιρείας]!...»
                const avatarMsg = `Βρήκα την εταιρεία μου στο ΓΕΜΗ: ${resolvedCompanyName} με ΑΦΜ ${trimmedAfm}. Παρακαλώ επιβεβαιώστε την.`;
                if (sessionRef.current && typeof sessionRef.current.message === "function") {
                    try {
                        sessionRef.current.message(avatarMsg);
                    } catch (err) {
                        console.warn("Error sending AFM/GEMI message to avatar:", err);
                    }
                }

                // Seamlessly transition to email input after 2.2 seconds
                setTimeout(() => {
                    setActivePromptInput("email");
                    setIsSubmittingInput(false);
                    setSubmitSuccess(false);
                    setGemiStatus("idle");
                }, 2200);

            } else {
                setGemiStatus("not_found");
                setIsSubmittingInput(false);
                setSubmitSuccess(false);

                const userMsg = `Πληκτρολόγησα το ΑΦΜ ${trimmedAfm}, αλλά δεν βρέθηκε εταιρεία στο ΓΕΜΗ.`;
                setMessages(prev => [
                    ...prev,
                    { id: Date.now().toString(), sender: "user", text: userMsg, time: timeStr }
                ]);

                if (sessionRef.current && typeof sessionRef.current.message === "function") {
                    try {
                        sessionRef.current.message(userMsg);
                    } catch (err) {
                        console.warn("Error sending AFM not-found message:", err);
                    }
                }
            }
        } else if (activePromptInput === "email") {
            const trimmedEmail = emailInput.trim();
            if (!trimmedEmail) return;

            setIsSubmittingInput(true);
            setSubmitSuccess(true);

            const userMsg = `Ορίστε το email επικοινωνίας μου: ${trimmedEmail}. Παρακαλώ επιβεβαιώστε το.`;

            setMessages(prev => [
                ...prev,
                { id: Date.now().toString(), sender: "user", text: userMsg, time: timeStr }
            ]);

            if (sessionRef.current && typeof sessionRef.current.message === "function") {
                try {
                    sessionRef.current.message(userMsg);
                } catch (err) {
                    console.warn("Error sending Email message:", err);
                }
            }

            setTimeout(() => {
                setActivePromptInput(null);
                setIsSubmittingInput(false);
                setSubmitSuccess(false);
            }, 1800);
        }
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
                            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10">
                                <button 
                                    onClick={() => setActivePromptInput(activePromptInput === "afm" ? null : "afm")}
                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                                        activePromptInput === "afm" 
                                            ? "bg-[#5b36f5] text-white shadow-md shadow-indigo-500/40" 
                                            : "text-white/80 hover:text-white hover:bg-white/10"
                                    }`}
                                    title="Συμπλήρωση ΑΦΜ"
                                >
                                    <Building2 className="w-3 h-3 text-cyan-400" />
                                    <span>ΑΦΜ</span>
                                </button>
                                <button 
                                    onClick={() => setActivePromptInput(activePromptInput === "email" ? null : "email")}
                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                                        activePromptInput === "email" 
                                            ? "bg-[#5b36f5] text-white shadow-md shadow-indigo-500/40" 
                                            : "text-white/80 hover:text-white hover:bg-white/10"
                                    }`}
                                    title="Συμπλήρωση Email"
                                >
                                    <Mail className="w-3 h-3 text-amber-400" />
                                    <span>Email</span>
                                </button>
                            </div>
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

                    {/* ================= COMPACT MINI-INPUT: AFM ONLY ================= */}
                    {activePromptInput === "afm" && (
                        <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[340px] sm:max-w-[360px] bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-slate-200/80 animate-in fade-in slide-in-from-bottom-3 duration-200">
                            <div className="flex items-center justify-between mb-2 px-0.5">
                                <span className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-[#5b36f5]" />
                                    Α.Φ.Μ. Εταιρείας (9 ψηφία)
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setActivePromptInput(null)}
                                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                    title="Κλείσιμο"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmitSingleInput} className="flex items-center gap-1.5">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={9}
                                    value={afmInput}
                                    onChange={(e) => {
                                        setAfmInput(e.target.value.replace(/\D/g, ""));
                                        if (gemiStatus === "not_found") setGemiStatus("idle");
                                    }}
                                    placeholder="π.χ. 998877665"
                                    disabled={isSubmittingInput}
                                    className="flex-1 min-w-0 text-sm font-mono tracking-wider bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 outline-none text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#5b36f5] focus:ring-2 focus:ring-[#5b36f5]/20 disabled:opacity-60"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={afmInput.trim().length < 9 || isSubmittingInput}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                        submitSuccess
                                            ? "bg-emerald-600 text-white"
                                            : "bg-[#5b36f5] hover:bg-[#4927d6] text-white shadow-sm"
                                    }`}
                                >
                                    {gemiStatus === "searching" ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                                    ) : submitSuccess ? (
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    ) : (
                                        <span>ΟΚ</span>
                                    )}
                                </button>
                            </form>

                            {/* Live GEMI Lookup State Indicator */}
                            {gemiStatus === "searching" && (
                                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#5b36f5] font-medium px-1">
                                    <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" />
                                    <span>Αναζήτηση εταιρείας στο Γ.Ε.ΜΗ...</span>
                                </div>
                            )}
                            {gemiStatus === "found" && foundCompanyName && (
                                <div className="mt-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5 animate-in fade-in">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                    <span className="font-semibold truncate">{foundCompanyName}</span>
                                </div>
                            )}
                            {gemiStatus === "not_found" && (
                                <div className="mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-1.5 animate-in fade-in">
                                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                    <span>Δεν βρέθηκε στο Γ.Ε.ΜΗ. Ελέγξτε αν κάνατε λάθος.</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ================= COMPACT MINI-INPUT: EMAIL ONLY ================= */}
                    {activePromptInput === "email" && (
                        <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[340px] sm:max-w-[360px] bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-slate-200/80 animate-in fade-in slide-in-from-bottom-3 duration-200">
                            <div className="flex items-center justify-between mb-2 px-0.5">
                                <span className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-[#5b36f5]" />
                                    Email Επικοινωνίας
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setActivePromptInput(null)}
                                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                    title="Κλείσιμο"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmitSingleInput} className="flex items-center gap-1.5">
                                <input
                                    type="email"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    placeholder="info@company.gr"
                                    className="flex-1 min-w-0 text-sm bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 outline-none text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#5b36f5] focus:ring-2 focus:ring-[#5b36f5]/20"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!emailInput.trim().includes("@") || isSubmittingInput}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                        submitSuccess
                                            ? "bg-emerald-600 text-white"
                                            : "bg-[#5b36f5] hover:bg-[#4927d6] text-white shadow-sm"
                                    }`}
                                >
                                    {submitSuccess ? (
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    ) : (
                                        <span>ΟΚ</span>
                                    )}
                                </button>
                            </form>
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
                                    src="https://files2.heygen.ai/avatar/v3/a3fdb0c652024f79984aaec11ebf2694_34350/preview_target.webp" 
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
                    <div className="absolute top-3 left-3 sm:top-auto sm:left-auto sm:bottom-6 sm:right-6 z-20 w-24 sm:w-44 aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black">
                        {hasUserMedia && !isVideoOff ? (
                            <video 
                                ref={userVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover -scale-x-100"
                            />
                        ) : (
                            <div className="w-full h-full bg-black flex flex-col items-center justify-center text-center p-2 select-none">
                                <VideoOff className="w-4 h-4 sm:w-6 sm:h-6 text-white/30 mb-1" />
                                <span className="text-[8px] sm:text-[10px] font-bold tracking-widest text-white/50 uppercase">
                                    No Camera
                                </span>
                            </div>
                        )}

                        {/* Top-Right Muted Badge */}
                        {isMicMuted && (
                            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1 rounded-full bg-red-500/90 text-white shadow-md">
                                <MicOff className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            </div>
                        )}

                        {/* Bottom Overlay Label */}
                        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 flex items-center gap-1 bg-black/75 backdrop-blur-xs px-1.5 sm:px-2 py-0.5 rounded-md border border-white/10">
                            {isMicMuted ? (
                                <MicOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400" />
                            ) : (
                                <div className="flex items-center gap-0.5">
                                    <span className="w-0.5 h-1.5 sm:h-2 bg-cyan-400 rounded-full animate-pulse" />
                                    <span className="w-0.5 h-2.5 sm:h-3 bg-cyan-400 rounded-full animate-pulse delay-75" />
                                    <span className="w-0.5 h-1 sm:h-1.5 bg-cyan-400 rounded-full animate-pulse delay-150" />
                                </div>
                            )}
                            <span className="text-[9px] sm:text-[10px] font-medium text-white/90">
                                Εσείς
                            </span>
                            {isMicMuted && (
                                <span className="text-[8px] text-red-400 font-semibold ml-0.5 hidden xs:inline">
                                    (Σίγαση)
                                </span>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
