"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Globe, Clock, Activity, BarChart3, RefreshCcw, 
  Monitor, Smartphone, Tablet, Laptop, Share2, History,
  TrendingUp, MousePointer2, Eye, MapPin, Zap, User, 
  ArrowUpRight, AlertCircle, Search, Radio, Settings, Bell, 
  ChevronDown, Hexagon, ShieldCheck, Target, Layers,
  Compass, PieChart as PieIcon, ArrowRight, CornerDownRight
} from "lucide-react";
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, 
  CartesianGrid, BarChart, Bar, Cell, PieChart, Pie
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

// Εγκατάσταση Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- Τύποι Δεδομένων ---
interface Visitor {
  session_id: string;
  current_path: string;
  city: string;
  country_name: string;
  device_type: string;
  max_scroll: number;
  duration_seconds: number;
  visit_count?: number;
  event_type?: string;
  last_action?: string; 
  timestamp?: string;
  created_at?: string;
}

interface Stats {
  live: { count: number; visitors: Visitor[] };
  summary: {
    total_sessions: number;
    total_pageviews: number;
    unique_today: number;
    avg_duration: number;
    avg_scroll: number;
  };
  devices: { device_type: string; count: number }[];
  referrers: { source: string; count: number }[];
  history: { date: string; count: number }[];
}

// --- Σταθερές & Στυλ ---
const CARD_STYLE = "bg-[#0f172a]/80 backdrop-blur-xl border border-[#1e293b] shadow-2xl";

const getFormatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}λ ${s}δ` : `${Math.floor(seconds)}δ`;
};

const getDeviceIcon = (type: string) => {
  if (type === "Mobile") return <Smartphone className="w-4 h-4" />;
  if (type === "Tablet") return <Tablet className="w-4 h-4" />;
  return <Laptop className="w-4 h-4" />;
};

export default function EnhancedIntelDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentVisitors, setRecentVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [daysFilter, setDaysFilter] = useState("14");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [eventStream, setEventStream] = useState<any[]>([]);

  const prevLiveCount = useRef<number>(0);

  // Παράγωγα Analytics
  const popularPages = useMemo(() => {
    if (!stats?.live.visitors) return [];
    const counts: Record<string, number> = {};
    stats.live.visitors.forEach(v => {
      counts[v.current_path] = (counts[v.current_path] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, count]) => ({ path, count }));
  }, [stats?.live.visitors]);

  const retentionData = useMemo(() => {
    if (!stats?.summary) return { returningRate: 0, newUsers: 0, returningUsers: 0 };
    const returning = stats.summary.total_sessions - stats.summary.unique_today;
    const rate = stats.summary.total_sessions > 0 ? (returning / stats.summary.total_sessions) * 100 : 0;
    return {
      returningRate: Math.round(rate),
      newUsers: stats.summary.unique_today,
      returningUsers: Math.max(0, returning)
    };
  }, [stats?.summary]);

  const fetchStats = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_full_analytics_stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({ p_days_ago: parseInt(daysFilter) })
      });
      
      if (!response.ok) return;
      let data = await response.json();
      if (Array.isArray(data)) data = data[0];

      if (data && data.live) {
        const now = new Date();
        data.live.visitors = data.live.visitors.filter((v: Visitor) => {
          if (v.current_path === '/live' || v.current_path.includes('admin')) return false;
          if (v.timestamp) {
            const visitorTime = new Date(v.timestamp);
            const diffSeconds = (now.getTime() - visitorTime.getTime()) / 1000;
            return diffSeconds <= 35;
          }
          return true;
        });
        
        data.live.count = data.live.visitors.length;
        setStats(data);
        setLastUpdate(new Date());

        if (data.live.count > prevLiveCount.current && prevLiveCount.current !== 0) {
          toast.success("Νέο Σήμα SGK", {
            description: "Ένας επισκέπτης είναι ενεργός.",
            icon: <Zap className="w-4 h-4 text-[#10B981]" />,
          });
        }
        prevLiveCount.current = data.live.count;
      }
    } catch (e) {
      console.error("Σφάλμα:", e);
    } finally {
      setLoading(false);
      if (showRefresh) setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  const fetchRecentVisitors = async () => {
    try {
      // Παίρνουμε τα τελευταία events και τα ομαδοποιούμε ανά session_id
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;

      // Logic to get unique latest session entries
      const uniqueSessions: Record<string, Visitor> = {};
      data.forEach(item => {
          const meta = item.metadata || {};
          const sid = meta.session_id;
          if (sid && !uniqueSessions[sid]) {
              uniqueSessions[sid] = {
                  session_id: sid,
                  current_path: item.page_url,
                  city: meta.city || "Άγνωστη",
                  country_name: meta.country || "GR",
                  device_type: meta.device || "Desktop",
                  max_scroll: meta.scroll || 0,
                  duration_seconds: meta.duration || 0,
                  visit_count: meta.visit_count || 1,
                  created_at: item.created_at
              };
          }
      });

      setRecentVisitors(Object.values(uniqueSessions).slice(0, 50));
    } catch (e) {
      console.error("Historical Fetch Error:", e);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchStats(true);
    fetchRecentVisitors();
    const interval = setInterval(() => {
      fetchStats(false);
      if (activeTab === 'users') fetchRecentVisitors();
    }, 5000);
    return () => clearInterval(interval);
  }, [daysFilter, activeTab]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-white">
      <Activity className="w-16 h-16 text-[#10B981] animate-bounce" />
      <h1 className="text-xl font-bold mt-8 animate-pulse text-emerald-500 uppercase italic">Ανάκτηση Δεδομένων SGK...</h1>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#020617] text-[#94a3b8] font-sans selection:bg-emerald-500/30 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-[80px] hover:w-[260px] transition-all duration-500 bg-[#0f172a] border-r border-[#1e293b] flex flex-col items-center py-8 z-[60] group overflow-hidden shadow-2xl">
          <div className="mb-12 flex items-center justify-center group-hover:justify-start group-hover:px-6 w-full gap-4">
             <div className="p-2 bg-[#10B981] rounded-xl shadow-lg">
                <Hexagon className="w-6 h-6 text-[#020617]" />
             </div>
             <span className="hidden group-hover:block text-2xl font-black text-white italic animate-in fade-in duration-500">SGK <span className="text-[#10B981]">OPS</span></span>
          </div>

          <nav className="flex-1 w-full space-y-2 px-3">
             {[
               { id: "overview", label: "Επισκόπηση", icon: Globe },
               { id: "users", label: "Λίστα Χρηστών", icon: Users },
               { id: "sources", label: "Πηγές", icon: Compass },
               { id: "history", label: "Αρχείο", icon: History },
             ].map((item) => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`w-full flex items-center h-12 rounded-xl transition-all relative ${
                   activeTab === item.id ? 'bg-[#10B981] text-[#020617]' : 'hover:bg-[#1e293b] text-slate-400'
                 }`}
               >
                 <div className="min-w-[56px] flex justify-center"><item.icon className="w-5 h-5" /></div>
                 <span className="hidden group-hover:block text-sm font-bold italic tracking-tight">{item.label}</span>
               </button>
             ))}
          </nav>
      </aside>

      {/* --- ΚΥΡΙΩΣ ΠΕΡΙΒΑΛΛΟΝ --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#020617]">
         
         {/* HEADER */}
         <header className="h-[90px] px-10 border-b border-[#1e293b] flex items-center justify-between bg-[#020617]/80 backdrop-blur-md">
            <div>
               <h1 className="text-2xl font-black text-white italic tracking-tighter flex items-center gap-3">
                  <Activity className="w-6 h-6 text-emerald-500" />
                  SGK INTEL CENTER: {activeTab.toUpperCase()}
               </h1>
               <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Σύστημα Online</span>
               </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="bg-[#0f172a] px-5 py-2.5 rounded-2xl border border-[#1e293b] text-[11px] font-black text-slate-400 italic">
                   Συγχρονισμός: <span className="text-white">{lastUpdate.toLocaleTimeString()}</span>
                </div>
                <button onClick={() => fetchStats(true)} className="p-3 bg-[#10B981] text-[#020617] rounded-2xl hover:scale-105 transition-all">
                  <RefreshCcw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>
         </header>

         {/* CONTENT AREA */}
         <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            
            {activeTab === 'overview' && (
              <div className="space-y-10 animate-in fade-in duration-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: "Ζωντανά", val: stats?.live.count, icon: Radio, col: "text-emerald-400" },
                    { label: "Συνεδρίες", val: stats?.summary.total_sessions, icon: Target, col: "text-blue-400" },
                    { label: "Engagement", val: `${Math.round(stats?.summary.avg_scroll || 0)}%`, icon: Layers, col: "text-pink-400" },
                    { label: "Retention", val: `${retentionData.returningRate}%`, icon: ShieldCheck, col: "text-purple-400" },
                  ].map((c, i) => (
                    <Card key={i} className={CARD_STYLE + " p-6 border-b-4 border-b-emerald-500/20"}>
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-2 italic tracking-widest">{c.label}</p>
                      <div className="flex items-center justify-between">
                         <span className={`text-4xl font-black italic ${c.col}`}>{c.val ?? "0"}</span>
                         <c.icon className={`w-8 h-8 opacity-20 ${c.col}`} />
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <Card className={CARD_STYLE + " lg:col-span-2 p-8"}>
                      <CardTitle className="text-sm font-black text-white italic uppercase tracking-widest mb-6">Ροή Επισκέψεων 24h</CardTitle>
                      <div className="h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.history || []}>
                               <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981" stopOpacity={0.2}/><stop offset="100%" stopColor="#10B981" stopOpacity={0}/></linearGradient></defs>
                               <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                               <XAxis dataKey="date" hide />
                               <YAxis hide />
                               <Area type="monotone" dataKey="count" stroke="#10B981" strokeWidth={3} fill="url(#g)" />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                   </Card>
                   <Card className={CARD_STYLE + " p-8"}>
                      <CardTitle className="text-sm font-black text-white italic uppercase tracking-widest mb-6">Κορυφαίες Σελίδες</CardTitle>
                      <div className="space-y-4">
                         {popularPages.map((p, i) => (
                            <div key={i} className="flex justify-between items-center bg-[#020617] p-3 rounded-xl border border-[#1e293b]">
                               <span className="text-[10px] font-black text-slate-300 truncate max-w-[140px] italic">{p.path}</span>
                               <Badge className="bg-emerald-500/10 text-emerald-500 font-black">{p.count}</Badge>
                            </div>
                         ))}
                      </div>
                   </Card>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                {/* LIVE ΕΠΙΣΚΕΠΤΕΣ */}
                <Card className={CARD_STYLE}>
                  <CardHeader className="p-8 border-b border-[#1e293b] flex flex-row items-center justify-between">
                    <div>
                       <CardTitle className="text-lg font-black text-white italic uppercase tracking-tighter">Ζωντανοί Επισκέπτες ({stats?.live.count})</CardTitle>
                       <p className="text-[10px] font-black text-emerald-500/50 uppercase italic mt-1 animate-pulse">Ενεργά Σήματα Αυτή τη Στιγμή</p>
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[10px] font-black italic">LIVE MONITOR</div>
                  </CardHeader>
                  <Table>
                    <TableHeader className="bg-slate-900/50">
                      <TableRow className="border-[#1e293b] hover:bg-transparent">
                        <TableHead className="px-8 text-[10px] font-black text-slate-500 uppercase italic">Τοποθεσία / Πόλη</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-500 uppercase italic text-center">Κατάσταση</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-500 uppercase italic">Διαδρομή</TableHead>
                        <TableHead className="text-right px-8 text-[10px] font-black text-slate-500 uppercase italic">Διάρκεια</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats?.live.visitors.map((v) => (
                        <TableRow key={v.session_id} className="border-[#1e293b] hover:bg-emerald-500/5 transition-all font-bold italic">
                          <TableCell className="px-8 py-5">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500"><User className="w-4 h-4" /></div>
                               <div className="flex flex-col">
                                  <span className="text-white text-sm">{v.city || "Άγνωστη"}</span>
                                  <span className="text-[9px] text-[#10B981] font-black opacity-50 uppercase tracking-tighter">{v.country_name || "GR"}</span>
                               </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                             <Badge className="bg-emerald-500 text-[#020617] font-black text-[8px] uppercase italic">ONLINE</Badge>
                          </TableCell>
                          <TableCell className="text-[10px] font-black text-slate-400 font-mono tracking-tighter">{v.current_path}</TableCell>
                          <TableCell className="text-right px-8 text-white font-mono">{v.duration_seconds}δ</TableCell>
                        </TableRow>
                      ))}
                      {stats?.live.visitors.length === 0 && (
                        <TableRow><TableCell colSpan={4} className="h-32 text-center text-slate-600 font-black italic uppercase text-xs">Δεν υπάρχουν ενεργοί χρήστες</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>

                {/* ΠΡΟΣΦΑΤΟΙ ΕΠΙΣΚΕΠΤΕΣ (ΟΛΟΙ) */}
                <Card className={CARD_STYLE}>
                   <CardHeader className="p-8 border-b border-[#1e293b]">
                       <CardTitle className="text-lg font-black text-white italic uppercase tracking-tighter">Πρόσφατο Ιστορικό Επισκεπτών (Τελευταίοι 50)</CardTitle>
                       <p className="text-[10px] font-black text-slate-500 uppercase italic mt-1">Αρχείο Όλων των Επισκέψεων από τη Βάση SGK</p>
                   </CardHeader>
                   <div className="max-h-[600px] overflow-y-auto">
                      <Table>
                        <TableHeader className="bg-slate-900/50 sticky top-0 z-10">
                          <TableRow className="border-[#1e293b] hover:bg-transparent">
                            <TableHead className="px-8 text-[10px] font-black text-slate-500 uppercase italic">Επισκέπτης</TableHead>
                            <TableHead className="text-[10px] font-black text-slate-500 uppercase italic text-center">Τύπος</TableHead>
                            <TableHead className="text-[10px] font-black text-slate-500 uppercase italic">Τελευταία Σελίδα</TableHead>
                            <TableHead className="text-right px-8 text-[10px] font-black text-slate-500 uppercase italic">Ώρα Εισόδου</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentVisitors.map((v, i) => (
                            <TableRow key={v.session_id + i} className="border-[#1e293b] hover:bg-white/5 transition-all font-bold italic opacity-80 hover:opacity-100">
                              <TableCell className="px-8 py-4">
                                <div className="flex flex-col">
                                   <span className="text-slate-200 text-sm italic">{v.city}</span>
                                   <span className="text-[9px] text-slate-500 font-black uppercase">{v.device_type} Σύνδεση</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                 <Badge className={`font-black text-[8px] uppercase italic ${v.visit_count && v.visit_count > 1 ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                    {v.visit_count && v.visit_count > 1 ? `Returning #${v.visit_count}` : 'New Visitor'}
                                 </Badge>
                              </TableCell>
                              <TableCell className="text-[10px] font-black text-slate-400 font-mono tracking-tighter">{v.current_path}</TableCell>
                              <TableCell className="text-right px-8 text-slate-300 font-mono text-[11px]">
                                 {v.created_at ? new Date(v.created_at).toLocaleString('el-GR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                   </div>
                </Card>
              </div>
            )}

            {activeTab === 'sources' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in zoom-in-95 duration-500">
                 {stats?.referrers.map((r, i) => (
                    <Card key={i} className={CARD_STYLE + " p-10 flex flex-col items-center justify-center text-center gap-4 hover:border-emerald-500/50 transition-all group"}>
                       <Share2 className="w-12 h-12 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                       <span className="text-6xl font-black text-white italic">{r.count}</span>
                       <p className="text-[12px] font-black text-slate-500 uppercase tracking-widest italic">{r.source === 'direct' ? 'Άμεση Πρόσβαση' : r.source}</p>
                    </Card>
                 ))}
              </div>
            )}

            {activeTab === 'history' && (
              <Card className={CARD_STYLE + " p-10 animate-in fade-in duration-500"}>
                 <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter mb-10">Αρχείο Επισκεψιμότητας SGK</CardTitle>
                 <div className="h-[500px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={stats?.history || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="date" hide />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#475569' }} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', color: '#fff' }} />
                          <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </Card>
            )}

         </div>

         {/* FOOTER */}
         <footer className="h-[50px] bg-[#0f172a] border-t border-[#1e293b] flex items-center justify-between px-10 italic font-black text-[9px] text-slate-500 tracking-widest uppercase">
            <div className="flex gap-8">
               <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> SGK STATUS: ACTIVE</span>
               <span>VERSION 9.0.0 STABLE</span>
            </div>
            <div className="bg-[#10B981]/10 px-4 py-1 rounded-full border border-[#10B981]/20 text-[#10B981] font-black italic">
                ΕΝΕΡΓΗ ΔΙΑΧΕΙΡΙΣΗ
            </div>
         </footer>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10B981; }
      `}</style>
    </div>
  );
}
