import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma/client";
import { supabase } from "@/lib/supabase/client";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "fallback-secret-change-me");

async function getUserId(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authjs.session-token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("logo") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Use PNG, JPEG, WebP, or SVG." }, { status: 400 });
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 2MB." }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const fileExt = file.name.split(".").pop() || "png";
    const fileName = `${userId}/logo.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true, // Overwrite if exists
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("logos")
      .getPublicUrl(fileName);

    const logoUrl = urlData.publicUrl;

    // Save URL to User table
    await prisma.user.update({
      where: { id: userId },
      data: { logoUrl },
    });

    return NextResponse.json({ success: true, logoUrl });
  } catch (error) {
    console.error("Logo upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}