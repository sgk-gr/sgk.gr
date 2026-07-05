"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

// Helper to generate UUID
function generateUUID(): string {
  return crypto.randomUUID();
}

// Helper to get or create persistent visitor ID
function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  let visitorId = localStorage.getItem("sgk_visitor_id");
  if (!visitorId) {
    visitorId = generateUUID();
    localStorage.setItem("sgk_visitor_id", visitorId);
  }
  return visitorId;
}

// Helper to get or create session ID
function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = sessionStorage.getItem("sgk_session_id");
  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem("sgk_session_id", sessionId);
  }
  return sessionId;
}

export function useTracking(pageName: string) {
  const trackingIdRef = useRef<string | null>(null);
  const durationRef = useRef<number>(0);
  const clicksRef = useRef<Array<{ text: string; id: string; tag: string; timestamp: string }>>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const pagePath = window.location.pathname + window.location.search;
    const referrer = document.referrer || "Direct";
    const userAgent = navigator.userAgent;

    // 1. Initialize session row in database
    const initTracking = async () => {
      try {
        const { data, error } = await supabase
          .from("tracking_sessions")
          .insert({
            visitor_id: visitorId,
            session_id: sessionId,
            page_path: pagePath,
            referrer: referrer,
            user_agent: userAgent,
            duration_seconds: 0,
            clicks: []
          })
          .select("id")
          .single();

        if (error) {
          console.warn("⚠️ [Tracking] Init failed:", error.message);
        } else if (data) {
          trackingIdRef.current = data.id;
          // console.log("📊 [Tracking] Session initialized:", data.id);
        }
      } catch (err) {
        console.error("📊 [Tracking] Init error:", err);
      }
    };

    initTracking();

    // 2. Heartbeat interval to update duration spent on page
    const interval = setInterval(async () => {
      if (!trackingIdRef.current) return;
      durationRef.current += 5;

      try {
        await supabase
          .from("tracking_sessions")
          .update({ duration_seconds: durationRef.current })
          .eq("id", trackingIdRef.current);
      } catch (err) {
        console.error("📊 [Tracking] Heartbeat failed:", err);
      }
    }, 5000);

    // 3. Global click tracking
    const handleGlobalClick = async (e: MouseEvent) => {
      if (!trackingIdRef.current) return;

      const target = e.target as HTMLElement;
      // Track clicks on buttons, links, or elements with cursor-pointer
      const clickableElement = target.closest("button, a, [role='button'], .cursor-pointer") as HTMLElement;

      if (clickableElement) {
        const text = clickableElement.innerText?.trim().slice(0, 100) || clickableElement.getAttribute("aria-label") || "No Text";
        const id = clickableElement.id || "";
        const tag = clickableElement.tagName;
        const timestamp = new Date().toISOString();

        const clickEvent = { text, id, tag, timestamp };
        clicksRef.current = [...clicksRef.current, clickEvent];

        try {
          await supabase
            .from("tracking_sessions")
            .update({ clicks: clicksRef.current })
            .eq("id", trackingIdRef.current);
        } catch (err) {
          console.error("📊 [Tracking] Click update failed:", err);
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);

    // Clean up
    return () => {
      clearInterval(interval);
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [pageName]);
}
