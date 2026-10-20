import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function getCalendarCutoffIso(days: number = 3): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Athens",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const greekTodayStr = formatter.format(now);
  const [y, m, d] = greekTodayStr.split("-").map(Number);
  const targetDate = new Date(Date.UTC(y, m - 1, d - days, 23, 59, 59, 999));
  
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Athens",
    timeZoneName: "shortOffset",
  }).formatToParts(targetDate);
  const tzPart = parts.find(p => p.type === "timeZoneName")?.value || "GMT+3";
  const offsetHours = tzPart.includes("+3") ? 3 : 2;

  const cutoffUtc = new Date(targetDate.getTime() - offsetHours * 60 * 60 * 1000);
  return cutoffUtc.toISOString();
}

async function processFollowUp() {
  return {
    disabled: true,
    totalChecked: 0,
    sent: 0,
    failed: 0,
    message: "Follow-up email sequences (2nd & 3rd emails) have been permanently disabled per administrator request.",
    results: [],
  };
}

export async function GET() {
  const data = await processFollowUp();
  return NextResponse.json({ success: true, ...data });
}

export async function POST() {
  const data = await processFollowUp();
  return NextResponse.json({ success: true, ...data });
}
