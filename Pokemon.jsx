import React from "react";
import { useState, useEffect } from "react";
import "./Pokemon.css";
import { cardDeck } from './cardDeck';

const Pokemon = ({ name, url, onClose, theme }) => {
 const [pokemon, setPokemon] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [card, setCard] = useState(null);

 const fetchPokemon = async () => {
  try {
   const fetchData = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
    if(!fetchData.ok) {
      throw new Error("Pokemon not found");
    }
   const queryData = await fetchData.json();
   setPokemon(queryData);
   const cryUrl = queryData.cries.legacy;
   const audio = new Audio(cryUrl);
   audio.play();
   setLoading(false);
 } catch (err) {
   setError(err.message);
   setLoading(false);
  }
 };

 const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

 const getDisplayName = (name) => {
  if (name === "nidoran-m") return "Nidoran♂";
  if (name === "nidoran-f") return "Nidoran♀";
  return capitalize(name);
};

 useEffect(() => {
  const cardPokemon = cardDeck.find((c) => c.url === url);
  setCard(cardPokemon);
 }, []);

 useEffect(() => {
  if(name) {
    fetchPokemon();
  }
 }, [name]);

  return (
    <>
     {pokemon && (
      <div className="pokemon-overlay">
        <div className={`popup-pokemon ${theme}`}>
          <button onClick={onClose} style={{ float: "right", position: "relative", left: "30px", top: "20px", backgroundColor: "transparent" }}>✖</button>
          <h1 className={`pokeName ${theme}`}>{getDisplayName(pokemon.name)}</h1>
          <img id="pokemon-sprite" src={pokemon.sprites.front_default} alt={pokemon.name} />
          <p className={`pokeText ${theme}`}>Height: {pokemon.height/10} m</p>
          <p className={`pokeText ${theme}`}>Weight: {pokemon.weight/10} kg</p>
          <p className={`pokeText ${theme}`}>Abilities: {card.mov1[0]}, {card.mov2[0]}, {card.mov3[0]}, {card.mov4[0]}</p>
          <p className={`pokeText ${theme}`}>Types: {pokemon.types.map((type) => capitalize(type.type.name)).join(", ")}</p>
        </div>
      </div>
     )}
    </>
  );
};

export default Pokemon;