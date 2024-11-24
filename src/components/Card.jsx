import { useState, useEffect } from "react";
import ReactCardFlip from "react-card-flip";

export default function Card({
  name,
  back,
  front,
  onMouseUp,
  newGame,
  score,
  isFlipped,
  setIsFlipped,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(true);
    }, 700);

    return () => clearTimeout(timer);
  }, [isFlipped, newGame, score]);

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      <button className="card" onMouseUp={() => onMouseUp(name)}>
        <img src={back} />
      </button>

      <button className="card" onMouseUp={() => onMouseUp(name)}>
        <img src={front} />
        <h2>{name}</h2>
      </button>
    </ReactCardFlip>
  );
}
