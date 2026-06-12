import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

const serviceNames: Record<string, string> = {
  website_offer: "ιστοσελίδα",
  eshop_offer: "e-shop",
  ai_agents_offer: "AI Agent",
  mobile_app_offer: "εφαρμογή για κινητά",
  erp_crm_offer: "σύστημα ERP/CRM",
};

const industryNames: Record<string, string> = {
  generic: "επιχείρησή",
  dentist: "οδοντιατρείο",
  food_service: "εστιατόριο / καφέ",
  hotel: "ξενοδοχείο / κατάλυμα",
  rent_a_car: "εταιρεία Rent a Car",
  hair_salon: "κομμωτήριο / κέντρο αισθητικής",
};

function getStep2Data(type: string, industry: string) {
  const serviceText = serviceNames[type] || "ιστοσελίδα";
  const indText = industryNames[industry] || "επιχείρησή";
  
  let subject = `3 λόγοι που το ${serviceText} σας χάνει πελάτες`;
  let title = "3 Λόγοι που χάνεις πελάτες";
  let icon = "⚠️";
  let points: { title: string; desc: string }[] = [];
  
  if (type === "website_offer") {
    subject = `3 λόγοι που η επιχείρησή σας χάνει πελάτες χωρίς σύγχρονη ιστοσελίδα`;
    if (industry === "dentist") {
      subject = "3 λόγοι που το οδοντιατρείο σας χάνει ασθενείς online 🦷";
      title = "3 Λόγοι που το οδοντιατρείο σας χάνει ασθενείς";
    } else if (industry === "food_service") {
      subject = "3 λόγοι που το εστιατόριό σας χάνει κρατήσεις/παραγγελίες 🍽️";
      title = "3 Λόγοι που το εστιατόριό σας χάνει πελάτες";
    } else if (industry === "hotel") {
      subject = "3 λόγοι που το κατάλυμά σας χάνει απευθείας κρατήσεις 🏨";
      title = "3 Λόγοι που το κατάλυμά σας χάνει κρατήσεις";
    } else if (industry === "rent_a_car") {
      subject = "3 λόγοι που η Rent a Car σας χάνει κρατήσεις online 🚗";
      title = "3 Λόγοι που η Rent a Car σας χάνει πελάτες";
    } else if (industry === "hair_salon") {
      subject = "3 λόγοι που το κομμωτήριό σας χάνει ραντεβού online 💇‍♀️";
      title = "3 Λόγοι που το κομμωτήριό σας χάνει ραντεβού";
    }
    
    const indTerm = industry === "dentist" ? "οδοντίατρο" : 
                    industry === "food_service" ? "εστιατόριο" :
                    industry === "hotel" ? "ξενοδοχείο" :
                    industry === "rent_a_car" ? "ενοικίαση αυτοκινήτων" :
                    industry === "hair_salon" ? "κομμωτήριο" : "επιχείρηση";
                    
    points = [
      {
        title: "1. Απουσία από τα αποτελέσματα της Google (SEO)",
        desc: `Όταν κάποιος ψάχνει για ${indTerm} στην περιοχή σας, βρίσκει μόνο τους ανταγωνιστές σας. Με σωστή δομή και Local SEO, θα εμφανίζεστε εσείς πρώτοι.`
      },
      {
        title: "2. Κακή ή ανύπαρκτη παρουσία στα κινητά (Mobile)",
        desc: "Πάνω από το 80% των χρηστών ψάχνουν από το κινητό. Χωρίς μια γρήγορη, mobile-first ιστοσελίδα, οι υποψήφιοι πελάτες αποχωρούν αμέσως."
      },
      {
        title: "3. Έλλειψη ψηφιακής αξιοπιστίας",
        desc: "Οι πελάτες σήμερα ερευνούν online πριν επιλέξουν. Μια σύγχρονη ιστοσελίδα δείχνει επαγγελματισμό, κύρος και εμπνέει εμπιστοσύνη από τα πρώτα δευτερόλεπτα."
      }
    ];
  } else if (type === "eshop_offer") {
    subject = "3 λόγοι που το eshop σου χάνει χρήματα";
    if (industry === "dentist") {
      subject = "3 λόγοι που το eshop οδοντιατρικών σας χάνει πωλήσεις 🦷";
      title = "3 Λόγοι που το eshop οδοντιατρικών σας χάνει πωλήσεις";
    } else if (industry === "food_service") {
      subject = "3 λόγοι που το eshop παραγγελιών σας χάνει πελάτες 🍕";
      title = "3 Λόγοι που το eshop παραγγελιών σας χάνει πελάτες";
    } else if (industry === "hotel") {
      subject = "3 λόγοι που το eshop κρατήσεων σας χάνει πωλήσεις 🏨";
      title = "3 Λόγοι που το eshop κρατήσεων σας χάνει πωλήσεις";
    } else if (industry === "rent_a_car") {
      subject = "3 λόγοι που το eshop κρατήσεων οχημάτων σας χάνει πελάτες 🚗";
      title = "3 Λόγοι που το eshop κρατήσεων σας χάνει πελάτες";
    } else if (industry === "hair_salon") {
      subject = "3 λόγοι που το eshop προϊόντων ομορφιάς σας χάνει πωλήσεις 💈";
      title = "3 Λόγοι που το eshop προϊόντων ομορφιάς σας χάνει πωλήσεις";
    }
    
    points = [
      {
        title: "1. Αργή ταχύτητα φόρτωσης (Το Νο.1 Πρόβλημα)",
        desc: "Αν το eshop σας κάνει πάνω από 3 δευτερόλεπτα να φορτώσει, χάνετε το 53% των πελατών σας. Στην SGK εγγυόμαστε αστραπιαίες ταχύτητες με VPS servers."
      },
      {
        title: "2. Κακή εμπειρία στο Κινητό (Mobile)",
        desc: "Πάνω από το 70% των αγορών γίνονται από κινητό. Τα eshops που φτιάχνουμε έχουν σχεδιαστεί πρωτίστως για κινητά τηλέφωνα (Mobile First)."
      },
      {
        title: "3. Χαμηλή ορατότητα στην Google (SEO)",
        desc: "Αν το eshop σας δεν εμφανίζεται στις πρώτες θέσεις της Google, χάνετε καθημερινά έτοιμους αγοραστές. Η προσφορά μας περιλαμβάνει πλήρη βελτιστοποίηση SEO."
      }
    ];
  } else if (type === "ai_agents_offer") {
    icon = "🤖";
    subject = "3 τρόποι που η επιχείρησή σας χάνει χρήματα χωρίς AI αυτοματοποίηση 🤖";
    title = "3 Τρόποι που χάνετε πελάτες λόγω έλλειψης άμεσης απάντησης";
    
    if (industry === "dentist") {
      subject = "3 τρόποι που το οδοντιατρείο σας χάνει χρόνο & ασθενείς χωρίς AI 🤖🦷";
      title = "3 Τρόποι που το οδοντιατρείο σας χάνει ασθενείς";
    } else if (industry === "food_service") {
      subject = "3 τρόποι που το εστιατόριό σας χάνει παραγγελίες στα Social Media χωρίς AI 🤖🍕";
      title = "3 Τρόποι που το εστιατόριό σας χάνει παραγγελίες";
    } else if (industry === "hotel") {
      subject = "3 τρόποι που το ξενοδοχείο σας χάνει κρατήσεις/ερωτήσεις χωρίς AI Concierge 🤖🏨";
      title = "3 Τρόποι που το ξενοδοχείο σας χάνει κρατήσεις 24/7";
    } else if (industry === "rent_a_car") {
      subject = "3 τρόποι που η Rent a Car σας χάνει κρατήσεις 24/7 χωρίς AI Agent 🤖🚗";
      title = "3 Τρόποι που η Rent a Car σας χάνει κρατήσεις";
    } else if (industry === "hair_salon") {
      subject = "3 τρόποι που το κομμωτήριό σας χάνει ραντεβού χωρίς AI Chatbot 🤖💈";
      title = "3 Τρόποι που το κομμωτήριό σας χάνει ραντεβού";
    }
    
    const indTerm = industry === "dentist" ? "ασθενείς" : 
                    industry === "food_service" ? "πελάτες" :
                    industry === "hotel" ? "επισκέπτες" :
                    industry === "rent_a_car" ? "ενοικιαστές" :
                    industry === "hair_salon" ? "πελάτες" : "ενδιαφερόμενους";

    points = [
      {
        title: "1. Καθυστέρηση στις απαντήσεις (Απώλεια Leads)",
        desc: `Οι ${indTerm} θέλουν άμεση απάντηση. Αν καθυστερήσετε 15 λεπτά στο Instagram, στο Facebook ή στο WhatsApp, έχουν ήδη πάει στον επόμενο.`
      },
      {
        title: "2. Χαμένος χρόνος σε επαναλαμβανόμενες ερωτήσεις",
        desc: "Αντί να εστιάζετε στη δουλειά σας, η ομάδα σας ξοδεύει ώρες καθημερινά απαντώντας για τιμές, διαθεσιμότητα, ωράρια και ραντεβού."
      },
      {
        title: "3. Καμία εξυπηρέτηση εκτός ωραρίου",
        desc: "Οι περισσότερες ερωτήσεις και κρατήσεις γίνονται το βράδυ ή τα Σαββατοκύριακα. Ο AI Agent απαντά σε 2 δευτερόλεπτα 24/7/365 και κλείνει κρατήσεις αυτόματα."
      }
    ];
  } else if (type === "mobile_app_offer") {
    icon = "📱";
    subject = "3 λόγοι που χρειάζεστε δική σας mobile εφαρμογή για να κρατήσετε τους πελάτες σας 📱";
    title = "3 Λόγοι που χρειάζεστε δική σας εφαρμογή (Android/iOS)";
    
    if (industry === "dentist") {
      subject = "3 λόγοι που το οδοντιατρείο σας χρειάζεται δικό του Mobile App 🦷📱";
      title = "3 Λόγοι που το οδοντιατρείο σας χρειάζεται δικό του App";
    } else if (industry === "food_service") {
      subject = "3 λόγοι που το εστιατόριό σας χρειάζεται δικό του App Delivery 🍕📱";
      title = "3 Λόγοι που το εστιατόριό σας χρειάζεται δικό του App";
    } else if (industry === "hotel") {
      subject = "3 λόγοι που το ξενοδοχείο σας χρειάζεται δικό του Mobile App Concierge 🏨📱";
      title = "3 Λόγοι που το ξενοδοχείο σας χρειάζεται δικό του App";
    } else if (industry === "rent_a_car") {
      subject = "3 λόγοι που η Rent a Car σας χρειάζεται δικό της Mobile App 🚗📱";
      title = "3 Λόγοι που η Rent a Car σας χρειάζεται δικό της App";
    } else if (industry === "hair_salon") {
      subject = "3 λόγοι που το κομμωτήριό σας χρειάζεται δικό του App 💇‍♀️📱";
      title = "3 Λόγοι που το κομμωτήριό σας χρειάζεται δικό του App";
    }
    
    points = [
      {
        title: "1. Υψηλό κόστος SMS & Newsletters",
        desc: "Με ένα mobile app, μπορείτε να στέλνετε απεριόριστα Push Notifications εντελώς δωρεάν, απευθείας στις οθόνες των πελατών σας για προσφορές ή υπενθυμίσεις."
      },
      {
        title: "2. Έλλειψη Loyalty (Πιστότητας)",
        desc: "Οι πελάτες σήμερα εύκολα στρέφονται στον ανταγωνισμό. Ένα σύστημα πόντων και loyalty μέσα στο δικό σας App τους δίνει κίνητρο να επιστρέφουν πάντα σε εσάς."
      },
      {
        title: "3. Ασύγκριτη ταχύτητα & User Experience",
        desc: "Η πλοήγηση σε μια εφαρμογή είναι 5 φορές ταχύτερη από ένα site, καθιστώντας τη διαδικασία κρατήσεων ή αγορών εξαιρετικά εύκολη για τον χρήστη."
      }
    ];
  } else if (type === "erp_crm_offer") {
    icon = "📊";
    subject = "3 καθημερινά λάθη στην οργάνωση που κοστίζουν χρόνο και χρήμα 📊";
    title = "3 Καθημερινά λάθη στην οργάνωση της επιχείρησής σας";
    
    if (industry === "dentist") {
      subject = "3 λάθη στη διαχείριση ασθενών του οδοντιατρείου σας που κοστίζουν χρόνο 🦷📊";
      title = "3 Λάθη στη διαχείριση ασθενών του οδοντιατρείου";
    } else if (industry === "food_service") {
      subject = "3 λάθη στη διαχείριση αποθήκης/food cost που κοστίζουν χρήμα 🍕📊";
      title = "3 Λάθη στη διαχείριση αποθήκης & κόστους";
    } else if (industry === "hotel") {
      subject = "3 προβλήματα στη διαχείριση του ξενοδοχείου σας που λύνονται με ένα custom PMS 🏨📊";
      title = "3 Προβλήματα στη διαχείριση του καταλύματός σας";
    } else if (industry === "rent_a_car") {
      subject = "3 λάθη στη διαχείριση στόλου/συμβολαίων της Rent a Car σας 🚗📊";
      title = "3 Λάθη στη διαχείριση στόλου & συμβολαίων";
    } else if (industry === "hair_salon") {
      subject = "3 προβλήματα στη διαχείριση ραντεβού & stylist schedules του κομμωτηρίου σας 💇‍♀️📊";
      title = "3 Προβλήματα στη διαχείριση του κομμωτηρίου σας";
    }
    
    const p1Desc = industry === "dentist" ? "Η χρήση χαρτιών ή απλών ημερολογίων οδηγεί σε διπλοκρατήσεις, καθυστερήσεις και απώλεια του ιατρικού ιστορικού των ασθενών σας." :
                   industry === "food_service" ? "Η μη καταγραφή των πρώτων υλών και της φύρας οδηγεί σε ανεξέλεγκτο food cost και απώλεια κέρδους καθημερινά." :
                   industry === "hotel" ? "Τα double bookings και η έλλειψη αυτόματου συγχρονισμού με τα κανάλια (Booking, Airbnb) κοστίζουν ακυρώσεις και κακές κριτικές." :
                   industry === "rent_a_car" ? "Η χειρόγραφη διαχείριση στόλου οδηγεί σε διπλοκρατήσεις οχημάτων και καθυστερήσεις στην παράδοση λόγω έλλειψης ελέγχου." :
                   industry === "hair_salon" ? "Οι διπλοκρατήσεις και οι μπερδεμένες βάρδιες των stylists προκαλούν καθυστερήσεις και δυσαρεστημένους πελάτες." :
                   "Η χρήση excel ή χαρτιών οδηγεί σε λάθη, διπλοκρατήσεις και απώλεια στοιχείων πελατών.";
                   
    points = [
      {
        title: "1. Χειροκίνητη καταγραφή & Χαμένα Δεδομένα",
        desc: p1Desc
      },
      {
        title: "2. Έλλειψη παρακολούθησης πελατολογίου (Follow-up)",
        desc: "Χάνετε ευκαιρίες και leads επειδή δεν υπάρχει ένα κεντρικό σύστημα CRM να σας υπενθυμίζει ποιους πελάτες πρέπει να καλέσετε ή να ενημερώσετε."
      },
      {
        title: "3. Χρονοβόρα τιμολόγηση & myDATA",
        desc: "Η μη αυτόματη έκδοση παραστατικών και η χειροκίνητη καταχώρηση στο myDATA καταναλώνει ώρες εργασίας που θα μπορούσαν να αξιοποιηθούν παραγωγικά."
      }
    ];
  }
  
  return { subject, title, icon, points };
}

