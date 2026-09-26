import { NextRequest, NextResponse } from "next/server";
import { listProducts } from "@/lib/store";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  try {
    const data = await listProducts({
      category: p.get("category") || undefined,
      q: p.get("q") || undefined,
      bestseller: p.get("bestseller") || undefined,
      sort: p.get("sort") || undefined,
    });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
