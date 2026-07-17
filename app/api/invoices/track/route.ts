import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId } = body;

    if (!invoiceId) {
      return NextResponse.json(
        { error: "Invoice ID required" },
        { status: 400 }
      );
    }

    // Update invoice view count
    const updated = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        viewCount: { increment: 1 },
        viewedAt: new Date(),
        lastViewedAt: new Date(),
      },
      select: {
        viewCount: true,
        viewedAt: true,
        lastViewedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      views: updated.viewCount,
      viewedAt: updated.viewedAt,
      lastViewedAt: updated.lastViewedAt,
    });
  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 }
    );
  }
}