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
    Loader2 
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
    const [isCallActive, setIsCallActive] = useState<boolean>(true);
    const [isLoadingAvatar, setIsLoadingAvatar] = useState<boolean>(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
    const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
    const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);

    // Call Timer (starts at 00:52 like the screenshot or counts when active)
    const [callSeconds, setCallSeconds] = useState<number>(52);

    // User Camera Stream for PiP
    const userVideoRef = useRef<HTMLVideoElement | null>(null);
    const [hasUserMedia, setHasUserMedia] = useState<boolean>(false);

    // Chat Messages
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", sender: "agent", text: "Hi, how can we help?", time: "3:00 pm" },
        { id: "2", sender: "user", text: "How do I change my credit card payment limit?", time: "3:06 pm" },
        { id: "3", sender: "agent", text: "Happy to help out with this. Do you mind to have video call?", time: "3:06 pm" },
        { id: "4", sender: "user", text: "Sure", time: "3:06 pm" }
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

    // Initialize User Webcam for PiP (if available)
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
                // User denied or no camera, fallback gracefully
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

    // Connect to LiveAvatar API
    const handleStartCall = async () => {
        setIsLoadingAvatar(true);
        setIsCallActive(true);

        try {
            const res = await fetch("/api/liveavatar/setup", {
                method: "POST"
            });
            const data = await res.json();

            if (data.success && data.url) {
                setAvatarUrl(data.url);
            } else {
                console.warn("LiveAvatar setup returned:", data.error);
            }
        } catch (err) {
            console.error("Failed to connect to LiveAvatar:", err);
        } finally {
            setIsLoadingAvatar(false);
        }
    };

    const handleEndCall = () => {
        setIsCallActive(false);
        setAvatarUrl(null);
        setCallSeconds(0);
        setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), sender: "agent", text: "Η κλήση τερματίστηκε. Μπορώ να βοηθήσω σε κάτι άλλο;", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: "user",
            text: inputText.trim(),
            time: timeStr
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText("");

        // Auto-reply simulation from Andy / Agent if call is active
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    sender: "agent",
                    text: "Σας ακούω! Μπορείτε να μου μιλήσετε απευθείας στο μικρόφωνο ή να συνεχίσουμε μέσω chat.",
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
            ]);
        }, 1200);
    };

    return (
        <div className="w-full h-screen bg-[#0e0f12] flex items-center justify-center p-2 sm:p-4 md:p-6 select-none font-sans overflow-hidden">
            {/* Main Window Frame Container */}
            <div className="w-full max-w-[1400px] h-[96vh] max-h-[860px] bg-[#1a1b20] rounded-[28px] overflow-hidden shadow-2xl border-4 border-[#272831] flex flex-col md:flex-row relative">
                
                {/* ================= LEFT PANEL: CHAT ================= */}
                <div className="w-full md:w-[350px] lg:w-[380px] xl:w-[410px] flex-shrink-0 flex flex-col bg-white h-full border-r border-[#26272e] z-10">
                    {/* Header */}
                    <div className="h-16 px-5 bg-[#5b36f5] flex items-center justify-between text-white shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#5b36f5] shadow-sm">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold leading-tight tracking-wide">Andy Lane</h2>
                                <span className="text-[11px] text-white/80 font-normal">AI Support Agent</span>
                            </div>
                        </div>

                        <Link 
                            href="/ai-agents" 
                            className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/90 hover:text-white"
                            title="Κλείσιμο & Επιστροφή"
                        >
                            <X className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Chat Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white">
                        {messages.map((m) => (
                            <div 
                                key={m.id} 
                                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                            >
                                <span className="text-[11px] text-gray-400 font-medium mb-1 px-1">
                                    {m.time}
                                </span>
                                <div 
                                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed shadow-sm ${
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
                                <span className="text-[11px] text-gray-400 font-medium block">
                                    3:09 pm
                                </span>
                                <span className="inline-block mt-0.5 text-xs font-bold text-gray-900 tracking-wide">
                                    Call started
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
                            placeholder="Enter your message"
                            className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 px-1"
                        />
                        
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <button 
                                type="button" 
                                className="p-1.5 hover:text-gray-600 transition-colors"
                                title="Attach file"
                            >
                                <Paperclip className="w-4 h-4" />
                            </button>
                            <button 
                                type="button" 
                                className="p-1.5 hover:text-gray-600 transition-colors"
                                title="Insert emoji"
                            >
                                <Smile className="w-4 h-4" />
                            </button>
                            <button 
                                type="submit" 
                                disabled={!inputText.trim()}
                                className="p-1.5 text-[#5b36f5] hover:text-[#4927d6] disabled:text-gray-300 transition-colors"
                                title="Send"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* ================= RIGHT PANEL: VIDEO CALL ================= */}
                <div className="flex-1 h-full relative bg-[#18191f] overflow-hidden flex items-center justify-center">
                    
                    {/* Top Right Header Floating Bar */}
                    <div className="absolute top-4 right-5 z-30 flex items-center gap-3.5 text-white/90">
                        {isCallActive && (
                            <div className="text-sm font-medium tracking-wider text-white/80 font-mono bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-md">
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
                            title="Call Settings"
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                        <button 
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                            title="More options"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>

                    {/* AdBlocker / Direct Link Notice (if avatar active) */}
                    {avatarUrl && (
                        <div className="absolute top-4 left-5 z-30">
                            <a 
                                href={avatarUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px] text-white/80 hover:text-white hover:border-white/30 transition-all"
                            >
                                <span>Απευθείας σε Fullscreen</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    )}

                    {/* Main Video Stream Container */}
                    <div className="w-full h-full relative flex items-center justify-center bg-black">
                        {isCallActive ? (
                            avatarUrl ? (
                                <iframe 
                                    src={avatarUrl}
                                    allow="microphone; camera; display-capture; autoplay"
                                    className="w-full h-full border-none object-cover"
                                />
                            ) : (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    {/* High fidelity agent video / photo background */}
                                    <img 
                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop" 
                                        alt="AI Avatar" 
                                        className="w-full h-full object-cover filter brightness-[0.92]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                                    {/* Center Connect Button if not auto connected */}
                                    <div className="absolute z-20 flex flex-col items-center">
                                        <button
                                            onClick={handleStartCall}
                                            disabled={isLoadingAvatar}
                                            className="px-6 py-3.5 rounded-full bg-[#5b36f5] hover:bg-[#4d2bd9] text-white font-medium text-sm flex items-center gap-2.5 shadow-2xl shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                        >
                                            {isLoadingAvatar ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Σύνδεση με LiveAvatar...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4" />
                                                    <span>Σύνδεση Φωνής & Live WebRTC</span>
                                                </>
                                            )}
                                        </button>
                                        <p className="text-[11px] text-white/70 mt-2 font-light">
                                            Μιλήστε απευθείας με το AI Avatar στα Ελληνικά
                                        </p>
                                    </div>
                                </div>
                            )
                        ) : (
                            /* Call Inactive Standby Screen */
                            <div className="text-center p-8 space-y-4">
                                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/60">
                                    <PhoneOff className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-light text-white">Η κλήση έχει τερματιστεί</h3>
                                <p className="text-xs text-white/50 max-w-sm mx-auto">
                                    Μπορείτε να ξεκινήσετε ξανά την κλήση όποτε επιθυμείτε για να συνομιλήσετε με το AI Avatar.
                                </p>
                                <button
                                    onClick={handleStartCall}
                                    className="px-6 py-2.5 rounded-full bg-[#5b36f5] hover:bg-[#4d2bd9] text-white font-medium text-xs tracking-wider uppercase transition-all"
                                >
                                    Επανασυνδεση
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ================= BOTTOM FLOATING ACTION BAR ================= */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 shadow-2xl">
                        {/* Mic Button */}
                        <button 
                            onClick={() => setIsMicMuted(!isMicMuted)}
                            className={`p-3 rounded-full transition-all ${
                                isMicMuted 
                                    ? "bg-red-500/80 hover:bg-red-600 text-white" 
                                    : "bg-white/15 hover:bg-white/25 text-white"
                            }`}
                            title={isMicMuted ? "Unmute microphone" : "Mute microphone"}
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
                            title={isVideoOff ? "Turn on camera" : "Turn off camera"}
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
                            title="Share screen"
                        >
                            <ScreenShare className="w-5 h-5" />
                        </button>

                        {/* Red Hangup Button */}
                        {isCallActive ? (
                            <button 
                                onClick={handleEndCall}
                                className="p-3.5 rounded-full bg-[#eb4335] hover:bg-[#d63b2f] text-white shadow-lg shadow-red-500/40 hover:scale-105 active:scale-95 transition-all"
                                title="End call"
                            >
                                <PhoneOff className="w-5 h-5" />
                            </button>
                        ) : (
                            <button 
                                onClick={handleStartCall}
                                className="p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all"
                                title="Start call"
                            >
                                <Phone className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* ================= BOTTOM RIGHT PiP (User Camera) ================= */}
                    <div className="absolute bottom-6 right-6 z-20 w-40 sm:w-48 aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-[#1e2029]">
                        {/* Real Camera Feed or Fallback */}
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
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop" 
                                alt="You" 
                                className="w-full h-full object-cover"
                            />
                        )}

                        {/* Bottom Overlay Label */}
                        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                            {/* Animated Audio Wave Bars */}
                            {!isMicMuted && (
                                <div className="flex items-center gap-0.5">
                                    <span className="w-0.5 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                    <span className="w-0.5 h-3 bg-cyan-400 rounded-full animate-pulse delay-75" />
                                    <span className="w-0.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-150" />
                                </div>
                            )}
                            <span className="text-[11px] font-medium text-white/90">
                                Lola Jordan
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
