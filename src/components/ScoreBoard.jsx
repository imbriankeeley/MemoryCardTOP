export default function ScoreBoard({ score, bestScore }) {
  return (
    <div className="board">
      <p>Score: {score}</p>
      <p>Best: {bestScore}</p>
    </div>
  );
}
