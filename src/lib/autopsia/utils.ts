import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizePhotoUrlForDb(url: string | null | undefined): string {
  if (!url) return "";
  const clean = String(url).trim();
  if (clean.includes("/functions/v1/r2-media")) {
    if (clean.includes("file=")) {
      const rawFile = clean.split("file=")[1].split("&")[0];
      const fileName = decodeURIComponent(rawFile);
      return `https://pub-c08b1610623748bfb2c633b2c4e31130.r2.dev/${fileName}`;
    }
    return "";
  }
  return clean.split("?")[0];
}

export function getTimestampedUrl(url: string | null | undefined, forceNewTimestamp: boolean = false) {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;

  // Preserve local static assets
  if (
    url.startsWith("/templates/") ||
    url.startsWith("/icons/") ||
    url.startsWith("/images/") ||
    url === "/OTELOGO.jpg" ||
    url.startsWith("/OTELOGO")
  ) {
    return url;
  }

  let fileName = "";

  if (url.includes("file=")) {
    fileName = url.split("file=")[1].split("&")[0];
  } else if (url.includes("/")) {
    fileName = url.split("/").pop() || "";
  } else {
    fileName = url;
  }

  fileName = fileName.split("?")[0];
  try {
    fileName = decodeURIComponent(fileName);
  } catch {}

  if (!fileName) return url;

  const timestamp = forceNewTimestamp ? `&t=${Date.now()}` : "";
  return `/api/autopsia/media?file=${encodeURIComponent(fileName)}${timestamp}`;
}

export function getContractorCardClass(customer: any) {
  if (!customer) return "bg-white dark:bg-[#1f1f1e] border-slate-200 dark:border-[#2e2e2c] text-slate-900 dark:text-[#f4f4f0]";

  if (customer.is_thiseas) {
    return "bg-blue-200/65 dark:bg-[#1f1f1e] border-blue-400 dark:border-[#2e2e2c] dark:border-l-4 dark:border-l-blue-500 shadow-blue-100/40 dark:shadow-none text-slate-900 dark:text-[#f4f4f0]";
  }
  if (customer.is_beyondwire) {
    return "bg-violet-200/65 dark:bg-[#1f1f1e] border-violet-400 dark:border-[#2e2e2c] dark:border-l-4 dark:border-l-purple-500 shadow-violet-100/40 dark:shadow-none text-slate-900 dark:text-[#f4f4f0]";
  }
  if (customer.is_ergatikat) {
    return "bg-orange-200/65 dark:bg-[#1f1f1e] border-orange-400 dark:border-[#2e2e2c] dark:border-l-4 dark:border-l-amber-500 shadow-orange-100/40 dark:shadow-none text-slate-900 dark:text-[#f4f4f0]";
  }
  if (customer.is_kasos) {
    return "bg-green-200/65 dark:bg-[#1f1f1e] border-green-400 dark:border-[#2e2e2c] dark:border-l-4 dark:border-l-emerald-500 shadow-green-100/40 dark:shadow-none text-slate-900 dark:text-[#f4f4f0]";
  }
  if (customer.anathesi_xwma) {
    return "bg-amber-200/50 dark:bg-[#1f1f1e] border-amber-400 dark:border-[#2e2e2c] dark:border-l-4 dark:border-l-amber-400 shadow-amber-100/40 dark:shadow-none text-slate-900 dark:text-[#f4f4f0]";
  }

  return "bg-white dark:bg-[#1f1f1e] border-slate-200 dark:border-[#2e2e2c] text-slate-900 dark:text-[#f4f4f0]";
}

export function isLastDrop(customer: any): boolean {
  if (!customer) return false;
  if (customer.is_last_drop === false || customer.last_drop === false) return false;
  return customer.is_last_drop === true || customer.last_drop === true;
}

export function isReadyForActivation(customer: any): boolean {
  if (!customer) return false;
  return customer.ready_for_activation === true || customer.is_ready_for_activation === true;
}
