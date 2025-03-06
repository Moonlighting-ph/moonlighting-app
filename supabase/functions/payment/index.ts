
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";
import Stripe from "https://esm.sh/stripe@12.18.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key is not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { applicationId, amount, providerId, moonlighterId } = await req.json();

    // Validate required parameters
    if (!applicationId || !amount || !providerId || !moonlighterId) {
      throw new Error("Missing required parameters");
    }

    // Create a payment intent in Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: 'php',
      metadata: {
        application_id: applicationId,
        provider_id: providerId,
        moonlighter_id: moonlighterId,
      },
    });

    // Save payment record in the database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        application_id: applicationId,
        amount: amount,
        provider_id: providerId,
        moonlighter_id: moonlighterId,
        stripe_payment_intent_id: paymentIntent.id,
        status: 'pending',
      })
      .select()
      .single();

    if (paymentError) {
      throw new Error(`Error creating payment record: ${paymentError.message}`);
    }

    return new Response(JSON.stringify({ 
      paymentIntent: {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
      },
      payment
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in payment function:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
