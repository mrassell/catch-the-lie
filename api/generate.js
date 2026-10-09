// Vercel serverless function: turns a teacher's slide text into 3 "catch the lie" questions.
// Uses a free model on OpenRouter. Set OPENROUTER_API_KEY in Vercel (Settings > Environment Variables).
// Optional: OPENROUTER_MODEL to force a specific model id.

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

const SYSTEM = `You write a classroom game for 6th graders called "Catch the Lie".
An overconfident AI witness explains the teacher's lesson. Each question shows 3 short statements about the lesson.
Exactly ONE statement is false. The other two are true and come straight from the lesson.
The false one should be a realistic AI-style mistake: a wrong date or number, a mixed-up cause, an overgeneralization, a made-up "fact", or missing context. It must be clearly wrong based on the lesson, not a trick.
Rules:
- Every statement is one sentence, under 20 words, at a 6th grade reading level.
- "truth" restates the correct fact plainly so it is the last thing students read. Never repeat the false claim in it.
- "why" is one short sentence on how we know, pointing to the lesson.
- "source" is a short, honest pointer to where in the lesson this is covered.
- Only use facts that appear in the lesson text. Do not invent facts.
- The 3 questions should cover different parts of the lesson. Vary the position of the false statement.
Return ONLY JSON in this shape, no markdown:
{"title":"short lesson title","questions":[{"lines":["statement","statement","statement"],"lie":0,"truth":"...","why":"...","source":"..."}]}`;

function parse(text) {
  const s = text.indexOf("{"), e = text.lastIndexOf("}");
  if (s < 0 || e < 0) throw new Error("no JSON");
  const j = JSON.parse(text.slice(s, e + 1));
  const qs = (j.questions || [])
    .filter((q) => Array.isArray(q.lines) && q.lines.length >= 3 && Number.isInteger(q.lie) && q.lie >= 0 && q.lie < q.lines.length && q.truth)
    .slice(0, 3)
    .map((q) => ({ lines: q.lines.slice(0, 4).map(String), lie: q.lie, truth: String(q.truth), why: String(q.why || ""), source: String(q.source || "") }));
  if (qs.length < 1) throw new Error("no usable questions");
  return { title: String(j.title || "Your lesson"), questions: qs };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return res.status(500).json({ error: "The server is missing OPENROUTER_API_KEY. Add it in Vercel project settings and redeploy." });

  const { text = "", grade = "6th grade" } = req.body || {};
  const lesson = String(text).replace(/\s+/g, " ").trim().slice(0, 24000);
  if (lesson.length < 80) return res.status(400).json({ error: "Not enough lesson text. Upload slides with text or paste a few paragraphs." });

  const models = await pickFreeModels(key);
  let lastErr = "No free model answered.";
  for (const model of models) {
    try {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Title": "Catch the Lie" },
        body: JSON.stringify({
          model,
          temperature: 0.6,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: `Audience: ${grade} students.\n\nLESSON TEXT:\n${lesson}` }
          ]
        })
      });
      const data = await r.json();
      if (!r.ok) { lastErr = data?.error?.message || `HTTP ${r.status}`; continue; }
      const out = parse(data.choices?.[0]?.message?.content || "");
      return res.status(200).json({ ...out, model });
    } catch (e) {
      lastErr = e.message;
    }
  }
  return res.status(502).json({ error: `Couldn't generate questions: ${lastErr}` });
}
