import { NextRequest, NextResponse } from "next/server";
import { adminStats, verifyAdmin } from "@/lib/store";

export async function GET(req: NextRequest) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!(await verifyAdmin(token))) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  try { return NextResponse.json(await adminStats()); }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
