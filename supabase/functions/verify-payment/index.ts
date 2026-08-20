import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");

    if (!paystackSecretKey) {
      return new Response(
        JSON.stringify({ error: "Payment system not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace("Bearer ", "");
    const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { reference } = await req.json();

    if (!reference) {
      return new Response(
        JSON.stringify({ error: "Missing reference" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: paymentRecord, error: paymentError } = await supabaseAdmin
      .from("payments")
      .select("*, design_requests!inner(id, user_id, email, service, standard_price, half_paid, fully_paid)")
      .eq("paystack_reference", reference)
      .maybeSingle();

    if (paymentError || !paymentRecord) {
      return new Response(
        JSON.stringify({ error: "Payment record not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (paymentRecord.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "This payment does not belong to you" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (paymentRecord.verified) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Payment already verified",
          payment_type: paymentRecord.payment_type,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      return new Response(
        JSON.stringify({ error: "Could not verify transaction with Paystack" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const txn = paystackData.data;

    if (txn.status !== "success") {
      return new Response(
        JSON.stringify({ error: "Transaction was not successful", status: txn.status }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (txn.currency !== "NGN") {
      return new Response(
        JSON.stringify({ error: "Invalid currency", currency: txn.currency }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const designRequest = paymentRecord.design_requests;
    const totalKobo = Math.round(Number(designRequest.standard_price) * 100);
    const expectedKobo = Math.round(totalKobo / 2);

    if (txn.amount !== expectedKobo) {
      return new Response(
        JSON.stringify({
          error: "Amount mismatch",
          expected: expectedKobo,
          received: txn.amount,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
          link: "/active-requests",
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

    return new Response(
      JSON.stringify({
        success: true,
        payment_type: paymentRecord.payment_type,
        message: paymentRecord.payment_type === "half"
          ? "First payment verified successfully"
          : "Final payment verified successfully",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("verify-payment error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
