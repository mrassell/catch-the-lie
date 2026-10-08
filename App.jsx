import { useState } from "react";
import { CASES } from "./cases.js";

export default function App() {
  const c = CASES[0];
  const [picked, setPicked] = useState(null);
  const [showSources, setShowSources] = useState(false);
  const [checked, setChecked] = useState(false);

  const lie = c.lines.find((l) => l.lie);
  const correct = checked && c.lines[picked]?.lie;

  function restart() {
    setPicked(null);
    setShowSources(false);
    setChecked(false);
  }

  return (
    <div className="wrap">
      <h1>Catch the Lie</h1>

      <ul className="choices">
        {c.lines.map((l, i) => {
          let state = "";
          if (checked && l.lie) state = " lie";
          else if (checked && i === picked) state = " wrong";
          else if (i === picked) state = " picked";
          return (
            <li key={i}>
              <button className={"choice" + state} disabled={checked} onClick={() => setPicked(i)}>
                {i === picked && !checked && <span className="tag">Is this the lie?</span>}
                {checked && (l.lie || i === picked) && (
                  <span className="tag">
                    {l.lie && "This was the lie!"}
                    {l.lie && i === picked && " · "}
                    {i === picked && "You picked"}
                  </span>
                )}
                {i === picked && !checked ? `"${l.t}"` : l.t}
              </button>
            </li>
          );
        })}
      </ul>

      {showSources ? (
        <div className="sources">
          <p>{c.answers.check}</p>
          <p className="cite">
            Sources:{" "}
            {c.answers.cite.map((s, i) => (
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

      {!checked ? (
        <button className="primary" disabled={picked === null} onClick={() => setChecked(true)}>Check</button>
      ) : (
        <div className={"feedback " + (correct ? "good" : "bad")}>
          <h2>{correct ? "You caught it!" : "Not quite"}</h2>
          <p className="truth">{lie.truth}</p>
          <p>{lie.lie}</p>
          <button className="primary" onClick={restart}>Try again</button>
        </div>
      )}
    </div>
  );
}
