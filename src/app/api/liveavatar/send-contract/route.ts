import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Basic safe base64
function safeEncodeBase64(data: any): string {
  try {
    const jsonStr = JSON.stringify(data);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = "";
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binary);
  } catch (e) {
    return "";
  }
}

export async function POST(req: Request) {
  try {
    const { afm, email } = await req.json();

    if (!afm || !email) {
      return NextResponse.json({ error: "Missing afm or email" }, { status: 400 });
    }

    // 1. Fetch GEMI Details via our own lookup endpoint (so we get representative names from YMS parsing)
    // We can call it locally if needed, but since this is an API route, we can just fetch the absolute URL.
    const host = req.headers.get("host") || "www.sgk.gr";
    const protocol = host.includes("localhost") ? "http" : "https";
    const gemiUrl = `${protocol}://${host}/api/gemi-lookup?query=${encodeURIComponent(afm)}`;
    
    let gemiRes = await fetch(gemiUrl);

    let gemiData: any = null;
    if (gemiRes.ok) {
      gemiData = await gemiRes.json();
    }

    if (!gemiData || !gemiData.success || !gemiData.company) {
        return NextResponse.json({ error: "Company not found in GEMI" }, { status: 404 });
    }

    const co = gemiData.company;
    
    // Parse fields
    const companyName = co.companyName || "";
    const tradeName = co.tradeName || companyName;
    const gemiNo = co.gemiNo || "";
    const city = co.city || "Αθήνα";
    const fullAddress = co.fullAddress || city;
    const representativeName = co.representativeName || "";
    const representativeFatherName = co.representativeFatherName || "";
    const representativeTitle = co.representativeTitle || "τον μοναδικό εταίρο και διαχειριστή αυτής";
    const representativeAfm = co.representativeAfm || "";
    const cleanDigits = co.clientAfm || afm.replace(/[^0-9]/g, "");

    // 2. Build Contract Data
    const contractData = {
      id: "contract_" + Date.now(),
      createdAt: new Date().toISOString(),
      contractDate: new Date().toISOString().split("T")[0],
      city: city || "Αθήνα",
      
      contractorName: "ΤΣΑΒΟΣ ΣΠΥΡΙΔΩΝ ΧΡΗΣΤΟΣ",
      contractorAddress: "Μεταμόρφωση Αττικής, οδός Ερμού 1 και Λυκοβρύσεως 14, Τ.Κ. 14452",
      contractorAfm: "131398972",
      contractorDoy: "ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ",
      contractorProfession: "Παροχή Υπηρεσιών Πληροφορικής",
    
      companyName: companyName,
      tradeName: tradeName.replace(/ (ΜΟΝΟΠΡΟΣΩΠΗ|Ι\.Κ\.Ε\.|Ι K E|IKE)/gi, "").trim() || companyName,
      gemiNo: gemiNo,
      representativeName: representativeName,
      representativeFatherName: representativeFatherName,
      representativeTitle: representativeTitle,
      representativeAfm: representativeAfm,
      clientAfm: cleanDigits,
      address: fullAddress,
    
      serviceType: "ike_gemi",
      serviceTitle: "Κατασκευή Ιστοσελίδας Εταιρικής Διαφάνειας (Στοιχεία ΓΕΜΗ)",
      serviceDescription: "Σχεδίαση, ανάπτυξη και παράδοση απλής ιστοσελίδας εταιρικής διαφάνειας με τα βασικά στοιχεία της επιχείρησης έναντι του Γ.Ε.ΜΗ., καταχώριση domain name (.gr) και φιλοξενία (hosting) 1ου έτους.",
    
      totalAmountNum: 150.00,
      totalAmountText: "εκατόν πενήντα ευρώ (150,00 €)",
      advanceAmountNum: 0.00,
      advanceAmountText: "μηδέν ευρώ (0,00 €)",
      remainingAmountNum: 0.00,
      remainingAmountText: "μηδέν ευρώ (0,00 €)",
      renewalAmountNum: 150.00,
      renewalAmountText: "εκατόν πενήντα ευρώ (150,00 €)",
      deliveryDaysNum: 5,
      deliveryDaysText: "πέντε (5)",
      ibanDetails: "GR4602601970000830201330337 (Eurobank), δικαιούχος Σπυρίδων Τσάβος",
      includeSignature: false,
    };

    const b64 = safeEncodeBase64(contractData);
    const docUrl = `https://www.sgk.gr/doc/contract?id=${contractData.id}&data=${b64}&download=1`;
    const companyLabel = contractData.tradeName || contractData.companyName || "";
    const amountLabel = "150,00 €";

    // 3. Build HTML Body
    const customHtml = `<p>Καλημέρα σας,</p>
<p>Σας στέλνουμε αυτό το μήνυμα σε συνέχεια της συνομιλίας σας με τον AI Tech Expert μας σχετικά με το νέο σας <strong>Website ${companyLabel}</strong></p>
<p>Στο παρόν email <strong>επισυνάπτουμε το ιδιωτικό συμφωνητικό συνεργασίας μας</strong>. Παρακαλούμε να το διαβάσετε και να το υπογράψετε.</p>

<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0;">
  <h3 style="margin-top: 0; color: #3b5bdb; font-size: 16px; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">💸 Στοιχεία Κατάθεσης</h3>
  <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; line-height: 1.5;">
    <tbody>
      <tr>
        <td style="padding: 6px 0px; font-weight: bold; color: #475569; width: 35%;">Ποσό:</td>
        <td style="padding: 6px 0px; color: #0f172a; font-weight: bold; font-size: 16px; width: 65%;">${amountLabel}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0px; font-weight: bold; color: #475569; width: 35%;">Τράπεζα:</td>
        <td style="padding: 6px 0px; color: #0f172a; width: 65%;">Eurobank</td>
      </tr>
      <tr>
        <td style="padding: 6px 0px; font-weight: bold; color: #475569; width: 35%;">Δικαιούχος:</td>
        <td style="padding: 6px 0px; color: #0f172a; font-weight: bold; width: 65%;">ΤΣΑΒΟΣ ΣΠΥΡΙΔΩΝ</td>
      </tr>
      <tr>
        <td style="padding: 6px 0px; font-weight: bold; color: #475569; vertical-align: top; width: 35%;">IBAN:</td>
        <td style="padding: 6px 0px; color: #0f172a; font-family: monospace; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; width: 65%;">GR4602601970000830201330337</td>
      </tr>
      <tr>
        <td style="padding: 6px 0px; font-weight: bold; color: #475569; width: 35%;">Αιτιολογία:</td>
        <td style="padding: 6px 0px; color: #475569; font-style: italic; width: 65%;">website ${companyLabel}</td>
      </tr>
    </tbody>
  </table>
</div>
<br/>
<div style="text-align: center; margin: 30px 0;">
  <a href="${docUrl}" style="background-color: #3b5bdb; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">📄 Λήψη Συμφωνητικού (PDF)</a>
</div>
<p>Παραμένουμε στη διάθεσή σας για οποιαδήποτε απορία ή διευκρίνιση.</p>
<p style="margin-top: 30px !important; border-top: 1px solid #f0f0f0; padding-top: 20px;">Με εκτίμηση,<br /><strong>Η ομάδα της SGK Software Development</strong></p>`;

    // 4. Send Email via Supabase Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const edgeResponse = await fetch(`${supabaseUrl}/functions/v1/send-nurture-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          customSubject: `Ιδιωτικό Συμφωνητικό Κατασκευής Ιστοσελίδας — ${companyLabel || "SGK Digital"}`,
          customHtml: customHtml,
          step: 1,
        }),
    });

    if (!edgeResponse.ok) {
        const errorText = await edgeResponse.text();
        console.warn("send-nurture-email notice:", edgeResponse.status, errorText);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, contractData });

  } catch (err: any) {
    console.error("send-contract error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
