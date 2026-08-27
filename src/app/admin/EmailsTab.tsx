import React, { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Mail, CheckCircle2, AlertCircle, RefreshCcw, Send, Check, 
  Users, Loader2, X, Trash2, Plus, Search, Building2, 
  FileCheck, Calculator, Sparkles, Phone, Edit3, UserPlus, Save, User
} from "lucide-react";
import { buildProfessionalEmailHtml } from "@/lib/emailTemplates";

const templates = [
  {
    name: "🌐 Istoselida ike 124 ευρω",
    subject: "Εκκρεμότητα εταιρικής ιστοσελίδας για τη νέα σας Ι.Κ.Ε.",
    body: `<h2>Εκκρεμότητα εταιρικής ιστοσελίδας για τη νέα σας Ι.Κ.Ε. ⏳</h2>
<p>Γεια σας,</p>
<p>Συγχαρητήρια για την έναρξη της νέας σας εταιρείας! Αυτή η περίοδος είναι σίγουρα γεμάτη με γραφειοκρατία, λογιστικά και δεκάδες εκκρεμότητες για την έναρξη.</p>
<p>Θέλουμε να σας προλάβουμε για μια σημαντική νομική υποχρέωση: βάσει του <strong>Άρθρου 47 §2 του Ν.4072/2012, όπως εξειδικεύτηκε με την ΚΥΑ 46982/2025</strong>, κάθε νέα Ι.Κ.Ε. υποχρεούται να έχει live τη δική της εταιρική ιστοσελίδα εντός <strong>ενός (1) μηνός</strong> από τη σύστασή της, εμφανίζοντας τα στοιχεία της στο ΓΕΜΗ (κεφάλαιο, εταίροι, διαχειριστής, έδρα).</p>
<p><strong>Για να μην σπαταλήσετε χρόνο ή χρήμα σε περίπλοκα projects, αναλαμβάνουμε τα πάντα εμείς:</strong></p>
<ul>
  <li><strong>Παράδοση σε 24 ώρες:</strong> Η ιστοσελίδα σας θα είναι live και έτοιμη αύριο.</li>
  <li><strong>100% Συμβατή με το ΓΕΜΗ:</strong> Με όλα τα υποχρεωτικά πεδία που ορίζει ο νόμος.</li>
  <li><strong>Live Αυτόματη Σύνδεση με ΓΕΜΗ:</strong> Αυτόματη άντληση δεδομένων — εάν ο λογιστής σας ανεβάσει κάποιο έγγραφο, καταστατικό ή αλλαγή στο ΓΕΜΗ, η ιστοσελίδα σας ενημερώνεται αυτόματα!</li>
  <li><strong>Όλα συμπεριλαμβανόμενα:</strong> Σχεδιασμός Λογότυπου + Εταιρικό Email + Domain Name (.gr) + Φιλοξενία (Hosting 1 έτος) + Ασφάλεια SSL + Πλήρης Συμμόρφωση GDPR.</li>
  <li><strong>Τελικό Κόστος:</strong> Μόνο <strong>124€</strong> (συμπεριλαμβανομένου ΦΠΑ 24% - κόβεται κανονικά τιμολόγιο).</li>
</ul>
<p>Αφαιρέστε αυτή την εκκρεμότητα από τη λίστα σας σήμερα. Πατήστε στο παρακάτω κουμπί για να συμπληρώσετε τα στοιχεία σας και να ξεκινήσουμε άμεσα.</p>`,
    defaultButtonText: "Έναρξη Κατασκευής",
    defaultButtonLink: "https://sgk.gr/ike-offer"
  },
  {
    name: "✨ Αναβάθμιση ΙΚΕ σε Πλήρες Website (390€)",
    subject: "Αναβαθμίστε την Ι.Κ.Ε. σας σε Πλήρη Εταιρική Ιστοσελίδα 🚀 (Ειδική Προσφορά 390€)",
    body: `<h2>Μετατρέψτε την Ιστοσελίδα της Ι.Κ.Ε. σας σε Ισχυρό Εργαλείο Πωλήσεων & Προβολής! 🚀</h2>
<p>Γεια σας,</p>
<p>Χαιρόμαστε ιδιαίτερα που συνεργαστήκαμε για τη δημιουργία της επίσημης σελίδας ΓΕΜΗ της εταιρείας σας!</p>
<p>Η νομική συμμόρφωση είναι το πρώτο βήμα. Ωστόσο, στην ψηφιακή εποχή, οι υποψήφιοι πελάτες και συνεργάτες σας αναζητούν μια <strong>πλήρη εταιρική παρουσίαση</strong> για να δουν τις υπηρεσίες και το προφίλ της επιχείρησής σας.</p>
<p>Γι' αυτό το λόγο, ετοιμάσαμε μια <strong>αποκλειστική προσφορά αναβάθμισης</strong> ειδικά για εσάς που είστε ήδη πελάτες μας:</p>
<h3>Αναβάθμιση σε Πλήρη Εταιρική Ιστοσελίδα Παρουσίασης & Υπηρεσιών — Μόνο 390€ (Εφάπαξ)</h3>
<ul>
  <li><strong>Πλήρης Σχεδιασμός & Branding:</strong> Σύγχρονη παρουσίαση προσαρμοσμένη στα χρώματα, το λογότυπο και το ύφος της επιχείρησής σας.</li>
  <li><strong>Ολοκληρωμένες Σελίδες:</strong> Αρχική σελίδα, Σχετικά με Εμάς (About Us), Αναλυτικές Υπηρεσίες/Προϊόντα & Φόρμα Επικοινωνίας με Google Maps.</li>
  <li><strong>100% Mobile & SEO Optimized:</strong> Υπερταχύτητα φόρτωσης (Core Web Vitals) για να σας βρίσκουν εύκολα οι πελάτες σας στη Google.</li>
  <li><strong>Ενσωμάτωση των Στοιχείων ΓΕΜΗ:</strong> Όλα τα στοιχεία ΓΕΜΗ, το κεφάλαιο, οι διαχειριστές και η ενότητα δημοσίευσης Ισολογισμών (PDF) παραμένουν 100% ενεργά και ενσωματωμένα στη νέα σας ιστοσελίδα.</li>
  <li><strong>Χωρίς Επιπλέον Κόστος Hosting/Domain για το 2026:</strong> Το Domain (.gr), η φιλοξενία, τα εταιρικά emails, το SSL και το GDPR καλύπτονται ήδη από τη συνδρομή της ΙΚΕ σας!</li>
</ul>
<p><strong>Τελική Τιμή Αναβάθμισης:</strong> Μόνο <strong>390€ εφάπαξ</strong> (συμπεριλαμβανομένου ΦΠΑ 24% - εκδίζεται τιμολόγιο εξόδων). Η ετήσια συνδρομή σας παραμένει σταθερά στα <strong>124€/έτος</strong> από το 2027, όπως ακριβώς συμφωνήθηκε!</p>
<p>Δώστε στην εταιρεία σας την εικόνα που της αξίζει. Για να ξεκινήσουμε την αναβάθμιση ή να συζητήσουμε τις λεπτομέρειες, <strong>απαντήστε σε αυτό το email</strong> ή καλέστε μας στο σταθερό <strong>211 114 0013</strong> ή στο κινητό <strong>6999 524 389</strong>!</p>`,
    defaultButtonText: "",
    defaultButtonLink: ""
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
      <td style="padding: 8px; vertical-align: middle;">
        <strong>Σχεδιασμός & ανάπτυξη Headless e-shop (Next.js + WooCommerce backend).</strong><br/>
        <span style="font-size: 11px; color: #64748b; line-height: 1.4; display: block; margin-top: 4px;">
          Περιλαμβάνει responsive σχεδίαση για κινητά/tablets, διασύνδεση με τράπεζες & Viva Wallet, αυτόματο υπολογισμό μεταφορικών (ACS, BoxNow), εισαγωγή προϊόντων, εκπαίδευση διαχειριστή, Google PageSpeed 95+ και βασικό SEO.
        </span>
      </td>
      <td style="padding: 8px; text-align: right; font-weight: 600; vertical-align: middle;">900 €</td>
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
  },
  {
    name: "🧾 Εξοφλημένο Τιμολόγιο Παροχής Υπηρεσιών (Snapi Design)",
    subject: "Εξοφλημένο Τιμολόγιο Παροχής Υπηρεσιών — SGK Digital",
    body: `<h2>Εξοφλημένο Τιμολόγιο 🧾</h2>
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
          Τιμολόγιο Παροχής Υπηρεσιών # [ΑΡΙΘΜΟΣ_ΤΙΜΟΛΟΓΙΟΥ]
        </span>
      </td>
      <td style="padding: 8px; text-align: right; font-weight: 600; vertical-align: middle;">[ΚΑΘΑΡΟ_ΠΟΣΟ] €</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px; vertical-align: middle;">ΦΠΑ 24%</td>
      <td style="padding: 8px; text-align: right; font-weight: 600; vertical-align: middle;">[ΠΟΣΟ_ΦΠΑ] €</td>
    </tr>
    <tr style="background-color: #f0fdf4; border-top: 2px solid #4ade80; border-bottom: 2px solid #4ade80; font-weight: bold;">
      <td style="padding: 10px 8px; color: #166534;">Συνολικό Ποσό (με ΦΠΑ)</td>
      <td style="padding: 10px 8px; text-align: right; color: #166534; font-size: 15px; font-weight: 900;">[ΤΕΛΙΚΟ_ΠΟΣΟ] €</td>
    </tr>
  </tbody>
</table>
<div style="background-color: #f0fdf4; border: 2px solid #4ade80; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0;">
  <div style="display: inline-block; background-color: #22c55e; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-weight: 900; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
    ✓ ΕΞΟΦΛΗΘΗΚΕ / PAID
  </div>
  <p style="margin: 0 !important; font-size: 14px; font-weight: bold; color: #166534; line-height: 1.5;">Το παραστατικό έχει εξοφληθεί πλήρως. Σας ευχαριστούμε πολύ για τη συνεργασία και την εμπιστοσύνη σας!</p>
</div>
<p style="margin-top: 20px; color: #64748b; font-style: italic;">Η ομάδα της SGK Digital</p>`,
    defaultButtonText: "🧾 Λήψη Εξοφλημένου Τιμολογίου (PDF)",
    defaultButtonLink: "https://sgk.gr/doc/invoice"
  },
  {
    name: "✉️ Τιμολόγιο προς Εξόφληση",
    subject: "Τιμολόγιο Παροχής Υπηρεσιών — SGK Digital",
    body: `<h2>Τιμολόγιο προς Εξόφληση 🧾</h2>
<p>Αγαπητέ συνεργάτη,</p>
<p>Σας αποστέλλουμε συνημμένα το τιμολόγιο παροχής υπηρεσιών που αφορά τις εργασίες μας. Παρακαλούμε για την τακτοποίησή του εντός της συμφωνηθείσας προθεσμίας από τη λήψη του παραστατικού.</p>
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
          Τιμολόγιο Παροχής Υπηρεσιών # [ΑΡΙΘΜΟΣ_ΤΙΜΟΛΟΓΙΟΥ]
        </span>
      </td>
      <td style="padding: 8px; text-align: right; font-weight: 600; vertical-align: middle;">[ΚΑΘΑΡΟ_ΠΟΣΟ] €</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px; vertical-align: middle;">ΦΠΑ 24%</td>
      <td style="padding: 8px; text-align: right; font-weight: 600; vertical-align: middle;">[ΠΟΣΟ_ΦΠΑ] €</td>
    </tr>
    <tr style="background-color: #f0fdf4; border-top: 2px solid #4ade80; border-bottom: 2px solid #4ade80; font-weight: bold;">
      <td style="padding: 10px 8px; color: #166534;">Συνολικό Ποσό (με ΦΠΑ)</td>
      <td style="padding: 10px 8px; text-align: right; color: #166534; font-size: 15px; font-weight: 900;">[ΤΕΛΙΚΟ_ΠΟΣΟ] €</td>
    </tr>
  </tbody>
</table>
<h4>Στοιχεία Τραπεζικών Λογαριασμών</h4>
<p>Για την εξόφληση, μπορείτε να κάνετε κατάθεση σε έναν από τους παρακάτω τραπεζικούς λογαριασμούς της εταιρείας μας (παρακαλούμε αναφέρετε τον αριθμό τιμολογίου στην αιτιολογία):</p>
<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
  <div style="margin-bottom: 10px;">
    <div style="font-size: 13px; font-weight: bold; color: #111111;">Τράπεζα Πειραιώς</div>
    <div style="font-size: 12px; font-family: monospace; color: #3b5bdb; margin-top: 2px; font-weight: bold;">GR74 0172 0000 0000 1234 5678 901</div>
    <div style="font-size: 10px; color: #64748b;">Δικαιούχος: ΤΣΑΒΟΣ ΣΠΥΡΙΔΩΝ ΧΡΗΣΤΟΣ (SGK Digital)</div>
  </div>
  <div style="margin-bottom: 10px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
    <div style="font-size: 13px; font-weight: bold; color: #111111;">Eurobank</div>
    <div style="font-size: 12px; font-family: monospace; color: #3b5bdb; margin-top: 2px; font-weight: bold;">GR12 0260 0000 0000 9876 5432 109</div>
    <div style="font-size: 10px; color: #64748b;">Δικαιούχος: ΤΣΑΒΟΣ ΣΠΥΡΙΔΩΝ ΧΡΗΣΤΟΣ (SGK Digital)</div>
  </div>
  <div style="border-top: 1px solid #e2e8f0; padding-top: 10px;">
    <div style="font-size: 13px; font-weight: bold; color: #111111;">Alpha Bank</div>
    <div style="font-size: 12px; font-family: monospace; color: #3b5bdb; margin-top: 2px; font-weight: bold;">GR45 0140 0000 0000 1111 2222 333</div>
    <div style="font-size: 10px; color: #64748b;">Δικαιούχος: ΤΣΑΒΟΣ ΣΠΥΡΙΔΩΝ ΧΡΗΣΤΟΣ (SGK Digital)</div>
  </div>
</div>
<p>Παραμένουμε στη διάθεσή σας για οποιαδήποτε απορία ή διευκρίνιση.</p>`,
    defaultButtonText: "Online Εξόφληση",
    defaultButtonLink: "https://sgk.gr/pay-invoice?ref=[ΑΡΙΘΜΟΣ_ΤΙΜΟΛΟΓΙΟΥ]"
  },
  {
    name: "📜 Ιδιωτικό Συμφωνητικό (ΓΕΜΗ)",
    subject: "Ιδιωτικό Συμφωνητικό Κατασκευής Ιστοσελίδας — SGK Digital",
    body: `<p>Καλημέρα σας,</p>
<p>Σας στέλνουμε αυτό το μήνυμα σε συνέχεια της επικοινωνίας μας σχετικά με το νέο σας <strong>Website</strong></p>
<p>Στο παρόν email <strong>επισυνάπτουμε το συμφωνητικό συνεργασίας μας</strong>. Το έχουμε ανεβάσει και στο gov και πρέπει να υπογραφεί</p>

<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0;">
  <h3 style="margin-top: 0; color: #3b5bdb; font-size: 16px; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">💸 Στοιχεία Κατάθεσης Προκαταβολής</h3>
  <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; line-height: 1.5;">
    <tbody>
      <tr>
        <td style="padding: 6px 0px; font-weight: bold; color: #475569; width: 35%;">Ποσό:</td>
        <td style="padding: 6px 0px; color: #0f172a; font-weight: bold; font-size: 16px; width: 65%;">124,00 €</td>
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
        <td style="padding: 6px 0px; color: #475569; font-style: italic; width: 65%;">website</td>
      </tr>
    </tbody>
  </table>
</div>

<p>Παραμένουμε στη διάθεσή σας για οποιαδήποτε απορία ή διευκρίνιση.</p>
<p style="margin-top: 30px !important; border-top: 1px solid #f0f0f0; padding-top: 20px;">Με εκτίμηση,<br /><strong>Η ομάδα της SGK Software Development</strong></p>`,
    defaultButtonText: "📄 Προβολή & Λήψη Συμφωνητικού (PDF)",
    defaultButtonLink: "https://sgk.gr/doc/contract"
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

  // Live GEMI IKE Scanner state
  const [isScanningGemi, setIsScanningGemi] = useState(false);

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
    const docUrl = `https://sgk.gr/doc/contract?id=${docId}&data=${b64}&download=1`;

    const companyLabel = contract.tradeName || contract.companyName || singleLeadTarget?.company || "";
    const amountLabel = contract.totalAmountNum ? `${contract.totalAmountNum.toFixed(2).replace('.', ',')} €` : (contract.totalAmountText || "124,00 €");

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
      net: 100,
      vat: 24,
      gross: 124,
      payable: 124,
    };
    const b64 = safeEncodeBase64(invoicePayload);
    const docUrl = `https://sgk.gr/doc/invoice?id=${docId}&data=${b64}&download=1`;

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

    const netVal = invoicePayload.net || 100;
    const vatVal = invoicePayload.vat || 24;
    const grossVal = invoicePayload.gross || 124;

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
  };

  useEffect(() => {
    fetchLeads();
    setIsClient(true);
  }, []);

  useEffect(() => {
    setSelectedLeads([]);
  }, [statusFilter, searchTerm]);

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
      targets = [{
        id: singleLeadTarget.id || null,
        email: email,
        first_name: singleLeadTarget.first_name || singleLeadTarget.company || "Συνεργάτη",
        company: singleLeadTarget.company || "",
        unsubscribe_token: singleLeadTarget.unsubscribe_token || crypto.randomUUID()
      }];
    } else {
      const uncontactedFiltered = filteredLeads.filter(l => !l.unsubscribed && !l.converted && (l.email_sequence_step || 0) === 0);
      const rawTargets = selectedLeads.length > 0 
        ? filteredLeads.filter(l => selectedLeads.includes(l.id)) 
        : uncontactedFiltered;

      targets = rawTargets.filter(l => !l.unsubscribed && l.marketing_consent !== false);

      if (rawTargets.length > targets.length) {
        toast.info(`Εξαιρέθηκαν ${rawTargets.length - targets.length} παραλήπτες που έχουν κάνει απεγγραφή.`);
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

  const handleScanGemiIkes = async () => {
    setIsScanningGemi(true);
    toast.loading("Γίνεται live σάρωση στο Γ.Ε.ΜΗ. για νεοσύστατες Ι.Κ.Ε. χωρίς ιστοσελίδα...", { id: "gemi-scan" });
    try {
      const res = await fetch("/api/admin/scan-gemi-ikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 50 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Αποτυχία σάρωσης ΓΕΜΗ");
      }

      if (data.count > 0) {
        toast.success(`🎉 Βρέθηκαν & προστέθηκαν ${data.count} νέες Ι.Κ.Ε. στη λίστα! (Εξετάστηκαν: ${data.totalExamined})`, { id: "gemi-scan" });
      } else {
        toast.info(`Η σάρωση ολοκληρώθηκε (Εξετάστηκαν ${data.totalExamined} επιχειρήσεις). Δεν βρέθηκαν νέα leads — όλα υπάρχουν ήδη στη βάση.`, { id: "gemi-scan" });
      }

      await fetchLeads();
    } catch (err: any) {
      console.error("GEMI Scan Error:", err);
      toast.error(`Σφάλμα κατά τη σάρωση: ${err.message || "Άγνωστο σφάλμα"}`, { id: "gemi-scan" });
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

      if (statusFilter === 'new_ike') {
        return lead.type === 'new_ike' || (!lead.type && lead.created_at >= '2026-08-01');
      }
      if (statusFilter === 'legacy') {
        return lead.type === 'legacy_ike';
      }
      if (statusFilter === 'converted') {
        return lead.converted;
      }
      if (statusFilter === 'new') {
        return !lead.unsubscribed && !lead.converted && ((lead.email_sequence_step || 0) === 0);
      }
      if (statusFilter === 'completed') {
        return !lead.unsubscribed && !lead.converted && ((lead.email_sequence_step || 0) >= 5);
      }
      if (statusFilter === 'active') {
        return !lead.unsubscribed && !lead.converted && (lead.email_sequence_step || 0) >= 1 && (lead.email_sequence_step || 0) < 5;
      }
      if (statusFilter === 'unsubscribed') {
        return lead.unsubscribed;
      }

      return true;
    });
  }, [leads, searchTerm, statusFilter]);

  const uncontactedFilteredLeads = filteredLeads.filter(l => !l.unsubscribed && !l.converted && (l.email_sequence_step || 0) === 0);
  const newIkeCount = leads.filter(l => l.type === 'new_ike' || (!l.type && l.created_at >= '2026-08-01')).length;
  const legacyCount = leads.filter(l => l.type === 'legacy_ike').length;
  const newCount = leads.filter(l => !l.unsubscribed && !l.converted && ((l.email_sequence_step || 0) === 0)).length;
  const activeCount = leads.filter(l => !l.unsubscribed && !l.converted && (l.email_sequence_step || 0) >= 1 && (l.email_sequence_step || 0) < 5).length;
  const completedCount = leads.filter(l => !l.unsubscribed && !l.converted && ((l.email_sequence_step || 0) >= 5)).length;
  const convertedCount = leads.filter(l => l.converted).length;
  const unsubscribedCount = leads.filter(l => l.unsubscribed).length;

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
                            totalAmountText: "εκατόν είκοσι τεσσάρων ευρώ (124,00 €)",
                            deliveryDaysText: "πέντε (5)",
                            renewalAmountText: "εκατόν είκοσι τεσσάρων ευρώ (124,00 €)",
                            ibanDetails: "GR4602601970000830201330337 (Eurobank), δικαιούχος Σπυρίδων Τσάβος"
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
                          {c.tradeName || c.companyName || "Συμφωνητικό"} ({c.totalAmountNum || 124}€)
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Card 2: Απεγγραφές (Unsubscribed) */}
        <div 
          onClick={() => setStatusFilter('unsubscribed')}
          className={`p-4 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer transition-all border ${
            statusFilter === 'unsubscribed' 
              ? 'bg-white border-rose-500 ring-2 ring-rose-500/20' 
              : 'bg-white/60 backdrop-blur-xl border-rose-200/60 hover:border-rose-300'
          }`}
        >
          <div>
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Απεγγραφες (Unsub)</p>
            <p className="text-xl font-black text-rose-600 mt-1">{unsubscribedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <AlertCircle size={18} />
          </div>
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
              <button
                onClick={handleDeleteSelectedLeads}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all text-xs font-black uppercase tracking-wider shadow-md cursor-pointer"
              >
                <Trash2 size={12} />
                Διαγραφη ({selectedLeads.length})
              </button>
            )}
            <button
              onClick={handleOpenCreateLead}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all text-xs font-black uppercase tracking-wider shadow-md cursor-pointer"
            >
              <UserPlus size={14} />
              + Νεος Πελατης
            </button>
            <button
              onClick={handleScanGemiIkes}
              disabled={isScanningGemi}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl transition-all text-xs font-black uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50"
              title="Live σάρωση στο Γ.Ε.ΜΗ. για νεοσύστατες Ι.Κ.Ε. χωρίς ιστοσελίδα"
            >
              {isScanningGemi ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-yellow-300" />}
              ⚡ Ευρεση Νεων ΙΚΕ (ΓΕΜΗ)
            </button>
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

          {/* Active Filter Indicator */}
          {statusFilter !== 'all' && (
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
              <span className="text-slate-500">Φίλτρο:</span>
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
                      title="Επιλογή όλων των Νέων παραληπτών (0/5) στο τρέχον φίλτρο"
                      checked={uncontactedFilteredLeads.length > 0 && uncontactedFilteredLeads.every(l => selectedLeads.includes(l.id))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeads(uncontactedFilteredLeads.map(l => l.id));
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
                  filteredLeads.map((lead) => (
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
                      {lead.company && (
                        <div className="text-xs font-bold text-[#0f2d59] flex items-center gap-1 mt-0.5">
                          <Building2 size={11} className="text-slate-400 shrink-0" />
                          <span>{lead.company}</span>
                        </div>
                      )}
                      {(lead.first_name || lead.last_name) && (
                        <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                          {lead.first_name || ""} {lead.last_name || ""}
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-1">
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
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            ΑΦΜ: {lead.afm}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {new Date(lead.created_at).toLocaleDateString("el-GR")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {lead.unsubscribed ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-700">Unsubscribed</span>
                      ) : lead.converted ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">🎉 Πελάτης</span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-700">Active</span>
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
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#3b5bdb]/10 text-[#3b5bdb] hover:bg-[#3b5bdb] hover:text-white rounded-xl transition-all text-xs font-bold uppercase cursor-pointer"
                            title="Αποστολή Προσαρμοσμένου Email"
                          >
                            <Mail size={12} />
                            Email
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
                )))}
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
    </div>
  );
}
