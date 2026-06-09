import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Mail, Trash2, RefreshCcw, Loader2,
  CheckCircle2, AlertTriangle, ArrowRight, UserCheck, Check, Send, X
} from "lucide-react";

interface Prospect {
  id: string;
  business_name: string;
  email: string;
  phone: string | null;
  city: string;
  industry: string;
  status: "pending" | "emailed" | "ignored";
  created_at: string;
  sent_at: string | null;
}

const PROSPECT_TEMPLATES = [
  {
    name: "🚀 Πρόταση Ψηφιακής Παρουσίας (Website/Eshop)",
    subject: "Πρόταση Συνεργασίας: Ψηφιακή Παρουσία για την [BUSINESS_NAME]",
    body: `<h2>Αποκτήστε τη δική σας επαγγελματική ιστοσελίδα ή eshop! 🚀</h2>
<p>Γεια σας,</p>
<p>Επισκεφθήκαμε την καταχώρησή σας για την επιχείρηση <strong>[BUSINESS_NAME]</strong> και παρατηρήσαμε ότι δεν διαθέτετε δικό σας επίσημο website ή eshop για την online προβολή σας.</p>
<p>Στην <strong>SGK Software Development</strong> εξειδικευόμαστε στην κατασκευή ταχύτατων ιστοσελίδων και eshops νέας γενιάς (με τεχνολογία Next.js / React) που βοηθούν τις επιχειρήσεις να αποκτήσουν σύγχρονη παρουσία στο διαδίκτυο και να αυξήσουν τους πελάτες τους.</p>
<p><strong>Τι σας προσφέρουμε:</strong></p>
<ul>
  <li><strong>Επαγγελματική Σχεδίαση:</strong> Στα μέτρα σας, προσαρμοσμένη για κινητά (Mobile First).</li>
  <li><strong>Ασύλληπτη Ταχύτητα:</strong> Με Core Web Vitals 95+ για καλύτερη κατάταξη στη Google (SEO).</li>
  <li><strong>Σύνδεση με Social Media & Google Maps:</strong> Για να σας βρίσκουν εύκολα.</li>
 </ul>
<p>Αν ενδιαφέρεστε να συζητήσουμε πώς μπορούμε να αναβαθμίσουμε την παρουσία σας στο διαδίκτυο, απαντήστε σε αυτό το email ή καλέστε μας απευθείας στο <strong>6999524389</strong>.</p>`,
    defaultButtonText: "Δείτε την Προσφορά",
    defaultButtonLink: "https://www.sgk.gr/eshop-offer"
  },
  {
    name: "⚡ Προσφορά Eshop στα 1.500€ (Ειδική Έκπτωση)",
    subject: "Ειδική Προσφορά: Κατασκευή Eshop στα 1.500€ για την [BUSINESS_NAME]",
    body: `<h2>Ξεκινήστε τις Online Πωλήσεις σας Σήμερα! 🛍️</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με την επιχείρησή σας, <strong>[BUSINESS_NAME]</strong>.</p>
<p>Θέλουμε να σας προσφέρουμε μια ειδική έκπτωση για την κατασκευή ενός υπερσύγχρονου eshop στην προνομιακή τιμή των <strong>1.500€</strong>.</p>
<p><strong>Τι περιλαμβάνει η προσφορά:</strong></p>
<ul>
  <li><strong>Σύνδεση με Skroutz & ERP:</strong> Για αυτόματη ενημέρωση προϊόντων και παραγγελιών.</li>
  <li><strong>Όλες οι Ελληνικές Τράπεζες & Courier:</strong> Έτοιμες διασυνδέσεις πληρωμών και αποστολών.</li>
  <li><strong>100% Ταχύτητα PageSpeed:</strong> Για κορυφαίο SEO.</li>
 </ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να συζητήσουμε τις λεπτομέρειες!</p>`,
    defaultButtonText: "Δείτε την Προσφορά",
    defaultButtonLink: "https://www.sgk.gr/eshop-offer"
  }
];

