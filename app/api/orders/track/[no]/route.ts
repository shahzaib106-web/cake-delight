import { NextRequest, NextResponse } from "next/server";
import { trackOrder } from "@/lib/store";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ no: string }> }) {
  const { no } = await ctx.params;
  try { return NextResponse.json(await trackOrder(decodeURIComponent(no))); }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 404 }); }
}
