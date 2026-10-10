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
  if (url.startsWith("data:")) return url;

  let targetUrl = url;

  if (targetUrl.includes("/functions/v1/r2-media") && !targetUrl.includes("file=")) {
    return "";
  }

  if (targetUrl.includes("r2.dev") || targetUrl.includes("pub-c08b1610623748bfb2c633b2c4e31130")) {
    const rawFileName = targetUrl.split("/").pop() || "";
    const cleanFileName = rawFileName.split("?")[0];
    if (cleanFileName) {
      const fileParam = cleanFileName.includes("%")
        ? encodeURIComponent(cleanFileName)
        : encodeURIComponent(decodeURIComponent(cleanFileName));
      targetUrl = `https://dxsdmumciinpqtewpipx.supabase.co/functions/v1/r2-media?file=${fileParam}`;
    }
  } else if (targetUrl.includes("/functions/v1/r2-media")) {
    const urlParts = targetUrl.split("?file=");
    if (urlParts.length === 2) {
      const rest = urlParts[1];
      const rawFile = rest.split("&")[0];
      const encodedFile = rawFile.includes("%25") || rawFile.includes("%")
        ? encodeURIComponent(decodeURIComponent(rawFile))
        : encodeURIComponent(decodeURIComponent(rawFile));
      const otherParams = rest
        .split("&")
        .slice(1)
        .filter((p) => !p.startsWith("t=") && !p.startsWith("nocache="))
        .join("&");
      const paramStr = otherParams ? `&${otherParams}` : "";
      targetUrl = `${urlParts[0]}?file=${encodedFile}${paramStr}`;
    }
  }

  if (forceNewTimestamp) {
    const timestamp = new Date().getTime();
    const separator = targetUrl.includes("?") ? "&" : "?";
    return `${targetUrl}${separator}t=${timestamp}`;
  }

  return targetUrl;
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
