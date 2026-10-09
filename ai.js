// Three free ways to generate a case. None need an API key.
import { SYSTEM, cleanLesson, userMessage, parseCase } from "./prompt.js";

export const ENGINES = [
  { id: "browser", name: "In this browser", note: "Free and private. First run downloads the AI (about 2 GB), then it's cached. Works best in Chrome or Edge." },
  { id: "ollama", name: "Ollama", note: "Free and private. Uses Ollama running on this computer." },
  { id: "cloud", name: "Free cloud", note: "Nothing to install. Sends lesson text to a free public AI, which is sometimes busy." }
];

export const BROWSER_MODEL = "Qwen2.5-3B-Instruct-q4f16_1-MLC";
export const OLLAMA_DEFAULT = "llama3.2";

function messages(text) {
  return [{ role: "system", content: SYSTEM }, { role: "user", content: userMessage(cleanLesson(text, 12000)) }];
}

async function cloud(text) {
  const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
  const data = await r.json().catch(() => ({ error: `Server error (${r.status})` }));
  if (!r.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

async function ollama(text, { model = OLLAMA_DEFAULT } = {}) {
  let r;
  try {
    r = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages: messages(text), stream: false, format: "json", options: { temperature: 0.6 } })
    });
  } catch {
    throw new Error(`Couldn't reach Ollama. Make sure it's running and allows this site (see "First-time Ollama setup" above).`);
  }
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error?.includes("not found") ? `Ollama doesn't have "${model}" yet. Run: ollama pull ${model}` : data.error || `Ollama error ${r.status}`);
  return { ...parseCase(data.message?.content || ""), model: `Ollama · ${model}` };
}

let enginePromise = null;
async function browser(text, { onProgress } = {}) {
  if (!("gpu" in navigator)) throw new Error("This browser can't run AI locally (no WebGPU). Try Chrome or Edge, or pick another option.");
  if (!enginePromise) {
    enginePromise = import("@mlc-ai/web-llm").then(({ CreateMLCEngine }) =>
      CreateMLCEngine(BROWSER_MODEL, { initProgressCallback: (p) => onProgress?.(p.text, p.progress) })
    );
    enginePromise.catch(() => { enginePromise = null; });
  }
  const engine = await enginePromise;
  onProgress?.("Writing questions…", 1);
  const out = await engine.chat.completions.create({ messages: messages(text), temperature: 0.6, response_format: { type: "json_object" } });
  return { ...parseCase(out.choices?.[0]?.message?.content || ""), model: "In-browser · Qwen2.5 3B" };
}

export function generate(engine, text, opts) {
  if (engine === "ollama") return ollama(text, opts);
  if (engine === "browser") return browser(text, opts);
  return cloud(text);
}
