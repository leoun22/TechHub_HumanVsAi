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

export default function App() {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [choice, setChoice] = useState<Answer | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [choices, setChoices] = useState<(Answer | null)[]>(Array(ROUNDS.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [playerNumber, setPlayerNumber] = useState(1);

  const onStart = () => {
    setStarted(true);
    setIdx(0);
    setChoice(null);
    setFeedback(null);
    setChoices(Array(ROUNDS.length).fill(null));
    setShowResults(false);
  };

  // دالة لحفظ النتيجة وإرسالها إلى الشيت
  const saveGameResult = (playerNum: number, finalResult: string, errorRate: number) => {
    const data = { 
      playerNumber: playerNum, 
      result: finalResult, 
      errorRate: errorRate
    };
    console.log("Sending data:", data);

    fetch('https://script.google.com/macros/s/AKfycbwh_yT1RmaWwmn7eQNdHDoUj1n2o008_6FXo4SFH-ZwhPeluvnppKJzf8pHrSScMmhiHA/exec', { 
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
  };

  const choose = (c: Answer) => {
    setChoice(c);
    
    const updatedChoices = [...choices];
    updatedChoices[idx] = c;
    setChoices(updatedChoices);

    // إذا كانت آخر جولة، اعرض النتائج
    if (idx === ROUNDS.length - 1) {
      setTimeout(() => setShowResults(true), 500);


      const correctAnswers = updatedChoices.filter((choice, i) => choice === ROUNDS[i].answer).length;
      const errorRate = (ROUNDS.length - correctAnswers) / ROUNDS.length;
      const finalResult = correctAnswers >= 4 ? "Win" : "Lose";

      // إرسال النتيجة ونسبة الخطأ
      saveGameResult(playerNumber, finalResult, errorRate);
      setPlayerNumber(prev => prev + 1);
    }
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

  if (showResults) {
    return (
      <Results
        rounds={ROUNDS}
        choices={choices}
        onRestart={onStart}
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