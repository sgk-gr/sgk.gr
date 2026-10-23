import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DISABLED_RESPONSE = {
  success: true,
  disabled: true,
  totalSent: 0,
  message: "Το σύστημα αυτόματων cold emails και ημερήσιων εκστρατειών έχει απενεργοποιηθεί και αφαιρεθεί οριστικά.",
};

export async function GET() {
  return NextResponse.json(DISABLED_RESPONSE);
}

export async function POST() {
  return NextResponse.json(DISABLED_RESPONSE);
}
