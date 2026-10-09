// Shared by the browser and the server: the instructions the model gets and how we read its answer.

export const SYSTEM = `You write a classroom game for 6th graders called "Catch the Lie".
An overconfident AI witness explains the teacher's lesson. Each question shows 3 short statements about the lesson.
Exactly ONE statement is false. The other two are true and come straight from the lesson.
The false one should be a realistic AI-style mistake: a wrong date or number, a mixed-up cause, an overgeneralization, a made-up "fact", or missing context. It must be clearly wrong based on the lesson, not a trick.
Rules:
- Every statement is one sentence, under 20 words, at a 6th grade reading level.
- "truth" restates the correct fact plainly so it is the last thing students read. Never repeat the false claim in it.
- "why" is one short sentence on how we know, pointing to the lesson.
- "source" is a short, honest pointer to where in the lesson this is covered.
- Only use facts that appear in the lesson text. Do not invent facts.
- Write exactly 3 questions that cover different parts of the lesson. Vary the position of the false statement.
- "lie" is the index (0, 1 or 2) of the false statement.
Return ONLY JSON in this shape, no markdown:
{"title":"short lesson title","questions":[{"lines":["statement","statement","statement"],"lie":0,"truth":"...","why":"...","source":"..."}]}`;

export function cleanLesson(text, max = 24000) {
  return String(text || "").replace(/\s+/g, " ").trim().slice(0, max);
}

export function userMessage(lesson, grade = "6th grade") {
  return `Audience: ${grade} students.\n\nLESSON TEXT:\n${lesson}`;
}

export function parseCase(text) {
  const s = text.indexOf("{"), e = text.lastIndexOf("}");
  if (s < 0 || e < 0) throw new Error("The model didn't return questions. Try again.");
  const j = JSON.parse(text.slice(s, e + 1));
  const qs = (j.questions || [])
    .filter((q) => Array.isArray(q.lines) && q.lines.length >= 3 && Number.isInteger(Number(q.lie)) && Number(q.lie) >= 0 && Number(q.lie) < q.lines.length && q.truth)
    .slice(0, 3)
    .map((q) => ({ lines: q.lines.slice(0, 4).map(String), lie: Number(q.lie), truth: String(q.truth), why: String(q.why || ""), source: String(q.source || "") }));
  if (!qs.length) throw new Error("The model's questions came back broken. Try again.");
  return { title: String(j.title || "Your lesson"), questions: qs };
}
