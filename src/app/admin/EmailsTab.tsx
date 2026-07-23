import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Mail, CheckCircle2, AlertCircle, RefreshCcw, Send, Check, Users, Loader2, X, Trash2, Plus } from "lucide-react";
import { buildProfessionalEmailHtml } from "@/lib/emailTemplates";

const templates = [
  {
    name: "🌐 Istoselida ike 124 ευρω",
    subject: "Εκκρεμότητα εταιρικής ιστοσελίδας για τη νέα σας Ι.Κ.Ε.",
    body: `<h2>Εκκρεμότητα εταιρικής ιστοσελίδας για τη νέα σας Ι.Κ.Ε. ⏳</h2>
<p>Γεια σας,</p>
<p>Συγχαρητήρια για την έναρξη της νέας σας εταιρείας! Αυτή η περίοδος είναι σίγουρα γεμάτη με γραφειοκρατία, λογιστικά και δεκάδες εκκρεμότητες για την έναρξη.</p>
<p>Θέλουμε να σας προλάβουμε για μια σημαντική νομική υποχρέωση: βάσει του <strong>Νόμου 4072/2012 (Άρθρο 50)</strong>, κάθε νέα Ι.Κ.Ε. υποχρεούται να έχει live τη δική της εταιρική ιστοσελίδα εντός <strong>30 ημερών</strong> από τη σύστασή της, εμφανίζοντας τα στοιχεία της στο ΓΕΜΗ (κεφάλαιο, εταίροι, διαχειριστής, έδρα).</p>
<p><strong>Για να μην σπαταλήσετε χρόνο ή χρήμα σε περίπλοκα projects, αναλαμβάνουμε τα πάντα εμείς:</strong></p>
<ul>
  <li><strong>Παράδοση σε 24 ώρες:</strong> Η ιστοσελίδα σας θα είναι live και έτοιμη αύριο.</li>
  <li><strong>100% Συμβατή με το ΓΕΜΗ:</strong> Με όλα τα υποχρεωτικά πεδία που ορίζει ο νόμος.</li>
  <li><strong>Όλα συμπεριλαμβανόμενα:</strong> Domain name (.gr) + Φιλοξενία (Hosting) για 1 έτος + Ασφάλεια SSL.</li>
  <li><strong>Τελικό Κόστος:</strong> Μόνο <strong>124€</strong> (συμπεριλαμβανομένου ΦΠΑ 24% - κόβεται κανονικά τιμολόγιο).</li>
</ul>
<p>Αφαιρέστε αυτή την εκκρεμότητα από τη λίστα σας σήμερα. Πατήστε στο παρακάτω κουμπί για να συμπληρώσετε τα στοιχεία σας και να ξεκινήσουμε άμεσα.</p>`,
    defaultButtonText: "Έναρξη Κατασκευής",
    defaultButtonLink: "https://sgk.gr/ike-offer"
  },
  {
    name: "Κενό (Σύνταξη από την αρχή)",
    subject: "",
    body: "",
    defaultButtonText: "",
    defaultButtonLink: ""
  },
  {
    name: "🔥 Eshop - Pay As You Grow (250€ Setup)",
    subject: "Δημιουργία Eshop χωρίς ρίσκο - Pay As You Grow",
    body: `<h2>Αποκτήστε το δικό σας Eshop με 0€ ρίσκο! 🚀</h2>
<h3>Μοντέλο Pay As You Grow (PAYG) από την SGK Digital</h3>
<p>Γεια σας,</p>
<p>Θέλετε να ξεκινήσετε το δικό σας ηλεκτρονικό κατάστημα (E-shop) αλλά σας προβληματίζει το αρχικό κόστος και το ρίσκο της επένδυσης;</p>
<p>Στην <strong>SGK Digital</strong> σας προσφέρουμε την ιδανική λύση με το μοντέλο <strong>Pay As You Grow</strong>:</p>
<ul>
  <li><strong>Αρχικό Κόστος Setup:</strong> Μόνο <strong>250€</strong> (εφάπαξ, καλύπτει server για 1 έτος, .gr domain για 2 έτη, SSL & την πλήρη παραμετροποίηση).</li>
  <li><strong>5% Προμήθεια στις Πωλήσεις:</strong> Πληρώνετε προμήθεια μόνο για <strong>12 μήνες</strong>.</li>
  <li><strong>Μηδενικό Ρίσκο:</strong> Αν δεν κάνετε πωλήσεις, πληρώνετε <strong>0€</strong> προμήθεια!</li>
  <li><strong>100% Δικό σας:</strong> Μετά τους 12 μήνες, το Eshop περνάει στην πλήρη ιδιοκτησία σας χωρίς μηνιαίες συνδρομές ή άλλες προμήθειες.</li>
  <li><strong>Δυνατότητα Εξαγοράς:</strong> Μπορείτε να εξαγοράσετε το υπόλοιπο της αξίας του Eshop ανά πάσα στιγμή χωρίς καμία επιπλέον επιβάρυνση.</li>
</ul>
<p>Απαντήστε σε αυτό το email για να ξεκινήσουμε άμεσα τη δημιουργία του δικού σας E-shop!</p>`,
    defaultButtonText: "Δείτε την Προσφορά",
    defaultButtonLink: "https://www.sgk.gr/pay-as-you-grow"
  },
  {
    name: "🛍️ Προσφορά Κατασκευής E-shop (Next.js + WooCommerce)",
    subject: "Προσφορά Κατασκευής E-shop — SGK Digital",
    body: `<h2>Προσφορά Κατασκευής E-shop 🛍️</h2>
<h3>Headless λύση — WordPress WooCommerce + Next.js</h3>
<p>Σας ευχαριστούμε για το ενδιαφέρον σας. Παρακάτω θα βρείτε την αναλυτική πρόταση για την κατασκευή του νέου σας ηλεκτρονικού καταστήματος, σχεδιασμένη να σας δώσει ταχύτητα, ασφάλεια και μια εμπειρία χρήστη αντίστοιχη των μεγαλύτερων πλατφορμών του κλάδου.</p>
<h4>Η Τεχνολογία: Headless WooCommerce + Next.js</h4>
<p>Το e-shop θα κατασκευαστεί με αρχιτεκτονική <strong>headless</strong>: το WooCommerce θα λειτουργεί ως backend διαχείρισης (προϊόντα, παραγγελίες, απόθεμα, πληρωμές), ενώ το frontend θα είναι χτισμένο εξ ολοκλήρου σε Next.js.</p>
<p><strong>Λόγοι επιλογής Next.js:</strong></p>
<ul>
  <li>Ταχύτητα φόρτωσης σελίδων, καλύτερη κατάταξη στη Google</li>
  <li>Άψογη εμπειρία χρήστη χωρίς reload σελίδας</li>
  <li>Αυξημένη ασφάλεια, μειωμένη επιφάνεια επίθεσης</li>
  <li>Πλήρης ελευθερία σχεδιασμού, χωρίς περιορισμούς θέματος WordPress</li>
  <li>Επεκτασιμότητα για μεγάλο όγκο επισκεψιμότητας (π.χ. Black Friday)</li>
</ul>
<div style="background-color: #f8fafc; border-left: 4px solid #3b5bdb; padding: 12px; margin: 15px 0; font-size: 13px; color: #1e293b; line-height: 1.5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <strong>Δεν είναι τυχαίο</strong> ότι έτσι πλέον χτίζονται οι πιο σύγχρονες πλατφόρμες παγκοσμίως — Airbnb, Skroutz, OFLIX και δεκάδες ακόμη μεγάλα ονόματα βασίζονται σε αντίστοιχη λογική frontend. Χτίζουμε το e-shop σας με την ίδια φιλοσοφία που χρησιμοποιούν οι μεγαλύτερες ψηφιακές εταιρείες του κόσμου.
</div>
<h4>Τι Περιλαμβάνει η Κατασκευή</h4>
<ul>
  <li>Απεριόριστα προϊόντα και απεριόριστες κατηγορίες</li>
  <li>Πλήρες σύστημα online πληρωμών</li>
  <li>Διασύνδεση με BOX NOW</li>
  <li>Responsive design (κινητό, tablet, desktop)</li>
  <li>Πίνακας διαχείρισης WooCommerce</li>
  <li>Βασική τεχνική βελτιστοποίηση SEO</li>
</ul>
<p style="font-size: 11px; color: #666; font-style: italic;">Τυχόν επιπλέον διασυνδέσεις με άλλα συστήματα ή υπηρεσίες μπορούν να συζητηθούν και να προστεθούν ξεχωριστά, ανάλογα με τις ανάγκες σας.</p>
<h4>Οικονομική Προσφορά</h4>
<table style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; text-align: left;">
  <thead>
    <tr style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1;">
      <th style="padding: 8px;">Υπηρεσία / Προϊόν</th>
      <th style="padding: 8px; text-align: right; width: 100px;">Κόστος</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px;">Κατασκευή e-shop (Headless WooCommerce + Next.js)</td>
      <td style="padding: 8px; text-align: right; font-weight: 600;">900 €</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px;">Hosting (ετήσιο κόστος)</td>
      <td style="padding: 8px; text-align: right; font-weight: 600;">250 €/έτος</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px;">Domain</td>
      <td style="padding: 8px; text-align: right; font-style: italic; color: #64748b;">ανάλογα την επιλογή*</td>
    </tr>
    <tr style="background-color: #f0fdf4; border-top: 2px solid #4ade80; border-bottom: 2px solid #4ade80; font-weight: bold;">
      <td style="padding: 10px 8px; color: #166534;">Σύνολο κατασκευής (με ΦΠΑ)</td>
      <td style="padding: 10px 8px; text-align: right; color: #166534; font-size: 15px; font-weight: 900;">936 €</td>
    </tr>
  </tbody>
</table>
<p style="font-size: 10px; color: #666; font-style: italic; margin-bottom: 15px;">* Το κόστος του domain εξαρτάται από την κατάληξη και τη διαθεσιμότητα και θα καθοριστεί μετά την επιλογή του πελάτη.</p>
<div style="border: 1.5px dashed #4ade80; background: #f0fdf4; border-radius: 8px; padding: 15px; text-align: center; margin: 15px 0;">
  <p style="margin: 0; font-size: 14px; font-weight: bold; color: #111;">Είμαστε στη διάθεσή σας για οποιαδήποτε διευκρίνιση ή προσαρμογή της πρότασης στις ανάγκες σας.</p>
</div>`,
    defaultButtonText: "Απάντηση στην Προσφορά",
    defaultButtonLink: "mailto:info@sgk.gr?subject=Αποδοχή%20Προσφοράς%20Κατασκευής%20E-shop"
  }
];

