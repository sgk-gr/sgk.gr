import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Mail, CheckCircle2, AlertCircle, RefreshCcw, Send, Check, 
  Users, Loader2, X, Trash2, Plus, Search, Building2, 
  FileCheck, Calculator, Sparkles, Phone, Edit3, UserPlus, Save, User,
  Terminal, Globe, ShieldAlert, CheckCircle, Info, Ban, Target
} from "lucide-react";
import { buildProfessionalEmailHtml } from "@/lib/emailTemplates";
import { isEmailBlacklisted, GLOBAL_BLACKLIST_EMAILS, GLOBAL_BLACKLIST_DOMAINS } from "@/lib/blacklist";


export interface ProfessionConfig {
  key: string;
  label: string;
  shortLabel: string;
  icon: string;
  badgeBg: string;
  text: string;
  border: string;
}

export const CLIENT_PROFESSIONS: Record<string, ProfessionConfig> = {
  accounting: {
    key: "accounting",
    label: "Λογιστής / Λογιστικό Γραφείο",
    shortLabel: "Λογιστής",
    icon: "📊",
    badgeBg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-300"
  },
  tourism: {
    key: "tourism",
    label: "Τουριστικό Γραφείο / Τουρισμός",
    shortLabel: "Τουριστικό",
    icon: "✈️",
    badgeBg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-300"
  },
  real_estate: {
    key: "real_estate",
    label: "Real Estate / Ακίνητα",
    shortLabel: "Real Estate",
    icon: "🏢",
    badgeBg: "bg-teal-50",
    text: "text-teal-800",
    border: "border-teal-300"
  },
  consulting: {
    key: "consulting",
    label: "Σύμβουλοι Επιχειρήσεων",
    shortLabel: "Σύμβουλοι",
    icon: "💼",
    badgeBg: "bg-indigo-50",
    text: "text-indigo-800",
    border: "border-indigo-300"
  },
  construction: {
    key: "construction",
    label: "Κατασκευαστική / Τεχνική",
    shortLabel: "Κατασκευές",
    icon: "🏗️",
    badgeBg: "bg-orange-50",
    text: "text-orange-800",
    border: "border-orange-300"
  },
  agriculture: {
    key: "agriculture",
    label: "Αγροτικά / Κτηνοτροφία / Φάρμα",
    shortLabel: "Αγροτικά",
    icon: "🌾",
    badgeBg: "bg-lime-50",
    text: "text-lime-800",
    border: "border-lime-300"
  },
  tech_ecommerce: {
    key: "tech_ecommerce",
    label: "E-commerce & Tech Platform",
    shortLabel: "E-commerce",
    icon: "🌐",
    badgeBg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-300"
  },
  tech_it: {
    key: "tech_it",
    label: "Πληροφορική & Δίκτυα",
    shortLabel: "Πληροφορική",
    icon: "💻",
    badgeBg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-300"
  },
  services: {
    key: "services",
    label: "Επαγγελματικές Υπηρεσίες",
    shortLabel: "Υπηρεσίες",
    icon: "🛠️",
    badgeBg: "bg-slate-100",
    text: "text-slate-800",
    border: "border-slate-300"
  },
  translation: {
    key: "translation",
    label: "Μεταφράσεις & Localization",
    shortLabel: "Μεταφράσεις",
    icon: "📝",
    badgeBg: "bg-sky-50",
    text: "text-sky-800",
    border: "border-sky-300"
  },
  operations_tech: {
    key: "operations_tech",
    label: "Operations & Τεχνικά Έργα",
    shortLabel: "Operations",
    icon: "⚡",
    badgeBg: "bg-violet-50",
    text: "text-violet-800",
    border: "border-violet-300"
  },
  new_ike: {
    key: "new_ike",
    label: "Νέα ΙΚΕ (Γενική)",
    shortLabel: "ΙΚΕ",
    icon: "🏢",
    badgeBg: "bg-slate-100",
    text: "text-slate-800",
    border: "border-slate-300"
  },
  general_co: {
    key: "general_co",
    label: "Εταιρεία / Επιχείρηση",
    shortLabel: "Επιχείρηση",
    icon: "🏢",
    badgeBg: "bg-slate-100",
    text: "text-slate-800",
    border: "border-slate-300"
  }
};

export function getLeadProfession(lead: any): ProfessionConfig {
  if (lead.type && CLIENT_PROFESSIONS[lead.type]) {
    return CLIENT_PROFESSIONS[lead.type];
  }
  const t = `${lead.company || ''} ${lead.email || ''} ${lead.first_name || ''} ${lead.last_name || ''}`.toLowerCase();
  if (t.includes('logist') || t.includes('gik') || t.includes('λογιστ') || t.includes('φοροτεχνικ')) return CLIENT_PROFESSIONS.accounting;
  if (t.includes('tour') || t.includes('travel') || t.includes('τουριστ') || t.includes('palk') || t.includes('hotel') || t.includes('ξενοδοχ')) return CLIENT_PROFESSIONS.tourism;
  if (t.includes('properties') || t.includes('real estate') || t.includes('ακινητ') || t.includes('stefanos')) return CLIENT_PROFESSIONS.real_estate;
  if (t.includes('consult') || t.includes('lyroud') || t.includes('mallios') || t.includes('συμβουλ')) return CLIENT_PROFESSIONS.consulting;
  if (t.includes('construct') || t.includes('pnp') || t.includes('κατασκευ') || t.includes('τεχνικ')) return CLIENT_PROFESSIONS.construction;
  if (t.includes('farma') || t.includes('tsakalos') || t.includes('φαρμα') || t.includes('αγροτ')) return CLIENT_PROFESSIONS.agriculture;
  if (t.includes('localiz') || t.includes('translat') || t.includes('μεταφρασ')) return CLIENT_PROFESSIONS.translation;
  if (t.includes('yolo') || t.includes('eshop') || t.includes('ecommerce')) return CLIENT_PROFESSIONS.tech_ecommerce;
  if (t.includes('gr8net') || t.includes('tech') || t.includes('δικτυ')) return CLIENT_PROFESSIONS.tech_it;
  if (t.includes('routis') || t.includes('services') || t.includes('υπηρεσι')) return CLIENT_PROFESSIONS.services;
  if (lead.type === 'operations_tech') return CLIENT_PROFESSIONS.operations_tech;
  if (lead.type === 'new_ike') return CLIENT_PROFESSIONS.new_ike;
  return CLIENT_PROFESSIONS.general_co;
}

