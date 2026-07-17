import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Test GET endpoint working!" });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ message: "Test POST endpoint working!", data: body });
}