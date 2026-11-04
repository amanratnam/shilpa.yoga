import { campaigns } from "@/content/campaigns";
import { EXPERIENCE_LEVELS, PREFERRED_TIMES, labelOf } from "@/lib/leads/schema";
import type { CampaignLead } from "@/lib/leads/store";

/** One definition of the lead columns, shared by the screen and the export. */
export const LEAD_COLUMNS = [
  { key: "received", label: "Received (IST)", width: 20 },
  { key: "campaign", label: "Campaign", width: 18 },
  { key: "name", label: "Name", width: 22 },
  { key: "phone", label: "WhatsApp", width: 18 },
  { key: "email", label: "Email", width: 28 },
  { key: "country", label: "City / country", width: 18 },
  { key: "plan", label: "Plan", width: 14 },
  { key: "experience", label: "Experience", width: 18 },
  { key: "time", label: "Best time", width: 12 },
  { key: "message", label: "Message", width: 40 },
  { key: "source", label: "Source", width: 24 },
] as const;

export function campaignLabel(slug: string): string {
  return campaigns.find((c) => c.slug === slug)?.name ?? slug;
}

export function receivedIST(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function sourceOf(l: CampaignLead): string {
  return [l.utmSource, l.utmMedium, l.utmCampaign].filter(Boolean).join(" / ") || (l.referrer ? "Referral" : "Direct");
}

export function leadRows(leads: CampaignLead[]): string[][] {
  return leads.map((l) => [
    receivedIST(l.createdAt),
    campaignLabel(l.campaign),
    l.fullName,
    l.phone,
    l.email,
    l.country,
    l.planInterest,
    labelOf(EXPERIENCE_LEVELS, l.experience),
    labelOf(PREFERRED_TIMES, l.preferredTime),
    l.message,
    sourceOf(l),
  ]);
}

export function filterLeads(leads: CampaignLead[], { campaign, q }: { campaign: string; q: string }) {
  const needle = q.trim().toLowerCase();
  return leads.filter(
    (l) =>
      (!campaign || l.campaign === campaign) &&
      (!needle ||
        [l.fullName, l.phone, l.email, l.country, l.message].some((v) => v.toLowerCase().includes(needle))),
  );
}
