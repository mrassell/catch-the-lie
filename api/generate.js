import { SYSTEM, cleanLesson, userMessage, parseCase } from "../prompt.js";

// Vercel serverless function: turns a teacher's slide text into 3 "catch the lie" questions.
// No key needed: uses Pollinations' free anonymous API.
// Optional: set OPENROUTER_API_KEY in Vercel to use free OpenRouter models (DeepSeek, Kimi) first.

const PREFERRED = [/deepseek/i, /kimi|moonshot/i, /qwen/i, /llama/i, /glm/i];

async function pickFreeModels(key) {
  if (process.env.OPENROUTER_MODEL) return [process.env.OPENROUTER_MODEL];
  try {
    const r = await fetch("https://openrouter.ai/api/v1/models", { headers: { Authorization: `Bearer ${key}` } });
    const { data } = await r.json();
    const free = data.filter(
      (m) =>
        (m.id.endsWith(":free") || (m.pricing?.prompt === "0" && m.pricing?.completion === "0")) &&
        (m.architecture?.output_modalities || ["text"]).includes("text") &&
        (m.context_length || 0) >= 16000
    );
    const ranked = [];
    for (const re of PREFERRED) for (const m of free) if (re.test(m.id) && !ranked.includes(m.id)) ranked.push(m.id);
    for (const m of free) if (!ranked.includes(m.id)) ranked.push(m.id);
    return ranked.slice(0, 4);
  } catch {
    return ["openrouter/free"];
  }
}

async function viaOpenRouter(key, messages) {
  const models = await pickFreeModels(key);
  let lastErr = "no free model answered";
  for (const model of models) {
    try {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Title": "Catch the Lie" },
        body: JSON.stringify({ model, temperature: 0.6, messages })
      });
      const data = await r.json();
      if (!r.ok) { lastErr = data?.error?.message || `HTTP ${r.status}`; continue; }
      return { ...parseCase(data.choices?.[0]?.message?.content || ""), model };
    } catch (e) { lastErr = e.message; }
  }
  throw new Error(lastErr);
}

async function viaPollinations(messages) {
  const r = await fetch("https://text.pollinations.ai/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "openai", messages })
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error || `HTTP ${r.status}`);
  return { ...parseCase(data.choices?.[0]?.message?.content || ""), model: "Pollinations (free)" };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  const lesson = cleanLesson(req.body?.text);
  if (lesson.length < 80) return res.status(400).json({ error: "Not enough lesson text. Upload slides with text or paste a few paragraphs." });
  const messages = [{ role: "system", content: SYSTEM }, { role: "user", content: userMessage(lesson) }];

  const errors = [];
  const key = process.env.OPENROUTER_API_KEY;
  if (key) {
    try { return res.status(200).json(await viaOpenRouter(key, messages)); } catch (e) { errors.push(`OpenRouter: ${e.message}`); }
  }
  for (let i = 0; i < 2; i++) {
    try { return res.status(200).json(await viaPollinations(messages)); } catch (e) { if (i) errors.push(`Pollinations: ${e.message}`); }
  }
  return res.status(502).json({ error: `The free cloud AI is busy right now. Try "In this browser" or "Ollama" instead. (${errors.join("; ")})` });
}
