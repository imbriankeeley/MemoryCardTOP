export default function Level({ level }) {
  if (level === 1) {
    return (
      <h1 style={{ whiteSpace: "nowrap" }} className="level">
        Level 1 - Easy
      </h1>
    );
  }
  if (level === 2) {
    return (
      <h1 style={{ whiteSpace: "nowrap" }} className="level">
        Level 2 - Intermediate
      </h1>
    );
  }
  if (level === 3) {
    return (
      <h1 style={{ whiteSpace: "nowrap" }} className="level">
        Level 3 - Hard
      </h1>
    );
  }
}
