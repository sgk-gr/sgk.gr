"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
    Mic, 
    MicOff, 
    Video as VideoIcon, 
    VideoOff, 
    ScreenShare, 
    PhoneOff, 
    Phone, 
    Send, 
    X, 
    Bot, 
    Loader2,
    ShieldCheck,
    MessageSquare,
    Sparkles,
    ArrowLeft
} from "lucide-react";

interface Message {
    id: string;
    sender: "agent" | "user";
    text: string;
    time: string;
}

export default function LiveAvatarAgentDemoPage() {
    // Call States
    const [isCallActive, setIsCallActive] = useState<boolean>(false);
    const [isLoadingAvatar, setIsLoadingAvatar] = useState<boolean>(false);
    const [statusText, setStatusText] = useState<string>("Έτοιμο για εκκίνηση");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [hasNativeStream, setHasNativeStream] = useState<boolean>(false);
    
    // Chat visibility
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState<string>("");

    // User Media (Camera & Mic)
    const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
    const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
    const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
    const [hasUserMedia, setHasUserMedia] = useState<boolean>(false);

    // Call duration timer
    const [callSeconds, setCallSeconds] = useState<number>(0);

    // Refs
    const userVideoRef = useRef<HTMLVideoElement | null>(null);
    const avatarVideoRef = useRef<HTMLVideoElement | null>(null);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const sessionRef = useRef<any>(null);

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
        } else {
            setCallSeconds(0);
        }
        return () => clearInterval(interval);
    }, [isCallActive]);

    // Initialize user camera
    useEffect(() => {
        let stream: MediaStream | null = null;
        async function setupCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
                    audio: true
                });
                if (userVideoRef.current) {
                    userVideoRef.current.srcObject = stream;
                }
                setHasUserMedia(true);
            } catch (err) {
                console.warn("Camera/mic permission denied or unavailable:", err);
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

    // Connect to LiveAvatar setup-agent API & Initialize SDK WebRTC Session
    const handleStartCall = async () => {
        setIsLoadingAvatar(true);
        setStatusText("Προετοιμασία συνεδρίας με τον AI Agent...");

        try {
            // 1. Fetch Session Token & Embed Fallback
            const res = await fetch("/api/liveavatar/setup-agent", {
                method: "POST"
            });
            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Αποτυχία εκκίνησης AI Agent");
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
                } catch (sdkErr: any) {
                    console.warn("Native WebRTC SDK session error:", sdkErr);
                    const errMsg = sdkErr?.message || String(sdkErr);
                    sessionRef.current = null;
                    try {
                        await session.stop().catch(() => {});
                    } catch (_) {}
                    if (errMsg.toLowerCase().includes("credit") || errMsg.includes("403")) {
                        throw new Error("Εξαντλήθηκαν τα credits στο λογαριασμό LiveAvatar API. Προσθέστε credits στο app.liveavatar.com.");
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
        if (sessionRef.current) {
            try {
                await sessionRef.current.stop();
            } catch (err) {
                console.warn("Error stopping LiveAvatar session:", err);
            }
            sessionRef.current = null;
        }
        setStatusText("Η κλήση τερματίστηκε");
    };

    // Toggle Mic
    const handleToggleMic = () => {
        const nextState = !isMicMuted;
        setIsMicMuted(nextState);

        // Mute user audio track
        if (userVideoRef.current && userVideoRef.current.srcObject) {
            const stream = userVideoRef.current.srcObject as MediaStream;
            stream.getAudioTracks().forEach(track => {
                track.enabled = !nextState;
            });
        }

        // Also mute LiveAvatar SDK mic if connected
        if (sessionRef.current?.voiceChat) {
            try {
                if (nextState) {
                    sessionRef.current.voiceChat.stop();
                } else {
                    sessionRef.current.voiceChat.start();
                }
            } catch (err) {
                console.warn("Failed to toggle LiveAvatar voiceChat:", err);
            }
        }
    };

    // Send Text Message to AI Agent
    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;

        const textToSend = inputText.trim();
        setInputText("");

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), sender: "user", text: textToSend, time: timeStr }
        ]);

        if (sessionRef.current) {
            try {
                await sessionRef.current.sendMessage(textToSend);
            } catch (err) {
                console.error("Failed to send message via SDK:", err);
            }
        }
    };

    // Helper format timer
    const formatTimer = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans select-none">
            
            {/* Top Minimal Navigation Bar */}
            <div className="h-14 sm:h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between z-30 flex-shrink-0 shadow-xs">
                <div className="flex items-center gap-3">
                    <Link 
                        href="/order-ai-agent"
                        className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Επιστροφή</span>
                    </Link>
                    <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <h1 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                            SGK Interactive AI Agent <span className="text-[#5b36f5] hidden sm:inline">• Live Demo</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/order-ai-agent#contact-form"
                        className="px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#0a0b10] hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Παραγγελία AI Agent</span>
                    </Link>
                </div>
            </div>

            {/* Video Call Workspace */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Left Side: Interactive Chat Panel */}
                <div className={`
                    absolute sm:relative top-0 bottom-0 left-0 z-40 w-full sm:w-[360px] md:w-[400px] bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shadow-xl sm:shadow-none
                    ${isChatOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0 sm:w-0 sm:border-r-0 overflow-hidden opacity-0 pointer-events-none"}
                `}>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5b36f5]">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 leading-tight">AI Agent Assistant</h2>
                                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Online • Εξηγεί τη νέα υπηρεσία
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsChatOpen(false)}
                            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-700 shadow-xs leading-relaxed space-y-1">
                            <p className="font-bold text-slate-900 flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-[#5b36f5]" />
                                Τι μπορείτε να ρωτήσετε:
                            </p>
                            <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                                <li>Πώς συνδέεται ο AI Agent με το E-shop ή ERP μου;</li>
                                <li>Πόσο κοστίζει το setup (500€) και ποια είναι τα μηνιαία πλάνα;</li>
                                <li>Σε ποιες γλώσσες μιλάει (160+);</li>
                                <li>Μπορώ να φτιάξω avatar με το δικό μου πρόσωπο;</li>
                            </ul>
                        </div>

                        {messages.map((m) => (
                            <div 
                                key={m.id} 
                                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                            >
                                <span className="text-[10px] text-gray-400 mb-1 px-1">
                                    {m.sender === "user" ? "Εσείς" : "AI Agent"} • {m.time}
                                </span>
                                <div 
                                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-xs ${
                                        m.sender === "user" 
                                            ? "bg-[#5b36f5] text-white rounded-tr-xs" 
                                            : "bg-white border border-slate-200 text-slate-800 rounded-tl-xs"
                                    }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}

                        {isCallActive && (
                            <div className="text-center py-2">
                                <span className="text-[10px] text-gray-400 font-medium block">
                                    {formatTimer(callSeconds)}
                                </span>
                                <span className="inline-block mt-0.5 text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                                    ● Ζωντανή Κλήση σε εξέλιξη
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
                            placeholder="Ρωτήστε για τιμές, ERP, λειτουργίες..."
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

                {/* Main Video Call Stage */}
                <div className="flex-1 w-full h-full relative bg-slate-900 overflow-hidden flex items-center justify-center">
                    
                    {/* Top Right Header Controls Overlay */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-5 z-30 flex items-center gap-2 sm:gap-3 text-slate-700">
                        {isCallActive && (
                            <div className="text-xs sm:text-sm font-medium tracking-wider text-emerald-600 font-mono bg-white/90 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 sm:gap-2 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                {formatTimer(callSeconds)}
                            </div>
                        )}

                        <button 
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all shadow-md ${
                                isChatOpen 
                                    ? "bg-[#5b36f5] border-[#5b36f5] text-white" 
                                    : "bg-white/90 backdrop-blur-md border-gray-200 text-slate-700 hover:text-slate-900 hover:bg-white"
                            }`}
                            title="Συνομιλία / Chat"
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="hidden xs:inline">Chat</span>
                        </button>
                    </div>

                    {/* Main Video Stream Container */}
                    <div className="w-full h-full relative flex items-center justify-center bg-slate-900">
                        {/* Native WebRTC Video Element */}
                        <video 
                            ref={avatarVideoRef}
                            autoPlay 
                            playsInline 
                            className={`w-full h-full object-cover transition-opacity duration-500 ${hasNativeStream ? "opacity-100" : "hidden opacity-0"}`}
                        />

                        {/* Iframe Fallback */}
                        {isCallActive && !hasNativeStream && avatarUrl && (
                            <iframe 
                                src={avatarUrl}
                                allow="microphone; camera; display-capture; autoplay"
                                className="w-full h-full border-none object-cover"
                            />
                        )}

                        {/* Connecting State */}
                        {isCallActive && !hasNativeStream && !avatarUrl && (
                            <div className="text-center p-6 sm:p-8 space-y-4 max-w-sm text-white">
                                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#5b36f5] animate-spin mx-auto" />
                                <h3 className="text-base sm:text-lg font-medium">{statusText}</h3>
                                <p className="text-xs text-slate-400">Σύνδεση με Live Video WebRTC...</p>
                            </div>
                        )}

                        {/* Standby Screen */}
                        {!isCallActive && (
                            <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                                {/* Background Image */}
                                <img 
                                    src="/avatar-preview-man.png" 
                                    alt="SGK AI Agent Specialist" 
                                    className="w-full h-full object-cover opacity-80"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

                                {/* Center Clean Start Call Button */}
                                <div className="absolute z-20 flex flex-col items-center text-center px-4 max-w-md">
                                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                        <span>Ζωντανή Παρουσίαση Υπηρεσίας AI Agent</span>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                        Μιλήστε ζωντανά με τον AI Agent
                                    </h2>
                                    <p className="text-xs sm:text-sm text-white/80 mb-6 leading-relaxed">
                                        Ρωτήστε τα πάντα για κόστη (500€ setup), μηνιαία πλάνα, διασύνδεση με ERP / E-shops και αυτοματισμούς.
                                    </p>
                                    <button
                                        onClick={handleStartCall}
                                        disabled={isLoadingAvatar}
                                        className="px-8 py-4 sm:px-10 sm:py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base sm:text-lg flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
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

                    {/* Bottom Floating Action Bar */}
                    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-gray-200 shadow-2xl">
                        {/* Mic Button */}
                        <button 
                            onClick={handleToggleMic}
                            className={`p-2.5 sm:p-3 rounded-full transition-all ${
                                isMicMuted 
                                    ? "bg-red-500 hover:bg-red-600 text-white shadow-md" 
                                    : "bg-gray-100 hover:bg-gray-200 text-slate-700"
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
                                    ? "bg-red-500 hover:bg-red-600 text-white shadow-md" 
                                    : "bg-gray-100 hover:bg-gray-200 text-slate-700"
                            }`}
                            title={isVideoOff ? "Ενεργοποίηση κάμερας" : "Απενεργοποίηση κάμερας"}
                        >
                            {isVideoOff ? <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>

                        {/* Chat Toggle Button */}
                        <button 
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            className={`p-2.5 sm:p-3 rounded-full transition-all relative ${
                                isChatOpen 
                                    ? "bg-[#5b36f5] text-white shadow-lg shadow-indigo-500/40" 
                                    : "bg-gray-100 hover:bg-gray-200 text-slate-700"
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

                    {/* PiP (User Camera: top-left on mobile, bottom-right on desktop) */}
                    <div className="absolute top-3 left-3 sm:top-auto sm:left-auto sm:bottom-6 sm:right-6 z-20 w-24 sm:w-44 aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                        {hasUserMedia && !isVideoOff ? (
                            <video 
                                ref={userVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover -scale-x-100"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-center p-2 select-none">
                                <VideoOff className="w-4 h-4 sm:w-6 sm:h-6 text-slate-400 mb-1" />
                                <span className="text-[8px] sm:text-[10px] font-bold tracking-widest text-slate-500 uppercase">
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
                        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-1.5 sm:px-2 py-0.5 rounded-md border border-gray-200">
                            {isMicMuted ? (
                                <MicOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500" />
                            ) : (
                                <div className="flex items-center gap-0.5">
                                    <span className="w-0.5 h-1.5 sm:h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="w-0.5 h-2.5 sm:h-3 bg-emerald-500 rounded-full animate-pulse delay-75" />
                                    <span className="w-0.5 h-1 sm:h-1.5 bg-emerald-500 rounded-full animate-pulse delay-150" />
                                </div>
                            )}
                            <span className="text-[9px] sm:text-[10px] font-medium text-slate-700">
                                Εσείς
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