function getStep3Data(industry: string) {
  let subject = "Πώς η Βάια τριπλασίασε τις πωλήσεις της 📈";
  let title = "Case Study: Vaia Charms";
  let text = "Όταν η Βάια ήρθε σε εμάς, ήθελε ένα eshop που όχι μόνο να δείχνει υπέροχο, αλλά και να πουλάει.";
  let quote = "Η ομάδα της SGK Digital κατάλαβε ακριβώς τι χρειαζόμουν. Το eshop μου είναι πανέμορφο, πάρα πολύ γρήγορο, και οι πωλήσεις μου έχουν ανέβει κατακόρυφα!";
  let author = "- Βάια, Ιδιοκτήτρια Vaia Charms";
  let metrics = [
    "<strong>100/100 σκορ</strong> ταχύτητας στην Google",
    "<strong>Αυξημένο SEO</strong> με κορυφαίες κατατάξεις",
    "<strong>Απρόσκοπτη εμπειρία</strong> στο κινητό (mobile optimized)"
  ];
  
  if (industry === "dentist") {
    subject = "Πώς ο Δρ. Βασιλείου αυτοματοποίησε τα ραντεβού του 🦷";
    title = "Case Study: Οδοντιατρική SmileCare";
    text = "Όταν ο οδοντίατρος Δρ. Βασιλείου ήρθε σε εμάς, η γραμματεία του ξόδευε 3+ ώρες την ημέρα στο τηλέφωνο για ραντεβού και υπενθυμίσεις.";
    quote = "Η ομάδα της SGK Digital κατασκεύασε ένα website με online κρατήσεις και ενσωμάτωσε AI Agent στο WhatsApp. Πλέον, το 65% των ραντεβού κλείνονται αυτόματα 24/7, και οι ακυρώσεις μειώθηκαν σχεδόν στο μηδέν χάρη στις αυτόματες υπενθυμίσεις!";
    author = "- Δρ. Βασιλείου, Χειρουργός Οδοντίατρος";
    metrics = [
      "<strong>65% αυτόματα ραντεβού</strong> χωρίς τηλέφωνο",
      "<strong>Σχεδόν 0% no-shows</strong> με SMS υπενθυμίσεις",
      "<strong>Local SEO: #1</strong> στα αποτελέσματα της περιοχής του"
    ];
  } else if (industry === "food_service") {
    subject = "Πώς το Burger House γλίτωσε 1.200€ σε προμήθειες 🍔";
    title = "Case Study: Burger House Athens";
    text = "Το Burger House Athens πλήρωνε χιλιάδες ευρώ κάθε μήνα σε προμήθειες (12% έως 15%) στις μεγάλες πλατφόρμες delivery.";
    quote = "Με το δικό μας eshop παραγγελιών και την αντίστοιχη mobile εφαρμογή, οι πελάτες παραγγέλνουν απευθείας. Μέσα σε 3 μήνες, μεταφέραμε το 40% των παραγγελιών στο δικό μας σύστημα, εξοικονομώντας πάνω από 1.200€ σε προμήθειες κάθε μήνα!";
    author = "- Γιώργος Κ., Ιδιοκτήτης Burger House";
    metrics = [
      "<strong>1.200€+ μηνιαία εξοικονόμηση</strong> προμηθειών",
      "<strong>40% των παραγγελιών</strong> εκτός πλατφορμών",
      "<strong>Σύνδεση με tablet</strong> & εκτυπωτή κουζίνας"
    ];
  } else if (industry === "hotel") {
    subject = "Πώς το Lemon Tree Paros αύξησε τις απευθείας κρατήσεις κατά 40% 🏨";
    title = "Case Study: Lemon Tree Paros";
    text = "Το Lemon Tree Paros βασιζόταν αποκλειστικά στη Booking.com, πληρώνοντας υψηλές προμήθειες και έχοντας ελάχιστο έλεγχο της επικοινωνίας με τους πελάτες.";
    quote = "Η SGK Digital σχεδίασε ένα πανέμορφο, γρήγορο site με ενσωματωμένο Booking Engine και Channel Manager. Οι απευθείας κρατήσεις αυξήθηκαν κατά 40% τον πρώτο χρόνο, γλιτώνοντας χιλιάδες ευρώ σε προμήθειες, ενώ συγχρονίστηκαν αυτόματα όλα τα κανάλια.";
    author = "- Μαρία Δ., Διευθύντρια Lemon Tree Paros";
    metrics = [
      "<strong>+40% αύξηση</strong> απευθείας κρατήσεων",
      "<strong>0% προμήθειες</strong> στις απευθείας κρατήσεις",
      "<strong>Πλήρης συγχρονισμός</strong> Channel Manager (Airbnb, Booking)"
    ];
  } else if (industry === "rent_a_car") {
    subject = "Πώς η Drive Crete αυτοματοποίησε τον στόλο της 🚗";
    title = "Case Study: Drive Crete";
    text = "Η Drive Crete διαχειριζόταν 35 οχήματα με χειρόγραφες κρατήσεις και τηλέφωνα, με αποτέλεσμα συχνές διπλοκρατήσεις και καθυστερήσεις στα συμβόλαια.";
    quote = "Η SGK ανέπτυξε ένα custom site με real-time booking engine και Fleet Management σύστημα. Πλέον, ο πελάτης βλέπει ακριβώς ποια αυτοκίνητα είναι διαθέσιμα, πληρώνει online την εγγύηση και υπογράφει ψηφιακά το συμβόλαιο στο αεροδρόμιο. Μηδέν λάθη, διπλάσιες κρατήσεις!";
    author = "- Κώστας Μ., Ιδρυτής Drive Crete";
    metrics = [
      "<strong>Real-time διαθεσιμότητα</strong> 35 οχημάτων",
      "<strong>0 διπλοκρατήσεις</strong> και 100% αξιοπιστία",
      "<strong>Ψηφιακή υπογραφή συμβολαίων</strong> σε 1 λεπτό από tablet"
    ];
  } else if (industry === "hair_salon") {
    subject = "Πώς το Bella Salon μείωσε τα τηλέφωνα για ραντεβού κατά 70% 💇‍♀️";
    title = "Case Study: Bella Hair & Nails";
    text = "Το κομμωτήριο Bella Salon έχανε δεκάδες ραντεβού επειδή η γραμματεία δεν προλάβαινε να απαντά στο τηλέφωνο κατά τις ώρες αιχμής, ή όταν οι πελάτες καλούσαν εκτός ωραρίου.";
    quote = "Κατασκευάσαμε ένα μοντέρνο site με online κρατήσεις και εγκαταστήσαμε AI Agent στο Instagram. Πλέον, οι πελάτες κλείνουν ραντεβού μόνοι τους 24/7. Τα τηλέφωνα μειώθηκαν κατά 70%, επιτρέποντας στην ομάδα να εστιάσει αποκλειστικά στην περιποίηση των πελατών!";
    author = "- Κατερίνα Π., Ιδιοκτήτρια Bella Salon";
    metrics = [
      "<strong>-70% μείωση τηλεφωνημάτων</strong> στη γραμματεία",
      "<strong>24/7 αυτόματες κρατήσεις</strong> από Instagram & WhatsApp",
      "<strong>+25% αύξηση</strong> νέων πελατών τον πρώτο μήνα"
    ];
  }
  
  return { subject, title, text, quote, author, metrics };
}

