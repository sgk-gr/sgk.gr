import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xrmvingehhiymchoggka.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const prospects = [
  {
    business_name: "Dental Care - Ειρήνη Βιέρου Βασιλείου",
    email: "odontiatreio.vierou@gmail.com",
    phone: null,
    city: "Ιωάννινα",
    industry: "οδοντιατρείο",
    status: "pending"
  },
  {
    business_name: "Δημήτριος Ροκάς - Οδοντίατρος",
    email: "dirok2025@gmail.com",
    phone: null,
    city: "Ιωάννινα",
    industry: "οδοντιατρείο",
    status: "pending"
  },
  {
    business_name: "Healthy Smile - Γεώργιος Στρογγυλός",
    email: "gstroggilos@gmail.com",
    phone: null,
    city: "Ιωάννινα",
    industry: "οδοντιατρείο",
    status: "pending"
  },
  {
    business_name: "Απόστολος Μερκουριάδης - Οδοντίατρος",
    email: "apomerk@gmail.com",
    phone: null,
    city: "Ιωάννινα",
    industry: "οδοντιατρείο",
    status: "pending"
  },
  {
    business_name: "Χρήστος Κωλέττης - Οδοντίατρος",
    email: "xristos.kolettis@gmail.com",
    phone: null,
    city: "Ιωάννινα",
    industry: "οδοντιατρείο",
    status: "pending"
  },
  {
    business_name: "Ξένια Παντάζη - Οδοντίατρος",
    email: "xenpantazi@gmail.com",
    phone: null,
    city: "Ιωάννινα",
    industry: "οδοντιατρείο",
    status: "pending"
  },
  {
    business_name: "Βασίλειος Στογιάννης - Stogiannis Dental Clinic",
    email: "vstogiannis13@gmail.com",
    phone: null,
    city: "Ιωάννινα",
    industry: "οδοντιατρείο",
    status: "pending"
  },
  {
    business_name: "Τηλέμαχος Κασιούμης - Οδοντίατρος",
    email: "tkasioumis@gmail.com",
    phone: null,
    city: "Ιωάννινα",
    industry: "οδοντιατρείο",
    status: "pending"
  },
  {
    business_name: "Ελευθέριος Συγκούνας - Periotherapy",
    email: "info.periotherapy@gmail.com",
    phone: null,
    city: "Ιωάννινα",
    industry: "οδοντιατρείο",
    status: "pending"
  },
  {
    business_name: "Στέφανος Σκανδάλης - Οδοντίατρος",
    email: "skandalisstefanos@gmail.com",
    phone: null,
    city: "Ιωάννινα",
    industry: "οδοντιατρείο",
    status: "pending"
  },
  {
    business_name: "Δημήτριος Τσιμπανίδης - Αισθητική Οδοντιατρική",
    email: "dimtsanis@gmail.com",
    phone: null,
    city: "Ιωάννινα",
    industry: "οδοντιατρείο",
    status: "pending"
  },
  {
    business_name: "Ευαγγελία Ζάχου - Zachou Endodontics",
    email: "zachoueva@gmail.com",
    phone: null,
    city: "Ιωάννινα",
    industry: "οδοντιατρείο",
    status: "pending"
  }
];

async function run() {
  console.log(`Inserting ${prospects.length} Ioannina dentist prospects into Supabase...`);
  
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
