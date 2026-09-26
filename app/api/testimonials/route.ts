import { NextResponse } from "next/server";
import { listTestimonials } from "@/lib/store";

export async function GET() {
  try { return NextResponse.json(await listTestimonials()); }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