export function ScraperTab() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filter Tab State
  const [filterTab, setFilterTab] = useState<"pending" | "emailed" | "all">("pending");
  
  // Email Composer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const fetchProspects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("sgk_prospects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProspects(data || []);
    } catch (err) {
      toast.error("Σφάλμα φόρτωσης prospects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον prospect;")) return;
    try {
      const { error } = await supabase
        .from("sgk_prospects")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast.success("Ο prospect διαγράφηκε");
      setProspects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      toast.error("Σφάλμα κατά τη διαγραφή");
      console.error(err);
    }
  };

  // Άνοιγμα modal σύνταξης email
  const openEmailModal = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    // Χρησιμοποιούμε το πρώτο template ως default
    const template = PROSPECT_TEMPLATES[0];
    setEmailSubject(template.subject.replace("[BUSINESS_NAME]", prospect.business_name));
    setEmailBody(template.body.replace(/\[BUSINESS_NAME\]/g, prospect.business_name));
    setButtonText(template.defaultButtonText || "");
    setButtonLink(template.defaultButtonLink || "");
    setIsModalOpen(true);
  };

  // Αλλαγή template στο modal
  const handleTemplateChange = (index: number) => {
    if (!selectedProspect) return;
    const template = PROSPECT_TEMPLATES[index];
    setEmailSubject(template.subject.replace("[BUSINESS_NAME]", selectedProspect.business_name));
    setEmailBody(template.body.replace(/\[BUSINESS_NAME\]/g, selectedProspect.business_name));
    setButtonText(template.defaultButtonText || "");
    setButtonLink(template.defaultButtonLink || "");
  };

  const handleSendEmail = async () => {
    if (!selectedProspect) return;
    setSendingEmail(true);
    try {
      // 1. Αποστολή του email μέσω της Supabase edge function
      // Δημιουργούμε ένα unsubscribe token
      const unsubscribeToken = crypto.randomUUID();
      
      // Κατασκευή του τελικού HTML σώματος με το κουμπί αν έχει οριστεί
      let finalBody = emailBody;
      if (buttonText && buttonLink) {
        finalBody += `
<div style="text-align: center; margin: 25px 0;">
  <a href="${buttonLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 24px; background-color: #FF6B00; color: #ffffff; font-weight: bold; text-decoration: none; border-radius: 8px; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
    ${buttonText}
  </a>
</div>`;
      }

      // Αποστολή μέσω edge function send-nurture-email
      const res = await fetch("https://xrmvingehhiymchoggka.supabase.co/functions/v1/send-nurture-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          email: selectedProspect.email,
          customSubject: emailSubject,
          customBody: finalBody,
          step: 1, // Θέτουμε step = 1, ώστε η επόμενη αυτόματη ακολουθία να ξεκινήσει από το step 2
          unsubscribe_token: unsubscribeToken,
          business_name: selectedProspect.business_name
        })
      });

      if (!res.ok) {
        throw new Error("Αποτυχία αποστολής email");
      }

      // 2. Εισαγωγή του lead στον πίνακα sgk_mails (leads list)
      // Ώστε να παρακολουθούμε την πορεία του και να συνεχίσει να λαμβάνει τα αυτόματα follow-ups
      await supabase.from("sgk_mails").upsert([
        {
          email: selectedProspect.email,
          name: selectedProspect.business_name,
          phone: selectedProspect.phone,
          marketing_consent: true,
          unsubscribed: false,
          unsubscribe_token: unsubscribeToken,
          email_sequence_step: 1,
          last_email_sent_at: new Date().toISOString()
        }
      ], { onConflict: "email" });

      // 3. Ενημέρωση κατάστασης στον πίνακα sgk_prospects
      await supabase
        .from("sgk_prospects")
        .update({
          status: "emailed",
          sent_at: new Date().toISOString()
        })
        .eq("id", selectedProspect.id);

      toast.success(`Το email στάλθηκε επιτυχώς στην επιχείρηση ${selectedProspect.business_name}!`);
      setIsModalOpen(false);
      fetchProspects();
    } catch (err) {
      toast.error("Σφάλμα κατά την αποστολή του email");
      console.error(err);
    } finally {
      setSendingEmail(false);
    }
  };

  const filteredProspects = prospects.filter(p => {
    if (filterTab === "pending") return p.status === "pending";
    if (filterTab === "emailed") return p.status === "emailed";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs & List */}
      <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/5">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilterTab("pending")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                filterTab === "pending" 
                  ? "bg-orange-500/10 text-orange-400 border-orange-500/20" 
                  : "text-zinc-400 border-transparent hover:text-white"
              }`}
            >
              Εκκρεμεί ({prospects.filter(p => p.status === "pending").length})
            </button>
            <button 
              onClick={() => setFilterTab("emailed")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                filterTab === "emailed" 
                  ? "bg-orange-500/10 text-orange-400 border-orange-500/20" 
                  : "text-zinc-400 border-transparent hover:text-white"
              }`}
            >
              Στάλθηκε Email ({prospects.filter(p => p.status === "emailed").length})
            </button>
            <button 
              onClick={() => setFilterTab("all")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                filterTab === "all" 
                  ? "bg-orange-500/10 text-orange-400 border-orange-500/20" 
                  : "text-zinc-400 border-transparent hover:text-white"
              }`}
            >
              Όλα ({prospects.length})
            </button>
          </div>
          <button 
            onClick={fetchProspects}
            disabled={loading}
            className="p-2 text-zinc-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-all"
            title="Ανανέωση λίστας"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Prospects Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              <span className="text-sm text-zinc-400">Φόρτωση prospects...</span>
            </div>
          ) : filteredProspects.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2">
              <AlertTriangle className="w-8 h-8 text-zinc-600" />
              <span className="text-sm text-zinc-400 font-semibold">Δεν βρέθηκαν prospects</span>
              <span className="text-xs text-zinc-500">Κάντε μια αναζήτηση παραπάνω για να γεμίσει η λίστα.</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-zinc-400 font-semibold text-xs uppercase">
                  <th className="py-3 px-6">Όνομα Επιχείρησης</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Κλάδος</th>
                  <th className="py-3 px-6">Πόλη</th>
                  <th className="py-3 px-6">Ημ. Εύρεσης</th>
                  <th className="py-3 px-6">Κατάσταση</th>
                  <th className="py-3 px-6 text-right">Ενέργειες</th>
                </tr>
              </thead>
              <tbody>
                {filteredProspects.map((prospect) => (
                  <tr key={prospect.id} className="border-b border-white/5 hover:bg-white/5 transition-all text-white">
                    <td className="py-4 px-6 font-semibold">{prospect.business_name}</td>
                    <td className="py-4 px-6 font-mono text-zinc-300 text-xs">{prospect.email}</td>
                    <td className="py-4 px-6 text-zinc-400">{prospect.industry}</td>
                    <td className="py-4 px-6 text-zinc-400">{prospect.city}</td>
                    <td className="py-4 px-6 text-zinc-400 text-xs">
                      {new Date(prospect.created_at).toLocaleDateString("el-GR")}
                    </td>
                    <td className="py-4 px-6">
                      {prospect.status === "emailed" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3 text-green-400" />
                          Στάλθηκε
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                          <RefreshCcw className="w-2.5 h-2.5 text-orange-400 animate-spin" />
                          Εκκρεμεί
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        {prospect.status === "pending" && (
                          <button 
                            onClick={() => openEmailModal(prospect)}
                            className="bg-orange-500 hover:bg-orange-600 text-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-black" />
                            <span>Προσφορά</span>
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(prospect.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-400 border border-white/10 hover:border-red-500/20 rounded-lg hover:bg-white/5 transition-all"
                          title="Διαγραφή"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Email Composer Modal */}
      {isModalOpen && selectedProspect && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden border border-gray-100 flex flex-col h-[85vh] max-h-[750px]">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Mail className="text-vivid-primary" size={20} />
                <span>Αποστολή Email στο {selectedProspect.email}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-hidden min-h-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
                {/* Left Column: Form Editor */}
                <div className="space-y-4 flex flex-col h-full min-h-0">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Πρότυπο (Template)</label>
                    <select 
                      onChange={(e) => handleTemplateChange(parseInt(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-vivid-primary text-gray-900 focus:ring-1 focus:ring-vivid-primary text-sm bg-white cursor-pointer"
                    >
                      {PROSPECT_TEMPLATES.map((tmpl, idx) => (
                        <option key={idx} value={idx}>{tmpl.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Θέμα Email (Subject)</label>
                    <input 
                      type="text" 
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
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
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Γράψτε το μήνυμά σας εδώ... (Υποστηρίζει HTML tags όπως <strong>, <a>, <p> κλπ.)"
                      className="w-full flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-vivid-primary text-gray-900 focus:ring-1 focus:ring-vivid-primary font-sans text-sm resize-none overflow-y-auto min-h-0"
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">
                    💡 Στο κάτω μέρος του email θα προστεθεί αυτόματα η υπογραφή της <strong>SGK Digital</strong> και το link <strong>Unsubscribe</strong> για τη συμμόρφωση με το GDPR.
                  </p>
                </div>

                {/* Right Column: Live Email Preview */}
                <div className="flex flex-col space-y-2 h-full min-h-0">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Προεπισκόπηση Email (Live Preview)</label>
                  <div className="bg-[#fcf8f5] border border-[#fbebe3] rounded-2xl p-4 font-sans text-sm text-gray-800 flex-1 overflow-y-auto shadow-inner min-h-0">
                    <div className="text-xs text-gray-400 mb-3 pb-3 border-b border-orange-100 flex flex-col gap-1">
                      <div><strong>Από:</strong> SGK Digital &lt;noreply@sgk.gr&gt;</div>
                      <div><strong>Θέμα:</strong> <span className="text-gray-700 font-medium">{emailSubject || "(Χωρίς Θέμα)"}</span></div>
                    </div>
                    
                    <div style={{ fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", maxWidth: "100%", margin: "0 auto", padding: "10px 0" }}>
                      <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #f2e3db", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
                        <div 
                          className="prose prose-sm prose-orange max-w-none text-gray-800 leading-relaxed font-sans"
                          style={{ fontSize: "14px" }}
                          dangerouslySetInnerHTML={{ 
                            __html: (() => {
                              if (!emailBody) return "<i style='color: #999;'>Το περιεχόμενο του email σας θα εμφανιστεί εδώ...</i>";
                              let html = emailBody;
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
            </div>

            {/* Footer Buttons */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={sendingEmail}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                Ακύρωση
              </button>
              <button 
                onClick={handleSendEmail}
                disabled={sendingEmail || !emailSubject || !emailBody}
                className="px-5 py-2 text-sm font-bold text-white bg-vivid-primary rounded-lg hover:bg-vivid-primary/90 disabled:opacity-50 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {sendingEmail ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Αποστολή...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-white" size={14} />
                    <span>Αποστολή Email Προσφοράς</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
