export function buildProfessionalEmailHtml(opts: {
  businessName?: string;
  subject?: string;
  bodyHtml: string;
  buttonText?: string;
  buttonLink?: string;
  unsubscribeToken: string;
  industry?: string;
}): string {
  const { businessName, bodyHtml, buttonText, buttonLink, unsubscribeToken, industry } = opts;
  const unsubLink = `https://sgk.gr/unsubscribe?token=${unsubscribeToken}`;
  
  const ctaButton = buttonText && buttonLink ? `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 8px;">
    <tr>
      <td align="center">
        <a href="${buttonLink}" target="_blank" style="display:inline-block;background:#FF6B00;color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;mso-padding-alt:0;">
          ${buttonText}
        </a>
      </td>
    </tr>
  </table>` : "";

  return `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>SGK Digital</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:Arial,Helvetica,sans-serif;">

<!-- Wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f0f2f5">
  <tr>
    <td align="center" style="padding:24px 16px;">

      <!-- Email Card -->
      <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width:600px;border-radius:2px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12);">

        <!-- LOGO BAR -->
        <tr>
          <td bgcolor="#ffffff" style="padding:16px 28px;border-bottom:1px solid #f0f0f0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <span style="font-family:Arial,sans-serif;font-size:20px;font-weight:900;color:#1a1a2e;">SGK <span style="color:#FF6B00;">Digital</span></span>
                </td>
                <td align="right">
                  <a href="https://sgk.gr/web-development" style="color:#555;text-decoration:none;font-size:12px;font-weight:600;margin-left:14px;">Υπηρεσίες</a>
                  <a href="https://sgk.gr" style="color:#555;text-decoration:none;font-size:12px;font-weight:600;margin-left:14px;">Portfolio</a>
                  <a href="tel:6999524389" style="color:#FF6B00;text-decoration:none;font-size:12px;font-weight:600;margin-left:14px;">📞 6999 524389</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td bgcolor="#1a1a2e" style="padding:40px 40px 55px;text-align:center;background:linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%);">
            <span style="font-family:Arial,sans-serif;font-size:26px;font-weight:900;color:#ffffff;line-height:1.3;">Γεια σας από την <span style="color:#FF8C3A;">SGK Digital!</span></span>
            <br>
            <span style="font-size:14px;color:rgba(255,255,255,0.65);display:block;margin-top:10px;">Ψηφιακές λύσεις για επιχειρήσεις στην Καστοριά &amp; Ελλάδα</span>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td bgcolor="#ffffff" style="padding:36px 40px 28px;">
            ${bodyHtml}
            ${ctaButton}
          </td>
        </tr>

        <!-- WHATSAPP + PHONE CTA -->
        <tr>
          <td bgcolor="#fff8f4" style="padding:24px 40px;border-top:1px solid #ffe0cc;border-bottom:1px solid #ffe0cc;text-align:center;">
            <p style="font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#1a1a2e;margin:0 0 14px 0;">Θέλετε να μάθετε περισσότερα ή να κάνουμε μια φιλική κουβέντα;</p>
            <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
              <tr>
                <td style="padding-right:10px;">
                  <a href="https://wa.me/306999524389" style="display:inline-block;background:#25D366;color:#fff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;padding:12px 22px;border-radius:8px;text-decoration:none;">💬 WhatsApp</a>
                </td>
                <td>
                  <a href="tel:6999524389" style="display:inline-block;background:#ffffff;color:#FF6B00;font-family:Arial,sans-serif;font-size:14px;font-weight:700;padding:11px 22px;border-radius:8px;text-decoration:none;border:2px solid #FF6B00;">📞 6999 524 389</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#f5f6f8" style="padding:24px 40px;text-align:center;">
            <p style="font-family:Arial,sans-serif;font-size:12px;color:#888;margin:0 0 10px 0;">
              <a href="https://sgk.gr" style="color:#555;text-decoration:none;margin:0 8px;">Σχετικά</a>
              <a href="https://sgk.gr/portfolio" style="color:#555;text-decoration:none;margin:0 8px;">Portfolio</a>
              <a href="https://sgk.gr/privacy-policy" style="color:#555;text-decoration:none;margin:0 8px;">Πολιτική Απορρήτου</a>
              <a href="${unsubLink}" style="color:#aaa;text-decoration:none;margin:0 8px;">Κατάργηση εγγραφής</a>
            </p>
            <p style="font-family:Arial,sans-serif;font-size:11px;color:#aaa;margin:0;line-height:1.7;">
              <strong style="color:#999;">SGK Software Development</strong><br>
              ΑΦΜ: 167520448<br>
              Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής<br>
              <a href="mailto:info@sgk.gr" style="color:#FF6B00;text-decoration:none;">info@sgk.gr</a> | <a href="tel:6999524389" style="color:#FF6B00;text-decoration:none;">6999 524 389</a><br>
              © ${new Date().getFullYear()} SGK Digital. Όλα τα δικαιώματα διατηρούνται.
            </p>
          </td>
        </tr>

      </table>
      <!-- /Email Card -->

    </td>
  </tr>
</table>
<!-- /Wrapper -->

</body>
</html>`;
}
