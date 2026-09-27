import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, company, email, phone, details, packageType } = body;

        if (!name || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        const summaryHtml = `
            <h2>Νέα Εκδήλωση Ενδιαφέροντος για AI Agent! 🤖</h2>
            <p>Κάποιος συμπλήρωσε τη φόρμα στη νέα Landing Page του AI Agent.</p>
            <hr/>
            <ul>
                <li><strong>Ονοματεπώνυμο:</strong> ${name}</li>
                <li><strong>Εταιρεία:</strong> ${company || "Δεν δηλώθηκε"}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Τηλέφωνο:</strong> ${phone || "Δεν δηλώθηκε"}</li>
                <li><strong>Επιλεγμένο Πακέτο:</strong> ${packageType || "Δεν επέλεξε συγκεκριμένο"}</li>
            </ul>
            <h3>Περιγραφή Project:</h3>
            <p>${details ? details.replace(/\n/g, '<br/>') : "Δεν συμπληρώθηκε"}</p>
            <hr/>
            <p>Παρακαλούμε επικοινωνήστε μαζί του το συντομότερο.</p>
        `;

        const edgeResponse = await fetch(`${supabaseUrl}/functions/v1/send-nurture-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": supabaseServiceKey,
                "Authorization": `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({
                email: "info@sgk.gr", // SGK Digital contact email
                customSubject: `🚀 Νέο Lead για AI Agent - ${name} (${company || 'Ιδιώτης'})`,
                customHtml: summaryHtml,
            }),
        });

        if (!edgeResponse.ok) {
            console.error("Failed to send edge email", await edgeResponse.text());
            return NextResponse.json({ error: "Email failed to send via edge function" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Order AI error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
