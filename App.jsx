import { useEffect, useRef, useState } from "react";
import { CASES } from "./cases.js";

const SOURCE_PROMPT = "Need more evidence? Look at another source to corroborate the claims.";

function Ring({ missed }) {
  return (
    <svg className={"ring" + (missed ? " missed" : "")} viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
      <path vectorEffect="non-scaling-stroke" d="M30,10 C130,0 330,2 390,45 S300,100 170,96 S6,82 10,46 S80,6 150,8" />
    </svg>
  );
}

export default function App() {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState(0);
  const [total, setTotal] = useState(0);
  const [circled, setCircled] = useState(new Set());
  const [sourceChecks, setSourceChecks] = useState(0);
  const [bubble, setBubble] = useState({ text: SOURCE_PROMPT, src: false });
  const [result, setResult] = useState(null); // { got, lies, oops, pts }
  const [finished, setFinished] = useState(false);

  const truthRef = useRef(null);
  useEffect(() => {
    if (result) truthRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [result]);

  const c = CASES[idx];
  const lieCount = c.lines.filter((l) => l.lie).length;
  const done = result !== null;

  function toggle(i) {
    if (done) return;
    const next = new Set(circled);
    next.has(i) ? next.delete(i) : next.add(i);
    setCircled(next);
  }

  function lookAtSources() {
    if (done) return;
    setSourceChecks((count) => count + 1);
    setBubble({ text: c.answers.check, src: true });
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
    setSourceChecks(0);
    setBubble({ text: SOURCE_PROMPT, src: false });
    setResult(null);
  }

  function restart() {
    setIdx(0); setScore(0); setCaught(0); setTotal(0);
    setCircled(new Set()); setSourceChecks(0); setBubble({ text: SOURCE_PROMPT, src: false });
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
              <h2 className="evidence-title">Source check</h2>
              <div className={"bubble" + (bubble.src ? " src" : "")}>{bubble.text}</div>
              <div className="asks">
                <p>{sourceChecks === 0 ? "Compare the claim with reliable evidence." : `Sources checked: ${sourceChecks}`}</p>
                <button className="ask" disabled={done} onClick={lookAtSources}>
                  Look at more sources
                </button>
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
                      <span className="num">{i + 1}</span>
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
                    ? `Lie detected! You caught ${result.got} of ${result.lies}. ${result.pts >= 0 ? "+" : ""}${result.pts} points.`
                    : "Circle the statement you think is the lie."}
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
            <section className="truth" ref={truthRef}>
              <h2>Lie detected! Here's the truth:</h2>
              {c.lines.filter((l) => l.lie).map((l, i) => (
                <div className="fact" key={i}>
                  <p className="statement">{l.truth}</p>
                  <p className="how"><b>How we know:</b> {l.lie}</p>
                </div>
              ))}
              {result.oops > 0 && <p className="note">You circled a true statement, so that choice cost 50 points.</p>}
            </section>
          )}
        </>
      )}
    </div>
  );
}
