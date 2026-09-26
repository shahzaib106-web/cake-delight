import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/store";

export async function GET(req: NextRequest) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const admin = await verifyAdmin(token);
  if (!admin) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  return NextResponse.json({ ok: true, admin });
}
