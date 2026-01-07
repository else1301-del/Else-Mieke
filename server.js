
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// The API key is obtained exclusively from the environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

app.post('/api/generate', async (req, res) => {
  try {
    const { model, contents, config } = req.body;
    const response = await ai.models.generateContent({
      model,
      contents,
      config
    });
    res.json({ text: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Dalton Secure Proxy running on port ${PORT}`);
});