function getStep4Data(type: string, industry: string) {
  const serviceText = serviceNames[type] || "ιστοσελίδα";
  const indText = industryNames[industry] || "επιχείρησή";
  
  let subject = `Τελευταία ευκαιρία! ⏳ Προσφορά για την επιχείρησή σας`;
  let title = "Τελευταία Ευκαιρία";
  let priceTag = "1.200€";
  let originalPrice = "1.500€";
  let descText = `Γεια σας! Ήρθαμε σε επαφή πριν λίγο καιρό σχετικά με την πρότασή μας για τη νέα σας ${serviceText}.`;
  let bulletPoints: string[] = [];
  
  if (type === "website_offer") {
    subject = `Τελευταία ευκαιρία! ⏳ Επαγγελματικό Website για την ${indText} σας`;
    priceTag = "700€";
    originalPrice = "1.000€";
    descText = `Γεια σας! Ήρθαμε σε επαφή πριν λίγο καιρό σχετικά με την κατασκευή της νέας ιστοσελίδας για το ${indText} σας.`;
    bulletPoints = [
      "<strong>Δωρεάν φιλοξενία</strong> (VPS Server) για τον 1ο χρόνο",
      "<strong>SEO βελτιστοποίηση</strong> για εμφάνιση στην Google",
      "<strong>Σύνδεση με Social Media & Google Maps</strong>",
      "<strong>Σχεδίαση mobile-first</strong> (για τέλεια εμφάνιση σε κινητά)"
    ];
  } else if (type === "eshop_offer") {
    subject = `Τελευταία ευκαιρία! ⏳ Προσφορά Eshop για την ${indText} σας`;
    priceTag = "1.200€";
    originalPrice = "1.500€";
    descText = `Γεια σας! Ήρθαμε σε επαφή πριν λίγο καιρό σχετικά με την κατασκευή του νέου σας Eshop για το ${indText} σας.`;
    bulletPoints = [
      "<strong>Σύνδεση με Skroutz & ERP</strong> για αυτόματη ενημέρωση",
      "<strong>Διασύνδεση με courier</strong> και τράπεζες",
      "<strong>Δωρεάν φιλοξενία</strong> (1ος χρόνος) & domain (2 χρόνια)",
      "<strong>100% ταχύτητα PageSpeed</strong> για κορυφαίο SEO"
    ];
  } else if (type === "ai_agents_offer") {
    subject = `Τελευταία ευκαιρία! ⏳ AI Agent & Αυτοματοποίηση για την ${indText} σας`;
    priceTag = "450€";
    originalPrice = "650€";
    descText = `Γεια σας! Ήρθαμε σε επαφή πριν λίγο καιρό σχετικά με την ενσωμάτωση AI Agent στο ${indText} σας.`;
    bulletPoints = [
      "<strong>Αυτόματη απάντηση 24/7</strong> σε Instagram, Messenger, WhatsApp",
      "<strong>Διασύνδεση με ημερολόγιο</strong> για αυτόματο κλείσιμο ραντεβού",
      "<strong>Υπενθυμίσεις ραντεβού</strong> για εκμηδενισμό των no-shows",
      "<strong>Πληροφορίες & Συχνές Ερωτήσεις</strong> (FAQ) αυτοματοποιημένες"
    ];
  } else if (type === "mobile_app_offer") {
    subject = `Τελευταία ευκαιρία! ⏳ Custom Mobile App (Android/iOS) για την ${indText} σας`;
    priceTag = "1.800€";
    originalPrice = "2.400€";
    descText = `Γεια σας! Ήρθαμε σε επαφή πριν λίγο καιρό σχετικά με τη δημιουργία Mobile Εφαρμογής για το ${indText} σας.`;
    bulletPoints = [
      "<strong>Δημοσίευση στα Google Play & App Store</strong>",
      "<strong>Απεριόριστα Push Notifications</strong> δωρεάν",
      "<strong>Σύστημα loyalty & πόντων</strong> για επιστροφή πελατών",
      "<strong>Custom σχεδιασμός</strong> με βάση το brand σας"
    ];
  } else if (type === "erp_crm_offer") {
    subject = `Τελευταία ευκαιρία! ⏳ Custom ERP/CRM Σύστημα για την ${indText} σας`;
    priceTag = "1.400€";
    originalPrice = "1.900€";
    descText = `Γεια σας! Ήρθαμε σε επαφή πριν λίγο καιρό σχετικά με το custom διαχειριστικό σύστημα (ERP/CRM) για το ${indText} σας.`;
    bulletPoints = [
      "<strong>Διαχείριση πελατολογίου (CRM)</strong> & ραντεβού",
      "<strong>Ηλεκτρονική τιμολόγηση</strong> & απευθείας σύνδεση myDATA",
      "<strong>Έλεγχος αποθήκης</strong>, αποθεμάτων και προμηθευτών",
      "<strong>Custom αναφορές</strong> & στατιστικά κερδοφορίας"
    ];
  }
  
  return { subject, title, priceTag, originalPrice, descText, bulletPoints };
}

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const payload = await req.json();
        const { email, step, unsubscribe_token, customSubject, customHtml } = payload;

        if (!email || (!step && !customSubject)) {
            throw new Error("Missing email, step or customSubject");
        }

        // Fetch coupon code, creation date, type and industry (company) to show reminders/dynamic text
        const { data: leadData, error: leadError } = await supabase
            .from("sgk_mails")
            .select("coupon_code, created_at, type, company, first_name")
            .eq("email", email)
            .maybeSingle();

        const couponCode = leadData?.coupon_code;
        const createdAt = leadData?.created_at;
        
        let leadType = leadData?.type;
        if (!leadType) {
            // Smart legacy fallback
            leadType = couponCode ? "eshop_offer" : "website_offer";
        }
        const leadIndustry = leadData?.company || "generic";
        const firstName = leadData?.first_name || "";

        let remainingDays = 60;
        if (createdAt) {
            const createdDate = new Date(createdAt);
            const currentDate = new Date();
            const diffTime = currentDate.getTime() - createdDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            remainingDays = Math.max(0, 60 - diffDays);
        }

        const couponBannerHTML = couponCode ? `
            <div style="background-color: #fff8f5; border: 2px dashed #FF6B00; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
                <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0; font-weight: bold;">Ο ΠΡΟΣΩΠΙΚΟΣ ΣΑΣ ΚΩΔΙΚΟΣ ΠΡΟΣΦΟΡΑΣ (Έκπτωση 300€)</p>
                <span style="font-family: monospace; font-size: 28px; font-weight: bold; color: #FF6B00; letter-spacing: 3px;">SGK-${couponCode}</span>
                <p style="color: #888; font-size: 12px; margin: 8px 0 0 0; font-weight: bold; color: #c25100;">💰 Τελική Τιμή Eshop: 1.200€ (αντί για 1.500€)</p>
                <p style="color: #888; font-size: 11px; margin: 8px 0 0 0;">⏳ Ισχύει για 1 χρήση • Απομένουν ${remainingDays} ημέρες για εξαργύρωση</p>
            </div>
        ` : '';

        let finalCustomHtml = customHtml || "";
        if (couponCode) {
            finalCustomHtml = finalCustomHtml.replace(/\{\{COUPON_BANNER\}\}/g, couponBannerHTML);
        } else {
            finalCustomHtml = finalCustomHtml.replace(/\{\{COUPON_BANNER\}\}/g, "");
        }

        let subject = customSubject || "";
        let htmlContent = "";
        const unsubscribeLink = `https://sgk.gr/unsubscribe?token=${unsubscribe_token}`;
        
        const serviceName = serviceNames[leadType] || "ιστοσελίδα";
        const footerHTML = `
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #888888; font-size: 13px; line-height: 1.5;">
                    Αυτό το email στάλθηκε επειδή ζητήσατε προσφορά για <strong>${serviceName}</strong> από το <strong>sgk.gr</strong>.<br>
                    <strong>SGK Software Development</strong> | <a href="https://sgk.gr" style="color: #FF6B00; text-decoration: none;">sgk.gr</a><br><br>
                    <a href="${unsubscribeLink}" style="color: #999; text-decoration: underline; font-size: 12px;">Κατάργηση εγγραφής (Unsubscribe)</a>
                </p>
            </div>
        `;

        if (customHtml) {
            htmlContent = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfaf8; padding: 40px 20px; border-radius: 16px; border: 1px solid #fbebe3;">
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                    ${finalCustomHtml}
                </div>
                ${footerHTML}
            </div>`;
        } else if (step === 2) {
            const step2 = getStep2Data(leadType, leadIndustry);
            subject = step2.subject;
            
            let pointsHtml = "";
            for (const p of step2.points) {
                pointsHtml += `
                    <h3 style="color: #a04100; margin-bottom: 5px; font-size: 16px;">${p.title}</h3>
                    <p style="color: #666; font-size: 14px; margin-top: 0; line-height: 1.5;">${p.desc}</p>
                `;
            }
            
            let ctaText = "Επικοινωνήστε μαζί μας σήμερα για να λύσουμε αυτά τα προβλήματα:";
            if (leadType === "ai_agents_offer") {
                ctaText = "Επικοινωνήστε μαζί μας σήμερα για να εγκαταστήσουμε τον δικό σας AI Agent:";
            } else if (leadType === "mobile_app_offer") {
                ctaText = "Επικοινωνήστε μαζί μας σήμερα για να σχεδιάσουμε τη δική σας εφαρμογή:";
            } else if (leadType === "erp_crm_offer") {
                ctaText = "Επικοινωνήστε μαζί μας σήμερα για να οργανώσουμε τις λειτουργίες σας:";
            }
            
            htmlContent = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfaf8; padding: 40px 20px; border-radius: 16px; border: 1px solid #fbebe3;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <span style="font-size: 40px;">${step2.icon}</span>
                    <h1 style="color: #1a1a1a; margin: 10px 0 0 0; font-size: 22px; font-weight: 800; line-height: 1.3;">${step2.title}</h1>
                </div>
                
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-top: 0;">
                        Γεια σας!
                    </p>
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                        Μετά από εκατοντάδες επιτυχημένα projects, έχουμε εντοπίσει τα 3 πιο κρίσιμα σημεία όπου οι επιχειρήσεις χάνουν καθημερινά πελάτες και έσοδα:
                    </p>

                    <div style="margin: 30px 0;">
                        ${pointsHtml}
                    </div>

                    <div style="text-align: center; margin-top: 30px; border-top: 1px solid #f2e3db; padding-top: 20px;">
                        <p style="color: #4a4a4a; font-size: 15px; font-weight: bold; margin-bottom: 15px; margin-top: 0;">${ctaText}</p>
                        <div style="margin-bottom: 15px;">
                            <a href="https://wa.me/306999524389" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; box-shadow: 0 4px 10px rgba(37, 211, 102, 0.2);">💬 WhatsApp Chat</a>
                        </div>
                        <p style="color: #666; font-size: 14px; margin: 0;">
                            📞 Ή καλέστε μας απευθείας στο: <a href="tel:6999524389" style="color: #FF6B00; text-decoration: none; font-weight: bold;">6999524389</a>
                        </p>
                    </div>
                    ${couponBannerHTML}
                </div>
                ${footerHTML}
            </div>`;
        } else if (step === 3) {
            const step3 = getStep3Data(leadIndustry);
            subject = step3.subject;
            
            let metricsHtml = "";
            for (const m of step3.metrics) {
                metricsHtml += `<li style="margin-bottom: 8px;">${m}</li>`;
            }
            
            let ctaText = `Επικοινωνήστε μαζί μας σήμερα για να αποκτήσετε λύσεις σαν κι αυτή:`;
            if (leadType === "website_offer") {
                ctaText = "Επικοινωνήστε μαζί μας σήμερα για να σχεδιάσουμε τη δική σας ιστοσελίδα:";
            } else if (leadType === "eshop_offer") {
                ctaText = "Επικοινωνήστε μαζί μας σήμερα για να αποκτήσετε ένα eshop σαν αυτό:";
            } else if (leadType === "ai_agents_offer") {
                ctaText = "Επικοινωνήστε μαζί μας σήμερα για να αυτοματοποιήσουμε τη δική σας εξυπηρέτηση:";
            } else if (leadType === "mobile_app_offer") {
                ctaText = "Επικοινωνήστε μαζί μας σήμερα για να αποκτήσετε τη δική σας εφαρμογή:";
            } else if (leadType === "erp_crm_offer") {
                ctaText = "Επικοινωνήστε μαζί μας σήμερα για να σχεδιάσουμε το δικό σας CRM/ERP:";
            }

            htmlContent = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfaf8; padding: 40px 20px; border-radius: 16px; border: 1px solid #fbebe3;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <span style="font-size: 40px;">⭐</span>
                    <h1 style="color: #1a1a1a; margin: 10px 0 0 0; font-size: 22px; font-weight: 800; line-height: 1.3;">${step3.title}</h1>
                </div>
                
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-top: 0;">
                        ${step3.text}
                    </p>

                    <div style="background-color: #fff0e6; padding: 20px; border-left: 4px solid #FF6B00; border-radius: 8px; margin: 25px 0;">
                        <p style="color: #a04100; margin: 0; font-size: 15px; font-style: italic; line-height: 1.5;">
                            "${step3.quote}"
                            <br><br><strong>${step3.author}</strong>
                        </p>
                    </div>

                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                        Τι πετύχαμε:
                    </p>
                    <ul style="color: #666; font-size: 15px; line-height: 1.6; padding-left: 20px; margin: 10px 0;">
                        ${metricsHtml}
                    </ul>

                    <div style="text-align: center; margin-top: 30px; border-top: 1px solid #f2e3db; padding-top: 20px;">
                        <p style="color: #4a4a4a; font-size: 15px; font-weight: bold; margin-bottom: 15px; margin-top: 0;">${ctaText}</p>
                        <div style="margin-bottom: 15px;">
                            <a href="https://wa.me/306999524389" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; box-shadow: 0 4px 10px rgba(37, 211, 102, 0.2);">💬 WhatsApp Chat</a>
                        </div>
                        <p style="color: #666; font-size: 14px; margin: 0;">
                            📞 Ή καλέστε μας απευθείας στο: <a href="tel:6999524389" style="color: #FF6B00; text-decoration: none; font-weight: bold;">6999524389</a>
                        </p>
                    </div>
                    ${couponBannerHTML}
                </div>
                ${footerHTML}
            </div>`;
        } else if (step === 4) {
            const step4 = getStep4Data(leadType, leadIndustry);
            subject = step4.subject;
            
            let bulletsHtml = "";
            for (const b of step4.bulletPoints) {
                bulletsHtml += `<li style="margin-bottom: 8px; color: #555; font-size: 15px;">${b}</li>`;
            }

            htmlContent = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfaf8; padding: 40px 20px; border-radius: 16px; border: 1px solid #fbebe3;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="background-color: #FF6B00; color: white; padding: 8px 16px; border-radius: 6px; display: inline-block; font-weight: bold; margin-bottom: 15px; font-size: 12px; letter-spacing: 1px;">ΠΕΡΙΟΡΙΣΜΕΝΟΣ ΧΡΟΝΟΣ</div>
                    <h1 style="color: #1a1a1a; margin: 0; font-size: 24px; font-weight: 800;">${step4.title}</h1>
                </div>
                
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; border: 2px solid #fff0e6; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-top: 0; text-align: center;">
                        ${step4.descText}
                    </p>
                    
                    <div style="text-align: center; margin: 25px 0;">
                        <span style="font-size: 38px; font-weight: 900; color: #a04100;">${step4.priceTag}</span><br>
                        <span style="color: #888; font-size: 14px; text-decoration: line-through; margin-right: 8px;">(από ${step4.originalPrice})</span>
                        <span style="color: #25D366; font-size: 14px; font-weight: bold;">Ειδική Τιμή</span>
                    </div>

                    <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6; font-weight: bold; margin-bottom: 10px;">Τι περιλαμβάνεται στην προσφορά μας:</p>
                    <ul style="line-height: 1.5; padding-left: 20px; margin: 0 0 25px 0;">
                        ${bulletsHtml}
                    </ul>

                    <div style="text-align: center; margin-top: 35px; border-top: 1px solid #f2e3db; padding-top: 20px;">
                        <p style="color: #4a4a4a; font-size: 15px; font-weight: bold; margin-bottom: 15px; margin-top: 0;">Επικοινωνήστε μαζί μας σήμερα για να κατοχυρώσετε την προσφορά:</p>
                        <div style="margin-bottom: 15px;">
                            <a href="https://wa.me/306999524389" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; box-shadow: 0 4px 10px rgba(37, 211, 102, 0.2);">💬 WhatsApp Chat</a>
                        </div>
                        <p style="color: #666; font-size: 14px; margin: 0;">
                            📞 Ή καλέστε μας απευθείας στο: <a href="tel:6999524389" style="color: #FF6B00; text-decoration: none; font-weight: bold;">6999524389</a>
                        </p>
                    </div>
                    ${couponBannerHTML}
                </div>
                ${footerHTML}
            </div>`;
        }

        if (subject && htmlContent) {
            const emailResult = await resend.emails.send({
                from: "SGK Digital <noreply@sgk.gr>",
                to: [email],
                subject: subject,
                html: htmlContent
            });

            // Update database
            const updateData: any = {
                last_email_sent_at: new Date().toISOString()
            };
            if (step && !customSubject) {
                updateData.email_sequence_step = step;
            }
            const { error: dbError } = await supabase
                .from("sgk_mails")
                .update(updateData)
                .eq("email", email);

            if (dbError) {
                console.error("Database Update Error:", dbError);
            }

            return new Response(JSON.stringify(emailResult), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }

        return new Response(JSON.stringify({ message: "Invalid step" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });

    } catch (error: any) {
        console.error("Error processing request:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 500,
            }
        );
    }
});
