import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
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

    const { request_id, payment_type } = await req.json();

    if (!request_id || !payment_type) {
      return new Response(
        JSON.stringify({ error: "Missing request_id or payment_type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (payment_type !== "half" && payment_type !== "remaining") {
      return new Response(
        JSON.stringify({ error: "payment_type must be 'half' or 'remaining'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: request, error: reqError } = await supabaseAdmin
      .from("design_requests")
      .select("id, user_id, email, service, status, standard_price, half_paid, fully_paid")
      .eq("id", request_id)
      .single();

    if (reqError || !request) {
      console.error("Design request query error:", reqError?.message, reqError?.details, reqError?.hint);
      return new Response(
        JSON.stringify({ error: "Design request not found", detail: reqError?.message || "No row returned" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (request.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "You do not own this design request" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (request.status !== "Accepted" && request.status !== "Completed") {
      return new Response(
        JSON.stringify({ error: "This request is not eligible for payment" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const totalKobo = Math.round(Number(request.standard_price) * 100);
    if (!totalKobo || totalKobo <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid project price" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const halfKobo = Math.round(totalKobo / 2);
    let amountKobo: number;

    if (payment_type === "half") {
      if (request.half_paid) {
        return new Response(
          JSON.stringify({ error: "First payment already completed", already_paid: true }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      amountKobo = halfKobo;
    } else {
      if (!request.half_paid) {
        return new Response(
          JSON.stringify({ error: "First payment has not been completed yet" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (request.fully_paid) {
        return new Response(
          JSON.stringify({ error: "Project is fully paid", already_paid: true }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      amountKobo = halfKobo;
    }

    const { data: existingPayment } = await supabaseAdmin
      .from("payments")
      .select("id, verified")
      .eq("design_request_id", request_id)
      .eq("payment_type", payment_type)
      .eq("verified", true)
      .maybeSingle();

    if (existingPayment) {
      return new Response(
        JSON.stringify({ error: `${payment_type} payment already verified`, already_paid: true }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const reference = `EG-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: request.email || user.email,
        amount: amountKobo,
        currency: "NGN",
        reference,
        metadata: {
          request_id: request.id,
          payment_type: payment_type,
          service: request.service,
        },
        callback_url: `${Deno.env.get("SITE_URL") || "https://expandglobal.online"}/payment/callback`,
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      return new Response(
        JSON.stringify({ error: "Payment initialization failed", details: paystackData.message }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await supabaseAdmin.from("payments").insert({
      design_request_id: request_id,
      user_id: user.id,
      paystack_reference: reference,
      amount_kobo: amountKobo,
      currency: "NGN",
      payment_type,
      verified: false,
    });

    return new Response(
      JSON.stringify({
        authorization_url: paystackData.data.authorization_url,
        reference: paystackData.data.reference,
        access_code: paystackData.data.access_code,
        amount_kobo: amountKobo,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("initialize-payment error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
