import { useEffect, useRef, useState } from "react";
import { DEMO } from "./cases.js";
import { extractText } from "./extract.js";
import { generate as runAI } from "./ai.js";

/* ---------- Home ---------- */
function Home({ onTeacher, onPlay }) {
  return (
    <div className="home">
      <div className="hero card yellow">
        <span className="sticker">6th grade · AI literacy</span>
        <h1>Catch<br />the Lie</h1>
        <p>An AI witness explains the lesson. It sounds sure. One thing it says is wrong. Find it.</p>
      </div>
      <div className="split">
        <button className="card big pink" onClick={onTeacher}>
          <span className="kicker">Teacher</span>
          <strong>Make a case from my slides</strong>
          <span className="arrow">→</span>
        </button>
        <button className="card big blue" onClick={() => onPlay(DEMO)}>
          <span className="kicker">Demo</span>
          <strong>Play: Ancient Egypt</strong>
          <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}

/* ---------- Teacher portal ---------- */
function Teacher({ onBack, onReady }) {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | reading | generating | review
  const [err, setErr] = useState("");
  const [result, setResult] = useState(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);



  async function handleFile(f) {
    if (!f) return;
    setErr(""); setStatus("reading"); setFileName(f.name);
    try { setText(await extractText(f)); setStatus("idle"); }
    catch (e) { setErr(e.message); setStatus("idle"); setFileName(""); }
  }

  async function generate() {
    setErr(""); setStatus("generating");
    try {
      const data = await runAI(text);
      setResult(data); setStatus("review");
    } catch (e) { setErr(e.message); setStatus("idle"); }
  }

  function removeQ(i) {
    const qs = result.questions.filter((_, j) => j !== i);
    setResult({ ...result, questions: qs });
  }

  if (status === "review" && result) {
    return (
      <div className="stack">
        <TopBar onBack={() => setStatus("idle")} label="Back to upload" />
        <div className="card yellow">
          <span className="kicker">Review before class</span>
          <h2 className="title">{result.title}</h2>
          <p className="muted">The lie in each question is marked. Remove anything that's wrong or off-topic.</p>
        </div>
        {result.questions.map((q, i) => (
          <div className="card" key={i}>
            <div className="row">
              <span className="kicker">Question {i + 1}</span>
              <button className="chip" onClick={() => removeQ(i)}>Remove</button>
            </div>
            <ol className="review">
              {q.lines.map((l, j) => <li key={j} className={j === q.lie ? "is-lie" : ""}>{j === q.lie && <span className="badge">LIE</span>}{l}</li>)}
            </ol>
            <p className="truthline">✓ {q.truth}</p>
            <p className="tiny">{q.evidence?.length ? `Evidence board: ${q.evidence.length} quotes from your slides` : "No evidence board for this one (the AI's quotes didn't match your slides exactly)"}</p>
          </div>
        ))}
        <div className="row gap">
          <button className="btn ghost" onClick={generate}>Make new ones</button>
          <button className="btn green" disabled={!result.questions.length} onClick={() => onReady({ title: result.title, questions: result.questions })}>Approve & start game</button>
        </div>
        {result.model && <p className="tiny">Generated with {result.model}</p>}
      </div>
    );
  }

  return (
    <div className="stack">
      <TopBar onBack={onBack} label="Home" />
      <div className="card pink">
        <span className="kicker">Teacher portal</span>
        <h2 className="title">Turn your slides into a case</h2>
        <p>We'll write 3 questions. Each one has 2 true facts from your lesson and 1 AI-style mistake.</p>
      </div>

      <div
        className={"drop card" + (drag ? " over" : "")}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
      >
        <input ref={inputRef} type="file" accept=".pptx,.pdf,.txt,.md" hidden onChange={(e) => handleFile(e.target.files[0])} />
        <div className="drop-icon">⬆</div>
        <strong>{status === "reading" ? "Reading your slides…" : fileName ? fileName : "Drop slides here or click to upload"}</strong>
        <span className="muted">.pptx or .pdf · Google Slides: File › Download › PowerPoint</span>
      </div>

      <label className="card">
        <span className="kicker">Or paste lesson text</span>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder="Paste your notes or slide text here…" />
        <span className="tiny">{text.length.toLocaleString()} characters</span>
      </label>

      {err && <div className="card red-bg">{err}</div>}

      <button className="btn green" disabled={text.trim().length < 80 || status !== "idle"} onClick={generate}>
        {status === "generating" ? "Writing your case…" : "Generate 3 questions"}
      </button>
    </div>
  );
}

/* ---------- Game ---------- */
function Game({ data, onHome }) {
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState(null);
  const [checked, setChecked] = useState(false);
  const [sources, setSources] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const fbRef = useRef(null);

  const q = data.questions[qi];
  const correct = checked && picked === q.lie;

  useEffect(() => { if (checked) fbRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [checked]);

  function check() { setChecked(true); if (picked === q.lie) setScore((s) => s + 1); }
  function next() {
    if (qi + 1 >= data.questions.length) return setDone(true);
    setQi(qi + 1); setPicked(null); setChecked(false); setSources(false);
  }
  function again() { setQi(0); setPicked(null); setChecked(false); setSources(false); setScore(0); setDone(false); }

  if (done) {
    return (
      <div className="stack">
        <TopBar onBack={onHome} label="Home" />
        <div className="card yellow center">
          <span className="kicker">Case closed</span>
          <h2 className="title huge">{score} / {data.questions.length}</h2>
          <p>The AI sounded sure every time. Sounding sure isn't the same as being right.</p>
        </div>
        <div className="card green-bg">
          <span className="kicker">What's actually true</span>
          <ul className="recap">{data.questions.map((x, i) => <li key={i}>✓ {x.truth}</li>)}</ul>
        </div>
        <button className="btn" onClick={again}>Play again</button>
      </div>
    );
  }

  return (
    <div className="stack">
      <TopBar onBack={onHome} label="Home" right={<span className="pill">{qi + 1} / {data.questions.length}</span>} />
      <div className="progress"><i style={{ width: `${(qi / data.questions.length) * 100}%` }} /></div>

      <div className="witness">
        <div className="bot" aria-hidden="true">
          <svg viewBox="0 0 64 64"><rect x="8" y="12" width="48" height="40" fill="#fff" stroke="#000" strokeWidth="4" /><rect x="18" y="24" width="8" height="8" fill="#000" /><rect x="38" y="24" width="8" height="8" fill="#000" /><rect x="22" y="40" width="20" height="4" fill="#000" /><rect x="30" y="2" width="4" height="10" fill="#000" /></svg>
        </div>
        <div className="bubble">One of these is a lie. Which one?</div>
      </div>

      <ul className="choices">
        {q.lines.map((l, i) => {
          let s = "";
          if (checked && i === q.lie) s = " lie";
          else if (checked && i === picked) s = " wrong";
          else if (i === picked) s = " picked";
          return (
            <li key={i}>
              <button className={"choice" + s} disabled={checked} onClick={() => setPicked(i)}>
                <span className="letter">{"ABCD"[i]}</span>
                <span>{l}</span>
                {checked && i === q.lie && <span className="stamp">LIE</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {!checked && q.evidence?.length > 0 && (sources ? (
        <div className="card blue-bg">
          <div className="row"><span className="kicker">Evidence board</span><button className="chip" onClick={() => setSources(false)}>Close</button></div>
          <p className="tiny">Compare each statement to the evidence. Which one doesn't match?</p>
          <div className="evidence">
            {q.evidence.map((e, i) => (
              <figure key={i} className="clip">
                <blockquote>{e.from ? e.quote : `“${e.quote}”`}</blockquote>
                <figcaption>
                  {e.url ? <a href={e.url} target="_blank" rel="noreferrer">{e.from}</a> : e.from || (e.slide ? `Your slides · Slide ${e.slide}` : "Your slides")}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : (
        <button className="link" onClick={() => setSources(true)}>🔍 Check the evidence</button>
      ))}

      {!checked ? (
        <button className="btn" disabled={picked === null} onClick={check}>Check</button>
      ) : (
        <div ref={fbRef} className={"card feedback " + (correct ? "green-bg" : "red-bg")}>
          <span className="kicker">{correct ? "You caught it!" : "Not quite. Here's the truth:"}</span>
          <p className="truth">✓ {q.truth}</p>
          {q.why && <p className="muted"><b>How we know:</b> {q.why}</p>}
          <button className="btn" onClick={next}>{qi + 1 < data.questions.length ? "Next question" : "See results"}</button>
        </div>
      )}
    </div>
  );
}

function TopBar({ onBack, label, right }) {
  return (
    <div className="topbar">
      <button className="chip" onClick={onBack}>← {label}</button>
      <span className="logo">Catch the Lie</span>
      {right || <span />}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [playing, setPlaying] = useState(null);

  return (
    <div className="wrap">
      {view === "home" && <Home onTeacher={() => setView("teacher")} onPlay={(d) => { setPlaying(d); setView("game"); }} />}
      {view === "teacher" && <Teacher onBack={() => setView("home")} onReady={(c) => { setPlaying(c); setView("game"); }} />}
      {view === "game" && playing && <Game key={playing.title + view} data={playing} onHome={() => setView("home")} />}
    </div>
  );
}
