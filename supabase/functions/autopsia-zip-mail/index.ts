import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { encode } from "https://deno.land/std@0.190.0/encoding/base64.ts";
import JSZip from "npm:jszip@3.10.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { customer } = await req.json();

        let toEmails = ['info@sgk.gr'];
        if (customer?.autopsia_tech_data?.recipient_email) {
            toEmails = customer.autopsia_tech_data.recipient_email.split(',').map((e: string) => e.trim()).filter((e: string) => e);
        }

        // The 7 entypa: <SR>_YD_Diaxeiristi, _Kampina, _Anamoni, _Texn_Perigrafi, _XEDM, _Entypo_1, _Ekthesi_Epith
        const entypaMarkers = ['yd_diaxeiristi', 'kampina', 'anamoni', 'texn_perigrafi', 'xedm', 'entypo_1', 'ekthesi_epith'];
        let attachments: any[] = [];

        const photoUrls: string[] = Array.isArray(customer?.photo_urls) ? customer.photo_urls : [];
        console.log('photo_urls count:', photoUrls.length, JSON.stringify(photoUrls));

        const zip = new JSZip();
        let fileCount = 0;

        for (const rawUrl of photoUrls) {
            let decoded = rawUrl;
            try { decoded = decodeURIComponent(rawUrl); } catch (_) { /* keep raw */ }
            const lower = decoded.toLowerCase();
            if (!entypaMarkers.some((m) => lower.includes(m))) continue;

            try {
                let url = rawUrl;
                if (url.startsWith('/')) url = 'https://www.sgk.gr' + url;
                const res = await fetch(url);
                if (!res.ok) throw new Error(`status ${res.status}`);
                const buf = new Uint8Array(await res.arrayBuffer());
                const name = decoded.split('file=').pop()!.split('/').pop()!.split('?')[0] || `file_${fileCount + 1}.jpg`;
                zip.file(name, buf);
                fileCount++;
            } catch (e) {
                console.error('Failed to fetch attachment', rawUrl, e);
            }
        }

        console.log('files added to zip:', fileCount);
        if (fileCount > 0) {
            const zipBytes = await zip.generateAsync({ type: 'uint8array' });
            attachments.push({
                filename: `Autopsia_${customer.sr || customer.id}.zip`,
                content: encode(zipBytes),
            });
        }

        const data = await resend.emails.send({
            from: "SGK Digital <info@sgk.gr>",
            to: toEmails,
            subject: `Έγγραφα Αυτοψίας (ZIP): ${customer.address} - ${customer.city}`,
            html: `
                <h2>Έντυπα Αυτοψίας</h2>
                <p><strong>Διεύθυνση:</strong> ${customer.address}, ${customer.city}</p>
                <p><strong>SR:</strong> ${customer.sr || '-'}</p>
                <p>Επισυνάπτονται τα παραγόμενα ψηφιακά έγγραφα.</p>
            `,
            attachments: attachments.length > 0 ? attachments : undefined
        });

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
