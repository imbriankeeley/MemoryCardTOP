export default function Card({ name, image, onMouseUp }) {
  return (
    <button onMouseUp={() => onMouseUp(name)} className="card">
      <img src={image} />
      <h2>{name}</h2>
    </button>
  );
}
