"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalPromoBar() {
  const pathname = usePathname();
  
  // Do not show the promo bar on the elv8 requirements questionnaire page
  if (pathname === "/elv8-requirements") {
    return null;
  }

  const targetHref = pathname === "/pay-as-you-grow" 
    ? "/eshop-offer?plan=pay-as-you-grow" 
    : "/pay-as-you-grow";

  return (
    <div className="global-promo-bar fixed bottom-0 left-0 w-full bg-[#3b5bdb] text-white text-xs md:text-sm text-center py-2.5 z-50 border-t border-white/20 shadow-[0_-4px_10px_rgba(0,0,0,0.15)] whitespace-nowrap overflow-hidden text-ellipsis px-2">
      Νέος πελάτης;{" "}
      <Link 
        href={targetHref} 
        className="underline underline-offset-2 hover:text-[#facc15] transition-colors font-bold"
      >
        Ξεκίνα το Eshop σου χωρίς ρίσκο
      </Link>
    </div>
  );
}