const templates = [
  {
    name: "Istoselida ike 150 ευρω",
    subject: "Συγχαρητήρια για τη νέα σας Ι.Κ.Ε. | Εταιρική ιστοσελίδα για το ΓΕΜΗ",
    body: `<h2 style="color: #0f172a; font-size: 19px; font-weight: 800; line-height: 1.35; margin: 0 0 16px 0;">Εταιρική Ιστοσελίδα ΙΚΕ (βάσει προδιαγραφών ΓΕΜΗ)</h2>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Αγαπητέ διαχειριστή, καλησπέρα. Είδαμε τη σύσταση της νέας σας εταιρείας στο ΓΕΜΗ και σας ευχόμαστε καλή επιτυχία.
</p>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Σκοπός της επικοινωνίας μας είναι να σας βοηθήσουμε να τακτοποιήσετε εύκολα τη νομική εκκρεμότητα: σύμφωνα με το <strong>Άρθρο 47 παρ. 2 του Ν.4072/2012</strong>, κάθε νέα Ι.Κ.Ε. οφείλει να αποκτήσει εταιρική ιστοσελίδα εντός ενός μηνός από τη σύστασή της και να την καταχωρίσει στο ΓΕΜΗ.
</p>

<p style="margin: 0 0 12px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Στην <strong>SGK Digital</strong> μπορούμε να το αναλάβουμε εμείς με μηδενικό κόπο από εσάς, αντλώντας τα στοιχεία απευθείας από το ΓΕΜΗ. 
</p>

<div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 12px 16px; margin: 20px 0;">
  <p style="margin: 0 0 6px 0; font-size: 14px; color: #0f172a; font-weight: 700;">Η ολοκληρωμένη λύση (150€ τελικό κόστος με ΦΠΑ):</p>
  <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #334155; line-height: 1.6;">
    <li>Έτοιμη ιστοσελίδα σε 24 ώρες, απολύτως συμβατή με τον νόμο.</li>
    <li><strong>Πιστοποιημένη Διασύνδεση (API):</strong> Η σελίδα σας συνδέεται και διαβάζεται απευθείας από το ΓΕΜΗ, μηδενίζοντας λάθη και κινδύνους.</li>
    <li>Κατοχύρωση .gr Domain & Hosting (για 1 έτος).</li>
    <li>Κατασκευή επαγγελματικού λογοτύπου.</li>
    <li>Εταιρικό Email (π.χ. info@...).</li>
    <li>Νόμιμο τιμολόγιο για τα έξοδα της εταιρείας σας.</li>
  </ul>
  <p style="margin: 10px 0 0 0; font-size: 13px; color: #475569;">
    👉 <strong>Δείτε ένα πρόσφατο δείγμα μας:</strong> <a href="https://www.sellascountryhouses.gr/" target="_blank" style="color: #0284c7; text-decoration: underline;">sellascountryhouses.gr</a>
  </p>
</div>

<p style="margin: 0 0 20px 0; color: #475569; font-size: 14px; line-height: 1.5;">
  Αν θέλετε να το αναλάβουμε, πατήστε το παρακάτω κουμπί για λεπτομέρειες, ή καλέστε μας στο <strong>211 114 0013</strong>.<br/><br/>
  <em>(Αν πάλι το έχετε ήδη τακτοποιήσει, παρακαλώ αγνοήστε αυτό το μήνυμα και καλή συνέχεια στα νέα σας βήματα!)</em>
</p>

<div style="text-align: center; margin: 20px 0 10px;">
  <a href="https://www.sgk.gr/ike-offer" target="_blank" style="display:inline-block;background:#4ade80;color:#111;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:700;padding:12px 28px;border-radius:20px;text-decoration:none;">
    Εκδήλωση Ενδιαφέροντος
  </a>
</div>

<div style="font-size: 11px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px; line-height: 1.5;">
  <strong>Διαφάνεια & GDPR:</strong> Επικοινωνούμε αποκλειστικά βάσει των δημοσίων στοιχείων (OpenData API) του Γ.Ε.ΜΗ.
</div>`
  },
  {
    name: "AI Video Call & Ψηφιακοί Υπάλληλοι (order-ai-agent)",
    subject: "Ο πρώτος σας AI Ψηφιακός Υπάλληλος σε Ζωντανή Κλήση Πρόσωπο-με-Πρόσωπο (24/7)",
    body: `<!-- Full-Width Edge-to-Edge Hero Banner -->
<div style="margin: -24px -20px 24px -20px; text-align: center; background-color: #0b0f19; overflow: hidden;">
  <a href="https://www.sgk.gr/estimate" target="_blank" style="display: block; text-decoration: none;">
    <img 
      src="https://www.sgk.gr/images/hero_ai_video_agent.webp" 
      alt="Live Video AI Agents 24/7 - SGK Digital" 
      width="600" 
      style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; border: 0;"
    />
  </a>
</div>

<h2 style="color: #0f172a; font-size: 21px; font-weight: 800; line-height: 1.35; margin: 0 0 14px 0;">Η Νέα Εποχή στην Εξυπηρέτηση: Ζωντανός Ψηφιακός Βοηθός με Video Call 24/7</h2>

<p style="margin: 0 0 12px 0; color: #334155; font-size: 15px; line-height: 1.6;">Αγαπητέ συνεργάτη,</p>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Το 2026, οι πελάτες έχουν κουραστεί από τα απρόσωπα τηλέφωνα, τις αναμονές και τα ψυχρά γραπτά chatbots. <strong>Η ζωντανή επαφή πρόσωπο-με-πρόσωπο είναι αυτή που κλείνει πωλήσεις και χτίζει εμπιστοσύνη.</strong>
</p>

<p style="margin: 0 0 16px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Στην <strong>SGK Digital</strong> αναπτύξαμε την πιο εξελιγμένη τεχνολογία στην Ελλάδα: <strong>Live Video AI Agents (Ψηφιακούς Υπαλλήλους)</strong>. Ένας φωτορεαλιστικός εκπρόσωπος της εταιρείας σας που υποδέχεται τους επισκέπτες στην ιστοσελίδα σας με <strong>ζωντανή βιντεοκλήση</strong>, μιλάει άπταιστα φυσικά ελληνικά και ολοκληρώνει εργασίες 24 ώρες το 24ωρο.
</p>

<!-- The B2B Psychology Box -->
<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #2563eb; border-radius: 12px; padding: 16px 18px; margin: 20px 0;">
  <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 800; color: #1e40af;">
    💡 Πώς ο Ψηφιακός Υπάλληλος αυξάνει τις πωλήσεις σας;
  </p>
  <p style="margin: 0 0 6px 0; font-size: 13.5px; color: #0f172a; line-height: 1.55;">
    1. <strong>Άμεση Προσωπική Εξυπηρέτηση (WebRTC &lt;800ms):</strong> Ο επισκέπτης δεν διαβάζει κείμενα — μιλάει ζωντανά με τον εκπρόσωπό σας που του λύνει απορίες σε πραγματικό χρόνο.<br/>
    2. <strong>Οπτική Ταυτοποίηση με Κάμερα (KYC):</strong> Το AI αναγνωρίζει ταυτότητες, έγγραφα και αποδείξεις μέσω της κάμερας του χρήστη για αυτόματο onboarding.<br/>
    3. <strong>Ζωντανή Σύνδεση με τα Συστήματά σας:</strong> Συνδέεται απευθείας με το CRM, το ERP (SoftOne, Entersoft), το Google Calendar και το E-shop σας για άμεσο κλείσιμο ραντεβού και καταχώρηση παραγγελιών.<br/>
    4. <strong>100% Data Privacy (GDPR):</strong> Μπορεί να φιλοξενηθεί σε ιδιωτικό dedicated server χωρίς κανένα διαμοιρασμό δεδομένων σε δημόσια AI.
  </p>
</div>

<p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 800; color: #0f172a;">Ξεκάθαρη Τιμολόγηση με το Κλειδί στο Χέρι:</p>

<div style="margin: 0 0 16px 0; padding-left: 4px;">
  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #334155;">
    🚀 <strong>Εφάπαξ Setup (500€):</strong> Πλήρης σχεδιασμός avatar, εκπαίδευση με τα δεδομένα της επιχείρησής σας και διασύνδεση με τα συστήματά σας.
  </p>
  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #334155;">
    💼 <strong>Μηνιαία Πλάνα (από 150€/μήνα):</strong> Basic (150€), Pro (250€) και Enterprise (450€) με 24/7 υποστήριξη — λιγότερο από το εβδομαδιαίο κόστος ενός φυσικού υπαλλήλου!
  </p>
</div>

<!-- Direct Phone Call Card -->
<div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 18px; margin: 22px 0 16px 0;">
  <p style="margin: 0 0 4px 0; font-weight: 800; font-size: 14px; color: #166534;">
    📞 Θέλετε να δείτε ζωντανά πώς λειτουργεί;
  </p>
  <p style="margin: 0; font-size: 13px; color: #15803d; line-height: 1.5;">
    Πατήστε στο παρακάτω κουμπί για εκδήλωση ενδιαφέροντος, ή καλέστε μας στα <strong><a href="tel:2111140013" style="color: #166534; text-decoration: underline;">211 114 0013</a></strong> / <strong><a href="tel:6999524389" style="color: #166534; text-decoration: underline;">6999 524 389</a></strong>.
  </p>
</div>

<div style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px; line-height: 1.5;">
  <strong>SGK Software Development — AI Innovation Greece:</strong><br />
  Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής | Τηλ: 211 114 0013 | Email: info@sgk.gr
</div>`,
    defaultButtonText: "Εκδήλωση Ενδιαφέροντος",
    defaultButtonLink: "https://www.sgk.gr/estimate"
  },
  {
    name: "Τουρισμός: Πλατφόρμα & Κρατήσεις (High Travel Style)",
    subject: "Απευθείας Online Κρατήσεις για τη νέα σας τουριστική εταιρεία (0% Προμήθειες)",
    body: `<!-- Full-Width Edge-to-Edge Hero Banner -->
<div style="margin: -24px -20px 24px -20px; text-align: center; background-color: #0b192e; overflow: hidden;">
  <a href="https://www.hightravel.gr/" target="_blank" style="display: block; text-decoration: none;">
    <img 
      src="https://www.sgk.gr/tourism-banner.jpg" 
      alt="Τουριστική Πλατφόρμα & Σύστημα Κρατήσεων High Travel - SGK Digital" 
      width="600" 
      style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; border: 0;"
    />
  </a>
</div>

<h2 style="color: #0f172a; font-size: 20px; font-weight: 800; line-height: 1.35; margin: 0 0 14px 0;">Απευθείας Online Κρατήσεις — Χωρίς Προμήθειες σε Τρίτους</h2>

<p style="margin: 0 0 12px 0; color: #334155; font-size: 15px; line-height: 1.6;">Γεια σας,</p>

<p style="margin: 0 0 12px 0; color: #334155; font-size: 15px; line-height: 1.6;">Συγχαρητήρια για την έναρξη της νέας σας εταιρείας και καλή αρχή στην τουριστική αγορά!</p>

<p style="margin: 0 0 16px 0; color: #334155; font-size: 15px; line-height: 1.6;">Στην εποχή μας, ο ταξιδιώτης αποφασίζει και κλείνει τις διακοπές ή τις εκδρομές του <strong>από το κινητό του μέσα σε λίγα λεπτά</strong>. Αν η διαδικασία δεν είναι άμεση και εύκολη, η κράτηση χάνεται ή αναγκάζεστε να πληρώνετε υπέρογκες προμήθειες (15% έως 25%) σε μεσάζοντες και πλατφόρμες τρίτων.</p>

<!-- Live Case Study Card -->
<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #3b5bdb; border-radius: 12px; padding: 16px 18px; margin: 20px 0;">
  <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 800; color: #0f172a;">
    Πραγματικό Παράδειγμα: High Travel (<a href="https://www.hightravel.gr/" target="_blank" style="color: #3b5bdb; font-weight: bold; text-decoration: underline;">hightravel.gr</a>)
  </p>
  <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
    Σχεδιάσαμε και παραδώσαμε την αυτόνομη τουριστική πλατφόρμα της High Travel Ι.Κ.Ε., δίνοντάς τους τη δυνατότητα να δέχονται καθημερινά online κρατήσεις και πληρωμές με κάρτα <strong>απευθείας στον τραπεζικό τους λογαριασμό, με 0% προμήθειες</strong>.
  </p>
</div>

<p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 800; color: #0f172a;">Τι κερδίζετε στην καθημερινή λειτουργία της επιχείρησής σας:</p>

<div style="margin: 0 0 16px 0; padding-left: 4px;">
  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #334155;">
    <strong>Άμεσες Κρατήσεις από το Κινητό σε 3 Κλικ:</strong> Οι ταξιδιώτες βρίσκουν προορισμούς, διαθεσιμότητα και κλείνουν θέση αμέσως χωρίς κολλήματα.
  </p>
  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #334155;">
    <strong>Ανέβασμα Εκδρομής σε 2 Λεπτά:</strong> Πανεύκολο σύστημα διαχείρισης — οποιοσδήποτε στην ομάδα σας ανεβάζει νέα ταξίδια, φωτογραφίες, τιμές και προσφορές χωρίς καμία τεχνική γνώση.
  </p>
  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #334155;">
    <strong>Αυτόματες Εισπράξεις & Vouchers 24/7:</strong> Οι πληρωμές μπαίνουν απευθείας στην τράπεζά σας και τα voucher αποστέλλονται αυτόματα στον πελάτη, ακόμα κι όταν το γραφείο είναι κλειστό.
  </p>
  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #334155;">
    <strong>0% Προμήθειες — 100% Δικό σας:</strong> Κρατάτε όλο το κέρδος των πωλήσεών σας. Η πλατφόρμα ανήκει αποκλειστικά σε εσάς χωρίς μηνιαίες δεσμεύσεις ή ποσοστά ανά κράτηση.
  </p>
  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #334155;">
    <strong>100% Συμβατότητα ΓΕΜΗ & ΜΗ.Τ.Ε.:</strong> Αυτόματη ανάρτηση όλων των νόμιμων εταιρικών στοιχείων δημοσιότητας.
  </p>
</div>

<!-- Direct Phone Call Card -->
<div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 18px; margin: 22px 0 16px 0;">
  <p style="margin: 0 0 4px 0; font-weight: 800; font-size: 14px; color: #166534;">
    📞 Θέλετε να συζητήσουμε άμεσα για τη νέα σας εταιρεία;
  </p>
  <p style="margin: 0; font-size: 13px; color: #15803d; line-height: 1.5;">
    Πατήστε στο παρακάτω κουμπί για εκδήλωση ενδιαφέροντος ή καλέστε μας απευθείας στα <strong><a href="tel:2111140013" style="color: #166534; text-decoration: underline;">211 114 0013</a></strong> / <strong><a href="tel:6999524389" style="color: #166534; text-decoration: underline;">6999 524 389</a></strong>.
  </p>
</div>

<div style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px; line-height: 1.5;">
  <strong>Πληροφορίες Διαφάνειας & GDPR:</strong><br />
  Το παρόν μήνυμα αποτελεί μία μεμονωμένη επιχειρηματική ενημέρωση (B2B) και απευθύνεται αποκλειστικά στα δημόσια καταχωρημένα στοιχεία επικοινωνίας της νεοσυσταθείσας εταιρείας σας στα Ανοικτά Δεδομένα του <strong>Γ.Ε.ΜΗ. (OpenData API)</strong>. Δεν είστε εγγεγραμμένοι σε λίστα newsletter και <strong>δεν θα λάβετε δεύτερο email</strong> από εμάς.
</div>`,
    defaultButtonText: "Εκδήλωση Ενδιαφέροντος",
    defaultButtonLink: "https://www.sgk.gr/estimate"
  },

  {
    name: "🏢 Αναβάθμιση ΙΚΕ σε Πλήρες Website & Local SEO (390€)",
    subject: "Αναβάθμιση σε Πλήρη Εταιρική Ιστοσελίδα & Google Maps (Ειδική Προσφορά Συνεργάτη)",
    body: `<!-- Full-Width Edge-to-Edge Hero Banner -->
<div style="margin: -24px -20px 24px -20px; text-align: center; background-color: #0f172a; overflow: hidden;">
  <a href="https://www.sgk.gr/estimate" target="_blank" style="display: block; text-decoration: none;">
    <img 
      src="https://www.sgk.gr/images/banner-corporate-website.jpg" 
      alt="Αναβάθμιση σε Πλήρη Εταιρική Ιστοσελίδα - SGK Digital" 
      width="600" 
      style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; border: 0;"
    />
  </a>
</div>

<h2 style="color: #0f172a; font-size: 21px; font-weight: 800; line-height: 1.35; margin: 0 0 14px 0;">Μετατρέψτε την Ιστοσελίδα της Ι.Κ.Ε. σας σε Ισχυρό Εργαλείο Πωλήσεων!</h2>

<p style="margin: 0 0 12px 0; color: #334155; font-size: 15px; line-height: 1.6;">Αγαπητέ συνεργάτη,</p>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Χαιρόμαστε ιδιαίτερα που συνεργαστήκαμε για τη δημιουργία της επίσημης σελίδας ΓΕΜΗ της εταιρείας σας. Η νομική συμμόρφωση ήταν το πρώτο απαραίτητο βήμα.
</p>

<p style="margin: 0 0 16px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Τώρα που η επιχείρησή σας λειτουργεί κανονικά, οι υποψήφιοι πελάτες σας αναζητούν στη Google για να δουν τις <strong>υπηρεσίες, τα έργα και το επαγγελματικό σας προφίλ</strong>. Μια απλή μονοσέλιδη καταχώριση δεν αρκεί για να κερδίσει την εμπιστοσύνη τους και να φέρει νέες δουλειές.
</p>

<!-- Upgrade Offer Box -->
<div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 5px solid #16a34a; border-radius: 12px; padding: 16px 18px; margin: 20px 0;">
  <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 800; color: #15803d;">
    🌟 Αποκλειστική Προσφορά Αναβάθμισης για Υπάρχοντες Πελάτες — Μόνο 390€ (Εφάπαξ)
  </p>
  <p style="margin: 0; font-size: 13.5px; color: #166534; line-height: 1.55;">
    Επειδή είστε ήδη πελάτης μας, <strong>δεν πληρώνετε ξανά Hosting, Domain (.gr) ή SSL</strong> για το τρέχον έτος! Καλύπτονται ήδη από τη συνδρομή της ΙΚΕ σας.
  </p>
</div>

<p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 800; color: #0f172a;">Τι περιλαμβάνει η αναβάθμιση της ιστοσελίδας σας:</p>

<div style="margin: 0 0 16px 0; padding-left: 4px;">
  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #334155;">
    🎨 <strong>Πλήρης Σχεδιασμός & Επαγγελματικό Branding:</strong> Μοντέρνα, πολυτελής εμφάνιση προσαρμοσμένη στα χρώματα και το ύφος του κλάδου σας.
  </p>
  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #334155;">
    📄 <strong>Ολοκληρωμένες Σελίδες:</strong> Αρχική σελίδα, Αναλυτική παρουσίαση Υπηρεσιών, Σελίδα Εταιρικού Προφίλ & Portfolio/Έργα.
  </p>
  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #334155;">
    📬 <strong>Διαδραστική Φόρμα Επικοινωνίας (Lead Capture):</strong> Φόρμα αιτημάτων με άμεση ειδοποίηση στο email και στο κινητό σας για κάθε νέο υποψήφιο πελάτη.
  </p>
  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #334155;">
    📍 <strong>Google My Business & Local SEO:</strong> Σύνδεση με Google Maps και βελτιστοποίηση SEO ώστε να σας βρίσκουν τοπικά οι πελάτες σας.
  </p>
  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #334155;">
    🤖 <strong>Αναγνώριση & Προτάσεις από AI / LLMs (ChatGPT, Claude, Gemini, Copilot, Perplexity):</strong> Πλήρης προετοιμασία των ψηφιακών δεδομένων της ιστοσελίδας σας (AI Semantic SEO & llms.txt), ώστε όλα τα κορυφαία μοντέλα Τεχνητής Νοημοσύνης να γνωρίζουν άριστα την εταιρεία σας και να σας προτείνουν απευθείας σε χρήστες που αναζητούν τις υπηρεσίες σας, μετατρέποντάς τους σε νέους πελάτες!
  </p>
  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #334155;">
    ⚡ <strong>Αστραπιαία Ταχύτητα & 100% Mobile:</strong> Άψογη λειτουργία σε όλα τα κινητά και tablet με βαθμολογία Google PageSpeed 90+.
  </p>
  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #334155;">
    🏛️ <strong>Ενσωμάτωση Στοιχείων ΓΕΜΗ:</strong> Όλα τα επίσημα στοιχεία, οι διαχειριστές και η ενότητα δημοσίευσης οικονομικών καταστάσεων παραμένουν 100% ενεργά.
  </p>
</div>

<!-- Direct Phone Call Card -->
<div style="background-color: #f0f7ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 14px 18px; margin: 22px 0 16px 0;">
  <p style="margin: 0 0 4px 0; font-weight: 800; font-size: 14px; color: #0369a1;">
    📞 Θέλετε να ξεκινήσουμε άμεσα την αναβάθμιση;
  </p>
  <p style="margin: 0; font-size: 13px; color: #0284c7; line-height: 1.5;">
    Πατήστε στο παρακάτω κουμπί για εκδήλωση ενδιαφέροντος, ή καλέστε μας απευθείας στα <strong><a href="tel:2111140013" style="color: #0369a1; text-decoration: underline;">211 114 0013</a></strong> / <strong><a href="tel:6999524389" style="color: #0369a1; text-decoration: underline;">6999 524 389</a></strong>.
  </p>
</div>

<div style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px; line-height: 1.5;">
  <strong>SGK Digital — Εταιρικές Ιστοσελίδες & Ψηφιακός Μετασχηματισμός:</strong><br />
  Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής | Τηλ: 211 114 0013 | Email: info@sgk.gr
</div>`,
    defaultButtonText: "Εκδήλωση Ενδιαφέροντος",
    defaultButtonLink: "https://www.sgk.gr/estimate"
  },
  {
    name: "📊 Λογιστές & Σύμβουλοι: Client Portal & AI OCR Τιμολογίων",
    subject: "Custom Web Πλατφόρμα για το Λογιστικό σας Γραφείο | Portal Πελατών & Αυτόματο AI OCR Τιμολογίων",
    body: `<!-- Full-Width Edge-to-Edge Hero Banner -->
<div style="margin: -24px -20px 24px -20px; text-align: center; background-color: #0b1329; overflow: hidden;">
  <a href="https://www.sgk.gr/estimate" target="_blank" style="display: block; text-decoration: none;">
    <img 
      src="https://www.sgk.gr/images/banner-accounting-ai.jpg" 
      alt="Πλατφόρμα Λογιστών & AI OCR Τιμολογίων - SGK Digital" 
      width="600" 
      style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; border: 0;"
    />
  </a>
</div>

<h2 style="color: #0f172a; font-size: 21px; font-weight: 800; line-height: 1.35; margin: 0 0 14px 0;">Τέλος στο Χάος των Σκόρπιων Τιμολογίων σε Email, Viber & Χαρτιά</h2>

<p style="margin: 0 0 12px 0; color: #334155; font-size: 15px; line-height: 1.6;">Αγαπητέ συνεργάτη,</p>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Σε κάθε σύγχρονο λογιστικό και συμβουλευτικό γραφείο, το μεγαλύτερο καθημερινό "αγκάθι" είναι η <strong>συλλογή παραστατικών από τους πελάτες</strong>. Τιμολόγια που έρχονται στο Viber, φωτογραφίες αποδείξεων στο WhatsApp, συνημμένα σε διάσπαρτα emails και φυσικά χαρτιά στο γραφείο την τελευταία μέρα του μήνα.
</p>

<p style="margin: 0 0 16px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Στην <strong>SGK Digital</strong> αναπτύσσουμε <strong>Custom Web Πλατφόρμες (Client Portals) ειδικά για Λογιστές & Συμβούλους</strong>, με το δικό σας brand, που οργανώνουν αυτόματα όλη τη ροή εργασιών:
</p>

<!-- Feature Grid Box -->
<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #0284c7; border-radius: 12px; padding: 16px 18px; margin: 20px 0;">
  <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 800; color: #0369a1;">
    🚀 Τι προσφέρει η πλατφόρμα στο γραφείο σας:
  </p>
  <p style="margin: 0 0 6px 0; font-size: 13.5px; color: #0f172a; line-height: 1.6;">
    1. <strong>Προσωπική Πύλη Πελάτη (Client Portal):</strong> Κάθε πελάτης σας έχει ασφαλές login από κινητό ή PC. Τραβάει φωτογραφία το τιμολόγιο ή σέρνει το PDF και ανεβαίνει άμεσα στον φάκελό του.<br/>
    2. <strong>AI OCR & Αυτόματη Ανάγνωση:</strong> Η Τεχνητή Νοημοσύνη διαβάζει σε 2 δευτερόλεπτα το ΑΦΜ εκδότη, την ημερομηνία, την καθαρή αξία, τον συντελεστή και το ποσό ΦΠΑ.<br/>
    3. <strong>Οργάνωση ανά Μήνα & Τρίμηνο:</strong> Όλα τα παραστατικά ταξινομούνται αυτόματα. Βλέπετε σε πραγματικό χρόνο ποιοι πελάτες έχουν ανεβάσει τα έξοδά τους και ποιοι καθυστερούν.<br/>
    4. <strong>Έτοιμη Εξαγωγή για MyDATA / ERP:</strong> Εξαγωγή δεδομένων σε Excel / CSV έτοιμα για εισαγωγή στα λογιστικά σας προγράμματα (SoftOne, Entersoft, Epsilon Net κ.α.).<br/>
    5. <strong>100% GDPR & Ασφαλές Cloud:</strong> Όλα τα αρχεία των πελατών σας φυλάσσονται σε ιδιωτικό, κρυπτογραφημένο cloud με καθημερινά backups.
  </p>
</div>

<p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 800; color: #0f172a;">Γλιτώστε 25+ εργατοώρες το μήνα από χειροκίνητες καταχωρήσεις και τηλεφωνήματα υπενθύμισης!</p>

<!-- Direct Phone Call Card -->
<div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 18px; margin: 22px 0 16px 0;">
  <p style="margin: 0 0 4px 0; font-weight: 800; font-size: 14px; color: #166534;">
    📞 Θέλετε να δείτε ένα ζωντανό demo της πλατφόρμας;
  </p>
  <p style="margin: 0; font-size: 13px; color: #15803d; line-height: 1.5;">
    Πατήστε στο παρακάτω κουμπί για εκδήλωση ενδιαφέροντος ή καλέστε μας απευθείας στα <strong><a href="tel:2111140013" style="color: #166534; text-decoration: underline;">211 114 0013</a></strong> / <strong><a href="tel:6999524389" style="color: #166534; text-decoration: underline;">6999 524 389</a></strong>.
  </p>
</div>

<div style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px; line-height: 1.5;">
  <strong>SGK Software Development — Custom Business Platforms & FinTech AI:</strong><br />
  Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής | Τηλ: 211 114 0013 | Email: info@sgk.gr
</div>`,
    defaultButtonText: "Εκδήλωση Ενδιαφέροντος",
    defaultButtonLink: "https://www.sgk.gr/estimate"
  },
  {
    name: "🏡 Real Estate & Ακίνητα: Πλατφόρμα Διαχείρισης Μισθώσεων & Συμβολαίων",
    subject: "Ολοκληρωμένη Web Πλατφόρμα Διαχείρισης Ακινήτων, Μισθώσεων & Συμβολαίων",
    body: `<!-- Full-Width Edge-to-Edge Hero Banner -->
<div style="margin: -24px -20px 24px -20px; text-align: center; background-color: #f8fafc; overflow: hidden;">
  <a href="https://www.sgk.gr/estimate" target="_blank" style="display: block; text-decoration: none;">
    <img 
      src="https://www.sgk.gr/images/banner-real-estate.jpg" 
      alt="Πλατφόρμα Διαχείρισης Ακινήτων & Μισθώσεων - SGK Digital" 
      width="600" 
      style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; border: 0;"
    />
  </a>
</div>

<h2 style="color: #0f172a; font-size: 21px; font-weight: 800; line-height: 1.35; margin: 0 0 14px 0;">Όλα τα Ακίνητα, τα Μισθωτήρια & οι Εισπράξεις σε Ένα Κεντρικό Dashboard</h2>

<p style="margin: 0 0 12px 0; color: #334155; font-size: 15px; line-height: 1.6;">Αγαπητέ συνεργάτη,</p>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Στον τομέα της εκμετάλλευσης, μίσθωσης και διαχείρισης ακινήτων (Real Estate & Property Management), η παρακολούθηση πολλαπλών συμβολαίων, λήξεων, ενοικίων, κοινοχρήστων και τεχνικών εκκρεμοτήτων με απλά Excel γίνεται γρήγορα χαοτική και επιρρεπής σε λάθη.
</p>

<p style="margin: 0 0 16px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Στην <strong>SGK Digital</strong> δημιουργούμε <strong>Custom Web Εφαρμογές Διαχείρισης Ακινήτων</strong>, απόλυτα προσαρμοσμένες στο δικό σας χαρτοφυλάκιο:
</p>

<!-- Feature Box -->
<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #0f766e; border-radius: 12px; padding: 16px 18px; margin: 20px 0;">
  <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 800; color: #115e59;">
    🏢 Τι κερδίζετε στην καθημερινή διαχείριση του χαρτοφυλακίου σας:
  </p>
  <p style="margin: 0 0 6px 0; font-size: 13.5px; color: #0f172a; line-height: 1.6;">
    1. <strong>Κεντρικό Μητρώο Ακινήτων:</strong> Πλήρης ψηφιακός φάκελος ανά ακίνητο (φωτογραφίες, κατόψεις, συμβόλαια, ΠΕΑ, πιστοποιητικά, τετραγωνικά, τιμή).<br/>
    2. <strong>Παρακολούθηση Μισθώσεων & Συμβολαίων:</strong> Αυτόματες ειδοποιήσεις για επερχόμενες λήξεις μισθώσεων, αναπροσαρμογές ενοικίων και ανανεώσεις.<br/>
    3. <strong>Έλεγχος Εισπράξεων & Καθυστερήσεων:</strong> Live εικόνα πληρωμών — αυτόματη αποστολή υπενθυμίσεων και αποδείξεων σε ενοικιαστές μέσω Email/SMS.<br/>
    4. <strong>Διαχείριση Βλαβών & Συντήρησης:</strong> Καταγραφή τεχνικών προβλημάτων και ανάθεση σε τεχνικούς με live status επισκευής.<br/>
    5. <strong>AI Chatbot Ενδιαφερομένων (24/7):</strong> Αυτόματος ψηφιακός βοηθός στην ιστοσελίδα σας που απαντάει σε ερωτήσεις υποψήφιων ενοικιαστών/αγοραστών και κλείνει ραντεβού για υποδείξεις.
  </p>
</div>

<p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 800; color: #0f172a;">Αποκτήστε πλήρη έλεγχο και διαφάνεια για κάθε τετραγωνικό μέτρο της επένδυσής σας.</p>

<!-- Direct Phone Call Card -->
<div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 18px; margin: 22px 0 16px 0;">
  <p style="margin: 0 0 4px 0; font-weight: 800; font-size: 14px; color: #166534;">
    📞 Θέλετε να συζητήσουμε τις ανάγκες του χαρτοφυλακίου σας;
  </p>
  <p style="margin: 0; font-size: 13px; color: #15803d; line-height: 1.5;">
    Πατήστε στο παρακάτω κουμπί για εκδήλωση ενδιαφέροντος ή καλέστε μας απευθείας στα <strong><a href="tel:2111140013" style="color: #166534; text-decoration: underline;">211 114 0013</a></strong> / <strong><a href="tel:6999524389" style="color: #166534; text-decoration: underline;">6999 524 389</a></strong>.
  </p>
</div>

<div style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px; line-height: 1.5;">
  <strong>SGK Software Development — Custom Real Estate & PropTech Solutions:</strong><br />
  Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής | Τηλ: 211 114 0013 | Email: info@sgk.gr
</div>`,
    defaultButtonText: "Εκδήλωση Ενδιαφέροντος",
    defaultButtonLink: "https://www.sgk.gr/estimate"
  },
  {
    name: "📞 AI Voice Agent: Τηλεφωνικός Βοηθός 24/7 για Εισερχόμενες Κλήσεις",
    subject: "Μην χάνετε καμία κλήση πελάτη: AI Φωνητικός Βοηθός 24/7 για την εταιρεία σας",
    body: `<!-- Full-Width Edge-to-Edge Hero Banner -->
<div style="margin: -24px -20px 24px -20px; text-align: center; background-color: #0b0f19; overflow: hidden;">
  <a href="https://www.sgk.gr/estimate" target="_blank" style="display: block; text-decoration: none;">
    <img 
      src="https://www.sgk.gr/images/hero_ai_video_agent.webp" 
      alt="Voice AI Telephony Agents 24/7 - SGK Digital" 
      width="600" 
      style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; border: 0;"
    />
  </a>
</div>

<h2 style="color: #0f172a; font-size: 21px; font-weight: 800; line-height: 1.35; margin: 0 0 14px 0;">Καμία Αναπάντητη Κλήση: AI Τηλεφωνικός Βοηθός με Φυσική Ελληνική Φωνή 24/7</h2>

<p style="margin: 0 0 12px 0; color: #334155; font-size: 15px; line-height: 1.6;">Αγαπητέ συνεργάτη,</p>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Πόσες φορές έχει τύχει να χάσετε μια κλήση από υποψήφιο πελάτη επειδή ήσασταν σε ραντεβού, οδηγούσατε ή ήταν εκτός ωραρίου γραφείου; <strong>Στο 80% των περιπτώσεων, ο πελάτης δεν αφήνει μήνυμα — απλά καλεί τον επόμενο ανταγωνιστή σας.</strong>
</p>

<p style="margin: 0 0 16px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Στην <strong>SGK Digital</strong> υλοποιούμε <strong>Voice AI Φωνητικούς Πράκτορες</strong> για το τηλεφωνικό κέντρο της επιχείρησής σας:
</p>

<!-- Feature Box -->
<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #6366f1; border-radius: 12px; padding: 16px 18px; margin: 20px 0;">
  <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 800; color: #4338ca;">
    🎙️ Πώς λειτουργεί ο Voice AI Agent:
  </p>
  <p style="margin: 0 0 6px 0; font-size: 13.5px; color: #0f172a; line-height: 1.6;">
    1. <strong>Άπταιστη Φυσική Ελληνική Ομιλία (Απόκριση &lt;800ms):</strong> Απαντάει αμέσως σαν ένας έμπειρος γραμματέας χωρίς ρομποτικές παύσεις.<br/>
    2. <strong>Κλείσιμο Ραντεβού & Καταγραφή Στοιχείων:</strong> Συνομιλεί με τον πελάτη, καταγράφει το αίτημά του και κλείνει ραντεβού απευθείας στο Google Calendar σας.<br/>
    3. <strong>Άμεση Ειδοποίηση με SMS & Email:</strong> Με το που κλείσει η κλήση, λαμβάνετε στο κινητό σας πλήρη σύνοψη της συνομιλίας, το τηλέφωνο και το αίτημα του πελάτη.<br/>
    4. <strong>Σύνδεση με το Υπάρχον Τηλέφωνό σας:</strong> Συνδέεται πανεύκολα με εκτροπή κλήσης από το σταθερό ή το κινητό σας όταν δεν μπορείτε να απαντήσετε.
  </p>
</div>

<!-- Direct Phone Call Card -->
<div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 18px; margin: 22px 0 16px 0;">
  <p style="margin: 0 0 4px 0; font-weight: 800; font-size: 14px; color: #166534;">
    📞 Θέλετε να ακούσετε ζωντανό δείγμα Voice AI;
  </p>
  <p style="margin: 0; font-size: 13px; color: #15803d; line-height: 1.5;">
    Πατήστε στο παρακάτω κουμπί για εκδήλωση ενδιαφέροντος ή καλέστε μας στα <strong><a href="tel:2111140013" style="color: #166534; text-decoration: underline;">211 114 0013</a></strong> / <strong><a href="tel:6999524389" style="color: #166534; text-decoration: underline;">6999 524 389</a></strong>.
  </p>
</div>

<div style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px; line-height: 1.5;">
  <strong>SGK Software Development — Voice AI Telephony & Business Automation:</strong><br />
  Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής | Τηλ: 211 114 0013 | Email: info@sgk.gr
</div>`,
    defaultButtonText: "Εκδήλωση Ενδιαφέροντος",
    defaultButtonLink: "https://www.sgk.gr/estimate"
  }
];

