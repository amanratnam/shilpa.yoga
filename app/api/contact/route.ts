import { NextResponse } from "next/server";
import { contactSchema, interestOptions } from "@/lib/validation";
import {
  resend,
  emailConfig,
  enquiryEmailHtml,
  enquiryEmailText,
} from "@/lib/email";

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

  const { name, email, phone, country, interest, plan, message, company } =
    parsed.data;

  // Honeypot tripped, pretend success, send nothing.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  const course =
    interestOptions.find((o) => o.value === interest)?.label ?? interest;

  const data = {
    name,
    email,
    phone: phone || undefined,
    country,
    course,
    category: plan || undefined,
    notes: message || undefined,
  };

  // No key configured (local dev), succeed without sending so the UI works.
  if (!resend) {
    console.warn("[contact] RESEND_API_KEY not set, enquiry not emailed:", {
      name,
      email,
      country,
      interest,
    });
    return NextResponse.json({ ok: true });
  }

  try {
    const { error } = await resend.emails.send({
      from: emailConfig.from,
      to: emailConfig.to,
      replyTo: email,
      subject: `New enquiry · ${course} · ${name} (${country})`,
      html: enquiryEmailHtml(data),
      text: enquiryEmailText(data),
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
