import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.208.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

async function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    );
    const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
    const computed = Array.from(new Uint8Array(signed))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return computed === signature;
  } catch {
    return false;
  }
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");

    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY not set");
      return new Response("ok", { status: 200, headers: corsHeaders });
    }

    const paystackSignature = req.headers.get("x-paystack-signature");
    if (!paystackSignature) {
      return new Response("Missing signature", { status: 400, headers: corsHeaders });
    }

    const rawBody = await req.text();

    const isValid = await verifyWebhookSignature(rawBody, paystackSignature, paystackSecretKey);
    if (!isValid) {
      console.error("Invalid webhook signature");
      return new Response("Invalid signature", { status: 401, headers: corsHeaders });
    }

    const event = JSON.parse(rawBody);

    if (event.event !== "charge.success") {
      return new Response("Unhandled event", { status: 200, headers: corsHeaders });
    }

    const txn = event.data;
    const reference = txn.reference;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: paymentRecord } = await supabaseAdmin
      .from("payments")
      .select("*, design_requests!inner(id, email, service, standard_price, half_paid, fully_paid)")
      .eq("paystack_reference", reference)
      .maybeSingle();

    if (!paymentRecord) {
      return new Response("Payment record not found", { status: 200, headers: corsHeaders });
    }

    if (paymentRecord.verified) {
      return new Response("Already verified", { status: 200, headers: corsHeaders });
    }

    if (txn.status !== "success") {
      return new Response("Transaction not successful", { status: 200, headers: corsHeaders });
    }

    if (txn.currency !== "NGN") {
      return new Response("Invalid currency", { status: 200, headers: corsHeaders });
    }

    const designRequest = paymentRecord.design_requests;
    const totalKobo = Math.round(Number(designRequest.standard_price) * 100);
    const expectedKobo = Math.round(totalKobo / 2);

    if (txn.amount !== expectedKobo) {
      console.error(`Amount mismatch for ${reference}: expected ${expectedKobo}, got ${txn.amount}`);
      return new Response("Amount mismatch", { status: 200, headers: corsHeaders });
    }

    const now = new Date().toISOString();

    await supabaseAdmin
      .from("payments")
      .update({
        verified: true,
        verified_at: now,
        paystack_response: txn,
      })
      .eq("id", paymentRecord.id);

    if (paymentRecord.payment_type === "half" && !designRequest.half_paid) {
      await supabaseAdmin
        .from("design_requests")
        .update({ half_paid: true })
        .eq("id", designRequest.id);

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", designRequest.email)
        .maybeSingle();

      if (profile) {
        await supabaseAdmin.from("notifications").insert({
          user_id: profile.id,
          message: `Payment received for "${designRequest.service}"! Your design is now being worked on.`,
          type: "payment",
          read: false,
          link: "/completed-projects",
        });
      }
    }

    if (paymentRecord.payment_type === "remaining" && !designRequest.fully_paid) {
      await supabaseAdmin
        .from("design_requests")
        .update({ fully_paid: true })
        .eq("id", designRequest.id);

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", designRequest.email)
        .maybeSingle();

      if (profile) {
        await supabaseAdmin.from("notifications").insert({
          user_id: profile.id,
          message: `Full payment received for "${designRequest.service}"! You can now download your finished design.`,
          type: "payment",
          read: false,
          link: "/completed-projects",
        });
      }
    }

    return new Response("ok", { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("paystack-webhook error:", err);
    return new Response("ok", { status: 200, headers: corsHeaders });
  }
});
