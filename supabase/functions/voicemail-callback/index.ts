import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  try {
    const formData = await req.formData();
    
    const callerNumber = formData.get("From")?.toString() || "Unknown";
    const recordingUrl = formData.get("RecordingUrl")?.toString() || "";
    const recordingDuration = parseInt(formData.get("RecordingDuration")?.toString() || "0");
    const callSid = formData.get("CallSid")?.toString() || "";
    const recordingSid = formData.get("RecordingSid")?.toString() || "";

    console.log(`[Voicemail Received] From: ${callerNumber}, URL: ${recordingUrl}`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://xrmvingehhiymchoggka.supabase.co";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { error } = await supabase.from("call_logs").insert({
        caller_number: callerNumber,
        recording_url: recordingUrl,
        recording_duration: recordingDuration,
        call_sid: callSid,
        recording_sid: recordingSid,
      });

      if (error) {
        console.error("Error saving call log:", error);
      }
    }

    const responseTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="el-GR" voice="Polly.Gwineth">
        Το μήνυμά σας αποθηκεύτηκε επιτυχώς. Ευχαριστούμε, γεια σας.
    </Say>
    <Hangup/>
</Response>`;

    return new Response(responseTwiml, {
      headers: { "Content-Type": "text/xml; charset=utf-8" },
    });
  } catch (err) {
    console.error("Webhook Error:", err);
    const fallbackTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="el-GR" voice="Polly.Gwineth">
        Το μήνυμά σας ελήφθη. Ευχαριστούμε.
    </Say>
    <Hangup/>
</Response>`;
    return new Response(fallbackTwiml, {
      headers: { "Content-Type": "text/xml; charset=utf-8" },
    });
  }
});
