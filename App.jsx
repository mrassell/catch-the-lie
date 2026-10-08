import { useState } from "react";
import { CASES } from "./cases.js";

const GREETING = "I'm Professor Pixel. I sound sure, but am I right?";
const QUESTIONS = [
  { key: "source", label: "Where's your source?" },
  { key: "reason", label: "Why do you think that?" },
  { key: "check", label: "Check another source" }
];

function Ring({ missed }) {
  return (
    <svg className={"ring" + (missed ? " missed" : "")} viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
      <path vectorEffect="non-scaling-stroke" d="M30,10 C130,0 330,2 390,45 S300,100 170,96 S6,82 10,46 S80,6 150,8" />
    </svg>
  );
}

function Bot() {
  return (
    <svg className="bot" viewBox="0 0 180 180" aria-hidden="true">
      <rect x="84" y="6" width="12" height="22" rx="4" fill="#5a6380" />
      <circle cx="90" cy="8" r="8" fill="#f2c94c" />
      <rect x="26" y="26" width="128" height="120" rx="30" fill="#c9d4ef" />
      <rect x="38" y="40" width="104" height="92" rx="22" fill="#1b2440" />
      <circle cx="68" cy="80" r="14" fill="#fff" />
      <circle cx="112" cy="80" r="14" fill="#fff" />
      <circle cx="70" cy="82" r="6" fill="#1b2440" />
      <circle cx="114" cy="82" r="6" fill="#1b2440" />
      <rect x="72" y="112" width="36" height="8" rx="4" fill="#c8323f" />
      <rect x="50" y="146" width="80" height="30" rx="10" fill="#5a6380" />
    </svg>
  );
}

export default function App() {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState(0);
  const [total, setTotal] = useState(0);
  const [circled, setCircled] = useState(new Set());
  const [asked, setAsked] = useState([]);
  const [bubble, setBubble] = useState({ text: GREETING, src: false });
  const [result, setResult] = useState(null); // { got, lies, oops, pts }
  const [finished, setFinished] = useState(false);

  const c = CASES[idx];
  const lieCount = c.lines.filter((l) => l.lie).length;
  const done = result !== null;
  const asksLeft = 2 - asked.length;

  function toggle(i) {
    if (done) return;
    const next = new Set(circled);
    next.has(i) ? next.delete(i) : next.add(i);
    setCircled(next);
  }

  function ask(key) {
    if (done || asksLeft <= 0 || asked.includes(key)) return;
    setAsked([...asked, key]);
    setBubble({ text: c.answers[key], src: key === "check" });
  }

  function check() {
    let got = 0, oops = 0;
    c.lines.forEach((l, i) => {
      if (l.lie && circled.has(i)) got++;
      if (!l.lie && circled.has(i)) oops++;
    });
    const pts = got * 100 - oops * 50;
    setScore((s) => Math.max(0, s + pts));
    setCaught((n) => n + got);
    setTotal((n) => n + lieCount);
    setResult({ got, lies: lieCount, oops, pts });
  }

  function next() {
    if (idx + 1 >= CASES.length) return setFinished(true);
    setIdx(idx + 1);
    setCircled(new Set());
    setAsked([]);
    setBubble({ text: GREETING, src: false });
    setResult(null);
  }

  function restart() {
    setIdx(0); setScore(0); setCaught(0); setTotal(0);
    setCircled(new Set()); setAsked([]); setBubble({ text: GREETING, src: false });
    setResult(null); setFinished(false);
  }

  return (
    <div className="wrap">
      <header>
        <h1 className="brand">Catch the Lie</h1>
        <div className="stats">
          <div className="pill">Case {idx + 1} / {CASES.length}</div>
          <div className="pill">Score {score}</div>
        </div>
      </header>

      {finished ? (
        <section className="end">
          <h2>Case closed!</h2>
          <p>You caught <b>{caught} of {total}</b> lies. Score: <b>{score}</b>.</p>
          <p>Professor Pixel always sounded sure. Sounding sure is not the same as being right.</p>
          <button className="btn dark" onClick={restart}>Play again</button>
        </section>
      ) : (
        <>
          <main className="game">
            <aside className="witness">
              <Bot />
              <div className={"bubble" + (bubble.src ? " src" : "")}>{bubble.text}</div>
              <div className="asks">
                <p>{asksLeft === 2 ? "Ask 2 questions" : asksLeft === 1 ? "1 question left" : "No questions left"}</p>
                {QUESTIONS.map((q) => (
                  <button key={q.key} className="ask" disabled={done || asksLeft <= 0 || asked.includes(q.key)} onClick={() => ask(q.key)}>
                    {q.label}
                  </button>
                ))}
              </div>
            </aside>

            <section className="pad" aria-live="polite">
              <div className="pad-head">
                <h2>{c.title}</h2>
                <div className="goal">{lieCount === 1 ? "Find 1 lie" : `Find ${lieCount} lies`}</div>
              </div>
              <ol className={"lines" + (done ? " done" : "")}>
                {c.lines.map((l, i) => {
                  const isCircled = circled.has(i);
                  const isLie = done && l.lie;
                  const isOops = done && !l.lie && isCircled;
                  return (
                    <li
                      key={i}
                      className={"line" + (isLie ? " lie" : "") + (isOops ? " oops" : "")}
                      tabIndex={0}
                      role="button"
                      aria-pressed={isCircled}
                      onClick={() => toggle(i)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(i); } }}
                    >
                      <span className="num">{isLie ? "✗" : isOops ? "✓" : i + 1}</span>
                      <span className="txt">
                        {l.t}
                        {isCircled && <Ring />}
                        {isLie && !isCircled && <Ring missed />}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <div className="bar">
                <p>
                  {done
                    ? `You caught ${result.got} of ${result.lies}. ${result.pts >= 0 ? "+" : ""}${result.pts} points.`
                    : lieCount === 1 ? "Tap the lie to circle it." : "Tap the lies to circle them."}
                </p>
                {done ? (
                  <button className="btn dark" onClick={next}>{idx + 1 < CASES.length ? "Next case" : "Finish"}</button>
                ) : (
                  <button className="btn" disabled={circled.size === 0} onClick={check}>Check</button>
                )}
              </div>
            </section>
          </main>

          {done && (
            <section className="why">
              {c.lines.filter((l) => l.lie).map((l, i) => (
                <div key={i}><b>Why it's a lie:</b> {l.lie}</div>
              ))}
              {result.oops > 0 && <div>Lines with ✓ were true, so circling them cost 50 points each.</div>}
            </section>
          )}
        </>
      )}
    </div>
  );
}
