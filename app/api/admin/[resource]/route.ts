import { NextRequest, NextResponse } from "next/server";
import { adminList, adminCreate, verifyAdmin, type Resource } from "@/lib/store";
import { createClient } from "@supabase/supabase-js";

const RESOURCES: Resource[] = ["products", "orders", "custom-orders", "flavors", "testimonials", "messages"];

async function guard(req: NextRequest) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return verifyAdmin(token);
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ resource: string }> }) {
  if (!(await guard(req))) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { resource } = await ctx.params;
  if (!RESOURCES.includes(resource as Resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const p = req.nextUrl.searchParams;
  try {
    return NextResponse.json(await adminList(resource as Resource, { status: p.get("status") || undefined, q: p.get("q") || undefined }));
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ resource: string }> }) {
  if (!(await guard(req))) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { resource } = await ctx.params;
  if (!RESOURCES.includes(resource as Resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  try { return NextResponse.json(await adminCreate(resource as Resource, await req.json())); }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}
