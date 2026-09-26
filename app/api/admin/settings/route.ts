import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings, settingsReady, verifyAdmin } from "@/lib/store";

export async function GET(req: NextRequest) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!(await verifyAdmin(token))) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  return NextResponse.json({ settings: await getSettings(), ready: await settingsReady() });
}

export async function PATCH(req: NextRequest) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!(await verifyAdmin(token))) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  try {
    await saveSettings(await req.json());
    return NextResponse.json({ ok: true, settings: await getSettings(), ready: await settingsReady() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
