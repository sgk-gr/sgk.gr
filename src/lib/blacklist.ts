/**
 * SGK Global Suppression & Blacklist System
 * Bulletproof protection against sending emails to complained, unsubscribed, or prohibited addresses.
 */

export const GLOBAL_BLACKLIST_EMAILS: string[] = [
  "jdcike@jdc.gr",
  "spam@spam.com",
];

export const GLOBAL_BLACKLIST_DOMAINS: string[] = [
  "jdc.gr",
];

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
