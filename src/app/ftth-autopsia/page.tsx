"use client";

import React, { Suspense, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const AutopsiaView = dynamic(() => import("@/components/autopsia/AutopsiaView"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#141413] text-slate-900 dark:text-[#f4f4f0]">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
      <p className="text-sm font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400">
        Φόρτωση Συστήματος Αυτοψιών FTTH...
      </p>
    </div>
  ),
});

export default function FtthAutopsiaPage() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-slate-50 dark:bg-[#141413]">
        <Suspense
          fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#141413] text-slate-900 dark:text-[#f4f4f0]">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
              <p className="text-sm font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400">
                Εκκίνηση Περιβάλλοντος...
              </p>
            </div>
          }
        >
          <AutopsiaView />
        </Suspense>
      </main>
    </QueryClientProvider>
  );
}
