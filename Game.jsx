import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "./Game.css";
import Pokemon from "./Pokemon.jsx";
import HeadTails from "./HeadTails.jsx";
import { cardDeck } from './cardDeck';
import { preloadedImages, preloadedAudios } from './App.jsx';

const Game = ({ setIsPlaying, theme }) => {
 const navigate = useNavigate();
 const location = useLocation();
 const mode = location.state?.mode || "cpu"; 
 const difficulty = location.state?.difficulty || 6;
 const match = new Audio("assets/match.mp3");
 const youWin = new Audio("assets/youwin.mp3");
 const youLose = new Audio("assets/youlose.mp3");
 const mainMenu = new Audio("assets/main_menu.mp3");
 const tie = new Audio("assets/tie.mp3");
 


  const player1Mode = mode == "cpu" ? "Player" : "Player 1";
  const player2Mode = mode == "cpu" ? "CPU" : "Player 2";
  const [startFlag, setStartFlag] = useState(false); // Para mostrar cara o sello al inicio
  const [cards, setCards] = useState(cardDeck);
  const [flipped, setFlipped] = useState(Array(cards.length).fill(false));
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [found1, setFound1] = useState([]); // Cartas del jugador 1
  const [found2, setFound2] = useState([]); // Cartas del jugador 2
  const [turn, setTurn] = useState(1); // 1 o 2
  const [removed, setRemoved] = useState(Array(cards.length).fill(false)); // Para quitar del tablero
  const [cpuMemoryCards, setCpuMemoryCards] = useState([]); // Para que el CPU recuerde
  const cpuMemoryLimit = difficulty; // Número de cartas que el CPU puede recordar
  const [pokemonData, setPokemonData] = useState(null);
  const [noPickFlag, setNoPickFlag] = useState(false); // Para evitar clicks rápidos
  const [correctCpuFlag, setCorrectCpuFlag] = useState(false);
  const [pokemonDataFlag, setPokemonDataFlag] = useState(false);
  const [pickedIndex, setPickedIndex] = useState(0);
  const [pokemonAnimation, setPokemonAnimation] = useState(preloadedImages["/assets/pikapika.gif"].src);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const remainingCards = removed.filter(r => !r).length;
  const [score, setScore] = useState({ player1: 0, player2: 0 });

  const randomAnimation = () => {
    const animations = [preloadedImages["/assets/charmander.gif"].src, preloadedImages["/assets/pikapika.gif"].src, preloadedImages["/assets/squirtle.gif"].src, preloadedImages["/assets/squirtle2.gif"].src, preloadedImages["/assets/bulbasaur.gif"].src];
    setPokemonAnimation(animations[Math.floor(Math.random() * animations.length)]);
  };
  const shuffleCards = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const pickCard = (index) => {
  if (flipped[index] || removed[index] || noPickFlag || (turn === 2 && mode === "cpu")) return; // No permitir click
    setFlipped(prev => prev.map((f, i) => i === index ? true : f));
    if (firstCard === null) {
      setFirstCard(index);
      rememberCard(index, cards[index]);
    } else if (secondCard === null && index !== firstCard) {
      setSecondCard(index);
      rememberCard(index, cards[index]);
      setNoPickFlag(true); // Activar bandera para evitar clicks rapidos
      if (cards[firstCard].figure === cards[index].figure) {
        // Match!
        preloadedAudios["/assets/match.mp3"].play();
        setTimeout(() => showPokemonCard(index), 700);
        setTimeout(() => {
          if (turn === 1) {
            setFound1(prev => [...prev, [cards[firstCard], cards[index]]]);
            setScore(prev => ({ ...prev, player1: prev.player1 + 1 }));
          } else {
            setFound2(prev => [...prev, [cards[firstCard], cards[index]]]);
            setScore(prev => ({ ...prev, player2: prev.player2 + 1 }));
          }
          // Quitar del tablero
          setRemoved(prev => prev.map((r, i) => (i === firstCard || i === index) ? true : r));
          setCpuMemoryCards(prev => prev.filter(item => item.index !== firstCard && item.index !== index));
          setFirstCard(null);
          setSecondCard(null);
          randomAnimation();
          setNoPickFlag(false);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setFlipped(prev => prev.map((f, i) => (i === firstCard || i === index) ? false : f));
          setFirstCard(null);
          setSecondCard(null);
          randomAnimation();
          setTurn(t => t === 1 ? 2 : 1); // Cambia de turno
          setNoPickFlag(false);
        }, 1000);
      }
    }
  };

const findKnownPair = (memory, removed) => {
  const seen = {};
  for (const { index, card } of memory) {
    if (removed[index]) continue;
    if (!seen[card.figure]) {
      seen[card.figure] = index;
    } else {
      return [seen[card.figure], index];
    }
  }
  return null;
};

function rememberCard(index, card) {
  if (removed[index]) return; // No recordar cartas ya ganadas
  setCpuMemoryCards(prev => {
    if (prev.some(item => item.index === index)) return prev;
    const newMemory = [...prev, { index, card }];
    if (newMemory.length > cpuMemoryLimit) newMemory.shift();
    return newMemory;
  });
}

const cpuTurn = () => {
  if (mode === 'player2' || turn === 1) return;
  const availableIndexes = cards
    .map((_, i) => (!flipped[i] && !removed[i] ? i : null))
    .filter(i => i !== null);

  if (availableIndexes.length < 2) return;

  // 1. Busca un par conocido en la memoria
  const knownPair = findKnownPair(cpuMemoryCards || {}, removed);

  let firstIdx, secondIdx;
  if (knownPair) {
    [firstIdx, secondIdx] = knownPair;
  } else {
    // Si no hay par conocido, elige dos al azar
    [firstIdx, secondIdx] = shuffleCards([...availableIndexes]).slice(0, 2);
  }

  // Voltea la primera carta
  setTimeout(() => {
  setFlipped(prev => prev.map((f, i) => i === firstIdx ? true : f));
  setFirstCard(firstIdx);
  rememberCard(firstIdx, cards[firstIdx]);
  setTimeout(() => {
    // Voltea la segunda carta
    setFlipped(prev => prev.map((f, i) => i === secondIdx ? true : f));
    setSecondCard(secondIdx);
    rememberCard(secondIdx, cards[secondIdx]);
    setNoPickFlag(true);
    setTimeout(() => {
      if (cards[firstIdx].figure === cards[secondIdx].figure) {
        // Match!
        preloadedAudios["/assets/match.mp3"].play();
        setTimeout(() => {
          playPokeSound(cards[secondIdx].id);
        }, 700);
        setTimeout(() => {
          setFound2(prev => [...prev, [cards[firstIdx], cards[secondIdx]]]);
          setScore(prev => ({ ...prev, player2: prev.player2 + 1 }));
          setRemoved(prev => prev.map((r, i) => (i === firstIdx || i === secondIdx) ? true : r));
          setCpuMemoryCards(prev => prev.filter(item => item.index !== firstIdx && item.index !== secondIdx));
          setFirstCard(null);
          setSecondCard(null);
          randomAnimation();
          setNoPickFlag(false);
          setCorrectCpuFlag(prev => !prev);
        }, 1000);
      } else {
        setFlipped(prev => prev.map((f, i) => (i === firstIdx || i === secondIdx) ? false : f));
        setFirstCard(null);
        setSecondCard(null);
        randomAnimation();
        setTurn(1); // Cambia al jugador
        setNoPickFlag(false);
      }
    }, 1500); // Espera antes de resolver el match
  }, 1000); // Espera antes de voltear la segunda carta
  }, 1000); // Espera antes de voltear la primera carta
};

const showPokemonCard = (e) => {
  setPokemonDataFlag(true);
  setPickedIndex(e);
};

const playPokeSound = async (id) => {
  const query = await fetch(`https://corsproxy.io/?${encodeURIComponent("https://pokedex.mimo.dev/api/pokemon/" + id)}`);
  const data = await query.json();
  const cryUrlLegacy = data.cries.legacy;
  const cryUrlLatest = data.cries.latest;
  // Elige random: 0 para legacy, 1 para latest
  const pick = Math.random() < 0.5 ? "legacy" : "latest";
  let soundUrl = pick === "latest" ? cryUrlLatest : cryUrlLegacy;

  // Si eligió latest pero no existe, usa legacy
  if (pick === "latest" && !cryUrlLatest && cryUrlLegacy) {
    soundUrl = cryUrlLegacy;
  }
  // Si eligió legacy pero no existe, usa latest
  if (pick === "legacy" && !cryUrlLegacy && cryUrlLatest) {
    soundUrl = cryUrlLatest;
  }

  if (!soundUrl) return; // Si no hay ninguno, no hace nada
  const sound = new Audio(soundUrl);

  sound.play();
};

const checkWinner = () => {
  if (found1.length > found2.length){
    setPopupMessage(`${player1Mode} wins!`);
    setShowPopup(true);
    preloadedAudios["/assets/youwin.mp3"].play();
  } else if (found1.length < found2.length) {
    setPopupMessage(`${player2Mode} wins!`);
    setShowPopup(true);
    preloadedAudios["/assets/youlose.mp3"].play();
  } else {
    setPopupMessage("It's a tie!");
    setShowPopup(true);
    preloadedAudios["/assets/tie.mp3"].play();
  }
}

useEffect(() => {
  const shuffled = shuffleCards(cards);
  setCards(shuffled);
  match.volume = 0.5;
}, []);

useEffect(() => {
  if (turn === 2 && mode !== "player2") {
    cpuTurn();
  }
}, [turn, correctCpuFlag]);

useEffect(() => {
  if (remainingCards === 0){
    if (pokemonDataFlag) {
    setTimeout(() => {
      setIsPlaying(false);
      checkWinner();
    }, 4000);
  } else {
    setIsPlaying(false);
    checkWinner();
  }
  }
}, [remainingCards]);

useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return; // Evita conflicto con inputs
    if (e.key === "Escape") {
      setShowPopup(false);
      setPokemonDataFlag(false);
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);

useEffect(() => {
  randomAnimation();
}, [turn]);

return (
  <>
    {!startFlag && <HeadTails setTurn={setTurn} setStartFlag={setStartFlag} theme={theme} setIsPlaying={setIsPlaying} /> }
    {showPopup && (
      <div className="popup-overlay">
        <div className={`popup ${theme}`}>
          <h2 className="end-message">{popupMessage}</h2>
          <div className="popup-buttons">
          <button className={`${theme}`} onClick={() => {
            preloadedAudios["/assets/mainmenu.mp3"].play();
            setTimeout(() => {
              navigate('/');
            }, 2600);
          }}>Main Menu</button>
          <button className={`${theme}`} onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      </div>
      )}
      {pokemonDataFlag && <Pokemon name={cards[pickedIndex]?.name} url={cards[pickedIndex]?.url} onClose={() => setPokemonDataFlag(false)} theme={theme} />}
      <div className="second-player-container">
      {mode === "cpu" ? <h2 id="cpu-title">CPU</h2> : <h2 id="second-player-title">Player 2</h2>}
      <div className={`${mode}-player ${theme}`}>
        {found2.map((pair, idx) => (
          <div key={idx} className="card-pair" onClick={() => {
            const cardIndex = cards.findIndex(card => card.id === pair[0].id);
            showPokemonCard(cardIndex);
          }}>
            <img src={pair[0].src} alt={pair[0].name} className="card-img" />
            <img src={pair[1].src} alt={pair[1].name} className="card-img overlap" />
          </div>
        ))}
      </div>
      </div>
      <div className="game-area">
      <div className="turn-indicator left">
      <div className="score-container">
        <h3 className={`score-player2`}>{score.player2}</h3>
        <h3 className={`score-player1`}>{score.player1}</h3>
      </div>
        {turn === 1 ? `Turn: ${player1Mode}` : `Turn: ${player2Mode}`}
      </div>
      <div className={`game-board ${theme}`}>
        {cards.map((card, index) => (
          <div key={index} className="card-board">
            {!removed[index] ? (
              <div
                className={`card${flipped[index] ? " flipped" : ""}`} 
                onClick={() => pickCard(index)}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <img src="assets/back.PNG" alt="back" />
                  </div>
                  <div className="card-back">
                    <img src={card.src} alt={card.name} />
                  </div>
                </div>
              </div>
            ) : (
              // Deja el hueco vacío para mantener el grid
              <div className={`empty-card ${theme}`}></div>
            )}
          </div>
        ))}
      </div>
      <div className="turn-indicator right">
        <img src={pokemonAnimation} alt="pokemon!" className="pokemon-icon" />
      </div>
      </div>
      <div className="first-player-container">
      <h2 id="first-player-title">{player1Mode}</h2> 
      <div className={`first-player ${theme}`}>
        {found1.map((pair, idx) => (
          <div key={idx} className="card-pair" onClick={() => {
            const cardIndex = cards.findIndex(card => card.id === pair[0].id);
            showPokemonCard(cardIndex);
          }}>
            <img src={pair[0].src} alt={pair[0].name} className="card-img" />
            <img src={pair[1].src} alt={pair[1].name} className="card-img overlap" />
          </div>
        ))}
      </div>    
      </div> 
  </>
  );
};

export default Game;