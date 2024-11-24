import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function ScoreBoard({ score, bestScore }) {
  const [scoreRef] = useAutoAnimate({
    duration: 50,
    easing: "ease",
    disrespectUserMotionPreference: false,
  });
  const [bestScoreRef] = useAutoAnimate({
    duration: 50,
    easing: "ease",
    disrespectUserMotionPreference: false,
  });
  return (
    <div className="board">
      <p ref={scoreRef} style={{ whiteSpace: "nowrap" }}>
        Score: <span key={score}>{score}</span>
      </p>
      <p ref={bestScoreRef} style={{ whiteSpace: "nowrap" }}>
        Best: <span key={bestScore}>{bestScore}</span>
      </p>
    </div>
  );
}
