import { useState } from "react";
import bg from "./assets/bg.png";
import human1 from "./assets/human.png";
import human2 from "./assets/human2.png";
import human3 from "./assets/human3.png";
import Start from "./components/start";

type Answer = "Human" | "Ai";

const ROUNDS: { src: string; answer: Answer }[] = [
  { src: human1, answer: "Human" },
  { src: human2, answer: "Human" },
  { src: human3, answer: "Human" },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [choice, setChoice] = useState<Answer | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const onStart = () => {
    setStarted(true);
    setIdx(0);
    setChoice(null);
    setFeedback(null);
  };

  const choose = (c: Answer) => {
    setChoice(c);
    const ok = c === ROUNDS[idx].answer;
    setFeedback(
      ok ? "✅ Correct! This one is Human." : "❌ Wrong. This one is Human."
    );
  };

  const next = () => {
    const n = (idx + 1) % ROUNDS.length;
    setIdx(n);
    setChoice(null);
    setFeedback(null);
  };

  const prev = () => {
    const p = (idx - 1 + ROUNDS.length) % ROUNDS.length;
    setIdx(p);
    setChoice(null);
    setFeedback(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "grid",
        placeItems: "center",
      }}
    >
      {!started ? (
        <div
          style={{
            display: "grid",
            gap: "24px",
            textAlign: "center",
            padding: "24px",
          }}
        >
          <h1 className="title">Human VS Ai game</h1>
          <Start label="START" onClick={onStart} />
        </div>
      ) : (
        <div className="game">
          <h2 className="subtitle">Is this Human or AI generated?</h2>

          <div className="image-wrap">
            <img src={ROUNDS[idx].src} alt="mystery" className="card-img" />
            <button
              className="arrow-btn left"
              onClick={prev}
              aria-label="Previous"
            >
              ←
            </button>
            <button
              className="arrow-btn right"
              onClick={next}
              aria-label="Next"
            >
              →
            </button>
          </div>

          <div className="choices">
            <button
              className="choice-btn big"
              onClick={() => choose("Human")}
              disabled={!!choice}
            >
              Human
            </button>
            <button
              className="choice-btn big"
              onClick={() => choose("Ai")}
              disabled={!!choice}
            >
              Ai
            </button>
          </div>

          {feedback && <p className="feedback">{feedback}</p>}

          <div className="game-cta">
            <button className="small-btn" onClick={() => setStarted(false)}>
              Back to Start page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
