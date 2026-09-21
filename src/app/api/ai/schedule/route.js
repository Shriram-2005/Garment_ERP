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
    if (!profile.role.toUpperCase().includes('ADMIN') && !profile.role.toUpperCase().includes('PLANNING')) {
      return NextResponse.json({ error: 'Permission Denied: Requires Admin or Planning role' }, { status: 403 });
    }

    // 1. Fetch pending orders
    const { data: pendingOrders } = await supabase
      .from('sales_orders')
      .select('id, client_name, product_type, qty, delivery_date')
      .eq('company_id', profile.company_id)
      .eq('status', 'Pending');

    if (!pendingOrders || pendingOrders.length === 0) {
      return NextResponse.json({ message: "No pending orders to schedule." });
    }

    // 2. Ask Gemini to schedule them
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.5-flash',
      systemInstruction: `
        You are an industrial engineer AI optimizing production schedules.
        Given a list of pending sales orders, return a JSON array where each object has:
        - "orderId": the original order id
        - "suggestedStartDate": (YYYY-MM-DD format, starting from tomorrow)
        - "assignedMachine": a string (e.g. "Line A", "Line B", etc.)
        - "rationale": a 1-sentence reason for this scheduling choice.
        Do NOT wrap the output in markdown code blocks, just return raw JSON.
      `
    });

    const prompt = `Pending Orders: ${JSON.stringify(pendingOrders)}\nToday is: ${new Date().toISOString().split('T')[0]}`;
    const result = await model.generateContent(prompt);
    
    let aiResponse = result.response.text().trim();
    // Clean up potential markdown formatting from Gemini
    if (aiResponse.startsWith('```json')) aiResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();

    const schedule = JSON.parse(aiResponse);

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error('AI Schedule Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
