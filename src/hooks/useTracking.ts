"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

// Helper to validate UUID format
function isValidUUID(uuid: string | null): boolean {
  if (!uuid) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Helper to generate UUID with secure fallback
function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback RFC4122 v4 UUID generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper to get or create persistent visitor ID
function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  let visitorId = localStorage.getItem("sgk_visitor_id");
  if (!isValidUUID(visitorId)) {
    visitorId = generateUUID();
    localStorage.setItem("sgk_visitor_id", visitorId);
  }
  return visitorId;
}

// Helper to get or create session ID
function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = sessionStorage.getItem("sgk_session_id");
  if (!isValidUUID(sessionId)) {
    sessionId = generateUUID();
    sessionStorage.setItem("sgk_session_id", sessionId);
  }
  return sessionId;
}

export function useTracking(pageName: string) {
  const trackingIdRef = useRef<string | null>(null);
  const durationRef = useRef<number>(0);
  const clicksRef = useRef<Array<{ text: string; id: string; tag: string; timestamp: string }>>([]);
  const maxScrollRef = useRef<number>(0);
  const formInputsRef = useRef<Array<{ field: string; value: string; timestamp: string }>>([]);

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
            clicks: [],
            max_scroll_percentage: 0,
            form_inputs: []
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

    // 2. Heartbeat interval to update duration & scroll spent on page
    const interval = setInterval(async () => {
      if (!trackingIdRef.current) return;
      durationRef.current += 5;

      try {
        await supabase
          .from("tracking_sessions")
          .update({ 
            duration_seconds: durationRef.current,
            max_scroll_percentage: maxScrollRef.current
          })
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

    // 4. Scroll position tracking (throttled)
    let scrollTimeout: any = null;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) return;
        const scrollPercent = Math.round((window.scrollY / totalHeight) * 100);
        if (scrollPercent > maxScrollRef.current) {
          maxScrollRef.current = Math.min(100, scrollPercent);
        }
      }, 250);
    };

    // 5. Form input tracking (triggers when input field loses focus or value changes)
    const handleInputEvent = async (e: Event) => {
      if (!trackingIdRef.current) return;
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (!target) return;

      const tagName = target.tagName ? target.tagName.toUpperCase() : "";
      if (tagName === "INPUT" || tagName === "TEXTAREA") {
        // Skip sensitive fields like passwords or credit cards
        if (target.type === "password") return;

        const fieldName = target.name || target.id || target.placeholder || target.type || "Unnamed Field";
        const val = target.value?.trim();

        if (!val) return; // skip logging empty submissions

        const displayValue = val.slice(0, 80);
        const timestamp = new Date().toISOString();

        // Prevent duplicate sequential logs for the same field with the same value
        const existingIdx = formInputsRef.current.findIndex(item => item.field === fieldName);
        if (existingIdx !== -1 && formInputsRef.current[existingIdx].value === displayValue) {
          return;
        }

        const inputEvent = { field: fieldName, value: displayValue, timestamp };
        if (existingIdx !== -1) {
          const updated = [...formInputsRef.current];
          updated[existingIdx] = inputEvent;
          formInputsRef.current = updated;
        } else {
          formInputsRef.current = [...formInputsRef.current, inputEvent];
        }

        try {
          await supabase
            .from("tracking_sessions")
            .update({ form_inputs: formInputsRef.current })
            .eq("id", trackingIdRef.current);
        } catch (err) {
          console.error("📊 [Tracking] Form input update failed:", err);
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("blur", handleInputEvent, true); // capture phase
    document.addEventListener("change", handleInputEvent, true); // capture phase

    // Clean up
    return () => {
      clearInterval(interval);
      document.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("blur", handleInputEvent, true);
      document.removeEventListener("change", handleInputEvent, true);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [pageName]);
}
