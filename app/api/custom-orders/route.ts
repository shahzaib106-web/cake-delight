import { NextRequest, NextResponse } from "next/server";
import { createCustomOrder } from "@/lib/store";

export async function POST(req: NextRequest) {
  try { return NextResponse.json(await createCustomOrder(await req.json())); }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}
