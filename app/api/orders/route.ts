import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/store";

export async function POST(req: NextRequest) {
  try { return NextResponse.json(await createOrder(await req.json())); }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}
