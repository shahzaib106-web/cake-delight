import { NextRequest, NextResponse } from "next/server";
import { createMessage } from "@/lib/store";

export async function POST(req: NextRequest) {
  try { const r = await createMessage(await req.json()); return NextResponse.json(r); }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}
