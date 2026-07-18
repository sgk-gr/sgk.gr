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
  const unsubLink = `https://sgk.gr/unsubscribe?token=${unsubscribeToken}`;
  
  const ctaButton = buttonText && buttonLink ? `
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
    <!-- Top Link -->
    <div style="text-align: right; padding: 8px 20px;">
        <a href="https://sgk.gr" style="color: #3b5bdb; text-decoration: none; font-size: 10px;">sgk.gr</a>
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
    <div style="padding: 24px 20px; color: #333333; font-size: 15px; line-height: 1.5;">
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
        
        <div style="background-color: #3b5bdb; color: #ffffff; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -2px; color: #ffffff;">sgk<span style="color:#4ade80;">.</span></h1>
            
            <div style="margin: 15px 0;">
                <a href="https://www.facebook.com/profile.php?id=61552383862787" target="_blank" style="color: #ffffff; text-decoration: none; margin: 0 8px; font-weight: bold; border: 1px solid white; border-radius: 50%; padding: 4px 9px; font-size: 12px;">f</a>
                <a href="https://www.tiktok.com/@sgk.gr?is_from_webapp=1&sender_device=pc" target="_blank" style="color: #ffffff; text-decoration: none; margin: 0 8px; font-weight: bold; border: 1px solid white; border-radius: 50%; padding: 4px 9px; font-size: 12px;">t</a>
            </div>
            
            <div style="font-size: 11px; margin: 15px 0; color: #ffffff; line-height: 1.5;">
                <strong>SGK Software Development</strong><br/>
                ΑΦΜ: 131398972 | ΔΟΥ: ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ<br/>
                Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής<br/>
                📞 6999 524 389 | ✉️ <a href="mailto:info@sgk.gr" target="_blank" style="color: #ffffff; text-decoration: none;">info@sgk.gr</a>
            </div>

            <p style="font-size: 11px; margin: 15px 0 0 0; color: #ffffff;">
                <a href="https://sgk.gr/terms" target="_blank" style="color: #ffffff; text-decoration: underline; font-weight: bold;">Όροι Χρήσης</a> | 
                <a href="https://sgk.gr/privacy" target="_blank" style="color: #ffffff; text-decoration: underline; font-weight: bold;">Πολιτική Απορρήτου</a>
            </p>
            <p style="font-size: 11px; margin: 5px 0 0 0; color: #ffffff;">
                Copyright ${new Date().getFullYear()}. All rights reserved.
            </p>
        </div>
    </div>

    <!-- Unsubscribe -->
    <div style="background-color: #f4f4f5; padding: 15px 20px; text-align: left; font-size: 11px; color: #666666;">
        If you have reason to believe that you are not the intended recipient or you wish to unsubscribe from this mailing list please visit the following link 
        <br/><a href="${unsubLink}" target="_blank" style="color: #3b5bdb; text-decoration: underline;">${unsubLink}</a>
    </div>
</div>
</body>
</html>`;
}
