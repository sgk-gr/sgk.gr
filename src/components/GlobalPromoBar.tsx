"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalPromoBar() {
  const pathname = usePathname();
  
  // Do not show the promo bar on doc pages, admin pages, or elv8 requirements
  if (!pathname || pathname.startsWith("/doc") || pathname.startsWith("/admin") || pathname === "/elv8-requirements") {
    return null;
  }

  const targetHref = pathname === "/ike-offer" 
    ? "/kataskevi-istoselidas-ike" 
    : "/ike-offer";

  return (
    <div className="global-promo-bar fixed bottom-0 left-0 w-full bg-[#3b5bdb] text-white text-xs md:text-sm text-center py-2.5 z-50 border-t border-white/20 shadow-[0_-4px_10px_rgba(0,0,0,0.15)] whitespace-nowrap overflow-hidden text-ellipsis px-2 print:hidden no-print">
      Νέα επιχείρηση Ι.Κ.Ε.;{" "}
      <Link 
        href={targetHref} 
        className="underline underline-offset-2 hover:text-[#facc15] transition-colors font-bold"
      >
        Επίσημη ιστοσελίδα ΓΕΜΗ σε 24 ώρες — Μόνο 124€
      </Link>
    </div>
  );
}
