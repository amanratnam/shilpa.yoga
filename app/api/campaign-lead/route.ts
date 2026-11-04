import { NextResponse } from "next/server";
import { campaignLeadSchema, EXPERIENCE_LEVELS, PREFERRED_TIMES, labelOf } from "@/lib/leads/schema";
import { insertCampaignLead } from "@/lib/leads/store";
import { getCampaign } from "@/content/campaigns";
import { resend, emailConfig, enquiryEmailHtml, enquiryEmailText } from "@/lib/email";

/**
 * Festival landing-page enquiries. The lead is saved to `campaign_leads` (for
 * the admin Leads module) and emailed to the studio. Either one succeeding is
 * enough to tell the visitor "received" — a lead must never be lost because
 * one channel had a bad moment.
 */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = campaignLeadSchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Please check the form and try again." },
      { status: 422 },
    );
  }
  const lead = parsed.data;

  // Honeypot tripped: pretend success, store nothing.
  if (lead.company) return NextResponse.json({ ok: true });

  const campaign = getCampaign(lead.campaign);
  if (!campaign) {
    return NextResponse.json({ error: "Unknown offer." }, { status: 400 });
  }

  let saved = false;
  try {
    await insertCampaignLead(lead);
    saved = true;
  } catch (err) {
    console.error("[campaign-lead] Could not save lead:", err);
  }

  let emailed = false;
  if (resend) {
    try {
      const notes = [
        `Experience: ${labelOf(EXPERIENCE_LEVELS, lead.experience) || "not given"}`,
        `Preferred time: ${labelOf(PREFERRED_TIMES, lead.preferredTime) || "not given"}`,
        lead.message ? `Message: ${lead.message}` : "",
        lead.utmSource ? `Source: ${[lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ")}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      const data = {
        name: lead.fullName,
        email: lead.email || "(not given)",
        phone: lead.phone,
        country: lead.country || "Not given",
        course: `${campaign.name} offer · Online group classes (${campaign.discountPercent}% off)`,
        category: lead.planInterest || undefined,
        notes,
      };
      const { error } = await resend.emails.send({
        from: emailConfig.from,
        to: emailConfig.to,
        ...(lead.email ? { replyTo: lead.email } : {}),
        subject: `New ${campaign.festival} offer lead · ${lead.fullName}`,
        html: enquiryEmailHtml(data),
        text: enquiryEmailText(data),
      });
      emailed = !error;
      if (error) console.error("[campaign-lead] Resend error:", error);
    } catch (err) {
      console.error("[campaign-lead] Email failed:", err);
    }
  }

  if (!saved && !emailed) {
    return NextResponse.json(
      { error: "Something went wrong. Please message us on WhatsApp instead." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
