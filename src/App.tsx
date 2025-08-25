import bg from "./assets/bg.png";
import Start from "./components/start";

export default function App() {
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
      <div
        style={{
          display: "grid",
          gap: "24px",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <h1 className="title">Human VS Ai game</h1>
        <Start onClick={() => console.log("▶️ Start clicked")} />
      </div>
    </div>
  );
}
