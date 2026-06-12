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

function getInCityPhrase(city: string): string {
  if (!city) return "";
  const trimmed = city.trim();
  
  // 1. Plural Neuter
  const pluralNeuterCities = [
    "Χανιά", "Γρεβενά", "Τρίκαλα", "Ιωάννινα", "Γιαννιτσά", 
    "Καλάβρυτα", "Μέγαρα", "Φάρσαλα", "Λεχαινά", "Κύθηρα", 
    "Ψαρά", "Κουφονήσια", "Λιμενάρια", "Μάλια", "Καμένα Βούρλα",
    "Λουτρά", "Λιμάνια", "Μέθανα"
  ];
  
  if (pluralNeuterCities.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
    return `στα ${trimmed}`;
  }

  // 2. Feminine ending in -ος (needs accusative, drops 'ς')
  const feminineOsCities = [
    "Ρόδος", "Μύκονος", "Νάξος", "Πάρος", "Μήλος", "Σίφνος", 
    "Σέριφος", "Κύθνος", "Κίμωλος", "Αμοργός", "Αλόννησος", 
    "Σκόπελος", "Σκιάθος", "Ζάκυνθος", "Κάρπαθος", "Λέρος", 
    "Πάτμος", "Σύρος", "Τήνος", "Άνδρος", "Κόρινθος", "Πύλος"
  ];
  
  const isFeminineOs = feminineOsCities.some(c => c.toLowerCase() === trimmed.toLowerCase());
  
  if (isFeminineOs) {
    const accusative = trimmed.endsWith("ς") ? trimmed.slice(0, -1) : trimmed;
    const firstChar = accusative.charAt(0).toUpperCase();
    const firstTwo = accusative.slice(0, 2).toLowerCase();
    
    const vowels = ["Α", "Ε", "Η", "Ι", "Ο", "Υ", "Ω", "Ά", "Έ", "Ή", "Ί", "Ό", "Ύ", "Ώ"];
    const stopConsonants = ["Κ", "Π", "Τ", "Ξ", "Ψ"];
    const stopClusters = ["μπ", "ντ", "γκ", "τσ", "τζ"];
    
    const needsN = vowels.includes(firstChar) || 
                   stopConsonants.includes(firstChar) || 
                   stopClusters.some(cluster => firstTwo.startsWith(cluster));
                   
    return needsN ? `στην ${accusative}` : `στη ${accusative}`;
  }

  // 3. Masculine/Feminine ending in -ος, -ης, -ας / -ός, -ής, -άς (needs accusative, drops 'ς')
  if (trimmed.endsWith("ς") || trimmed.endsWith("Σ")) {
    const accusative = trimmed.slice(0, -1);
    if (trimmed.toLowerCase() === "άργος") {
      return `στο ${trimmed}`;
    }
    return `στο ${accusative}`;
  }

  // 4. Neuter ending in -ο, -ό, -ι, -ί, -υ, -ύ
  const lastChar = trimmed.slice(-1).toLowerCase();
  if (["ο", "ό", "ι", "ί", "υ", "ύ"].includes(lastChar)) {
    return `στο ${trimmed}`;
  }

  // 5. Feminine singular ending in -α, -ά, -η, -ή or anything else
  const firstChar = trimmed.charAt(0).toUpperCase();
  const firstTwo = trimmed.slice(0, 2).toLowerCase();
  
  const vowels = ["Α", "Ε", "Η", "Ι", "Ο", "Υ", "Ω", "Ά", "Έ", "Ή", "Ί", "Ό", "Ύ", "Ώ"];
  const stopConsonants = ["Κ", "Π", "Τ", "Ξ", "Ψ"];
  const stopClusters = ["μπ", "ντ", "γκ", "τσ", "τζ"];
  
  const needsN = vowels.includes(firstChar) || 
                 stopConsonants.includes(firstChar) || 
                 stopClusters.some(cluster => firstTwo.startsWith(cluster));
                 
  return needsN ? `στην ${trimmed}` : `στη ${trimmed}`;
}

const applyTemplateVariables = (body: string, subject: string, prospect: Prospect) => {
  const businessName = prospect.business_name || "";
  const city = prospect.city || "";
  const inCityPhrase = getInCityPhrase(city);

  const replaceAll = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\[BUSINESS_NAME\]/g, businessName)
      .replace(/\[CITY\]/g, city)
      .replace(/\[IN_CITY\]/g, inCityPhrase);
  };

  return {
    subject: replaceAll(subject),
    body: replaceAll(body)
  };
};

const detectIndustry = (industryText: string): string => {
  if (!industryText) return "generic";
  const text = industryText.toLowerCase();
  
  if (text.includes("οδοντ") || text.includes("dent") || text.includes("tooth") || text.includes("smile") || text.includes("στοματ") || text.includes("odont")) {
    return "dentist";
  }
  if (text.includes("εστια") || text.includes("καφε") || text.includes("restau") || text.includes("cafe") || text.includes("ψητο") || text.includes("ταβερ") || text.includes("pizza") || text.includes("burger") || text.includes("φαγητ") || text.includes("bar") || text.includes("delivery") || text.includes("μπαρ")) {
    return "food_service";
  }
  if (text.includes("ξενοδ") || text.includes("hotel") || text.includes("villa") || text.includes("rooms") || text.includes("καταλυμ") || text.includes("διαμον") || text.includes("studios") || text.includes("suites")) {
    return "hotel";
  }
  if (text.includes("rent") || text.includes("ενοικια") || text.includes("aut") || text.includes("car") || text.includes("οχημα") || text.includes("moto")) {
    return "rent_a_car";
  }
  
  return "generic";
};

const EMAIL_TEMPLATES: Record<
  string,
  Record<
    string,
    {
      subject: string;
      body: string;
      buttonText: string;
      buttonLink: string;
    }
  >
