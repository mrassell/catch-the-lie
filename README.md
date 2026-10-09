# Catch the Lie

A classroom game for 6th graders. An AI "witness" explains the lesson in 3 statements. One is a lie. Students find it, then see the corrected fact (truth sandwich).

Built for T-566 Learning Design for All (HGSE).

## Teacher portal

Teachers upload slides (.pptx or .pdf) or paste lesson text, pick a free AI, and get 3 questions. They review them, remove any bad ones, then start the game. Slide text is extracted in the browser.

No API key is needed. Three free options:

- **In this browser** runs Qwen2.5 3B locally with WebLLM. First run downloads about 2 GB, then it is cached. Needs Chrome or Edge with WebGPU. Lesson text never leaves the computer.
- **Ollama** uses a model running on the teacher's computer. One-time setup: install Ollama, `ollama pull llama3.2`, quit the Ollama app, then run `OLLAMA_ORIGINS="https://catch-the-lie.vercel.app" ollama serve`.
- **Free cloud** calls `/api/generate`, which uses Pollinations' free anonymous API. If `OPENROUTER_API_KEY` is set in Vercel it tries free OpenRouter models (DeepSeek, Kimi) first.

## Run locally

```bash
npm install
npx vercel dev   # runs the app and /api/generate together
```

## Files

- `App.jsx` home, teacher portal and game
- `ai.js` the three AI options
- `prompt.js` the instructions the AI gets, shared by browser and server
- `api/generate.js` serverless function for the free cloud option
- `extract.js` pulls text out of .pptx and .pdf files
- `cases.js` the Ancient Egypt demo case
