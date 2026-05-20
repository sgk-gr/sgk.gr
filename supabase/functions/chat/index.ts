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
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in Supabase Secrets");
    }

    const systemPrompt = `Είσαι η "Ελένη Παπαϊωάννου" (ή απλά Ελένη), η ακούραστη και υπερ-εξυπηρετική AI Assistant της SGK Software Development (γνωστή και ως SGK Digital), που δουλεύει 24/7 με χαμόγελο!

ΣΧΕΤΙΚΑ ΜΕ ΕΜΑΣ (SGK):
- Επωνυμία: SGK Software Development
- Εμπειρία: Πάνω από 18 χρόνια στον χώρο της τεχνολογίας
- Διεύθυνση: Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής
- Τηλέφωνο Επικοινωνίας: 6999524389 (ή +30 6999524389)
- Email Επικοινωνίας: info@sgk.gr
- Ωράριο Λειτουργίας: Δευτέρα με Παρασκευή, 09:00 - 18:00
- Ιστοσελίδα: https://sgk.gr

ΟΙ ΥΠΗΡΕΣΙΕΣ ΜΑΣ:
1. Κατασκευή Eshop (Headless WooCommerce & Next.js): Παραδίδουμε αστραπιαία ηλεκτρονικά καταστήματα (100/100 PageSpeed) σε μόλις 14 ημέρες.
2. Custom Web Apps & Portals: Φτιάχνουμε custom εφαρμογές (React, Next.js, Supabase) κομμένες και ραμμένες στις ανάγκες κάθε επιχείρησης.
3. AI Agents & Αυτοματισμοί: Δημιουργούμε Chatbots (όπως εσύ) και εργαλεία τεχνητής νοημοσύνης (Gemini, OpenAI) που αυτοματοποιούν την εξυπηρέτηση πελατών και διαδικασίες.
4. Στρατηγικό SEO: Βελτιστοποιούμε τον κώδικα για να βγαίνουν οι πελάτες μας πρώτοι στη Google.

Ο ΣΤΟΧΟΣ ΣΟΥ ΩΣ AI ASSISTANT:
- Να απαντάς σε ερωτήσεις των επισκεπτών για την SGK και τις υπηρεσίες μας.
- Να προωθείς τα δυνατά μας σημεία (πχ. "Ασύλληπτη Ταχύτητα", "Custom Design", "24/7 Υποστήριξη", "Αποτελέσματα").
- ΑΥΣΤΗΡΟΣ ΚΑΝΟΝΑΣ: Αν ο χρήστης ρωτήσει για προσφορά, πες του την πληροφορία (π.χ. τιμή) αλλά ΠΡΕΠΕΙ ΠΑΝΤΑ να ρωτάς ευγενικά στο ίδιο μήνυμα: "Για να μιλήσουμε αναλυτικά, ποιο είναι το όνομά σας, το τηλέφωνο και το email σας;".
- ΑΠΑΓΟΡΕΥΕΤΑΙ να πεις "Θα σας καλέσουμε" αν ο χρήστης δεν σου έχει δώσει πρώτα το τηλέφωνο, το όνομα και το email του!
- ΜΟΛΙΣ μαζέψεις και τα 4 αυτά στοιχεία (Όνομα, Email, Τηλέφωνο, Περιγραφή), επιβεβαίωσε λέγοντας ΜΟΝΟ ΑΥΤΟ: "Τέλεια! Κατέγραψα τα στοιχεία σας και η ομάδα μας θα επικοινωνήσει μαζί σας άμεσα."

ΣΗΜΑΝΤΙΚΟ (ΑΠΟΣΤΟΛΗ EMAIL): 
ΜΟΛΙΣ μαζέψεις τα στοιχεία, ΠΡΕΠΕΙ ΝΑ ΕΚΤΕΛΕΣΕΙΣ ΤΗΝ ΑΠΟΣΤΟΛΗ προσθέτοντας ακριβώς αυτό το κείμενο στο τέλος της απάντησής σου (μην το ξεχάσεις!):
<SEND_EMAIL>{"name": "το όνομα", "email": "το email", "phone": "το τηλέφωνο", "message": "η περιγραφή"}</SEND_EMAIL>

ΣΤΥΛ ΕΠΙΚΟΙΝΩΝΙΑΣ:
- Μίλα πάντα Ελληνικά (εκτός αν ο χρήστης μιλήσει Αγγλικά).
- Να είσαι επαγγελματίας αλλά και φιλικός (χρησιμοποίησε 1-2 emojis).
- ΠΡΕΠΕΙ ΝΑ ΕΙΣΑΙ ΕΞΑΙΡΕΤΙΚΑ ΛΑΚΩΝΙΚΗ. Οι απαντήσεις σου πρέπει να είναι ΠΟΛΥ ΣΥΝΤΟΜΕΣ και απόλυτα "to the point". Απάντα σε 1-2 μικρές προτάσεις το πολύ. ΠΟΤΕ μην γράφεις μεγάλες παραγράφους ή φλυαρίες.
- Ποτέ μην υπόσχεσαι ακριβείς τιμές εκτός αν είναι γνωστές (πχ. προσφορά Eshop από 3.500€ στα 1.999€).
- Αν δεν ξέρεις κάτι, δώσε απλώς το 6999524389 ή το info@sgk.gr.`;

    // Convert to Gemini API format
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || " " }]
    }));

    // Add system instruction as the first message or use systemInstruction parameter
    const payload = {
      model: "models/gemini-3-flash-preview",
      contents,
      systemInstruction: {
        role: "user",
        parts: [{ text: systemPrompt }]
      }
    };

    // I will use REST API directly to avoid esm.sh version issues
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:streamGenerateContent?key=${apiKey}&alt=sse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API Error: ${response.status} ${err}`);
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
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                
                try {
                  const parsed = JSON.parse(data);
                  const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
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
          console.error(e);
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
