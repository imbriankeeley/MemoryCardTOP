export default function YouWin({ onClick }) {
  return (
    <div className="winScreen">
      <h1>Congrats You Won!</h1>
      <button
        className="playAgainBtn"
        onClick={() => {
          onClick();
        }}
      >
        Play Again?
      </button>
    </div>
  );
}
