import { NextResponse } from "next/server";
import { verifySession } from "@/lib/admin/auth";
import { getClient } from "@/lib/admin/clients";
import { getSubscription } from "@/lib/admin/subscriptions";
import { buildReceiptPdf, receiptFilename } from "@/lib/admin/receipt";

/**
 * Streams the receipt for one subscription as a PDF download.
 *
 * Route Handlers are reachable directly, so this re-checks the session rather
 * than trusting the proxy.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await verifySession();

  const { id } = await params;
  const subscription = await getSubscription(id);
  if (!subscription) {
    return new NextResponse("Subscription not found", { status: 404 });
  }

  const client = await getClient(subscription.clientId);
  if (!client) {
    return new NextResponse("Client not found", { status: 404 });
  }

  const pdf = await buildReceiptPdf(client, subscription, new Date());

  return new NextResponse(pdf as BodyInit, {
    headers: {
      "content-type": "application/pdf",
      "content-length": String(pdf.byteLength),
      "content-disposition": `attachment; filename="${receiptFilename(client, subscription)}"`,
      // Receipts reflect live data; never let a proxy hold on to one.
      "cache-control": "no-store",
    },
  });
}
