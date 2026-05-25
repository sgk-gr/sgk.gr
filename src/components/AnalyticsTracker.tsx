"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const getSessionId = () => {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem("sgk_visitor_id");
  if (!sessionId) {
    sessionId = "v_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem("sgk_visitor_id", sessionId);
    localStorage.setItem("sgk_visit_count", "1");
    if (typeof sessionStorage !== "undefined") sessionStorage.setItem("sgk_session_active", "true");
  } else {
    // If we have a session ID but no session storage flag, it's a NEW VISIT (returning user)
    if (typeof sessionStorage !== "undefined" && !sessionStorage.getItem("sgk_session_active")) {
      const currentCount = parseInt(localStorage.getItem("sgk_visit_count") || "1");
      localStorage.setItem("sgk_visit_count", (currentCount + 1).toString());
      sessionStorage.setItem("sgk_session_active", "true");
    }
  }
  return sessionId;
};

const getVisitCount = () => {
  if (typeof window === "undefined") return 1;
  return parseInt(localStorage.getItem("sgk_visit_count") || "1");
};

const getDeviceType = () => {
  if (typeof window === "undefined") return "Desktop";
  const ua = navigator.userAgent;
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "Mobile";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "Tablet";
  return "Desktop";
};

function AnalyticsTrackerContent() {
  const pathname = usePathname();
  const sessionId = useRef(getSessionId());
  const visitCount = useRef(getVisitCount());
  const lastPathname = useRef("");
  const startTime = useRef(Date.now());
  const maxScroll = useRef(0);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Click Tracking
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest("button, a, [role='button']");
      if (clickable) {
        const text = clickable.textContent?.trim().substring(0, 50) || "Element";
        const id = clickable.id || clickable.className.split(" ")[0] || "no-id";
        sendEvent("click", pathname, { 
          element: text, 
          element_id: id,
          x: e.clientX,
          y: e.clientY
        });
      }
    };
    window.addEventListener("click", handleGlobalClick);

    // 2. Scroll Tracking
    const handleScroll = () => {
      const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll.current) maxScroll.current = scrollPercent;
    };
    window.addEventListener("scroll", handleScroll);

    // 3. Tab Visibility / Exit Tracking
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
      } else {
        // Tab became active again, restart heartbeat
        if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = setInterval(() => {
          sendEvent("heartbeat", pathname);
        }, 10000); 
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname]);

  const sendEvent = async (type = "page_view", path: string, extra: any = {}) => {
    // ADMIN SHIELD: Never track events if admin_mode is on
    const isAdmin = typeof window !== 'undefined' && localStorage.getItem('sgk_admin_mode') === 'true';
    if (isAdmin) {
      return;
    }

    try {
      await fetch(`${supabaseUrl}/functions/v1/track-analytics-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseAnonKey}`,
          "apikey": supabaseAnonKey,
        },
        body: JSON.stringify({
          p_event_type: type,
          p_page_url: path,
          p_metadata: {
            session_id: sessionId.current,
            visit_count: visitCount.current,
            referrer: document.referrer || "Direct",
            device: getDeviceType(),
            scroll: Math.max(maxScroll.current, extra.scroll || 0),
            duration: Math.floor((Date.now() - startTime.current) / 1000),
            ...extra
          }
        }),
      });
    } catch (e) { /* silent fail */ }
  };

  useEffect(() => {
    if (pathname !== lastPathname.current) {
      startTime.current = Date.now();
      maxScroll.current = 0;
      sendEvent("page_view", pathname);
      lastPathname.current = pathname;

      if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = setInterval(() => {
        sendEvent("heartbeat", pathname);
      }, 10000); // Higher precision: 10s heartbeat
    }
    return () => { if (heartbeatInterval.current) clearInterval(heartbeatInterval.current); };
  }, [pathname]);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerContent />
    </Suspense>
  );
}
