// app/api/auth/magic-link/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { nanoid } from "nanoid";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { identifier } = body;
    if (!identifier) {
      return NextResponse.json({ error: "Email or phone required" }, { status: 400 });
    }
    const normalized = identifier.trim();

    // Try to find existing user
    let user = null;
    let isEmail = normalized.includes('@');
    if (isEmail) {
      user = await prisma.user.findUnique({ where: { email: normalized } });
    } else {
      let phoneClean = normalized.replace(/[\s\-()]/g, '');
      if (!phoneClean.startsWith('+') && !phoneClean.startsWith('00')) {
        if (/^\d+$/.test(phoneClean)) phoneClean = '+' + phoneClean;
      }
      const variants = [phoneClean, phoneClean.replace(/^\+/, ''), phoneClean.replace(/^00/, ''), `+${phoneClean.replace(/^\+/, '').replace(/^00/, '')}`];
      user = await prisma.user.findFirst({
        where: { OR: variants.map(v => ({ phone: v })) }
      });
    }

    // If user doesn't exist, create one
    if (!user) {
      if (isEmail) {
        user = await prisma.user.create({
          data: {
            email: normalized,
            role: "USER",
          },
        });
      } else {
        // For phone, create a placeholder email
        const digits = normalized.replace(/\D/g, '');
        const placeholderEmail = `${digits}@phone.fatura.one`;
        user = await prisma.user.create({
          data: {
            email: placeholderEmail,
            phone: normalized,
            role: "USER",
          },
        });
      }
    }

    // Generate token
    const token = nanoid(32);
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    await prisma.verificationToken.create({
      data: { 
        identifier: user.email || user.phone || "", 
        token, 
        expires 
      }
    });

    // Use environment variable for base URL
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const magicLink = `${baseUrl}/api/auth/magic-verify?token=${token}&email=${encodeURIComponent(user.email || user.phone || normalized)}`;

    // Attempt to send email if user has email
    let emailSent = false;
    if (user.email && !user.email.endsWith('@phone.fatura.one') && resend) {
      try {
        await resend.emails.send({
          from: "Fatura <noreply@fatura.one>",
          to: user.email,
          subject: "Your magic sign-in link",
          html: `<p>Click <a href="${magicLink}">here</a> to sign in. This link expires in 15 minutes.</p>`
        });
        emailSent = true;
      } catch (e) {
        console.error("Email send error:", e);
      }
    }

    // Always return the link so frontend can open it (WhatsApp or directly)
    return NextResponse.json({ 
      success: true, 
      message: emailSent ? "Check your email for the link." : "Use the link below to sign in.",
      waLink: magicLink 
    });
  } catch (error) {
    console.error("Magic link error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}