// Pull plain text out of a teacher's upload, all in the browser.
import JSZip from "jszip";

async function fromPptx(file) {
  const zip = await JSZip.loadAsync(file);
  const slides = Object.keys(zip.files)
    .filter((n) => /^ppt\/(slides\/slide|notesSlides\/notesSlide)\d+\.xml$/.test(n))
    .sort((a, b) => parseInt(a.match(/\d+/g).pop()) - parseInt(b.match(/\d+/g).pop()));
  const parts = [];
  for (const n of slides) {
    const xml = await zip.files[n].async("string");
    const text = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => m[1]).join(" ");
    const num = n.match(/(\d+)\.xml$/)[1];
    const label = n.includes("notes") ? `[Slide ${num} notes]` : `[Slide ${num}]`;
    if (text.trim()) parts.push(`${label} ${text}`);
  }
  return parts.join("\n");
}

async function fromPdf(file) {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const parts = [];
  for (let p = 1; p <= Math.min(doc.numPages, 60); p++) {
    const page = await doc.getPage(p);
    const c = await page.getTextContent();
    const t = c.items.map((i) => i.str).join(" ");
    if (t.trim()) parts.push(`[Slide ${p}] ${t}`);
  }
  return parts.join("\n");
}

export async function extractText(file) {
  const name = file.name.toLowerCase();
  let text = "";
  if (name.endsWith(".pptx")) text = await fromPptx(file);
  else if (name.endsWith(".pdf")) text = await fromPdf(file);
  else if (/\.(txt|md)$/.test(name)) text = await file.text();
  else throw new Error("Use a .pptx, .pdf or .txt file. For Google Slides, use File > Download > PowerPoint.");
  text = text
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/[ \t]+/g, " ").trim();
  if (text.length < 80) throw new Error("Couldn't find much text in that file. If the slides are mostly images, paste the key points instead.");
  return text;
}
