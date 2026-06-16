import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xrmvingehhiymchoggka.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Testing connection to Supabase...");
  const { data, error } = await supabase.from("sgk_prospects").select("*").limit(1);
  if (error) {
    console.error("Error querying sgk_prospects:", error);
  } else {
    console.log("Success! Table exists. Data:", data);
  }
}

test();
