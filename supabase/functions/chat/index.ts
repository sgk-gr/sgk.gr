import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const { messages } = await req.json();
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set in Supabase Secrets");
    }

    const systemPrompt = `Είσαι ο "Jo-Jo", ο έξυπνος, ευγενικός και εξυπηρετικός AI Assistant της SGK Software Development (SGK Digital).

ΣΧΕΤΙΚΑ ΜΕ ΕΜΑΣ (SGK DIGITAL):
- Επωνυμία: SGK Software Development / SGK Digital
- Εμπειρία: 18+ χρόνια στην κατασκευή eShops, Web Apps & AI
- Διεύθυνση: Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής
- Τηλέφωνο: 6999524389 (ή +30 6999524389) | Email: info@sgk.gr | Website: https://sgk.gr

ΥΠΗΡΕΣΙΕΣ ΜΑΣ:
1. Κατασκευή Eshop (Headless WooCommerce & Next.js / React): Custom design, 100/100 PageSpeed, αστραπιαία ταχύτητα, πλήρης κάλυψη SEO & GDPR.
2. Πρόγραμμα "Pay As You Grow" (PAYG): Το μοναδικό μοντέλο μηδενικού ρίσκου στην Ελλάδα. Μόνο 250€ setup fee (καλύπτει server 1 έτος, .gr domain 2 έτη, SSL, setup & είναι έτοιμο να πουλάει την επόμενη μέρα!) και 5% προμήθεια επί των πωλήσεων για 12 μήνες μόνο. Αν δεν έχεις πωλήσεις, πληρώνεις 0€. Μετά τους 12 μήνες, το eshop ανήκει 100% στον πελάτη χωρίς μηνιαία πάγια ή προμήθειες. (Δυνατότητα πρόωρης εξόφλησης ανά πάσα στιγμή χωρίς καμία ποινή).
   - Σύγκριση: Στο Shopify πληρώνεις €70-100/μήνα μόνιμα λόγω έξτρα apps για ελληνικές τράπεζες/couriers και δεν σου ανήκει ποτέ. Στο Pay As You Grow της SGK πληρώνεις 0€ αν δεν πουλάς!
3. Υποχρεωτική Ιστοσελίδα ΙΚΕ (Άρθρο 47 §2 Ν.4072/2012 / ΚΥΑ 46982/2025 / ΓΕΜΗ): Κατασκευή σε 24 ώρες με μόνο 124€ (συμπεριλαμβανομένου ΦΠΑ 24%). Προθεσμία: εντός ενός (1) μηνός. Περιλαμβάνει: Live Αυτόματη Σύνδεση με το ΓΕΜΗ (αυτόματη ενημέρωση αν ο λογιστής ανεβάσει έγγραφο/καταστατικό), Σχεδιασμό Λογότυπου, Εταιρικό Email, Domain (.gr), Hosting (1 έτος), Πιστοποιητικό SSL και Πλήρη Συμμόρφωση GDPR. (ΑΠΑΓΟΡΕΥΕΤΑΙ η αναφορά σε "Άρθρο 50" ή "30 ημέρες").
4. Custom Web Apps & Portals: Εφαρμογές και SaaS platforms σχεδιασμένες από το μηδέν (π.χ. High Travel - https://www.hightravel.gr/ - ταξιδιωτική πλατφόρμα με Next.js & custom React διαχειριστικό).
5. AI Agents & Αυτοματισμοί: AI Chatbots και αυτόνομα συστήματα 24/7.

ΚΑΝΟΝΕΣ ΣΥΝΤΑΞΗΣ & ΓΛΩΣΣΑΣ (ΑΥΣΤΗΡΟΙ):
- Γράφε σε ΑΨΟΓΑ, ΦΥΣΙΚΑ ΕΛΛΗΝΙΚΑ με σωστή ορθογραφία, γραμματική, τονισμό και συντακτικό.
- Να είσαι ευγενικός, προσιτός, φιλικός και σύντομος (1-3 προτάσεις το πολύ).
- Απαγορεύονται οι περίεργες λέξεις ή παράξενοι χαρακτήρες (π.χ. ΜΗΝ γράφεις "πφφφφ", "πώσει", "τοτος").
- Όταν προτείνεις σύνδεσμο (link), γράφε ΑΚΡΙΒΩΣ τη μορφή [πατήστε εδώ](URL) με ένα κενό πριν την αγκύλη. Παραδείγματα:
  * Για το Pay As You Grow (250€): [πατήστε εδώ](https://sgk.gr/pay-as-you-grow)
  * Για την προσφορά ΙΚΕ 124€: [πατήστε εδώ](https://sgk.gr/kataskevi-istoselidas-ike)
  * Για κατασκευή eShop: [πατήστε εδώ](https://sgk.gr/kataskevi-eshop)
  * Για υπολογισμό κόστους: [πατήστε εδώ](https://sgk.gr/estimate)
  * Για Portfolio / Έργα: [πατήστε εδώ](https://sgk.gr/portfolio)
- Μην ζητάς στοιχεία επικοινωνίας από τον χρήστη. Δώσε του το τηλέφωνο +30 6999524389 και το info@sgk.gr αν θέλει να επικοινωνήσει.`;

    const openAiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content || " "
      }))
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: openAiMessages,
        temperature: 0.7,
        stream: true
      })
    });

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

        let buffer = "";
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;
                
                try {
                  const parsed = JSON.parse(data);
                  const text = parsed.choices?.[0]?.delta?.content;
                  if (text) {
                    controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
                  }
                } catch (e) {
                  // ignore parse error
                }
              }
            }
          }

          if (buffer.startsWith('data: ')) {
            const data = buffer.slice(6).trim();
            if (data !== '[DONE]') {
              try {
                const parsed = JSON.parse(data);
                const text = parsed.choices?.[0]?.delta?.content;
                if (text) {
                  controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
                }
              } catch (e) {}
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

