import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Mail, CheckCircle2, AlertCircle, RefreshCcw, Send, Check } from "lucide-react";

export function EmailsTab() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);

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
        <button 
          onClick={fetchLeads}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
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
                const canSendNext = lead.marketing_consent && !lead.unsubscribed && !lead.converted && step < 4;
                
                return (
                  <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
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
                            title={s <= step ? \`Email #\${s} Στάλθηκε\` : \`Email #\${s} Εκκρεμεί\`}
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-vivid-primary/10 text-vivid-primary hover:bg-vivid-primary hover:text-white rounded-lg transition-all text-sm font-medium disabled:opacity-50"
                        >
                          {sending === lead.id ? <RefreshCcw size={14} className="animate-spin" /> : <Send size={14} />}
                          Στείλε #{step + 1}
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
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Δεν βρέθηκαν leads
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
