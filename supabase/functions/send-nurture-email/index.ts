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
        const { email, step, unsubscribe_token, customSubject, customHtml } = payload;

        if (!email || (!step && !customSubject)) {
            throw new Error("Missing email, step or customSubject");
        }

        // Fetch coupon code and creation date to show reminder in nurturing emails
        const { data: leadData, error: leadError } = await supabase
            .from("sgk_mails")
            .select("coupon_code, created_at")
            .eq("email", email)
            .maybeSingle();

        const couponCode = leadData?.coupon_code;
        const createdAt = leadData?.created_at;

        let remainingDays = 60;
        if (createdAt) {
            const createdDate = new Date(createdAt);
            const currentDate = new Date();
            const diffTime = currentDate.getTime() - createdDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            remainingDays = Math.max(0, 60 - diffDays);
        }

        const couponBannerHTML = couponCode ? `
            <div style="background-color: #fff8f5; border: 2px dashed #FF6B00; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
                <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0; font-weight: bold;">Ο ΠΡΟΣΩΠΙΚΟΣ ΣΑΣ ΚΩΔΙΚΟΣ ΠΡΟΣΦΟΡΑΣ (Έκπτωση 300€)</p>
                <span style="font-family: monospace; font-size: 28px; font-weight: bold; color: #FF6B00; letter-spacing: 3px;">SGK-${couponCode}</span>
                <p style="color: #888; font-size: 12px; margin: 8px 0 0 0; font-weight: bold; color: #c25100;">💰 Τελική Τιμή Eshop: 1.200€ (αντί για 1.500€)</p>
                <p style="color: #888; font-size: 11px; margin: 8px 0 0 0;">⏳ Ισχύει για 1 χρήση • Απομένουν ${remainingDays} ημέρες για εξαργύρωση</p>
            </div>
        ` : '';

        let finalCustomHtml = customHtml || "";
        if (couponCode) {
            finalCustomHtml = finalCustomHtml.replace(/\{\{COUPON_BANNER\}\}/g, couponBannerHTML);
        } else {
            finalCustomHtml = finalCustomHtml.replace(/\{\{COUPON_BANNER\}\}/g, "");
        }

        let subject = customSubject || "";
        let htmlContent = "";
        const unsubscribeLink = `https://sgk.gr/unsubscribe?token=${unsubscribe_token}`;
        
        const footerHTML = `
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #888888; font-size: 13px; line-height: 1.5;">
                    Αυτό το email στάλθηκε επειδή ζητήσατε προσφορά για Eshop από το <strong>sgk.gr</strong>.<br>
                    <strong>SGK Software Development</strong> | <a href="https://sgk.gr" style="color: #FF6B00; text-decoration: none;">sgk.gr</a><br><br>
                    <a href="${unsubscribeLink}" style="color: #999; text-decoration: underline; font-size: 12px;">Κατάργηση εγγραφής (Unsubscribe)</a>
                </p>
            </div>
        `;

        if (customHtml) {
            htmlContent = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfaf8; padding: 40px 20px; border-radius: 16px; border: 1px solid #fbebe3;">
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                    ${finalCustomHtml}
                </div>
                ${footerHTML}
            </div>`;
        } else if (step === 2) {
            subject = "3 λόγοι που το eshop σου χάνει χρήματα";
            htmlContent = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfaf8; padding: 40px 20px; border-radius: 16px; border: 1px solid #fbebe3;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <span style="font-size: 40px;">⚠️</span>
                    <h1 style="color: #1a1a1a; margin: 10px 0 0 0; font-size: 24px; font-weight: 800;">3 Λόγοι που χάνεις πελάτες</h1>
                </div>
                
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-top: 0;">
                        Γεια σας, ελπίζουμε να είστε καλά! 
                    </p>
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                        Ξέρετε γιατί οι περισσότεροι επισκέπτες ενός eshop φεύγουν χωρίς να αγοράσουν; Μετά από εκατοντάδες projects, εντοπίσαμε τα 3 πιο συχνά λάθη:
                    </p>

                    <div style="margin: 30px 0;">
                        <h3 style="color: #a04100; margin-bottom: 5px;">1. Αργή ταχύτητα φόρτωσης (Το Νο.1 Πρόβλημα)</h3>
                        <p style="color: #666; font-size: 14px; margin-top: 0;">Αν το eshop σας κάνει πάνω από 3 δευτερόλεπτα να φορτώσει, χάνετε το 53% των πελατών σας. Στην SGK εγγυόμαστε αστραπιαίες ταχύτητες με VPS servers.</p>

                        <h3 style="color: #a04100; margin-bottom: 5px;">2. Κακή εμπειρία στο Κινητό (Mobile)</h3>
                        <p style="color: #666; font-size: 14px; margin-top: 0;">Πάνω από το 70% των αγορών γίνονται από κινητό. Τα eshops που φτιάχνουμε έχουν σχεδιαστεί πρωτίστως για κινητά τηλέφωνα (Mobile First).</p>

                        <h3 style="color: #a04100; margin-bottom: 5px;">3. Δεν εμφανίζεστε στο Skroutz</h3>
                        <p style="color: #666; font-size: 14px; margin-top: 0;">Το Skroutz είναι το μεγαλύτερο κανάλι πωλήσεων στην Ελλάδα. Η προσφορά μας στα 1.500€ περιλαμβάνει πλήρη, αυτοματοποιημένη διασύνδεση.</p>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="https://sgk.gr/eshop-offer" style="display: inline-block; background-color: #FF6B00; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 10px rgba(255, 107, 0, 0.3);">Λύστε αυτά τα προβλήματα σήμερα &rarr;</a>
                    </div>
                    ${couponBannerHTML}
                </div>
                ${footerHTML}
            </div>`;
        } else if (step === 3) {
            subject = "Πώς η Βάια τριπλασίασε τις πωλήσεις της 📈";
            htmlContent = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfaf8; padding: 40px 20px; border-radius: 16px; border: 1px solid #fbebe3;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <span style="font-size: 40px;">⭐</span>
                    <h1 style="color: #1a1a1a; margin: 10px 0 0 0; font-size: 24px; font-weight: 800;">Case Study: Vaia Charms</h1>
                </div>
                
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-top: 0;">
                        Όταν η Βάια ήρθε σε εμάς, ήθελε ένα eshop που όχι μόνο να δείχνει υπέροχο, αλλά και να πουλάει.
                    </p>

                    <div style="background-color: #fff0e6; padding: 20px; border-left: 4px solid #FF6B00; border-radius: 8px; margin: 25px 0;">
                        <p style="color: #a04100; margin: 0; font-size: 15px; font-style: italic;">
                            "Η ομάδα της SGK Digital κατάλαβε ακριβώς τι χρειαζόμουν. Το eshop μου είναι πανέμορφο, πάρα πολύ γρήγορο, και οι πωλήσεις μου έχουν ανέβει κατακόρυφα!"
                            <br><br><strong>- Βάια, Ιδιοκτήτρια Vaia Charms</strong>
                        </p>
                    </div>

                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                        Τι πετύχαμε:
                    </p>
                    <ul style="color: #666; font-size: 15px; line-height: 1.6;">
                        <li><strong>100/100 σκορ</strong> ταχύτητας στην Google</li>
                        <li><strong>Αυξημένο SEO</strong> με κορυφαίες κατατάξεις</li>
                        <li><strong>Απρόσκοπτη εμπειρία</strong> στο κινητό (mobile optimized)</li>
                    </ul>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="https://sgk.gr/eshop-offer" style="display: inline-block; background-color: #FF6B00; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 10px rgba(255, 107, 0, 0.3);">Αποκτήστε και εσείς ένα eshop σαν αυτό! &rarr;</a>
                    </div>
                    ${couponBannerHTML}
                </div>
                ${footerHTML}
            </div>`;
        } else if (step === 4) {
            subject = "Τελευταία ευκαιρία! ⏳ Προσφορά Eshop στα 1.500€";
            htmlContent = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfaf8; padding: 40px 20px; border-radius: 16px; border: 1px solid #fbebe3;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="background-color: #FF6B00; color: white; padding: 10px; border-radius: 8px; display: inline-block; font-weight: bold; margin-bottom: 15px;">ΠΕΡΙΟΡΙΣΜΕΝΟΣ ΧΡΟΝΟΣ</div>
                    <h1 style="color: #1a1a1a; margin: 0; font-size: 24px; font-weight: 800;">Τελευταία Ευκαιρία</h1>
                </div>
                
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; border: 2px solid #fff0e6; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-top: 0; text-align: center;">
                        Γεια σας! Ήρθαμε σε επαφή πριν λίγο καιρό σχετικά με το νέο σας Eshop.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 48px; font-weight: 900; color: #a04100;">1.500€</span><br>
                        <span style="color: #666; font-size: 14px;">Η προσφορά ολοκληρώνεται σύντομα.</span>
                    </div>

                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; text-align: center;">
                        Μην χάσετε την ευκαιρία να αποκτήσετε ένα επαγγελματικό eshop με <strong>δωρεάν φιλοξενία</strong> (1ος χρόνος), <strong>δωρεάν domain</strong> (2 χρόνια), <strong>σύνδεση Skroutz</strong> και <strong>εκπαίδευση</strong>.
                    </p>

                    <div style="text-align: center; margin-top: 35px;">
                        <a href="https://sgk.gr/eshop-offer" style="display: inline-block; background-color: #FF6B00; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(255, 107, 0, 0.4);">Κλείστε την Τιμή Τώρα &rarr;</a>
                    </div>
                    ${couponBannerHTML}
                </div>
                ${footerHTML}
            </div>`;
        }

        if (subject && htmlContent) {
            const emailResult = await resend.emails.send({
                from: "SGK Digital <noreply@sgk.gr>",
                to: [email],
                subject: subject,
                html: htmlContent
            });

            // Update database
            const updateData: any = {
                last_email_sent_at: new Date().toISOString()
            };
            if (step && !customSubject) {
                updateData.email_sequence_step = step;
            }
            const { error: dbError } = await supabase
                .from("sgk_mails")
                .update(updateData)
                .eq("email", email);

            if (dbError) {
                console.error("Database Update Error:", dbError);
            }

            return new Response(JSON.stringify(emailResult), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }

        return new Response(JSON.stringify({ message: "Invalid step" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });

    } catch (error: any) {
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
