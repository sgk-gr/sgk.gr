import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Mail, CheckCircle2, AlertCircle, RefreshCcw, Send, Check, Users, Loader2, X, Trash2 } from "lucide-react";

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
  <li><strong>Έτοιμες Διασυνδέσεις:</strong> Google Merchant, Courier & όλες τις ελληνικές τράπεζες.</li>
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
  const [sending, setSending] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campaignSubject, setCampaignSubject] = useState("");
  const [campaignBody, setCampaignBody] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [sendingProgress, setSendingProgress] = useState<{ current: number; total: number; active: boolean; statusText: string } | null>(null);
  const [singleLeadTarget, setSingleLeadTarget] = useState<any | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importData, setImportData] = useState("");
  const [importConsent, setImportConsent] = useState(true);
  const [importStartSequence, setImportStartSequence] = useState<"campaign_only" | "sequence_start">("campaign_only");
  const [importingProgress, setImportingProgress] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sgk_mails")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Σφάλμα φόρτωσης leads");
      console.error(error);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSendNextEmail = async (lead: any) => {
    if (!lead.email) return;
    setSending(lead.id);
    try {
      const response = await fetch("/api/admin/emails/dynamic-followup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: lead.email,
          step: (lead.email_sequence_step || 1) + 1,
          unsubscribe_token: lead.unsubscribe_token
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Αποτυχία αποστολής");
      }
      
      toast.success(`Το email στάλθηκε επιτυχώς στο ${lead.email}`);
      await fetchLeads(); // Refresh data
    } catch (error: any) {
      toast.error(error.message || "Σφάλμα κατά την αποστολή email");
      console.error(error);
    } finally {
      setSending(null);
    }
  };

  const markAsConverted = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("sgk_mails")
      .update({ converted: !currentStatus })
      .eq("id", id);
      
    if (error) {
      toast.error("Σφάλμα κατά την ενημέρωση");
    } else {
      toast.success("Ενημερώθηκε επιτυχώς!");
      fetchLeads();
    }
  };

  const handleDeleteLead = async (id: string, email: string) => {
    if (!window.confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε το lead με email: ${email};`)) {
      return;
    }
    
    const { error } = await supabase
      .from("sgk_mails")
      .delete()
      .eq("id", id);
      
    if (error) {
      toast.error("Σφάλμα κατά τη διαγραφή του lead");
      console.error(error);
    } else {
      toast.success("Το lead διαγράφηκε επιτυχώς!");
      setSelectedLeads(prev => prev.filter(item => item !== id));
      fetchLeads();
    }
  };

  const handleDeleteSelectedLeads = async () => {
    if (selectedLeads.length === 0) return;
    
    if (!window.confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε τα ${selectedLeads.length} επιλεγμένα leads;`)) {
      return;
    }
    
    const { error } = await supabase
      .from("sgk_mails")
      .delete()
      .in("id", selectedLeads);
      
    if (error) {
      toast.error("Σφάλμα κατά τη διαγραφή των επιλεγμένων leads");
      console.error(error);
    } else {
      toast.success("Τα επιλεγμένα leads διαγράφηκαν επιτυχώς!");
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
        const response = await fetch("/api/admin/emails/dynamic-followup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: lead.email,
            unsubscribe_token: lead.unsubscribe_token,
            customSubject: campaignSubject,
            customHtml: (() => {
              let html = campaignBody.replace(/\n/g, '<br />');
              if (buttonText && buttonLink) {
                html += `
                  <div style="text-align: center; margin: 25px 0;">
                    <a href="${buttonLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 24px; background-color: #FF6B00; color: #ffffff; font-weight: bold; text-decoration: none; border-radius: 8px; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                      ${buttonText}
                    </a>
                  </div>
                `;
              }
              return html;
            })()
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

    toast.success(`Αποστολή ολοκληρώθηκε! (${successCount} επιτυχείς, ${failCount} αποτυχίες)`);
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
      // 1. Φόρτωση υπαρχόντων emails από τη βάση για έλεγχο διπλοτύπων
      const { data: existingLeads, error: fetchError } = await supabase
        .from("sgk_mails")
        .select("email");

      if (fetchError) {
        throw fetchError;
      }

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
            existingSet.add(emailLower); // Αποτροπή διπλοτύπων και μέσα στο ίδιο το κείμενο επικόλλησης
            newLeads.push({
              email,
              first_name,
              last_name,
              type: "imported",
              marketing_consent: importConsent,
              email_sequence_step: importStartSequence === "campaign_only" ? 4 : 1,
              unsubscribe_token: crypto.randomUUID(),
              unsubscribed: false,
              converted: importStartSequence === "campaign_only"
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

      if (error) {
        throw error;
      }

      if (skippedCount > 0) {
        toast.success(`Εισήχθησαν ${newLeads.length} νέα leads! (${skippedCount} διπλότυπα παρακάμφθηκαν)`);
      } else {
        toast.success(`Επιτυχής εισαγωγή ${newLeads.length} leads!`);
      }

      setImportData("");
      setIsImportModalOpen(false);
      await fetchLeads();
    } catch (err: any) {
      console.error("Error importing:", err);
      toast.error(`Σφάλμα κατά την εισαγωγή: ${err.message || err.details || "Άγνωστο σφάλμα"}`);
    } finally {
      setImportingProgress(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><RefreshCcw className="animate-spin text-vivid-primary" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="text-vivid-primary" />
          Email Marketing Leads
        </h2>
        <div className="flex items-center gap-3">
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-vivid-primary text-white rounded-lg hover:bg-vivid-primary/90 transition-all text-sm font-semibold shadow-glow animate-fade-in cursor-pointer"
              >
                <Users size={16} />
                Μαζική Αποστολή ({selectedLeads.length})
              </button>
              <button
                onClick={handleDeleteSelectedLeads}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-semibold cursor-pointer shadow-sm hover:shadow-md animate-fade-in"
              >
                <Trash2 size={16} />
                Διαγραφή ({selectedLeads.length})
              </button>
            </>
          )}
          <button
            onClick={() => {
              setImportData("");
              setImportConsent(true);
              setImportStartSequence("campaign_only");
              setIsImportModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-sm font-semibold cursor-pointer shadow-sm hover:shadow-md"
          >
            <Users size={16} />
            Εισαγωγή Leads
          </button>
          <button 
            onClick={fetchLeads}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 w-12 text-center">
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
                    className="rounded border-gray-300 text-vivid-primary focus:ring-vivid-primary h-4 w-4 cursor-pointer"
                  />
                </th>
                <th className="p-4 font-semibold text-gray-600">Email / Όνομα</th>
                <th className="p-4 font-semibold text-gray-600">Ημ/νία Εγγραφής</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Κουπόνι</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Status Ακολουθίας</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Πελάτης;</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Ενέργειες</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const step = lead.email_sequence_step || 1;
                const canSendNext = !lead.unsubscribed && !lead.converted && step < 4;
                
                return (
                  <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-center">
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
                          className="rounded border-gray-300 text-vivid-primary focus:ring-vivid-primary h-4 w-4 cursor-pointer"
                        />
                      ) : (
                        <input 
                          type="checkbox" 
                          disabled 
                          className="rounded border-gray-200 bg-gray-50 h-4 w-4 cursor-not-allowed opacity-50"
                        />
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{lead.email}</div>
                      <div className="text-sm text-gray-500">{lead.first_name} {lead.last_name}</div>
                      {!lead.marketing_consent && <span className="text-xs text-red-500 font-medium">No Consent</span>}
                      {lead.unsubscribed && <span className="text-xs text-red-500 font-medium ml-2">Unsubscribed</span>}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(lead.created_at).toLocaleDateString("el-GR")}
                    </td>
                    <td className="p-4 text-center">
                      {lead.coupon_code ? (
                        <span className="inline-block px-2.5 py-1 bg-orange-50 text-orange-700 rounded-md border border-orange-100 font-semibold font-mono text-xs shadow-sm animate-fade-in">
                          SGK-{lead.coupon_code}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-normal">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4].map(s => (
                          <div 
                            key={s} 
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              s <= step 
                                ? "bg-green-100 text-green-700" 
                                : "bg-gray-100 text-gray-400"
                            }`}
                            title={s <= step ? `Email #${s} Στάλθηκε` : `Email #${s} Εκκρεμεί`}
                          >
                            {s <= step ? <Check size={12} /> : s}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => markAsConverted(lead.id, lead.converted)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          lead.converted 
                            ? "bg-green-100 text-green-700 border border-green-200" 
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {lead.converted ? "Ναι" : "Όχι"}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {canSendNext ? (
                          <button
                            onClick={() => handleSendNextEmail(lead)}
                            disabled={sending === lead.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-vivid-primary/10 text-vivid-primary hover:bg-vivid-primary hover:text-white rounded-lg transition-all text-sm font-medium disabled:opacity-50 cursor-pointer"
                          >
                            {sending === lead.id ? <RefreshCcw size={14} className="animate-spin" /> : <Send size={14} />}
                            Στείλε #{step + 1}
                          </button>
                        ) : !lead.unsubscribed ? (
                          <button
                            onClick={() => {
                              setSingleLeadTarget(lead);
                              setCampaignSubject("");
                              setCampaignBody("");
                              setButtonText("");
                              setButtonLink("");
                              setIsCampaignModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition-all text-sm font-medium border border-emerald-100 cursor-pointer"
                          >
                            <Mail size={14} />
                            Γράψε Email
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">Δεν απαιτείται</span>
                        )}
                        <button
                          onClick={() => handleDeleteLead(lead.id, lead.email)}
                          className="inline-flex items-center justify-center p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          title="Διαγραφή Lead"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    Δεν βρέθηκαν leads
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Email Modal */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden border border-gray-100 flex flex-col h-[85vh] max-h-[750px]">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Mail className="text-vivid-primary" size={20} />
                {singleLeadTarget 
                  ? `Αποστολή Email στο ${singleLeadTarget.email}` 
                  : `Μαζική Αποστολή (${singleLeadTarget ? 1 : selectedLeads.length} παραλήπτες)`}
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
                    <Loader2 className="animate-spin text-vivid-primary w-12 h-12" />
                  ) : (
                    <CheckCircle2 className="text-emerald-500 w-12 h-12" />
                  )}
                  <p className="font-medium text-gray-800 text-lg">{sendingProgress.statusText}</p>
                  <div className="w-full bg-gray-100 rounded-full h-2 max-w-xs overflow-hidden">
                    <div 
                      className="bg-vivid-primary h-full transition-all duration-300"
                      style={{ width: `${(sendingProgress.current / sendingProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
                  {/* Left Column: Form Editor */}
                  <div className="space-y-4 flex flex-col h-full min-h-0">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Πρότυπο (Template)</label>
                      <select
                        onChange={(e) => {
                          const idx = parseInt(e.target.value);
                          setCampaignSubject(templates[idx].subject);
                          setCampaignBody(templates[idx].body);
                          setButtonText(templates[idx].defaultButtonText || "");
                          setButtonLink(templates[idx].defaultButtonLink || "");
                        }}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-vivid-primary text-gray-900 focus:ring-1 focus:ring-vivid-primary text-sm bg-white cursor-pointer"
                      >
                        {templates.map((t, i) => (
                          <option key={i} value={i}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Θέμα Email (Subject)</label>
                      <input 
                        type="text"
                        value={campaignSubject}
                        onChange={(e) => setCampaignSubject(e.target.value)}
                        placeholder="π.χ. Ειδική προσφορά για την κατασκευή του Eshop σας"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-vivid-primary text-gray-900 focus:ring-1 focus:ring-vivid-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Κείμενο Κουμπιού (Προαιρετικό)</label>
                        <input 
                          type="text"
                          value={buttonText}
                          onChange={(e) => setButtonText(e.target.value)}
                          placeholder="π.χ. Δείτε την Προσφορά"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-vivid-primary text-gray-900 focus:ring-1 focus:ring-vivid-primary text-sm bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Σύνδεσμος Κουμπιού (Link)</label>
                        <input 
                          type="text"
                          value={buttonLink}
                          onChange={(e) => setButtonLink(e.target.value)}
                          placeholder="π.χ. https://www.sgk.gr/eshop-offer"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-vivid-primary text-gray-900 focus:ring-1 focus:ring-vivid-primary text-sm bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 flex-1 flex flex-col min-h-0">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Περιεχόμενο Email (HTML ή απλό κείμενο)</label>
                      <textarea 
                        value={campaignBody}
                        onChange={(e) => setCampaignBody(e.target.value)}
                        placeholder="Γράψτε το μήνυμά σας εδώ... (Υποστηρίζει HTML tags όπως <strong>, <a>, <p> κλπ.)"
                        className="w-full flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-vivid-primary text-gray-900 focus:ring-1 focus:ring-vivid-primary font-sans text-sm resize-none overflow-y-auto min-h-0"
                      />
                    </div>
                    <p className="text-xs text-gray-400 font-medium">
                      💡 Χρησιμοποιήστε το tag <code className="bg-orange-50 px-1 py-0.5 rounded font-mono text-[11px] text-orange-600 font-bold">{"{{COUPON_BANNER}}"}</code> για να εμφανίσετε το προσωπικό κουπόνι του πελάτη (αν υπάρχει).<br />
                      💡 Στο κάτω μέρος του email θα προστεθεί αυτόματα η υπογραφή της <strong>SGK Digital</strong> και το link <strong>Unsubscribe</strong> για τη συμμόρφωση με το GDPR.
                    </p>
                  </div>

                  {/* Right Column: Live Email Preview */}
                  <div className="flex flex-col space-y-2 h-full min-h-0">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Προεπισκόπηση Email (Live Preview)</label>
                    <div className="bg-[#fcf8f5] border border-[#fbebe3] rounded-2xl p-4 font-sans text-sm text-gray-800 flex-1 overflow-y-auto shadow-inner min-h-0">
                      <div className="text-xs text-gray-400 mb-3 pb-3 border-b border-orange-100 flex flex-col gap-1">
                        <div><strong>Από:</strong> SGK Digital &lt;noreply@sgk.gr&gt;</div>
                        <div><strong>Θέμα:</strong> <span className="text-gray-700 font-medium">{campaignSubject || "(Χωρίς Θέμα)"}</span></div>
                      </div>
                      
                      <div style={{ fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", maxWidth: "100%", margin: "0 auto", padding: "10px 0" }}>
                        <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #f2e3db", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
                          <div 
                            className="prose prose-sm prose-orange max-w-none text-gray-800 leading-relaxed font-sans"
                            style={{ fontSize: "14px" }}
                            dangerouslySetInnerHTML={{ 
                              __html: (() => {
                                if (!campaignBody) return "<i style='color: #999;'>Το περιεχόμενο του email σας θα εμφανιστεί εδώ...</i>";
                                let html = campaignBody.replace(/\n/g, '<br />')
                                  .replace(/\{\{COUPON_BANNER\}\}/g, `
                                    <div style="background-color: #fff8f5; border: 2px dashed #FF6B00; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0; font-family: sans-serif;">
                                        <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0; font-weight: bold;">Ο ΠΡΟΣΩΠΙΚΟΣ ΣΑΣ ΚΩΔΙΚΟΣ ΠΡΟΣΦΟΡΑΣ (Έκπτωση 300€)</p>
                                        <span style="font-family: monospace; font-size: 28px; font-weight: bold; color: #FF6B00; letter-spacing: 3px;">SGK-9999</span>
                                        <p style="color: #888; font-size: 12px; margin: 8px 0 0 0; font-weight: bold; color: #c25100;">💰 Τελική Τιμή Eshop: 1.200€ (αντί για 1.500€)</p>
                                        <p style="color: #888; font-size: 11px; margin: 8px 0 0 0;">⏳ Ισχύει για 1 χρήση • Απομένουν 60 ημέρες για εξαργύρωση</p>
                                    </div>
                                  `);
                                
                                if (buttonText && buttonLink) {
                                  html += `
                                    <div style="text-align: center; margin: 25px 0;">
                                      <a href="${buttonLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 24px; background-color: #FF6B00; color: #ffffff; font-weight: bold; text-decoration: none; border-radius: 8px; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                                        ${buttonText}
                                      </a>
                                    </div>
                                  `;
                                }
                                return html;
                              })()
                            }} 
                          />
                        </div>
                        
                        {/* SGK Footer */}
                        <div style={{ textAlign: "center", marginTop: "25px", paddingTop: "15px", borderTop: "1px solid #ebdcd5" }}>
                          <p style={{ color: "#888888", fontSize: "11px", lineHeight: "1.5", margin: 0 }}>
                            Αυτό το email στάλθηκε επειδή ζητήσατε προσφορά για Eshop από το <strong>sgk.gr</strong>.<br />
                            <strong>SGK Software Development</strong> | <a href="https://sgk.gr" style={{ color: "#FF6B00", textDecoration: "none", fontWeight: "bold" }}>sgk.gr</a><br /><br />
                            <span style={{ color: "#999", textDecoration: "underline", fontSize: "10px", cursor: "pointer" }}>Κατάργηση εγγραφής (Unsubscribe)</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {!sendingProgress && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Ακύρωση
                </button>
                <button
                  onClick={handleSendCampaign}
                  disabled={!campaignSubject || !campaignBody}
                  className="px-5 py-2 text-sm font-bold text-white bg-vivid-primary rounded-lg hover:bg-vivid-primary/90 disabled:opacity-50 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send size={14} />
                  Αποστολή Email
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
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Users className="text-emerald-600" size={20} />
                Εισαγωγή Leads από Λίστα
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
                  <p className="font-medium text-gray-800 text-lg">Γίνεται εισαγωγή των Leads στη βάση δεδομένων...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                      Δεδομένα Εισαγωγής (Email ή Email, Όνομα, Επίθετο)
                    </label>
                    <textarea 
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      rows={6}
                      placeholder={`Format: 1 ανά γραμμή\n\ninfo@example.com\ncontact@example.com, Γιάννης, Παπαδόπουλος`}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-600 text-gray-900 focus:ring-1 focus:ring-emerald-600 font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Ρυθμίσεις Εισαγωγής</label>
                    
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        id="importConsent"
                        checked={importConsent}
                        onChange={(e) => setImportConsent(e.target.checked)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-600 h-4 w-4 cursor-pointer"
                      />
                      <label htmlFor="importConsent" className="text-sm text-gray-700 cursor-pointer select-none">
                        Έχω λάβει συγκατάθεση για μάρκετινγκ (Marketing Consent)
                      </label>
                    </div>

                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-semibold text-gray-600 block">Ακολουθία Emails:</span>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                          <input 
                            type="radio"
                            name="startSequence"
                            checked={importStartSequence === "campaign_only"}
                            onChange={() => setImportStartSequence("campaign_only")}
                            className="text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                          />
                          Μόνο για καμπάνιες (Ολοκληρωμένη ακολουθία - προτείνεται για παλιούς πελάτες)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                          <input 
                            type="radio"
                            name="startSequence"
                            checked={importStartSequence === "sequence_start"}
                            onChange={() => setImportStartSequence("sequence_start")}
                            className="text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                          />
                          Έναρξη αυτόματης ακολουθίας (Email #1 μετά από 3 μέρες)
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {!importingProgress && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Ακύρωση
                </button>
                <button
                  onClick={handleImportLeads}
                  disabled={!importData.trim()}
                  className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm disabled:opacity-50 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Users size={14} />
                  Εισαγωγή
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
