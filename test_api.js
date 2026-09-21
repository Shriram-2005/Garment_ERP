import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: 'You are a helpful assistant.',
    });

    const chat = model.startChat({
      history: [],
    });

    const result = await chat.sendMessage('hello');
    const response = await result.response;
    console.log("Success:", response.text());
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
