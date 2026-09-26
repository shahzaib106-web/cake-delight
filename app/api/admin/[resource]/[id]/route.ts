import { NextRequest, NextResponse } from "next/server";
import { adminGet, adminUpdate, adminDelete, verifyAdmin, type Resource } from "@/lib/store";

const RESOURCES: Resource[] = ["products", "orders", "custom-orders", "flavors", "testimonials", "messages"];

async function guard(req: NextRequest) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return verifyAdmin(token);
}

type Ctx = { params: Promise<{ resource: string; id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  if (!(await guard(req))) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { resource, id } = await ctx.params;
  if (!RESOURCES.includes(resource as Resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  try { return NextResponse.json(await adminGet(resource as Resource, Number(id))); }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 404 }); }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!(await guard(req))) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { resource, id } = await ctx.params;
  if (!RESOURCES.includes(resource as Resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  try { return NextResponse.json(await adminUpdate(resource as Resource, Number(id), await req.json())); }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  if (!(await guard(req))) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { resource, id } = await ctx.params;
  if (!RESOURCES.includes(resource as Resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  try { return NextResponse.json(await adminDelete(resource as Resource, Number(id))); }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}
