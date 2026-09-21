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

    // Fetch user profile to get role and company_id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, company_id, company_name')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { message, history } = await req.json();

    // Construct Context-Aware System Prompt
    const systemPrompt = `
      You are Garment AI, an intelligent assistant built directly into an advanced Garment/Textile ERP system.
      You are talking to a user who belongs to the company "${profile.company_name}".
      Their role/access level is: ${profile.role}.

      CRITICAL SECURITY RULES (RBAC):
      1. You must ONLY provide information and take actions that fall within the user's allowed role modules: ${profile.role}.
      2. If the user asks for data from a module they do NOT have access to, you MUST politely refuse and state that they do not have the required permissions.
      3. Do NOT invent or hallucinate data.

      You are capable of viewing inventory, creating orders, and tracking production.
      (Note: Specific tools for these actions are currently being integrated. For now, acknowledge their request and state that you are actively being connected to the database tools.)
    `;

    // Convert history format to Gemini format
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const tools = [
      {
        functionDeclarations: [
          {
            name: "create_sales_order",
            description: "Creates a new sales order in the system. Use this when the user asks to create a new order.",
            parameters: {
              type: "OBJECT",
              properties: {
                clientName: { type: "STRING", description: "Name of the client placing the order" },
                productType: { type: "STRING", description: "Type of product (e.g. t-shirt, jacket)" },
                quantity: { type: "INTEGER", description: "Number of items ordered" },
                deliveryDate: { type: "STRING", description: "Expected delivery date (YYYY-MM-DD)" }
              },
              required: ["clientName", "productType", "quantity"]
            }
          },
          {
            name: "predict_inventory_and_draft_po",
            description: "Analyzes inventory, predicts shortages, drafts purchase orders, and sends a notification to the user.",
            parameters: {
              type: "OBJECT",
              properties: {
                materialType: { type: "STRING", description: "Type of material (e.g. cotton, thread, buttons). Optional, if empty analyzes all." }
              }
            }
          }
        ]
      }
    ];

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
      tools: tools
    });

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    let response = await result.response;
    
    // Handle function calls
    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      
      let functionResult = {};

      // Security Check: Does the user have access to run this tool?
      if (call.name === 'create_sales_order') {
        if (!profile.role.includes('sales') && !profile.role.includes('SUPER_ADMIN')) {
          functionResult = { error: "Permission Denied: User does not have access to the sales module." };
        } else {
          // Implement create order logic here
          // For now, we simulate success
          const { clientName, productType, quantity, deliveryDate } = call.args;
          functionResult = { 
            success: true, 
            message: `Order for ${quantity} ${productType}(s) for ${clientName} created successfully.`,
            orderId: "ORD-" + Math.floor(Math.random() * 10000)
          };
        }
      } else if (call.name === 'predict_inventory_and_draft_po') {
        if (!profile.role.includes('inventory') && !profile.role.includes('SUPER_ADMIN')) {
          functionResult = { error: "Permission Denied: User does not have access to the inventory module." };
        } else {
          const { materialType } = call.args;
          // Simulate drafting PO and creating notification
          
          // Create notification in DB
          await supabase.from('notifications').insert({
            user_id: user.id,
            company_id: profile.company_id,
            title: "Purchase Order Drafted",
            message: `AI predicted a shortage of ${materialType || 'materials'} and drafted a Purchase Order.`,
            type: "PO_DRAFT",
            read: false
          });

          functionResult = { 
            success: true, 
            message: `Drafted PO for ${materialType || 'materials'} and sent notification to user.`,
            poId: "PO-" + Math.floor(Math.random() * 10000)
          };
        }
      }

      // Send the function result back to the model
      const functionResponseResult = await chat.sendMessage([{
        functionResponse: {
          name: call.name,
          response: functionResult
        }
      }]);
      response = await functionResponseResult.response;
    }

    const text = response.text();

    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
