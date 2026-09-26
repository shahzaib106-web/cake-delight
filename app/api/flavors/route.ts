import { NextResponse } from "next/server";
import { listFlavors, listTestimonials } from "@/lib/store";

export async function GET() {
  try { return NextResponse.json(await listFlavors()); }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
