import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Supabase Admin Client for Cron (bypasses RLS if needed, or operates as service role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET(req) {
  try {
    // 1. Fetch all companies to run the check per company
    const { data: companies, error: compErr } = await supabaseAdmin.from('companies').select('*');
    if (compErr) throw compErr;

    const results = [];

    for (const company of companies) {
      // 2. Fetch inventory items that are running low
      const { data: inventory } = await supabaseAdmin
        .from('inventory_items')
        .select('*')
        .eq('company_id', company.id);

      const lowStockItems = inventory?.filter(item => item.quantity <= (item.min_threshold || 100)) || [];
      
      // 3. Fetch active Sales Orders to predict upcoming demand
      const { data: activeOrders } = await supabaseAdmin
        .from('sales_orders')
        .select('*')
        .eq('company_id', company.id)
        .in('status', ['Pending', 'In Progress']);

      if (lowStockItems.length === 0 && (!activeOrders || activeOrders.length === 0)) {
        continue; // Nothing to do for this company
      }

      // 4. Ask Gemini to analyze and draft a Purchase Order (PO) if needed
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-3.5-flash',
        systemInstruction: `
          You are a Supply Chain Predictive AI for the company "${company.name}".
          Your job is to analyze low stock inventory items and upcoming active sales orders.
          If there is a predicted deficit, draft a short, professional Purchase Order (PO) recommendation for the procurement team.
          If there is no immediate danger, respond with "NO_ACTION_NEEDED".
          Return only the text of the notification/PO draft, or "NO_ACTION_NEEDED".
        `
      });

      const prompt = `
        Low Stock Items: ${JSON.stringify(lowStockItems)}
        Active Sales Orders: ${JSON.stringify(activeOrders)}
        
        Analyze this and provide a Purchase Order draft if materials are needed to fulfill these orders.
      `;

      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text().trim();

      if (aiResponse && !aiResponse.includes("NO_ACTION_NEEDED")) {
        // 5. Create a notification for the company's procurement/admin team
        // Assuming a generic notifications table exists, or we log it for now
        results.push({
          company: company.name,
          alert: aiResponse
        });

        console.log(`[Inventory Cron] Alert generated for ${company.name}`);
      }
    }

    return NextResponse.json({ success: true, alerts: results });
  } catch (error) {
    console.error('Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