> = {
  website: {
    generic: {
      subject: "Πρόταση Συνεργασίας: Ψηφιακή Παρουσία για την [BUSINESS_NAME] [IN_CITY]",
      body: `<h2>Αποκτήστε τη δική σας επαγγελματική ιστοσελίδα! 🚀</h2>
<p>Γεια σας,</p>
<p>Επισκεφθήκαμε την online παρουσία της επιχείρησης <strong>[BUSINESS_NAME]</strong> [IN_CITY] και παρατηρήσαμε ότι δεν διαθέτετε δικό σας επίσημο website για την προβολή των υπηρεσιών σας.</p>
<p>Στην <strong>SGK Software Development</strong> εξειδικευόμαστε στην κατασκευή ταχύτατων ιστοσελίδων νέας γενιάς (με Next.js / React) που βοηθούν τις επιχειρήσεις να αποκτήσουν σύγχρονη παρουσία στο διαδίκτυο και να προσελκύσουν νέους πελάτες.</p>
<p><strong>Τι σας προσφέρουμε:</strong></p>
<ul>
  <li><strong>Επαγγελματική Σχεδίαση:</strong> Mobile-first, προσαρμοσμένη απόλυτα στο δικό σας brand.</li>
  <li><strong>Ασύλληπτη Ταχύτητα:</strong> Με Core Web Vitals 95+ για κορυφαία κατάταξη στη Google (SEO).</li>
  <li><strong>Σύνδεση με Social Media & Google Maps:</strong> Για εύκολο εντοπισμό από νέους πελάτες.</li>
</ul>
<p>Αν ενδιαφέρεστε να συζητήσουμε πώς μπορούμε να αναβαθμίσουμε την παρουσία σας στο διαδίκτυο, απαντήστε σε αυτό το email ή καλέστε μας απευθείας στο <strong>6999524389</strong>.</p>`,
      buttonText: "Δείτε τις Υπηρεσίες μας",
      buttonLink: "https://www.sgk.gr/web-development"
    },
    dentist: {
      subject: "Πρόταση: Σύγχρονη Ιστοσελίδα με Online Ραντεβού για το Οδοντιατρείο [BUSINESS_NAME]",
      body: `<h2>Αναβαθμίστε την ψηφιακή παρουσία του οδοντιατρείου σας! 🦷</h2>
<p>Γεια σας,</p>
<p>Επισκεφθήκαμε την καταχώρηση για το οδοντιατρείο <strong>[BUSINESS_NAME]</strong> [IN_CITY] και θα θέλαμε να σας προτείνουμε τη δημιουργία μιας σύγχρονης, επαγγελματικής ιστοσελίδας.</p>
<p>Στην <strong>SGK Software Development</strong> σχεδιάζουμε ιστοσελίδες ειδικά για οδοντιάτρους, οι οποίες διευκολύνουν τους ασθενείς να σας βρουν και να κλείσουν ραντεβού.</p>
<p><strong>Τι θα περιλαμβάνει η ιστοσελίδα σας:</strong></p>
<ul>
  <li><strong>Σύστημα Online Ραντεβού:</strong> Οι ασθενείς βλέπουν τη διαθεσιμότητά σας και κλείνουν ραντεβού 24/7.</li>
  <li><strong>Παρουσίαση Υπηρεσιών & Περιστατικών:</strong> Αναδείξτε την εξειδίκευσή σας και φωτογραφίες πριν/μετά.</li>
  <li><strong>Κορυφαίο Τοπικό SEO (Local SEO):</strong> Για να εμφανίζεστε πρώτοι στις αναζητήσεις ασθενών [IN_CITY].</li>
</ul>
<p>Αν θέλετε να συζητήσουμε πώς μπορούμε να βοηθήσουμε το οδοντιατρείο σας να αναπτυχθεί, απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong>.</p>`,
      buttonText: "Δείτε την Πρότασή μας",
      buttonLink: "https://www.sgk.gr/web-development"
    },
    food_service: {
      subject: "Πρόταση Συνεργασίας: Επαγγελματικό Website για το [BUSINESS_NAME] [IN_CITY]",
      body: `<h2>Αναδείξτε το μενού και τον χώρο σας στο διαδίκτυο! 🍽️</h2>
<p>Γεια σας,</p>
<p>Επισκεφθήκαμε την online παρουσία της επιχείρησης <strong>[BUSINESS_NAME]</strong> [IN_CITY] και είδαμε ότι δραστηριοποιείστε στον χώρο της εστίασης.</p>
<p>Στην <strong>SGK Software Development</strong> κατασκευάζουμε εντυπωσιακές, γρήγορες ιστοσελίδες για εστιατόρια, καφέ και μπαρ, που αναδεικνύουν το μενού σας και διευκολύνουν τις κρατήσεις.</p>
<p><strong>Τι σας προσφέρουμε:</strong></p>
<ul>
  <li><strong>Digital Interactive Μενού:</strong> Εύχρηστο, καθαρό μενού με φωτογραφίες και τιμές, ιδανικό για κινητά.</li>
  <li><strong>Σύστημα Online Κρατήσεων:</strong> Οι πελάτες σας κάνουν κράτηση τραπεζιού γρήγορα και εύκολα.</li>
  <li><strong>Σύνδεση με Tripadvisor & Google Maps:</strong> Για να προσελκύετε εύκολα τουρίστες και ντόπιους.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να συζητήσουμε πώς μπορούμε να αναδείξουμε τη γαστρονομία σας online.</p>`,
      buttonText: "Δείτε τις Υπηρεσίες μας",
      buttonLink: "https://www.sgk.gr/web-development"
    },
    hotel: {
      subject: "Πρόταση: Website Ξενοδοχείου με Σύστημα Απευθείας Κρατήσεων για την [BUSINESS_NAME]",
      body: `<h2>Απελευθερωθείτε από τις υψηλές προμήθειες της Booking & Airbnb! 🏨</h2>
<p>Γεια σας,</p>
<p>Επισκεφθήκαμε την online παρουσία του καταλύματος <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Στην <strong>SGK Software Development</strong> κατασκευάζουμε υπερσύγχρονες ιστοσελίδες για ξενοδοχεία και τουριστικά καταλύματα με <strong>ενσωματωμένο σύστημα απευθείας κρατήσεων (Booking Engine)</strong>.</p>
<p><strong>Πλεονεκτήματα:</strong></p>
<ul>
  <li><strong>0% Προμήθειες:</strong> Κρατήσεις απευθείας στον δικό σας τραπεζικό λογαριασμό.</li>
  <li><strong>Channel Manager:</strong> Αυτόματος συγχρονισμός με Booking, Expedia, Airbnb για αποφυγή double bookings.</li>
  <li><strong>Live Πληρωμές:</strong> Άμεση εξόφληση με πιστωτική κάρτα, Apple Pay ή Google Pay.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να σχεδιάσουμε τη νέα σας τουριστική ιστοσελίδα!</p>`,
      buttonText: "Δείτε Case Studies",
      buttonLink: "https://www.sgk.gr/case-study/lemon-tree-paros"
    },
    rent_a_car: {
      subject: "Σύγχρονη Ιστοσελίδα με Booking Engine για την [BUSINESS_NAME] [IN_CITY]",
      body: `<h2>Αυτοματοποιήστε τις ενοικιάσεις του στόλου σας! 🚗</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με την επιχείρησή σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Προσφέρουμε μια ολοκληρωμένη λύση για εταιρείες ενοικίασης αυτοκινήτων και σκαφών, η οποία περιλαμβάνει <strong>υπερσύγχρονο site και έξυπνο σύστημα online κρατήσεων</strong>.</p>
<p><strong>Τι περιλαμβάνει η λύση Rent a Car:</strong></p>
<ul>
  <li><strong>Real-time Booking Engine:</strong> Υπολογισμός τιμών βάσει εποχικότητας, ημερών και έξτρα παροχών (ασφάλεια, GPS κλπ.).</li>
  <li><strong>Διαχείριση Στόλου (Fleet Management):</strong> Πλήρης έλεγχος διαθεσιμότητας οχημάτων και προγραμματισμός παραλαβών.</li>
  <li><strong>Πολλαπλά Σημεία Παράδοσης:</strong> Επιλογή τοποθεσίας (π.χ. Αεροδρόμιο, Λιμάνι, Ξενοδοχείο) με αντίστοιχες χρεώσεις.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να συζητήσουμε τις ανάγκες σας.</p>`,
      buttonText: "Δείτε το Demo",
      buttonLink: "https://www.sgk.gr/eshop-offer"
    }
  },
  eshop: {
    generic: {
      subject: "Ειδική Προσφορά: Κατασκευή Eshop για την [BUSINESS_NAME] [IN_CITY]",
      body: `<h2>Ξεκινήστε τις Online Πωλήσεις σας Σήμερα! 🛍️</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με την επιχείρησή σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Θέλουμε να σας προσφέρουμε μια ειδική προσφορά για την κατασκευή ενός υπερσύγχρονου eshop στην προνομιακή τιμή των <strong>1.500€</strong>.</p>
<p><strong>Τι περιλαμβάνει η προσφορά:</strong></p>
<ul>
  <li><strong>Σύνδεση με Skroutz & ERP:</strong> Για αυτόματη ενημέρωση προϊόντων και παραγγελιών.</li>
  <li><strong>Όλες οι Ελληνικές Τράπεζες & Courier:</strong> Έτοιμες διασυνδέσεις πληρωμών και αποστολών με αυτόματη έκδοση voucher.</li>
  <li><strong>100% Ταχύτητα PageSpeed:</strong> Για κορυφαίο SEO και πωλήσεις από κινητά.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να συζητήσουμε τις λεπτομέρειες!</p>`,
      buttonText: "Δείτε την Προσφορά",
      buttonLink: "https://www.sgk.gr/eshop-offer"
    },
    dentist: {
      subject: "Προσφορά: Κατασκευή Eshop Οδοντιατρικών Προϊόντων για την [BUSINESS_NAME]",
      body: `<h2>Πουλήστε οδοντιατρικά είδη ή προϊόντα στοματικής υγιεινής online! 🦷🛍️</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με το οδοντιατρείο ή την εταιρεία σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Σχεδιάζουμε εξειδικευμένα eshop για την πώληση οδοντιατρικών ειδών, αναλωσίμων ή προϊόντων στοματικής υγιεινής, συνδεδεμένα με τις αποθήκες και τα συστήματα τιμολόγησής σας.</p>
<p><strong>Τι σας προσφέρουμε:</strong></p>
<ul>
  <li><strong>B2B & B2C Λειτουργίες:</strong> Διαφορετικές τιμολογιακές πολιτικές για οδοντιάτρους (χονδρική) και για ιδιώτες (λιανική).</li>
  <li><strong>Διασύνδεση με ERP & Αποθήκη:</strong> Πλήρης αυτοματοποίηση των αποθεμάτων και των παραγγελιών.</li>
  <li><strong>Αυτόματοι Υπολογισμοί ΦΠΑ & Μεταφορικών:</strong> Σύμφωνα με τις νομικές απαιτήσεις των ιατρικών ειδών.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να συζητήσουμε τις ανάγκες σας.</p>`,
      buttonText: "Δείτε τις Υπηρεσίες μας",
      buttonLink: "https://www.sgk.gr/eshop-offer"
    },
    food_service: {
      subject: "Online Eshop Παραγγελιών & Takeaway για την [BUSINESS_NAME] [IN_CITY]",
      body: `<h2>Δεχτείτε online παραγγελίες από το δικό σας site! 🍕🛍️</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με το <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Θέλουμε να σας βοηθήσουμε να αποκτήσετε το δικό σας eshop παραγγελιών (delivery/takeaway) ώστε να μην πληρώνετε τις υπέρογκες προμήθειες των 3rd party πλατφορμών.</p>
<p><strong>Χαρακτηριστικά του Eshop Παραγγελιών:</strong></p>
<ul>
  <li><strong>Real-time Λήψη Παραγγελιών:</strong> Με ειδικό tablet ή εκτυπωτή στην κουζίνα σας.</li>
  <li><strong>Υποστήριξη Ζωνών Delivery:</strong> Χαρτογράφηση και ορισμός ελάχιστης παραγγελίας ανά περιοχή.</li>
  <li><strong>Ασφαλείς Πληρωμές με Κάρτα & Apple Pay:</strong> Τα χρήματα πηγαίνουν απευθείας σε εσάς.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να ξεκινήσετε τις δικές σας online πωλήσεις.</p>`,
      buttonText: "Δείτε την Προσφορά",
      buttonLink: "https://www.sgk.gr/eshop-offer"
    },
    hotel: {
      subject: "Πρόταση: Eshop Κρατήσεων & Vouchers για την [BUSINESS_NAME] [IN_CITY]",
      body: `<h2>Πουλήστε Vouchers & Υπηρεσίες του Ξενοδοχείου σας Online! 🏨🛍️</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με το κατάλυμά σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Σας προτείνουμε τη δημιουργία ενός eshop για την online πώληση Gift Vouchers, διαμονών, υπηρεσιών spa ή δραστηριοτήτων, αυξάνοντας τα έσοδα της επιχείρησής σας εκτός της Booking.</p>
<p><strong>Τι μπορείτε να πουλήσετε online:</strong></p>
<ul>
  <li><strong>Gift Cards & Vouchers:</strong> Οι πελάτες αγοράζουν δωροκάρτες για διαμονή ή γεύματα στο ξενοδοχείο σας.</li>
  <li><strong>Add-ons & Εμπειρίες:</strong> Κρατήσεις για massage, ξεναγήσεις, ενοικίαση σκαφών ή μεταφορές από/προς αεροδρόμιο.</li>
  <li><strong>Premium Προϊόντα:</strong> Πώληση τοπικών προϊόντων, amenities ή ειδών που χρησιμοποιείτε στο ξενοδοχείο σας.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να συζητήσουμε τις ιδέες σας.</p>`,
      buttonText: "Δείτε τις Υπηρεσίες μας",
      buttonLink: "https://www.sgk.gr/eshop-offer"
    },
    rent_a_car: {
      subject: "Online Eshop & Κρατήσεις Στόλου για την [BUSINESS_NAME] [IN_CITY]",
      body: `<h2>Δεχτείτε online εξοφλήσεις για τις ενοικιάσεις σας! 🚗🛍️</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με την επιχείρησή σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Σχεδιαζουμε eshops ειδικά για Rent a Car, επιτρέποντας στους πελάτες σας να ολοκληρώσουν την κράτηση και να πληρώσουν προκαταβολή ή το πλήρες ποσό της ενοικίασης online.</p>
<p><strong>Τι περιλαμβάνει η λύση:</strong></p>
<ul>
  <li><strong>Ασφαλείς Online Πληρωμές:</strong> Διασύνδεση με Viva Wallet, Stripe ή Ελληνικές Τράπεζες.</li>
  <li><strong>Εγγυήσεις & Δέσμευση Ποσού (Pre-authorization):</strong> Δυνατότητα δέσμευσης εγγύησης στην κάρτα του πελάτη online.</li>
  <li><strong>Διαχείριση Συμβολαίων:</strong> Αυτόματη αποστολή PDF επιβεβαίωσης κράτησης και όρων ενοικίασης.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να ξεκινήσουμε.</p>`,
      buttonText: "Δείτε την Προσφορά",
      buttonLink: "https://www.sgk.gr/eshop-offer"
    }
  },
  ai_agents: {
    generic: {
      subject: "Αυτοματοποίηση Λειτουργιών με Τεχνητή Νοημοσύνη (AI Agents) για την [BUSINESS_NAME] [IN_CITY]",
      body: `<h2>Βάλτε την Τεχνητή Νοημοσύνη να δουλέψει για εσάς! 🤖</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με την επιχείρησή σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Σχεδιάζουμε και ενσωματώνουμε <strong>AI Agents και Intelligent Chatbots</strong> που αναλαμβάνουν να αυτοματοποιήσουν καθημερινές εργασίες της επιχείρησής σας, λειτουργώντας 24/7 χωρίς διακοπή.</p>
<p><strong>Τι μπορεί να κάνει ένας AI Agent για εσάς:</strong></p>
<ul>
  <li><strong>24/7 Εξυπηρέτηση Πελατών:</strong> Άμεση απάντηση σε απορίες πελατών σε WhatsApp, Messenger, Instagram και στο website σας.</li>
  <li><strong>Αυτόματη Καταχώρηση Leads:</strong> Συλλογή στοιχείων ενδιαφερομένων και αυτόματη εισαγωγή στο CRM/ERP σας.</li>
  <li><strong>Κλείσιμο Ραντεβού & Κρατήσεων:</strong> Συνεννόηση με τον πελάτη και αυτόματη καταχώρηση στο ημερολόγιο.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να δούμε πώς το AI μπορεί να μειώσει τα λειτουργικά σας έξοδα!</p>`,
      buttonText: "Δείτε AI Λύσεις",
      buttonLink: "https://www.sgk.gr/ai-agents"
    },
    dentist: {
      subject: "🤖 AI Agent για το Οδοντιατρείο [BUSINESS_NAME]: Αυτόματο Κλείσιμο Ραντεβού 24/7",
      body: `<h2>Αυτοματοποιήστε τα ραντεβού του οδοντιατρείου σας με Τεχνητή Νοημοσύνη! 🦷🤖</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με το οδοντιατρείο σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Θέλουμε να σας προτείνουμε την ενσωμάτωση ενός <strong>AI Agent (Τεχνητής Νοημοσύνης)</strong> ο οποίος αναλαμβάνει να απαντά στους ασθενείς σας 24/7 και να κλείνει αυτόματα ραντεβού.</p>
<p><strong>Πώς βοηθάει το οδοντιατρείο σας:</strong></p>
<ul>
  <li><strong>Αυτόματο Κλείσιμο Ραντεβού:</strong> Ο AI Agent συνδέεται με το Google Calendar ή το ιατρικό σας λογισμικό και κλείνει ραντεβού μέσω WhatsApp, Viber ή Instagram.</li>
  <li><strong>Υπενθυμίσεις Ασθενών:</strong> Αυτόματη αποστολή μηνυμάτων υπενθύμισης για την αποφυγή ακυρώσεων.</li>
  <li><strong>Απαντήσεις σε Συχνές Ερωτήσεις:</strong> Πληροφορίες για το ωράριο, την τοποθεσία, τις ασφάλειες που δέχεστε κλπ.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να δούμε ένα live demo του AI Agent!</p>`,
      buttonText: "Δείτε AI Λύσεις",
      buttonLink: "https://www.sgk.gr/ai-agents"
    },
    food_service: {
      subject: "🤖 AI Agent Λήψης Παραγγελιών & Κρατήσεων για το [BUSINESS_NAME] [IN_CITY]",
      body: `<h2>Αυτοματοποιήστε τις παραγγελίες και τις κρατήσεις σας στα Social Media! 🍕🤖</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με το <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Προσφέρουμε μια πρωτοποριακή λύση: <strong>AI Agents</strong> που απαντούν αυτόματα στους πελάτες σας στο Instagram, το Messenger και το WhatsApp, λαμβάνοντας παραγγελίες delivery ή κάνοντας κρατήσεις τραπεζιών.</p>
<p><strong>Τι κάνει ο AI Agent για την εστίαση:</strong></p>
<ul>
  <li><strong>Λήψη Παραγγελιών:</strong> Συνομιλεί με τον πελάτη, του προτείνει πιάτα από το μενού και καταχωρεί την παραγγελία στο σύστημά σας.</li>
  <li><strong>Κρατήσεις Τραπεζιών:</strong> Ελέγχει τη διαθεσιμότητα και επιβεβαιώνει την κράτηση άμεσα, στέλνοντας SMS επιβεβαίωσης.</li>
  <li><strong>24/7 Λειτουργία:</strong> Απαντά σε λιγότερο από 2 δευτερόλεπτα, εξασφαλίζοντας ότι δεν θα χάσετε ποτέ κανέναν πελάτη.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να σας δείξουμε πώς λειτουργεί!</p>`,
      buttonText: "Δείτε AI Λύσεις",
      buttonLink: "https://www.sgk.gr/ai-agents"
    },
    hotel: {
      subject: "🤖 AI Concierge για την [BUSINESS_NAME]: Εξυπηρέτηση Πελατών 24/7",
      body: `<h2>Αναβαθμίστε την εμπειρία των επισκεπτών σας με έναν AI Virtual Assistant! 🏨🤖</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με το κατάλυμά σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Θέλουμε να σας προτείνουμε την υλοποίηση ενός <strong>AI Agent (Virtual Concierge)</strong>, ο οποίος θα εξυπηρετεί τους πελάτες σας 24/7 στο WhatsApp, στο Viber ή στην ιστοσελίδα σας.</p>
<p><strong>Τι προσφέρει ο AI Concierge στους πελάτες σας:</strong></p>
<ul>
  <li><strong>Άμεσες Απαντήσεις:</strong> Πληροφορίες για check-in/out, κωδικούς WiFi, πρωινό, στάθμευση και πολιτικές του ξενοδοχείου.</li>
  <li><strong>Κρατήσεις Υπηρεσιών:</strong> Οι επισκέπτες μπορούν να παραγγείλουν room service, να κλείσουν spa ή μεταφορά, μιλώντας απλά με το AI.</li>
  <li><strong>Πολύγλωσση Υποστήριξη:</strong> Απαντά αυτόματα σε πάνω από 30 γλώσσες (Αγγλικά, Γερμανικά, Γαλλικά κλπ.) ανάλογα με τη γλώσσα του πελάτη.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να συζητήσουμε αυτή τη λύση.</p>`,
      buttonText: "Δείτε AI Λύσεις",
      buttonLink: "https://www.sgk.gr/ai-agents"
    },
    rent_a_car: {
      subject: "🤖 AI Agent για Rent a Car: Αυτόματες Απαντήσεις & Κρατήσεις 24/7",
      body: `<h2>Αυξήστε τις κρατήσεις σας με AI Agent στο WhatsApp & Instagram! 🚗🤖</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με την επιχείρησή σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Σας προτείνουμε την εγκατάσταση ενός <strong>AI Agent</strong> ο οποίος αναλαμβάνει να απαντά αυτόματα σε υποψήφιους πελάτες που ψάχνουν να νοικιάσουν αυτοκίνητο, ελέγχοντας τη διαθεσιμότητα real-time.</p>
<p><strong>Τι προσφέρει ο AI Agent στο Rent a Car:</strong></p>
<ul>
  <li><strong>Έλεγχος Διαθεσιμότητας & Τιμών:</strong> Ο AI Agent συνδέεται με το Fleet Manager σας και δίνει τιμές για τις ημερομηνίες που ζητά ο πελάτης.</li>
  <li><strong>Συλλογή Στοιχείων (Leads):</strong> Συλλέγει άδειες οδήγησης, στοιχεία επικοινωνίας και τα καταχωρεί αυτόματα στο σύστημά σας.</li>
  <li><strong>24/7 Εξυπηρέτηση σε Πολλές Γλώσσες:</strong> Απαντά άμεσα σε τουρίστες στη γλώσσα τους, αυξάνοντας τις πιθανότητες κράτησης.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να δείτε ένα demo!</p>`,
      buttonText: "Δείτε AI Λύσεις",
      buttonLink: "https://www.sgk.gr/ai-agents"
    }
  },
  mobile_app: {
    generic: {
      subject: "Custom Mobile App (Android/iOS) για την [BUSINESS_NAME] [IN_CITY]",
      body: `<h2>Αποκτήστε τη δική σας εφαρμογή στα Google Play & App Store! 📱</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με την επιχείρησή σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Σχεδιάζουμε και αναπτύσσουμε <strong>custom εφαρμογές για κινητά (Android & iOS)</strong> που βοηθούν τις επιχειρήσεις να συνδεθούν απευθείας με τους πελάτες τους και να χτίσουν πιστότητα (loyalty).</p>
<p><strong>Τι περιλαμβάνει η λύση Mobile App:</strong></p>
<ul>
  <li><strong>Push Notifications:</strong> Στείλτε δωρεάν ενημερώσεις, προσφορές και νέα απευθείας στις οθόνες των πελατών σας.</li>
  <li><strong>Σύστημα Loyalty & Πόντων:</strong> Επιβραβεύστε τους πελάτες σας για τις αγορές τους μέσα από την εφαρμογή.</li>
  <li><strong>Custom Σχεδίαση & Λειτουργικότητα:</strong> Φτιαγμένη ακριβώς για τις ανάγκες της δικής σας επιχείρησης.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να σχεδιάσουμε τη δική σας mobile εφαρμογή!</p>`,
      buttonText: "Δείτε τις Υπηρεσίες μας",
      buttonLink: "https://www.sgk.gr/web-development"
    },
    dentist: {
      subject: "Custom Mobile App για τους Ασθενείς του Οδοντιατρείου [BUSINESS_NAME]",
      body: `<h2>Μια σύγχρονη εφαρμογή για τους ασθενείς του οδοντιατρείου σας! 🦷📱</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με το οδοντιατρείο σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Σας προτείνουμε τη δημιουργία μιας custom εφαρμογής για κινητά (Android/iOS) αποκλειστικά για τους ασθενείς του ιατρείου σας.</p>
<p><strong>Τι θα προσφέρει η εφαρμογή στους ασθενείς σας:</strong></p>
<ul>
  <li><strong>Ιστορικό & Ακτινογραφίες:</strong> Οι ασθενείς έχουν πρόσβαση στο ιατρικό τους ιστορικό, οδηγίες θεραπείας και ακτινογραφίες.</li>
  <li><strong>Υπενθυμίσεις & Push Notifications:</strong> Αυτόματες ειδοποιήσεις στο κινητό για το επόμενο ραντεβού ή τον καθαρισμό τους.</li>
  <li><strong>Άμεση Επικοινωνία & Ραντεβού:</strong> Εύκολες κρατήσεις ραντεβού και άμεση επικοινωνία με το ιατρείο σας.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να συζητήσουμε αυτή την καινοτόμο λύση.</p>`,
      buttonText: "Δείτε τις Υπηρεσίες μας",
      buttonLink: "https://www.sgk.gr/web-development"
    },
    food_service: {
      subject: "Δικό σας App Delivery (χωρίς προμήθειες) για το [BUSINESS_NAME] [IN_CITY]",
      body: `<h2>Απαλλαγείτε από τις προμήθειες των E-food, Wolt και Box! 🍕📱</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με το <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Σχεδιάζουμε <strong>αποκλειστικές (custom) εφαρμογές online παραγγελιών και delivery (Android & iOS)</strong>, βοηθώντας καφετέριες και εστιατόρια να αποκτήσουν το δικό τους κανάλι πωλήσεων χωρίς μεσάζοντες.</p>
<p><strong>Πλεονεκτήματα του δικού σας App Delivery:</strong></p>
<ul>
  <li><strong>0% Προμήθειες:</strong> Όλα τα έσοδα από τις παραγγελίες παραμένουν στην επιχείρησή σας.</li>
  <li><strong>Direct Marketing & Push Notifications:</strong> Στείλτε δωρεάν προσφορές (π.χ. «1+1 Δώρο μόνο για σήμερα!») απευθείας στα κινητά των πελατών σας.</li>
  <li><strong>Σύστημα Loyalty:</strong> Οι πελάτες μαζεύουν πόντους και κερδίζουν εκπτώσεις, αυξάνοντας τις επαναλαμβανόμενες παραγγελίες.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να σχεδιάσουμε τη δική σας εφαρμογή!</p>`,
      buttonText: "Δείτε το Demo Delivery",
      buttonLink: "https://www.sgk.gr/eshop-offer"
    },
    hotel: {
      subject: "Custom Mobile App Concierge & Room Service για την [BUSINESS_NAME]",
      body: `<h2>Αναβαθμίστε τη διαμονή των πελατών σας με ένα Custom Mobile App! 🏨📱</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με το κατάλυμά σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Σας προτείνουμε τη δημιουργία μιας mobile εφαρμογής (Android & iOS) με το brand σας, η οποία θα λειτουργεί ως ο απόλυτος ψηφιακός οδηγός για τους επισκέπτες σας κατά τη διαμονή τους.</p>
<p><strong>Λειτουργίες της Εφαρμογής:</strong></p>
<ul>
  <li><strong>Digital Key (Ψηφιακό Κλειδί):</strong> Οι πελάτες ανοίγουν την πόρτα του δωματίου τους απευθείας με το κινητό τους.</li>
  <li><strong>Mobile Room Service & Παραγγελίες:</strong> Παραγγελία φαγητού, ποτών ή πετσετών απευθείας στο δωμάτιο μέσω του app.</li>
  <li><strong>Τοπικός Οδηγός & Concierge:</strong> Προτάσεις για παραλίες, εστιατόρια, αξιοθέατα και δυνατότητα κράτησης εκδρομών.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να συζητήσουμε τις προοπτικές.</p>`,
      buttonText: "Δείτε Case Studies",
      buttonLink: "https://www.sgk.gr/case-study/lemon-tree-paros"
    },
    rent_a_car: {
      subject: "Custom Mobile App για Rent a Car: Ψηφιακά Συμβόλαια & Keyless Delivery",
      body: `<h2>Ψηφιοποιήστε την εμπειρία ενοικίασης οχημάτων με δικό σας App! 🚗📱</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με την επιχείρησή σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Σας προτείνουμε την ανάπτυξη μιας custom mobile εφαρμογής για την Rent a Car επιχείρησή σας, απλοποιώντας τις διαδικασίες παραλαβής και παράδοσης των οχημάτων.</p>
<p><strong>Τι προσφέρει η εφαρμογή:</strong></p>
<ul>
  <li><strong>Keyless Entry:</strong> Οι πελάτες ξεκλειδώνουν το ενοικιαζόμενο όχημα μέσω Bluetooth από την εφαρμογή.</li>
  <li><strong>Ψηφιακό Συμβόλαιο & Check-in:</strong> Ανέβασμα διπλώματος, υπογραφή όρων και έλεγχος ζημιών με φωτογραφίες μέσω του app.</li>
  <li><strong>Push Notifications & Υπενθυμίσεις:</strong> Ειδοποιήσεις για την ώρα επιστροφής, παράταση ενοικίασης ή προσφορές για επόμενο ταξίδι.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να συζητήσουμε τη λύση.</p>`,
      buttonText: "Δείτε την Προσφορά",
      buttonLink: "https://www.sgk.gr/eshop-offer"
    }
  },
  erp_crm: {
    generic: {
      subject: "Custom Διαχειριστικά Συστήματα (ERP/CRM) για την [BUSINESS_NAME] [IN_CITY]",
      body: `<h2>Ψηφιοποιήστε και αυτοματοποιήστε τις λειτουργίες της επιχείρησής σας! 📊</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με την επιχείρησή σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Σχεδιάζουμε <strong>custom διαχειριστικά συστήματα (ERP, CRM, WMS)</strong> κομμένα και ραμμένα αποκλειστικά στις δικές σας ανάγκες, απαλλάσσοντάς σας από πολύπλοκα excel και χειροκίνητες διαδικασίες.</p>
<p><strong>Τι μπορούμε να αυτοματοποιήσουμε για εσάς:</strong></p>
<ul>
  <li><strong>Διαχείριση Πελατολογίου (CRM):</strong> Παρακολούθηση προσφορών, leads και ιστορικού επικοινωνίας.</li>
  <li><strong>Ηλεκτρονική Τιμολόγηση & myDATA:</strong> Αυτόματη έκδοση παραστατικών και διασύνδεση με την ΑΑΔΕ.</li>
  <li><strong>Έλεγχος Αποθήκης & Παραγγελιών:</strong> Real-time ενημέρωση αποθεμάτων και διαχείριση προμηθευτών.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να αναλύσουμε τις ανάγκες σας και να σχεδιάσουμε μια δωρεάν πρόταση υλοποίησης.</p>`,
      buttonText: "Δείτε τις Υπηρεσίες μας",
      buttonLink: "https://www.sgk.gr/web-development"
    },
    dentist: {
      subject: "Custom CRM & Λογισμικό Διαχείρισης Ασθενών για το Οδοντιατρείο [BUSINESS_NAME]",
      body: `<h2>Οργανώστε το οδοντιατρείο σας με ένα custom σύστημα διαχείρισης! 🦷📊</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με το οδοντιατρείο σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Σχεδιάζουμε <strong>custom ιατρικά CRM/ERP</strong> προσαρμοσμένα ακριβώς στον τρόπο που λειτουργεί το δικό σας ιατρείο, προσφέροντας ασφαλή διαχείριση των δεδομένων των ασθενών σας.</p>
<p><strong>Δυνατότητες του Custom CRM:</strong></p>
<ul>
  <li><strong>Ηλεκτρονική Καρτέλα Ασθενούς:</strong> Ιστορικό θεραπειών, οδοντόγραμμα, φωτογραφίες και ακτινογραφίες συγκεντρωμένα σε ένα σημείο.</li>
  <li><strong>Διαχείριση Ραντεβού & SMS Υπενθυμίσεις:</strong> Αυτόματο κλείσιμο και αποστολή υπενθυμίσεων για μείωση των no-shows.</li>
  <li><strong>Ηλεκτρονική Τιμολόγηση & myDATA:</strong> Άμεση έκδοση αποδείξεων παροχής υπηρεσιών και σύνδεση με την ΑΑΔΕ.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να σχεδιάσουμε μια δωρεάν πρόταση υλοποίησης.</p>`,
      buttonText: "Δείτε τις Υπηρεσίες μας",
      buttonLink: "https://www.sgk.gr/web-development"
    },
    food_service: {
      subject: "Custom ERP & Σύστημα Διαχείρισης Αποθήκης (WMS) για το [BUSINESS_NAME] [IN_CITY]",
      body: `<h2>Ελέγξτε το food cost και την αποθήκη σας σε πραγματικό χρόνο! 🍕📊</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με το <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Σχεδιάζουμε custom διαχειριστικά συστήματα (ERP/CRM) ειδικά για επιχειρήσεις εστίασης, επιτρέποντάς σας να ελέγχετε τις πρώτες ύλες, το κόστος των πιάτων και τους προμηθευτές σας.</p>
<p><strong>Τι σας προσφέρει το Custom ERP:</strong></p>
<ul>
  <li><strong>Υπολογισμός Food Cost:</strong> Αυτόματη κοστολόγηση συνταγών βάσει των τρεχουσών τιμών των προμηθευτών.</li>
  <li><strong>Διαχείριση Αποθεμάτων & Φύρας:</strong> Real-time έλεγχος αποθήκης και ειδοποιήσεις για ελλείψεις.</li>
  <li><strong>Στατιστικά Πωλήσεων:</strong> Αναλυτικά γραφήματα για τα πιο κερδοφόρα πιάτα και τις ώρες αιχμής.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να αναλύσουμε τις ανάγκες σας.</p>`,
      buttonText: "Δείτε τις Υπηρεσίες μας",
      buttonLink: "https://www.sgk.gr/web-development"
    },
    hotel: {
      subject: "Custom PMS & Σύστημα Διαχείρισης Καταλύματος για την [BUSINESS_NAME]",
      body: `<h2>Ψηφιοποιήστε τη διαχείριση του ξενοδοχείου σας με custom PMS/CRM! 🏨📊</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με το κατάλυμά σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Σχεδιάζουμε <strong>custom Property Management Systems (PMS)</strong> και CRM που προσαρμόζονται απόλυτα στις δικές σας ανάγκες, προσφέροντας πλήρη έλεγχο των δωματίων και των εργασιών.</p>
<p><strong>Τι περιλαμβάνει η custom λύση:</strong></p>
<ul>
  <li><strong>Διαδραστικό Πλάνο Κρατήσεων:</strong> Εύχρηστο ημερολόγιο για check-in/out, μετακινήσεις δωματίων και διαθεσιμότητα.</li>
  <li><strong>Διαχείριση Προσωπικού & Καθαριότητας:</strong> Ανάθεση εργασιών καθαρισμού ή συντήρησης και real-time ενημέρωση κατάστασης δωματίων.</li>
  <li><strong>CRM Επισκεπτών:</strong> Ιστορικό προτιμήσεων πελατών, αυτόματες καμπάνιες email πριν την άφιξη και μετά την αναχώρηση.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να συζητήσουμε μια δωρεάν πρόταση.</p>`,
      buttonText: "Δείτε τις Υπηρεσίες μας",
      buttonLink: "https://www.sgk.gr/web-development"
    },
    rent_a_car: {
      subject: "Custom ERP & Σύστημα Fleet Management για την [BUSINESS_NAME] [IN_CITY]",
      body: `<h2>Πλήρης έλεγχος του στόλου και των συμβολαίων σας online! 🚗📊</h2>
<p>Γεια σας,</p>
<p>Επικοινωνούμε μαζί σας από την <strong>SGK Software Development</strong> σχετικά με την επιχείρησή σας, <strong>[BUSINESS_NAME]</strong> [IN_CITY].</p>
<p>Σχεδιάζουμε custom ERP/CRM συστήματα ειδικά για Rent a Car, προσφέροντας ολοκληρωμένη παρακολούθηση του στόλου, των κρατήσεων και των οικονομικών στοιχείων.</p>
<p><strong>Λειτουργίες του Custom ERP:</strong></p>
<ul>
  <li><strong>Fleet Management:</strong> Παρακολούθηση KTEO, service, ασφαλειών και τελών κυκλοφορίας για κάθε όχημα με αυτόματες ειδοποιήσεις.</li>
  <li><strong>Συμβόλαια & Ηλεκτρονικές Υπογραφές:</strong> Αυτόματη δημιουργία μισθωτηρίων συμβολαίων και ψηφιακή υπογραφή από το tablet/κινητό.</li>
  <li><strong>Σύνδεση με myDATA:</strong> Αυτόματη έκδοση τιμολογίων/αποδείξεων και διαβίβαση στην ΑΑΔΕ.</li>
</ul>
<p>Απαντήστε σε αυτό το email ή καλέστε μας στο <strong>6999524389</strong> για να αναλύσουμε τις ανάγκες σας.</p>`,
      buttonText: "Δείτε τις Υπηρεσίες μας",
      buttonLink: "https://www.sgk.gr/web-development"
    }
  }
};

