import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, company_id, company_name')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { dashboardData } = await req.json();

    const isSuperAdmin = profile.role.toUpperCase().includes('SUPER_ADMIN');
    const companyContext = isSuperAdmin 
      ? `You are providing insights to a SUPER_ADMIN with global access across all companies.`
      : `You are providing insights for the company "${profile.company_name}".`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.5-flash',
      systemInstruction: `
        You are an Executive AI Analyst for an advanced Garment/Textile ERP system.
        ${companyContext}
        Your task is to analyze the provided raw dashboard data (sales, inventory, production) and write a short, professional, 2-3 sentence executive summary of the company's health.
        Highlight key metrics, identify any clear bottlenecks or low stock warnings, and provide a single actionable recommendation.
        Keep it concise, formatting with minimal markdown (bolding key numbers).
      `
    });

    const prompt = `Raw Dashboard Data: ${JSON.stringify(dashboardData)}`;
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text().trim();

    return NextResponse.json({ insights: aiResponse });

  } catch (error) {
    console.error('AI Insights API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
