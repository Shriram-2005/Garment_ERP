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
      .select('role, company_id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Security check
    if (!profile.role.toUpperCase().includes('ADMIN') && !profile.role.toUpperCase().includes('QUALITY')) {
      return NextResponse.json({ error: 'Permission Denied: Requires Admin or Quality role' }, { status: 403 });
    }

    // 1. Fetch recent quality control logs
    const { data: qcLogs } = await supabase
      .from('quality_control')
      .select('jobId, passQty, failQty, defectReason')
      .eq('company_id', profile.company_id)
      .limit(50); // Fetch the last 50 entries to find patterns

    if (!qcLogs || qcLogs.length === 0) {
      return NextResponse.json({ message: "No quality control data available to analyze." });
    }

    // 2. Ask Gemini to analyze
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.5-flash',
      systemInstruction: `
        You are a Senior Quality Assurance Engineer.
        Analyze the provided Quality Control (QC) logs and identify any recurring defects, anomalies, or points of failure.
        Return a raw JSON object (no markdown formatting or code blocks) with the following structure:
        {
          "summary": "A 1-2 sentence high-level summary of the analysis.",
          "totalAnalyzed": 50,
          "defectTrends": [
            { "defectName": "Stitching Error", "frequency": 12, "severity": "High" }
          ],
          "actionableRecommendations": [
            "Inspect thread tension on main stitching lines",
            "Retrain operators on seam allowances"
          ]
        }
      `
    });

    const prompt = `QC Logs: ${JSON.stringify(qcLogs)}`;
    const result = await model.generateContent(prompt);
    
    let aiResponse = result.response.text().trim();
    if (aiResponse.startsWith('```json')) aiResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();

    const analysis = JSON.parse(aiResponse);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('AI QC Analysis Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
