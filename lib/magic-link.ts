import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function generateToken(userId: string) {
  return jwt.sign({ userId }, process.env.NEXTAUTH_SECRET!, { expiresIn: "15m" });
}

export async function sendMagicLinkEmail(email: string, link: string) {
  // Create transporter using Gmail (or your SMTP)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Fatura login link",
    html: `<p>Click <a href="${link}">here</a> to log in. This link expires in 15 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent to ${email}`);
}