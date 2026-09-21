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
    if (!profile.role.toUpperCase().includes('ADMIN') && !profile.role.toUpperCase().includes('MASTER')) {
      return NextResponse.json({ error: 'Permission Denied: Requires Admin or Master role' }, { status: 403 });
    }

    const { description } = await req.json();

    // 1. Fetch available inventory items (Fabric, Accessories, etc.)
    const { data: inventory } = await supabase
      .from('inventory_items')
      .select('name, category, price_per_unit, unit')
      .eq('company_id', profile.company_id);

    // 2. Ask Gemini to generate the BOM
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.5-flash',
      systemInstruction: `
        You are a Master Garment Technician and Technical Designer.
        Given a natural language description of a garment, you must generate a complete Bill of Materials (BOM).
        Use the provided current inventory to map materials to available items when possible.
        Calculate standard consumption quantities based on industry norms (e.g. adult t-shirt = ~1.2m fabric).
        Return ONLY a raw JSON object (without markdown blocks) with the following structure:
        {
          "styleName": "Suggested name based on description",
          "category": "e.g., T-Shirt, Trousers",
          "materials": [
            { "itemName": "Fabric Name", "quantity": 1.2, "unit": "meters", "estimatedCost": 15.00 },
            { "itemName": "Label", "quantity": 1, "unit": "pcs", "estimatedCost": 0.50 }
          ],
          "totalEstimatedCost": 15.50
        }
      `
    });

    const prompt = `Garment Description: "${description}"\n\nAvailable Inventory (use these if relevant): ${JSON.stringify(inventory || [])}`;
    const result = await model.generateContent(prompt);
    
    let aiResponse = result.response.text().trim();
    if (aiResponse.startsWith('```json')) aiResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();

    const bom = JSON.parse(aiResponse);

    return NextResponse.json({ bom });
  } catch (error) {
    console.error('AI BOM Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
