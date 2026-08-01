import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PERSONAL_MOBILE = "+306999524389";

serve(async (req: Request) => {
  const url = new URL(req.url);

  // 1. Zadarma Verification Echo Check
  const zdEcho = url.searchParams.get("zd_echo");
  if (zdEcho) {
    return new Response(zdEcho, {
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });
  }

  // Handle request body / params for DTMF Digits
  let digits = url.searchParams.get("Digits");

  if (req.method === "POST") {
    try {
      const contentType = req.headers.get("content-type") || "";
      if (contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await req.formData();
        digits = formData.get("Digits")?.toString() || digits;
      }
    } catch (e) {
      console.error("Error reading body:", e);
    }
  }

  // Action / Routing based on pressed Key
  const action = url.searchParams.get("action");

  // IVR Selection Handling
  if (action === "handle-key" || digits) {
    if (digits === "1") {
      // Πωλήσεις -> Καλούμε το κινητό
      const salesTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="el-GR" voice="Polly.Gwineth">
        Συνδέεστε με το τμήμα Πωλήσεων της SGK Digital. Παρακαλώ περιμένετε.
    </Say>
    <Dial timeout="20" action="https://xrmvingehhiymchoggka.supabase.co/functions/v1/voice?action=voicemail">
        <Number>${PERSONAL_MOBILE}</Number>
    </Dial>
</Response>`;
      return new Response(salesTwiml, { headers: { "Content-Type": "text/xml; charset=utf-8" } });
    }

    if (digits === "2") {
      // Λογιστήριο -> Καλούμε το κινητό ή πηγαίνουμε σε αυτόματο τηλεφωνητή
      const accountingTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="el-GR" voice="Polly.Gwineth">
        Συνδέεστε με το Λογιστήριο της SGK Digital. Παρακαλώ περιμένετε.
    </Say>
    <Dial timeout="20" action="https://xrmvingehhiymchoggka.supabase.co/functions/v1/voice?action=voicemail">
        <Number>${PERSONAL_MOBILE}</Number>
    </Dial>
</Response>`;
      return new Response(accountingTwiml, { headers: { "Content-Type": "text/xml; charset=utf-8" } });
    }

    if (digits === "3") {
      // Τεχνική Υποστήριξη -> Απευθείας Τηλεφωνητής
      const supportTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="el-GR" voice="Polly.Gwineth">
        Επιλέξατε την Τεχνική Υποστήριξη. Παρακαλώ αφήστε το μήνυμά σας μετά τον ήχο.
    </Say>
    <Record 
        action="https://xrmvingehhiymchoggka.supabase.co/functions/v1/voicemail-callback" 
        maxLength="120" 
        playBeep="true" 
        finishOnKey="*"
    />
</Response>`;
      return new Response(supportTwiml, { headers: { "Content-Type": "text/xml; charset=utf-8" } });
    }
  }

  // Voicemail fallback (αν δεν απαντηθεί η προώθηση)
  if (action === "voicemail") {
    const voicemailTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="el-GR" voice="Polly.Gwineth">
        Όλοι οι εκπρόσωποι μας είναι απασχολημένοι. Παρακαλώ αφήστε το μήνυμά σας μετά τον χαρακτηριστικό ήχο και θα σας καλέσουμε άμεσα.
    </Say>
    <Record 
        action="https://xrmvingehhiymchoggka.supabase.co/functions/v1/voicemail-callback" 
        maxLength="120" 
        playBeep="true" 
        finishOnKey="*"
    />
    <Say language="el-GR" voice="Polly.Gwineth">
        Ευχαριστούμε για την κλήση σας. Γεια σας.
    </Say>
</Response>`;
    return new Response(voicemailTwiml, { headers: { "Content-Type": "text/xml; charset=utf-8" } });
  }

  // MAIN IVR MENU (Αρχικό Μενού Καλωσορίσματος με Gather για τα πλήκτρα 1, 2, 3)
  const mainIvrTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather numDigits="1" action="https://xrmvingehhiymchoggka.supabase.co/functions/v1/voice?action=handle-key" method="POST" timeout="10">
        <Say language="el-GR" voice="Polly.Gwineth">
            Καλώς ήρθατε στην SGK Digital Software Development. 
            Για το τμήμα Πωλήσεων, πατήστε 1. 
            Για το Λογιστήριο, πατήστε 2. 
            Για Τεχνική Υποστήριξη ή για να αφήσετε μήνυμα, πατήστε 3.
        </Say>
    </Gather>
    <!-- Αν ο χρήστης δεν πατήσει τίποτα εντός 10 δευτερολέπτων, προωθούμε αυτόματα στο κινητό -->
    <Say language="el-GR" voice="Polly.Gwineth">
        Παρακαλώ περιμένετε, συνδέεστε με εκπρόσωπο.
    </Say>
    <Dial timeout="20" action="https://xrmvingehhiymchoggka.supabase.co/functions/v1/voice?action=voicemail">
        <Number>${PERSONAL_MOBILE}</Number>
    </Dial>
</Response>`;

  return new Response(mainIvrTwiml, {
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
});
