import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Mail, CheckCircle2, AlertCircle, RefreshCcw, Send, Check, Users, Loader2, X } from "lucide-react";

export function EmailsTab() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campaignSubject, setCampaignSubject] = useState("");
  const [campaignBody, setCampaignBody] = useState("");
  const [sendingProgress, setSendingProgress] = useState<{ current: number; total: number; active: boolean; statusText: string } | null>(null);
  const [singleLeadTarget, setSingleLeadTarget] = useState<any | null>(null);

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
      const response = await fetch("https://xrmvingehhiymchoggka.supabase.co/functions/v1/send-nurture-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // The anon key or bypass if possible.
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          email: lead.email,
          step: (lead.email_sequence_step || 1) + 1,
          unsubscribe_token: lead.unsubscribe_token
        })
      });

      if (!response.ok) {
        throw new Error("Αποτυχία αποστολής");
      }
      
      toast.success(`Το email στάλθηκε επιτυχώς στο ${lead.email}`);
      await fetchLeads(); // Refresh data
    } catch (error) {
      toast.error("Σφάλμα κατά την αποστολή email");
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
        const response = await fetch("https://xrmvingehhiymchoggka.supabase.co/functions/v1/send-nurture-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            email: lead.email,
            unsubscribe_token: lead.unsubscribe_token,
            customSubject: campaignSubject,
            customHtml: campaignBody.replace(/\n/g, '<br />')
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
    
    setTimeout(() => {
      setSendingProgress(null);
      setIsCampaignModalOpen(false);
    }, 2500);

    await fetchLeads();
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
            <button
              onClick={() => {
                setSingleLeadTarget(null);
                setCampaignSubject("");
                setCampaignBody("");
                setIsCampaignModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-vivid-primary text-white rounded-lg hover:bg-vivid-primary/90 transition-all text-sm font-semibold shadow-glow animate-fade-in cursor-pointer"
            >
              <Users size={16} />
              Μαζική Αποστολή ({selectedLeads.length})
            </button>
          )}
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
                    </td>
                  </tr>
                );
              })}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
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
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={sendingProgress?.active}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {sendingProgress ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
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
                <>
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
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Περιεχόμενο Email (HTML ή απλό κείμενο)</label>
                    <textarea 
                      value={campaignBody}
                      onChange={(e) => setCampaignBody(e.target.value)}
                      rows={8}
                      placeholder="Γράψτε το μήνυμά σας εδώ... (Υποστηρίζει HTML tags όπως <strong>, <a>, <p> κλπ.)"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-vivid-primary text-gray-900 focus:ring-1 focus:ring-vivid-primary font-sans text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    💡 Στο κάτω μέρος του email θα προστεθεί αυτόματα η υπογραφή της <strong>SGK Digital</strong> και το link <strong>Unsubscribe</strong> για τη συμμόρφωση με το GDPR.
                  </p>
                </>
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
    </div>
  );
}
