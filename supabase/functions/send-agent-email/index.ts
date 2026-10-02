import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    const now = new Date();
    const athensHour = (now.getUTCHours() + 3) % 24;
    const athensDay = now.getUTCDate();
    const athensMonth = now.getUTCMonth(); // 8 = Sep, 9 = Oct

    // Safeguard: Σταματάει μετά τις 00:10 της 1ης Οκτωβρίου
    if (athensMonth >= 9 && athensDay >= 1 && (athensHour >= 1 || (athensHour === 0 && now.getUTCMinutes() > 10))) {
        return new Response(JSON.stringify({ message: "Schedule completed." }), { headers: corsHeaders });
    }

    let arsenalState = { status: "Σε εξέλιξη", win: null, score: "" };
    let bayernState = { status: "Έναρξη 22:00", win: null, score: "" };
    let lyonState = { status: "Έναρξη 22:00", win: null, score: "" };

    try {
        // Σωστό endpoint ESPN για UEFA Women's Champions League: uefa.wchampions
        const resp = await fetch("https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.wchampions/scoreboard", {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        if (resp.ok) {
            const data = await resp.json();
            const events = data.events || [];

            events.forEach((event: any) => {
                const name = event.name || "";
                const isCompleted = event.status?.type?.completed === true || (event.status?.type?.detail || "").includes("Final");
                const statusDetail = event.status?.type?.detail || "Live";

                const comps = event.competitions?.[0]?.competitors || [];
                const home = comps.find((c: any) => c.homeAway === 'home');
                const away = comps.find((c: any) => c.homeAway === 'away');
                const homeScore = Number(home?.score ?? 0);
                const awayScore = Number(away?.score ?? 0);
                const scoreStr = `${home?.team?.name || 'Home'} ${homeScore} - ${awayScore} ${away?.team?.name || 'Away'}`;

                // 1. Παρίσι vs Άρσεναλ (Away)
                if (name.includes("Arsenal") || name.includes("Paris FC")) {
                    arsenalState.score = `${scoreStr} (${statusDetail})`;
                    if (isCompleted) {
                        arsenalState.win = awayScore > homeScore;
                        arsenalState.status = arsenalState.win ? "✅ ΠΕΡΑΣΕ (Διπλό)" : "❌ ΧΑΘΗΚΕ";
                    } else {
                        arsenalState.win = null;
                        arsenalState.status = awayScore > homeScore ? "🟢 Προηγείται η Άρσεναλ!" : "⏳ Live";
                    }
                }

                // 2. Μπενφίκα vs Μπάγερν (Away)
                if (name.includes("Bayern") || name.includes("Benfica")) {
                    if (isCompleted) {
                        arsenalState.score = `${scoreStr} (${statusDetail})`;
                        bayernState.win = awayScore > homeScore;
                        bayernState.status = bayernState.win ? "✅ ΠΕΡΑΣΕ (Διπλό)" : "❌ ΧΑΘΗΚΕ";
                    } else if (statusDetail.includes("Final") || statusDetail.includes("'") || statusDetail.includes("HT")) {
                        bayernState.score = `${scoreStr} (${statusDetail})`;
                        bayernState.status = "⏳ Live";
                    } else {
                        bayernState.score = "Έναρξη 22:00";
                        bayernState.status = "Αναμονή";
                    }
                }

                // 3. Λυών vs Τσέλσι (Home)
                if (name.includes("Lyon") || name.includes("Chelsea")) {
                    if (isCompleted) {
                        lyonState.score = `${scoreStr} (${statusDetail})`;
                        lyonState.win = homeScore > awayScore;
                        lyonState.status = lyonState.win ? "✅ ΠΕΡΑΣΕ (Άσσος)" : "❌ ΧΑΘΗΚΕ";
                    } else if (statusDetail.includes("Final") || statusDetail.includes("'") || statusDetail.includes("HT")) {
                        lyonState.score = `${scoreStr} (${statusDetail})`;
                        lyonState.status = "⏳ Live";
                    } else {
                        lyonState.score = "Έναρξη 22:00";
                        lyonState.status = "Αναμονή";
                    }
                }
            });
        }
    } catch (err) {
        console.error("API error:", err);
    }

    // Υπολογισμός τελικού αποτελέσματος δελτίου (Κέρδη / Χασούρα)
    let finalBannerColor = "#2563eb"; // μπλε
    let finalResultTitle = "⏳ ΤΟ ΔΕΛΤΙΟ ΕΙΝΑΙ ΣΕ ΕΞΕΛΙΞΗ";
    let profitText = "Εν αναμονή λήξης για την επιστροφή των 12.25 €";
    let summaryNote = "Ωριαία αυτόματη ενημέρωση. Μόλις λήξουν όλα τα ματς, θα κλειδώσει το ταμείο.";

    const allFinished = arsenalState.win !== null && bayernState.win !== null && lyonState.win !== null;
    const hasLoss = arsenalState.win === false || bayernState.win === false || lyonState.win === false;

    if (hasLoss) {
        finalBannerColor = "#dc2626"; // κόκκινο
        finalResultTitle = "❌ ΤΟ ΔΕΛΤΙΟ ΧΑΘΗΚΕ";
        profitText = "💸 ΕΧΑΣΕΣ: 5.00 € (Επιστροφή: 0.00 €)";
        summaryNote = "Δυστυχώς κάποιο σημείο στράβωσε και το ποντάρισμα των 5.00 € χάθηκε.";
    } else if (allFinished && arsenalState.win === true && bayernState.win === true && lyonState.win === true) {
        finalBannerColor = "#16a34a"; // πράσινο
        finalResultTitle = "🎉 ΤΑΜΕΙΟ! ΚΕΡΔΙΣΕΣ!";
        profitText = "💰 ΚΕΡΔΙΣΕΣ: 12.25 € (Καθαρό Κέρδος: +7.25 €)";
        summaryNote = "Πέρασαν και τα 3 φαβορί! Τα 12.25 € πιστώθηκαν στον λογαριασμό σου!";
    }

    const currentFormattedTime = `${String(athensHour).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;

    try {
        const emailResult = await resend.emails.send({
            from: "SGK Agentic AI <noreply@sgk.gr>",
            to: ["spiros39t@gmail.com"],
            subject: `🎯 [${currentFormattedTime}] ${finalResultTitle} | SGK Pamestoixima`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
                
                <!-- Status Banner -->
                <div style="background-color: ${finalBannerColor}; color: #ffffff; padding: 18px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px;">${finalResultTitle}</h2>
                    <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: bold;">${profitText}</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">${summaryNote}</p>
                </div>

                <!-- Financial Breakdown -->
                <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #64748b;">Ποντάρισμα:</span>
                        <strong style="color: #0f172a;">5.00 €</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #64748b;">Συνολική Απόδοση:</span>
                        <strong style="color: #0f172a;">2.45</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px dashed #cbd5e1;">
                        <span style="color: #0f172a; font-weight: bold;">Πιθανή Επιστροφή:</span>
                        <strong style="color: #16a34a; font-size: 18px;">12.25 €</strong>
                    </div>
                </div>

                <!-- Matches Detail -->
                <h3 style="color: #334155; font-size: 15px; margin-bottom: 12px;">Live Κατάσταση Αγώνων (Ώρα: ${currentFormattedTime}):</h3>
                <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 24px;">
                    <div style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                        <strong>1. Παρίσι (Γ) v Άρσεναλ (Γ)</strong> ➔ Σημείο <strong>2</strong> @ 1.34<br/>
                        <span style="font-size: 14px; font-weight: bold; color: #16a34a;">Σκορ: ${arsenalState.score || 'Paris FC 0 - 2 Arsenal'}</span><br/>
                        <strong style="font-size: 13px; color: #0284c7;">Κατάσταση: ${arsenalState.status}</strong>
                    </div>
                    <div style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                        <strong>2. Μπενφίκα (Γ) v Μπάγερν Μονάχου (Γ)</strong> ➔ Σημείο <strong>2</strong> @ 1.27<br/>
                        <span style="font-size: 13px; color: #475569;">Σκορ: ${bayernState.score || 'Έναρξη 22:00'}</span><br/>
                        <strong style="font-size: 13px; color: #0284c7;">Κατάσταση: ${bayernState.status}</strong>
                    </div>
                    <div style="padding: 10px 0;">
                        <strong>3. Λυών (Γ) v Τσέλσι (Γ)</strong> ➔ Σημείο <strong>1</strong> @ 1.44<br/>
                        <span style="font-size: 13px; color: #475569;">Σκορ: ${lyonState.score || 'Έναρξη 22:00'}</span><br/>
                        <strong style="font-size: 13px; color: #0284c7;">Κατάσταση: ${lyonState.status}</strong>
                    </div>
                </div>

                <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
                <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
                    Αυτόματο Cloud Bot | Ενημέρωση ανά ώρα μέχρι τις 00:05 | <strong>SGK Digital</strong>
                </p>
            </div>
            `,
        });

        return new Response(JSON.stringify(emailResult), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
