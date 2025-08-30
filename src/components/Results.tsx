import "./Results.css";
export type Answer = "Human" | "Ai";

export type Round = {
  src: string;
  answer: Answer; 
};

type ResultsProps = {
  rounds: Round[];
  choices: (Answer | null)[];
  onRestart: () => void;
  bg: string; 
};

export default function Results({ rounds, choices, onRestart, bg }: ResultsProps) {
  const score = rounds.reduce((s, r, i) => s + (choices[i] === r.answer ? 1 : 0), 0);

  
  const WIN_THRESHOLD = 4;
  const status = score >= WIN_THRESHOLD ? "WIN" : "LOSE";

  return (
    <div className="results-screen">
    
      <img className="bg" src={bg} alt="" />

      <div className="results">
        <div className="results-header">
          <h1 className="results-title">🎯 Game Results</h1>

          <div className="results-row">
            <div className={`status ${status === "WIN" ? "win" : "lose"}`}>
              {status}
            </div>
            
            <div className="score">
              <b>{score}</b><span>/</span><span>{rounds.length}</span>
            </div>
            
            <button className="btn primary" onClick={onRestart}>
              🎮 Play Again
            </button>
          </div>
        </div>

        <div className="results-grid">
          {rounds.map((r, i) => {
            const user = choices[i];
            const ok = user === r.answer;
            return (
              <div key={i} className={`card ${ok ? "ok" : "ng"}`}>
                <div className="thumb">
                  <img src={r.src} alt={`Round ${i + 1}`} />
                  <div className={`badge ${ok ? "ok" : "ng"}`}>
                    {ok ? "✓ Correct" : "✗ Wrong"}
                  </div>
                </div>

                <div className="info">
                  <div className="row">
                    <span className="k">Your answer</span>
                    <span className={`v ${ok ? "ok" : "ng"}`}>
                      {user ?? "No Answer"}
                    </span>
                  </div>
                  <div className="row">
                    <span className="k">Correct answer</span>
                    <span className="v">{r.answer}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
