import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY — copy .env.example to .env and add your key.');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET — add any long random string to your .env.');
  process.exit(1);
}

await connectDB();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT =
  'You are Inspi.Ai, a warm, encouraging companion. Keep replies concise (2-4 sentences unless asked for more), gentle, and genuinely helpful.';

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction: SYSTEM_PROMPT });

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '5mb' })); 

app.use('/api/auth', authRoutes);


app.post('/api/chat/gemini', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    
    const firstUserIndex = history.findIndex((m) => m.role === 'user');
    const trimmedHistory = firstUserIndex === -1 ? [] : history.slice(firstUserIndex);

    const geminiHistory = trimmedHistory.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const chat = model.startChat({ history: geminiHistory });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error('Gemini call failed:', err);
    res.status(500).json({ error: 'Something went wrong talking to Gemini.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Inspi.Ai backend running on http://localhost:${PORT}`);
});