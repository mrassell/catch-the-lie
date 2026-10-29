import { useState } from "react";
import { CASES } from "./cases.js";

export default function App() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [wrongs, setWrongs] = useState([]); // statements already ruled out in this question
  const [solved, setSolved] = useState(null); // null while playing, true/false once the question is over
  const [showSources, setShowSources] = useState(false);
  const [caught, setCaught] = useState(0);
  const [finished, setFinished] = useState(false);

  const c = CASES[index];
  const lie = c.lines.find((l) => l.lie);
  const over = solved !== null;
  const retrying = wrongs.length === 1 && !over;
  const last = index === CASES.length - 1;

  function check() {
    if (c.lines[picked].lie) {
      setSolved(true);
      setCaught((n) => n + 1);
    } else {
      setWrongs([...wrongs, picked]);
      if (wrongs.length === 1) setSolved(false);
      setPicked(null);
    }
  }

  function next() {
    if (last) {
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setPicked(null);
    setWrongs([]);
    setSolved(null);
    setShowSources(false);
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setWrongs([]);
    setSolved(null);
    setShowSources(false);
    setCaught(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="wrap">
        <h1>Catch the Lie</h1>
        <div className="feedback good">
          <h2>{caught === CASES.length ? "You caught every lie!" : "All done!"}</h2>
          <p className="truth">You caught {caught} of {CASES.length} lies.</p>
          <button className="primary" onClick={restart}>Play again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <h1>Catch the Lie</h1>

      <ul className="choices">
        {c.lines.map((l, i) => {
          const ruledOut = wrongs.includes(i);
          let state = "";
          if (over && l.lie) state = " lie";
          else if (ruledOut) state = " wrong";
          else if (i === picked) state = " picked";
          return (
            <li key={i}>
              <button
                className={"choice" + state}
                disabled={over || ruledOut}
                onClick={() => setPicked(i)}
              >
                {i === picked && !over && <span className="tag">Is this the lie?</span>}
                {ruledOut && <span className="tag">{over ? "You picked" : "Not this one"}</span>}
                {over && l.lie && (
                  <span className="tag">
                    This was the lie!
                    {solved && " · You picked"}
                  </span>
                )}
                {i === picked && !over ? `"${l.t}"` : l.t}
              </button>
            </li>
          );
        })}
      </ul>

      {showSources ? (
        <div className="sources">
          <button className="close" aria-label="Close sources" onClick={() => setShowSources(false)}>×</button>
          <p>{c.source}</p>
          <p className="cite">
            Sources:{" "}
            {c.cite.map((s, i) => (
              <span key={s.url}>
                {i > 0 && " · "}
                <a href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
              </span>
            ))}
          </p>
        </div>
      ) : (
        <button className="link" onClick={() => setShowSources(true)}>Look at more sources</button>
      )}

      {over ? (
        <div className={"feedback " + (solved ? "good" : "bad")}>
          <h2>{solved ? "You caught it!" : "Not quite"}</h2>
          <p className="truth">{lie.truth}</p>
          <p>{lie.why}</p>
          <button className="primary" onClick={next}>{last ? "Finish" : "Continue"}</button>
        </div>
      ) : (
        <>
          {retrying && <div className="retry">Not quite. You have one more try!</div>}
          <button className="primary" disabled={picked === null} onClick={check}>Check</button>
        </>
      )}
    </div>
  );
}
