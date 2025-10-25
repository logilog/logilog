import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "OCR pipeline not yet implemented" }, { status: 501 });
}
