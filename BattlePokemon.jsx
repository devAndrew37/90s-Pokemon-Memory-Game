import React from "react";
import { useState, useEffect, useRef } from "react";
import "./Pokemon.css";
import { cardDeck } from './cardDeck';

const Battle = ({ id1, id2, theme, showTransition, setShowTransition, onClose, setBattleMusic, setIsPlaying, setTurn, boardFlag, setBoardFlag, 
  pairResults, setPairResults, found1, found2, shinyFound1, shinyFound2, setShinyFound1, setShinyFound2, setScore }) => {
 const [pokemon1, setPokemon1] = useState(null);
 const [pokemon2, setPokemon2] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [ready1, setReady1] = useState(false);
 const [ready2, setReady2] = useState(false);
 const [hp1, setHp1] = useState(0);
 const [maxHp1, setMaxHp1] = useState(0);
 const [pp1, setPp1] = useState(0);
 const [pp1Class, setPp1Class] = useState("");
 const [pp2, setPp2] = useState(0);
 const [pp2Class, setPp2Class] = useState("");
 const [pp3, setPp3] = useState(0);
 const [pp3Class, setPp3Class] = useState("");
 const [pp4, setPp4] = useState(0);
 const [pp4Class, setPp4Class] = useState("");
 const [hp2, setHp2] = useState(0);
 const [maxHp2, setMaxHp2] = useState(0);
 const [enemyPp1, setEnemyPp1] = useState(0);
 const [enemyPp2, setEnemyPp2] = useState(0);
 const [enemyPp3, setEnemyPp3] = useState(0);
 const [enemyPp4, setEnemyPp4] = useState(0);
 const [attack1, setAttack1] = useState(0);
 const [attack2, setAttack2] = useState(0);
 const [defense1, setDefense1] = useState(0);
 const [defense2, setDefense2] = useState(0);
 const [specialAttack1, setSpecialAttack1] = useState(0);
 const [specialAttack2, setSpecialAttack2] = useState(0);
 const [specialDefense1, setSpecialDefense1] = useState(0);
 const [specialDefense2, setSpecialDefense2] = useState(0);
 const [speed1, setSpeed1] = useState(0);
 const [speed2, setSpeed2] = useState(0);
 const [type1, setType1] = useState("");
 const [type2, setType2] = useState("");
 const [fightFlag, setFightFlag] = useState(false);
 const [shiny1, setShiny1] = useState(false);
 const [shiny2, setShiny2] = useState(false);
 const [genre1, setGenre1] = useState("");
 const [genre2, setGenre2] = useState("");
 const [overlay, setOverlay] = useState("pokemon-battle-overlay");
 const [popup, setPopup] = useState("popup-battle-pokemon");
 const [poke1Img, setPoke1Img] = useState("");
 const [poke2Img, setPoke2Img] = useState("");
 const [battleTurn, setBattleTurn] = useState(false);
 const [firstAttack, setFirstAttack] = useState(false);
 const [messageFlag, setMessageFlag] = useState(false);
 const [battleMessage, setBattleMessage] = useState("");
 const [continueBattle, setContinueBattle] = useState(false);
 const [bothAttacksFlag, setBothAttacksFlag] = useState(false);
 const [showAllPokemon, setShowAllPokemon] = useState(false);
 const [animation1, setAnimation1] = useState("");
 const [animation2, setAnimation2] = useState("");
 const [status1, setStatus1] = useState("");
 const [status2, setStatus2] = useState("");
 const youWin = new Audio("/assets/youwin.mp3");
 const youLose = new Audio("/assets/lose.mp3");
 const select = new Audio("/assets/select.mp3");
 const superEffective = new Audio("/assets/supereffective.mp3");
 const runAway = new Audio("/assets/runaway.mp3");
 const audio1Ref = useRef(null);
 const audio2Ref = useRef(null);
 const battleActiveRef = useRef(true);
 
 let hpPercent1 = hp1 / maxHp1;
 let hpClass1 = "hp-bar-fill";
 if (hpPercent1 < 0.25) hpClass1 += " low";
 else if (hpPercent1 < 0.5) hpClass1 += " mid";
 else hpClass1 += " high";

 let hpPercent2 = hp2 / maxHp2;
 let hpClass2 = "hp-bar-fill";
 if (hpPercent2 < 0.25) hpClass2 += " low";
 else if (hpPercent2 < 0.5) hpClass2 += " mid";
 else hpClass2 += " high";

 const card1 = cardDeck.find(p => p.id === id1);
 const card2 = cardDeck.find(p => p.id === id2);

 const fetchPokemon1 = async () => {
  try {
   const fetchData = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://pokedex.mimo.dev/api/pokemon/${id1}`)}`);
    if(!fetchData.ok) {
      throw new Error("Pokemon not found");
    }
   const queryData1 = await fetchData.json();
   setPokemon1(queryData1);
   const cryUrl1 = queryData1.cries.legacy;
   audio1Ref.current = new Audio(cryUrl1);
   const atk1 = queryData1.stats.find(stat => stat.stat.name === "attack").base_stat;
   const def1 = queryData1.stats.find(stat => stat.stat.name === "defense").base_stat;
   const spa1 = queryData1.stats.find(stat => stat.stat.name === "special-attack").base_stat;
   const spd1 = queryData1.stats.find(stat => stat.stat.name === "special-defense").base_stat;
   const spe1 = queryData1.stats.find(stat => stat.stat.name === "speed").base_stat;
   const typ1 = queryData1.types[0].type.name + (queryData1.types[1] ? ` / ${queryData1.types[1].type.name}` : "");
   setHp1(queryData1.stats.find(stat => stat.stat.name === "hp").base_stat + 200);
   setMaxHp1(queryData1.stats.find(stat => stat.stat.name === "hp").base_stat + 200);
   setPp1(card1.mov1[6] - card1.mov1[6] * 0.6);
   setPp2(card1.mov2[6] - card1.mov2[6] * 0.6);
   setPp3(card1.mov3[6] - card1.mov3[6] * 0.6);
   setPp4(card1.mov4[6] - card1.mov4[6] * 0.6);
   setAttack1(atk1);
   setDefense1(def1);
   setSpecialAttack1(spa1);
   setSpecialDefense1(spd1);
   setSpeed1(spe1);
   setType1(typ1);
   setReady1(true);
   setLoading(false);
 } catch (err) {
   setError(err.message);
   setLoading(false);
  }
 };

  const fetchPokemon2 = async () => {
  try {
   const fetchData = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://pokedex.mimo.dev/api/pokemon/${id2}`)}`);
    if(!fetchData.ok) {
      throw new Error("Pokemon not found");
    }
   const queryData2 = await fetchData.json();
   setPokemon2(queryData2);
   const cryUrl2 = queryData2.cries.legacy;
   audio2Ref.current = new Audio(cryUrl2);
   const atk2 = queryData2.stats.find(stat => stat.stat.name === "attack").base_stat;
   const def2 = queryData2.stats.find(stat => stat.stat.name === "defense").base_stat;
   const spa2 = queryData2.stats.find(stat => stat.stat.name === "special-attack").base_stat;
   const spd2 = queryData2.stats.find(stat => stat.stat.name === "special-defense").base_stat;
   const spe2 = queryData2.stats.find(stat => stat.stat.name === "speed").base_stat;
   const typ2 = queryData2.types[0].type.name + (queryData2.types[1] ? ` / ${queryData2.types[1].type.name}` : "");
   setHp2(queryData2.stats.find(stat => stat.stat.name === "hp").base_stat + 200);
   setMaxHp2(queryData2.stats.find(stat => stat.stat.name === "hp").base_stat + 200);
   setEnemyPp1(card2.mov1[6] - card2.mov1[6] * 0.6);
   setEnemyPp2(card2.mov2[6] - card2.mov2[6] * 0.6);
   setEnemyPp3(card2.mov3[6] - card2.mov3[6] * 0.6);
   setEnemyPp4(card2.mov4[6] - card2.mov4[6] * 0.6);
   setAttack2(atk2);
   setDefense2(def2);
   setSpecialAttack2(spa2);
   setSpecialDefense2(spd2);
   setSpeed2(spe2);
   setType2(typ2);
   setReady2(true);
   setLoading(false);
 } catch (err) {
   setError(err.message);
   setLoading(false);
  }
 };

 /*function getRandomMoves(moves, count = 4) {
  if (!Array.isArray(moves)) return [];
  const shuffled = moves.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}*/

 const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

 const getDisplayName = (name) => {
  if (name === "nidoran-m") return "Nidoran";
  if (name === "nidoran-f") return "Nidorina";
  return capitalize(name);
};

const onClosePokemonWindow = () => {
  setShowAllPokemon(false);
};

const criticalHit = (speed) => {
  const critChance = Math.min(speed / 512, 0.1);       // probabilidad de golpe critico maximo 10%
  if (Math.random() < critChance) {
    return 2;       // golpe critico
  } else {
    return 1;      // golpe normal
  }
};

const checkIfAttackLeftStatus = (target, move) => {
if (target === pokemon1) {
  if (move[0] === "Sludge" || move[0] === "Poison Sting") {
    if (Math.random() < 0.3 && status1 !== "PSN") {
      setBattleMessage(`${getDisplayName(target.name)} is poisoned!`);
      setStatus1("PSN");
      return "PSN";
    }
  }
  if (move[0] === "Body Slam" || move[0] === "Thunderbolt" || move[0] === "Magnitude" || move[0] === "Lick" || move[0] === "Slap" || move[0] === "Thunder" || move[0] === "Thunder Punch" || move[0] === "Spark") {
    if (Math.random() < 0.3 && status1 !== "PAR") {
      setBattleMessage(`${getDisplayName(target.name)} is paralyzed!`);
      setStatus1("PAR");
      return "PAR";
    }
  }
  if (move[0] === "Confusion" || move[0] === "Dizzy Punch") {
    if (Math.random() < 0.3 && status1 !== "CNF") {
      setBattleMessage(`${getDisplayName(target.name)} is confused!`);
      setStatus1("CNF");
      return "CNF";
    }
  }
} else if (target === pokemon2) {
  if (move[0] === "Sludge" || move[0] === "Poison Sting") {
    if (Math.random() < 0.3 && status2 !== "PSN") {
      setBattleMessage(`${getDisplayName(target.name)} is poisoned!`);
      setStatus2("PSN");
      return "PSN";
    }
  }
  if (move[0] === "Body Slam" || move[0] === "Thunderbolt" || move[0] === "Magnitude" || move[0] === "Lick" || move[0] === "Slap" || move[0] === "Thunder" || move[0] === "Thunder Punch" || move[0] === "Spark") {
    if (Math.random() < 0.3 && status2 !== "PAR") {
      setBattleMessage(`${getDisplayName(target.name)} is paralyzed!`);
      setStatus2("PAR");
      return "PAR";
    }
  }
  if (move[0] === "Confusion" || move[0] === "Dizzy Punch") {
    if (Math.random() < 0.3 && status2 !== "CNF") {
      setBattleMessage(`${getDisplayName(target.name)} is confused!`);
      setStatus2("CNF");
      return "CNF";
    }
  }
}
};

const typeWeakness = (attackingType, defendingType) => {
  if (!attackingType || !defendingType) return 1;
  if (defendingType.includes("normal")) {
    if (attackingType === "Fighting") return 3;
    if (attackingType === "Ghost") return 0;
    else return 1;
  }
  if (defendingType.includes("fire")) {
    if (attackingType === "Water" || attackingType === "Ground" || attackingType === "Rock") return 3;
    if (attackingType === "Fire" || attackingType === "Grass" || attackingType === "Ice" || attackingType === "Bug") return 0.1;
    else return 1;
  }
  if (defendingType.includes("water")) {
    if (attackingType === "Electric" || attackingType === "Grass") return 3;
    if (attackingType === "Fire" || attackingType === "Water" || attackingType === "Ice") return 0.1;
    else return 1;
  }
  if (defendingType.includes("electric")) {
    if (attackingType === "Ground") return 3;
    if (attackingType === "Electric" || attackingType === "Flying") return 0.1;
    else return 1;
  }
  if (defendingType.includes("grass")) {
    if (attackingType === "Fire" || attackingType === "Ice" || attackingType === "Poison" || attackingType === "Flying" || attackingType === "Bug") return 3;
    if (attackingType === "Water" || attackingType === "Electric" || attackingType === "Grass" || attackingType === "Ground") return 0.1;
    else return 1;
  }
  if (defendingType.includes("ice")) {
    if (attackingType === "Fire" || attackingType === "Fighting" || attackingType === "Rock") return 3;
    if (attackingType === "Ice") return 0.1;
    else return 1;
  }
  if (defendingType.includes("fighting")) {
    if (attackingType === "Flying" || attackingType === "Psychic") return 3;
    if (attackingType === "Bug" || attackingType === "Rock" || attackingType === "Dark") return 0.1;
    else return 1;
  }
  if (defendingType.includes("poison")) {
    if (attackingType === "Ground" || attackingType === "Psychic") return 3;
    if (attackingType === "Fighting" || attackingType === "Poison" || attackingType === "Bug" || attackingType === "Grass") return 0.1;
    else return 1;
  }
  if (defendingType.includes("ground")) {
    if (attackingType === "Water" || attackingType === "Grass" || attackingType === "Ice") return 3;
    if (attackingType === "Poison" || attackingType === "Rock") return 0.1;
    if (attackingType === "Electric") return 0;
    else return 1;
  }
  if (defendingType.includes("flying")) {
    if (attackingType === "Electric" || attackingType === "Ice" || attackingType === "Rock") return 3;
    if (attackingType === "Grass" || attackingType === "Fighting" || attackingType === "Bug") return 0.1;
    if (attackingType === "Ground") return 0;
    else return 1;
  }
  if (defendingType.includes("psychic")) {
    if (attackingType === "Bug" || attackingType === "Ghost" || attackingType === "Dark") return 3;
    if (attackingType === "Fighting" || attackingType === "Psychic") return 0.1;
    else return 1;
  }
  if (defendingType.includes("bug")) {
    if (attackingType === "Fire" || attackingType === "Flying" || attackingType === "Rock") return 3;
    if (attackingType === "Fighting" || attackingType === "Ground" || attackingType === "Grass") return 0.1;
    else return 1;
  }
  if (defendingType.includes("rock")) {
    if (attackingType === "Water" || attackingType === "Grass" || attackingType === "Fighting" || attackingType === "Ground") return 3;
    if (attackingType === "Normal" || attackingType === "Fire" || attackingType === "Poison" || attackingType === "Flying") return 0.1;
    else return 1;
  }
  if (defendingType.includes("ghost")) {
    if (attackingType === "Ghost" || attackingType === "Dark") return 3;
    if (attackingType === "Poison" || attackingType === "Bug") return 0.1;
    if (attackingType === "Normal" || attackingType === "Fighting") return 0;
    else return 1;
  }
  if (defendingType.includes("dragon")) {
    if (attackingType === "Ice" || attackingType === "Dragon") return 3;
    if (attackingType === "Fire" || attackingType === "Water" || attackingType === "Electric" || attackingType === "Grass") return 0.1;
    else return 1;
  }
  else {
    return 1;
  }
};

const statusAttacks = (move, target, attacker, targetMoves) => {
  if(move[0] === "Sleep Powder" || move[0] === "Sing" || move[0] === "Hypnosis"){
    setBattleMessage(`${getDisplayName(target.name)} fell asleep!`);
    if (target === pokemon1) {
      setStatus1("SLP");
      return "SLP";
    } else if (target === pokemon2) {
      setStatus2("SLP");
      return "SLP";
    }
  } else if (move[0] === "Glare" || move[0] === "Thunder Wave"){
    setBattleMessage(`${getDisplayName(target.name)} is paralyzed!`);
    if (target === pokemon1) {
      setStatus1("PAR");
      return "PAR";
    } else if (target === pokemon2) {
      setStatus2("PAR");
      return "PAR";
    }
  } else if (move[0] === "Poison Tail"){
    setBattleMessage(`${getDisplayName(target.name)} is poisoned!`);
    if (target === pokemon1) {
      setStatus1("PSN");
      return "PSN";
    } else if (target === pokemon2) {
      setStatus2("PSN");
      return "PSN";
    }
  } else if (move[0] === "Supersonic") {
    setBattleMessage(`${getDisplayName(target.name)} is confused!`);
    if (target === pokemon1) {
      setStatus1("CNF");
      return "CNF";
    } else if (target === pokemon2) {
      setStatus2("CNF");
      return "CNF";
    }
    } else if (move[0] === "String Shot" ) {
    setBattleMessage(`${getDisplayName(target.name)}'s speed fell!`);
    if (target === pokemon1) {
      setSpeed1(prev => Math.max(prev - 10, 10));
    } else if (target === pokemon2) {
      setSpeed2(prev => Math.max(prev - 10, 10));
    }
  } else if (move[0] === "Leer" || move[0] === "Screech") {
    setBattleMessage(`${getDisplayName(target.name)}'s defense fell!`);
    if (target === pokemon1) {
      setDefense1(prev => Math.max(prev - 10, 10));
    } else if (target === pokemon2) {
      setDefense2(prev => Math.max(prev - 10, 10));
    }
  } else if (move[0] === "Minimize" || move[0] === "Agility") {
    setBattleMessage(`${getDisplayName(attacker.name)}'s speed rose!`);
    if (attacker === pokemon1) {
      setSpeed1(prev => Math.min(prev + 10, 200));
    } else if (attacker === pokemon2) {
      setSpeed2(prev => Math.min(prev + 10, 200));
    }
  } else if (move[0] === "Harden" || move[0] === "Acid Armor" || move[0] === "Withdraw") {
    setBattleMessage(`${getDisplayName(attacker.name)}'s defense rose!`);
    if (attacker === pokemon1) {
      setDefense1(prev => Math.min(prev + 10, 200));
    } else if (attacker === pokemon2) {
      setDefense2(prev => Math.min(prev + 10, 200));
    }
  } else if (move[0] === "Amnesia") {
    setBattleMessage(`${getDisplayName(attacker.name)}'s special defense rose!`);
    if (attacker === pokemon1) {
      setSpecialDefense1(prev => Math.min(prev + 10, 200));
    } else if (attacker === pokemon2) {
      setSpecialDefense2(prev => Math.min(prev + 10, 200));
    } 
  } else if (move[0] === "Growl" || move[0] === "Feather Dance") {
    setBattleMessage(`${getDisplayName(target.name)}'s attack fell!`);
    if (target === pokemon1) {
      setAttack1(prev => Math.max(prev - 10, 10));
    } else if (target === pokemon2) {
      setAttack2(prev => Math.max(prev - 10, 10));
    }
  } else if (move[0] === "Focus Energy") {
    setBattleMessage(`${getDisplayName(attacker.name)}'s critical hit ratio rose!`);
    if (attacker === pokemon1) {
      setSpeed1(prev => Math.min(prev + 10, 200));
    } else if (attacker === pokemon2) {
      setSpeed2(prev => Math.min(prev + 10, 200));
    }
  }  else if (move[0] === "Recover") {
    setBattleMessage(`${getDisplayName(attacker.name)} restored its health!`);
    if (attacker === pokemon1) {
      setHp1(prevHp1 => Math.min(prevHp1 + Math.floor(maxHp1 / 3), maxHp1));
    } else if (attacker === pokemon2) {
      setHp2(prevHp2 => Math.min(prevHp2 + Math.floor(maxHp2 / 3), maxHp2));
    }
  } else if (move[0] === "Dragon Dance") {
    setBattleMessage(`${getDisplayName(attacker.name)}'s attack and speed rose!`);
    if (attacker === pokemon1) {
      setAttack1(prev => Math.min(prev + 10, 200));
      setSpeed1(prev => Math.min(prev + 10, 200));
    } else if (attacker === pokemon2) {
      setAttack2(prev => Math.min(prev + 10, 200));
      setSpeed2(prev => Math.min(prev + 10, 200));
    }
  } else if (move[0] === "Sand Attack") {
    setBattleMessage(`${getDisplayName(target.name)}'s accuracy fell!`);
      targetMoves[0] = Math.max(targetMoves[0] - 16, 30);
      targetMoves[1] = Math.max(targetMoves[1] - 16, 30);
      targetMoves[2] = Math.max(targetMoves[2] - 16, 30);
      targetMoves[3] = Math.max(targetMoves[3] - 16, 30);
  }
};

const checkStatus = (player, enemy) => {
if (status1 === "SLP") {
  if (Math.random() < 0.6) {
      setStatus1("");
      setBattleMessage(`${getDisplayName(player.name)} woke up!`);
    }
} else if (status1 === "PAR") {
  if (Math.random() < 0.5) {
        setStatus1("");
        setBattleMessage(`${getDisplayName(player.name)} is no longer paralyzed!`);
    }
} else if (status1 === "PSN") {
  if (Math.random() < 0.4) {
      setStatus1("");
      setBattleMessage(`${getDisplayName(player.name)} is no longer poisoned!`);
  } else {
      const poisonDamage = Math.floor(maxHp1 * 0.1);
      setHp1(prevHp1 => Math.max(prevHp1 - poisonDamage, 0));
      setBattleMessage(`${getDisplayName(player.name)} is hurt by poison!`);
  }
} else if (status1 === "CNF") {
  if (Math.random() < 0.5) {
      setStatus1("");
      setBattleMessage(`${getDisplayName(player.name)} is no longer confused!`);
  } 
} else if (status2 === "SLP") {
  if (Math.random() < 0.6) {
          setStatus2("");
          setBattleMessage(`${getDisplayName(enemy.name)} woke up!`);
      }
} else if (status2 === "PAR") {
  if (Math.random() < 0.5) {
          setStatus2("");
          setBattleMessage(`${getDisplayName(enemy.name)} is no longer paralyzed!`);
        }
  } else if (status2 === "PSN") {
  if (Math.random() < 0.4) {
      setStatus2("");
      setBattleMessage(`${getDisplayName(enemy.name)} is no longer poisoned!`);
  } else {
      const poisonDamage = Math.floor(maxHp2 * 0.1);
      setHp2(prevHp2 => Math.max(prevHp2 - poisonDamage, 0));
      setBattleMessage(`${getDisplayName(enemy.name)} is hurt by poison!`);
  }
} else if (status2 === "CNF") {
  if (Math.random() < 0.5) {
      setStatus2("");
      setBattleMessage(`${getDisplayName(enemy.name)} is no longer confused!`);
  } 
}
};

const finishFight = (winner) => {      // determina el ganador y cierra la ventana de batalla
  setBattleMusic(false);
  if (winner === id1) {          // gana el jugador
    youWin.play();
    setBattleMessage(`${getDisplayName(pokemon1.name)} wins the battle!`);
    setPairResults(prev => [...prev, { winner: pokemon1.name, loser: pokemon2.name }]);
    setScore(prev => ({ ...prev, player1: prev.player1 + 1 }));
    setFightFlag(true);
    setMessageFlag(true);
  } else if (winner === id2) {      // gana el cpu
    youLose.play();
    setBattleMessage(`${getDisplayName(pokemon2.name)} wins the battle!`);
    setScore(prev => ({ ...prev, player2: prev.player2 + 1 }));
    setPairResults(prev => [...prev, { winner: pokemon2.name, loser: pokemon1.name }]);
    setFightFlag(true);
    setMessageFlag(true);  
  }
  setTimeout(() => {
    setIsPlaying(true);
    if (winner === id1) {
      setTurn(1);       // el siguiente turno empieza el jugador porque gano
    } else if (winner === id2) {
      setTurn(2);       // el siguiente turno empieza el cpu porque gano
    }
    onClose();
  }, 6000);
};

const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const damageCalculation = async (move, player, enemy_move, enemy) => {
  if (!move || !player || !enemy) return;
  // Player move details and Pokemon stats
  const powerMove = move[4];
  const accuracyMove = move[5];
  const typeMove = move[1];
  const categoryMove = move[2];
  const playerMoves = [card1.mov1, card1.mov2, card1.mov3, card1.mov4];
  const hitAudio = new Audio("/assets/hit.mp3");
  const audioAttack = new Audio("/assets/sfx_attacks/" + move[0] + ".mp3");
  const atk1 = attack1;
  const def1 = defense1;
  const spa1 = specialAttack1;
  const spd1 = specialDefense1;
  const spe1 = speed1;
  const typ1 = player.types[0].type.name + (player.types[1] ? ` / ${player.types[1].type.name}` : "");
  let statusAttack1 = "";
  let statusAttackMid = "";
  const confusionChance = Math.random() < 0.5

  // Enemy move details and Pokemon stats
  const enemyMoves = [enemy_move.mov1, enemy_move.mov2, enemy_move.mov3, enemy_move.mov4];
  let numberEnemyMove = Math.floor(Math.random() * enemyMoves.length)
  if (numberEnemyMove === 0 && enemyPp1 === 0) numberEnemyMove = 1;
  if (numberEnemyMove === 1 && enemyPp2 === 0) numberEnemyMove = 2;
  if (numberEnemyMove === 2 && enemyPp3 === 0) numberEnemyMove = 3;
  if (numberEnemyMove === 3 && enemyPp4 === 0) numberEnemyMove = 0;           // si el movimiento elegido no tiene pp, elige el siguiente
  if (enemyPp1 === 0 && enemyPp2 === 0 && enemyPp3 === 0 && enemyPp4 === 0) {
    setBattleMessage(`${getDisplayName(enemy.name)} has no moves left! It struggles!`);
  }
  let randomEnemyMove = enemyMoves[numberEnemyMove];
  if (numberEnemyMove === 0) setEnemyPp1(prev => prev - 1);
  if (numberEnemyMove === 1) setEnemyPp2(prev => prev - 1);
  if (numberEnemyMove === 2) setEnemyPp3(prev => prev - 1);
  if (numberEnemyMove === 3) setEnemyPp4(prev => prev - 1);
  let powerEnemyMove = randomEnemyMove[4];
  let accuracyEnemyMove = randomEnemyMove[5];
  let typeEnemyMove = randomEnemyMove[1];
  let categoryEnemyMove = randomEnemyMove[2];
  const audioEnemyAttack = new Audio("/assets/sfx_attacks/" + randomEnemyMove[0] + ".mp3");
  const atk2 = attack2;
  const def2 = defense2;
  const spa2 = specialAttack2;
  const spd2 = specialDefense2;
  const spe2 = speed2;
  const typ2 = enemy.types[0].type.name + (enemy.types[1] ? ` / ${enemy.types[1].type.name}` : "");
  let statusAttack2 = "";
  let statusAttackMid2 = "";
  const confusionChance2 = Math.random() < 0.5;

  setMessageFlag(true);
  if (firstAttack) {  
    if (status1 === "CNF" && confusionChance) {                                                 //ataca primero el jugador
        setBattleMessage(`${getDisplayName(player.name)} is confused!`);
        await delay(1000);
        hitAudio.play();
        const confusionDamage = Math.floor(maxHp1 * 0.1);
        setHp1(prevHp1 => Math.max(prevHp1 - confusionDamage, 0));
        setBattleMessage(`${getDisplayName(player.name)} hurt itself in its confusion!`);
        await delay(1000);
    } else {
    if (status1 === "CNF" && !confusionChance) {                           
        setBattleMessage(`${getDisplayName(player.name)} is confused!`);
        await delay(1000);
    }
    setBattleMessage(`${getDisplayName(player.name)} used ${move[0]}!`);     
    if (status1 === "SLP") {
      await delay(1000);
      setBattleMessage(`${getDisplayName(player.name)} is asleep and can't move!`);
    } else if (status1 === "PAR" && Math.random() < 0.25) {
      await delay(1000);
      setBattleMessage(`${getDisplayName(player.name)} is paralyzed and can't move!`);
    } else {
      await delay(500);
      audioAttack.play();
      const random = Math.floor(Math.random() * 256);
      const damageToEnemy = Math.floor((22 * powerMove * (atk1 / def2) / 50) + 2 * typeWeakness(typeMove, typ2) * criticalHit(spe1));
      await delay(1500);
      if (random > accuracyMove * 2.55) {    // precision del movimiento     
        setBattleMessage("The attack missed!");
      } else if (categoryMove === "Status" && random <= accuracyMove * 2.55) {
        statusAttack1 = statusAttacks(move, enemy, player, enemyMoves);
      } else { 
      setAnimation2("hit-animation");
      setHp2(prevHp2 => Math.max(prevHp2 - damageToEnemy, 0));
      const weakness = typeWeakness(typeMove, typ2);
      if (weakness === 3 && criticalHit(spe1) === 1) {
        superEffective.play();
        setBattleMessage("It's super effective!");
      } else if (weakness === 3 && criticalHit(spe1) === 2) {
        superEffective.play();
        setBattleMessage("A critical hit! It's super effective!");
      } else if (weakness === 0.1 || weakness === 0) {
        setBattleMessage("It's not very effective...");
      } else if (weakness === 1 && criticalHit(spe1) === 2) {
        setBattleMessage("A critical hit!");
      }}
    }
    await delay(1000);
    statusAttackMid = checkIfAttackLeftStatus(enemy, move);
  }
  await delay(1000);
    if (!battleActiveRef.current) return;
    if ((status2 === "CNF" || statusAttack1 === "CNF" || statusAttackMid === "CNF") && confusionChance2) {             //luego el enemigo
        setBattleMessage(`${getDisplayName(enemy.name)} is confused!`);
        await delay(1000);
        hitAudio.play();
        const confusionDamage2 = Math.floor(maxHp2 * 0.1);
        setHp2(prevHp2 => Math.max(prevHp2 - confusionDamage2, 0));
        setBattleMessage(`${getDisplayName(enemy.name)} hurt itself in its confusion!`);
        await delay(1000);
        if(hp1 > 0 && hp2 > 0) {
        checkIfAttackLeftStatus(player, randomEnemyMove);
        await delay(800);
        checkStatus(player, enemy);
        }
        await delay(800);
        if (hp1 > 0) {
            setBothAttacksFlag(true);
        }
    } else { 
    if ((status2 === "CNF" || statusAttack1 === "CNF" || statusAttackMid === "CNF") && !confusionChance2) {         
        setBattleMessage(`${getDisplayName(enemy.name)} is confused!`);
        await delay(1000);  
    }
      setBattleMessage(`${getDisplayName(enemy.name)} used ${randomEnemyMove[0]}!`);   
      if (status2 === "SLP" || statusAttack1 === "SLP") {
        await delay(1000);
        setBattleMessage(`${getDisplayName(enemy.name)} is asleep and can't move!`);
      } else if ((status2 === "PAR" || statusAttack1 === "PAR" || statusAttackMid === "PAR") && Math.random() < 0.25) {
        await delay(1000);
        setBattleMessage(`${getDisplayName(enemy.name)} is paralyzed and can't move!`);
      } else {
        await delay(500);
        audioEnemyAttack.play();
        const random2 = Math.floor(Math.random() * 256);     
        const damageToPlayer = Math.floor((22 * powerEnemyMove * (atk2 / def1) / 50) + 2 * typeWeakness(typeEnemyMove, typ1) * criticalHit(spe2));
        await delay(1500);
        if (random2 > accuracyEnemyMove * 2.55) {    // precision del movimiento     
          setBattleMessage("The attack missed!");
      } else if (categoryEnemyMove === "Status" && random2 <= accuracyEnemyMove * 2.55) {
        statusAttacks(randomEnemyMove, player, enemy, playerMoves);
      } else {      
        setAnimation1("hit-animation");
        setHp1(prevHp1 => Math.max(prevHp1 - damageToPlayer, 0));
        const weakness2 = typeWeakness(typeEnemyMove, typ1);
        if (weakness2 === 3 && criticalHit(spe2) === 1) {
          superEffective.play();
          setBattleMessage("It's super effective!");
        } else if (weakness2 === 3 && criticalHit(spe2) === 2) {
          superEffective.play();
          setBattleMessage("A critical hit! It's super effective!");
        } else if (weakness2 === 0.1 || weakness2 === 0) {
          setBattleMessage("It's not very effective...");
        } else if (weakness2 === 1 && criticalHit(spe2) === 2) {
          setBattleMessage("A critical hit!");
        }}
      }
        await delay(500);
        if (statusAttackMid === "PSN") {
        const poisonDamage = Math.floor(maxHp2 * 0.1);
        setHp2(prevHp2 => Math.max(prevHp2 - poisonDamage, 0));
        setBattleMessage(`${getDisplayName(enemy.name)} is hurt by poison!`);
        await delay(800);
        }
        if(hp1 > 0 && hp2 > 0) {
        checkIfAttackLeftStatus(player, randomEnemyMove);
        await delay(800);
        checkStatus(player, enemy);
        }
        await delay(1000);
        if (hp1 > 0) {
            setBothAttacksFlag(true);
        }
      }
  } else if (!firstAttack) {
    if (status2 === "CNF" && confusionChance2) {                                                    //ataca primero el enemigo
        setBattleMessage(`${getDisplayName(enemy.name)} is confused!`);
        await delay(1000);
        hitAudio.play();
        const confusionDamage2 = Math.floor(maxHp2 * 0.1);
        setHp2(prevHp2 => Math.max(prevHp2 - confusionDamage2, 0));
        setBattleMessage(`${getDisplayName(enemy.name)} hurt itself in its confusion!`);
        await delay(1000); 
    } else {
    if (status2 === "CNF" && !confusionChance2) {
        setBattleMessage(`${getDisplayName(enemy.name)} is confused!`);
        await delay(1000);      
    }
    setBattleMessage(`${getDisplayName(enemy.name)} used ${randomEnemyMove[0]}!`);   
    if (status2 === "SLP") {
      await delay(1000);
      setBattleMessage(`${getDisplayName(enemy.name)} is asleep and can't move!`);
    } else if (status2 === "PAR" && Math.random() < 0.25) {
      await delay(1000);
      setBattleMessage(`${getDisplayName(enemy.name)} is paralyzed and can't move!`);
    } else {
      await delay(500);
      audioEnemyAttack.play();
      const random2 = Math.floor(Math.random() * 256);    
      const damageToPlayer = Math.floor((22 * powerEnemyMove * (atk2 / def1) / 50) + 2 * typeWeakness(typeEnemyMove, typ1) * criticalHit(spe2));
      await delay(1500);
      if (random2 > accuracyEnemyMove * 2.55) {    // precision del movimiento     
        setBattleMessage("The attack missed!");
      } else if (categoryEnemyMove === "Status" && random2 <= accuracyEnemyMove * 2.55) {
        statusAttack2 = statusAttacks(randomEnemyMove, player, enemy, playerMoves);
      } else {    
      setAnimation1("hit-animation");
      setHp1(prevHp1 => Math.max(prevHp1 - damageToPlayer, 0));
      const weakness2 = typeWeakness(typeEnemyMove, typ1);
      if (weakness2 === 3 && criticalHit(spe2) === 1) {
        superEffective.play();
        setBattleMessage("It's super effective!");
      } else if (weakness2 === 3 && criticalHit(spe2) === 2) {
        superEffective.play();
        setBattleMessage("A critical hit! It's super effective!");
      } else if (weakness2 === 0.1 || weakness2 === 0) {
        setBattleMessage("It's not very effective...");
      } else if (weakness2 === 1 && criticalHit(spe2) === 2) {
        setBattleMessage("A critical hit!");
      }}
    }
    await delay(1000);
    statusAttackMid2 = checkIfAttackLeftStatus(player, randomEnemyMove);
  }
    await delay(1000);
    if (!battleActiveRef.current) return;
    if ((status1 === "CNF" || statusAttack2 === "CNF" || statusAttackMid2 === "CNF") && confusionChance) {                                  //luego el jugador
        setBattleMessage(`${getDisplayName(player.name)} is confused!`);
        await delay(1000);
        hitAudio.play();
        const confusionDamage = Math.floor(maxHp1 * 0.1);
        setHp1(prevHp1 => Math.max(prevHp1 - confusionDamage, 0));
        setBattleMessage(`${getDisplayName(player.name)} hurt itself in its confusion!`);
        await delay(1000);
        if(hp1 > 0 && hp2 > 0) {
        checkIfAttackLeftStatus(enemy, move);
        await delay(1000);
        checkStatus(player, enemy);
        }
        await delay(1000);
          if (hp2 > 0) {
            setBothAttacksFlag(true);
          }
    } else {
    if ((status1 === "CNF" || statusAttack2 === "CNF" || statusAttackMid2 === "CNF") && !confusionChance) {                             
        setBattleMessage(`${getDisplayName(player.name)} is confused!`);
        await delay(700);
    }      
      setBattleMessage(`${getDisplayName(player.name)} used ${move[0]}!`);         
      if (status1 === "SLP" || statusAttack2 === "SLP") {
        await delay(1000);
        setBattleMessage(`${getDisplayName(player.name)} is asleep and can't move!`);
    } else if ((status1 === "PAR" || statusAttack2 === "PAR" || statusAttackMid2 === "PAR") && Math.random() < 0.25) {
        await delay(1000);
        setBattleMessage(`${getDisplayName(player.name)} is paralyzed and can't move!`);
    } else {
        await delay(500);
        audioAttack.play();
        const random = Math.floor(Math.random() * 256);    
        const damageToEnemy = Math.floor((22 * powerMove * (atk1 / def2) / 50) + 2 * typeWeakness(typeMove, typ2) * criticalHit(spe1));
        await delay(1500);
        if (random > accuracyMove * 2.55) {    // precision del movimiento     
        setBattleMessage("The attack missed!");
      } else if (categoryMove === "Status" && random <= accuracyMove * 2.55) {
        statusAttacks(move, enemy, player, enemyMoves);
      } else {      
        setAnimation2("hit-animation");
        setHp2(prevHp2 => Math.max(prevHp2 - damageToEnemy, 0));
        const weakness = typeWeakness(typeMove, typ2);
        if (weakness === 3 && criticalHit(spe1) === 1) {
          superEffective.play();
          setBattleMessage("It's super effective!");
        } else if (weakness === 3 && criticalHit(spe1) === 2) {
          superEffective.play();
          setBattleMessage("A critical hit! It's super effective!");
        } else if (weakness === 0.1 || weakness === 0) {
          setBattleMessage("It's not very effective...");          
        } else if (weakness === 1 && criticalHit(spe1) === 2) {
          setBattleMessage("A critical hit!");
        }} 
      }
        await delay(500);
        if (statusAttackMid2 === "PSN") {
        const poisonDamage2 = Math.floor(maxHp2 * 0.1);
        setHp1(prevHp1 => Math.max(prevHp1 - poisonDamage2, 0));
        setBattleMessage(`${getDisplayName(player.name)} is hurt by poison!`);
        await delay(800);
        }
        if(hp1 > 0 && hp2 > 0) {
        checkIfAttackLeftStatus(enemy, move);
        await delay(800);
        checkStatus(player, enemy);
        }
        await delay(1000);
          if (hp2 > 0) {
            setBothAttacksFlag(true);
          }
    }}
}; 

useEffect(() => {
  if (hp1 === 0 && pokemon1 && !bothAttacksFlag) {
    setBattleMessage(`${getDisplayName(pokemon1.name)} fainted!`);
    setAnimation1("death-animation-left");
    battleActiveRef.current = false;
    audio1Ref.current.play();
    setTimeout(() => {
      finishFight(id2);     
    }, 1000);
  } else if (hp2 === 0 && pokemon2 && !bothAttacksFlag) {
    setBattleMessage(`${getDisplayName(pokemon2.name)} fainted!`);
    setAnimation2("death-animation-right");
    battleActiveRef.current = false;
    audio2Ref.current.play();
    setTimeout(() => {
      finishFight(id1);     
    }, 1000);
    }
  if (hp1 > 0 && hp2 > 0 && bothAttacksFlag) {
    setAnimation1("");
    setAnimation2("");
    setBothAttacksFlag(false);
    setFightFlag(false);
    setMessageFlag(false);     
  } 
}, [hp1, hp2, bothAttacksFlag]);

useEffect(() => {
  if (battleTurn) {
    setFirstAttack(Math.random() < 0.5);  // 50% de probabilidad para que el jugador ataque primero
    if (pp1 === 0) setPp1Class("disabled-move");
    if (pp2 === 0) setPp2Class("disabled-move");
    if (pp3 === 0) setPp3Class("disabled-move");
    if (pp4 === 0) setPp4Class("disabled-move");
  }
  setBattleTurn(false);
}, [battleTurn]);

useEffect(() => {
  if(id1) fetchPokemon1();
  if(id2) fetchPokemon2();
  select.volume = 0.8;
 }, [id1, id2]);

useEffect(() => {
  setShiny1(Math.random() < 0.90); // 10% de probabilidad para sacar un shiny
  setShiny2(Math.random() < 0.90);
  setGenre1(Math.random() < 0.5 ? "♂" : "♀");
  setGenre2(Math.random() < 0.5 ? "♂" : "♀");
  setOverlay("pokemon-battle-overlay-black");
  setPopup("popup-battle-pokemon-animation");
  setPoke1Img("assets/misteryback.png");
  setPoke2Img("assets/misteryfront.png");
  const timer = setTimeout(() => {
    setShowTransition(false);
    setOverlay("pokemon-battle-overlay");
    setPopup("popup-battle-pokemon");
  }, 2800); 
  const timer2 = setTimeout(() => {
    if (pokemon1 && pokemon2) {    
    if (shiny1) {
      setPoke1Img(pokemon1.sprites.back_default);
    } else {
      setPoke1Img(pokemon1.sprites.back_shiny);
      setShinyFound1(prev => [...prev, pokemon1.id]);
    }
    if (shiny2) {
      setPoke2Img(pokemon2.sprites.front_default);
    } else {
      setPoke2Img(pokemon2.sprites.front_shiny);
      setShinyFound2(prev => [...prev, pokemon2.id]);
    }
  }
  }, 2500);
  return () => {
  clearTimeout(timer);
  clearTimeout(timer2);
  }
}, [pokemon1, pokemon2]);
 
  return (
    <>
    {showAllPokemon && (
      <div className="pokemon-overlay">
        <div className={`popup-pokemon ${theme}`} style={{ width: "1800px", height: "1000px", overflowY: "auto", position: "relative" }}>
          <button onClick={onClosePokemonWindow} style={{ float: "right", position: "relative", left: "30px", top: "20px", backgroundColor: "transparent" }}>✖</button>
          <div className="all-pokemon-container">
            <div className="pokemon-section">
              <div className="pokemon-header">
              <h2 style={{ fontSize:"70px" }}>My Pokemon</h2>
              <hr />
              </div>
              {found1.map((pkmn, idx) => {
                const pkmnId = pkmn[0].id;
                return (
                  <div key={idx} className="pkmn-battled">
                    {pairResults[idx] && <img src={pairResults[idx].winner === pkmn[0].name ? "/assets/wincheck.png" : "/assets/losecheck.png"} alt="status" className={pairResults[idx].winner === pkmn[0].name ? "win-icon-short" : "lose-icon-short"} />}
                      <img src={shinyFound1.includes(pkmnId) ? `assets/sprites/${pkmnId}_front_shiny.png` : `assets/sprites/${pkmnId}_front_default.png`} alt={pkmn[0].name} className="pkmn-img" style={{ width:"180px" }} />
                      <p>{getDisplayName(pkmn[0].name)}</p>
                    <br />
                  </div>
                );
              })}             
              </div>
            <div className="pokemon-section" style={{ position: "relative", bottom: "22px"}}>
              <div className="pokemon-header" style={{ position: "relative", top: "22px"}}>
              <h2 style={{ fontSize:"70px" }}>Enemy's Pokemon</h2>
              <hr />
              </div>
              {found2.map((pkmn, idx) => {
                const pkmnId2 = pkmn[0].id;
                return (
                  <div key={idx} className="pkmn-battled">
                    {pairResults[idx] && <img src={pairResults[idx].winner === pkmn[0].name ? "/assets/wincheck.png" : "/assets/losecheck.png"} alt="status" className={pairResults[idx].winner === pkmn[0].name ? "win-icon-short" : "lose-icon-short"} />}
                      <img src={shinyFound2.includes(pkmnId2) ? `assets/sprites/${pkmnId2}_front_shiny.png` : `assets/sprites/${pkmnId2}_front_default.png`} alt={pkmn[0].name} className="pkmn-img" style={{ width:"190px" }} />
                      <p>{getDisplayName(pkmn[0].name)}</p>
                    <br />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>)}
     {ready1 && ready2 && !boardFlag && (
      <div className={overlay}>
        <div className={popup}>
        {showTransition && (
          <div className="battle-transition-overlay">
          </div>
        )} 
        <div className="pokemon2-container">
        <div className="pokemon2-stats" style={{position: "relative", right: "60px"}}>
          <h1 className="pokeName-battle" style={{position: "relative", right: "50px"}}>{getDisplayName(pokemon2.name)}</h1>
          <h3 className="pokeText-battle" style={{position: "relative", bottom: "80px"}}>:L50 {genre2} <span className={`status-pokemon ${status2}`}>{status2}</span> </h3>
          <div className="hp-bar-container" style={{ bottom: "95px", left: "60px" }}>
            <span className="hp-bar-label">HP:</span>
            <div
              className={hpClass2}
              style={{ "--hp": hp2 / maxHp2 }}
            />
          </div>
          <img src="assets/OP_UI.png" alt="" style={{ position: "relative", bottom: "155px", left: "0", width: "90%" }}/>
        </div>
        <div className={`pokemon2`}>
          <img id="pokemon-battle-sprite" style={{ position: "relative", right: "80px", bottom: "30px" }} src={poke2Img} alt={pokemon2.name} className={`${animation2}`} />
        </div>
        </div>
        <div className="pokemon1-container">
        <div className={`pokemon1`}>
        {poke1Img && (
          <img id="pokemon-battle-sprite" style={{ width: "300px", height: "300px", imageRendering: "crisp-edges", position: "relative", left: "250px", top: "10px" }} src={poke1Img} alt={pokemon1.name} className={`${animation1}`} />
        )}
        </div>
        <div className="pokemon1-stats" style={{ position: "relative", left: "370px", top: "80px"}}>
          <h1 className={`pokeName-battle`}>{getDisplayName(pokemon1.name)}</h1>
          <h3 className="pokeText-battle" style={{ position: "relative", bottom: "80px"}}>:L50 {genre1} <span className={`status-pokemon ${status1}`}>{status1}</span> </h3>
          <div className="hp-bar-container" style={{ bottom: "95px" }}>
            <span className="hp-bar-label">HP:</span>
            <div
              className={hpClass1}
              style={{ "--hp": hp1 / maxHp1 }}
            />
          </div>
          <h3 className="pokeText-battle" style={{ position: "relative", bottom: "150px", fontSize: "30px", letterSpacing: "1px", left: "25px" }}>{hp1} /<span style={{ position: "relative", left: "50px" }}>{maxHp1}</span></h3>
        </div>
        <img src="assets/PL_UI.png" alt="" style={{ position: "relative", top: "110px", left: "0", width: "40%" }} />
        </div>
        {messageFlag && <div className="moveset" style={{ height: "290px", display: "flex" }}>
          <p id="battle-message">
            {battleMessage}
          </p>
        </div>}
        {!fightFlag && !messageFlag && <div className="moveset" style={{ height: "290px", display: "flex" }}>
        <div className="battle-menu">
          <button onClick={() => { setFightFlag(true); select.play(); }} className="options">Fight</button>
          <button onClick={() => { select.play(); setShowAllPokemon(true); }} className="options">
          <img src="assets/pkmn.png" alt="" style={{ width: "40%" }} />
          </button>
          <button onClick={() => { select.play(); setBoardFlag(true); }} className="options">Board</button>
          <button onClick={() => { 
            select.play();
            setMessageFlag(true); 
            setBattleMessage("Running away...");
            setTimeout(() => {
            setPoke1Img("");
            runAway.play();
              finishFight(id2);
            }, 1000); }} className="options">Run</button>
        </div>
        </div>}
        {fightFlag && !messageFlag && <div className="moveset">
          <button className={`moves ${pp1Class}`} onClick={() => { if (pp1 == 0) return;
            else {
              select.play(); setPp1(prev => prev - 1); setBattleTurn(true);  damageCalculation(card1.mov1, pokemon1, card2, pokemon2);
           } }} title={card1.mov1[3]}>{card1.mov1[0]} - {pp1}/{card1.mov1[6] - card1.mov1[6] * 0.6}</button>
          <button className={`moves ${pp2Class}`} onClick={() => { if (pp2 == 0) return;
            else {
              select.play(); setPp2(prev => prev - 1); setBattleTurn(true); damageCalculation(card1.mov2, pokemon1, card2, pokemon2);
           } }} title={card1.mov2[3]}>{card1.mov2[0]} - {pp2}/{card1.mov2[6] - card1.mov2[6] * 0.6}</button>
          <button className={`moves ${pp3Class}`} onClick={() => { if (pp3 == 0) return;
            else {
              select.play(); setPp3(prev => prev - 1); setBattleTurn(true); damageCalculation(card1.mov3, pokemon1, card2, pokemon2);
           } }} title={card1.mov3[3]}>{card1.mov3[0]} - {pp3}/{card1.mov3[6] - card1.mov3[6] * 0.6}</button>
          <button className={`moves ${pp4Class}`} onClick={() => { if (pp4 == 0) return;
            else {
              select.play(); setPp4(prev => prev - 1); setBattleTurn(true); damageCalculation(card1.mov4, pokemon1, card2, pokemon2);
           } }} title={card1.mov4[3]}>{card1.mov4[0]} - {pp4}/{card1.mov4[6] - card1.mov4[6] * 0.6}</button>
        </div>}
        </div>
      </div>
     )}
    </>
  );
};

export default Battle;