const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/student-panel', (req, res) => {
    res.sendFile(path.join(__dirname, 'student-panel.html'));
});

// Proxy endpoint for Gemini API
app.post('/api/generate', async (req, res) => {
    try {
        const { character, message, systemPrompt } = req.body;

        // Validate request
        if (!character || !message || !systemPrompt) {
            return res.status(400).json({ 
                error: 'Missing required fields: character, message, or systemPrompt' 
            });
        }

        // Check if API key is set
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ 
                error: 'Server configuration error: API key not set' 
            });
        }

        // Make request to Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }],
                    systemInstruction: {
                        parts: [{
                            text: systemPrompt
                        }]
                    },
                    generationConfig: {
                        maxOutputTokens: 100,
                        temperature: 0.9
                    }
                })
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }

        const data = await response.json();
        const responseText = data.candidates[0].content.parts[0].text;

        res.json({ 
            character, 
            response: responseText 
        });

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to generate response' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        apiKeyConfigured: !!process.env.GEMINI_API_KEY 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📝 API Key configured: ${process.env.GEMINI_API_KEY ? '✅' : '❌'}`);
    if (!process.env.GEMINI_API_KEY) {
        console.log('⚠️  Please set GEMINI_API_KEY in your .env file');
    }
});