const EmailTimingIndicator = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour + minute / 60;

  let status: 'good' | 'okay' | 'bad' = 'bad';
  let message = 'Ακατάλληλη Στιγμή';

  if (day === 0 || day === 6 || day === 1) {
    status = 'bad';
    message = day === 1 ? 'Μην στείλεις (Δευτέρα/Spam)' : 'Σαββατοκύριακο (Ακατάλληλο)';
  } else if (time < 8 || time >= 17) {
    status = 'bad';
    message = 'Εκτός Ωραρίου (Μην στείλεις)';
  } else if (day === 5 && time > 14) {
    status = 'bad';
    message = 'Απόγευμα Παρασκευής (Checkout)';
  } else if ((day >= 2 && day <= 4) && ((time >= 8.5 && time <= 10.5) || (time >= 13.5 && time <= 15))) {
    status = 'good';
    message = 'Ιδανική Στιγμή (Στείλε τώρα!)';
  } else {
    status = 'okay';
    message = 'Μέτρια Στιγμή (ΟΚ για αποστολή)';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm border ${
      status === 'good' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
      status === 'okay' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
      'bg-rose-50 text-rose-700 border-rose-200'
    }`} title="Βασισμένο σε B2B ψυχολογία">
      <span className="relative flex h-2 w-2">
        {status === 'good' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${
          status === 'good' ? 'bg-emerald-500' : 
          status === 'okay' ? 'bg-amber-500' : 'bg-rose-500'
        }`}></span>
      </span>
      {message}
    </div>
  );
};

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
  const [savedContracts, setSavedContracts] = useState<any[]>([]);
  
  // Single Add Lead form state
  const [newEmail, setNewEmail] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  // Lead Edit & Create Modal State
  const [editingLead, setEditingLead] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingLead, setIsSavingLead] = useState(false);

  // Bulk Import state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importData, setImportData] = useState("");
  const [importingProgress, setImportingProgress] = useState(false);
  const [autoProcessing, setAutoProcessing] = useState(false);

  // PDF Upload states
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  // Live GEMI Scanner state & Real-time Live Modal
  const [isScanningGemi, setIsScanningGemi] = useState(false);
  const [scanMonth, setScanMonth] = useState<"current" | "previous" | "all_year">("current");
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [scanStatusMessage, setScanStatusMessage] = useState("Ετοιμασία σάρωσης...");
  const [scanStats, setScanStats] = useState({
    totalExamined: 0,
    added: 0,
    totalDuplicates: 0,
    totalHasWebsite: 0,
    totalCustomDomain: 0,
    totalNoEmail: 0,
    totalOldDate: 0,
  });
  const [scannedNewLeads, setScannedNewLeads] = useState<any[]>([]);
  const [scanLogs, setScanLogs] = useState<Array<{
    id: string;
    time: string;
    type: string;
    category?: string;
    company?: string;
    email?: string;
    afm?: string;
    date?: string;
    url?: string;
    phone?: string;
    reason?: string;
    message?: string;
  }>>([]);
  const scanTerminalRef = useRef<HTMLDivElement>(null);

  // Load saved contracts & check for pending drafts
  useEffect(() => {
    const loadContracts = () => {
      const saved = localStorage.getItem("sgk_saved_contracts");
      if (saved) {
        try {
          setSavedContracts(JSON.parse(saved));
        } catch (e) {}
      }
    };
    loadContracts();

    const pendingDraft = localStorage.getItem("sgk_email_draft");
    if (pendingDraft) {
      try {
        const parsed = JSON.parse(pendingDraft);
        if (parsed.subject) setCampaignSubject(parsed.subject);
        if (parsed.body) setCampaignBody(parsed.body);
        if (parsed.buttonText !== undefined) setButtonText(parsed.buttonText);
        if (parsed.buttonLink !== undefined) setButtonLink(parsed.buttonLink);
        if (parsed.targetLead) setSingleLeadTarget(parsed.targetLead);
        setIsCampaignModalOpen(true);
        localStorage.removeItem("sgk_email_draft");
      } catch (e) {}
    }
  }, [isCampaignModalOpen]);

