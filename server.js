const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Character name to file mapping
const CHARACTER_FILES = {
    'jamie': 'JAMIE_BEAVER.md',
    'thomas': 'THOMAS_GOOSE.md',
    'sam': 'SAM_SLOTH.md',
    'alex': 'ALEX_CROCODILE.md',
    'avery': 'AVERY_PENGUIN.md'
};

// Cache for system instructions (load once)
let systemInstructionBase = null;

// Load system instruction base
async function getSystemInstructionBase() {
    if (!systemInstructionBase) {
        const systemPath = path.join(__dirname, 'characters', 'SYSTEM_INSTRUCTION.md');
        systemInstructionBase = await fs.readFile(systemPath, 'utf-8');
    }
    return systemInstructionBase;
}

// Load character profile
async function getCharacterProfile(character) {
    const filename = CHARACTER_FILES[character];
    if (!filename) {
        throw new Error(`Unknown character: ${character}`);
    }
    const characterPath = path.join(__dirname, 'characters', filename);
    return await fs.readFile(characterPath, 'utf-8');
}

// Combine system instruction and character profile
async function getSystemPrompt(character) {
    const baseInstruction = await getSystemInstructionBase();
    const characterProfile = await getCharacterProfile(character);
    
    return `${baseInstruction}

---

# YOUR CHARACTER PROFILE

${characterProfile}

---

CRITICAL INSTRUCTIONS:
- Keep responses BRIEF: 2-3 sentences maximum
- Stay completely in character based on your trait scores
- Never break character or explain teaching strategies
- Respond authentically as this specific student would respond`;
}

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
        const { character, message } = req.body;

        // Validate request
        if (!character || !message) {
            return res.status(400).json({ 
                error: 'Missing required fields: character or message' 
            });
        }

        // Check if API key is set
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ 
                error: 'Server configuration error: API key not set' 
            });
        }

        // Load system prompt from markdown files
        const systemPrompt = await getSystemPrompt(character);

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

// Get character stats/traits
app.get('/api/character-stats/:character', async (req, res) => {
    try {
        const character = req.params.character;
        const characterProfile = await getCharacterProfile(character);
        
        // Parse the trait table from markdown
        const traitRegex = /\|\s*\*\*(.+?)\*\*\s*\|\s*(\d+)\s*\|\s*(.+?)\s*\|/g;
        const traits = [];
        let match;
        
        while ((match = traitRegex.exec(characterProfile)) !== null) {
            traits.push({
                name: match[1].trim(),
                score: parseInt(match[2]),
                description: match[3].trim()
            });
        }
        
        res.json({
            character,
            traits
        });
    } catch (error) {
        console.error('Error fetching character stats:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to fetch character stats' 
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
