
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { jobId, moonlighterId } = await req.json();

    if (!jobId || !moonlighterId) {
      throw new Error("Both jobId and moonlighterId are required");
    }

    // Fetch job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError) throw new Error(`Error fetching job: ${jobError.message}`);

    // Fetch moonlighter profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', moonlighterId)
      .single();

    if (profileError) throw new Error(`Error fetching profile: ${profileError.message}`);

    // Fetch moonlighter's license
    const { data: license, error: licenseError } = await supabase
      .from('prc_licenses')
      .select('*')
      .eq('user_id', moonlighterId)
      .maybeSingle();

    // It's okay if license doesn't exist, but log error if it's a different issue
    if (licenseError && licenseError.code !== 'PGRST116') {
      console.error("Error fetching license:", licenseError);
    }

    // Create prompt for OpenAI
    const prompt = `
    I need to score the match between a healthcare professional and a job opening.
    
    Job details:
    - Title: ${job.title}
    - Company: ${job.company}
    - Description: ${job.description}
    - Type: ${job.type}
    - Location: ${job.location || 'Not specified'}
    - Specialization: ${job.specialization || 'Not specified'}
    - Experience Level: ${job.experience_level || 'Not specified'}
    - Requirements: ${JSON.stringify(job.requirements || [])}
    
    Professional profile:
    - Specialization: ${profile.specialization || 'Not specified'}
    - Years of Experience: ${profile.years_of_experience || 'Not specified'}
    - Has PRC License: ${license ? 'Yes' : 'No'}
    - License profession: ${license ? license.profession : 'Not available'}
    
    Based on these details, provide a match score between 0 and 100 where:
    - 0-30: Poor match (major misalignment in specialization or requirements)
    - 31-60: Moderate match (some alignment but significant gaps)
    - 61-85: Good match (alignment in most areas)
    - 86-100: Excellent match (perfect or near-perfect alignment)
    
    Return only a number representing the score.
    `;

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a healthcare recruitment AI assistant that evaluates job matches. Respond with only a numeric score.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const openAIData = await openAIResponse.json();
    const matchScoreText = openAIData.choices[0].message.content.trim();
    
    // Extract just the number from the response
    const matchScore = parseFloat(matchScoreText.replace(/\D/g, ''));
    
    if (isNaN(matchScore)) {
      throw new Error("Failed to parse match score from AI response");
    }

    // Store the match score in the job_applications table
    const { data: application, error: applicationError } = await supabase
      .from('job_applications')
      .upsert({
        job_id: jobId,
        moonlighter_id: moonlighterId,
        ai_match_score: matchScore,
      }, {
        onConflict: 'job_id,moonlighter_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (applicationError) {
      throw new Error(`Error updating application: ${applicationError.message}`);
    }

    return new Response(JSON.stringify({ 
      matchScore,
      application
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in job-matching function:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
