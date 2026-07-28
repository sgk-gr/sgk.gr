import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PERSONAL_MOBILE = "+306999524389";

serve(async (req: Request) => {
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const isVoicemail = url.searchParams.get("action") === "voicemail";

  if (isVoicemail) {
    const fallbackTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="el-GR" voice="Polly.Gwineth">
        Δυστυχώς δεν είναι δυνατή η απάντηση της κλήσης αυτή τη στιγμή. Παρακαλώ αφήστε το μήνυμά σας μετά τον χαρακτηριστικό ήχο.
    </Say>
    <Record 
        action="https://xrmvingehhiymchoggka.supabase.co/functions/v1/voicemail-callback" 
        maxLength="120" 
        playBeep="true" 
        finishOnKey="*"
    />
    <Say language="el-GR" voice="Polly.Gwineth">
        Δεν λάβαμε κανένα μήνυμα. Ευχαριστούμε, γεια σας.
    </Say>
</Response>`;

    return new Response(fallbackTwiml, {
      headers: { "Content-Type": "text/xml; charset=utf-8" },
    });
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="el-GR" voice="Polly.Gwineth">
        Καλώς ήρθατε. Η κλήση σας προωθείται, παρακαλώ περιμένετε.
    </Say>
    <Dial timeout="20" action="https://xrmvingehhiymchoggka.supabase.co/functions/v1/voice?action=voicemail">
        <Number>${PERSONAL_MOBILE}</Number>
    </Dial>
</Response>`;

  return new Response(twiml, {
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
});
