import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const payload = await req.json();
        const {
            type = "estimate",
            firstName,
            lastName,
            name, // Fallback for name
            email,
            phone,
            company,
            howDidYouHear,
            projectInfo,
            message, // Fallback for message
            needsNDA,
            offerPrice,
            marketingConsent
        } = payload;

        // Map simplified fields if present
        const finalFirstName = firstName || (name ? name.split(' ')[0] : '');
        const finalLastName = lastName || (name && name.includes(' ') ? name.split(' ').slice(1).join(' ') : '');
        const finalProjectInfo = projectInfo || message || '';


        // 1. Save to Database
        const unsubscribeToken = crypto.randomUUID();
        
        const { error: dbError } = await supabase
            .from("sgk_mails")
            .insert([{
                type,
                email,
                first_name: finalFirstName,
                last_name: finalLastName,
                phone,
                company,
                how_did_you_hear: howDidYouHear,
                project_info: finalProjectInfo,
                needs_nda: needsNDA,
                offer_price: offerPrice,
                marketing_consent: marketingConsent,
                email_sequence_step: 1,
                unsubscribe_token: unsubscribeToken
            }]);

        if (dbError) {
            console.error("Database Insert Error:", dbError);
        }

        // 2. Send Emails
        let emailResult;

        if (type === "newsletter") {
            // Newsletter Specific Email
            emailResult = await resend.emails.send({
                from: "SGK Digital <noreply@sgk.gr>",
                to: ["info@sgk.gr"],
                subject: `📩 Νέα εγγραφή στο Newsletter: ${email}`,
                html: `<p>Νέα εγγραφή στο newsletter από το <strong>${email}</strong></p>`
            });
        } else if (type === "eshop_offer") {
            // Eshop Offer Admin Email
            await resend.emails.send({
                from: "SGK Digital <noreply@sgk.gr>",
                to: ["info@sgk.gr"],
                subject: `🔥 Νέο Αίτημα Προσφοράς Eshop από: ${email}`,
                html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333; border-bottom: 2px solid #FF6B00; padding-bottom: 10px;">Νέο Αίτημα Προσφοράς Eshop 1500€</h2>
                
                <div style="margin: 20px 0; display: grid; grid-template-cols: 1fr 1fr; gap: 10px;">
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Τιμή Προσφοράς:</strong> 1500€</p>
                    <p><strong>Marketing Consent:</strong> ${marketingConsent ? '✅ Ναι' : '❌ Όχι'}</p>
                </div>
            </div>
                `
            });

            // Eshop Offer User Confirmation Email
            emailResult = await resend.emails.send({
                from: "SGK Digital <noreply@sgk.gr>",
                to: [email],
                subject: "Λάβαμε το αίτημά σας για προσφορά Eshop!",
                html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfaf8; padding: 40px 20px; border-radius: 16px; border: 1px solid #fbebe3;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1a1a1a; margin: 0; font-size: 24px; font-weight: 800;">Ευχαριστούμε! 🎉</h1>
                </div>
                
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-top: 0;">
                        Λάβαμε με επιτυχία το αίτημά σας για την <strong>κατασκευή Eshop με την προσφορά των 1.500€</strong>.
                    </p>
                    
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                        Ένας εξειδικευμένος συνεργάτης της ομάδας μας θα επικοινωνήσει σύντομα μαζί σας μέσω email για να συζητήσουμε τις λεπτομέρειες του project σας και τα επόμενα βήματα.
                    </p>
                    
                    <div style="background-color: #fff0e6; padding: 15px 20px; border-left: 4px solid #FF6B00; border-radius: 4px; margin: 25px 0;">
                        <p style="color: #c25100; margin: 0; font-size: 15px; font-weight: 600;">
                            🚀 Ετοιμαστείτε για αστραπιαίες ταχύτητες και κορυφαίες πωλήσεις!
                        </p>
                    </div>

                    <div style="margin-top: 30px; border-top: 1px solid #f0f0f0; padding-top: 25px;">
                        <h2 style="color: #1a1a1a; font-size: 18px; font-weight: 700; margin-bottom: 5px;">Όλα όσα περιλαμβάνει το πακέτο σας</h2>
                        <p style="color: #666; font-size: 14px; margin-top: 0; margin-bottom: 20px;">Πλήρης λύση χωρίς κρυφά κόστη, σχεδιασμένη για να πουλάτε από την πρώτη μέρα.</p>
                        
                        <ul style="list-style: none; padding: 0; margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.5;">
                            <li style="margin-bottom: 12px; padding-left: 20px; position: relative;">
                                <span style="position: absolute; left: 0; top: 0;">🌐</span>
                                <strong>Φιλοξενία (Hosting):</strong> Δωρεάν για τον 1ο χρόνο. VPS Server για αστραπιαίες ταχύτητες. (180€/έτος μετά)
                            </li>
                            <li style="margin-bottom: 12px; padding-left: 20px; position: relative;">
                                <span style="position: absolute; left: 0; top: 0;">📝</span>
                                <strong>Domain Name:</strong> Δωρεάν για 2 χρόνια. (20€/έτος μετά)
                            </li>
                            <li style="margin-bottom: 12px; padding-left: 20px; position: relative;">
                                <span style="position: absolute; left: 0; top: 0;">🔒</span>
                                <strong>Ασφάλεια & Πληρωμές:</strong> Δωρεάν SSL. Σύνδεση με τράπεζες και IRIS.
                            </li>
                            <li style="margin-bottom: 12px; padding-left: 20px; position: relative;">
                                <span style="position: absolute; left: 0; top: 0;">🚀</span>
                                <strong>Ταχύτητα & SEO:</strong> Βελτιστοποίηση για μέγιστη ταχύτητα και εμφάνιση στην 1η σελίδα της Google.
                            </li>
                            <li style="margin-bottom: 12px; padding-left: 20px; position: relative;">
                                <span style="position: absolute; left: 0; top: 0;">🛒</span>
                                <strong>Διασύνδεση Skroutz:</strong> Πλήρης διασύνδεση με το Skroutz Marketplace.
                            </li>
                            <li style="margin-bottom: 12px; padding-left: 20px; position: relative;">
                                <span style="position: absolute; left: 0; top: 0;">📦</span>
                                <strong>Απεριόριστα Προϊόντα:</strong> Δημιουργήστε απεριόριστες κατηγορίες και προϊόντα χωρίς περιορισμό.
                            </li>
                            <li style="margin-bottom: 12px; padding-left: 20px; position: relative;">
                                <span style="position: absolute; left: 0; top: 0;">🚚</span>
                                <strong>Τρόποι Πληρωμής & Courier:</strong> Διασύνδεση με όλες τις δημοφιλείς εταιρείες.
                            </li>
                            <li style="margin-bottom: 12px; padding-left: 20px; position: relative;">
                                <span style="position: absolute; left: 0; top: 0;">🎓</span>
                                <strong>Εκμάθηση Πλατφόρμας:</strong> Σας εκπαιδεύουμε στην αποτελεσματική διαχείριση παραγγελιών.
                            </li>
                            <li style="margin-bottom: 12px; padding-left: 20px; position: relative;">
                                <span style="position: absolute; left: 0; top: 0;">🔄</span>
                                <strong>Σύνδεση με ERP Συστήματα:</strong> Πλήρης διασύνδεση με το ERP σύστημά σας (Soft1, Entersoft κ.α.).
                            </li>
                            <li style="margin-bottom: 12px; padding-left: 20px; position: relative;">
                                <span style="position: absolute; left: 0; top: 0;">🛡️</span>
                                <strong>Εγγύηση Επιστροφής Χρημάτων:</strong> Αν δεν πετύχει κορυφαία σκορ ταχύτητας, σας επιστρέφουμε τα χρήματά σας.
                            </li>
                        </ul>
                    </div>
                    
                    <div style="margin-top: 30px; border: 1px solid #ffccb3; background-color: #fff9f5; border-radius: 12px; padding: 20px; text-align: left;">
                        <h3 style="color: #c25100; font-size: 18px; margin-top: 0; margin-bottom: 10px;">Δες το eshop που φτιάξαμε για την Βάια!</h3>
                        <p style="color: #4a4a4a; font-size: 14px; line-height: 1.5; margin-bottom: 15px;">
                            To <strong>Vaia Charms</strong>, κατασκευασμένο με 100% έμφαση στην ταχύτητα, το SEO και τα χρώματα που ονειρεύτηκε η πελάτισσά μας.
                        </p>
                        <a href="https://www.vaiacharms.gr/" style="display: inline-block; background-color: #c25100; color: #ffffff; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 14px;">Δείτε το Project &rarr;</a>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #888888; font-size: 13px; line-height: 1.5;">
                        Αυτό το email στάλθηκε αυτόματα. Παρακαλούμε μην απαντήσετε σε αυτό το μήνυμα.<br>
                        <strong>SGK Software Development</strong> | <a href="https://sgk.gr" style="color: #FF6B00; text-decoration: none;">sgk.gr</a><br><br>
                        <a href="https://sgk.gr/unsubscribe?token=${unsubscribeToken}" style="color: #999; text-decoration: underline; font-size: 12px;">Κατάργηση εγγραφής (Unsubscribe)</a>
                    </p>
                </div>
            </div>
                `
            });
        } else {
            // Estimate Specific Email
            const offerSection = offerPrice
                ? `<div style="background:#FFF8E1;padding:16px;border-radius:8px;border-left:4px solid #C5A267;margin:16px 0;">
                    <p style="margin:0;font-weight:bold;color:#C5A267;">⚡ Προσφορά Eshop Demo</p>
                    <p style="margin:4px 0 0;font-size:18px;font-weight:bold;">Τιμή προσφοράς: €${offerPrice}</p>
                   </div>`
                : '';

            emailResult = await resend.emails.send({
                from: "SGK Digital <noreply@sgk.gr>",
                to: ["info@sgk.gr"],
                subject: finalProjectInfo
                    ? `🚀 Νέο Project: ${finalFirstName} ${finalLastName}`
                    : `🟡 Νέο αίτημα επικοινωνίας - SGK Digital`,
                html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333; border-bottom: 2px solid #00D16B; padding-bottom: 10px;">Νέο αίτημα Εκτίμησης Έργου</h2>
                
                <div style="margin: 20px 0; display: grid; grid-template-cols: 1fr 1fr; gap: 10px;">
                    <p><strong>Όνομα:</strong> ${finalFirstName} ${finalLastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Τηλέφωνο:</strong> ${phone || 'Δεν δηλώθηκε'}</p>
                    <p><strong>Εταιρεία:</strong> ${company || 'Δεν δηλώθηκε'}</p>
                    <p><strong>Πηγή:</strong> ${howDidYouHear || 'Δεν δηλώθηκε'}</p>
                    <p><strong>Χρειάζεται NDA:</strong> ${needsNDA === 'Yes' ? '✅ Ναι' : '❌ Όχι'}</p>
                </div>

                ${finalProjectInfo ? `
                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; font-size: 16px;">Περιγραφή Έργου:</h3>
                    <p style="white-space: pre-wrap;">${finalProjectInfo}</p>
                </div>
                ` : ''}

                ${offerSection}
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 12px; color: #999; text-align: center;">
                    Αυτό το μήνυμα στάλθηκε αυτόματα από το σύστημα της <strong>SGK Digital</strong>.
                </p>
            </div>
          `,
            });
        }
        return new Response(JSON.stringify(emailResult), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 500,
            }
        );
    }
});
