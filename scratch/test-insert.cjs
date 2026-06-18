const { createClient } = require('@supabase/supabase-js');
const url = "https://xrmvingehhiymchoggka.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q";
const supabase = createClient(url, key);

async function testInsert() {
    const { data, error } = await supabase
        .from("sgk_mails")
        .insert([{
            type: "promo_barbershop",
            email: "test.barber.1234567@gmail.com",
            first_name: "Test",
            last_name: "User",
            phone: "6999999999",
            company: "Barbershop Promo",
            marketing_consent: true,
            email_sequence_step: 1
        }]);
    
    console.log("Error:", error);
    console.log("Data:", data);
}

testInsert();
