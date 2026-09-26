import { NextRequest, NextResponse } from "next/server";
/** Customer sign-up — proxies Supabase Auth (GoTrue).
 *  Creates the user in Supabase (auth.users) and triggers the confirmation email. */

const SUPA_URL = process.env.SUPABASE_URL || "";
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    const em = String(email || "").trim().toLowerCase();
    const pw = String(password || "");
    const nm = String(name || "").trim().slice(0, 80);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    if (pw.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    const r = await fetch(`${SUPA_URL}/auth/v1/signup`, {
      method: "POST",
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: em, password: pw, data: { name: nm || em.split("@")[0] } }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      const raw = String(d.msg || d.error_description || d.error || "Sign-up failed");
      const msg = /already (registered|exists)|duplicate/i.test(raw) ? "An account with this email already exists — try signing in instead." : raw;
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    const confirmed = !!(d.session?.access_token || d.access_token);
    return NextResponse.json({
      confirmed,
      user: { email: d.user?.email || em, name: d.user?.user_metadata?.name || nm },
      message: confirmed
        ? "Account created — you're signed in! 🎉"
        : "Account created! 🎉 We've sent you a confirmation email — check your inbox (and spam folder) and click the link to activate your account.",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Sign-up failed" }, { status: 400 });
  }
}
