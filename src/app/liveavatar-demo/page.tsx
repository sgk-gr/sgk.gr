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
    MoreVertical, 
    Settings, 
    Maximize2, 
    Paperclip, 
    Smile, 
    Send, 
    X, 
    Bot, 
    Sparkles, 
    ExternalLink, 
    Loader2,
    ShieldCheck,
    FileText
} from "lucide-react";
import Link from "next/link";

interface Message {
    id: string;
    sender: "agent" | "user";
    text: string;
    time: string;
}

export default function LiveAvatarVideoCallPage() {
    // Call States
    const [isCallActive, setIsCallActive] = useState<boolean>(false);
    const [isLoadingAvatar, setIsLoadingAvatar] = useState<boolean>(false);
    const [statusText, setStatusText] = useState<string>("Έτοιμο για εκκίνηση");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [hasNativeStream, setHasNativeStream] = useState<boolean>(false);
    
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
            text: "Γεια σας! Είμαι η Έλενα από την SGK Digital. Είμαι εδώ για να σας ενημερώσω για την υποχρεωτική ιστοσελίδα της ΙΚΕ σας για το ΓΕΜΗ.", 
            time: "3:00 μμ" 
        },
        { 
            id: "2", 
            sender: "user", 
            text: "Γεια σου Έλενα! Τι ακριβώς προβλέπει ο νόμος για τις ΙΚΕ και ποιο είναι το κόστος;", 
            time: "3:02 μμ" 
        },
        { 
            id: "3", 
            sender: "agent", 
            text: "Βάσει του Ν.4072/2012, κάθε ΙΚΕ υποχρεούται εντός 30 ημερών να έχει ιστοσελίδα για δημοσίευση ισολογισμών. Στην SGK Digital την παραδίδουμε σε 24 ώρες με μόνο 150€ τελική τιμή με ΦΠΑ!", 
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
                        }
                    });

                    // Live Speech-to-Text from User's Voice
                    session.on(AgentEventsEnum.USER_TRANSCRIPTION, (evt: any) => {
                        if (evt?.text) {
                            const now = new Date();
                            const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                            setMessages(prev => [
                                ...prev,
                                { id: Date.now().toString(), sender: "user", text: evt.text, time: timeStr }
                            ]);
                        }
                    });

                    await session.start();
                    try {
                        await session.voiceChat.start();
                    } catch (vcErr) {
                        console.warn("Voice chat auto-start:", vcErr);
                    }
                } catch (sdkErr) {
                    console.warn("Native WebRTC SDK fallback to iframe:", sdkErr);
                }
            }

            setIsCallActive(true);
            setCallSeconds(1);
        } catch (err: any) {
            console.error("Failed to start LiveAvatar call:", err);
            alert(`Σφάλμα εκκίνησης: ${err?.message || "Ελέγξτε τη σύνδεσή σας"}`);
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
            try {
                await sessionRef.current.stop();
            } catch (e) {
                console.error("Error stopping session:", e);
            }
            sessionRef.current = null;
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

    return (
        <div className="w-full h-screen bg-[#0a0b0e] flex items-center justify-center p-2 sm:p-4 select-none font-sans overflow-hidden">
            {/* Main Window Frame Container */}
            <div className="w-full max-w-[1440px] h-[96vh] max-h-[880px] bg-[#14151b] rounded-[28px] overflow-hidden shadow-2xl border-4 border-[#252630] flex flex-col md:flex-row relative">
                
                {/* ================= LEFT PANEL: CHAT ================= */}
                <div className="w-full md:w-[360px] lg:w-[400px] xl:w-[420px] flex-shrink-0 flex flex-col bg-white h-full border-r border-[#26272e] z-10">
                    {/* Header */}
                    <div className="h-16 px-5 bg-[#5b36f5] flex items-center justify-between text-white shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5b36f5] shadow-sm relative">
                                <Bot className="w-6 h-6" />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold leading-tight tracking-wide flex items-center gap-1.5">
                                    Έλενα (Elenora)
                                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-normal">AI Specialist</span>
                                </h2>
                                <span className="text-[11px] text-white/80 font-normal">Υπηρεσία Ιστοσελίδας Ι.Κ.Ε. (150€)</span>
                            </div>
                        </div>

                        <Link 
                            href="/ike-offer" 
                            className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/90 hover:text-white"
                            title="Προσφορά ΙΚΕ 150€"
                        >
                            <X className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Quick Badge info */}
                    <div className="bg-slate-50 px-4 py-2 border-b border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5" /> Νόμος 4072/2012 Γ.Ε.ΜΗ.
                        </span>
                        <span className="font-bold text-[#5b36f5]">150€ Τελική Τιμή • 24 Ώρες</span>
                    </div>

                    {/* Chat Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white">
                        {messages.map((m) => (
                            <div 
                                key={m.id} 
                                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                            >
                                <span className="text-[10px] text-gray-400 font-medium mb-1 px-1">
                                    {m.time}
                                </span>
                                <div 
                                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm ${
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
                                    3:04 μμ
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
                        className="px-4 py-3 bg-white border-t border-gray-100 flex items-center gap-2"
                    >
                        <input 
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ρωτήστε την Έλενα για την ΙΚΕ σας..."
                            className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 px-1"
                        />
                        
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <button 
                                type="button" 
                                className="p-1.5 hover:text-gray-600 transition-colors"
                                title="Επισύναψη αρχείου / ισολογισμού"
                            >
                                <Paperclip className="w-4 h-4" />
                            </button>
                            <button 
                                type="button" 
                                className="p-1.5 hover:text-gray-600 transition-colors"
                                title="Emoji"
                            >
                                <Smile className="w-4 h-4" />
                            </button>
                            <button 
                                type="submit" 
                                disabled={!inputText.trim()}
                                className="p-1.5 text-[#5b36f5] hover:text-[#4927d6] disabled:text-gray-300 transition-colors"
                                title="Αποστολή"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* ================= RIGHT PANEL: VIDEO CALL ================= */}
                <div className="flex-1 h-full relative bg-[#13141a] overflow-hidden flex items-center justify-center">
                    
                    {/* Top Right Header Controls Overlay */}
                    <div className="absolute top-4 right-5 z-30 flex items-center gap-3.5 text-white/90">
                        {isCallActive && (
                            <div className="text-sm font-medium tracking-wider text-emerald-400 font-mono bg-black/40 backdrop-blur-sm px-3 py-1 rounded-md border border-emerald-500/30 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                {formatTimer(callSeconds)}
                            </div>
                        )}
                        <button 
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                            title="Picture in picture"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                        <button 
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                            title="Ρυθμίσεις"
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                        <button 
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                            title="Επιλογές"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Top Left Status / Direct fullscreen button */}
                    <div className="absolute top-4 left-5 z-30 flex items-center gap-2">
                        {avatarUrl && (
                            <a 
                                href={avatarUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[11px] text-white/90 hover:text-white hover:border-white/40 transition-all shadow-md"
                            >
                                <span>Άνοιγμα σε Fullscreen</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>

                    {/* Main Video Stream Container */}
                    <div className="w-full h-full relative flex items-center justify-center bg-black">
                        {/* Native WebRTC Video Element (Bound via SDK) */}
                        <video 
                            ref={avatarVideoRef}
                            autoPlay 
                            playsInline 
                            className={`w-full h-full object-cover transition-opacity duration-500 ${hasNativeStream ? "opacity-100" : "hidden opacity-0"}`}
                        />

                        {/* Iframe Fallback (if native stream not ready yet but avatarUrl available) */}
                        {isCallActive && !hasNativeStream && avatarUrl && (
                            <iframe 
                                src={avatarUrl}
                                allow="microphone; camera; display-capture; autoplay"
                                className="w-full h-full border-none object-cover"
                            />
                        )}

                        {/* Call Active but connecting state */}
                        {isCallActive && !hasNativeStream && !avatarUrl && (
                            <div className="text-center p-8 space-y-4">
                                <Loader2 className="w-12 h-12 text-[#5b36f5] animate-spin mx-auto" />
                                <h3 className="text-lg font-medium text-white">{statusText}</h3>
                                <p className="text-xs text-white/60">Σύνδεση με AI Video WebRTC...</p>
                            </div>
                        )}

                        {/* Call Inactive / Standby Screen */}
                        {!isCallActive && (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Photorealistic Avatar Background Preview */}
                                <img 
                                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1600&auto=format&fit=crop" 
                                    alt="Elena - IKE AI Specialist" 
                                    className="w-full h-full object-cover filter brightness-[0.88]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />

                                {/* Center Start Call CTA */}
                                <div className="absolute z-20 flex flex-col items-center text-center px-4 max-w-lg">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
                                        <Sparkles className="w-3.5 h-3.5" /> Ζωντανή AI Ενημέρωση Ι.Κ.Ε.
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                                        Μιλήστε ζωντανά με την Έλενα
                                    </h2>
                                    <p className="text-sm text-slate-300 font-light mb-6 leading-relaxed">
                                        Ενημερωθείτε άμεσα μέσω video chat για την υποχρεωτική ιστοσελίδα της ΙΚΕ σας στο ΓΕΜΗ (150€, παράδοση σε 24 ώρες).
                                    </p>

                                    <button
                                        onClick={handleStartCall}
                                        disabled={isLoadingAvatar}
                                        className="px-8 py-4 rounded-full bg-[#5b36f5] hover:bg-[#4d2bd9] text-white font-semibold text-sm flex items-center gap-3 shadow-2xl shadow-indigo-500/60 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        {isLoadingAvatar ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Σύνδεση με Live WebRTC...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Phone className="w-5 h-5 fill-current" />
                                                <span>Έναρξη Video Call με AI</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ================= BOTTOM FLOATING ACTION BAR ================= */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-black/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-2xl">
                        {/* Mic Button */}
                        <button 
                            onClick={handleToggleMic}
                            className={`p-3 rounded-full transition-all ${
                                isMicMuted 
                                    ? "bg-red-500/80 hover:bg-red-600 text-white" 
                                    : "bg-white/15 hover:bg-white/25 text-white"
                            }`}
                            title={isMicMuted ? "Ενεργοποίηση μικροφώνου" : "Σίγαση μικροφώνου"}
                        >
                            {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>

                        {/* Camera Button */}
                        <button 
                            onClick={() => setIsVideoOff(!isVideoOff)}
                            className={`p-3 rounded-full transition-all ${
                                isVideoOff 
                                    ? "bg-red-500/80 hover:bg-red-600 text-white" 
                                    : "bg-white/15 hover:bg-white/25 text-white"
                            }`}
                            title={isVideoOff ? "Ενεργοποίηση κάμερας" : "Απενεργοποίηση κάμερας"}
                        >
                            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
                        </button>

                        {/* Screen Share Button */}
                        <button 
                            onClick={() => setIsScreenSharing(!isScreenSharing)}
                            className={`p-3 rounded-full transition-all ${
                                isScreenSharing 
                                    ? "bg-cyan-500/80 hover:bg-cyan-600 text-white" 
                                    : "bg-white/15 hover:bg-white/25 text-white"
                            }`}
                            title="Διαμοιρασμός οθόνης"
                        >
                            <ScreenShare className="w-5 h-5" />
                        </button>

                        {/* Red Hangup / Green Start Button */}
                        {isCallActive ? (
                            <button 
                                onClick={handleEndCall}
                                className="p-3.5 rounded-full bg-[#eb4335] hover:bg-[#d63b2f] text-white shadow-lg shadow-red-500/40 hover:scale-105 active:scale-95 transition-all"
                                title="Τερματισμός κλήσης"
                            >
                                <PhoneOff className="w-5 h-5" />
                            </button>
                        ) : (
                            <button 
                                onClick={handleStartCall}
                                className="p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all"
                                title="Έναρξη κλήσης"
                            >
                                <Phone className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* ================= BOTTOM RIGHT PiP (User Camera) ================= */}
                    <div className="absolute bottom-6 right-6 z-20 w-40 sm:w-48 aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-[#1e2029]">
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
                        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                            {!isMicMuted && (
                                <div className="flex items-center gap-0.5">
                                    <span className="w-0.5 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                    <span className="w-0.5 h-3 bg-cyan-400 rounded-full animate-pulse delay-75" />
                                    <span className="w-0.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-150" />
                                </div>
                            )}
                            <span className="text-[10px] font-medium text-white/90">
                                Εσείς (Επισκέπτης)
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
