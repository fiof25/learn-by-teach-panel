# Backend Setup Guide

This guide will walk you through setting up the backend for your Learning by Teaching application.

## Why Use a Backend?

✅ **Security**: Your API key is stored on the server, not exposed in the browser  
✅ **No Manual Entry**: No need to enter your API key every time  
✅ **Better Control**: Rate limiting, logging, and monitoring in one place  
✅ **Cost Management**: Track API usage on the server side  

---

## Step-by-Step Setup

### 1. Install Node.js

If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/) (LTS version recommended)

Verify installation:
```bash
node --version
npm --version
```

### 2. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### 3. Create Your `.env` File

Create a file named `.env` in the project root:

```bash
touch .env
```

Open `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
```

**Get your API key here**: https://makersuite.google.com/app/apikey

⚠️ **IMPORTANT**: Never commit the `.env` file to Git! It's already in `.gitignore`.

### 4. Start the Server

Run the server:

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

You should see:
```
🚀 Server running at http://localhost:3000
📝 API Key configured: ✅
```

### 5. Open Your Browser

Navigate to:
```
http://localhost:3000
```

That's it! You no longer need to enter your API key. Just start chatting with your students! 🎉

---

## Troubleshooting

### "API Key not configured" Error

Make sure:
1. Your `.env` file exists in the project root
2. It contains `GEMINI_API_KEY=your_key_here` (no spaces around `=`)
3. You've restarted the server after creating `.env`

### Port Already in Use

If port 3000 is busy, change it in `.env`:
```env
PORT=3001
```

### CORS Errors

The server is configured to allow all origins. If you still get CORS errors, check your browser console for details.

### Can't Install Dependencies

Make sure you have Node.js v16 or higher:
```bash
node --version
```

---

## Project Structure

```
agent-test/
├── server.js           # Backend server (NEW!)
├── package.json        # Node.js dependencies (NEW!)
├── .env               # API key storage (NEW! - Never commit!)
├── .gitignore         # Prevents .env from being committed (NEW!)
├── index.html         # Main app (UPDATED - no API key input)
├── student-panel.html # Single panel view (UPDATED)
├── images/            # Character images
└── characters/        # Character documentation
```

---

## What Changed?

### Before (Client-Side Only)
- API key stored in browser localStorage
- Direct calls to Gemini API from browser
- API key visible in network requests
- Need to enter key every time on new devices

### After (With Backend)
- API key stored securely on server
- Frontend calls your backend
- Backend calls Gemini API
- No API key entry needed - just start chatting!

---

## Security Notes

✅ **DO**:
- Keep `.env` file secure and private
- Add `.env` to `.gitignore` (already done)
- Use environment variables in production
- Rotate your API key if exposed

❌ **DON'T**:
- Commit `.env` to Git
- Share your API key publicly
- Hard-code API keys in source files
- Deploy without securing your API key

---

## Deployment (Optional)

To deploy your app with the backend, you can use:

### Render / Railway / Heroku
1. Connect your Git repository
2. Set `GEMINI_API_KEY` as an environment variable in the dashboard
3. Deploy!

### Vercel / Netlify (Serverless Functions)
You'll need to convert `server.js` to serverless functions. Let me know if you need help with this!

---

## Need Help?

- Check server logs in terminal for errors
- Visit the health check: http://localhost:3000/api/health
- Make sure all dependencies are installed
- Verify Node.js version is 16+

Happy Teaching! 🎓
