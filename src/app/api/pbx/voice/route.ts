import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const zdEcho = searchParams.get("zd_echo");

  // Zadarma Verification Echo
  if (zdEcho) {
    return new Response(zdEcho, {
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });
  }

  const isVoicemail = searchParams.get("action") === "voicemail";

  if (isVoicemail) {
    const fallbackTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="el-GR" voice="Polly.Gwineth">
        Δυστυχώς δεν είναι δυνατή η απάντηση της κλήσης αυτή τη στιγμή. Παρακαλώ αφήστε το μήνυμά σας μετά τον χαρακτηριστικό ήχο.
    </Say>
    <Record 
        action="https://sgk.gr/api/pbx/voicemail-callback" 
        maxLength="120" 
        playBeep="true" 
        finishOnKey="*"
    />
    <Say language="el-GR" voice="Polly.Gwineth">
        Δεν λάβαμε κανένα μήνυμα. Ευχαριστούμε, γεια σας.
    </Say>
</Response>`;

    return new Response(fallbackTwiml, {
      headers: { "Content-Type": "text/xml; charset=utf-8" }
    });
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="el-GR" voice="Polly.Gwineth">
        Καλώς ήρθατε. Η κλήση σας προωθείται, παρακαλώ περιμένετε.
    </Say>
    <Dial timeout="20" action="https://sgk.gr/api/pbx/voice?action=voicemail">
        <Number>+306999524389</Number>
    </Dial>
</Response>`;

  return new Response(twiml, {
    headers: { "Content-Type": "text/xml; charset=utf-8" }
  });
}

export async function POST(req: Request) {
  return GET(req);
}
