import { NextRequest, NextResponse } from "next/server";
/** Customer sign-in — password grant against Supabase Auth, returns a session token. */

const SUPA_URL = process.env.SUPABASE_URL || "";
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const em = String(email || "").trim().toLowerCase();
    const pw = String(password || "");
    if (!em || !pw) return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

    const r = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: em, password: pw }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      const raw = String(d.error_description || d.msg || d.error || "Sign-in failed");
      if (/email not confirmed/i.test(raw)) return NextResponse.json({ error: "Please confirm your email first — check your inbox for the activation link." }, { status: 400 });
      if (/invalid login credentials/i.test(raw)) return NextResponse.json({ error: "Incorrect email or password." }, { status: 400 });
      if (/rate limit/i.test(raw)) return NextResponse.json({ error: "Too many attempts — please wait a minute and try again." }, { status: 429 });
      return NextResponse.json({ error: raw }, { status: 400 });
    }
    return NextResponse.json({
      token: d.access_token,
      refresh_token: d.refresh_token,
      user: { id: d.user?.id, email: d.user?.email, name: d.user?.user_metadata?.name || "" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Sign-in failed" }, { status: 400 });
  }
}
