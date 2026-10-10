import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { customer, userEmail } = await req.json();

        const data = await resend.emails.send({
            from: 'SGK Digital <noreply@sgk.gr>',
            to: customer.autopsia_tech_data?.recipient_email ? [customer.autopsia_tech_data.recipient_email] : ['spiros39t@gmail.com', 'kmfiber@teletronic.gr'],
            subject: \Ολοκλήρωση Αυτοψίας: \ - \\,
            html: \
                <h2>Η αυτοψία ολοκληρώθηκε</h2>
                <p><strong>Πελάτης:</strong> \ \</p>
                <p><strong>Διεύθυνση:</strong> \, \</p>
                <p><strong>Building ID:</strong> \</p>
                <p><strong>Τεχνικός:</strong> \</p>
            \,
        });

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
