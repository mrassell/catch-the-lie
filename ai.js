// Asks the server (/api/generate) to write a case from the lesson text.
export async function generate(text) {
  const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
  const data = await r.json().catch(() => ({ error: `Server error (${r.status})` }));
  if (!r.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}
