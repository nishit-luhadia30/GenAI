// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { assessmentData } = await req.json()

    // Here you would integrate with your preferred AI service
    // For now, we'll return mock data similar to the frontend
    const mockRecommendations = [
      {
        id: 1,
        title: "Full Stack Developer",
        match: 88,
        description: "Build end-to-end web applications using modern frameworks and Supabase backend.",
        skills: ["JavaScript", "React", "Node.js", "Supabase", "PostgreSQL"],
        salaryRange: "₹6-18 LPA",
        growth: "High",
        companies: ["TCS", "Infosys", "Wipro", "Accenture", "Flipkart"],
        timeToEntry: "6-12 months",
        reasoning: "Strong match based on your technical interests and current skill set.",
        careerPath: "Junior Developer → Senior Developer → Tech Lead → Engineering Manager",
        responsibilities: [
          "Develop responsive web applications",
          "Design APIs with Supabase",
          "Collaborate with cross-functional teams",
          "Write clean, maintainable code"
        ],
        industryOutlook: "Excellent growth prospects in India's tech sector",
        jobOpenings: "High"
      }
      // Add more recommendations based on assessmentData
    ]

    return new Response(
      JSON.stringify({ recommendations: mockRecommendations }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})