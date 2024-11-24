import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import "./App.css";
import Title from "./components/Title.jsx";
import ScoreBoard from "./components/ScoreBoard.jsx";
import Card from "./components/Card";
import YouWin from "./components/YouWin.jsx";

function shuffleArray(array) {
  for (var i = array.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function App() {
  const [newGame, setNewGame] = useState(0);
  const [animeCharacters, setAnimeCharacters] = useState([]);
  const [cardBack, setCardBack] = useState("");
  const [selectedCards, setSelectedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [won, setWon] = useState(false);

  const [positions, setPositions] = useState({});

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
    shuffleCards();
    setWon(false);
    setNewGame((prev) => prev + 1);
  };

  const shuffleCards = () => {
    const shuffle = animeCharacters;
    shuffleArray(shuffle);

    const newPositions = {};
    shuffle.forEach((char, index) => {
      newPositions[char.id] = index;
    });

    setAnimeCharacters(shuffle);
    setPositions(newPositions);
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

      shuffleCards();
    } else {
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
      <AnimatePresence>
        <div className="card-section">
          {animeCharacters.map((character) => (
            <Card
              key={character.id}
              id={character.id}
              name={character.name}
              image={character.image}
              onMouseUp={selectCard}
              position={positions[character.id] || 0}
            />
          ))}
        </div>
      </AnimatePresence>
    </>
  );
}

export default App;
