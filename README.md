# Learning by Teaching - 5-Panel Student Comparison

An interactive web application where you teach 5 AI students with distinct personalities and learning styles.

## The Students

- **Jamie the Beaver** - The Tangent Machine (attention management)
- **Thomas the Goose** - The Rigor Police (intellectual precision)
- **Sam the Sloth** - The Shortcut Seeker (deep understanding)
- **Alex the Crocodile** - The Aggressive Debater (handling skepticism)
- **Avery the Penguin** - The Confused One (clarity & patience)

## Quick Start

### Option 1: With Backend (Recommended - Secure & Convenient)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file and add your API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   Get your API key: [Google AI Studio](https://makersuite.google.com/app/apikey)

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser to `http://localhost:3000`

**See [SETUP.md](SETUP.md) for detailed setup instructions!**

### Option 2: Static HTML (Legacy)

Open `index.html` directly, but you'll need to modify it to accept API keys again.

## Features

- 🔒 **Secure Backend**: API key stored safely on server
- 🤖 **5 Unique AI Students**: Parallel responses with distinct personalities
- 💬 **Real-time Interaction**: Instant feedback from all students
- 🎨 **Beautiful UI**: Character illustrations and modern design
- 💰 **Cost-effective**: Uses Google's Gemini API
- ⚡ **Fast**: Parallel API calls for quick responses

## Try These Prompts

- "Explain photosynthesis to me"
- "How do I solve quadratic equations?"
- "What is machine learning?"

Watch how differently each student responds!

## Project Structure

```
agent-test/
├── server.js               # Express backend server
├── package.json            # Node.js dependencies
├── .env                    # API key (create this - not in repo!)
├── .gitignore             # Prevents API key from being committed
├── index.html             # Main application
├── student-panel.html     # Single panel view
├── images/                # Character illustrations
├── characters/            # Detailed character documentation
└── SETUP.md              # Detailed setup guide
```

## Educational Philosophy

**"The best way to learn is to teach."**

By teaching these AI students, you develop:
- Communication skills
- Patience and adaptability  
- Critical thinking
- Emotional intelligence

---

Made for educators, students, and anyone improving their teaching skills.
