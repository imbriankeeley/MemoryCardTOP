import { useState, useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import shuffleArray from "./utils/helpers/shuffleArray.js";
import shuffleCards from "./utils/helpers/shuffleCards.js";
import "./App.css";
import Title from "./components/Title.jsx";
import ScoreBoard from "./components/ScoreBoard.jsx";
import Card from "./components/Card";
import YouWin from "./components/YouWin.jsx";

function App() {
  const [newGame, setNewGame] = useState(0);
  const [animeCharacters, setAnimeCharacters] = useState([]);
  const [cardBack, setCardBack] = useState("");
  const [selectedCards, setSelectedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [won, setWon] = useState(false);

  const parent = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    parent.current &&
      autoAnimate(parent.current, {
        duration: 500,
        easing: "ease",
        disrespectUserMotionPreference: false,
      });
  }, [parent, newGame]);

  useEffect(() => {
    const getCardBack = async () => {
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/23755`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const animeData = await response.json();
        const cardBackImg = animeData.data.images.jpg.large_image_url;
        setCardBack(cardBackImg);
      } catch (error) {
        console.error("Error fetching card back image:", error);
      }
    };
    const getAnimeCharacters = async () => {
      try {
        const response = await fetch(
          `https://api.jikan.moe/v4/anime/23755/characters`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allCharactersArray = [];
        const characters = await response.json();
        characters.data.map((character) => {
          const currCharacter = {
            id: character.character.mal_id,
            name: character.character.name,
            image: character.character.images.jpg.image_url,
          };
          if (
            character.character.name !== "Hawk" &&
            character.character.name !== "Narrator" &&
            character.character.name !== "Goddess Clan Member" &&
            character.character.name !== "Liones, Bartra"
          ) {
            allCharactersArray.push(currCharacter);
          }
        });
        shuffleArray(allCharactersArray);
        setAnimeCharacters(allCharactersArray.slice(0, 8));
      } catch (error) {
        console.error("Error fetching anime characters:", error);
      }
    };

    getCardBack();
    getAnimeCharacters();
  }, [newGame]);

  const playAgain = () => {
    setScore(0);
    setBestScore(0);
    setSelectedCards([]);
    setIsFlipped(false);
    shuffleCards(animeCharacters, setAnimeCharacters);
    setWon(false);
    setNewGame((prev) => prev + 1);
  };

  const selectCard = (name) => {
    if (!selectedCards.includes(name)) {
      const newScore = score + 1;
      setScore(newScore);
      setSelectedCards((prevCards) => [...prevCards, name]);

      if (newScore > bestScore) {
        setBestScore(newScore);
      }

      if (newScore === 8) {
        setWon(true);
        return;
      }

      setIsFlipped(false);

      shuffleCards(animeCharacters, setAnimeCharacters);
    } else {
      setIsFlipped(false);
      setScore(0);
      setSelectedCards([]);
      setNewGame((prev) => prev + 1);
    }
  };

  if (won) {
    return <YouWin cardBack={cardBack} onClick={playAgain} />;
  }

  return (
    <>
      <div className="head">
        <div className="top">
          <Title />
          <ScoreBoard score={score} bestScore={bestScore} />
        </div>
      </div>
      <div ref={parent} className="card-section">
        {animeCharacters.map((character) => (
          <Card
            key={character.id}
            name={character.name}
            back={cardBack}
            front={character.image}
            onMouseUp={selectCard}
            newGame={newGame}
            score={score}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
          />
        ))}
      </div>
    </>
  );
}

export default App;
