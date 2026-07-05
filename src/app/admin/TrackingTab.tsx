"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, Eye, Clock, MousePointer, User, ExternalLink, 
  Brain, BarChart2, Calendar, RefreshCcw, ArrowRight, Smartphone, Monitor
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface TrackingSession {
  id: string;
  visitor_id: string;
  session_id: string;
  page_path: string;
  referrer: string;
  duration_seconds: number;
  clicks: Array<{ text: string; id: string; tag: string; timestamp: string }>;
  user_agent: string;
  created_at: string;
  updated_at: string;
}

export function TrackingTab() {
  const [sessions, setSessions] = useState<TrackingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<TrackingSession | null>(null);
  
  // Filters
  const [timeFilter, setTimeFilter] = useState<"24h" | "7d" | "all">("7d");
  const [pageFilter, setPageFilter] = useState<"all" | "payg" | "offer">("all");
  const [bounceFilter, setBounceFilter] = useState<boolean>(true); // hide sessions under 5s by default

  // AI Analytics State
  const [aiReport, setAiReport] = useState<string>("");
  const [generatingAi, setGeneratingAi] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("tracking_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        toast.error("Σφάλμα κατά τη φόρτωση των δεδομένων tracking.");
        console.error(error);
      } else if (data) {
        setSessions(data as TrackingSession[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Sessions
  const filteredSessions = sessions.filter(session => {
    // 1. Time Filter
    if (timeFilter === "24h") {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (new Date(session.created_at) < oneDayAgo) return false;
    } else if (timeFilter === "7d") {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      if (new Date(session.created_at) < sevenDaysAgo) return false;
    }

    // 2. Page Filter
    if (pageFilter === "payg" && !session.page_path.includes("pay-as-you-grow")) return false;
    if (pageFilter === "offer" && !session.page_path.includes("eshop-offer")) return false;

    // 3. Bounce Filter (hide sessions under 5 seconds)
    if (bounceFilter && session.duration_seconds < 5) return false;

    return true;
  });

  // Aggregated Stats
  const totalSessions = filteredSessions.length;
  const uniqueVisitors = new Set(filteredSessions.map(s => s.visitor_id)).size;
  const avgDuration = totalSessions > 0 
    ? Math.round(filteredSessions.reduce((acc, s) => acc + s.duration_seconds, 0) / totalSessions)
    : 0;

  const paygViews = filteredSessions.filter(s => s.page_path.includes("pay-as-you-grow")).length;
  const offerViews = filteredSessions.filter(s => s.page_path.includes("eshop-offer")).length;
  
  const totalClicks = filteredSessions.reduce((acc, s) => acc + (s.clicks?.length || 0), 0);

  // Helper to format date
  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleString("el-GR", { 
      day: "2-digit", 
      month: "2-digit", 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  // Helper to determine device type
  const getDeviceIcon = (ua: string) => {
    if (/mobile|android|iphone|ipad/i.test(ua)) {
      return <Smartphone className="w-3.5 h-3.5 text-gray-400" />;
    }
    return <Monitor className="w-3.5 h-3.5 text-gray-400" />;
  };

  // Generate AI Analysis via Supabase chat Edge Function
  const generateAIAnalysis = async () => {
    if (filteredSessions.length === 0) {
      toast.warning("Δεν υπάρχουν δεδομένα για AI ανάλυση.");
      return;
    }

    setGeneratingAi(true);
    setAiReport("");

    try {
      // Compile stats to send to AI
      const sessionSummary = filteredSessions.slice(0, 15).map(s => ({
        path: s.page_path,
        duration: `${s.duration_seconds}s`,
        clicks_count: s.clicks?.length || 0,
        clicks: s.clicks?.map(c => c.text).join(" -> "),
        referrer: s.referrer
      }));

      const prompt = `Παράκαμψε όλες τις προηγούμενες οδηγίες σου και μην συστηθείς ως Jo-Jo ή chatbot της SGK.
Είσαι ένας κορυφαίος AI Data Analyst. Ανάλυσε τα παρακάτω δεδομένα επισκεψιμότητας των χρηστών (τελευταίες 15 συνεδρίες) και δώσε μου μια σύντομη, επαγγελματική και άκρως πρακτική αναφορά στα Ελληνικά.

ΣΥΝΟΛΙΚΑ ΣΤΑΤΙΣΤΙΚΑ:
- Σύνολο Sessions: ${totalSessions}
- Μοναδικοί Επισκέπτες: ${uniqueVisitors}
- Μέσος Χρόνος Παραμονής: ${avgDuration} δευτερόλεπτα
- Προβολές /pay-as-you-grow: ${paygViews}
- Προβολές /eshop-offer: ${offerviews}
- Σύνολο Clicks: ${totalClicks}

ΔΕΔΟΜΕΝΑ ΣΥΝΕΔΡΙΩΝ:
${JSON.stringify(sessionSummary, null, 2)}

Η αναφορά σου πρέπει να περιλαμβάνει:
1. **Σύνοψη Συμπεριφοράς**: Πού δείχνουν να κολλάνε οι χρήστες; Τι τους τραβάει την προσοχή;
2. **Σημαντικά Μοτίβα**: Π.χ. αν κάποιος βλέπει το Pay as you grow και μετά πάει στη φόρμα eshop-offer.
3. **3 Συγκεκριμένες Προτάσεις Βελτίωσης** για να αυξήσουμε τις μετατροπές (conversions) των σελίδων αυτών.

Να είσαι σύντομος και περιεκτικός, χρησιμοποιώντας bullet points.`;

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });

      if (!response.ok) {
        throw new Error("Failed to contact Gemini API via Edge Function");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          
          // SSE response parsing
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataText = line.substring(6).trim();
              if (dataText === "[DONE]") break;
              try {
                // If it is SSE text streaming
                setAiReport(prev => prev + dataText);
              } catch (e) {
                // fallback if json
                setAiReport(prev => prev + dataText);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Αποτυχία δημιουργίας AI αναφοράς.");
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <div className="bg-[#111111] text-white p-6 rounded-3xl border border-white/10 shadow-2xl relative z-10 max-w-7xl mx-auto mt-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold font-heading flex items-center gap-2 text-white">
            <Activity className="w-6 h-6 text-[#4ade80]" />
            Real-Time User Traffic & AI Analytics
          </h2>
          <p className="text-sm text-white/50 mt-1">
            Παρακολούθηση συμπεριφοράς επισκεπτών στις σελίδες Pay As You Grow & Eshop Offer.
          </p>
        </div>
        <button 
          onClick={fetchData}
          className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Ανανέωση
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 mb-8">
        <div>
          <label className="block text-[10px] text-white/40 uppercase font-bold tracking-wider mb-2">Χρονικό Φίλτρο</label>
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setTimeFilter("24h")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${timeFilter === "24h" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
            >
              24 Ώρες
            </button>
            <button 
              onClick={() => setTimeFilter("7d")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${timeFilter === "7d" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
            >
              7 Ημέρες
            </button>
            <button 
              onClick={() => setTimeFilter("all")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${timeFilter === "all" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
            >
              Όλα
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-white/40 uppercase font-bold tracking-wider mb-2">Σελίδα Προορισμού</label>
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setPageFilter("all")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${pageFilter === "all" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
            >
              Όλες
            </button>
            <button 
              onClick={() => setPageFilter("payg")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${pageFilter === "payg" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
            >
              PAYG
            </button>
            <button 
              onClick={() => setPageFilter("offer")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${pageFilter === "offer" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
            >
              Offer
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-white/40 uppercase font-bold tracking-wider mb-2">Φιλτράρισμα Bounce</label>
          <button 
            onClick={() => setBounceFilter(!bounceFilter)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
              bounceFilter 
                ? "bg-[#4ade80]/10 border-[#4ade80]/20 text-[#4ade80]" 
                : "bg-white/5 border-white/10 text-white/60 hover:text-white"
            }`}
          >
            <span>Απόκρυψη Bounce (&lt;5 δευτ.)</span>
            <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full">
              {bounceFilter ? "Ενεργό" : "Ανενεργό"}
            </span>
          </button>
        </div>

        <div className="flex items-end">
          <div className="w-full text-right text-xs text-white/40 italic pb-2">
            Εμφανίζονται {filteredSessions.length} από {sessions.length} συνολικά sessions
          </div>
        </div>
      </div>

      {/* Aggregated Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block mb-1">Συνεδρίες (Sessions)</span>
          <div className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            {totalSessions}
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block mb-1">Μοναδικοί Χρήστες</span>
          <div className="text-3xl font-extrabold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            {uniqueVisitors}
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block mb-1">Μέσος Χρόνος</span>
          <div className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-400" />
            {avgDuration}s
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block mb-1">Συνολικά Clicks</span>
          <div className="text-3xl font-extrabold text-white flex items-center gap-2">
            <MousePointer className="w-5 h-5 text-yellow-400" />
            {totalClicks}
          </div>
        </div>
      </div>

      {/* Grid: Left - Lists / Right - AI Assistant & Detailed Session */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left List (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-400" />
            Ιστορικό Επισκέψεων
          </h3>

          {loading ? (
            <div className="h-64 flex items-center justify-center bg-white/5 rounded-2xl border border-white/5">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-white/5 text-white/40">
              <Eye className="w-8 h-8 mb-2 opacity-20" />
              Δεν βρέθηκαν συνεδρίες με τα επιλεγμένα φίλτρα.
            </div>
          ) : (
            <div className="bg-[#181818] rounded-2xl border border-white/5 overflow-hidden max-h-[500px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-white/50">
                    <th className="p-4">Ημ/νία & Ώρα</th>
                    <th className="p-4">Σελίδα</th>
                    <th className="p-4">Πηγή (Referrer)</th>
                    <th className="p-4">Διάρκεια</th>
                    <th className="p-4 text-center">Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredSessions.map((session) => (
                    <tr 
                      key={session.id} 
                      onClick={() => setSelectedSession(session)}
                      className={`hover:bg-white/5 cursor-pointer transition-colors ${selectedSession?.id === session.id ? "bg-white/10" : ""}`}
                    >
                      <td className="p-4 font-medium flex items-center gap-1.5">
                        {getDeviceIcon(session.user_agent)}
                        {formatDate(session.created_at)}
                      </td>
                      <td className="p-4 font-mono text-[10px] text-blue-400 max-w-[120px] truncate">
                        {session.page_path}
                      </td>
                      <td className="p-4 text-white/60 max-w-[120px] truncate">
                        {session.referrer || "-"}
                      </td>
                      <td className="p-4 font-bold text-green-400">
                        {session.duration_seconds}s
                      </td>
                      <td className="p-4 text-center font-bold text-yellow-400">
                        {session.clicks?.length || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Section (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Detailed Session Card */}
          {selectedSession ? (
            <div className="bg-[#181818] p-6 rounded-2xl border border-white/10 relative animate-in fade-in duration-300">
              <button 
                onClick={() => setSelectedSession(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white text-xs font-semibold"
              >
                Κλείσιμο
              </button>
              
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-1.5">
                <User className="w-4 h-4 text-purple-400" />
                Λεπτομέρειες Συνεδρίας
              </h3>

              <div className="space-y-3 text-xs border-b border-white/5 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-white/40">Visitor ID:</span>
                  <span className="font-mono text-[10px] select-all">{selectedSession.visitor_id.slice(0, 18)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Σελίδα:</span>
                  <span className="text-blue-400 font-mono text-[10px]">{selectedSession.page_path}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Referrer:</span>
                  <span className="text-white/80">{selectedSession.referrer || "Direct"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Διάρκεια:</span>
                  <span className="text-green-400 font-bold">{selectedSession.duration_seconds} δευτερόλεπτα</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">User Agent:</span>
                  <span className="text-white/60 text-[9px] max-w-[180px] truncate" title={selectedSession.user_agent}>
                    {selectedSession.user_agent}
                  </span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-yellow-400 mb-2 flex items-center gap-1.5">
                <MousePointer className="w-3.5 h-3.5" />
                Click Timeline
              </h4>

              {(!selectedSession.clicks || selectedSession.clicks.length === 0) ? (
                <p className="text-xs text-white/30 italic">Δεν καταγράφηκαν clicks σε αυτή τη συνεδρία.</p>
              ) : (
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {selectedSession.clicks.map((click, i) => (
                    <div key={i} className="bg-white/5 p-2 rounded-lg border border-white/5 text-[10px]">
                      <div className="flex justify-between text-[9px] text-white/40 mb-1">
                        <span>{click.tag} {click.id ? `#${click.id}` : ""}</span>
                        <span>{new Date(click.timestamp).toLocaleTimeString("el-GR")}</span>
                      </div>
                      <div className="text-white/95 font-semibold">
                        Κλικ στο: <span className="text-yellow-400">"{click.text}"</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* AI Behavioral Insights Panel */}
          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/60 p-6 rounded-2xl border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-indigo-400 animate-pulse" />
              <h3 className="text-base font-bold text-white">AI Behavioral Analysis</h3>
            </div>
            
            <p className="text-xs text-white/70 mb-4 leading-relaxed">
              Ανάλυση της συμπεριφοράς των επισκεπτών σου. Το AI μοντέλο Gemini θα επεξεργαστεί τις συνεδρίες και θα σου δώσει πρακτικές ιδέες.
            </p>

            {aiReport ? (
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-xs text-white/90 leading-relaxed max-h-[300px] overflow-y-auto mb-4 font-light whitespace-pre-line">
                {aiReport}
              </div>
            ) : null}

            <button
              disabled={generatingAi || filteredSessions.length === 0}
              onClick={generateAIAnalysis}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/10 disabled:opacity-50"
            >
              {generatingAi ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                  Ανάλυση σε εξέλιξη...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  📝 Δημιουργία AI Αναφοράς
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
