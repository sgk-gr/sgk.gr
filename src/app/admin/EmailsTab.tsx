import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Mail, CheckCircle2, AlertCircle, RefreshCcw, Send, Check, Users, Loader2, X, Trash2, Plus } from "lucide-react";
import { buildProfessionalEmailHtml } from "@/lib/emailTemplates";

const templates = [
  {
    name: "Κενό (Σύνταξη από την αρχή)",
    subject: "",
    body: "",
    defaultButtonText: "",
    defaultButtonLink: ""
  },
  {
    name: "🔥 Ειδική Προσφορά Eshop στα 1.500€",
    subject: "Ειδική Προσφορά: Κατασκευή Eshop στα 1.500€",
    body: `<h2>Αποκτήστε το δικό σας Eshop σήμερα! 🎉</h2>
<p>Γεια σας,</p>
<p>Θέλουμε να σας προσφέρουμε μια ειδική έκπτωση για την κατασκευή του Eshop σας στην προνομιακή τιμή των <strong>1.500€</strong>.</p>
<p><strong>Τι περιλαμβάνει η προσφορά μας:</strong></p>
<ul>
  <li><strong>Υψηλή Ταχύτητα:</strong> Φιλοξενία σε VPS servers για άμεσο φόρτωμα.</li>
  <li><strong>Mobile First:</strong> Σχεδιασμός προσαρμοσμένος τέλεια για αγορές από κινητά.</li>
  <li><strong>Έτοιμες Διασυνδέσεις:</strong> Courier & όλες τις ελληνικές τράπεζες.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να ξεκινήσουμε!</p>`,
    defaultButtonText: "Δείτε την Προσφορά",
    defaultButtonLink: "https://www.sgk.gr/eshop-offer"
  },
  {
    name: "📞 Follow-up Επικοινωνία",
    subject: "Σχετικά με το ενδιαφέρον σας για Eshop",
    body: `<h2>Θέλετε να συζητήσουμε τις ανάγκες σας; 🤝</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας σχετικά με το αίτημα προσφοράς που συμπληρώσατε στην ιστοσελίδα της <strong>SGK Digital</strong>.</p>
<p>Θα θέλαμε να προγραμματίσουμε μια σύντομη κλήση 10 λεπτών για να λύσουμε οποιαδήποτε απορία έχετε σχετικά με την πλατφόρμα και να βρούμε την κατάλληλη λύση για εσάς.</p>
<p>Ποια ημέρα και ώρα σας εξυπηρετεί για μια σύντομη κουβέντα;</p>`,
    defaultButtonText: "",
    defaultButtonLink: ""
  },
  {
    name: "📈 Case Study: Vaia Charms (+300% Πωλήσεις)",
    subject: "Πώς η Βάια τριπλασίασε τις πωλήσεις της",
    body: `<h2>Δείτε πώς δουλεύουμε στην SGK Digital 🚀</h2>
<p>Γεια σας,</p>
<p>Θέλουμε να μοιραστούμε μαζί σας ένα success story από την κατασκευή eshop για το <strong>Vaia Charms</strong>.</p>
<p>Μετά τη μετάβαση στη δική μας πλατφόρμα, η επιχείρηση πέτυχε:</p>
<ul>
  <li><strong>100/100 σκορ ταχύτητας</strong> στην Google.</li>
  <li><strong>Αυξημένο SEO</strong> με κορυφαίες κατατάξεις.</li>
  <li><strong>Απρόσκοπτη εμπειρία</strong> στο κινητό (mobile optimized).</li>
</ul>
<p>Μπορούμε να σχεδιάσουμε μια αντίστοιχη στρατηγική επιτυχίας και για τη δική σας επιχείρηση!</p>`,
    defaultButtonText: "Δείτε το Case Study",
    defaultButtonLink: "https://www.sgk.gr/case-study/vaia-charms"
  }
];

