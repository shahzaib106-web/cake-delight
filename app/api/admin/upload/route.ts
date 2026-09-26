import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, usingSupabase } from "@/lib/store";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!(await verifyAdmin(token))) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get("image") as File | null;
    if (!file) return NextResponse.json({ error: "Please choose an image file" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    if (!/\.(jpe?g|png|webp|gif)$/i.test(file.name)) return NextResponse.json({ error: "Only jpg/png/webp/gif allowed" }, { status: 400 });

    if (usingSupabase) {
      const SUPA_URL = process.env.SUPABASE_URL!;
      const SUPA_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      const buf = Buffer.from(await file.arrayBuffer());
      const res = await fetch(`${SUPA_URL}/storage/v1/object/product-images/${encodeURIComponent(file.name)}`, {
        method: "POST", headers: { Authorization: `Bearer ${SUPA_SERVICE}`, "Content-Type": file.type || "image/jpeg", "x-upsert": "true" }, body: buf,
      });
      if (!res.ok) return NextResponse.json({ error: "Supabase storage upload failed (create a public 'product-images' bucket)" }, { status: 500 });
      return NextResponse.json({ path: `${SUPA_URL}/storage/v1/object/public/product-images/${file.name}` });
    }

    const ext = path.extname(file.name).toLowerCase();
    const name = `cake-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ path: `/uploads/${name}` });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Upload failed" }, { status: 500 });
  }
}
