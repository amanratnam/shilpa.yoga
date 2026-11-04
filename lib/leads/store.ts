import "server-only";
import { supabaseAdmin } from "@/lib/admin/supabase";
import { verifySession } from "@/lib/admin/auth";
import { dataError } from "@/lib/admin/errors";
import type { CampaignLeadInput } from "@/lib/leads/schema";

export type CampaignLead = {
  id: string;
  createdAt: string;
  campaign: string;
  fullName: string;
  phone: string;
  email: string;
  country: string;
  experience: string;
  preferredTime: string;
  planInterest: string;
  message: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrer: string;
};

type Row = {
  id: string;
  created_at: string;
  campaign: string;
  full_name: string;
  phone: string;
  email: string | null;
  country: string | null;
  experience: string | null;
  preferred_time: string | null;
  plan_interest: string | null;
  message: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
};

/** Public write path: called by the landing-page form's route handler. */
export async function insertCampaignLead(input: CampaignLeadInput): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("campaign_leads")
    .insert({
      campaign: input.campaign,
      full_name: input.fullName,
      phone: input.phone,
      email: input.email || null,
      country: input.country || null,
      experience: input.experience || null,
      preferred_time: input.preferredTime || null,
      plan_interest: input.planInterest || null,
      message: input.message || null,
      utm_source: input.utmSource || null,
      utm_medium: input.utmMedium || null,
      utm_campaign: input.utmCampaign || null,
      referrer: input.referrer || null,
    });
  if (error) throw new Error(error.message);
}

/** Admin read path: every lead, newest first. */
export async function listCampaignLeads(): Promise<CampaignLead[]> {
  await verifySession();
  const { data, error } = await supabaseAdmin()
    .from("campaign_leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw dataError(error, "Could not load campaign leads");
  return ((data ?? []) as Row[]).map((r) => ({
    id: r.id,
    createdAt: r.created_at,
    campaign: r.campaign,
    fullName: r.full_name,
    phone: r.phone,
    email: r.email ?? "",
    country: r.country ?? "",
    experience: r.experience ?? "",
    preferredTime: r.preferred_time ?? "",
    planInterest: r.plan_interest ?? "",
    message: r.message ?? "",
    utmSource: r.utm_source ?? "",
    utmMedium: r.utm_medium ?? "",
    utmCampaign: r.utm_campaign ?? "",
    referrer: r.referrer ?? "",
  }));
}
