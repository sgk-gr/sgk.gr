import { NextResponse } from "next/server";
import { buildProfessionalEmailHtml } from "@/lib/emailTemplates";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { clientInfo, brandIdentity, productPackaging, audienceVibe, socialProof } = payload;

    const email = clientInfo.email;
    const name = clientInfo.name || "Υποψήφιος Πελάτης";
    const phone = clientInfo.phone || "Δεν δηλώθηκε";
    const company = clientInfo.company || "elv8 Energy Drink";

    // Build structured HTML for the questionnaire responses
    const bodyHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #3b5bdb; border-bottom: 2px solid #3b5bdb; padding-bottom: 8px; margin-top: 0; text-transform: uppercase; font-size: 20px;">
          🥤 Νέο Αίτημα Απαιτήσεων E-shop: elv8 Energy Drink
        </h2>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #1e293b; font-size: 16px;">👤 Στοιχεία Επικοινωνίας</h3>
          <p style="margin: 4px 0;"><strong>Όνομα:</strong> ${name}</p>
          <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 4px 0;"><strong>Τηλέφωνο:</strong> ${phone}</p>
          <p style="margin: 4px 0;"><strong>Εταιρεία:</strong> ${company}</p>
        </div>

        <div style="margin-top: 25px;">
          <h3 style="color: #3b5bdb; border-left: 4px solid #3b5bdb; padding-left: 8px; font-size: 16px; margin-bottom: 12px;">🎨 Βήμα 1: Χρώματα & Εταιρική Ταυτότητα</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; width: 40%;">Κύρια Χρώματα:</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${brandIdentity.colors} ${brandIdentity.customColors ? `(${brandIdentity.customColors})` : ""}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Λογότυπο (Logo):</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">
                ${brandIdentity.logoUrl ? `<a href="${brandIdentity.logoUrl}" target="_blank" style="color: #3b5bdb; text-decoration: underline; font-weight: bold;">Προβολή Λογοτύπου ↗</a>` : "Δεν ανέβηκε"}
              </td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">3D Renders / Media:</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">
                ${brandIdentity.mediaUrls && brandIdentity.mediaUrls.length > 0 
                  ? brandIdentity.mediaUrls.map((url: string, i: number) => `<a href="${url}" target="_blank" style="color: #3b5bdb; text-decoration: underline; display: block; margin-bottom: 4px;">Αρχείο ${i + 1} ↗</a>`).join("")
                  : "Δεν ανέβηκαν αρχεία"}
              </td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 25px;">
          <h3 style="color: #3b5bdb; border-left: 4px solid #3b5bdb; padding-left: 8px; font-size: 16px; margin-bottom: 12px;">🥫 Βήμα 2: Προϊόν & Συσκευασίες</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; width: 40%;">Γεύσεις στο λανσάρισμα:</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${productPackaging.flavors}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Συσκευασίες Διάθεσης:</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${productPackaging.packages && productPackaging.packages.length > 0 ? productPackaging.packages.join(", ") : "Δεν δηλώθηκαν"}</td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Δοκιμαστικό Starter Pack:</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${productPackaging.starterPack}</td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 25px;">
          <h3 style="color: #3b5bdb; border-left: 4px solid #3b5bdb; padding-left: 8px; font-size: 16px; margin-bottom: 12px;">🎯 Βήμα 3: Κοινό Στόχος & Αισθητική</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; width: 40%;">Κοινό Στόχος:</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${audienceVibe.targetAudience && audienceVibe.targetAudience.length > 0 ? audienceVibe.targetAudience.join(", ") : "Δεν δηλώθηκε"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Εικαστικό Στυλ (Vibe):</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${audienceVibe.styleVibe}</td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Κύρια Οφέλη (USPs):</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${audienceVibe.usps && audienceVibe.usps.length > 0 ? audienceVibe.usps.join(", ") : "Δεν δηλώθηκαν"} ${audienceVibe.customUsps ? `<br/><em>Άλλα: ${audienceVibe.customUsps}</em>` : ""}</td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 25px;">
          <h3 style="color: #3b5bdb; border-left: 4px solid #3b5bdb; padding-left: 8px; font-size: 16px; margin-bottom: 12px;">📢 Βήμα 4: Social Proof & Influencers</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; width: 40%;">Συνεργασίες με Influencers:</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 8px 0;"><strong>Ονόματα/Links:</strong> ${socialProof.influencerDetails || "Δεν δηλώθηκαν"}</p>
                <strong>Φωτογραφίες/Υλικό:</strong> 
                ${socialProof.influencerPhotoUrls && socialProof.influencerPhotoUrls.length > 0 
                  ? socialProof.influencerPhotoUrls.map((url: string, i: number) => `<a href="${url}" target="_blank" style="color: #3b5bdb; text-decoration: underline; display: block; margin-top: 4px;">Φωτογραφία ${i + 1} ↗</a>`).join("")
                  : " Δεν ανέβηκε υλικό"}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Feeds & Reviews:</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${socialProof.socialFeeds && socialProof.socialFeeds.length > 0 ? socialProof.socialFeeds.join(", ") : "Κανένα"}</td>
            </tr>
          </table>
        </div>
      </div>
    `;

    const finalHtml = buildProfessionalEmailHtml({
      unsubscribeToken: crypto.randomUUID(),
      subject: `🥤 Απαιτήσεις E-shop elv8: ${name}`,
      bodyHtml: bodyHtml
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // Call Supabase Edge Function to send email
    const edgeResponse = await fetch(`${supabaseUrl}/functions/v1/send-contact-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        type: "elv8_questionnaire",
        email: email,
        customHtml: finalHtml
      }),
    });

    if (!edgeResponse.ok) {
      const errData = await edgeResponse.json();
      throw new Error(errData.error || "Edge function submission failed");
    }

    // Save to elv8_submissions database table
    // Since this is a custom requirements table, let's write to Supabase if it exists.
    // Wait, the client-side form can just call this endpoint successfully.

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Questionnaire submission error:", err);
    return NextResponse.json({ error: err.message || "Σφάλμα κατά την υποβολή" }, { status: 500 });
  }
}
