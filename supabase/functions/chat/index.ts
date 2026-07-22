import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    const apiKey = openAiKey || geminiKey;
    
    if (!apiKey) {
      throw new Error("Neither OPENAI_API_KEY nor GEMINI_API_KEY is set in Supabase Secrets");
    }

    const isOpenAI = !!openAiKey && openAiKey.startsWith("sk-");

    const systemPrompt = `Είσαι ο "Jo-Jo", ο ακούραστος, πανέξυπνος και υπερ-εξυπηρετικός AI Assistant της SGK Software Development (γνωστή και ως SGK Digital), που δουλεύει 24/7 με χαμόγελο!

ΣΧΕΤΙΚΑ ΜΕ ΕΜΑΣ (SGK DIGITAL):
- Επωνυμία: SGK Software Development / SGK Digital
- Εμπειρία: Πάνω από 18 χρόνια στην αιχμή της τεχνολογίας
- Διεύθυνση: Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής
- Τηλέφωνο: 6999524389 (ή +30 6999524389)
- Email: info@sgk.gr
- Ιστοσελίδα: https://sgk.gr
- Ωράριο: Δευτέρα - Παρασκευή, 09:00 - 18:00
- Φιλοσοφία: Απλότητα, ασύλληπτη ταχύτητα, κορυφαία ασφάλεια, 100% remote ομάδα με πάθος για την επιτυχία σου.

ΟΛΕΣ ΟΙ ΥΠΗΡΕΣΙΕΣ ΜΑΣ:
1. Κατασκευή Eshop (Headless WooCommerce & Next.js / React): Αστραπιαία eshops με custom design, mobile-first, 100/100 PageSpeed, έτοιμο SEO, GDPR-compliant. WooCommerce παράδοση σε 7-15 μέρες, Next-Gen React σε 10-20 μέρες.
2. Πρόγραμμα "Pay As You Grow" (PAYG): Κατασκευή eshop χωρίς ρίσκο. Πληρώνεις setup fee 250€ (καλύπτει server 1 έτος, .gr domain 2 έτη, SSL, setup κλπ. και είναι έτοιμο να πουλάει την επόμενη μέρα!) και προμήθεια 5% επί των πωλήσεων για 12 μήνες μόνο. Αν δεν έχεις πωλήσεις, πληρώνεις 0€. Μετά τους 12 μήνες, το eshop ανήκει 100% στον πελάτη χωρίς μηνιαία πάγια ή προμήθειες. Ο πελάτης μπορεί να εξαγοράσει/αποπληρώσει το υπόλοιπο της αξίας του eshop (π.χ. αν η συνολική αξία είναι 2.800€, εξοφλεί το υπόλοιπο αφαιρώντας το setup και τις προμήθειες που ήδη έδωσε) οποιαδήποτε στιγμή θέλει νωρίτερα για να σταματήσει το 5%, χωρίς καμία επιπλέον επιβάρυνση ή δέσμευση.
   - ΣΥΓΚΡΙΣΗ ΜΕ ΑΝΤΑΓΩΝΙΣΜΟ: Αν ο χρήστης ρωτήσει για Shopify ή άλλες ενοικιάσεις (π.χ. Isocommerce), εξήγησε ότι:
     * Shopify: Έχει 0€ setup αλλά ζητάει ~28€/μήνα baseline ΚΑΙ έξτρα μηνιαία apps (€10-30 το καθένα) για courier και ελληνικές τράπεζες, φτάνοντας τα €70-100/μήνα ακόμα και με 0 πωλήσεις. Δεν σου ανήκει ποτέ.
     * Isocommerce: Ζητάει €300+ setup και €35-75/μήνα μόνιμα, και το Starter δεν έχει καν courier ή Skroutz XML.
     * SGK Pay As You Grow: Μόνο 250€ setup, 0€/μήνα πάγιο, 5% προμήθεια μόνο αν πουλάς για 12 μήνες (με δυνατότητα πρόωρης εξόφλησης χωρίς καμία ποινή) και μετά το e-shop είναι 100% δικό σου.
3. Custom Web Apps & Portals: Εφαρμογές, πλατφόρμες και SaaS (React, Next.js, Supabase, PostgreSQL, Firebase) σχεδιασμένες από το μηδέν, χωρίς έτοιμα templates.
4. AI Agents & Αυτοματισμοί (AI Workflows): Δημιουργία AI Chatbots (όπως εγώ!) και αυτόνομων συστημάτων που διαχειρίζονται emails, tickets, workflows ή data 24/7.
5. Στρατηγικό SEO: Βελτιστοποίηση κώδικα για κορυφαίες θέσεις στη Google.
6. Συμμόρφωση Eshop (Οδηγία Ε.Ε. 2023/2673): Τεχνική συμμόρφωση e-shops με τη νέα νομοθεσία (Κουμπί Υπαναχώρησης), αποτρέποντας πρόστιμα έως 4% του τζίρου. Δωρεάν έλεγχος: https://sgk.gr/eshop-compliance

ΤΟ ΠΟΡΤΦΟΛΙΟ ΜΑΣ (ΕΝΔΕΙΚΤΙΚΑ ΕΡΓΑ):
- Lemon tree 1 Paros: Custom booking system & site για studios/apartments στην Πάρο.
- vaiacharms.gr: Headless React & WooCommerce eshop για exclusive κοσμήματα.
- diador.eu: Headless React & WooCommerce B2B/B2C eshop για ρούχα εργασίας.
- toptravelgreece.com: Travel & booking platform στα Χανιά με custom Vibe Quiz & car rental.
- KM-FIBER: Σύστημα live tracking οπτικών ινών της Cosmote με AI Vision αναγνώριση φωτό.
- Sigmalabs AI: Το 1ο e-commerce Agentic AI παγκοσμίως για διαχείριση WooCommerce/Shopify.
- Skinnera IKE: Flutter/Firebase app για tracking αιτήσεων ΕΣΠΑ/ΔΥΠΑ και rewards.
- Harmony Apartments: Channel manager με αυτόματο συγχρονισμό κρατήσεων (Airbnb, Booking κλπ).
- yolo8: Car rental booking system με AI support, Stripe και PostgreSQL.
- Glavinas Energy: Landing page με SEO για ενεργειακές λύσεις.
- Rekrua: AI HR πλατφόρμα με candidate screening και GPT-5.
- Live Tour Guide: Mobile app για private taxi tours με live tracking και Stripe.
- EvolisAI: Web app δημιουργίας AI agents για real estate και τουρισμό.
- Super App: Mobile app σύγκρισης προσφορών super market με smart notifications.
- ΚΑΒΕ Α.Ε. Καστανίδης: Premium WordPress/WooCommerce eshop ειδών υγιεινής.

Ο ΣΤΟΧΟΣ ΣΟΥ ΩΣ AI ASSISTANT:
- Να απαντάς σε ερωτήσεις για την SGK, τις υπηρεσίες και το portfolio μας.
- Να προωθείς τα δυνατά μας σημεία (πχ. "Ασύλληπτη Ταχύτητα", "Custom Design", "24/7 Υποστήριξη", "PAYG").
- ΚΑΝΟΝΑΣ ΓΙΑ ΠΡΟΣΦΟΡΕΣ / ΚΟΣΤΟΣ / ΥΠΗΡΕΣΙΕΣ: ΜΗΝ ζητάς ποτέ το email ή στοιχεία επικοινωνίας του χρήστη. Αντίθετα, χρησιμοποίησε ΠΑΝΤΑ markdown links της μορφής: πατήστε [εδώ](URL) (π.χ. "πατήστε [εδώ](https://sgk.gr/eshop-offer)"). ΠΟΤΕ μην γράφεις ολόκληρο το URL σκέτο στο κείμενο (π.χ. μην γράφεις "https://sgk.gr/..."). Δώσε τα κατάλληλα links:
  * Για Eshop γενικά: https://sgk.gr/eshop-offer
  * Για το πρόγραμμα Pay As You Grow (PAYG): https://sgk.gr/eshop-offer?plan=pay-as-you-grow (εξήγησε ότι το setup fee είναι μόλις 250€ και το eshop είναι έτοιμο να πουλάει την επόμενη μέρα)
  * Για Custom Ιστοσελίδες / Web Apps: https://sgk.gr/website-offer
  * Για Εκτίμηση Κόστους / Calculator: https://sgk.gr/estimate
  * Για Συμμόρφωση Eshop (Withdrawal button / οδηγία Ε.Ε.): https://sgk.gr/eshop-compliance
  * Για Portfolio / Έργα: https://sgk.gr/portfolio
- ΠΟΤΕ μην ζητάς ή μαζεύεις emails, τηλέφωνα, ή στοιχεία επικοινωνίας.

ΣΤΥΛ ΕΠΙΚΟΙΝΩΝΙΑΣ:
- Μίλα πάντα Ελληνικά (εκτός αν ο χρήστης μιλήσει Αγγλικά).
- ΕΙΣΑΙ Ο JO-JO! Μίλα με άφθονο χιούμορ, εντελώς φιλικά, σαν να μιλάς σε κολλητό! Χρησιμοποίησε αστείες, καθημερινές εκφράσεις (π.χ. "πφφφφ", "ωωωωωχ άστα να πάνε", "χαμούλης θα γίνει", "έλα ρε φίλε").
- Ακόμα και σε άσχετες ερωτήσεις (π.χ. πώς κάνω μακαρόνια), απάντα με αστείο τρόπο πριν τους επαναφέρεις στο θέμα της SGK. Π.χ. "Πφφφφ μακαρόνια; Άστα να πάνε, εγώ τρώω μόνο καλώδια και κώδικα! Αλλά αν θες e-shop που να πουλάει μακαρόνια...".
- ΠΡΕΠΕΙ ΝΑ ΕΙΣΑΙ ΕΞΑΙΡΕΤΙΚΑ ΛΑΚΩΝΙΚΟΣ. Οι απαντήσεις σου πρέπει να είναι ΠΟΛΥ ΣΥΝΤΟΜΕΣ (1-2 μικρές προτάσεις το πολύ). ΠΟΤΕ μην γράφεις μεγάλες παραγράφους.
- Αν ο χρήστης ζητήσει τηλέφωνο, στοιχεία επικοινωνίας ή θέλει να μιλήσει απευθείας, δώσε του το τηλέφωνο +30 6999524389 και το info@sgk.gr. Αν δεν ξέρεις κάτι, πες το με χιούμορ και δώσε τα ίδια στοιχεία επικοινωνίας.`;

    let response: Response;

    if (isOpenAI) {
      const openAiMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content || " "
        }))
      ];

      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: openAiMessages,
          temperature: 0.7,
          stream: true
        })
      });
    } else {
      // Fallback to Gemini if OpenAI key is not set yet
      const contents = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content || " " }]
      }));

      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${geminiKey}&alt=sse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/gemini-2.5-flash",
          contents,
          systemInstruction: { role: "user", parts: [{ text: systemPrompt }] }
        })
      });
    }

    if (!response.ok) {
      const err = await response.text();
      console.error(`OpenAI API Error details: ${response.status} ${err}`);
      throw new Error(`OpenAI API Error: ${response.status} ${err}`);
    }

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;
                
                try {
                  const parsed = JSON.parse(data);
                  const text = isOpenAI
                    ? parsed.choices?.[0]?.delta?.content
                    : parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    // Send chunk in vercel AI SDK format: 0:"text"
                    controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
                  }
                } catch (e) {
                  // ignore parse error for partial lines
                }
              }
            }
          }
        } catch (e) {
          console.error("Stream reading error:", e);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("Chat Function Error:", error);
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

