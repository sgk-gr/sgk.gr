"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bot, Sparkles, Mic, Play, CheckCircle2, ShieldCheck, ArrowRight, Loader2, Volume2 } from "lucide-react";
import Link from "next/link";

const sampleProducts = [
    { id: 1, name: "AeroSound Pro Wireless Earbuds", price: "149.00 €", stock: 15, desc: "Ασύρματα ακουστικά με Active Noise Cancellation (ANC), 30 ώρες αυτονομία και κορυφαία ποιότητα ήχου." },
    { id: 2, name: "NovaWatch Series 5 Smartwatch", price: "299.00 €", stock: 8, desc: "Έξυπνο ρολόι με έγχρωμη οθόνη OLED, μέτρηση παλμών, οξυγόνου, GPS και αδιάβροχη προστασία." },
    { id: 3, name: "LuminaDesk Smart LED Lamp", price: "89.00 €", stock: 24, desc: "Έξυπνο επιτραπέζιο φωτιστικό με ρύθμιση φωτεινότητας, ambient συγχρονισμό και ασύρματη φόρτιση κινητού." },
    { id: 4, name: "ChargeGrid 4-in-1 Station", price: "59.00 €", stock: 12, desc: "Βάση γρήγορης ασύρματης φόρτισης για το κινητό, το ρολόι, τα ακουστικά σας και μία επιπλέον συσκευή USB." },
    { id: 5, name: "KeyFlex Mechanical Keyboard", price: "179.00 €", stock: 5, desc: "Μηχανικό εργονομικό πληκτρολόγιο με hot-swappable διακόπτες, RGB φωτισμό και αθόρυβη πληκτρολόγηση." },
    { id: 6, name: "ZenFlow Smart Water Bottle", price: "45.00 €", stock: 20, desc: "Έξυπνο θερμός 500ml με αυτόματο καθαρισμό UV-C, ψηφιακή ένδειξη θερμοκρασίας και υπενθύμιση ενυδάτωσης." }
];

export default function LiveAvatarDemoPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [statusLogs, setStatusLogs] = useState<string[]>([
        "[System] Έτοιμο για σύνδεση με το Live Avatar..."
    ]);

    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString();
        setStatusLogs(prev => [...prev, `[${time}] ${msg}`]);
    };

    const handleStartAvatar = async () => {
        setIsLoading(true);
        addLog("Ξεκινάει η προετοιμασία σύνδεσης με LiveAvatar API & Gemini...");

        try {
            const res = await fetch("/api/liveavatar/setup", {
                method: "POST"
            });
            const data = await res.json();

            if (data.success && data.url) {
                addLog("Το LiveAvatar δημιουργήθηκε με επιτυχία!");
                addLog("Φόρτωση WebRTC Iframe...");
                setAvatarUrl(data.url);
            } else {
                addLog(`Σφάλμα: ${data.error || "Αποτυχία εκκίνησης"}`);
            }
        } catch (err: any) {
            addLog(`Σφάλμα δικτύου: ${err?.message || "Error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#070b14] text-white flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow pt-24 pb-20 container mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 mb-10 border-b border-slate-800 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" /> LiveAvatar + Google Gemini Demo
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-light text-white">
                            Interactive Video AI Customer Support
                        </h1>
                        <p className="text-slate-400 text-sm font-light mt-1">
                            Ζωντανή επίδειξη ψηφιακού εκπροσώπου (AI Video Avatar) με φωνητική διαδραστικότητα σε φυσικά Ελληνικά.
                        </p>
                    </div>

                    <Link 
                        href="/ai-agents" 
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider border border-slate-700 transition-colors flex items-center gap-2"
                    >
                        <span>Επιστροφή στους AI Agents</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Main 2-column layout: E-shop products + Avatar Sidebar */}
                <div className="grid lg:grid-cols-12 gap-10 items-start">
                    {/* Left: Products Showcase */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-200">Προϊόντα Καταστήματος (E-Shop Catalog)</h2>
                            <span className="text-xs text-slate-500 font-mono">6 Ενδεικτικά Προϊόντα</span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {sampleProducts.map(p => (
                                <div key={p.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                                    <div>
                                        <div className="w-full h-32 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-800 flex items-center justify-center text-xs font-mono text-slate-500 mb-3">
                                            {p.name}
                                        </div>
                                        <h3 className="text-sm font-bold text-white mb-1">{p.name}</h3>
                                        <p className="text-xs text-slate-400 font-light leading-relaxed mb-4">{p.desc}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                                        <span className="text-base font-bold text-cyan-400">{p.price}</span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            Απόθεμα: {p.stock}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Live Avatar Support Panel */}
                    <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-6 shadow-2xl relative">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] uppercase tracking-wider mb-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    AI Live Assistant
                                </span>
                                <h3 className="text-lg font-bold text-white">Live Customer Support</h3>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">WebRTC HD</span>
                        </div>

                        {/* Avatar Display Box */}
                        <div className="relative aspect-[3/4] w-full rounded-2xl bg-black border border-slate-800 overflow-hidden flex items-center justify-center mb-5">
                            {avatarUrl ? (
                                <iframe 
                                    src={avatarUrl}
                                    allow="microphone; camera; display-capture"
                                    className="w-full h-full border-none"
                                />
                            ) : (
                                <div className="text-center p-6 space-y-4">
                                    <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/10">
                                        <Bot className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">Το Avatar είναι σε αναμονή</p>
                                        <p className="text-xs text-slate-500 font-light mt-1">
                                            Πατήστε το κουμπί παρακάτω για να συνδεθείτε ζωντανά με το AI Avatar.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Connect Button */}
                        {!avatarUrl && (
                            <button
                                onClick={handleStartAvatar}
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Προετοιμασία Avatar (Gemini)...</span>
                                    </>
                                ) : (
                                    <>
                                        <Mic className="w-5 h-5" />
                                        <span>Σύνδεση με Live AI Avatar</span>
                                    </>
                                )}
                            </button>
                        )}

                        {/* Status Logs */}
                        <div className="p-3 bg-black/60 rounded-xl border border-slate-800/80 font-mono text-[11px] text-emerald-400 max-h-32 overflow-y-auto space-y-1">
                            {statusLogs.map((log, idx) => (
                                <p key={idx} className="leading-tight">{log}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
