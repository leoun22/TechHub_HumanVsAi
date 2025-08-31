import { useState } from "react";
import bg from "./assets/bg.png";
import human1 from "./assets/human.png";
import Ai1 from "./assets/ai1.png";
import human2 from "./assets/human2.png";
import human3 from "./assets/human3.png";
import Ai2 from "./assets/ai2.png";
import Ai3 from "./assets/ai3.png";
import Start from "./components/start";
import Results, { type Answer, type Round } from "./components/Results";

const ROUNDS: Round[] = [
  { src: Ai1, answer: "Ai" },
  { src: human1, answer: "Human" },
  { src: human2, answer: "Human" },
  { src: Ai2, answer: "Ai" },
  { src: human3, answer: "Human" },
  { src: Ai3, answer: "Ai" },
];

const ADVANCE_DELAY = 1000; // 1s

export default function App() {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [choice, setChoice] = useState<Answer | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [choices, setChoices] = useState<(Answer | null)[]>(
    Array(ROUNDS.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [playerNumber, setPlayerNumber] = useState(1); // track player #

  const onStart = () => {
    setStarted(true);
    setIdx(0);
    setChoice(null);
    setFeedback(null);
    setChoices(Array(ROUNDS.length).fill(null));
    setShowResults(false);
  };

  // Send final result to Google Sheets
  const saveGameResult = (
    playerNum: number,
    finalResult: string,
    errorRate: number
  ) => {
    const data = { playerNumber: playerNum, result: finalResult, errorRate };
    console.log("Sending data:", data);

    fetch(
      "https://script.google.com/macros/s/AKfycbwh_yT1RmaWwmn7eQNdHDoUj1n2o008_6FXo4SFH-ZwhPeluvnppKJzf8pHrSScMmhiHA/exec",
      {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    )
      .then(() => console.log("Success"))
      .catch((error) => console.error("Error:", error));
  };

  const choose = (c: Answer) => {
    setChoice(c);

    // store answer for this round
    setChoices((prev) => {
      const next = [...prev];
      next[idx] = c;
      return next;
    });

    if (idx === ROUNDS.length - 1) {
      // compute final score + send to sheet
      const updatedChoices = [...choices];
      updatedChoices[idx] = c;
      const correct = updatedChoices.filter(
        (ans, i) => ans === ROUNDS[i].answer
      ).length;
      const errorRate = (ROUNDS.length - correct) / ROUNDS.length;
      const finalResult = correct >= 4 ? "Win" : "Lose";

      saveGameResult(playerNumber, finalResult, errorRate);
      setPlayerNumber((n) => n + 1);

      setTimeout(() => setShowResults(true), 500);
    } else {
      setTimeout(() => {
        setIdx((i) => i + 1);
        setChoice(null);
        setFeedback(null);
      }, ADVANCE_DELAY);
    }
  };

  if (showResults) {
    return (
      <Results
        rounds={ROUNDS}
        choices={choices}
        onBackToStart={() => {
          // go back to Start page
          setShowResults(false);
          setStarted(false);
          // reset round state (optional, you’ll reset again onStart)
          setIdx(0);
          setChoice(null);
          setFeedback(null);
          setChoices(Array(ROUNDS.length).fill(null));
        }}
        bg={bg}
      />
    );
  }

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