export function EmailsTab() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campaignSubject, setCampaignSubject] = useState(templates[0].subject);
  const [campaignBody, setCampaignBody] = useState(templates[0].body);
  const [buttonText, setButtonText] = useState(templates[0].defaultButtonText);
  const [buttonLink, setButtonLink] = useState(templates[0].defaultButtonLink);
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
  const [autoProcessing, setAutoProcessing] = useState(false);

  // Client-side mounted state for React Portal
  const [isClient, setIsClient] = useState(false);

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
    setIsClient(true);
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
          email_sequence_step: 0, // start from 0 (not started)
          unsubscribed: false,
          converted: false
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
        const bodyHtml = campaignBody.includes("<p>") || campaignBody.includes("</div>") || campaignBody.includes("<br")
          ? campaignBody
          : campaignBody.replace(/\n/g, '<br />');

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
            firstEmailSubject: campaignSubject,
            firstEmailBody: campaignBody,
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
    setCampaignSubject(templates[0].subject);
    setCampaignBody(templates[0].body);
    setButtonText(templates[0].defaultButtonText);
    setButtonLink(templates[0].defaultButtonLink);
    
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
        let textName = "";
        let textSurname = "";

        if (trimmed.includes(",")) {
          const parts = trimmed.split(",").map(p => p.trim());
          email = parts[0];
          textName = parts[1] || "";
          textSurname = parts[2] || "";
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
              first_name: textName,
              last_name: textSurname,
              type: "imported",
              marketing_consent: true,
              email_sequence_step: 0,
              unsubscribe_token: crypto.randomUUID(),
              unsubscribed: false,
              converted: false
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

  // Define full-screen campaign modal component
  const campaignModal = isCampaignModalOpen && (
    <div className="fixed inset-0 bg-white z-[99999] flex flex-col h-screen w-screen overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center text-white shrink-0">
        <h3 className="font-black text-sm uppercase tracking-wider italic flex items-center gap-2">
          <Mail className="text-[#3b5bdb]" size={18} />
          {singleLeadTarget 
            ? `Αποστολη Email στο ${singleLeadTarget.email}` 
            : `Μαζικη Αποστολη (${singleLeadTarget ? 1 : (selectedLeads.length > 0 ? selectedLeads.length : leads.length)} παραληπτες)`}
        </h3>
        <button 
          onClick={() => {
            if (sendingProgress?.active) return;
            setIsCampaignModalOpen(false);
          }}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer bg-slate-800 p-2 rounded-xl"
          disabled={sendingProgress?.active}
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden min-h-0 bg-slate-950 p-6">
        {sendingProgress ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 text-white max-w-md mx-auto">
            {sendingProgress.current < sendingProgress.total ? (
              <Loader2 className="animate-spin text-[#3b5bdb] w-16 h-16" />
            ) : (
              <CheckCircle2 className="text-emerald-500 w-16 h-16 animate-bounce" />
            )}
            <p className="font-black text-sm uppercase tracking-widest italic">{sendingProgress.statusText}</p>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
              <div 
                className="bg-[#3b5bdb] h-full transition-all duration-300 shadow-glow"
                style={{ width: `${(sendingProgress.current / sendingProgress.total) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
            {/* Left Column: Form Editor */}
            <div className="space-y-4 flex flex-col h-full min-h-0 overflow-y-auto pr-2 custom-scrollbar bg-slate-900/50 border border-slate-850 p-6 rounded-2xl">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Πρότυπο (Template)</label>
                <select
                  onChange={(e) => {
                    const idx = parseInt(e.target.value);
                    setCampaignSubject(templates[idx].subject);
                    setCampaignBody(templates[idx].body);
                    setButtonText(templates[idx].defaultButtonText || "");
                    setButtonLink(templates[idx].defaultButtonLink || "");
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 text-xs font-bold focus:border-[#3b5bdb]/50 outline-none cursor-pointer"
                >
                  {templates.map((t, i) => (
                    <option key={i} value={i} className="bg-slate-950 text-slate-100">{t.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Θέμα Email (Subject)</label>
                <input 
                  type="text"
                  value={campaignSubject}
                  onChange={(e) => setCampaignSubject(e.target.value)}
                  placeholder="π.χ. Εκκρεμότητα εταιρικής ιστοσελίδας για τη νέα σας Ι.Κ.Ε."
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 text-xs font-bold focus:border-[#3b5bdb]/50 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Κείμενο Κουμπιού (Προαιρετικό)</label>
                  <input 
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="π.χ. Δείτε την Προσφορά"
                    className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 text-xs font-bold focus:border-[#3b5bdb]/50 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Σύνδεσμος Κουμπιού (Link)</label>
                  <input 
                    type="text"
                    value={buttonLink}
                    onChange={(e) => setButtonLink(e.target.value)}
                    placeholder="π.χ. https://..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 text-xs font-bold focus:border-[#3b5bdb]/50 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Περιεχόμενο Email (HTML ή απλό κείμενο)</label>
                <textarea 
                  value={campaignBody}
                  onChange={(e) => setCampaignBody(e.target.value)}
                  placeholder="Γράψτε το μήνυμά σας εδώ..."
                  className="w-full flex-1 px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs resize-none overflow-y-auto min-h-[220px] focus:border-[#3b5bdb]/50 outline-none custom-scrollbar"
                />
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase italic leading-tight">
                💡 Στο κάτω μέρος του email θα προστεθεί αυτόματα το responsive layout της <strong>SGK Digital</strong> με τα snappi χρώματα και η υπογραφή μας.
              </p>
            </div>

            {/* Right Column: Live Email Preview */}
            <div className="flex flex-col space-y-2 h-full min-h-0">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Προεπισκόπηση Email (Live Preview)</label>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse border border-emerald-900">● Live Preview</span>
              </div>
              <div className="flex-1 rounded-2xl overflow-hidden border border-slate-800 shadow-inner min-h-0 bg-[#f0f2f5]">
                <iframe
                  key={campaignBody + campaignSubject + buttonText + buttonLink}
                  srcDoc={(() => {
                    if (!campaignBody) return `<html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial,sans-serif;color:#999;font-size:14px;background:#f0f2f5;"><div style="text-align:center;"><div style="font-size:32px;margin-bottom:12px;">📧</div><div>Το περιεχόμενο του email<br>θα εμφανιστεί εδώ...</div></div></body></html>`;
                    
                    const sampleLead = singleLeadTarget || leads.find(l => selectedLeads.includes(l.id));
                    const businessName = sampleLead ? (sampleLead.first_name || "Συνεργάτη") : "Συνεργάτη";
                    
                    const bodyHtml = campaignBody.includes("<p>") || campaignBody.includes("</div>") || campaignBody.includes("<br")
                      ? campaignBody
                      : campaignBody.replace(/\n/g, '<br />');

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
        <div className="bg-slate-900 px-6 py-5 border-t border-slate-800 flex justify-end gap-3 shrink-0">
          <button
            onClick={() => setIsCampaignModalOpen(false)}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
          >
            Ακύρωση
          </button>
          <button
            onClick={handleSendCampaign}
            disabled={!campaignSubject || !campaignBody}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-[#3b5bdb] rounded-xl hover:bg-[#3b5bdb]/90 disabled:opacity-50 flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-blue-500/10"
          >
            <Send size={12} />
            Αποστολη Email
          </button>
        </div>
      )}
    </div>
  );

  const renderSequenceStep = (step: number | null | undefined) => {
    const currentStep = step || 0;
    return (
      <div className="flex items-center justify-center gap-1">
        {[1, 2, 3, 4, 5].map((num) => {
          const isSent = currentStep >= num;
          return (
            <span
              key={num}
              className={`
                w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border transition-all
                ${isSent 
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/20' 
                  : 'bg-slate-100 text-slate-400 border-slate-200'
                }
              `}
              title={isSent ? `Στάλθηκε το Email ${num}` : `Εκκρεμεί το Email ${num}`}
            >
              {num}
            </span>
          );
        })}
      </div>
    );
  };

  const handleAutoProcessDue = async () => {
    setAutoProcessing(true);
    toast.info("Έναρξη αυτόματης επεξεργασίας εκκρεμών AI follow-up emails...");
    let totalSent = 0;
    let keepGoing = true;

    try {
      while (keepGoing) {
        const response = await fetch("https://xrmvingehhiymchoggka.supabase.co/functions/v1/send-nurture-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            processAllDue: true,
            batchLimit: 5
          })
        });

        const resJson = await response.json();
        if (resJson.success) {
          const count = resJson.processedCount || 0;
          totalSent += count;
          if (count === 0) {
            keepGoing = false;
          } else {
            toast.info(`Στάλθηκαν ${totalSent} AI emails μέχρι στιγμής... συνεχίζεται...`);
          }
        } else {
          toast.error(`Σφάλμα: ${resJson.error || "Άγνωστο σφάλμα"}`);
          keepGoing = false;
        }
      }

      if (totalSent > 0) {
        toast.success(`Η ακολουθία ολοκληρώθηκε! Στάλθηκαν συνολικά ${totalSent} επόμενα AI emails.`);
      } else {
        toast.info("Δεν βρέθηκαν εκκρεμή emails που να έχουν συμπληρώσει 3 ημέρες.");
      }
      fetchLeads();
    } catch (err: any) {
      toast.error(`Σφάλμα αυτόματης αποστολής: ${err.message}`);
    } finally {
      setAutoProcessing(false);
    }
  };

  const activeCount = leads.filter(l => !l.unsubscribed).length;
  const unsubscribedCount = leads.filter(l => l.unsubscribed).length;

  return (
    <div className="space-y-8">

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/60 backdrop-blur-xl border border-gray-200/60 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Συνολικα Email</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{leads.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#3b5bdb]/10 text-[#3b5bdb] flex items-center justify-center font-bold">
            <Mail size={20} />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-emerald-200/60 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Ενεργοι (Active)</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-rose-200/60 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Απεγγραφες (Unsubscribed)</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{unsubscribedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <AlertCircle size={20} />
          </div>
        </div>
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
            <button
              onClick={handleAutoProcessDue}
              disabled={autoProcessing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#a855f7] to-[#3b5bdb] text-white rounded-xl hover:opacity-95 transition-all text-xs font-black uppercase tracking-wider shadow-lg cursor-pointer disabled:opacity-50"
            >
              {autoProcessing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCcw size={12} />}
              ⚡ AI Auto-Pilot (Εκτελεση Ακολουθιας)
            </button>
            <button
              onClick={() => {
                setSingleLeadTarget(null);
                setCampaignSubject(templates[0].subject);
                setCampaignBody(templates[0].body);
                setButtonText(templates[0].defaultButtonText || "");
                setButtonLink(templates[0].defaultButtonLink || "");
                setIsCampaignModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#3b5bdb] text-white rounded-xl hover:bg-[#3b5bdb]/90 transition-all text-xs font-black uppercase tracking-wider shadow-lg cursor-pointer"
            >
              <Send size={12} />
              Μαζικη Αποστολη {selectedLeads.length > 0 ? `(${selectedLeads.length})` : "(Όλοι)"}
            </button>
            {selectedLeads.length > 0 && (
              <button
                onClick={handleDeleteSelectedLeads}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all text-xs font-black uppercase tracking-wider shadow-md cursor-pointer"
              >
                <Trash2 size={12} />
                Διαγραφη ({selectedLeads.length})
              </button>
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
                  <th className="py-3 px-4 text-center">Ακολουθία Email</th>
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
                      {renderSequenceStep(lead.email_sequence_step)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {!lead.unsubscribed && (
                          <button
                            onClick={() => {
                              setSingleLeadTarget(lead);
                              setCampaignSubject(templates[0].subject);
                              setCampaignBody(templates[0].body);
                              setButtonText(templates[0].defaultButtonText || "");
                              setButtonLink(templates[0].defaultButtonLink || "");
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
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                      Δεν βρέθηκαν email στη λίστα
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Campaign Email Modal - Ported to body level to fix z-index issues */}
      {isClient && typeof document !== "undefined" && createPortal(campaignModal, document.body)}

      {/* Import Leads Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-scale-up">
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
