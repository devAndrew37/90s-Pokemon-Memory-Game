import React from 'react';
import { useState, useEffect } from 'react';
import { preloadedImages, preloadedAudios } from './App.jsx';


const HeadTails = ({ setTurn, setStartFlag, theme, setIsPlaying }) => {
    
 const coinFlip = new Audio("assets/coin.mp3");
 const wonCoin = new Audio("assets/coinwon.mp3");
 const lostCoin = new Audio("assets/coinlost.mp3");
 const [startAnimation, setStartAnimation] = useState(false);
 const [heading, setHeading] = useState("Choose wisely!");
 const [resultFlag, setResultFlag] = useState(false);
 const [randomOutcome, setRandomOutcome] = useState("");
 const [themeHead, setThemeHead] = useState("");     // theme-selected, theme-correct, theme-failed
 const [themeTails, setThemeTails] = useState("");   // theme-selected, theme-correct, theme-failed
 const [hover, setHover] = useState("hover-effect");

 const handleHeadOrTails = (selected) => {
  if (startAnimation || resultFlag) return; // Prevent multiple clicks during animation
    setStartAnimation(true);
    setHover("");
    preloadedAudios["/assets/coin.mp3"].play();
    setTimeout(() => {
      const outcomes = ["head", "tails"];
      const randomIndex = Math.floor(Math.random() * outcomes.length);
      setRandomOutcome(outcomes[randomIndex]);
      setStartAnimation(false);
      setResultFlag(true);
        if (selected === outcomes[randomIndex]) {
            setHeading("Way to go! You start first");
            preloadedAudios["/assets/coinwon.mp3"].play();
            if (selected === "head") {
              setThemeHead("theme-correct");
              setThemeTails("");
            } else if (selected === "tails") {
              setThemeTails("theme-correct");
              setThemeHead("");
            }
            setTimeout(() => {
              setTurn(1);
              setIsPlaying(true);
              setStartFlag(true);
            }, 3000);  
        } else {
            setHeading("Too bad! Opponent starts first");
            preloadedAudios["/assets/coinlost.mp3"].play();
            if (selected === "head") {
              setThemeHead("theme-failed");
              setThemeTails("");
            } else if (selected === "tails") {
              setThemeTails("theme-failed");
              setThemeHead("");
            }
            setTimeout(() => {
              setTurn(2);
              setIsPlaying(true);
              setStartFlag(true);     
            }, 3000);
        }
    }, 2000);
 };

useEffect(() => {
  setRandomOutcome("");
  setResultFlag(false);
  setHeading("Choose wisely!");
  setThemeHead("");
  setThemeTails("");
}, []);

  return (
    <>
      <div className="popup-overlay">
        <div className={`popup-coin ${theme}`}>
          <h2 className='headtailstitle'>Choose head or tails to see who starts first!</h2>
          <div className="coin-options">
          <div className={`coin-option ${themeHead} ${hover}`} onClick={() => { 
            if (startAnimation || resultFlag) return;
            handleHeadOrTails("head")
            setThemeHead("theme-selected");
            }}>
          <img src={preloadedImages["/assets/head.png"].src} alt="Head" className='imgcoin' />
          <p>Head</p>
          </div>
          <div className={`coin-option ${themeTails} ${hover}`} onClick={() => { 
            if (startAnimation || resultFlag) return;
            handleHeadOrTails("tails")
            setThemeTails("theme-selected");}}>
          <img src={preloadedImages["/assets/tails.png"].src} alt="Tails" className='imgcoin' />
          <p>Tails</p>
          </div>
          </div>
          <div className="coin-result">
          {resultFlag && !startAnimation && <img src={preloadedImages[`/assets/${randomOutcome}.png`].src} alt={randomOutcome} className='imgcoin' />}
          {!startAnimation && !resultFlag && <p className="result-tailstitle">{heading}</p>}
          {!startAnimation && resultFlag && <p className="result-tailstitle-2">{heading}</p>}
          {startAnimation && <img src={preloadedImages["/assets/flip.gif"].src} alt="coin flip" className='gifcoin' />}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeadTails;