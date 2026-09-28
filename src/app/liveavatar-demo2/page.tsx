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
    ArrowLeft,
    Zap,
    Cpu,
    Volume2
} from "lucide-react";

interface Message {
    id: string;
    sender: "agent" | "user";
    text: string;
    time: string;
}

// Normalization of common Greek speech-to-text misrecognitions
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
    cleaned = cleaned.replace(/\bάφημη\b/gi, "Α.Φ.Μ.");
    cleaned = cleaned.replace(/\bαφημη\b/gi, "Α.Φ.Μ.");

    return cleaned;
}

export default function LiveAvatarAgentDemoPage() {
    // Mode State: LITE (Avatar Only / Bring Your Own Voice Stack) vs FULL (All-in-one HeyGen)
    const [sessionMode, setSessionMode] = useState<"LITE" | "FULL">("LITE");

    // Call States
    const [isCallActive, setIsCallActive] = useState<boolean>(false);
    const [isLoadingAvatar, setIsLoadingAvatar] = useState<boolean>(false);
    const [statusText, setStatusText] = useState<string>("Έτοιμο για εκκίνηση");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [hasNativeStream, setHasNativeStream] = useState<boolean>(false);
    
    // Live STT & Captions State
    const [liveCaption, setLiveCaption] = useState<string>("");
    const [isAgentThinking, setIsAgentThinking] = useState<boolean>(false);
    const [isListeningSTT, setIsListeningSTT] = useState<boolean>(false);

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
    const recognitionRef = useRef<any>(null);
    const captionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isProcessingReplyRef = useRef<boolean>(false);
    
    // Persistent Audio element to bypass autoplay restrictions
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Visible Debug Logs
    const [showLogs, setShowLogs] = useState<boolean>(true);
    const [debugLogs, setDebugLogs] = useState<string[]>([]);
    const logsEndRef = useRef<HTMLDivElement | null>(null);

    const addLog = (msg: string) => {
        const timeStr = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
        setDebugLogs(prev => [...prev.slice(-49), `[${timeStr}] ${msg}`]);
        console.log(`[DEBUG] ${msg}`);
    };

    useEffect(() => {
        if (showLogs && logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [debugLogs, showLogs]);

    // Subtitles disabled - pure clean video call experience
    const showCaption = (_text: string, _durationMs?: number) => {};

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
                addLog("Camera/mic access granted.");
            } catch (err: any) {
                console.warn("Camera/mic permission denied or unavailable:", err);
                addLog(`Camera error: ${err.message || err.name || String(err)}. Check permissions.`);
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

    // Dispatch a user message (from STT or text input) to the AI Agent
    const handleProcessUserMessage = async (userText: string) => {
        if (!userText.trim() || isProcessingReplyRef.current) return;
        isProcessingReplyRef.current = true;

        const cleanedText = cleanGreekSTT(userText.trim());
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        // Add user message to state
        setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), sender: "user", text: cleanedText, time: timeStr }
        ]);

        showCaption(`🗣️ Εσείς: "${cleanedText}"`, 4000);

        try {
            if (sessionMode === "LITE") {
                // ================= LITE MODE (AVATAR ONLY / BYO VOICE STACK) =================
                setIsAgentThinking(true);
                showCaption(`⚡ Bryan σκέφτεται...`, 3000);

                // Call our local AI Agent Chat API
                const res = await fetch("/api/liveavatar/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: cleanedText,
                        history: messages
                    })
                });

                const data = await res.json();
                const aiReply = data?.reply || "Σας άκουσα! Πώς μπορώ να σας εξυπηρετήσω με τους AI Agents;";

                setIsAgentThinking(false);

                // Add agent reply to chat
                const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                setMessages(prev => [
                    ...prev,
                    { id: (Date.now() + 1).toString(), sender: "agent", text: aiReply, time: replyTime }
                ]);

                showCaption(`🤖 Bryan: "${aiReply}"`, 8000);

                // Play synthesized Greek audio through browser so the user hears Bryan loud and clear
                if (data.audioUrl) {
                    try {
                        addLog("TTS audio received, attempting to play via audioRef...");
                        if (audioRef.current) {
                            audioRef.current.src = data.audioUrl;
                            audioRef.current.play().then(() => {
                                addLog("TTS audio playing successfully.");
                            }).catch(e => {
                                addLog("Audio playback failed: " + e.message);
                            });
                        } else {
                            addLog("audioRef is null, cannot play audio.");
                        }
                    } catch (playErr: any) {
                        addLog("Exception playing audio: " + playErr.message);
                    }
                }

                // Send audio / text to avatar for real-time lipsync rendering
                if (sessionRef.current) {
                    try {
                        if (data.audioBase64 && typeof sessionRef.current.repeatAudio === "function") {
                            sessionRef.current.repeatAudio(data.audioBase64);
                        } else if (typeof sessionRef.current.repeat === "function") {
                            sessionRef.current.repeat(aiReply);
                        }
                    } catch (repeatErr) {
                        console.warn("Avatar repeat command error:", repeatErr);
                    }
                }
            } else {
                // ================= FULL MODE (HEYGEN MANAGED PIPELINE) =================
                if (sessionRef.current) {
                    try {
                        if (typeof sessionRef.current.message === "function") {
                            sessionRef.current.message(cleanedText);
                        } else if (typeof sessionRef.current.sendMessage === "function") {
                            sessionRef.current.sendMessage(cleanedText);
                        }
                    } catch (msgErr) {
                        console.warn("FULL mode sendMessage error:", msgErr);
                    }
                }
            }
        } catch (err) {
            console.error("Error processing user message:", err);
        } finally {
            isProcessingReplyRef.current = false;
        }
    };

    // ================= REAL-TIME SPEECH-TO-TEXT (STT) ENGINE =================
    useEffect(() => {
        if (!isCallActive || isMicMuted) {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (_) {}
                recognitionRef.current = null;
            }
            setIsListeningSTT(false);
            return;
        }

        // Web Speech API check
        const SpeechRecognition = (typeof window !== "undefined") && 
            ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

        if (!SpeechRecognition) {
            console.warn("Web Speech API not supported in this browser.");
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognition.lang = "el-GR";
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                setIsListeningSTT(true);
            };

            recognition.onresult = (event: any) => {
                let interim = "";
                let final = "";

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        final += transcript;
                    } else {
                        interim += transcript;
                    }
                }

                const currentSpoken = cleanGreekSTT(final || interim);
                if (currentSpoken) {
                    showCaption(`🎙️ ${currentSpoken}`, 3000);
                }

                if (final.trim()) {
                    handleProcessUserMessage(final.trim());
                }
            };

            recognition.onerror = (err: any) => {
                // Avoid logging normal silence aborts
                if (err.error !== "no-speech" && err.error !== "aborted") {
                    console.warn("STT Speech recognition notice:", err.error);
                }
            };

            recognition.onend = () => {
                // Keep-alive if call is still active and unmuted
                if (isCallActive && !isMicMuted && recognitionRef.current) {
                    try {
                        recognition.start();
                    } catch (_) {}
                } else {
                    setIsListeningSTT(false);
                }
            };

            recognition.start();
            recognitionRef.current = recognition;
        } catch (initErr) {
            console.warn("Failed to initialize STT:", initErr);
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (_) {}
                recognitionRef.current = null;
            }
            setIsListeningSTT(false);
        };
    }, [isCallActive, isMicMuted, sessionMode]);

    // Connect to LiveAvatar setup-agent API & Initialize WebRTC Session
    const handleStartCall = async () => {
        addLog(`Starting call in ${sessionMode} mode...`);
        
        // 0. Unlock browser audio during user interaction
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
        audioRef.current.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
        audioRef.current.play()
            .then(() => addLog("Browser Audio API unlocked successfully."))
            .catch(e => addLog("Browser Audio API unlock failed: " + e.message));

        setIsLoadingAvatar(true);
        setStatusText(`Προετοιμασία (${sessionMode === "LITE" ? "Avatar Only / BYO Voice" : "Full Mode"})...`);

        try {
            // 1. Fetch Session Token with requested mode
            addLog("Fetching session token...");
            const res = await fetch("/api/liveavatar/setup-agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mode: sessionMode })
            });
            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Αποτυχία εκκίνησης LiveAvatar");
            }

            addLog("Session token received.");
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
                            showCaption(`🤖 Bryan: "${evt.text}"`, 7000);
                        }
                    });

                    // Live Speech-to-Text from User (Native LiveAvatar STT fallback)
                    session.on(AgentEventsEnum.USER_TRANSCRIPTION, (evt: any) => {
                        if (evt?.text) {
                            const now = new Date();
                            const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                            const cleaned = cleanGreekSTT(evt.text);
                            setMessages(prev => [
                                ...prev,
                                { id: Date.now().toString(), sender: "user", text: cleaned, time: timeStr }
                            ]);
                            showCaption(`🗣️ Εσείς: "${cleaned}"`, 4000);
                        }
                    });

                    await session.start();

                    // In FULL mode, start native voice chat
                    if (sessionMode === "FULL" && session.voiceChat) {
                        try {
                            await session.voiceChat.start();
                        } catch (vcErr) {
                            console.warn("Voice chat auto-start:", vcErr);
                        }
                    }

                    // Welcome speech in LITE mode with audio
                    if (sessionMode === "LITE") {
                        setTimeout(async () => {
                            try {
                                const chatRes = await fetch("/api/liveavatar/chat", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        message: "Χαιρέτησε τον επισκέπτη θερμά σε 1 σύντομη πρόταση ως Bryan της SGK Digital.",
                                        history: []
                                    })
                                });
                                const chatData = await chatRes.json();
                                const welcome = chatData?.reply || "Γεια σας! Είμαι ο Bryan, Senior AI Agent της SGK Digital. Πώς μπορώ να σας βοηθήσω σήμερα;";
                                
                                showCaption(`🤖 Bryan: "${welcome}"`, 7000);
                                setMessages(prev => [
                                    ...prev,
                                    {
                                        id: Date.now().toString(),
                                        sender: "agent",
                                        text: welcome,
                                        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                    }
                                ]);

                                if (chatData?.audioUrl) {
                                    addLog("Welcome TTS received, playing via audioRef...");
                                    if (audioRef.current) {
                                        audioRef.current.src = chatData.audioUrl;
                                        audioRef.current.play().then(() => addLog("Welcome audio playing successfully.")).catch(e => addLog("Welcome audio play error: " + e.message));
                                    }
                                }

                                if (chatData?.audioBase64 && typeof session.repeatAudio === "function") {
                                    session.repeatAudio(chatData.audioBase64);
                                } else if (typeof session.repeat === "function") {
                                    session.repeat(welcome);
                                }
                            } catch (err) {
                                console.warn("Welcome speech error:", err);
                            }
                        }, 1200);
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
        setLiveCaption("");
        if (sessionRef.current) {
            try {
                await sessionRef.current.stop();
            } catch (err) {
                console.warn("Error stopping LiveAvatar session:", err);
            }
            sessionRef.current = null;
        }
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (_) {}
            recognitionRef.current = null;
        }
        setStatusText("Η κλήση τερματίστηκε");
    };

    // Toggle Mic
    const handleToggleMic = () => {
        const nextState = !isMicMuted;
        setIsMicMuted(nextState);

        if (userVideoRef.current && userVideoRef.current.srcObject) {
            const stream = userVideoRef.current.srcObject as MediaStream;
            stream.getAudioTracks().forEach(track => {
                track.enabled = !nextState;
            });
        }

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

    // Send Text Message from chat drawer
    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;

        const textToSend = inputText.trim();
        setInputText("");
        handleProcessUserMessage(textToSend);
    };

    // Helper format timer
    const formatTimer = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="w-full h-[100dvh] bg-slate-100 flex items-center justify-center p-0 sm:p-4 select-none font-sans overflow-hidden">
            {/* Main Window Frame Container */}
            <div className="w-full sm:max-w-[1440px] h-full sm:h-[96vh] sm:max-h-[880px] bg-white rounded-none sm:rounded-[28px] overflow-hidden shadow-2xl border-0 sm:border-4 border-gray-200 flex relative">
                
                {/* Mobile Backdrop when Chat Drawer is Open */}
                {isChatOpen && (
                    <div 
                        onClick={() => setIsChatOpen(false)}
                        className="fixed sm:hidden inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
                    />
                )}

                {/* ================= SLIDE-IN OVERLAY DRAWER: CHAT ================= */}
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
                                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-normal">
                                        {sessionMode === "LITE" ? "BYO Voice Stack" : "Full Stack"}
                                    </span>
                                </h2>
                                <span className="text-[11px] text-white/80 font-normal truncate block">Interactive AI Agent Service</span>
                            </div>
                        </div>

                        {/* Close Chat Button */}
                        <button 
                            type="button"
                            onClick={() => setIsChatOpen(false)}
                            className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-white cursor-pointer"
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
                        <span className="font-bold text-[#5b36f5] flex-shrink-0">500€ Setup • Real-time STT</span>
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

                        {/* Agent Thinking indicator */}
                        {isAgentThinking && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2 bg-slate-50 rounded-xl border border-slate-200 w-fit">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5b36f5]" />
                                <span>Ο Bryan ετοιμάζει την απάντηση...</span>
                            </div>
                        )}

                        {/* Call Started System Pill */}
                        {isCallActive && (
                            <div className="text-center py-2 my-2">
                                <span className="text-[10px] text-gray-400 font-medium block">
                                    {formatTimer(callSeconds)}
                                </span>
                                <span className="inline-block mt-0.5 text-xs font-bold text-gray-900 tracking-wide bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                                    ● Ζωντανή Βιντεοκλήση ({sessionMode === "LITE" ? "Avatar Only" : "Full"})
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
                            placeholder="Πληκτρολογήστε ή μιλήστε στο μικρόφωνο..."
                            className="flex-1 text-sm bg-gray-50 rounded-full py-2 px-3.5 outline-none text-gray-800 placeholder-gray-400 focus:bg-gray-100"
                        />
                        
                        <button 
                            type="submit" 
                            disabled={!inputText.trim()}
                            className="p-2 rounded-full bg-[#5b36f5] text-white hover:bg-[#4927d6] disabled:bg-gray-200 disabled:text-gray-400 transition-colors flex-shrink-0 cursor-pointer"
                            title="Αποστολή"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>

                {/* ================= MAIN VIDEO CALL STAGE ================= */}
                <div className="flex-1 w-full h-full relative bg-slate-50 overflow-hidden flex items-center justify-center">
                    
                    {/* Top Controls Overlay */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-5 z-40 flex flex-col items-start gap-2">
                        <Link
                            href="/order-ai-agent"
                            className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white shadow-sm flex items-center gap-1.5 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Επιστροφή</span>
                        </Link>
                        
                        <button
                            onClick={() => setShowLogs(!showLogs)}
                            className="px-3 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-slate-200 hover:text-white shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer mt-1"
                        >
                            {showLogs ? "Hide Logs" : "Show Logs"}
                        </button>
                        
                        {/* Debug Logs Panel */}
                        {showLogs && (
                            <div className="w-64 sm:w-80 h-48 sm:h-64 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg p-2.5 overflow-hidden flex flex-col shadow-2xl mt-1">
                                <div className="text-[10px] text-emerald-400 font-mono mb-2 flex justify-between items-center pb-1 border-b border-slate-700">
                                    <span>SYSTEM LOGS</span>
                                    <span className="text-slate-500">{debugLogs.length} entries</span>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[9px] sm:text-[10px] leading-tight text-slate-300">
                                    {debugLogs.length === 0 && <div className="text-slate-500 italic">No logs yet...</div>}
                                    {debugLogs.map((log, idx) => (
                                        <div key={idx} className="break-words border-b border-slate-800/50 pb-0.5">
                                            {log}
                                        </div>
                                    ))}
                                    <div ref={logsEndRef} />
                                </div>
                            </div>
                        )}
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
                            className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
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

                        {/* Call Inactive / Standby Screen */}
                        {!isCallActive && (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Photorealistic Avatar Background Preview */}
                                <img 
                                    src="https://files2.heygen.ai/avatar/v3/a3fdb0c652024f79984aaec11ebf2694_34350/preview_target.webp" 
                                    alt="Bryan - Tech Expert" 
                                    className="w-full h-full object-cover"
                                />

                                {/* Center Controls & Mode Switcher */}
                                <div className="absolute z-20 flex flex-col items-center text-center px-4 max-w-lg">
                                    
                                    {/* Mode Selector Pill */}
                                    <div className="mb-5 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-2xl flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setSessionMode("LITE")}
                                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                                sessionMode === "LITE"
                                                    ? "bg-[#5b36f5] text-white shadow-md shadow-indigo-500/50"
                                                    : "text-slate-300 hover:text-white"
                                            }`}
                                        >
                                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                                            <span>Avatar Only (BYO Voice)</span>
                                            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">1 credit/min</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setSessionMode("FULL")}
                                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                                sessionMode === "FULL"
                                                    ? "bg-[#5b36f5] text-white shadow-md shadow-indigo-500/50"
                                                    : "text-slate-300 hover:text-white"
                                            }`}
                                        >
                                            <Cpu className="w-3.5 h-3.5 text-blue-300" />
                                            <span>Full Mode</span>
                                            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">2 credits/min</span>
                                        </button>
                                    </div>

                                    {/* Start Call Button */}
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
                                                <span>Έναρξη Video Call ({sessionMode === "LITE" ? "Avatar Only" : "Full"})</span>
                                            </>
                                        )}
                                    </button>

                                    <p className="mt-3 text-xs text-white/90 font-medium bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full border border-white/10">
                                        🎙️ Υποστηρίζει φωνή με Ελληνικό STT & πληκτρολόγιο
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ================= BOTTOM FLOATING ACTION BAR ================= */}
                    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-gray-200 shadow-2xl">
                        {/* Mic Button */}
                        <button 
                            onClick={handleToggleMic}
                            className={`p-2.5 sm:p-3 rounded-full transition-all cursor-pointer ${
                                isMicMuted 
                                    ? "bg-red-500 hover:bg-red-600 text-white shadow-md" 
                                    : "bg-gray-100 hover:bg-gray-200 text-slate-700"
                            }`}
                            title={isMicMuted ? "Ενεργοποίηση μικροφώνου (STT)" : "Σίγαση μικροφώνου"}
                        >
                            {isMicMuted ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>

                        {/* Camera Button */}
                        <button 
                            onClick={() => setIsVideoOff(!isVideoOff)}
                            className={`p-2.5 sm:p-3 rounded-full transition-all cursor-pointer ${
                                isVideoOff 
                                    ? "bg-red-500 hover:bg-red-600 text-white shadow-md" 
                                    : "bg-gray-100 hover:bg-gray-200 text-slate-700"
                            }`}
                            title={isVideoOff ? "Ενεργοποίηση κάμερας" : "Απενεργοποίηση κάμερας"}
                        >
                            {isVideoOff ? <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>

                        {/* Screen Share Button (Desktop only) */}
                        <button 
                            onClick={() => setIsScreenSharing(!isScreenSharing)}
                            className={`hidden sm:flex p-2.5 sm:p-3 rounded-full transition-all cursor-pointer ${
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
                            className={`p-2.5 sm:p-3 rounded-full transition-all relative cursor-pointer ${
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
                                className="p-3 sm:p-3.5 rounded-full bg-[#eb4335] hover:bg-[#d63b2f] text-white shadow-lg shadow-red-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                title="Τερματισμός κλήσης"
                            >
                                <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        ) : (
                            <button 
                                onClick={handleStartCall}
                                className="p-3 sm:p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                title="Έναρξη κλήσης"
                            >
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        )}
                    </div>

                    {/* ================= PiP (User Camera) ================= */}
                    <div className="absolute top-3 right-3 sm:top-auto sm:left-auto sm:bottom-6 sm:right-6 z-20 w-24 sm:w-44 aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
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
                            {isMicMuted && (
                                <span className="text-[8px] text-red-500 font-semibold ml-0.5 hidden xs:inline">
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
