export function buildProfessionalEmailHtml(opts: {
  businessName?: string;
  subject?: string;
  bodyHtml: string;
  buttonText?: string;
  buttonLink?: string;
  unsubscribeToken: string;
  industry?: string;
}): string {
  const { bodyHtml, buttonText, buttonLink, unsubscribeToken } = opts;
  const unsubLink = `https://www.sgk.gr/unsubscribe?token=${unsubscribeToken}`;
  
  // Prevent duplicate CTA button if bodyHtml already includes a link to buttonLink or the button text
  const alreadyHasButton = Boolean(buttonLink && bodyHtml.includes(buttonLink)) || Boolean(buttonText && bodyHtml.includes(buttonText));
  const ctaButton = buttonText && buttonLink && !alreadyHasButton ? `
  <div style="text-align: center; margin: 20px 0 10px;">
      <a href="${buttonLink}" target="_blank" style="display:inline-block;background:#4ade80;color:#111;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:700;padding:12px 28px;border-radius:20px;text-decoration:none;">
        ${buttonText}
      </a>
  </div>` : "";

  return `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>sgk.</title>
  <style>
    p { margin: 0 0 10px 0 !important; line-height: 1.5 !important; }
    h2, h3 { margin: 0 0 12px 0 !important; line-height: 1.3 !important; }
    ul, ol { margin: 0 0 12px 0 !important; padding-left: 20px !important; }
    li { margin-bottom: 5px !important; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;">
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Brand Header -->
    <div style="text-align: right; padding: 8px 20px;">
        <span style="color: #94a3b8; font-size: 10px; font-weight: 600; letter-spacing: 0.5px;">sgk.gr</span>
    </div>

    <!-- Logo -->
    <div style="text-align: center; padding: 12px 0;">
        <h1 style="margin: 0; font-size: 36px; font-weight: 800; letter-spacing: -2px; color: #000;">sgk<span style="color:#3b5bdb;">.</span></h1>
    </div>

    <!-- Color Strip -->
    <div style="display: flex; height: 12px; width: 100%;">
        <div style="width: 15%; background-color: #3b5bdb;"></div>
        <div style="width: 5%; background-color: #4ade80;"></div>
        <div style="width: 80%; background-color: #ffffff;"></div>
    </div>

    <!-- Content Area -->
    <div style="padding: 24px 20px; color: #334155; font-size: 15px; line-height: 1.55;">
        ${bodyHtml}
        ${ctaButton}
    </div>

    <!-- Blue Footer -->
    <div style="position: relative;">
        <!-- Top strips -->
        <div style="display: flex; height: 12px; width: 100%;">
            <div style="width: 75%; background-color: #d1d5db;"></div>
            <div style="width: 25%; background-color: #facc15;"></div>
        </div>
        
        <div style="background-color: #3b5bdb; color: #ffffff; padding: 26px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -2px; color: #ffffff;">sgk<span style="color:#4ade80;">.</span></h1>
            
            <div style="font-size: 11px; margin: 14px 0 0 0; color: #ffffff; line-height: 1.6;">
                <strong>SGK Digital</strong><br/>
                ΑΦΜ: 131398972 | ΔΟΥ: ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ<br/>
                Ερμού 1 &amp; Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής<br/>
                Τηλ: 211 114 0013 | 6999 524 389 | info@sgk.gr
            </div>

            <p style="font-size: 11px; margin: 10px 0 0 0; color: #e0e7ff;">
                &copy; ${new Date().getFullYear()} SGK Digital. All rights reserved.
            </p>
        </div>
    </div>

    <!-- Unsubscribe -->
    <div style="background-color: #f4f4f5; padding: 14px 20px; text-align: left; font-size: 11px; color: #666666; line-height: 1.4;">
        Αν δεν επιθυμείτε να λαμβάνετε μελλοντική επικοινωνία, μπορείτε να διαγραφείτε εδώ: 
        <br/><a href="${unsubLink}" target="_blank" style="color: #3b5bdb; text-decoration: underline;">Διαγραφή από τη λίστα</a>
    </div>
</div>
</body>
</html>`;
}