export function EmailsTab() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campaignSubject, setCampaignSubject] = useState("");
  const [campaignBody, setCampaignBody] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [sendingProgress, setSendingProgress] = useState<{ current: number; total: number; active: boolean; statusText: string } | null>(null);
  const [singleLeadTarget, setSingleLeadTarget] = useState<any | null>(null);
  
  // Single Add Lead form state
  const [newEmail, setNewEmail] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [addingLead, setAddingLead] = useState(false);

  // Bulk Import state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importData, setImportData] = useState("");
  const [importingProgress, setImportingProgress] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sgk_mails")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Σφάλμα φόρτωσης λίστας email");
      console.error(error);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAddSingleLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      toast.error("Παρακαλώ εισάγετε ένα email");
      return;
    }
    const emailLower = newEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) {
      toast.error("Μη έγκυρο format email");
      return;
    }

    try {
      setAddingLead(true);
      // Check if duplicate
      const { data: existing, error: checkError } = await supabase
        .from("sgk_mails")
        .select("id")
        .eq("email", emailLower)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existing) {
        toast.error("Αυτό το email υπάρχει ήδη στη λίστα!");
        return;
      }

      const { error: insertError } = await supabase
        .from("sgk_mails")
        .insert({
          email: emailLower,
          first_name: newFirstName.trim() || null,
          last_name: newLastName.trim() || null,
          marketing_consent: true,
          unsubscribe_token: crypto.randomUUID(),
          email_sequence_step: 4, // skip sequence, campaigns only
          unsubscribed: false,
          converted: true
        });

      if (insertError) throw insertError;

      toast.success("Το email προστέθηκε με επιτυχία!");
      setNewEmail("");
      setNewFirstName("");
      setNewLastName("");
      await fetchLeads();
    } catch (err: any) {
      console.error(err);
      toast.error(`Σφάλμα κατά την προσθήκη: ${err.message || "Άγνωστο σφάλμα"}`);
    } finally {
      setAddingLead(false);
    }
  };

  const handleDeleteLead = async (id: string, email: string) => {
    if (!window.confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε το email: ${email};`)) {
      return;
    }
    
    const { error } = await supabase
      .from("sgk_mails")
      .delete()
      .eq("id", id);
      
    if (error) {
      toast.error("Σφάλμα κατά τη διαγραφή");
      console.error(error);
    } else {
      toast.success("Διαγράφηκε επιτυχώς!");
      setSelectedLeads(prev => prev.filter(item => item !== id));
      fetchLeads();
    }
  };

  const handleDeleteSelectedLeads = async () => {
    if (selectedLeads.length === 0) return;
    
    if (!window.confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε τα ${selectedLeads.length} επιλεγμένα email;`)) {
      return;
    }
    
    const { error } = await supabase
      .from("sgk_mails")
      .delete()
      .in("id", selectedLeads);
      
    if (error) {
      toast.error("Σφάλμα κατά τη διαγραφή");
      console.error(error);
    } else {
      toast.success("Τα επιλεγμένα email διαγράφηκαν επιτυχώς!");
      setSelectedLeads([]);
      fetchLeads();
    }
  };

  const handleSendCampaign = async () => {
    const targets = singleLeadTarget 
      ? [singleLeadTarget] 
      : leads.filter(l => selectedLeads.includes(l.id));

    if (targets.length === 0 || !campaignSubject || !campaignBody) {
      toast.error("Συμπληρώστε Θέμα και Περιεχόμενο");
      return;
    }

    setSendingProgress({
      current: 0,
      total: targets.length,
      active: true,
      statusText: `Προετοιμασία αποστολής σε ${targets.length} παραλήπτες...`
    });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < targets.length; i++) {
      const lead = targets[i];
      setSendingProgress(prev => prev ? {
        ...prev,
        current: i + 1,
        statusText: `Αποστολή στο ${lead.email}... (${i + 1}/${targets.length})`
      } : null);

      try {
        const unsubscribeToken = lead.unsubscribe_token || crypto.randomUUID();
        const bodyHtml = campaignBody.replace(/\n/g, '<br />');

        const finalBody = buildProfessionalEmailHtml({
          businessName: lead.first_name || lead.company || "Συνεργάτη",
          subject: campaignSubject,
          bodyHtml: bodyHtml,
          buttonText: buttonText || undefined,
          buttonLink: buttonLink || undefined,
          unsubscribeToken: unsubscribeToken,
          industry: lead.company,
        });

        const response = await fetch("https://xrmvingehhiymchoggka.supabase.co/functions/v1/send-nurture-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            email: lead.email,
            unsubscribe_token: unsubscribeToken,
            customSubject: campaignSubject,
            customHtml: finalBody,
            step: 1,
          })
        });

        if (!response.ok) {
          throw new Error("Failed");
        }
        successCount++;
      } catch (error) {
        console.error("Error sending to:", lead.email, error);
        failCount++;
      }
    }

    setSendingProgress(prev => prev ? {
      ...prev,
      statusText: `Ολοκληρώθηκε! Επιτυχία: ${successCount}, Αποτυχία: ${failCount}`
    } : null);

    toast.success(`Η αποστολή ολοκληρώθηκε! (${successCount} επιτυχείς, ${failCount} αποτυχίες)`);
    setSelectedLeads([]);
    setCampaignSubject("");
    setCampaignBody("");
    setButtonText("");
    setButtonLink("");
    
    setTimeout(() => {
      setSendingProgress(null);
      setIsCampaignModalOpen(false);
    }, 2500);

    await fetchLeads();
  };

  const handleImportLeads = async () => {
    if (!importData.trim()) {
      toast.error("Παρακαλώ εισάγετε δεδομένα");
      return;
    }

    setImportingProgress(true);
    
    try {
      const { data: existingLeads, error: fetchError } = await supabase
        .from("sgk_mails")
        .select("email");

      if (fetchError) throw fetchError;

      const existingSet = new Set((existingLeads || []).map(l => l.email.toLowerCase()));
      const lines = importData.split("\n");
      const newLeads: any[] = [];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let skippedCount = 0;

      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        let email = "";
        let first_name = "";
        let last_name = "";

        if (trimmed.includes(",")) {
          const parts = trimmed.split(",").map(p => p.trim());
          email = parts[0];
          first_name = parts[1] || "";
          last_name = parts[2] || "";
        } else {
          email = trimmed;
        }

        const emailLower = email.toLowerCase();

        if (emailRegex.test(email)) {
          if (existingSet.has(emailLower)) {
            skippedCount++;
          } else {
            existingSet.add(emailLower);
            newLeads.push({
              email,
              first_name,
              last_name,
              type: "imported",
              marketing_consent: true,
              email_sequence_step: 4,
              unsubscribe_token: crypto.randomUUID(),
              unsubscribed: false,
              converted: true
            });
          }
        }
      });

      if (newLeads.length === 0) {
        if (skippedCount > 0) {
          toast.info(`Όλα τα εισαχθέντα emails (${skippedCount}) υπάρχουν ήδη στη λίστα!`);
        } else {
          toast.error("Δεν βρέθηκαν έγκυρα emails");
        }
        setImportingProgress(false);
        return;
      }

      const { error } = await supabase
        .from("sgk_mails")
        .insert(newLeads);

      if (error) throw error;

      if (skippedCount > 0) {
        toast.success(`Εισήχθησαν ${newLeads.length} νέα emails! (${skippedCount} διπλότυπα παρακάμφθηκαν)`);
      } else {
        toast.success(`Επιτυχής εισαγωγή ${newLeads.length} emails!`);
      }

      setImportData("");
      setIsImportModalOpen(false);
      await fetchLeads();
    } catch (err: any) {
      console.error("Error importing:", err);
      toast.error(`Σφάλμα κατά την εισαγωγή: ${err.message || "Άγνωστο σφάλμα"}`);
    } finally {
      setImportingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <RefreshCcw className="animate-spin text-[#3b5bdb]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Add New Email Form */}
      <div className="bg-white/60 backdrop-blur-xl border border-gray-200/80 p-6 rounded-2xl shadow-xl">
        <h3 className="text-sm font-black text-gray-900 italic tracking-wide uppercase mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#3b5bdb]" />
          Προσθηκη Νεου Email
        </h3>
        <form onSubmit={handleAddSingleLead} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email *</label>
            <input 
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="π.χ. info@example.com"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-xs font-semibold focus:border-[#3b5bdb]/50 outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Όνομα (Προαιρετικό)</label>
            <input 
              type="text"
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
              placeholder="π.χ. Ιωάννης"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-xs font-semibold focus:border-[#3b5bdb]/50 outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Επώνυμο (Προαιρετικό)</label>
            <input 
              type="text"
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
              placeholder="π.χ. Παπαδόπουλος"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-xs font-semibold focus:border-[#3b5bdb]/50 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={addingLead}
            className="w-full bg-[#3b5bdb] text-white rounded-xl py-2.5 text-xs font-black uppercase tracking-wider hover:bg-[#3b5bdb]/90 transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
          >
            {addingLead ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Προσθηκη
          </button>
        </form>
      </div>

      {/* Leads Header / Actions */}
      <div className="bg-white/40 backdrop-blur-xl border border-gray-200/50 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-gray-900 italic tracking-wide uppercase flex items-center gap-2">
              <Mail className="text-[#3b5bdb]" />
              Λιστα Παραληπτων Email ({leads.length})
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider italic">
              Διαχειριστείτε τη λίστα email και στείλτε καμπάνιες με Live Preview
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {selectedLeads.length > 0 && (
              <>
                <button
                  onClick={() => {
                    setSingleLeadTarget(null);
                    setCampaignSubject("");
                    setCampaignBody("");
                    setButtonText("");
                    setButtonLink("");
                    setIsCampaignModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#3b5bdb] text-white rounded-xl hover:bg-[#3b5bdb]/90 transition-all text-xs font-black uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  <Send size={12} />
                  Μαζικη Αποστολη ({selectedLeads.length})
                </button>
                <button
                  onClick={handleDeleteSelectedLeads}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all text-xs font-black uppercase tracking-wider shadow-md cursor-pointer"
                >
                  <Trash2 size={12} />
                  Διαγραφη ({selectedLeads.length})
                </button>
              </>
            )}
            <button
              onClick={() => {
                setImportData("");
                setIsImportModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all text-xs font-black uppercase tracking-wider shadow-md cursor-pointer"
            >
              <Users size={12} />
              Εισαγωγη απο Λιστα
            </button>
            <button 
              onClick={fetchLeads}
              className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer text-slate-600"
              title="Ανανέωση"
            >
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="mt-6 rounded-xl border border-gray-200/80 overflow-hidden bg-white/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      checked={leads.length > 0 && leads.filter(l => !l.unsubscribed).every(l => selectedLeads.includes(l.id))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeads(leads.filter(l => !l.unsubscribed).map(l => l.id));
                        } else {
                          setSelectedLeads([]);
                        }
                      }}
                      className="rounded border-gray-300 text-[#3b5bdb] focus:ring-[#3b5bdb] h-4 w-4 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Email / Όνομα</th>
                  <th className="py-3 px-4">Ημ/νία Εγγραφής</th>
                  <th className="py-3 px-4 text-center">Κατάσταση</th>
                  <th className="py-3 px-4 text-center">Ενέργειες</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-semibold text-slate-700">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 text-center">
                      {!lead.unsubscribed ? (
                        <input 
                          type="checkbox" 
                          checked={selectedLeads.includes(lead.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLeads(prev => [...prev, lead.id]);
                            } else {
                              setSelectedLeads(prev => prev.filter(id => id !== lead.id));
                            }
                          }}
                          className="rounded border-gray-300 text-[#3b5bdb] focus:ring-[#3b5bdb] h-4 w-4 cursor-pointer"
                        />
                      ) : (
                        <input 
                          type="checkbox" 
                          disabled 
                          className="rounded border-gray-200 bg-gray-50 h-4 w-4 cursor-not-allowed opacity-50"
                        />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{lead.email}</div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        {lead.first_name || lead.last_name ? `${lead.first_name || ""} ${lead.last_name || ""}` : "-"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {new Date(lead.created_at).toLocaleDateString("el-GR")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {lead.unsubscribed ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-700">Unsubscribed</span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">Active</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {!lead.unsubscribed && (
                          <button
                            onClick={() => {
                              setSingleLeadTarget(lead);
                              setCampaignSubject("");
                              setCampaignBody("");
                              setButtonText("");
                              setButtonLink("");
                              setIsCampaignModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#3b5bdb]/10 text-[#3b5bdb] hover:bg-[#3b5bdb] hover:text-white rounded-xl transition-all text-xs font-bold uppercase cursor-pointer"
                          >
                            <Mail size={12} />
                            Αποστολη
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteLead(lead.id, lead.email)}
                          className="inline-flex items-center justify-center p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-100"
                          title="Διαγραφή"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">
                      Δεν βρέθηκαν email στη λίστα
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Campaign Email Modal */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden border border-gray-100 flex flex-col h-[85vh] max-h-[750px] animate-scale-up">
            {/* Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-gray-150 flex justify-between items-center">
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider italic flex items-center gap-2">
                <Mail className="text-[#3b5bdb]" size={18} />
                {singleLeadTarget 
                  ? `Αποστολη Email στο ${singleLeadTarget.email}` 
                  : `Μαζικη Αποστολη (${singleLeadTarget ? 1 : selectedLeads.length} παραληπτες)`}
              </h3>
              <button 
                onClick={() => {
                  if (sendingProgress?.active) return;
                  setIsCampaignModalOpen(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                disabled={sendingProgress?.active}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-hidden min-h-0">
              {sendingProgress ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  {sendingProgress.current < sendingProgress.total ? (
                    <Loader2 className="animate-spin text-[#3b5bdb] w-12 h-12" />
                  ) : (
                    <CheckCircle2 className="text-emerald-500 w-12 h-12 animate-bounce" />
                  )}
                  <p className="font-black text-gray-800 text-sm uppercase tracking-wider italic">{sendingProgress.statusText}</p>
                  <div className="w-full bg-gray-150 rounded-full h-2.5 max-w-xs overflow-hidden">
                    <div 
                      className="bg-[#3b5bdb] h-full transition-all duration-300"
                      style={{ width: `${(sendingProgress.current / sendingProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
                  {/* Left Column: Form Editor */}
                  <div className="space-y-4 flex flex-col h-full min-h-0 overflow-y-auto pr-1">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Πρότυπο (Template)</label>
                      <select
                        onChange={(e) => {
                          const idx = parseInt(e.target.value);
                          setCampaignSubject(templates[idx].subject);
                          setCampaignBody(templates[idx].body);
                          setButtonText(templates[idx].defaultButtonText || "");
                          setButtonLink(templates[idx].defaultButtonLink || "");
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b5bdb]/50 text-gray-900 text-xs font-semibold bg-white cursor-pointer"
                      >
                        {templates.map((t, i) => (
                          <option key={i} value={i}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Θέμα Email (Subject)</label>
                      <input 
                        type="text"
                        value={campaignSubject}
                        onChange={(e) => setCampaignSubject(e.target.value)}
                        placeholder="π.χ. Το νέο σας hosting ενεργοποιήθηκε!"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b5bdb]/50 text-gray-900 text-xs font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Κείμενο Κουμπιού (Προαιρετικό)</label>
                        <input 
                          type="text"
                          value={buttonText}
                          onChange={(e) => setButtonText(e.target.value)}
                          placeholder="π.χ. Είσοδος στο Webmail"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b5bdb]/50 text-gray-900 text-xs font-semibold bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Σύνδεσμος Κουμπιού (Link)</label>
                        <input 
                          type="text"
                          value={buttonLink}
                          onChange={(e) => setButtonLink(e.target.value)}
                          placeholder="π.χ. https://webmail.yolo8.eu/..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b5bdb]/50 text-gray-900 text-xs font-semibold bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Περιεχόμενο Email (HTML ή απλό κείμενο)</label>
                      <textarea 
                        value={campaignBody}
                        onChange={(e) => setCampaignBody(e.target.value)}
                        placeholder="Γράψτε το μήνυμά σας εδώ..."
                        className="w-full flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b5bdb]/50 text-gray-900 font-sans text-xs resize-none overflow-y-auto min-h-[150px]"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase italic leading-tight">
                      💡 Στο κάτω μέρος του email θα προστεθεί αυτόματα το responsive layout της <strong>SGK Digital</strong> με τα snappi χρώματα και η υπογραφή μας.
                    </p>
                  </div>

                  {/* Right Column: Live Email Preview */}
                  <div className="flex flex-col space-y-2 h-full min-h-0">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Προεπισκόπηση Email (Live Preview)</label>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse">● Live</span>
                    </div>
                    <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 shadow-inner min-h-0 bg-[#f0f2f5]">
                      <iframe
                        key={campaignBody + campaignSubject + buttonText + buttonLink}
                        srcDoc={(() => {
                          if (!campaignBody) return `<html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial,sans-serif;color:#999;font-size:14px;background:#f0f2f5;"><div style="text-align:center;"><div style="font-size:32px;margin-bottom:12px;">📧</div><div>Το περιεχόμενο του email<br>θα εμφανιστεί εδώ...</div></div></body></html>`;
                          
                          const sampleLead = singleLeadTarget || leads.find(l => selectedLeads.includes(l.id));
                          const businessName = sampleLead ? (sampleLead.first_name || "Συνεργάτη") : "Συνεργάτη";
                          
                          const bodyHtml = campaignBody.replace(/\n/g, '<br />');

                          return buildProfessionalEmailHtml({
                            businessName: businessName,
                            subject: campaignSubject,
                            bodyHtml: bodyHtml,
                            buttonText: buttonText || undefined,
                            buttonLink: buttonLink || undefined,
                            unsubscribeToken: "preview-token",
                            industry: sampleLead?.company,
                          });
                        })()}
                        className="w-full h-full border-0"
                        title="Email Preview"
                        sandbox="allow-same-origin"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {!sendingProgress && (
              <div className="bg-slate-50 px-6 py-4 border-t border-gray-150 flex justify-end gap-3">
                <button
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Ακύρωση
                </button>
                <button
                  onClick={handleSendCampaign}
                  disabled={!campaignSubject || !campaignBody}
                  className="px-5 py-2 text-xs font-black uppercase tracking-wider text-white bg-[#3b5bdb] rounded-xl hover:bg-[#3b5bdb]/90 disabled:opacity-50 flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Send size={12} />
                  Αποστολη Email
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Import Leads Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-gray-150 flex justify-between items-center">
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider italic flex items-center gap-2">
                <Users className="text-emerald-600" size={18} />
                Εισαγωγη Email απο Λιστα
              </h3>
              <button 
                onClick={() => {
                  if (importingProgress) return;
                  setIsImportModalOpen(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                disabled={importingProgress}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {importingProgress ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <Loader2 className="animate-spin text-emerald-600 w-12 h-12" />
                  <p className="font-black text-gray-800 text-sm uppercase tracking-wider italic">Γίνεται εισαγωγή των emails...</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                    Λίστα Emails (1 ανά γραμμή ή Email, Όνομα, Επίθετο)
                  </label>
                  <textarea 
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    rows={6}
                    placeholder={`Format: 1 ανά γραμμή\n\ninfo@example.com\ncontact@example.com, Γιάννης, Παπαδόπουλος`}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600 text-gray-900 focus:ring-1 focus:ring-emerald-600 font-mono text-xs resize-none"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            {!importingProgress && (
              <div className="bg-slate-50 px-6 py-4 border-t border-gray-150 flex justify-end gap-3">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Ακύρωση
                </button>
                <button
                  onClick={handleImportLeads}
                  disabled={!importData.trim()}
                  className="px-5 py-2 text-xs font-black uppercase tracking-wider text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-md disabled:opacity-50 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Users size={12} />
                  Εισαγωγη
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