// Safe UTF-8 Base64 encoder
function safeEncodeBase64(data: any): string {
  try {
    const jsonStr = JSON.stringify(data);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = "";
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binary);
  } catch (e) {
    return "";
  }
}

  // Helper to insert a contract into the active email composer
  const handleInsertContract = (contract: any) => {
    if (!contract) return;
    const docId = contract.id || ("contract_" + (contract.clientAfm || contract.gemiNo || Date.now()));
    const b64 = safeEncodeBase64(contract);
    const docUrl = `https://www.sgk.gr/doc/contract?id=${docId}&data=${b64}&download=1`;

    const companyLabel = contract.tradeName || contract.companyName || singleLeadTarget?.company || "";
    const amountLabel = contract.totalAmountNum ? `${contract.totalAmountNum.toFixed(2).replace('.', ',')} €` : (contract.totalAmountText || "150,00 €");

    // Cloud document sync
    try {
      fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contract", id: docId, data: contract, leadEmail: singleLeadTarget?.email || "" })
      }).catch(e => console.error(e));
    } catch(e) {}

    const body = `<p>Καλημέρα σας,</p>
<p>Σας στέλνουμε αυτό το μήνυμα σε συνέχεια της επικοινωνίας μας σχετικά με το νέο σας <strong>Website ${companyLabel}</strong></p>
<p>Στο παρόν email <strong>επισυνάπτουμε το συμφωνητικό συνεργασίας μας</strong>. Το έχουμε ανεβάσει και στο gov και πρέπει να υπογραφεί</p>

<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0;">
  <h3 style="margin-top: 0; color: #3b5bdb; font-size: 16px; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">💸 Στοιχεία Κατάθεσης Προκαταβολής</h3>
  <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; line-height: 1.5;">
    <tbody>
      <tr>
        <td style="padding: 6px 0px; font-weight: bold; color: #475569; width: 35%;">Ποσό:</td>
        <td style="padding: 6px 0px; color: #0f172a; font-weight: bold; font-size: 16px; width: 65%;">${amountLabel}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0px; font-weight: bold; color: #475569; width: 35%;">Τράπεζα:</td>
        <td style="padding: 6px 0px; color: #0f172a; width: 65%;">Eurobank</td>
      </tr>
      <tr>
        <td style="padding: 6px 0px; font-weight: bold; color: #475569; width: 35%;">Δικαιούχος:</td>
        <td style="padding: 6px 0px; color: #0f172a; font-weight: bold; width: 65%;">ΤΣΑΒΟΣ ΣΠΥΡΙΔΩΝ</td>
      </tr>
      <tr>
        <td style="padding: 6px 0px; font-weight: bold; color: #475569; vertical-align: top; width: 35%;">IBAN:</td>
        <td style="padding: 6px 0px; color: #0f172a; font-family: monospace; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; width: 65%;">GR4602601970000830201330337</td>
      </tr>
      <tr>
        <td style="padding: 6px 0px; font-weight: bold; color: #475569; width: 35%;">Αιτιολογία:</td>
        <td style="padding: 6px 0px; color: #475569; font-style: italic; width: 65%;">website ${companyLabel}</td>
      </tr>
    </tbody>
  </table>
</div>

<p>Παραμένουμε στη διάθεσή σας για οποιαδήποτε απορία ή διευκρίνιση.</p>
<p style="margin-top: 30px !important; border-top: 1px solid #f0f0f0; padding-top: 20px;">Με εκτίμηση,<br /><strong>Η ομάδα της SGK Software Development</strong></p>`;

    setCampaignSubject(`Ιδιωτικό Συμφωνητικό Κατασκευής Ιστοσελίδας — ${companyLabel || "SGK Digital"}`);
    setCampaignBody(body);
    setButtonText("📄 Λήψη Συμφωνητικού (PDF)");
    setButtonLink(docUrl);
    toast.success(`Εισήχθη το συμφωνητικό για «${companyLabel || "Πελάτη"}» με σύνδεσμο άμεσης λήψης PDF!`);
  };

  // Helper to insert invoice / offer into email
  const handleInsertInvoice = (customData?: any) => {
    const docId = customData?.id || ("invoice_" + Date.now());
    const invoicePayload = customData || {
      clientName: singleLeadTarget?.company || singleLeadTarget?.first_name || "Πελάτης",
      net: 120.97,
      vat: 29.03,
      gross: 150,
      payable: 150,
    };
    const b64 = safeEncodeBase64(invoicePayload);
    const docUrl = `https://www.sgk.gr/doc/invoice?id=${docId}&data=${b64}&download=1`;

    const clientTitle = customData?.clientName || singleLeadTarget?.company || singleLeadTarget?.first_name || "";

    // Cloud document sync
    try {
      fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "invoice", 
          id: docId, 
          data: invoicePayload, 
          leadEmail: singleLeadTarget?.email || "" 
        })
      }).catch(e => console.error(e));
    } catch(e) {}

    const netVal = invoicePayload.net || 120.97;
    const vatVal = invoicePayload.vat || 29.03;
    const grossVal = invoicePayload.gross || 150;

    const body = `<h2>Εξοφλημένο Τιμολόγιο 🧾</h2>
<p>Αγαπητέ συνεργάτη,</p>
<p>Σας αποστέλλουμε συνημμένα σε μορφή PDF το εξοφλημένο τιμολόγιο παροχής υπηρεσιών που αφορά τις εργασίες μας. <br/><strong>Το παραστατικό έχει εξοφληθεί πλήρως και δεν εκκρεμεί κάποιο υπόλοιπο.</strong></p>
<h4>Στοιχεία Παραστατικού</h4>
<table style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 13px; text-align: left;">
  <thead>
    <tr style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1;">
      <th style="padding: 8px;">Περιγραφή Χρέωσης</th>
      <th style="padding: 8px; text-align: right; width: 100px;">Ποσό</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px; vertical-align: middle;">
        <strong>Κατασκευή & Ανάπτυξη Λογισμικού / Ιστοσελίδας</strong><br/>
        <span style="font-size: 11px; color: #64748b; line-height: 1.4; display: block; margin-top: 4px;">
          Τιμολόγιο Παροχής Υπηρεσιών # ${docId}
        </span>
      </td>
      <td style="padding: 8px; text-align: right; font-weight: 600; vertical-align: middle;">${netVal} €</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px; vertical-align: middle;">ΦΠΑ 24%</td>
      <td style="padding: 8px; text-align: right; font-weight: 600; vertical-align: middle;">${vatVal} €</td>
    </tr>
    <tr style="background-color: #f0fdf4; border-top: 2px solid #4ade80; border-bottom: 2px solid #4ade80; font-weight: bold;">
      <td style="padding: 10px 8px; color: #166534;">Συνολικό Ποσό (με ΦΠΑ)</td>
      <td style="padding: 10px 8px; text-align: right; color: #166534; font-size: 15px; font-weight: 900;">${grossVal} €</td>
    </tr>
  </tbody>
</table>
<div style="background-color: #f0fdf4; border: 2px solid #4ade80; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0;">
  <div style="display: inline-block; background-color: #22c55e; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-weight: 900; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
    ✓ ΕΞΟΦΛΗΘΗΚΕ / PAID
  </div>
  <p style="margin: 0 !important; font-size: 14px; font-weight: bold; color: #166534; line-height: 1.5;">Το παραστατικό έχει εξοφληθεί πλήρως. Σας ευχαριστούμε πολύ για τη συνεργασία και την εμπιστοσύνη σας!</p>
</div>
<p style="margin-top: 20px; color: #64748b; font-style: italic;">Η ομάδα της SGK Digital</p>`;

    setCampaignSubject(`Εξοφλημένο Τιμολόγιο Παροχής Υπηρεσιών — ${clientTitle || "SGK Digital"}`);
    setCampaignBody(body);
    setButtonText("🧾 Λήψη Εξοφλημένου Τιμολογίου (PDF)");
    setButtonLink(docUrl);
    toast.success(`Εισήχθη το εξοφλημένο τιμολόγιο για «${clientTitle || "Πελάτη"}» με PDF link!`);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Παρακαλώ επιλέξτε μόνο αρχεία PDF");
      return;
    }

    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setPdfUrl(result.publicUrl);
      setButtonText("Λήψη Τιμολογίου (PDF)");
      setButtonLink(result.publicUrl);
      toast.success("Το PDF ανέβηκε επιτυχώς!");
    } catch (err: any) {
      console.error("PDF upload error:", err);
      toast.error(
        <div className="text-xs">
          <p className="font-bold text-red-600">Αποτυχία ανεβάσματος στο Supabase Storage.</p>
          <p className="mt-1 text-slate-500 leading-normal">{err.message || "Σφάλμα κατά την αποστολή του αρχείου."} Μπορείτε εναλλακτικά να εισάγετε το link του PDF χειροκίνητα στο πεδίο "Σύνδεσμος Κουμπιού".</p>
        </div>,
        { duration: 6000 }
      );
    } finally {
      setUploadingPdf(false);
    }
  };

  // Client-side mounted state for React Portal
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'new_ike' | 'legacy' | 'new' | 'active' | 'completed' | 'converted' | 'unsubscribed'>('all');
  const [cleaningDuplicates, setCleaningDuplicates] = useState(false);
  const [isSyncingGemi, setIsSyncingGemi] = useState(false);
  const [professionSubFilter, setProfessionSubFilter] = useState<string>('all');

  const fetchLeads = async () => {
    setLoading(true);
    let allLeads: any[] = [];
    let page = 0;
    const pageSize = 1000;
    let hasError = false;

    while (true) {
      const { data, error } = await supabase
        .from("sgk_mails")
        .select("*")
        .order("created_at", { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (error) {
        hasError = true;
        toast.error("Σφάλμα φόρτωσης λίστας email");
        console.error(error);
        break;
      }

      if (!data || data.length === 0) break;
      allLeads.push(...data);
      if (data.length < pageSize) break;
      page++;
    }

    if (!hasError) {
      setLeads(allLeads);
    }
    setLoading(false);
    return allLeads;
  };

  useEffect(() => {
    fetchLeads();
    setIsClient(true);
  }, []);

  useEffect(() => {
    setSelectedLeads([]);
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    if (scanTerminalRef.current) {
      scanTerminalRef.current.scrollTop = scanTerminalRef.current.scrollHeight;
    }
  }, [scanLogs]);

  const handleOpenEditLead = (lead: any) => {
    setEditingLead({
      id: lead.id,
      email: lead.email || "",
      first_name: lead.first_name || "",
      last_name: lead.last_name || "",
      company: lead.company || "",
      phone: lead.phone || "",
      afm: lead.afm || "",
      gemi_number: lead.gemi_number || "",
      converted: Boolean(lead.converted),
      unsubscribed: Boolean(lead.unsubscribed),
      type: lead.type || "new_ike",
    });
    setIsEditModalOpen(true);
  };

  const handleOpenCreateLead = () => {
    setEditingLead({
      id: null,
      email: "",
      first_name: "",
      last_name: "",
      company: "",
      phone: "",
      afm: "",
      gemi_number: "",
      converted: false,
      unsubscribed: false,
      type: "new_ike",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    if (!editingLead.email.trim()) {
      toast.error("Παρακαλώ εισάγετε ένα email");
      return;
    }
    const emailLower = editingLead.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) {
      toast.error("Μη έγκυρο format email");
      return;
    }

    setIsSavingLead(true);
    try {
      const payload: any = {
        email: emailLower,
        first_name: editingLead.first_name?.trim() || null,
        last_name: editingLead.last_name?.trim() || null,
        company: editingLead.company?.trim() || null,
        phone: editingLead.phone?.trim() || null,
        afm: editingLead.afm?.trim() || null,
        gemi_number: editingLead.gemi_number?.trim() || null,
        converted: Boolean(editingLead.converted),
        unsubscribed: Boolean(editingLead.unsubscribed),
        type: editingLead.type || "new_ike",
      };

      if (editingLead.id) {
        // Update existing lead
        const { error } = await supabase
          .from("sgk_mails")
          .update(payload)
          .eq("id", editingLead.id);

        if (error) throw error;
        toast.success("Τα στοιχεία του πελάτη ενημερώθηκαν επιτυχώς!");
      } else {
        // Create new lead
        payload.marketing_consent = true;
        payload.unsubscribe_token = crypto.randomUUID();
        payload.email_sequence_step = 0;

        const { error } = await supabase
          .from("sgk_mails")
          .insert([payload]);

        if (error) throw error;
        toast.success("Ο νέος πελάτης προστέθηκε επιτυχώς!");
      }

      setIsEditModalOpen(false);
      setEditingLead(null);
      await fetchLeads();
    } catch (err: any) {
      console.error(err);
      toast.error(`Σφάλμα: ${err.message || "Αποτυχία αποθήκευσης"}`);
    } finally {
      setIsSavingLead(false);
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

  
    const handleSyncLeadFromGemi = async (lead: any) => {
    const query = lead.afm || lead.gemi_number;
    if (!query) {
      toast.error("Δεν υπάρχει καταχωρημένο ΑΦΜ ή Αρ. ΓΕΜΗ.");
      return;
    }
    const toastId = toast.loading(`Αναζήτηση ${query} στο Γ.Ε.ΜΗ...`);
    try {
      const res = await fetch(`/api/gemi-lookup?query=${encodeURIComponent(query)}&quick=true`);
      const data = await res.json();
      if (!res.ok || !data.success || !data.company) {
        throw new Error(data.error || "Δεν βρέθηκε η επιχείρηση στο Γ.Ε.ΜΗ.");
      }
      const c = data.company;
      const detectedType = c.detectedIndustry || lead.type || "services";
      const officialName = c.companyName || lead.company;

      const { error } = await supabase
        .from("sgk_mails")
        .update({
          company: officialName,
          type: detectedType,
          gemi_number: c.gemiNo || lead.gemi_number,
          afm: c.clientAfm || lead.afm
        })
        .eq("id", lead.id);

      if (error) throw error;

      setLeads(prev => prev.map(l => l.id === lead.id ? {
        ...l,
        company: officialName,
        type: detectedType,
        gemi_number: c.gemiNo || l.gemi_number,
        afm: c.clientAfm || l.afm
      } : l));

      const profLabel = CLIENT_PROFESSIONS[detectedType]?.label || detectedType;
      toast.success(`Ενημερώθηκε από Γ.Ε.ΜΗ: ${officialName} (${profLabel})`, { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(`Σφάλμα Γ.Ε.ΜΗ: ${err.message || "Αποτυχία ανάκτησης"}`, { id: toastId });
    }
  };

  const handleSyncAllConvertedFromGemi = async () => {
    const targetLeads = leads.filter(l => l.converted && (l.afm || l.gemi_number));
    if (targetLeads.length === 0) {
      toast.info("Δεν βρέθηκαν πελάτες με ΑΦΜ ή Αρ. ΓΕΜΗ.");
      return;
    }

    setIsSyncingGemi(true);
    const toastId = toast.loading(`Αναζήτηση στο Γ.Ε.ΜΗ. για ${targetLeads.length} πελάτες...`);
    let updatedCount = 0;

    try {
      for (const lead of targetLeads) {
        const query = lead.afm || lead.gemi_number;
        try {
          const res = await fetch(`/api/gemi-lookup?query=${encodeURIComponent(query)}&quick=true`);
          const data = await res.json();
          if (data && data.success && data.company) {
            const c = data.company;
            const detectedType = c.detectedIndustry || lead.type || "services";
            const officialName = c.companyName || lead.company;

            await supabase
              .from("sgk_mails")
              .update({
                company: officialName,
                type: detectedType,
                gemi_number: c.gemiNo || lead.gemi_number,
                afm: c.clientAfm || lead.afm
              })
              .eq("id", lead.id);

            setLeads(prev => prev.map(l => l.id === lead.id ? {
              ...l,
              company: officialName,
              type: detectedType,
              gemi_number: c.gemiNo || l.gemi_number,
              afm: c.clientAfm || l.afm
            } : l));

            updatedCount++;
          }
        } catch (e) {
          console.error(e);
        }
      }
      toast.success(`Ολοκληρώθηκε! Ενημερώθηκαν ${updatedCount} πελάτες απευθείας από το Γ.Ε.ΜΗ.`, { id: toastId });
    } catch (err: any) {
      toast.error(`Σφάλμα: ${err.message}`, { id: toastId });
    } finally {
      setIsSyncingGemi(false);
    }
  };

  const handleUpdateLeadType = async (id: string, newType: string) => {
    try {
      const { error } = await supabase
        .from("sgk_mails")
        .update({ type: newType })
        .eq("id", id);
      if (error) throw error;
      setLeads(prev => prev.map(l => l.id === id ? { ...l, type: newType } : l));
      const profLabel = CLIENT_PROFESSIONS[newType]?.label || newType;
      toast.success(`Ο κλάδος ενημερώθηκε σε «${profLabel}»!`);
    } catch (err: any) {
      console.error(err);
      toast.error("Σφάλμα κατά την ενημέρωση κλάδου");
    }
  };

  const handleToggleConverted = async (id: string, currentStatus: boolean, email: string) => {
    const newStatus = !currentStatus;
    const { error } = await supabase
      .from("sgk_mails")
      .update({ converted: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Σφάλμα κατά την ενημέρωση της κατάστασης");
      console.error(error);
    } else {
      if (newStatus) {
        toast.success(`Το email ${email} σημειώθηκε ως 🎉 ΠΕΛΑΤΗΣ! Τα αυτόματα AI emails διακόπηκαν.`);
      } else {
        toast.info(`Το email ${email} επαναφέρθηκε σε ενεργό Lead.`);
      }
      fetchLeads();
    }
  };

  const handleBlacklistEmail = async (id: string, email: string) => {
    if (!window.confirm(`⚠️ Θέλετε να προσθέσετε το email «${email}» στη Μόνιμη Μαύρη Λίστα (Blacklist);\n\nΔεν θα σταλεί ΠΟΤΕ ξανά email σε αυτόν τον παραλήπτη.`)) {
      return;
    }

    const { error } = await supabase
      .from("sgk_mails")
      .update({ 
        unsubscribed: true,
        marketing_consent: false
      })
      .eq("id", id);

    if (error) {
      toast.error(`Σφάλμα κατά τον αποκλεισμό: ${error.message}`);
    } else {
      toast.success(`⛔ Το email «${email}» μπήκε στη Μόνιμη Μαύρη Λίστα και αποκλείστηκε 100%!`);
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

  const handleRemoveDuplicates = async () => {
    setCleaningDuplicates(true);
    try {
      const { data: allLeads, error } = await supabase
        .from("sgk_mails")
        .select("id, email, created_at")
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (!allLeads || allLeads.length === 0) {
        toast.info("Δεν υπάρχουν εγγραφές στη βάση!");
        return;
      }

      const seenEmails = new Set<string>();
      const idsToDelete: string[] = [];

      allLeads.forEach((item) => {
        const emailLower = (item.email || "").trim().toLowerCase();
        if (emailLower) {
          if (seenEmails.has(emailLower)) {
            idsToDelete.push(item.id);
          } else {
            seenEmails.add(emailLower);
          }
        }
      });

      if (idsToDelete.length === 0) {
        toast.info("Δεν βρέθηκαν διπλότυπα emails στη βάση! Η λίστα είναι 100% καθαρή.");
        return;
      }

      if (!window.confirm(`Βρέθηκαν ${idsToDelete.length} διπλότυπα emails. Θέλετε να διαγραφούν αυτόματα;`)) {
        return;
      }

      const { error: deleteError } = await supabase
        .from("sgk_mails")
        .delete()
        .in("id", idsToDelete);

      if (deleteError) throw deleteError;

      toast.success(`Ολοκληρώθηκε! Διαγράφηκαν επιτυχώς ${idsToDelete.length} διπλότυπα emails.`);
      setSelectedLeads([]);
      await fetchLeads();
    } catch (err: any) {
      console.error(err);
      toast.error(`Σφάλμα κατά την αφαίρεση διπλότυπων: ${err.message || "Άγνωστο σφάλμα"}`);
    } finally {
      setCleaningDuplicates(false);
    }
  };

  const handleSendCampaign = async () => {
    let targets: any[] = [];

    if (singleLeadTarget) {
      const email = (singleLeadTarget.email || "").trim().toLowerCase();
      if (!email) {
        toast.error("Παρακαλώ εισάγετε το email του παραλήπτη");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Μη έγκυρο format email παραλήπτη");
        return;
      }

      if (isEmailBlacklisted(email)) {
        toast.error(`⛔ ΑΠΟΚΛΕΙΣΜΕΝΟ: Το email «${email}» βρίσκεται στη Μόνιμη Μαύρη Λίστα (Blacklist)!`);
        return;
      }

      targets = [{
        id: singleLeadTarget.id || null,
        email: email,
        first_name: singleLeadTarget.first_name || singleLeadTarget.company || "Συνεργάτη",
        company: singleLeadTarget.company || "",
        unsubscribe_token: singleLeadTarget.unsubscribe_token || crypto.randomUUID()
      }];
    } else {
      const uncontactedFiltered = filteredLeads.filter(l => !l.unsubscribed && !l.converted && !isEmailBlacklisted(l.email) && (l.email_sequence_step || 0) === 0);
      const rawTargets = selectedLeads.length > 0 
        ? leads.filter(l => selectedLeads.includes(l.id)) 
        : uncontactedFiltered;

      targets = rawTargets.filter(l => !l.unsubscribed && l.marketing_consent !== false && !isEmailBlacklisted(l.email));

      // Warn if sending to converted customers (ΠΕΛΑΤΕΣ)
      const convertedTargets = targets.filter(l => l.converted);
      if (convertedTargets.length > 0) {
        const confirmSend = window.confirm(
          `⚠️ ${convertedTargets.length} από τους παραλήπτες είναι ήδη ΠΕΛΑΤΕΣ 🎉:\n\n` +
          convertedTargets.map(l => `• ${l.email} (${l.first_name || l.company || ''})`).join('\n') +
          `\n\nΘέλετε να τους στείλετε email; (Η κατάσταση "ΠΕΛΑΤΗΣ" θα ΔΙΑΤΗΡΗΘΕΙ)`
        );
        if (!confirmSend) {
          setIsSending(false);
          return;
        }
      }

      if (rawTargets.length > targets.length) {
        toast.info(`Εξαιρέθηκαν ${rawTargets.length - targets.length} παραλήπτες (απεγγραφές / μαύρη λίστα).`);
      }
    }

    if (targets.length === 0 || !campaignSubject || !campaignBody) {
      toast.error("Δεν βρέθηκαν έγκυροι παραλήπτες (ή συμπληρώστε Θέμα και Περιεχόμενο)");
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

        const response = await fetch("/api/admin/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: lead.email,
            leadId: lead.id,
            unsubscribe_token: unsubscribeToken,
            customSubject: campaignSubject,
            customHtml: finalBody,
            firstEmailSubject: campaignSubject,
            firstEmailBody: campaignBody,
            step: 1,
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${response.status}`);
        }

        const sentTime = new Date().toISOString();
        setLeads(prev => prev.map(item => (item.id === lead.id || item.email.toLowerCase() === lead.email.toLowerCase())
          ? { ...item, email_sequence_step: 1, last_email_sent_at: sentTime }
          : item
        ));
        successCount++;
      } catch (error: any) {
        console.error("Error sending to:", lead.email, error);
        toast.error(`Αποτυχία αποστολής στο ${lead.email}: ${error.message || "Σφάλμα"}`);
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
      const existingSet = new Set<string>();
      let fromIdx = 0;
      const chunkSize = 1000;
      let moreToFetch = true;

      while (moreToFetch) {
        const { data: chunk, error: fetchError } = await supabase
          .from("sgk_mails")
          .select("email")
          .range(fromIdx, fromIdx + chunkSize - 1);

        if (fetchError) throw fetchError;

        if (chunk && chunk.length > 0) {
          for (const l of chunk) {
            if (l.email) existingSet.add(l.email.toLowerCase().trim());
          }
          if (chunk.length < chunkSize) moreToFetch = false;
          else fromIdx += chunkSize;
        } else {
          moreToFetch = false;
        }
      }
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

  const handleScanGemiIkes = async () => {
    const monthLabel =
      scanMonth === "current" ? `📅 ${currentMonthName} ${now.getFullYear()}` :
      scanMonth === "previous" ? `📅 ${prevMonthName} ${prevDate.getFullYear()}` : `📅 Όλο το ${now.getFullYear()}`;

    setIsScanModalOpen(true);
    setIsScanningGemi(true);
    setScannedNewLeads([]);
    setScanStatusMessage(`⚡ Έναρξη live σάρωσης στο Γ.Ε.ΜΗ. για Νέες Ι.Κ.Ε. (${monthLabel})...`);
    setScanStats({
      totalExamined: 0,
      added: 0,
      totalDuplicates: 0,
      totalHasWebsite: 0,
      totalCustomDomain: 0,
      totalNoEmail: 0,
      totalOldDate: 0,
    });
    setScanLogs([
      {
        id: "init",
        time: new Date().toLocaleTimeString("el-GR"),
        type: "init",
        message: `🚀 Εκκίνηση ασφαλούς σύνδεσης με OpenData API Γ.Ε.ΜΗ. για Νέες Ι.Κ.Ε. (${monthLabel})...`
      }
    ]);

    try {
      const res = await fetch("/api/admin/scan-gemi-ikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          stream: true, 
          limit: 50, 
          targetCategory: "all",
          targetLegalForm: "ike",
          month: scanMonth,
        }),
      });

      if (!res.ok) {
        throw new Error(`Σφάλμα σύνδεσης με τον διακομιστή (${res.status})`);
      }

      if (!res.body) {
        throw new Error("ReadableStream is not supported");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const trimmed = part.trim();
          if (!trimmed.startsWith("data:")) continue;
          const jsonStr = trimmed.replace(/^data:\s*/, "");
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);
            const timeStr = new Date().toLocaleTimeString("el-GR");

            if (event.message) {
              setScanStatusMessage(event.message);
            }

            if (event.stats) {
              setScanStats(prev => ({
                ...prev,
                ...event.stats,
              }));
            }

            if (event.type === "log") {
              setScanLogs(prev => [
                ...prev,
                {
                  id: String(Date.now() + Math.random()),
                  time: timeStr,
                  type: "log",
                  category: event.category,
                  company: event.company,
                  email: event.email,
                  afm: event.afm,
                  date: event.date,
                  url: event.url,
                  phone: event.phone,
                  reason: event.reason,
                }
              ]);
            } else if (event.type === "page" || event.type === "info" || event.type === "warning") {
              setScanLogs(prev => [
                ...prev,
                {
                  id: String(Date.now() + Math.random()),
                  time: timeStr,
                  type: event.type,
                  message: event.message,
                }
              ]);
            } else if (event.type === "done") {
              if (event.count !== undefined) {
                setScanStats(prev => ({
                  ...prev,
                  added: event.count,
                  totalExamined: event.totalExamined || prev.totalExamined,
                  totalDuplicates: event.totalDuplicates || prev.totalDuplicates,
                  totalHasWebsite: event.totalHasWebsite || prev.totalHasWebsite,
                  totalCustomDomain: event.totalCustomDomain || prev.totalCustomDomain,
                  totalNoEmail: event.totalNoEmail || prev.totalNoEmail,
                  totalOldDate: event.totalOldDate || prev.totalOldDate,
                }));
              }
              if (event.leads && Array.isArray(event.leads)) {
                setScannedNewLeads(event.leads);
              }
              setScanLogs(prev => [
                ...prev,
                {
                  id: "done",
                  time: timeStr,
                  type: "done",
                  message: event.message || `🎉 Η σάρωση ολοκληρώθηκε! Προστέθηκαν ${event.count || 0} νέα leads.`
                }
              ]);
              if (event.count > 0) {
                toast.success(`🎉 Προστέθηκαν ${event.count} νέες Ι.Κ.Ε. στη λίστα!`);
              } else {
                toast.info(`Η σάρωση ολοκληρώθηκε. Όλες οι Ι.Κ.Ε. υπάρχουν ήδη στη βάση.`);
              }
              await fetchLeads();
            } else if (event.type === "error") {
              setScanLogs(prev => [
                ...prev,
                {
                  id: "error",
                  time: timeStr,
                  type: "error",
                  message: `❌ Σφάλμα: ${event.error}`
                }
              ]);
              toast.error(`Σφάλμα σάρωσης: ${event.error}`);
            }
          } catch (jsonErr) {
            console.error("Error parsing stream chunk:", jsonErr);
          }
        }
      }

    } catch (err: any) {
      console.error("GEMI Scan Error:", err);
      toast.error(`Σφάλμα κατά τη σάρωση: ${err.message || "Άγνωστο σφάλμα"}`);
      setScanLogs(prev => [
        ...prev,
        {
          id: "catch-error",
          time: new Date().toLocaleTimeString("el-GR"),
          type: "error",
          message: `❌ Σφάλμα δικτύου/διακομιστή: ${err.message || "Άγνωστο σφάλμα"}`
        }
      ]);
    } finally {
      setIsScanningGemi(false);
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const emailMatch = (lead.email || "").toLowerCase().includes(query);
        const firstNameMatch = (lead.first_name || "").toLowerCase().includes(query);
        const lastNameMatch = (lead.last_name || "").toLowerCase().includes(query);
        const companyMatch = (lead.company || "").toLowerCase().includes(query);
        const phoneMatch = (lead.phone || "").toLowerCase().includes(query);
        const afmMatch = (lead.afm || "").toLowerCase().includes(query);
        const fullNameMatch = `${lead.first_name || ""} ${lead.last_name || ""}`.toLowerCase().includes(query);
        if (!(emailMatch || firstNameMatch || lastNameMatch || companyMatch || phoneMatch || afmMatch || fullNameMatch)) return false;
      }

      if (statusFilter === 'tourism') {
        return lead.type === 'tourism';
      }
      if (statusFilter === 'operations_tech') {
        return lead.type === 'operations_tech';
      }
      if (statusFilter === 'new_ike') {
        return lead.type === 'new_ike' || (!lead.type && lead.created_at >= '2026-08-01');
      }
      if (statusFilter === 'legacy') {
        return lead.type === 'legacy_ike';
      }
      if (statusFilter === 'converted') {
        if (!lead.converted) return false;
        if (professionSubFilter !== 'all') {
          return getLeadProfession(lead).key === professionSubFilter;
        }
        return true;
      }
      if (statusFilter === 'new') {
        return !lead.unsubscribed && !lead.converted && ((lead.email_sequence_step || 0) === 0) && !lead.last_email_sent_at;
      }
      if (statusFilter === 'completed') {
        return !lead.unsubscribed && !lead.converted && ((lead.email_sequence_step || 0) >= 5);
      }
      if (statusFilter === 'active') {
        return !lead.unsubscribed && !lead.converted && (((lead.email_sequence_step || 0) >= 1) || Boolean(lead.last_email_sent_at));
      }
      if (statusFilter === 'unsubscribed') {
        return lead.unsubscribed;
      }

      return true;
    });
  }, [leads, searchTerm, statusFilter, professionSubFilter]);

  const uncontactedFilteredLeads = filteredLeads.filter(l => !l.unsubscribed && !l.converted && !isEmailBlacklisted(l.email) && (l.email_sequence_step || 0) === 0 && !l.last_email_sent_at);
  const selectableFilteredLeads = filteredLeads.filter(l => !l.unsubscribed && !isEmailBlacklisted(l.email));
  const tourismCount = leads.filter(l => l.type === 'tourism').length;
  const opsTechCount = leads.filter(l => l.type === 'operations_tech').length;
  const newIkeCount = leads.filter(l => l.type === 'new_ike' || (!l.type && lead.created_at >= '2026-08-01')).length;
  const legacyCount = leads.filter(l => l.type === 'legacy_ike').length;
  const newCount = leads.filter(l => !l.unsubscribed && !l.converted && ((l.email_sequence_step || 0) === 0) && !l.last_email_sent_at).length;
  const activeCount = leads.filter(l => !l.unsubscribed && !l.converted && (((l.email_sequence_step || 0) >= 1) || Boolean(l.last_email_sent_at))).length;
  const completedCount = leads.filter(l => !l.unsubscribed && !l.converted && ((l.email_sequence_step || 0) >= 5)).length;
  const convertedCount = leads.filter(l => l.converted).length;
  const convertedLeads = useMemo(() => leads.filter(l => l.converted), [leads]);
  const convertedProfessionsSummary = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const lead of convertedLeads) {
      const prof = getLeadProfession(lead);
      counts[prof.key] = (counts[prof.key] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([key, count]) => ({
        key,
        prof: CLIENT_PROFESSIONS[key] || CLIENT_PROFESSIONS.general_co,
        count
      }))
      .sort((a, b) => b.count - a.count);
  }, [convertedLeads]);
  const unsubscribedCount = leads.filter(l => l.unsubscribed).length;

  const now = useMemo(() => new Date(), []);
  const greekMonths = useMemo(() => [
    "Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος",
    "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"
  ], []);
  const currentMonthName = greekMonths[now.getMonth()];
  const prevDate = useMemo(() => new Date(now.getFullYear(), now.getMonth() - 1, 1), [now]);
  const prevMonthName = greekMonths[prevDate.getMonth()];

  const previewEmailDoc = useMemo(() => {
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
  }, [campaignBody, singleLeadTarget, leads, selectedLeads, campaignSubject, buttonText, buttonLink]);

  // Define full-screen campaign modal component
  const campaignModal = isCampaignModalOpen ? (
    <div className="fixed inset-0 bg-white z-[99999] flex flex-col h-screen w-screen overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center text-white shrink-0">
        <h3 className="font-black text-sm uppercase tracking-wider italic flex items-center gap-2">
          <Mail className="text-[#3b5bdb]" size={18} />
          {singleLeadTarget 
            ? (singleLeadTarget.email ? `Αποστολη Email στο ${singleLeadTarget.email}` : `Αποστολη Email σε Πελατη (${singleLeadTarget.company || singleLeadTarget.first_name || "Νέο Έγγραφο"})`) 
            : `Μαζικη Αποστολη (${selectedLeads.length > 0 ? selectedLeads.length : uncontactedFilteredLeads.length} παραληπτες)`}
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
              
              {/* Recipient Selection Section */}
              <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                    <User size={13} className="text-[#3b5bdb]" />
                    Παραληπτης Email
                  </span>
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        if (!singleLeadTarget) {
                          setSingleLeadTarget({ email: "", first_name: "", company: "" });
                        }
                      }}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                        singleLeadTarget 
                          ? "bg-[#3b5bdb] text-white shadow-sm" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Μεμονωμένος
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSingleLeadTarget(null);
                      }}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                        !singleLeadTarget 
                          ? "bg-[#3b5bdb] text-white shadow-sm" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Μαζική ({selectedLeads.length > 0 ? selectedLeads.length : uncontactedFilteredLeads.length})
                    </button>
                  </div>
                </div>

                {singleLeadTarget ? (
                  <div className="space-y-2 pt-1">
                    {/* Quick Lead Picker from existing DB */}
                    <div>
                      <select
                        value={singleLeadTarget.id || ""}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          if (!selectedId) return;
                          const lead = leads.find(l => l.id === selectedId);
                          if (lead) {
                            setSingleLeadTarget({
                              id: lead.id,
                              email: lead.email,
                              first_name: lead.first_name || lead.company || "",
                              company: lead.company || "",
                              unsubscribe_token: lead.unsubscribe_token
                            });
                          }
                        }}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-750 text-slate-200 text-xs font-bold rounded-lg focus:border-[#3b5bdb] outline-none cursor-pointer"
                      >
                        <option value="">🔍 Επιλογή από αποθηκευμένους πελάτες ({leads.length})...</option>
                        {leads.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.company ? `${l.company} (${l.email})` : l.first_name ? `${l.first_name} (${l.email})` : l.email}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Email Address Input */}
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Email Παραλήπτη <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="email"
                          value={singleLeadTarget.email || ""}
                          onChange={(e) => setSingleLeadTarget({ ...singleLeadTarget, email: e.target.value })}
                          placeholder="π.χ. info@client.gr"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-slate-100 text-xs font-bold rounded-lg focus:border-[#3b5bdb] outline-none"
                          required
                        />
                      </div>

                      {/* Name / Company Input */}
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Όνομα / Επωνυμία
                        </label>
                        <input
                          type="text"
                          value={singleLeadTarget.first_name || singleLeadTarget.company || ""}
                          onChange={(e) => setSingleLeadTarget({ ...singleLeadTarget, first_name: e.target.value, company: e.target.value })}
                          placeholder="π.χ. THINK LOCALIZATION I.K.E."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-slate-100 text-xs font-bold rounded-lg focus:border-[#3b5bdb] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>
                      📨 Αποστολή σε <strong className="text-white">{selectedLeads.length > 0 ? selectedLeads.length : uncontactedFilteredLeads.length} παραλήπτες</strong> από τη λίστα
                    </span>
                    <span className="text-[9px] text-[#3b5bdb] font-bold uppercase">Μαζικη Καμπανια</span>
                  </div>
                )}
              </div>

              {/* Quick Document Insertion Toolbar */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#3b5bdb]" />
                    Εισαγωγη Επισήμου Εγγραφου
                  </span>
                  <span className="text-[9px] text-[#4ade80] font-bold">1-Click Auto-Fill</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Saved Contract Selector */}
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        const cid = e.target.value;
                        if (!cid) return;
                        const found = savedContracts.find(c => c.id === cid);
                        if (found) {
                          handleInsertContract(found);
                        } else if (cid === "current_lead" && singleLeadTarget) {
                          const comp = singleLeadTarget.company || "";
                          const name = singleLeadTarget.first_name || "";
                          handleInsertContract({
                            companyName: comp,
                            tradeName: comp.replace(/ (ΜΟΝΟΠΡΟΣΩΠΗ|Ι\.Κ\.Ε\.|Ι K E|IKE)/gi, "").trim() || comp,
                            representativeName: name,
                            totalAmountText: "εκατόν πενήντα ευρώ (150,00 €)",
                            deliveryDaysText: "πέντε (5)",
                            renewalAmountText: "εκατόν πενήντα ευρώ (150,00 €)",
                            ibanDetails: "GR4602601970000830201330337 (Eurobank), δικαιούχος Σπυρίδων Τσάβος",
                            includeSignature: true
                          });
                        }
                        e.target.value = "";
                      }}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-750 text-slate-200 text-xs font-bold rounded-lg focus:border-[#3b5bdb] outline-none cursor-pointer"
                    >
                      <option value="">📜 Εισαγωγή Συμφωνητικού...</option>
                      {singleLeadTarget && (
                        <option value="current_lead">✨ Συμφωνητικό για {singleLeadTarget.first_name || singleLeadTarget.company || singleLeadTarget.email}</option>
                      )}
                      {savedContracts.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.tradeName || c.companyName || "Συμφωνητικό"} ({c.totalAmountNum || 150}€)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Invoice Template Button */}
                  <button
                    type="button"
                    onClick={handleInsertInvoice}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-750 text-slate-200 hover:text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Calculator size={13} className="text-amber-400" />
                    <span>🧾 Εισαγωγή Τιμολογίου & Προσφοράς</span>
                  </button>
                </div>
              </div>

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
                  placeholder="π.χ. Συγχαρητήρια για τη νέα σας Ι.Κ.Ε. | Εταιρική ιστοσελίδα σε 24 ώρες"
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

              {/* PDF Invoice Upload UI */}
              <div className="space-y-1.5 p-4 rounded-xl border border-slate-800 bg-slate-950/40">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Επισύναψη Τιμολογίου (PDF)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden" 
                    id="pdf-upload-input"
                    disabled={uploadingPdf}
                  />
                  <label 
                    htmlFor="pdf-upload-input"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-850 text-slate-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer hover:border-slate-800 transition-all select-none"
                  >
                    {uploadingPdf ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-[#3b5bdb]" />
                        Γίνεται ανέβασμα...
                      </>
                    ) : pdfUrl ? (
                      <>
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        Το PDF ανέβηκε επιτυχώς
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        Επιλέξτε αρχείο PDF
                      </>
                    )}
                  </label>
                  {pdfUrl && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setPdfUrl("");
                        setButtonText("");
                        setButtonLink("");
                      }}
                      className="text-xs text-rose-500 hover:text-rose-400 font-bold transition-colors cursor-pointer"
                    >
                      Κατάργηση αρχείου
                    </button>
                  )}
                </div>
                <p className="text-[9px] text-slate-500 leading-normal">
                  💡 Ανεβάζοντας το PDF, θα δημιουργηθεί αυτόματα ένα κουμπί <strong>«Λήψη Τιμολογίου (PDF)»</strong> στο email σας, το οποίο θα οδηγεί απευθείας στο αρχείο για κατέβασμα.
                </p>
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
                💡 Στο κάτω μέρος του email θα προστεθεί αυτόματα το responsive layout της <strong>SGK Digital</strong> με τα εταιρικά στοιχεία και η υπογραφή μας.
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
                  srcDoc={previewEmailDoc}
                  className="w-full h-full border-0"
                  title="Email Preview"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
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
  ) : null;

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <RefreshCcw className="animate-spin text-[#3b5bdb]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Όλα τα Emails */}
        <div 
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer transition-all border ${
            statusFilter === 'all' 
              ? 'bg-white border-[#3b5bdb] ring-2 ring-[#3b5bdb]/20' 
              : 'bg-white/60 backdrop-blur-xl border-gray-200/60 hover:border-gray-300'
          }`}
        >
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Συνολικα Email</p>
            <p className="text-xl font-black text-slate-900 mt-1">{leads.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#3b5bdb]/10 text-[#3b5bdb] flex items-center justify-center font-bold">
            <Mail size={18} />
          </div>
        </div>

        {/* Card 2: Εκκρεμούν / Χωρίς Email */}
        <div 
          onClick={() => setStatusFilter('new')}
          className={`p-4 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer transition-all border ${
            statusFilter === 'new' 
              ? 'bg-white border-amber-500 ring-2 ring-amber-500/20' 
              : 'bg-white/60 backdrop-blur-xl border-amber-200/60 hover:border-amber-300'
          }`}
        >
          <div>
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Χωρις Email (0/5)</p>
            <p className="text-xl font-black text-amber-700 mt-1">{newCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Users size={18} />
          </div>
        </div>

        {/* Card 3: Εστάλη Email (1-5) */}
        <div 
          onClick={() => setStatusFilter('active')}
          className={`p-4 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer transition-all border ${
            statusFilter === 'active' 
              ? 'bg-white border-blue-500 ring-2 ring-blue-500/20' 
              : 'bg-white/60 backdrop-blur-xl border-blue-200/60 hover:border-blue-300'
          }`}
        >
          <div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Εσταλη Email (1-5)</p>
            <p className="text-xl font-black text-blue-700 mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Send size={18} />
          </div>
        </div>

        {/* Card 4: Πελάτες (με ανάλυση κλάδων & επαγγελμάτων) */}
        <div 
          onClick={() => {
            setStatusFilter('converted');
            setProfessionSubFilter('all');
          }}
          className={`p-4 rounded-2xl flex flex-col justify-between shadow-sm cursor-pointer transition-all border ${
            statusFilter === 'converted' 
              ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' 
              : 'bg-white/60 backdrop-blur-xl border-emerald-200/60 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                <span>Πελατες</span>
                <span>🎉</span>
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-black text-emerald-700">{convertedCount}</span>
                <span className="text-[10px] font-bold text-emerald-600/70">
                  {convertedCount === 1 ? 'ενεργός' : 'ενεργοί'}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 size={18} />
            </div>
          </div>

          {/* Breakdown Pills: Τι είναι οι πελάτες (Λογιστής, Τουριστικό, Real Estate κλπ.) */}
          {convertedProfessionsSummary.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-emerald-100/80 flex flex-wrap gap-1">
              {convertedProfessionsSummary.map(({ prof, count, key }) => (
                <button
                  key={key}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatusFilter('converted');
                    setProfessionSubFilter(professionSubFilter === key ? 'all' : key);
                  }}
                  className={`inline-flex items-center gap-1 text-[9.5px] font-bold px-1.5 py-0.5 rounded transition-all cursor-pointer border ${
                    statusFilter === 'converted' && professionSubFilter === key
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-emerald-50/90 text-emerald-900 border-emerald-200/80 hover:bg-emerald-100'
                  }`}
                  title={`${count} ${prof.label} (Κάντε κλικ για φιλτράρισμα)`}
                >
                  <span>{prof.icon}</span>
                  <span>{prof.shortLabel}:</span>
                  <span className="font-black text-emerald-950">{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leads Header / Actions */}
      <div className="bg-white/40 backdrop-blur-xl border border-gray-200/50 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-gray-900 italic tracking-wide uppercase flex items-center gap-2">
              <Mail className="text-[#3b5bdb]" />
              Λιστα Παραληπτων Email ({filteredLeads.length})
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider italic">
              Διαχειριστείτε τη λίστα email και στείλτε καμπάνιες με Live Preview
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <EmailTimingIndicator />
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
              Μαζικη Αποστολη {selectedLeads.length > 0 ? `(${selectedLeads.length})` : `(${uncontactedFilteredLeads.length})`}
            </button>
            {selectedLeads.length > 0 && (
              <>
                <button
                  onClick={() => setSelectedLeads([])}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all text-xs font-bold cursor-pointer"
                  title="Αποεπιλογή όλων"
                >
                  <X size={12} />
                  Αποεπιλογή ({selectedLeads.length})
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
              onClick={handleOpenCreateLead}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all text-xs font-black uppercase tracking-wider shadow-md cursor-pointer"
            >
              <UserPlus size={14} />
              + Νεος Πελατης
            </button>
            {/* Quick Sync Converted Clients from GEMI */}
            <button
              onClick={handleSyncAllConvertedFromGemi}
              disabled={isSyncingGemi}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl transition-all text-xs font-black uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50"
              title="Αυτόματος έλεγχος και ενημέρωση όλων των πελατών απευθείας από το Γ.Ε.ΜΗ."
            >
              {isSyncingGemi ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} className="text-amber-300" />}
              <span>Ελεγχος Πελατων στο ΓΕΜΗ</span>
            </button>

            {/* Targeted GEMI Scanner Dual Selectors & Trigger */}
            <div className="inline-flex items-center flex-wrap bg-slate-900 border border-slate-700/80 rounded-xl p-1 shadow-md gap-1">
              <div className="flex items-center gap-1 pl-2 text-[10px] font-black uppercase tracking-wider text-slate-300">
                <Target size={12} className="text-yellow-400" />
                <span className="hidden sm:inline">Μήνας:</span>
              </div>

              {/* Dynamic Month Selector */}
              <select
                value={scanMonth}
                onChange={(e) => setScanMonth(e.target.value as any)}
                disabled={isScanningGemi}
                className="bg-slate-800 text-amber-300 text-xs font-bold px-2 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400 cursor-pointer"
                title="Επιλογή Μήνα Ίδρυσης"
              >
                <option value="current">📅 {currentMonthName} {now.getFullYear()} (Τρέχων)</option>
                <option value="previous">📅 {prevMonthName} {prevDate.getFullYear()}</option>
                <option value="all_year">📅 Όλο το {now.getFullYear()}</option>
              </select>

              <button
                onClick={handleScanGemiIkes}
                disabled={isScanningGemi}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg transition-all text-xs font-black uppercase tracking-wider shadow cursor-pointer disabled:opacity-50"
                title="Live σάρωση στο Γ.Ε.ΜΗ. για νέες Ι.Κ.Ε."
              >
                {isScanningGemi ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} className="text-yellow-300" />}
                <span>Ευρεση Νεων ΙΚΕ</span>
              </button>
            </div>
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
              onClick={handleRemoveDuplicates}
              disabled={cleaningDuplicates}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all text-xs font-black uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50"
            >
              {cleaningDuplicates ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
              🧹 Διαγραφη Διπλοτυπων
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

        {/* Search Bar & Status Filter Badges */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Αναζήτηση email, ονόματος, εταιρείας, τηλεφώνου..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3b5bdb] focus:ring-1 focus:ring-[#3b5bdb]/20 transition-all placeholder:text-slate-400 shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Καθαρισμός αναζήτησης"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <span>🌐 Όλα ({leads.length})</span>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'new_ike' ? 'all' : 'new_ike')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                statusFilter === 'new_ike'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                  : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
              }`}
            >
              <span>🏢 Νέες ΙΚΕ</span>
              <span className="text-[10px] px-1 rounded-full bg-white/40">{newIkeCount}</span>
            </button>
          </div>

          {/* Active Filter Indicator */}
          {statusFilter !== 'all' && (
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
              <span className="text-slate-500">Φίλτρο:</span>
              {statusFilter === 'tourism' && <span className="text-amber-700 font-black">✈️ Τουρισμός / Travel</span>}
              {statusFilter === 'operations_tech' && <span className="text-purple-700 font-black">⚡ Operations & Τεχνικές</span>}
              {statusFilter === 'new_ike' && <span className="text-emerald-600 font-black">🟢 Νέες ΙΚΕ (Αύγουστος 2026+)</span>}
              {statusFilter === 'legacy' && <span className="text-blue-600 font-black">🏢 Παλαιές ΙΚΕ</span>}
              {statusFilter === 'new' && <span className="text-blue-600 font-black">➕ Νέοι (0/5)</span>}
              {statusFilter === 'active' && <span className="text-teal-600 font-black">⚡ Ενεργοί (1-4/5)</span>}
              {statusFilter === 'completed' && <span className="text-amber-600 font-black">✅ Ολοκληρωμένοι (5/5)</span>}
              {statusFilter === 'converted' && <span className="text-purple-600 font-black">💜 Πελάτες (Converted)</span>}
              {statusFilter === 'unsubscribed' && <span className="text-rose-600 font-black">🔴 Απεγγραφές (Unsubscribed)</span>}
              <button
                onClick={() => setStatusFilter('all')}
                className="ml-1 text-slate-400 hover:text-slate-700 bg-slate-100 p-1 rounded-md cursor-pointer"
                title="Καθαρισμός φίλτρου"
              >
                <X size={12} />
              </button>
            </div>
          )}
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
                      title="Επιλογή όλων των εγγραφών στη λίστα"
                      checked={selectableFilteredLeads.length > 0 && selectableFilteredLeads.every(l => selectedLeads.includes(l.id))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeads(selectableFilteredLeads.map(l => l.id));
                        } else {
                          setSelectedLeads([]);
                        }
                      }}
                      className="rounded border-gray-300 text-[#3b5bdb] focus:ring-[#3b5bdb] h-4 w-4 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Email / Όνομα / Τηλέφωνο</th>
                  <th className="py-3 px-4">Ημ/νία Εγγραφής</th>
                  <th className="py-3 px-4 text-center">Κατάσταση</th>
                  <th className="py-3 px-4 text-center">Ενέργειες</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-semibold text-slate-700">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-normal">
                      {searchTerm ? (
                        <div>
                          <p className="font-bold text-slate-600 text-sm">Δεν βρέθηκαν αποτελέσματα</p>
                          <p className="text-xs mt-1 text-slate-400">Δεν βρέθηκε κανένα email που να περιέχει "{searchTerm}"</p>
                        </div>
                      ) : (
                        "Δεν υπάρχουν εγγραφές στη λίστα"
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const isBlacklisted = isEmailBlacklisted(lead.email) || lead.unsubscribed || lead.marketing_consent === false;
                    return (
                      <tr key={lead.id} className={`transition-colors ${isBlacklisted ? 'bg-rose-50/20 opacity-90' : 'hover:bg-slate-50/50'}`}>
                        <td className="py-3 px-4 text-center">
                          {!isBlacklisted ? (
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
                              title="Αποκλεισμένο (Blacklist / Unsubscribed)"
                              className="rounded border-gray-200 bg-gray-100 h-4 w-4 cursor-not-allowed opacity-40"
                            />
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900 flex items-center gap-1.5">
                            <span>{lead.email}</span>
                            {isEmailBlacklisted(lead.email) && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-slate-900 text-rose-400 border border-rose-500/40">
                                Blacklist
                              </span>
                            )}
                          </div>

                          {/* Company / Brand Name & Profession Badge */}
                          {(lead.company || lead.first_name) && (
                            <div className="text-xs font-bold text-[#0f2d59] flex items-center gap-2 mt-1 flex-wrap">
                              <Building2 size={13} className="text-slate-400 shrink-0" />
                              <span className="font-extrabold text-slate-900">
                                {lead.company || lead.first_name}
                              </span>

                              {/* Single, Beautiful Interactive Profession Badge */}
                              {(() => {
                                const prof = getLeadProfession(lead);
                                return (
                                  <div className="relative inline-flex items-center">
                                    <select
                                      value={lead.type && CLIENT_PROFESSIONS[lead.type] ? lead.type : prof.key}
                                      onChange={(e) => handleUpdateLeadType(lead.id, e.target.value)}
                                      className={`text-[10px] font-black px-2 py-0.5 pr-5 rounded-md border appearance-none cursor-pointer transition-all shadow-2xs ${prof.badgeBg} ${prof.text} ${prof.border} hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                                      title="Κάντε κλικ για να αλλάξετε τον κλάδο"
                                    >
                                      {Object.entries(CLIENT_PROFESSIONS).map(([k, p]) => (
                                        <option key={k} value={k} className="bg-white text-slate-800 font-bold">
                                          {p.icon} {p.label}
                                        </option>
                                      ))}
                                    </select>
                                    <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[8px] text-slate-500">
                                      ▼
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>
                          )}

                          {/* Representative Name (Only if different from company name and not legal form) */}
                          {lead.first_name && lead.company && lead.first_name !== lead.company && !lead.first_name.includes("Ι.Κ.Ε.") && !lead.first_name.includes("IKE") && !lead.first_name.includes("Ε.Π.Ε.") && (
                            <div className="text-[10.5px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                              <User size={10} className="text-slate-400" />
                              <span>{lead.first_name} {lead.last_name || ""}</span>
                            </div>
                          )}

                          {/* Phone & AFM */}
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            {lead.phone && (
                              <a 
                                href={`tel:${lead.phone}`}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3b5bdb] hover:underline bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100"
                                title="Κλήση στο τηλέφωνο"
                              >
                                <Phone size={10} />
                                {lead.phone}
                              </a>
                            )}
                            {lead.afm && (
                              <div className="inline-flex items-center gap-1">
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                  ΑΦΜ: {lead.afm}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleSyncLeadFromGemi(lead)}
                                  className="inline-flex items-center gap-1 text-[9.5px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-1.5 py-0.5 rounded transition-all cursor-pointer shadow-2xs"
                                  title="Αυτόματη ανάκτηση επίσημης επωνυμίας & κλάδου από το Γ.Ε.ΜΗ."
                                >
                                  <Sparkles size={9} className="text-indigo-500" />
                                  <span>ΓΕΜΗ</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-xs">
                          <div>{new Date(lead.created_at).toLocaleDateString("el-GR")}</div>
                          {lead.last_email_sent_at && (
                            <div className="text-[10px] text-blue-600 font-bold mt-1 flex items-center gap-1" title="Ημερομηνία & ώρα τελευταίας αποστολής">
                              <Mail size={10} className="shrink-0" />
                              <span>{new Date(lead.last_email_sent_at).toLocaleDateString("el-GR", { day: "2-digit", month: "2-digit" })} {new Date(lead.last_email_sent_at).toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isEmailBlacklisted(lead.email) ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-900 text-rose-400 border border-rose-500/40 shadow-sm" title="Μόνιμα Αποκλεισμένο Email (Blacklist)">
                              <Ban size={10} /> ⛔ Blacklist
                            </span>
                          ) : lead.unsubscribed ? (
                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-700 border border-red-200">
                              🔴 Unsubscribed
                            </span>
                          ) : lead.converted ? (
                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
                              🎉 Πελάτης
                            </span>
                          ) : ((lead.email_sequence_step || 0) > 0 || lead.last_email_sent_at) ? (
                            <div className="inline-flex flex-col items-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
                                <Check size={11} className="text-blue-600 stroke-[3]" />
                                Εστάλη Email
                              </span>
                            </div>
                          ) : (
                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-200">
                              ⚪ Εκκρεμεί
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleToggleConverted(lead.id, lead.converted || false, lead.email)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all text-xs font-bold uppercase cursor-pointer border ${
                                lead.converted
                                  ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 shadow-sm"
                                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                              }`}
                              title={lead.converted ? "Σημειώθηκε ως Πελάτης (Πατήστε για επαναφορά σε Lead)" : "Σημειώστε ως Πελάτη για να διακοπούν τα αυτόματα AI emails"}
                            >
                              <CheckCircle2 size={12} />
                              {lead.converted ? "Πελάτης 🎉" : "Έγινε Πελάτης"}
                            </button>
                            {!isBlacklisted && (
                              <button
                                onClick={() => {
                                  setSingleLeadTarget(lead);
                                  setCampaignSubject(templates[0].subject);
                                  setCampaignBody(templates[0].body);
                                  setButtonText(templates[0].defaultButtonText || "");
                                  setButtonLink(templates[0].defaultButtonLink || "");
                                  setIsCampaignModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#3b5bdb]/10 text-[#3b5bdb] hover:bg-[#3b5bdb] hover:text-white rounded-xl transition-all text-xs font-bold uppercase cursor-pointer"
                                title="Αποστολή Προσαρμοσμένου Email"
                              >
                                <Mail size={12} />
                                Email
                              </button>
                            )}
                            {!isBlacklisted && (
                              <button
                                onClick={() => handleBlacklistEmail(lead.id, lead.email)}
                                className="inline-flex items-center gap-1 px-2 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 rounded-xl transition-all text-xs font-bold uppercase cursor-pointer"
                                title="Προσθήκη στη Μόνιμη Μαύρη Λίστα (Blacklist)"
                              >
                                <Ban size={11} />
                                Blacklist
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenEditLead(lead)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-[#3b5bdb] hover:text-white border border-blue-200 rounded-xl transition-all text-xs font-bold uppercase cursor-pointer"
                              title="Επεξεργασία στοιχείων πελάτη (Όνομα, Email, Τηλέφωνο, Εταιρεία, ΑΦΜ)"
                            >
                              <Edit3 size={12} />
                              Επεξεργασια
                            </button>
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Campaign Email Modal - Ported to body level to fix z-index issues */}
      {isClient && typeof document !== "undefined" && createPortal(campaignModal, document.body)}

      {/* Edit / Create Lead Modal */}
      {isEditModalOpen && editingLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-100 animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-black text-sm uppercase tracking-wider italic flex items-center gap-2">
                {editingLead.id ? <Edit3 className="text-[#3b5bdb]" size={18} /> : <UserPlus className="text-emerald-400" size={18} />}
                {editingLead.id ? "Επεξεργασια Στοιχειων Πελατη" : "Προσθηκη Νεου Πελατη / Lead"}
              </h3>
              <button 
                onClick={() => {
                  if (isSavingLead) return;
                  setIsEditModalOpen(false);
                  setEditingLead(null);
                }}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveLead} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                    Email Πελάτη *
                  </label>
                  <input
                    type="email"
                    required
                    value={editingLead.email}
                    onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                    placeholder="π.χ. info@company.gr"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b5bdb] text-gray-900 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                    Τηλέφωνο Επικοινωνίας
                  </label>
                  <input
                    type="tel"
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    placeholder="π.χ. 6999524389 / 2111140013"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b5bdb] text-gray-900 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                    Κλάδος / Επάγγελμα Επιχείρησης (π.χ. Λογιστής, Τουριστικό κλπ.)
                  </label>
                  <select
                    value={editingLead.type || "new_ike"}
                    onChange={(e) => setEditingLead({ ...editingLead, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b5bdb] text-gray-900 text-xs font-bold bg-white cursor-pointer"
                  >
                    {Object.entries(CLIENT_PROFESSIONS).map(([k, p]) => (
                      <option key={k} value={k}>
                        {p.icon} {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                    Επωνυμία Εταιρείας / Brand
                  </label>
                  <input
                    type="text"
                    value={editingLead.company}
                    onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
                    placeholder="π.χ. Atrekia Pharma ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b5bdb] text-gray-900 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                    Όνομα / Εκπρόσωπος
                  </label>
                  <input
                    type="text"
                    value={editingLead.first_name}
                    onChange={(e) => setEditingLead({ ...editingLead, first_name: e.target.value })}
                    placeholder="π.χ. Δημήτριος"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b5bdb] text-gray-900 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                    Επώνυμο
                  </label>
                  <input
                    type="text"
                    value={editingLead.last_name}
                    onChange={(e) => setEditingLead({ ...editingLead, last_name: e.target.value })}
                    placeholder="π.χ. Λιακόπουλος"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b5bdb] text-gray-900 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                    Α.Φ.Μ.
                  </label>
                  <input
                    type="text"
                    value={editingLead.afm}
                    onChange={(e) => setEditingLead({ ...editingLead, afm: e.target.value })}
                    placeholder="π.χ. 803379105"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b5bdb] text-gray-900 text-xs font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                    Αριθμός Γ.Ε.ΜΗ.
                  </label>
                  <input
                    type="text"
                    value={editingLead.gemi_number}
                    onChange={(e) => setEditingLead({ ...editingLead, gemi_number: e.target.value })}
                    placeholder="π.χ. 195662501000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b5bdb] text-gray-900 text-xs font-bold font-mono"
                  />
                </div>

              </div>

              {/* Status checkboxes */}
              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingLead.converted}
                    onChange={(e) => setEditingLead({ ...editingLead, converted: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span className="text-xs font-black text-emerald-800">
                    🎉 Έγινε Πελάτης (Converted)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingLead.unsubscribed}
                    onChange={(e) => setEditingLead({ ...editingLead, unsubscribed: e.target.checked })}
                    className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 h-4 w-4"
                  />
                  <span className="text-xs font-bold text-rose-700">
                    Διεγράφη (Unsubscribed)
                  </span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 -mx-6 -mb-6 px-6 py-4 mt-6 border-t border-gray-150 flex justify-end gap-3 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingLead(null);
                  }}
                  className="px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Ακύρωση
                </button>
                <button
                  type="submit"
                  disabled={isSavingLead}
                  className="px-5 py-2 text-xs font-black uppercase tracking-wider text-white bg-[#3b5bdb] hover:bg-blue-700 rounded-xl shadow-md disabled:opacity-50 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {isSavingLead ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  Αποθηκευση Στοιχειων
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

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

      {/* Live GEMI IKE Scanner Modal */}
      {isScanModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-6">
          <div className="bg-slate-950 text-slate-100 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-800 overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-slate-900/90 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  {isScanningGemi ? (
                    <Loader2 size={20} className="animate-spin text-white" />
                  ) : (
                    <Sparkles size={20} className="text-yellow-300" />
                  )}
                </div>
                <div>
                  <h3 className="font-black text-white text-base tracking-wide uppercase flex items-center gap-2">
                    ⚡ Live Σαρωση Γ.Ε.ΜΗ. — Εύρεση Νέων Ι.Κ.Ε.
                    {isScanningGemi && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                        Live Scrape
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {scanMonth === "current"
                      ? `Ίδρυση τον τρέχοντα μήνα (${currentMonthName} ${now.getFullYear()})`
                      : scanMonth === "previous"
                      ? `Ίδρυση τον προηγούμενο μήνα (${prevMonthName} ${prevDate.getFullYear()})`
                      : `Ίδρυση εντός του ${now.getFullYear()}`}
                    {" • Μόνο Ι.Κ.Ε."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (isScanningGemi) {
                    if (window.confirm("Η σάρωση εκτελείται. Είστε σίγουροι ότι θέλετε να κλείσετε το παράθυρο;")) {
                      setIsScanModalOpen(false);
                    }
                  } else {
                    setIsScanModalOpen(false);
                  }
                }}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 transition-all cursor-pointer"
                title="Κλείσιμο"
              >
                <X size={20} />
              </button>
            </div>

            {/* Live KPI Badges Strip */}
            <div className="bg-slate-900/50 p-3.5 border-b border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
              {/* Examined */}
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-2xl">
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Εξεταστηκαν</p>
                <p className="text-lg font-black text-white mt-0.5">{scanStats.totalExamined}</p>
              </div>

              {/* Added */}
              <div className="bg-emerald-950/40 border border-emerald-800/60 p-2.5 rounded-2xl">
                <p className="text-[9px] font-black uppercase tracking-wider text-emerald-400">🟢 Προσθεθηκαν</p>
                <p className="text-lg font-black text-emerald-300 mt-0.5">{scanStats.added}</p>
              </div>

              {/* Custom Domain Skipped */}
              <div className="bg-indigo-950/40 border border-indigo-800/60 p-2.5 rounded-2xl" title="Εταιρείες με δικό τους domain email (@domain.gr)">
                <p className="text-[9px] font-black uppercase tracking-wider text-indigo-400">🏢 Εταιρικο Domain</p>
                <p className="text-lg font-black text-indigo-300 mt-0.5">{scanStats.totalCustomDomain || 0}</p>
              </div>

              {/* Duplicates */}
              <div className="bg-amber-950/40 border border-amber-800/60 p-2.5 rounded-2xl">
                <p className="text-[9px] font-black uppercase tracking-wider text-amber-400">🟡 Διπλοτυπα</p>
                <p className="text-lg font-black text-amber-300 mt-0.5">{scanStats.totalDuplicates}</p>
              </div>

              {/* Has Website */}
              <div className="bg-blue-950/40 border border-blue-800/60 p-2.5 rounded-2xl">
                <p className="text-[9px] font-black uppercase tracking-wider text-blue-400">🔵 Εχουν Site</p>
                <p className="text-lg font-black text-blue-300 mt-0.5">{scanStats.totalHasWebsite}</p>
              </div>

              {/* No Email */}
              <div className="bg-slate-800/50 border border-slate-700/60 p-2.5 rounded-2xl">
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">⚪ Χωρις Email</p>
                <p className="text-lg font-black text-slate-300 mt-0.5">{scanStats.totalNoEmail}</p>
              </div>

              {/* Old Date */}
              <div className="bg-purple-950/40 border border-purple-800/60 p-2.5 rounded-2xl">
                <p className="text-[9px] font-black uppercase tracking-wider text-purple-400">⏳ Παλια Ημ/νια</p>
                <p className="text-lg font-black text-purple-300 mt-0.5">{scanStats.totalOldDate}</p>
              </div>
            </div>

            {/* Live Terminal Log Stream */}
            <div className="p-4 flex-1 flex flex-col min-h-0 bg-slate-950">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Terminal size={14} className="text-indigo-400" />
                  <span>Real-time Scanner Log:</span>
                </div>
                <div className="text-[11px] font-mono text-indigo-400 truncate max-w-md">
                  {scanStatusMessage}
                </div>
              </div>

              <div 
                ref={scanTerminalRef}
                className="flex-1 min-h-[280px] max-h-[380px] bg-black/90 rounded-2xl p-4 overflow-y-auto font-mono text-xs border border-slate-800/80 space-y-2 shadow-inner"
              >
                {scanLogs.map((log) => {
                  if (log.type === "init" || log.type === "info" || log.type === "page") {
                    return (
                      <div key={log.id} className="text-cyan-400/90 text-[11px] flex items-start gap-2 py-0.5">
                        <span className="text-slate-500 shrink-0">[{log.time}]</span>
                        <span>{log.message}</span>
                      </div>
                    );
                  }

                  if (log.type === "warning") {
                    return (
                      <div key={log.id} className="text-amber-400/90 text-[11px] flex items-start gap-2 py-0.5">
                        <span className="text-slate-500 shrink-0">[{log.time}]</span>
                        <span>{log.message}</span>
                      </div>
                    );
                  }

                  if (log.type === "error") {
                    return (
                      <div key={log.id} className="text-rose-400 text-[11px] flex items-start gap-2 py-1 bg-rose-950/30 px-2 rounded border border-rose-900/50">
                        <span className="text-slate-500 shrink-0">[{log.time}]</span>
                        <span>{log.message}</span>
                      </div>
                    );
                  }

                  if (log.type === "done") {
                    return (
                      <div key={log.id} className="mt-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/80 text-emerald-300 text-xs flex items-center gap-2.5 font-bold shadow-lg shadow-emerald-950/50">
                        <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                        <div>{log.message}</div>
                      </div>
                    );
                  }

                  // Log items per company
                  if (log.category === "added") {
                    return (
                      <div key={log.id} className="flex items-start gap-2 text-[11px] py-1 px-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-200">
                        <span className="text-slate-500 shrink-0">[{log.time}]</span>
                        <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-black text-[9px] uppercase tracking-wider shrink-0 border border-emerald-500/30">
                          🟢 ΠΡΟΣΘΗΚΗ
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-white">{log.company}</span>
                          {log.email && <span className="text-emerald-400 ml-1.5 font-semibold">({log.email})</span>}
                          {log.afm && <span className="text-slate-400 ml-1.5 text-[10px]">ΑΦΜ: {log.afm}</span>}
                          <p className="text-emerald-400/80 text-[10px] mt-0.5">{log.reason}</p>
                        </div>
                      </div>
                    );
                  }

                  if (log.category === "custom_domain") {
                    return (
                      <div key={log.id} className="flex items-start gap-2 text-[11px] py-0.5 px-2 rounded bg-indigo-950/15 border border-indigo-900/30 text-indigo-200/80">
                        <span className="text-slate-600 shrink-0">[{log.time}]</span>
                        <span className="inline-block px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-bold text-[9px] uppercase tracking-wider shrink-0">
                          🏢 ΕΤΑΙΡΙΚΟ DOMAIN
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-slate-300 font-medium">{log.company}</span>
                          {log.email && <span className="text-indigo-300 ml-1 font-mono">({log.email})</span>}
                          <p className="text-slate-500 text-[10px]">{log.reason}</p>
                        </div>
                      </div>
                    );
                  }

                  if (log.category === "blacklisted") {
                    return (
                      <div key={log.id} className="flex items-start gap-2 text-[11px] py-0.5 px-2 rounded bg-rose-950/20 border border-rose-900/40 text-rose-300/80">
                        <span className="text-slate-600 shrink-0">[{log.time}]</span>
                        <span className="inline-block px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold text-[9px] uppercase tracking-wider shrink-0">
                          ⛔ BLACKLIST
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-slate-300 font-medium">{log.company}</span>
                          {log.email && <span className="text-rose-400 ml-1 font-mono">({log.email})</span>}
                          <p className="text-rose-400/70 text-[10px]">{log.reason}</p>
                        </div>
                      </div>
                    );
                  }

                  if (log.category === "duplicate") {
                    return (
                      <div key={log.id} className="flex items-start gap-2 text-[11px] py-0.5 px-2 rounded bg-amber-950/10 border border-amber-900/20 text-amber-200/80">
                        <span className="text-slate-600 shrink-0">[{log.time}]</span>
                        <span className="inline-block px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold text-[9px] uppercase tracking-wider shrink-0">
                          🟡 ΔΙΠΛΟΤΥΠΟ
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-slate-300 font-medium">{log.company}</span>
                          {log.email && <span className="text-slate-400 ml-1">({log.email})</span>}
                          <p className="text-slate-500 text-[10px]">{log.reason}</p>
                        </div>
                      </div>
                    );
                  }

                  if (log.category === "has_website") {
                    return (
                      <div key={log.id} className="flex items-start gap-2 text-[11px] py-0.5 px-2 rounded bg-blue-950/10 border border-blue-900/20 text-blue-200/70">
                        <span className="text-slate-600 shrink-0">[{log.time}]</span>
                        <span className="inline-block px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 font-bold text-[9px] uppercase tracking-wider shrink-0">
                          🔵 ΕΧΕΙ SITE
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-slate-400">{log.company}</span>
                          {log.url && <span className="text-blue-400/80 ml-1">({log.url})</span>}
                          <p className="text-slate-500 text-[10px]">{log.reason}</p>
                        </div>
                      </div>
                    );
                  }

                  if (log.category === "no_email") {
                    return (
                      <div key={log.id} className="flex items-start gap-2 text-[11px] py-0.5 px-2 rounded bg-slate-900/30 text-slate-400">
                        <span className="text-slate-600 shrink-0">[{log.time}]</span>
                        <span className="inline-block px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-bold text-[9px] uppercase tracking-wider shrink-0">
                          ⚪ ΧΩΡΙΣ EMAIL
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-slate-400">{log.company}</span>
                          <span className="text-slate-500 ml-1 text-[10px]">— {log.reason}</span>
                        </div>
                      </div>
                    );
                  }

                  if (log.category === "old_date") {
                    return (
                      <div key={log.id} className="flex items-start gap-2 text-[11px] py-0.5 px-2 rounded bg-purple-950/10 text-purple-300/60">
                        <span className="text-slate-600 shrink-0">[{log.time}]</span>
                        <span className="inline-block px-1.5 py-0.2 rounded bg-purple-900/40 text-purple-400 font-bold text-[9px] uppercase tracking-wider shrink-0">
                          ⏳ ΠΑΛΙΑ
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-slate-400">{log.company}</span>
                          {log.date && <span className="text-purple-400/70 ml-1">({log.date})</span>}
                          <span className="text-slate-500 ml-1 text-[10px]">— {log.reason}</span>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-900 px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                {isScanningGemi ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-indigo-400" />
                    <span>Η σάρωση βρίσκεται σε εξέλιξη...</span>
                  </>
                ) : scanStats.added > 0 ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span className="text-emerald-300 font-semibold">Προστέθηκαν {scanStats.added} νέες Ι.Κ.Ε.!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={14} className="text-amber-400" />
                    <span className="text-amber-300 font-semibold">Δεν βρέθηκαν νέες Ι.Κ.Ε. (υπάρχουν ήδη όλες στη βάση).</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setIsScanModalOpen(false)}
                  className="px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  {isScanningGemi ? "Ακυρωση" : "Κλεισιμο"}
                </button>

                {!isScanningGemi && (scanStats.added > 0 || scannedNewLeads.length > 0) && (
                  <button
                    onClick={() => {
                      setIsScanModalOpen(false);
                      setCampaignSubject(templates[0].subject);
                      setCampaignBody(templates[0].body);
                      setButtonText(templates[0].defaultButtonText || "");
                      setButtonLink(templates[0].defaultButtonLink || "");
                      setSingleLeadTarget(null);

                      const scannedEmails = new Set(scannedNewLeads.map((l: any) => (l.email || "").toLowerCase().trim()));
                      let targetIds = leads
                        .filter((l: any) => scannedEmails.has((l.email || "").toLowerCase().trim()))
                        .map((l: any) => l.id);

                      if (targetIds.length === 0) {
                        targetIds = scannedNewLeads.map((l: any) => l.id).filter(Boolean);
                      }

                      setSelectedLeads(targetIds);
                      setStatusFilter("all");
                      setSearchTerm("");
                      setIsCampaignModalOpen(true);
                    }}
                    className="px-5 py-2 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Send size={12} />
                    Μαζικη Αποστολη στα {scanStats.added > 0 ? scanStats.added : scannedNewLeads.length} Νεα Leads
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
