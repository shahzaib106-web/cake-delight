import { NextRequest, NextResponse } from "next/server";
import { usingSupabase, supa } from "@/lib/store";
/** Customer "My Orders" — verifies the GoTrue session, then returns
 *  orders + custom requests matching the signed-in email. */

const SUPA_URL = process.env.SUPABASE_URL || "";
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function GET(req: NextRequest) {
  try {
    const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const me = await fetch(`${SUPA_URL}/auth/v1/user`, { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${token}` } });
    if (!me.ok) return NextResponse.json({ error: "Session expired — please sign in again." }, { status: 401 });
    const user = await me.json();
    const email = String(user.email || "").toLowerCase();
    if (!email) return NextResponse.json({ error: "Session invalid" }, { status: 401 });

    if (usingSupabase) {
      const [orders, customs] = await Promise.all([
        supa().from("orders").select("*, order_items(*)").ilike("email", email).order("id", { ascending: false }),
        supa().from("custom_orders").select("*").ilike("email", email).order("id", { ascending: false }),
      ]);
      return NextResponse.json({ email, orders: orders.data || [], custom_orders: customs.data || [] });
    }
    return NextResponse.json({ email, orders: [], custom_orders: [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
