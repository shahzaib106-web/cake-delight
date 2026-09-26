import { NextRequest, NextResponse } from "next/server";
/** Customer sign-out — revokes the GoTrue session. */

const SUPA_URL = process.env.SUPABASE_URL || "";
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(req: NextRequest) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (token) {
    await fetch(`${SUPA_URL}/auth/v1/logout`, {
      method: "POST",
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
