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
            marketingConsent,
            website,
            contactPreference
        } = payload;

        // Map simplified fields if present
        const finalFirstName = firstName || (name ? name.split(' ')[0] : '');
        const finalLastName = lastName || (name && name.includes(' ') ? name.split(' ').slice(1).join(' ') : '');
        const finalProjectInfo = projectInfo || message || '';


        // 1. Save to Database (checking for duplicates first)
        const { data: existingLead, error: checkError } = await supabase
            .from("sgk_mails")
            .select("coupon_code, unsubscribe_token")
            .eq("email", email)
            .maybeSingle();

        if (checkError) {
            console.error("Database Check Error:", checkError);
        }

        let unsubscribeToken = existingLead?.unsubscribe_token || crypto.randomUUID();
        let couponCode = existingLead?.coupon_code;
        const isNewLead = !existingLead;

        if (isNewLead) {
            couponCode = Math.floor(1000 + Math.random() * 9000).toString();
            
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
                    unsubscribe_token: unsubscribeToken,
                    coupon_code: type === "eshop_offer" ? couponCode : null
                }]);

            if (dbError) {
                console.error("Database Insert Error:", dbError);
            }
        } else {
            // Lead already exists, update all fields with the new submission details
            if (type === "eshop_offer" && !couponCode) {
                couponCode = Math.floor(1000 + Math.random() * 9000).toString();
            }
            
            const updatePayload: any = {
                type,
                first_name: finalFirstName,
                last_name: finalLastName,
                marketing_consent: marketingConsent,
                email_sequence_step: 1, // Reset nurture sequence
                unsubscribed: false, // Re-subscribe them since they filled out the form again
                coupon_code: couponCode,
                created_at: new Date().toISOString(), // Update timestamp to show latest submission
                last_email_sent_at: new Date().toISOString()
            };

            if (phone) updatePayload.phone = phone;
            if (company) updatePayload.company = company;
            if (howDidYouHear) updatePayload.how_did_you_hear = howDidYouHear;
            if (finalProjectInfo) updatePayload.project_info = finalProjectInfo;
            if (needsNDA) updatePayload.needs_nda = needsNDA;
            if (offerPrice) updatePayload.offer_price = offerPrice;

            const { error: dbError } = await supabase
                .from("sgk_mails")
                .update(updatePayload)
                .eq("email", email);

            if (dbError) {
                console.error("Database Update Error:", dbError);
            }
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
            const isPayAsYouGrow = offerPrice === "Pay as you grow (5% commission)";
            await resend.emails.send({
                from: "SGK Digital <noreply@sgk.gr>",
                to: ["info@sgk.gr"],
                subject: isNewLead 
                    ? `🔥 Νέο Αίτημα Προσφοράς Eshop από: ${email}` 
                    : `🔄 Διπλότυπο Αίτημα Προσφοράς Eshop από: ${email}`,
                html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333; border-bottom: 2px solid #FF6B00; padding-bottom: 10px;">
                    ${isNewLead ? 'Νέο Αίτημα Προσφοράς Eshop' : 'Επαναλαμβανόμενο Αίτημα Προσφοράς Eshop'}
                </h2>
                
                <div style="margin: 20px 0; display: grid; grid-template-cols: 1fr 1fr; gap: 10px;">
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Τηλέφωνο:</strong> ${phone || 'Δεν δηλώθηκε'}</p>
                    <p><strong>Τιμή Προσφοράς:</strong> ${isPayAsYouGrow ? 'Pay As You Grow (600€ + 5%)' : '1500€'}</p>
                    <p><strong>Marketing Consent:</strong> ${marketingConsent ? '✅ Ναι' : '❌ Όχι'}</p>
                </div>
            </div>
                `
            });

            // Eshop Offer User Confirmation Email
            let userEmailHtml = "";
            let userEmailSubject = "";

            if (isPayAsYouGrow) {
                userEmailSubject = "Συγχαρητήρια! 🎉 Το ταξίδι σας με το Pay As You Grow ξεκινάει";
                userEmailHtml = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Top Link -->
                <div style="text-align: right; padding: 10px 20px;">
                    <a href="https://sgk.gr/pay-as-you-grow" style="color: #3b5bdb; text-decoration: none; font-size: 10px;">Δες την online έκδοση</a>
                </div>

                <!-- Logo -->
                <div style="text-align: center; padding: 20px 0;">
                    <h1 style="margin: 0; font-size: 42px; font-weight: 800; letter-spacing: -2px; color: #000;">sgk<span style="color:#3b5bdb;">.</span></h1>
                </div>

                <!-- Color Strip -->
                <div style="display: flex; height: 12px; width: 100%;">
                    <div style="width: 15%; background-color: #3b5bdb;"></div>
                    <div style="width: 5%; background-color: #4ade80;"></div>
                    <div style="width: 80%; background-color: #ffffff;"></div>
                </div>

                <!-- Hero Area (Dark) -->
                <div style="background-color: #111111; color: #ffffff; padding: 50px 20px; text-align: center; position: relative;">
                    <h1 style="font-size: 60px; font-weight: 900; margin: 0; line-height: 1; letter-spacing: -2px; color: #ffffff;">Pay as you grow</h1>
                    <h3 style="font-size: 22px; margin: 10px 0 0 0; font-weight: 800; color: #ffffff;">Το ταξίδι σου <span style="color:#4ade80;">ξεκινάει</span></h3>
                </div>
                <div style="display: flex; height: 12px; width: 100%;">
                    <div style="width: 15%; background-color: #4ade80;"></div>
                    <div style="width: 85%; background-color: #3b5bdb;"></div>
                </div>

                <!-- Content Area -->
                <div style="padding: 40px 30px; color: #333333;">
                    <p style="font-size: 18px; font-weight: 600; margin-top: 0;">Λάβαμε με επιτυχία το αίτημά σου!</p>
                    <p style="font-size: 16px; margin-bottom: 40px;">Κάνατε το πρώτο βήμα για να αποκτήσετε ένα υπερσύγχρονο E-shop, εντελώς δωρεάν από ρίσκο.</p>

                    <p style="font-size: 18px; font-weight: 700; margin-bottom: 20px;">Το μοντέλο σου με μια ματιά:</p>
                    
                    <p style="font-size: 16px; margin-bottom: 15px; color: #444;"><span style="color:#3b5bdb; font-weight: 800; font-size: 20px;">600€</span> Setup Fee (Εφάπαξ)</p>
                    <p style="font-size: 16px; margin-bottom: 15px; color: #444;"><span style="color:#3b5bdb; font-weight: 800; font-size: 20px;">5%</span> προμήθεια επί των πωλήσεων</p>
                    <p style="font-size: 16px; margin-bottom: 30px; color: #444;">Αν δεν πουλάς, <strong style="color: #000;">δεν πληρώνεις απολύτως τίποτα!</strong> Και σε 12 μήνες, το Eshop είναι 100% δικό σου.</p>

                    <p style="font-size: 18px; font-weight: 700; margin-bottom: 20px;">Τι ακολουθεί;</p>
                    <p style="font-size: 16px; margin-bottom: 40px; color: #444;">Ένας εξειδικευμένος σύμβουλος θα επικοινωνήσει άμεσα μαζί σου για να ξεκινήσουμε!</p>

                    <p style="font-size: 18px; font-weight: 600; margin-bottom: 30px;">Η ομάδα της SGK Digital 💙</p>
                </div>

                <!-- Blue Footer -->
                <div style="position: relative;">
                    <!-- Top strips -->
                    <div style="display: flex; height: 12px; width: 100%;">
                        <div style="width: 75%; background-color: #d1d5db;"></div>
                        <div style="width: 25%; background-color: #facc15;"></div>
                    </div>
                    
                    <div style="background-color: #3b5bdb; color: #ffffff; padding: 40px 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 38px; font-weight: 800; letter-spacing: -2px; color: #ffffff;">sgk<span style="color:#4ade80;">.</span></h1>
                        
                        <div style="margin: 20px 0;">
                            <a href="https://www.facebook.com/profile.php?id=61552383862787" target="_blank" style="color: #ffffff; text-decoration: none; margin: 0 8px; font-weight: bold; border: 1px solid white; border-radius: 50%; padding: 5px 10px;">f</a>
                            <a href="https://www.tiktok.com/@sgk.gr?is_from_webapp=1&sender_device=pc" target="_blank" style="color: #ffffff; text-decoration: none; margin: 0 8px; font-weight: bold; border: 1px solid white; border-radius: 50%; padding: 5px 10px;">t</a>
                        </div>
                        
                        <div style="font-size: 11px; margin: 20px 0; color: #ffffff; line-height: 1.5;">
                            <strong>SGK Software Development</strong><br/>
                            ΑΦΜ: 131398972 | ΔΟΥ: ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ<br/>
                            Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής<br/>
                            📞 6999 524 389 | ✉️ <a href="mailto:info@sgk.gr" style="color: #ffffff; text-decoration: none;">info@sgk.gr</a>
                        </div>

                        <p style="font-size: 11px; margin: 20px 0 0 0; color: #ffffff;">
                            <a href="https://sgk.gr/terms" style="color: #ffffff; text-decoration: underline; font-weight: bold;">Όροι Χρήσης</a> | 
                            <a href="https://sgk.gr/privacy" style="color: #ffffff; text-decoration: underline; font-weight: bold;">Πολιτική Απορρήτου</a>
                        </p>
                        <p style="font-size: 11px; margin: 5px 0 0 0; color: #ffffff;">
                            Copyright 2026. All rights reserved.
                        </p>
                    </div>
                </div>

                <!-- Unsubscribe -->
                <div style="background-color: #f4f4f5; padding: 20px; text-align: left; font-size: 11px; color: #666666;">
                    If you have reason to believe that you are not the intended recipient or you wish to unsubscribe from this mailing list please visit the following link 
                    <a href="https://sgk.gr/unsubscribe?token=${unsubscribeToken}" style="color: #3b5bdb; text-decoration: underline;">(unsubscribe)</a>.
                </div>
            </div>`;
            } else {
                userEmailSubject = "Σας έχουμε ένα δώρο! 🎁 Προσφορά για την κατασκευή του Eshop σας";
                userEmailHtml = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfaf8; padding: 40px 20px; border-radius: 16px; border: 1px solid #fbebe3;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1a1a1a; margin: 0; font-size: 24px; font-weight: 800;">Ευχαριστούμε! 🎉</h1>
                </div>
                
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-top: 0;">
                        Λάβαμε με επιτυχία το αίτημά σας για την κατασκευή του Eshop σας!
                    </p>
                    
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                        Η αρχική τιμή της προσφοράς μας είναι 1.500€, αλλά <strong>με τον προσωπικό σας κωδικό προσφοράς (κουπόνι), η τελική τιμή διαμορφώνεται στα 1.200€!</strong>
                    </p>
                    
                    <div style="background-color: #fff8f5; border: 2px dashed #FF6B00; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
                        <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0; font-weight: bold;">Ο ΜΟΝΑΔΙΚΟΣ ΣΑΣ ΚΩΔΙΚΟΣ ΠΡΟΣΦΟΡΑΣ (Έκπτωση 300€)</p>
                        <span style="font-family: monospace; font-size: 32px; font-weight: bold; color: #FF6B00; letter-spacing: 4px;">SGK-${couponCode}</span>
                        <p style="color: #888; font-size: 13px; margin: 8px 0 0 0; font-weight: bold; color: #c25100;">💰 Τελική Τιμή Eshop: 1.200€ (αντί για 1.500€)</p>
                        <p style="color: #888; font-size: 11px; margin: 8px 0 0 0;">⏳ Ισχύει για 1 χρήση • Λήξη σε 60 ημέρες</p>
                    </div>
                    
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
                                <strong>Google Shopping & Ads:</strong> Έτοιμη διασύνδεση για διαφημίσεις προϊόντων στην Google.
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
            }

            emailResult = await resend.emails.send({
                from: "SGK Digital <noreply@sgk.gr>",
                to: [email],
                subject: userEmailSubject,
                html: userEmailHtml
            });
        } else if (type === "promo_barbershop") {
            // Promo Barbershop Admin Email
            await resend.emails.send({
                from: "SGK Digital <noreply@sgk.gr>",
                to: ["info@sgk.gr"],
                subject: `✂️ Νέο Lead Κομμωτηρίου από: ${email}`,
                html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333; border-bottom: 2px solid #3b5bdb; padding-bottom: 10px;">
                    Νέο Αίτημα από την Landing Page Κομμωτηρίων
                </h2>
                
                <div style="margin: 20px 0; display: grid; grid-template-cols: 1fr 1fr; gap: 10px;">
                    <p><strong>Όνομα:</strong> ${finalFirstName} ${finalLastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Τηλέφωνο:</strong> ${phone || 'Δεν δηλώθηκε'}</p>
                    <p><strong>Προτίμηση Επικοινωνίας:</strong> ${contactPreference === 'email' ? 'Με email 📧' : (contactPreference === 'phone' ? 'Στο τηλέφωνο 📞' : 'Δεν δηλώθηκε')}</p>
                    <p><strong>Κομμωτήριο:</strong> ${company || 'Δεν δηλώθηκε'}</p>
                    <p><strong>Marketing Consent:</strong> ${marketingConsent ? '✅ Ναι' : '❌ Όχι'}</p>
                    <p><strong>Έκπτωση (Κουπόνι):</strong> 150€ 🎁</p>
                </div>
            </div>
                `
            });

            // Promo Barbershop User Email
            emailResult = await resend.emails.send({
                from: "SGK Digital <noreply@sgk.gr>",
                to: [email],
                subject: "Το ψηφιακό σου κομμωτήριο ετοιμάζεται! ✂️",
                html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Top Link -->
                <div style="text-align: right; padding: 10px 20px;">
                    <a href="https://sgk.gr/promo/barbershop" style="color: #3b5bdb; text-decoration: none; font-size: 10px;">Δες την online έκδοση</a>
                </div>

                <!-- Logo -->
                <div style="text-align: center; padding: 20px 0;">
                    <h1 style="margin: 0; font-size: 42px; font-weight: 800; letter-spacing: -2px; color: #000;">sgk<span style="color:#3b5bdb;">.</span></h1>
                </div>

                <!-- Color Strip -->
                <div style="display: flex; height: 12px; width: 100%;">
                    <div style="width: 15%; background-color: #3b5bdb;"></div>
                    <div style="width: 5%; background-color: #4ade80;"></div>
                    <div style="width: 80%; background-color: #ffffff;"></div>
                </div>

                <!-- Hero Area (Dark) -->
                <div style="background-color: #111111; color: #ffffff; padding: 50px 20px; text-align: center; position: relative;">
                    <div style="background-color: #4ade80; color: #111; display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-bottom: 15px;">Πρόλαβε το!</div>
                    <h1 style="font-size: 80px; font-weight: 900; margin: 0; line-height: 1; letter-spacing: -3px; color: #ffffff;">150€</h1>
                    <h3 style="font-size: 26px; margin: 10px 0 0 0; font-weight: 800; color: #ffffff;">WELCOME <span style="color:#4ade80;">REWARD</span></h3>
                </div>
                <div style="display: flex; height: 12px; width: 100%;">
                    <div style="width: 15%; background-color: #4ade80;"></div>
                    <div style="width: 85%; background-color: #3b5bdb;"></div>
                </div>

                <!-- Content Area -->
                <div style="padding: 40px 30px; color: #333333;">
                    <p style="font-size: 18px; font-weight: 600; margin-top: 0;">150€ για την ψηφιακή αναβάθμισή σου σε περιμένουν!</p>
                    <p style="font-size: 16px; margin-bottom: 40px;">Ένα welcome reward που θα μιλήσει στο ταμείο σου!</p>

                    <p style="font-size: 18px; font-weight: 700; margin-bottom: 20px;">Είσαι 3 βήματα μακριά:</p>
                    
                    <p style="font-size: 16px; margin-bottom: 15px; color: #444;">1. <span style="color:#3b5bdb; font-weight: 600;">Λάβαμε</span> ήδη τα στοιχεία σου.</p>
                    <p style="font-size: 16px; margin-bottom: 15px; color: #444;">${contactPreference === 'email' ? '2. Θα επικοινωνήσουμε άμεσα μαζί σου μέσω email. <span style="color: #aaa; font-style: italic;">(Μην ανησυχείς, δεν στέλνουμε spam! 🤫)</span>' : '2. Θα σε καλέσουμε σύντομα! <span style="color: #aaa; font-style: italic;">(Δεν θα σε ζαλίσουμε στα τηλέφωνα, είμαστε διακριτικοί! 🤫)</span>'}</p>
                    <p style="font-size: 16px; margin-bottom: 40px; color: #444;">3. Κερδίζεις τα 150€ αυτόματα στην κατασκευή του site σου.</p>

                    <p style="font-size: 18px; font-weight: 600; margin-bottom: 30px;">Η ομάδα της SGK Digital 💙</p>
                </div>

                <!-- Blue Footer -->
                <div style="position: relative;">
                    <!-- Top strips -->
                    <div style="display: flex; height: 12px; width: 100%;">
                        <div style="width: 75%; background-color: #d1d5db;"></div>
                        <div style="width: 25%; background-color: #facc15;"></div>
                    </div>
                    
                    <div style="background-color: #3b5bdb; color: #ffffff; padding: 40px 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 38px; font-weight: 800; letter-spacing: -2px; color: #ffffff;">sgk<span style="color:#4ade80;">.</span></h1>
                        
                        <div style="margin: 20px 0;">
                            <a href="https://www.facebook.com/profile.php?id=61552383862787" target="_blank" style="color: #ffffff; text-decoration: none; margin: 0 8px; font-weight: bold; border: 1px solid white; border-radius: 50%; padding: 5px 10px;">f</a>
                            <a href="https://www.tiktok.com/@sgk.gr?is_from_webapp=1&sender_device=pc" target="_blank" style="color: #ffffff; text-decoration: none; margin: 0 8px; font-weight: bold; border: 1px solid white; border-radius: 50%; padding: 5px 10px;">t</a>
                        </div>
                        
                        <div style="font-size: 11px; margin: 20px 0; color: #ffffff; line-height: 1.5;">
                            <strong>SGK Software Development</strong><br/>
                            ΑΦΜ: 131398972 | ΔΟΥ: ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ<br/>
                            Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής<br/>
                            📞 6999 524 389 | ✉️ <a href="mailto:info@sgk.gr" style="color: #ffffff; text-decoration: none;">info@sgk.gr</a>
                        </div>

                        <p style="font-size: 11px; margin: 20px 0 0 0; color: #ffffff;">
                            <a href="https://sgk.gr/terms" style="color: #ffffff; text-decoration: underline; font-weight: bold;">Όροι Χρήσης</a> | 
                            <a href="https://sgk.gr/privacy" style="color: #ffffff; text-decoration: underline; font-weight: bold;">Πολιτική Απορρήτου</a>
                        </p>
                        <p style="font-size: 11px; margin: 5px 0 0 0; color: #ffffff;">
                            Copyright 2026. All rights reserved.
                        </p>
                    </div>
                </div>

                <!-- Unsubscribe -->
                <div style="background-color: #f4f4f5; padding: 20px; text-align: left; font-size: 11px; color: #666666;">
                    If you have reason to believe that you are not the intended recipient or you wish to unsubscribe from this mailing list please visit the following link 
                    <a href="https://sgk.gr/unsubscribe?token=${unsubscribeToken}" style="color: #3b5bdb; text-decoration: underline;">(unsubscribe)</a>.
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
                    <p><strong>Εταιρεία/Eshop:</strong> ${company || website || 'Δεν δηλώθηκε'}</p>
                    <p><strong>Website/URL:</strong> ${website || 'Δεν δηλώθηκε'}</p>
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
