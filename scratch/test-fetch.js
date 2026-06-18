const url = "https://xrmvingehhiymchoggka.supabase.co/functions/v1/send-contact-email";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q";

async function test() {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${anonKey}`
        },
        body: JSON.stringify({
            type: "promo_barbershop",
            name: "Test User",
            email: "test.barber.12345@gmail.com",
            phone: "6999999999",
            company: "Barbershop Promo",
            contactPreference: "phone",
            marketingConsent: true
        })
    });
    console.log("Status:", res.status);
    const json = await res.json();
    console.log("Response:", json);
}
test();
