import { NextRequest, NextResponse } from "next/server";
import { adminLogin } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    return NextResponse.json(await adminLogin(username, password));
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
