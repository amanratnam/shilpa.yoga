import { NextResponse } from "next/server";
import { contactSchema, interestOptions } from "@/lib/validation";
import { resend, emailConfig, escapeHtml } from "@/lib/email";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 422 },
    );
  }

  const { name, email, phone, interest, message, company } = parsed.data;

  // Honeypot tripped — pretend success, send nothing.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  const interestLabel =
    interestOptions.find((o) => o.value === interest)?.label ?? interest;

  // No key configured (local dev) — succeed without sending so the UI works.
  if (!resend) {
    console.warn("[contact] RESEND_API_KEY not set — enquiry not emailed:", {
      name,
      email,
      interest,
    });
    return NextResponse.json({ ok: true });
  }

  try {
    const { error } = await resend.emails.send({
      from: emailConfig.from,
      to: emailConfig.to,
      replyTo: email,
      subject: `New enquiry — ${interestLabel} — ${name}`,
      html: `
        <h2>New enquiry from shilpa.yoga</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
        <p><strong>Interested in:</strong> ${escapeHtml(interestLabel)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        { error: "Could not send your message. Please email me directly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
