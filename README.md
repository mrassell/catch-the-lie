# Catch the Lie

A classroom game for 6th graders. An AI "witness" explains the lesson in 3 statements. One is a lie. Students find it, then see the corrected fact (truth sandwich).

Built for T-566 Learning Design for All (HGSE).

## Teacher portal

Teachers upload slides (.pptx or .pdf) or paste lesson text. A free model on OpenRouter writes 3 questions from the lesson. The teacher reviews them, removes any bad ones, then starts the game. Slide text is extracted in the browser and only the text is sent to the model.

### Setup (one time)

1. Get a free key at https://openrouter.ai/keys
2. In Vercel: Project > Settings > Environment Variables, add `OPENROUTER_API_KEY`
3. Redeploy

The server picks a free DeepSeek or Kimi model first, then falls back to other free models. To force one, set `OPENROUTER_MODEL` (for example a `:free` model id).

## Run locally

```bash
npm install
npx vercel dev   # runs the app and /api/generate together
```

## Files

- `App.jsx` home, teacher portal and game
- `api/generate.js` serverless function that calls the model
- `extract.js` pulls text out of .pptx and .pdf files
- `cases.js` the Ancient Egypt demo case
