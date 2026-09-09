/**
 * SGK Global Suppression & Email Classification System
 * Bulletproof protection against sending emails to complained, unsubscribed, or prohibited addresses,
 * and filtering out corporate custom domains (@domain.gr, @company.com, etc.) during GEMI lead acquisition.
 */

export const GLOBAL_BLACKLIST_EMAILS: string[] = [
  "jdcike@jdc.gr",
  "spam@spam.com",
];

export const GLOBAL_BLACKLIST_DOMAINS: string[] = [
  "jdc.gr",
];

/**
 * Recognised public webmail, free email, and ISP providers (Greek & Global).
 * Leads using these email domains represent founders who have NOT established
 * an independent corporate domain/email hosting yet (ideal target leads for website creation).
 */
export const PUBLIC_WEBMAIL_DOMAINS = new Set<string>([
  // Google
  "gmail.com",
  "googlemail.com",
  
  // Microsoft
  "hotmail.com",
  "hotmail.gr",
  "hotmail.co.uk",
  "hotmail.fr",
  "hotmail.de",
  "hotmail.it",
  "hotmail.es",
  "outlook.com",
  "outlook.com.gr",
  "outlook.gr",
  "outlook.fr",
  "outlook.de",
  "outlook.it",
  "live.com",
  "live.com.gr",
  "live.gr",
  "live.fr",
  "live.co.uk",
  "windowslive.com",
  "msn.com",

  // Yahoo
  "yahoo.com",
  "yahoo.gr",
  "yahoo.co.uk",
  "yahoo.fr",
  "yahoo.de",
  "yahoo.it",
  "yahoo.es",
  "ymail.com",
  "rocketmail.com",

  // Apple
  "icloud.com",
  "me.com",
  "mac.com",

  // Greek ISPs & Telecom Operators
  "otenet.gr",
  "cosmote.gr",
  "forthnet.gr",
  "ath.forthnet.gr",
  "the.forthnet.gr",
  "kav.forthnet.gr",
  "her.forthnet.gr",
  "nova.gr",
  "vodafone.gr",
  "vodafone.com",
  "wind.gr",
  "hol.gr",
  "tellas.gr",
  "cyta.gr",
  "freemail.gr",
  "mail.gr",
  "in.gr",
  "pathfinder.gr",

  // Other Global / Privacy / Major Webmails
  "proton.me",
  "protonmail.com",
  "protonmail.ch",
  "pm.me",
  "zoho.com",
  "zoho.eu",
  "mail.com",
  "email.com",
  "aol.com",
  "gmx.com",
  "gmx.net",
  "gmx.de",
  "inbox.com",
  "tuta.com",
  "tutanota.com",
  "tutanota.de",
  "fastmail.com",
  "yandex.com",
  "yandex.ru",
  "mailo.com"
]);

/**
 * Checks whether an email or its domain is present in the global suppression blacklist.
 */
export function isEmailBlacklisted(email: string | null | undefined): boolean {
  if (!email) return true;
  const cleanEmail = email.toLowerCase().trim();

  // 1. Direct email match
  if (GLOBAL_BLACKLIST_EMAILS.some((b) => b.toLowerCase().trim() === cleanEmail)) {
    return true;
  }

  // 2. Domain match
  const parts = cleanEmail.split("@");
  if (parts.length === 2) {
    const domain = parts[1].toLowerCase().trim();
    if (GLOBAL_BLACKLIST_DOMAINS.some((d) => d.toLowerCase().trim() === domain)) {
      return true;
    }
  }

  return false;
}

/**
 * Checks whether an email belongs to a recognized public webmail or ISP provider.
 */
export function isGenericPublicEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  const parts = cleanEmail.split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1].toLowerCase().trim();
  return PUBLIC_WEBMAIL_DOMAINS.has(domain);
}

/**
 * Checks whether an email belongs to a custom corporate domain (e.g. @company.gr, @domain.com).
 * If true, this company has already registered its own domain / custom email infrastructure.
 */
export function isCustomDomainEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  const parts = cleanEmail.split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1].toLowerCase().trim();
  return !PUBLIC_WEBMAIL_DOMAINS.has(domain);
}
