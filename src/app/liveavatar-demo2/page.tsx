"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
    Mic, 
    MicOff, 
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
    
    // Chat visibility (hidden by default as in liveavatar-demo)
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState<string>("");

    // User Media (Mic & Screen)
    const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
    const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);

    // Call duration timer
    const [callSeconds, setCallSeconds] = useState<number>(0);

    // Refs
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

    // Connect to LiveAvatar setup-agent API & Initialize SDK WebRTC Session
    const handleStartCall = async () => {
        setIsLoadingAvatar(true);
        setStatusText("Προετοιμασία συνεδρίας & σύνδεση...");

        try {
            // 1. Fetch Session Token & Embed Fallback
            const res = await fetch("/api/liveavatar/setup-agent", {
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
                } catch (sdkErr: any) {
                    console.warn("Native WebRTC SDK session error:", sdkErr);
                    const errMsg = sdkErr?.message || String(sdkErr);
                    sessionRef.current = null;
                    try {
                        await session.stop().catch(() => {});
                    } catch (_) {}
                    if (errMsg.toLowerCase().includes("credit") || errMsg.includes("403")) {
                        throw new Error("Εξαντλήθηκαν τα credits στο λογαριασμό σας στο LiveAvatar. Προσθέστε credits στο app.liveavatar.com για νέα ζωντανή κλήση.");
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
        <div className="w-full h-[100dvh] bg-slate-100 flex items-center justify-center p-0 sm:p-4 select-none font-sans overflow-hidden">
            {/* Main Window Frame Container (Exact same design as liveavatar-demo) */}
            <div className="w-full sm:max-w-[1440px] h-full sm:h-[96vh] sm:max-h-[880px] bg-white rounded-none sm:rounded-[28px] overflow-hidden shadow-2xl border-0 sm:border-4 border-gray-200 flex relative">
                
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
                                <span className="text-[11px] text-white/80 font-normal truncate block">Interactive AI Agent Service</span>
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
                            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" /> AI Agents • ERP & APIs
                        </span>
                        <span className="font-bold text-[#5b36f5] flex-shrink-0">500€ Setup • 160+ Γλώσσες</span>
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
                            placeholder="Ρωτήστε τον Bryan για τους AI Agents..."
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
                <div className="flex-1 w-full h-full relative bg-slate-50 overflow-hidden flex items-center justify-center">
                    
                    {/* Top Controls Overlay */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-5 z-30 flex items-center gap-2 text-slate-700">
                        <Link
                            href="/order-ai-agent"
                            className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white shadow-sm flex items-center gap-1.5 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Επιστροφή</span>
                        </Link>
                    </div>

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
                    <div className="w-full h-full relative flex items-center justify-center bg-slate-50">
                        {/* Native WebRTC Video Element (Bound via SDK) */}
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

                        {/* Call Active but connecting state */}
                        {isCallActive && !hasNativeStream && !avatarUrl && (
                            <div className="text-center p-6 sm:p-8 space-y-4 max-w-sm">
                                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#5b36f5] animate-spin mx-auto" />
                                <h3 className="text-base sm:text-lg font-medium text-slate-800">{statusText}</h3>
                                <p className="text-xs text-slate-500">Σύνδεση με Live Video WebRTC...</p>
                            </div>
                        )}

                        {/* Call Inactive / Standby Screen (EXACT SAME AS liveavatar-demo: Pure Video Avatar, NO marketing text overlays) */}
                        {!isCallActive && (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Photorealistic Avatar Background Preview */}
                                <img 
                                    src="https://files2.heygen.ai/avatar/v3/a3fdb0c652024f79984aaec11ebf2694_34350/preview_target.webp" 
                                    alt="Bryan - Tech Expert" 
                                    className="w-full h-full object-cover"
                                />

                                {/* Center Clean Start Call Button (Pure & Clean) */}
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

                        {/* Screen Share Button (Desktop only) */}
                        <button 
                            onClick={() => setIsScreenSharing(!isScreenSharing)}
                            className={`hidden sm:flex p-2.5 sm:p-3 rounded-full transition-all ${
                                isScreenSharing 
                                    ? "bg-cyan-500 hover:bg-cyan-600 text-white shadow-md" 
                                    : "bg-gray-100 hover:bg-gray-200 text-slate-700"
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

                </div>
            </div>
        </div>
    );
}
