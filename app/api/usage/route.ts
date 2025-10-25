import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ remaining: 0 }, { status: 200 });
}
