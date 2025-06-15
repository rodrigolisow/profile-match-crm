import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// DISC scoring logic - simplified example
const DISC_SCORING = {
  // Question 1: How do you approach challenges?
  "q1": {
    "A": { D: 3, I: 0, S: 0, C: 1 }, // Direct approach
    "B": { D: 1, I: 3, S: 0, C: 0 }, // Enthusiastic approach  
    "C": { D: 0, I: 0, S: 3, C: 1 }, // Careful approach
    "D": { D: 0, I: 1, S: 1, C: 3 }  // Analytical approach
  },
  // Question 2: In team settings, you prefer to...
  "q2": {
    "A": { D: 3, I: 1, S: 0, C: 0 }, // Lead decisively
    "B": { D: 1, I: 3, S: 0, C: 0 }, // Motivate others
    "C": { D: 0, I: 0, S: 3, C: 1 }, // Support the team
    "D": { D: 0, I: 0, S: 1, C: 3 }  // Ensure accuracy
  },
  // Question 3: When making decisions, you...
  "q3": {
    "A": { D: 3, I: 0, S: 0, C: 1 }, // Decide quickly
    "B": { D: 1, I: 3, S: 0, C: 0 }, // Consider people impact
    "C": { D: 0, I: 1, S: 3, C: 0 }, // Take time to think
    "D": { D: 0, I: 0, S: 1, C: 3 }  // Gather all data
  },
  // Question 4: Your communication style is...
  "q4": {
    "A": { D: 3, I: 1, S: 0, C: 0 }, // Direct and brief
    "B": { D: 1, I: 3, S: 0, C: 0 }, // Expressive and engaging
    "C": { D: 0, I: 1, S: 3, C: 0 }, // Patient and listening
    "D": { D: 0, I: 0, S: 1, C: 3 }  // Precise and detailed
  },
  // Question 5: Under pressure, you tend to...
  "q5": {
    "A": { D: 3, I: 0, S: 0, C: 1 }, // Take charge
    "B": { D: 1, I: 3, S: 0, C: 0 }, // Stay optimistic
    "C": { D: 0, I: 0, S: 3, C: 1 }, // Remain calm
    "D": { D: 0, I: 1, S: 1, C: 3 }  // Focus on facts
  }
};

function calculateDISCScore(answers: Record<string, string>): Record<string, number> {
  const scores = { D: 0, I: 0, S: 0, C: 0 };
  
  Object.entries(answers).forEach(([questionId, answer]) => {
    const questionScoring = DISC_SCORING[questionId as keyof typeof DISC_SCORING];
    if (questionScoring && questionScoring[answer as keyof typeof questionScoring]) {
      const answerScores = questionScoring[answer as keyof typeof questionScoring];
      scores.D += answerScores.D;
      scores.I += answerScores.I;
      scores.S += answerScores.S;
      scores.C += answerScores.C;
    }
  });
  
  // Calculate percentages
  const total = scores.D + scores.I + scores.S + scores.C;
  if (total > 0) {
    scores.D = Math.round((scores.D / total) * 100);
    scores.I = Math.round((scores.I / total) * 100);
    scores.S = Math.round((scores.S / total) * 100);
    scores.C = Math.round((scores.C / total) * 100);
  }
  
  return scores;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resultId } = await req.json();
    
    if (!resultId) {
      throw new Error('Result ID is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the result with answers
    const { data: result, error: fetchError } = await supabase
      .from('results')
      .select('*')
      .eq('id', resultId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch result: ${fetchError.message}`);
    }

    if (!result.answers) {
      throw new Error('No answers found for this result');
    }

    // Calculate DISC scores
    const discScores = calculateDISCScore(result.answers);
    
    // Calculate percentage and determine dominant profile
    const dominantProfile = Object.entries(discScores).reduce((a, b) => 
      discScores[a[0] as keyof typeof discScores] > discScores[b[0] as keyof typeof discScores] ? a : b
    )[0];

    const finalScore = {
      ...discScores,
      percentage: Math.max(...Object.values(discScores)),
      dominantProfile
    };

    // Update the result with calculated scores
    const { error: updateError } = await supabase
      .from('results')
      .update({ 
        score: finalScore,
        completed_at: new Date().toISOString()
      })
      .eq('id', resultId);

    if (updateError) {
      throw new Error(`Failed to update result: ${updateError.message}`);
    }

    console.log('DISC score calculated successfully for result:', resultId);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        score: finalScore 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error calculating DISC score:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});