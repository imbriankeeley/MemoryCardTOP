import shuffleArray from "./shuffleArray";

export default function shuffleCards(array, setState) {
  const shuffle = array;
  shuffleArray(shuffle);
  setState(shuffle);
}
