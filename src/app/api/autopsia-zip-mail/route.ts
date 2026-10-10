import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { customer } = await req.json();

        // Find all ENTYPA documents
        const entypaCategories = ['aut_decl', 'aut_report', 'aut_tech', 'aut_form1', 'aut_form2', 'aut_form3', 'aut_form4'];
        
        let attachments: any[] = [];
        
        if (customer.photo_urls && Array.isArray(customer.photo_urls)) {
            // Find one image for each category
            for (const cat of entypaCategories) {
                const url = customer.photo_urls.find((u: string) => u.includes(cat));
                if (url) {
                    try {
                        const res = await fetch(url);
                        const arrayBuffer = await res.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);
                        
                        attachments.push({
                            filename: `${cat}_${customer.id}.jpg`,
                            content: buffer,
                        });
                    } catch (e) {
                        console.error('Failed to fetch attachment', url, e);
                    }
                }
            }
        }

        const data = await resend.emails.send({
            from: 'SGK Digital <noreply@sgk.gr>',
            to: customer.autopsia_tech_data?.recipient_email ? [customer.autopsia_tech_data.recipient_email] : ['spiros39t@gmail.com'],
            subject: `Έγγραφα Αυτοψίας (ZIP): ${customer.address} - ${customer.city}`,
            html: `
                <h2>Έντυπα Αυτοψίας</h2>
                <p><strong>Διεύθυνση:</strong> ${customer.address}, ${customer.city}</p>
                <p><strong>SR:</strong> ${customer.sr || '-'}</p>
                <p>Επισυνάπτονται τα παραγόμενα ψηφιακά έγγραφα.</p>
            `,
            attachments: attachments.length > 0 ? attachments : undefined
        });

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('autopsia-zip-mail error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
