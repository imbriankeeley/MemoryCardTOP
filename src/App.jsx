import { useState, useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import shuffleArray from "./utils/helpers/shuffleArray.js";
import shuffleCards from "./utils/helpers/shuffleCards.js";
import "./App.css";
import Title from "./components/Title.jsx";
import ScoreBoard from "./components/ScoreBoard.jsx";
import Card from "./components/Card";
import YouWin from "./components/YouWin.jsx";
import Level from "./components/Level";

function App() {
  const [newGame, setNewGame] = useState(0);
  const [animeCharacters, setAnimeCharacters] = useState([]);
  const [cardBack, setCardBack] = useState("");
  const [selectedCards, setSelectedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [won, setWon] = useState(false);
  const [level, setLevel] = useState(1);

  const [isFlipped, setIsFlipped] = useState(false);

  const [mainRef] = useAutoAnimate({
    duration: 500,
    easing: "ease-in-out",
    disrespectUserMotionPreference: false,
  });
  const [headRef] = useAutoAnimate({
    duration: 100,
    easing: "ease",
    disrespectUserMotionPreference: false,
  });

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
            // No images for these characters
            character.character.name !== "Narrator" &&
            character.character.name !== "Goddess Clan Member"
          ) {
            allCharactersArray.push(currCharacter);
          }
        });
        shuffleArray(allCharactersArray);
        if (level === 1) {
          setAnimeCharacters(allCharactersArray.slice(0, 3));
        }
        if (level === 2) {
          setAnimeCharacters(allCharactersArray.slice(0, 8));
        }
        if (level === 3) {
          setAnimeCharacters(allCharactersArray.slice(0, 12));
        }
      } catch (error) {
        console.error("Error fetching anime characters:", error);
      }
    };

    getCardBack();
    getAnimeCharacters();
  }, [newGame]);

  const playAgain = () => {
    if (level === 3) {
      setLevel(1);
    }
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

      if (newScore === 3 && level === 1) {
        setLevel(2);
        playAgain();
        return;
      }
      if (newScore === 8 && level === 2) {
        setLevel(3);
        playAgain();
        return;
      }

      if (newScore === 12 && level === 3) {
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
        <div ref={headRef} className="top">
          <Title />
          <Level key={`level-${level}`} level={level} />
          <ScoreBoard score={score} bestScore={bestScore} />
        </div>
      </div>
      <div ref={mainRef} className="card-section">
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