const PROSPECT_TEMPLATES = [];


export function ScraperTab() {
  const [selectedService, setSelectedService] = useState<string>("website");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("generic");
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
    const industry = detectIndustry(prospect.industry);
    setSelectedService("website");
    setSelectedIndustry(industry);
    
    const template = EMAIL_TEMPLATES["website"]?.[industry] || EMAIL_TEMPLATES["website"]?.["generic"];
    if (template) {
      const { subject, body } = applyTemplateVariables(template.body, template.subject, prospect);
      setEmailSubject(subject);
      setEmailBody(body);
      setButtonText(template.buttonText || "");
      setButtonLink(template.buttonLink || "");
    }
    setIsModalOpen(true);
  };

  // Αλλαγή template στο modal (Service / Industry)
  const handleServiceOrIndustryChange = (service: string, industry: string) => {
    if (!selectedProspect) return;
    setSelectedService(service);
    setSelectedIndustry(industry);
    const template = EMAIL_TEMPLATES[service]?.[industry] || EMAIL_TEMPLATES[service]?.["generic"];
    if (template) {
      const { subject, body } = applyTemplateVariables(template.body, template.subject, selectedProspect);
      setEmailSubject(subject);
      setEmailBody(body);
      setButtonText(template.buttonText || "");
      setButtonLink(template.buttonLink || "");
    }
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
          customHtml: finalBody,
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
      const { data: existingLead, error: selectError } = await supabase
        .from("sgk_mails")
        .select("id")
        .eq("email", selectedProspect.email)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existingLead) {
        // Ενημέρωση υπάρχοντος lead
        const { error: updateError } = await supabase
          .from("sgk_mails")
          .update({
            first_name: selectedProspect.business_name,
            phone: selectedProspect.phone,
            marketing_consent: true,
            unsubscribed: false,
            email_sequence_step: 1,
            last_email_sent_at: new Date().toISOString()
          })
          .eq("id", existingLead.id);

        if (updateError) throw updateError;
      } else {
        // Εισαγωγή νέου lead
        const { error: insertError } = await supabase
          .from("sgk_mails")
          .insert([
            {
              email: selectedProspect.email,
              first_name: selectedProspect.business_name,
              last_name: "",
              phone: selectedProspect.phone,
              marketing_consent: true,
              unsubscribed: false,
              unsubscribe_token: unsubscribeToken,
              email_sequence_step: 1,
              last_email_sent_at: new Date().toISOString()
            }
          ]);

        if (insertError) throw insertError;
      }

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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Υπηρεσία (Service)</label>
                      <select 
                        value={selectedService}
                        onChange={(e) => handleServiceOrIndustryChange(e.target.value, selectedIndustry)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-vivid-primary text-gray-900 focus:ring-1 focus:ring-vivid-primary text-sm bg-white cursor-pointer"
                      >
                        <option value="website">Ιστοσελίδα (Website)</option>
                        <option value="eshop">Ηλ. Κατάστημα (Eshop)</option>
                        <option value="ai_agents">AI Agents & Chatbots</option>
                        <option value="mobile_app">Εφαρμογή (Mobile App)</option>
                        <option value="erp_crm">Διαχειριστικό (ERP/CRM)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Κλάδος (Industry)</label>
                      <select 
                        value={selectedIndustry}
                        onChange={(e) => handleServiceOrIndustryChange(selectedService, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-vivid-primary text-gray-900 focus:ring-1 focus:ring-vivid-primary text-sm bg-white cursor-pointer"
                      >
                        <option value="generic">Γενικό (Generic)</option>
                        <option value="dentist">Οδοντιατρείο</option>
                        <option value="food_service">Εστίαση / Καφέ</option>
                        <option value="hotel">Ξενοδοχείο / Κατάλυμα</option>
                        <option value="rent_a_car">Ενοικίαση Αυτοκινήτων</option>
                      </select>
                    </div>
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
