const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

let GoogleGenerativeAI;
try {
  GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
} catch (e) {
  console.error('!!! CRITICAL: @google/generative-ai module not found.');
  console.error('Please run: npm install @google/generative-ai');
}

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Gemini
let model = null;
if (GoogleGenerativeAI && process.env.GEMINI_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

console.log('========================================');
console.log('   🌌 ASTRONOMY HUB GEMINI SERVICE');
console.log('   [ENGINE: GOOGLE GEMINI ACTIVE]');
console.log('========================================');

// Route: Chat (Gemini)
app.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!model) {
        throw new Error('Gemini model not initialized. Check your API key and dependencies.');
    }

    const chat = model.startChat({
      history: history || [
        { role: "user", parts: [{ text: "You are the Astronomy Hub AI assistant. You are an expert in space, astronomy, and astrophysics. Be helpful, engaging, and professional." }] },
        { role: "model", parts: [{ text: "I understand. I am your expert guide to the universe. How can I assist you explorer?" }] }
      ]
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();
    
    console.log('>>> [GEMINI SERVICE] Generated Chat Response');
    res.json({ reply });
  } catch (err) {
    console.error('Gemini Service Error (Chat):', err.message);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Route: Refine Search (Gemini)
app.post('/refine-search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!model) {
        throw new Error('Gemini model not initialized.');
    }

    const prompt = `Convert this natural language space search into NASA Image API parameters: "${query}".
    Focus on extracting keywords and timeframes.
    Return ONLY a JSON object: { "q": "...", "year_start": "...", "year_end": "...", "media_type": "..." }`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const refinedParams = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    
    console.log('>>> [GEMINI SERVICE] Refined Search:', refinedParams.q);
    res.json(refinedParams);
  } catch (err) {
    console.error('Gemini Service Error (Refine):', err.message);
    res.status(500).json({ error: 'Failed to refine search' });
  }
});

const PORT = 8002;
app.listen(PORT, () => {
  console.log(`Gemini AI Service running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
});

app.get('/health', (req, res) => res.json({ status: 'ok', engine: 'gemini' }));
