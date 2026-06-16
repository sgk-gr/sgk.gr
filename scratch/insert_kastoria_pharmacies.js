import fs from "fs";
import { createClient } from "@supabase/supabase-js";

// Read Supabase credentials from .env
const envContent = fs.readFileSync(".env", "utf-8");
const supabaseUrlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const supabaseUrl = supabaseUrlMatch ? supabaseUrlMatch[1].trim() : null;
const supabaseKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const supabaseAnonKey = supabaseKeyMatch ? supabaseKeyMatch[1].trim() : null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const prospects = [
  {
    business_name: "Φαρμακείο Παναγιωτίδου Δ. Μαρία",
    email: "panagiotidoumariakastoria@gmail.com",
    phone: null,
    city: "Καστοριά",
    industry: "φαρμακείο",
    status: "pending"
  },
  {
    business_name: "Φαρμακεία Γρηγοριάδη Ο.Ε.",
    email: "ioannisni90@gmail.com",
    phone: null,
    city: "Καστοριά",
    industry: "φαρμακείο",
    status: "pending"
  },
  {
    business_name: "Φαρμακείο Νικόλαος Κων. Ιωαννίδης",
    email: "nippon8791@yahoo.gr",
    phone: null,
    city: "Καστοριά",
    industry: "φαρμακείο",
    status: "pending"
  },
  {
    business_name: "Φαρμακείο Σμέρνου Αγνή",
    email: "agni_smernou@yahoo.gr",
    phone: null,
    city: "Καστοριά",
    industry: "φαρμακείο",
    status: "pending"
  },
  {
    business_name: "Φαρμακείο Γεώργιος Κ. Μακιέβ",
    email: "geomakiev@hotmail.com",
    phone: null,
    city: "Καστοριά",
    industry: "φαρμακείο",
    status: "pending"
  }
];

async function run() {
  console.log(`Inserting ${prospects.length} Kastoria pharmacies into Supabase...`);
  
  let inserted = 0;
  for (const p of prospects) {
    const { data, error } = await supabase
      .from("sgk_prospects")
      .upsert([p], { onConflict: "email" })
      .select();
      
    if (error) {
      console.error(`Error inserting ${p.email}:`, error.message);
    } else {
      console.log(`Successfully upserted: ${p.business_name} (${p.email})`);
      inserted++;
    }
  }
  
  console.log(`\nAll done! Successfully saved ${inserted} prospects.`);
}

run();
