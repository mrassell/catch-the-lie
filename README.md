# Catch the Lie

A classroom game for 6th graders. An AI "witness" explains the lesson in 3 statements. One is a lie. Students find it, then see the corrected fact (truth sandwich).

Built for T-566 Learning Design for All (HGSE).

## Teacher portal

Teachers upload slides (.pptx or .pdf) or paste lesson text, pick a free AI, and get 3 questions. They review them, remove any bad ones, then start the game. Slide text is extracted in the browser.

It uses free OpenRouter models (DeepSeek and Kimi first, then other free ones).

### Setup (one time)

1. Get a key at https://openrouter.ai/keys
2. In Vercel: Project > Settings > Environment Variables, add `OPENROUTER_API_KEY` as a Secret
3. Redeploy

Never put the key in the code. This repo is public.

## Run locally

```bash
npm install
npx vercel dev   # runs the app and /api/generate together
```

## Files

- `App.jsx` home, teacher portal and game
- `ai.js` calls the server
- `prompt.js` the instructions the AI gets, shared by browser and server
- `api/generate.js` serverless function that calls OpenRouter
- `extract.js` pulls text out of .pptx and .pdf files
- `cases.js` the Ancient Egypt demo case
