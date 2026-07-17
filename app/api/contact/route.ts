import { Resend } from "resend";

export const runtime = "edge";

type Payload = {
  name?: string;
  email?: string;
  message?: string;
  hp?: string;        // honeypot (must be empty)
  startedAt?: number; // client timestamp (must not be "too fast")
};

function isString(x: unknown): x is string {
  return typeof x === "string";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    const name = isString(body.name) ? body.name.trim() : "";
    const email = isString(body.email) ? body.email.trim() : "";
    const message = isString(body.message) ? body.message.trim() : "";

    // 1) Honeypot: bots often fill hidden fields
    const hp = isString(body.hp) ? body.hp.trim() : "";
    if (hp.length > 0) {
      // Return OK to avoid giving bots a signal
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // 2) Minimum submit time (basic bot filter)
    const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;
    const elapsedMs = startedAt > 0 ? Date.now() - startedAt : 0;
    if (startedAt > 0 && elapsedMs >= 0 && elapsedMs < 2500) {
      // Too fast to be human
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // 3) Basic validation
    if (!message) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid message" }), { status: 400 });
    }
    if (message.length > 5000) {
      return new Response(JSON.stringify({ ok: false, error: "Message too long" }), { status: 400 });
    }
    if (name.length > 200 || email.length > 320) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid fields" }), { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Protocolum <contact@protocolum.se>",
      to: ["contact@protocolum.se"],
      replyTo: email || undefined,
      subject: "New contact message",
      text: `Name: ${name || "-"}\nEmail: ${email || "-"}\n\n${message}`,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
}
