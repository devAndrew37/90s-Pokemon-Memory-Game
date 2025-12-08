import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, createSearchParams } from 'react-router-dom';
import "./App.css";
import Game from './Game.jsx';
import GameBattle from './GameBattle.jsx';
import { cardDeck } from './cardDeck';
import { assets } from './assetsList';

export const preloadedImages = {};
export const preloadedAudios = {};

function NavigationMenu({ theme, loading }) {
  if (!loading) {
    return (
    <>
    <nav className={`${theme}`}>
      <ul>
        <li><Link to="/" className={`${theme}`} onClick={() => setShowPopup(false)}>Home</Link></li>
        <li><Link to="/about" className={`${theme}`}>About</Link></li>
      </ul>
    </nav>
      <footer className={`${theme}`}>
        Developed by <em><a href="https://www.linkedin.com/in/andres-santilli/" className={`${theme}`}>Andres Santilli</a></em>
      </footer>
    </>
    );
}}

function Home({ setIsPlaying, theme, loading }) {
  const [start, setStart] = useState(false);
  const [cpuMode, setCpuMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pikachuStart = new Audio('assets/pikachu.mp3');
  const startSound = new Audio('assets/start.mp3');
  const pikaPika = new Audio('assets/pikapika.mp3');
  const startSound2 = new Audio('assets/start2.mp3');

  const [randomCard, setRandomCard] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [pokemonCardId, setPokemonCardId] = useState(null);
  const [anotherPokemon, setAnotherPokemon] = useState(false);
  const [battleMode, setBattleMode] = useState(false);
  const [modeFlag, setModeFlag] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
const handleStart = () => {
    setStart(true);
    preloadedAudios["/assets/start.mp3"].play();
    preloadedAudios["/assets/pikachu.mp3"].play();
    navigate({
    pathname: '/',
    search: createSearchParams({ start: 'true' }).toString()
  });
};

const handleBattleMode = (battleFlag) => {
    setModeFlag(true);
    if(battleFlag) {
    setBattleMode(true);
    navigate({
    pathname: '/',
    search: createSearchParams({ start: 'true', battle: 'true' }).toString()
  });
 }
};

const easyMode = () => {
    preloadedAudios["/assets/pikapika.mp3"].play();
    preloadedAudios["/assets/start2.mp3"].play();
    setTimeout(() =>{
      if(battleMode) {
        navigate('/gamebattle', { state: { mode: 'cpu', difficulty: 10, numberBattles: 3 } });
      } else {
        navigate('/game', { state: { mode: 'cpu', difficulty: 4 } });
      }
    }, 1000);
};

const normalMode = () => {
    preloadedAudios["/assets/pikapika.mp3"].play();
    preloadedAudios["/assets/start2.mp3"].play();
    setTimeout(() =>{
      if(battleMode) {
        navigate('/gamebattle', { state: { mode: 'cpu', difficulty: 12, numberBattles: 6 } });
      } else {      
      navigate('/game', { state: { mode: 'cpu', difficulty: 8 } });
      }
    }, 1000);
};

const hardMode = () => {
    preloadedAudios["/assets/pikapika.mp3"].play();
    preloadedAudios["/assets/start2.mp3"].play();
    setTimeout(() =>{
      if(battleMode) {
        navigate('/gamebattle', { state: { mode: 'cpu', difficulty: 14, numberBattles: 9 } });
      } else {
      navigate('/game', { state: { mode: 'cpu', difficulty: 12 } });
      }
    }, 1000);
};

const twoPlayerMode = () => {
    preloadedAudios["/assets/pikapika.mp3"].play();
    preloadedAudios["/assets/start2.mp3"].play();
    setTimeout(() =>{
      if(battleMode) {
        navigate('/gamebattle', { state: { mode: 'player2' } });
      } else {
      navigate('/game', { state: { mode: 'player2' } });
      }
    }, 1000);
};

const handleFlip = async () => {
  if (flipped) return; // Evita múltiples clics rápidos
  setFlipped(true);
  const query = await fetch(`https://corsproxy.io/?${encodeURIComponent("https://pokedex.mimo.dev/api/pokemon/" + pokemonCardId)}`);
  const data = await query.json();
  const cryUrlLegacy = data.cries.legacy;
  const sound = new Audio(cryUrlLegacy);
  setTimeout(() => sound.play(), 300);
  setTimeout(() => setFlipped(false), 1500);
  setTimeout(() => setAnotherPokemon(true), 1700);
};

useEffect(() => {       // Elige una carta random al montar el componente
  setAnotherPokemon(false);
  const idx = Math.floor(Math.random() * cardDeck.length);
  setPokemonCardId(cardDeck[idx].id);
  setRandomCard(cardDeck[idx]);
}, [anotherPokemon]);

useEffect(() => {
  const params = new URLSearchParams(location.search);
  if (!params.get('start')) {
    setStart(false);
    setCpuMode(false);
  }
  if (!params.get('battle')) {
    setBattleMode(false);
    setModeFlag(false);
  }
}, [location.pathname, location.search]);

if(!loading) {
  return (
  <>
  <img src={preloadedImages["/assets/cover.png"].src} alt="cover" id="cover" width="400px" />
    <div id="home">
      {showPopup && (
        <div className="popup-overlay">
          <div className={`popup-help ${theme}`}>
            <button onClick={() => setShowPopup(false)} className="close-button-help">✖</button>
            <h2 className='help-h2'>Classic Mode</h2>
            <p className='help-p'>Match Pokemon pairs and win points!</p>
            <p className='help-p'>Just like the board game!</p>
            <img src={preloadedImages["/assets/classic.gif"].src} className='help-gif' alt="classic mode" />
            <br />
            <br />
            <br />
            <h2 className='help-h2'>Battle Mode</h2>
            <p className='help-p'>It's a memory game but with a twist: </p>
            <p className='help-p'>Gameboy battles as we remember from back in the 90s!</p>
            <img src={preloadedImages["/assets/battle.gif"].src} className='help-gif' alt="battle mode" />
            <br />
            <br />
            <p className='help-p'>You can change the theme of the game using the theme icon</p> 
            <img src={preloadedImages["/assets/themes.png"].src} alt="themes" width={40} style={{backgroundColor: '#222', borderRadius: '10px', padding: '3px'}} />
            <br />
            <br />
            <p className='help-p'>And you can also change the music using the controls on the bottom left 🎶<img src={preloadedImages["/assets/charmander.gif"].src} className='char-help' /> </p> 
            <br />
            <button onClick={() => setShowPopup(false)} className={`${theme}`}>Ok!</button>
            <br />
            <br />
        </div>
      </div>
      )}
      <br />
      <br />
      <img src={preloadedImages["/assets/pokegang.gif"].src} alt="the gang" id="gang-home" />
      <h1>Memoria</h1>
      <h2>Pokemon</h2>
      <p className="figuras">Figuras de Combate</p>
      <br />
      {!start && <button onClick={handleStart} className={`${theme}`}>Start</button> }
      {(start && !modeFlag) && (<div style={{ display: "flex", gap: "1rem" }}>
      <div className="tooltip-container">
      <button onClick={() => handleBattleMode(false)} className={`${theme}`}>Classic Mode</button>
      <span className={`${theme} tooltip-text left`}>Play Memory in Classic Mode, match Pokemon pairs and win points! Just like the board game!</span>
      </div>
      <div className="tooltip-container">
      <button onClick={() => handleBattleMode(true)} className={`${theme}`}>Battle Mode!</button>
      <span className={`${theme} tooltip-text right`}>Play in Battle Mode, it's a memory game but with a twist: Gameboy battles as we remember from back in the 90s!</span>
      </div>
      </div>)}  
      {(start && modeFlag && !cpuMode && !battleMode) && (<div style={{ display: "flex", gap: "1rem" }}>
      <button onClick={() => setCpuMode(true)} className={`${theme}`}>Player vs CPU</button>
      <button onClick={twoPlayerMode} className={`${theme}`}>2 Players</button>
      </div>)}
      {(cpuMode && !battleMode) && (<div style={{ display: "flex", gap: "1rem" }}>
      <button onClick={easyMode} className={`${theme}`}>Easy</button>
      <button onClick={normalMode} className={`${theme}`}>Normal</button>
      <button onClick={hardMode} id='hardButton'>Hard</button>
      </div>)}
      {battleMode && (<div style={{ display: "flex", gap: "1rem" }}>
      <div className="tooltip-container">
      <button onClick={easyMode} className={`${theme}`}>Easy</button>
      <span className={`${theme} tooltip-text difficulty`}>The player who wins 3 battles first takes the cake!</span>
      </div>
      <div className="tooltip-container">
      <button onClick={normalMode} className={`${theme}`}>Normal</button>
      <span className={`${theme} tooltip-text difficulty`}>The player who wins 6 battles first is a true Pokemon trainer!</span>
      </div>
      <div className="tooltip-container">
      <button onClick={hardMode} id='hardButton'>Hard</button>
      <span className={`${theme} tooltip-text difficulty`}>The player who wins 9 battles first is the Pokemon champion!</span>
      </div>
      </div>)}
      <br />
      {start && <button onClick={() => {setShowPopup(true);}} className="help-button"></button>}
      <img src={preloadedImages["/assets/pikachuyellow.gif"].src} alt="pikapika" width="20%" id="pikachu-home" onClick={() => {
        const randomPika = Math.random() < 0.5 ? preloadedAudios["/assets/pikapika.mp3"] : preloadedAudios["/assets/pikachu.mp3"];
        randomPika.play();
      }} />
  <div className="card-home-wrapper">
    {randomCard && (
      <div
        className={`card${flipped ? " flipped" : ""}`}
        style={{ width: "130px", height: "130px", cursor: "pointer", backgroundColor: "transparent" }}
        onClick={handleFlip}
      >
        <div className="card-inner">
          <div className="card-front">
            <img src={preloadedImages["/assets/back.PNG"].src} alt="back" />
          </div>
          <div className="card-back">
            <img
              src={
                preloadedImages[randomCard.src]
                  ? preloadedImages[randomCard.src].src
                  : randomCard.src
              }
              alt={randomCard.name}
            />
          </div>
        </div>
      </div>
    )}
  </div>
  </div>
  </>
  );
}
}

function About({ theme }) {
  const [zoom, setZoom] = useState({ show: false, x: 0, y: 0 });
  const [zoom2, setZoom2] = useState({ show: false, x: 0, y: 0 });

  const handleMouseMove = (e) => {
  const wrapper = e.currentTarget;
  const img = wrapper.querySelector('img');
  const rect = img.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  setZoom({ show: true, x, y });
  };

  const handleMouseLeave = () => setZoom({ show: false, x: 0, y: 0 });

  const handleMouseMove2 = (e) => {
  const wrapper = e.currentTarget;
  const img = wrapper.querySelector('img');
  const rect = img.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  setZoom2({ show: true, x, y });
  };

  const handleMouseLeave2 = () => setZoom2({ show: false, x: 0, y: 0 });

  return (
    <>
    <div className="about-container">
      <h2 style={{ justifyContent: "center" }} className="header">About</h2>
      <div className="about1">
      <p className={`${theme} textblock`}>I started this project as a way to practice React and improve my coding skills.
       I got this Pokemon memory board game when I was around 8 years old and I wanted to bring it back to life to the digital era in a more modern and fun way.</p>
      </div>
      <div className="about-img-wrapper about2" 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      >
       <img src={preloadedImages["/assets/about1.jpg"].src} alt="board game" className='imageblock' style={{ borderRadius: "10px" }} />
      {zoom.show && (
      <div
        className="img-zoom-rect"
        style={{
          position: "absolute",
          left: Math.max(zoom.x - 125, 0),
          top: Math.max(zoom.y - 125, 0),
          width: "250px",
          height: "250px",
          border: "2px solid #eebb09",
          backgroundImage: `url(assets/about1.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "1000px 1000px", // 2x zoom for 500px image
          backgroundPosition: `-${zoom.x * 2 - 125}px -${zoom.y * 2 - 125}px`,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
      )}
      </div>
      <div className="about3">
      <p className={`${theme} textblock`}>This board game was made at the start of the Pokemon era, so translated names (in this case Spanish) were not that polished. But that's the beauty of it, to keep it as authentic as it was when it came out.
        When you match a pair of cards, I added a call to an API server to retrieve data of the matched Pokemon and display it as a Pokedex with the original Game Boy games sounds for each Pokemon. </p> 
      <br />
      <br />
      <p className={`${theme} textblock`}>This project was pure nostalgia from the past!</p>
      </div>
      <div className="about-img-wrapper about4" 
      onMouseMove={handleMouseMove2}
      onMouseLeave={handleMouseLeave2}
      >
       <img src={preloadedImages["/assets/about2.jpg"].src} alt="board game2" className='imageblock' style={{ borderRadius: "10px" }} />
          {zoom2.show && (
      <div
        className="img-zoom-rect"
        style={{
          position: "absolute",
          left: Math.max(zoom2.x - 125, 0),
          top: Math.max(zoom2.y - 125, 0),
          width: "250px",
          height: "250px",
          border: "2px solid #eebb09",
          backgroundImage: `url(assets/about2.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "1000px 1000px", // 2x zoom for 500px image
          backgroundPosition: `-${zoom2.x * 2 - 125}px -${zoom2.y * 2 - 125}px`,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
       )}
    </div>
    </div>
    </>
  );
}
function App() {
const musicTracks = [
     { id: 0, title: "Pokemon Blue/Red - Route 24 & 25", src: "assets/music/Route 24 & 25.mp3" },
     { id: 1, title: "Pokemon Blue/Red - Route 11", src: "assets/music/Route 11.mp3" },
     { id: 2, title: "Pokemon Blue/Red - Route 4", src: "assets/music/Route 4.mp3" },
     { id: 3, title: "Pokemon Blue/Red - Pallet Town", src: "assets/music/Pallet Town.mp3" },
     { id: 4, title: "Pokemon Blue/Red - Pewter City", src: "assets/music/Pewter City.mp3" },
     { id: 5, title: "Pokemon Blue/Red - Ending", src: "assets/music/Ending.mp3" },
     { id: 6, title: "The Battle at the Summit! - Super Smash Bros. Ultimate OST", src: "assets/music/The Battle at the Summit.mp3" },
     { id: 7, title: "Pokémon Gold/Pokemon Silver Medley - Super Smash Bros. Melee", src: "assets/music/Silver Medley.mp3" },
     { id: 8, title: "Lumiose City (Pokemon X & Y) - Super Smash Bros. Ultimate Soundtrack", src: "assets/music/Lumiose City.mp3" },
     { id: 9, title: "Vermillion City Piano Theme by Elden Tales", src: "assets/music/Vermillion_City.mp3" },
     { id: 10, title: "National Park Piano Theme by Elden Tales", src: "assets/music/National_Park.mp3" },
     { id: 11, title: "Azalea Town Piano Theme by Elden Tales", src: "assets/music/Azalea_Town.mp3" },
     { id: 12, title: "Cianwood City Piano Theme by Elden Tales", src: "assets/music/Cianwood_City.mp3" },
     { id: 13, title: "New Bark Town Piano Theme by Elden Tales", src: "assets/music/New_Bark_Town.mp3" },
     { id: 14, title: "Verdanturf Town Piano Theme by Elden Tales", src: "assets/music/Verdanturf_Town.mp3" },
     { id: 15, title: "Oldale Town Piano Theme by Elden Tales", src: "assets/music/Oldale_Town.mp3" },
     { id: 16, title: "Littleroot Town Piano Theme by Elden Tales", src: "assets/music/Littleroot_Town.mp3" },
     { id: 17, title: "Goldenrod City Piano Theme by Elden Tales", src: "assets/music/Goldenrod_City.mp3" }
   ];
const themes = ['theme-normal', 'theme-pikachu', 'theme-charmander', 'theme-bulbasaur', 'theme-squirtle', 'theme-mewtwo'];
const randomSongIndex = Math.floor(Math.random() * musicTracks.length);
const randomThemeIndex = Math.floor(Math.random() * themes.length);
const [currentTrackIndex, setCurrentTrackIndex] = useState(randomSongIndex);
const [isPlaying, setIsPlaying] = useState(false);
const currentTrack = musicTracks[currentTrackIndex];
const audioRef = useRef(null);
const [showVolume, setShowVolume] = useState(false);
const [volume, setVolume] = useState(0.6); // 1 = 100%
const [prevVolume, setPrevVolume] = useState(1);
const [theme, setTheme] = useState(themes[randomThemeIndex]);
const [loading, setLoading] = useState(true);
const [loaded, setLoaded] = useState(0);
const loadComplete = assets.length;

const handlePrev = () => {
  setCurrentTrackIndex((prev) => (prev === 0 ? musicTracks.length - 1 : prev - 1));
};
const handleNext = () => {
  setCurrentTrackIndex((prev) => (prev === musicTracks.length - 1 ? 0 : prev + 1));
};
const handlePlayPause = () => {
  setIsPlaying((prev) => !prev);
};

const handleVolumeChange = (e) => {
  setVolume(e.target.value);
  if (audioRef.current) {
    audioRef.current.volume = e.target.value;
  }
};

const handleThemes = () => {
  setTheme((prev) => {
    const currentIndex = themes.indexOf(prev);
    const nextIndex = (currentIndex + 1) % themes.length;
    document.body.classList.remove(`${themes[currentIndex]}`);
    document.body.className = themes[nextIndex];
    return themes[nextIndex];
  });
};

function preloadAsset(src) {
  return new Promise((resolve) => {
    if (src.match(/\.(png|jpg|jpeg|gif|svg|PNG)$/)) {
      const img = new window.Image();
      img.onload = () => {
        setLoaded(prev => prev + 1);
        resolve();
      };
      img.onerror = () => {
        setLoaded(prev => prev + 1);
        resolve();
      };
      img.src = src;
      preloadedImages[src] = img; // Guardar la imagen
    } else if (src.match(/\.(mp3|wav|ogg)$/)) {
      const audio = new window.Audio();
      audio.oncanplaythrough = () => {
        setLoaded(prev => prev + 1);
        resolve();
      };
      audio.onerror = () => {
        setLoaded(prev => prev + 1);
        resolve();
      };
      audio.src = src;
      preloadedAudios[src] = audio; // Guardar el audio
    } else {
      resolve();
    }
  });
}

useEffect(() => {
    Promise.all(assets.map(preloadAsset)).then(() => {
      setLoading(false);
    });
  }, []);

useEffect(() => {
  document.body.className = theme;
}, [theme]);

useEffect(() => {
  if (!audioRef.current) return;
  audioRef.current.volume = volume;
  if (isPlaying) {
    audioRef.current.play();
  } else {
    audioRef.current.pause();
  }
}, [isPlaying, currentTrackIndex]);

useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return; // Evita conflicto con inputs
    if (e.key === "p" || e.key === "P") {
      handlePrev();
    }
    if (e.key === "n" || e.key === "N") {
      handleNext();
    }
    if (e.key === " ") {
      e.preventDefault(); // Evita scroll
      handlePlayPause();
    }
    if (e.key === "m" || e.key === "M") {
      e.preventDefault(); // Evita scroll
      handleVolumeChange({ target: { value: volume === 0 ? prevVolume : 0 } });
    }
    if (e.key === "+") {
      e.preventDefault(); // Evita scroll
      handleVolumeChange({ target: { value: Math.min(volume + 0.03, 1) } });
    }
    if (e.key === "-") {
      e.preventDefault(); // Evita scroll
      handleVolumeChange({ target: { value: Math.max(volume - 0.03, 0) } });
    }
    if (e.key === "t" || e.key === "T") {
      e.preventDefault(); // Evita scroll
      handleThemes();
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [handlePrev, handleNext, handlePlayPause, handleVolumeChange]);

if (loading) {
  return (
    <div className="loader-container">
      <h2 className="loading-text">Loading...</h2>
      <img src="assets/pikachu_loading.gif" alt="loading" className="loading-gif" />
      <div className="loading-bar-wrapper">
          <div
              className="loading-bar"
              style={{ "--loaded": loaded, "--total": loadComplete }}
          />
      </div>
    </div>
  );
}

if (!loading) {
  return (
    <>
    <BrowserRouter>
      <div className="music-player">
        <button title="Theme [T]" className="theme-button">{ theme === "theme-mewtwo" ? <img src="assets/themesb.png" alt="themes" width={30} onClick={handleThemes} /> : <img src="assets/themes.png" alt="themes" width={30} onClick={handleThemes} />}</button>
        <div className="music-controls" style={{ marginRight: "10px" }}>
          <button title="Previous Track [P]" className="music-button" onClick={handlePrev}>{ theme === "theme-mewtwo" ? <img src="assets/prevb.png" alt="previous" /> : <img src="assets/prev.png" alt="previous" />}</button>
          <button title="Play/Pause [Space]" className="music-button" onClick={handlePlayPause}>{ theme === "theme-mewtwo" ? <img src={isPlaying ? "assets/pauseb.png" : "assets/playb.png"} alt="play/pause" /> : <img src={isPlaying ? "assets/pause.png" : "assets/play.png"} alt="play/pause" />}</button>
          <button title="Next Track [N]" className="music-button" onClick={handleNext}>{ theme === "theme-mewtwo" ? <img src="assets/nextb.png" alt="next" /> : <img src="assets/next.png" alt="next" />}</button>
          <div
            className="volume-control"
            onMouseEnter={() => setShowVolume(true)}
          >
            <button title="Volume [M / +-]" className="music-button" id="volume-button"
            onClick={() => {
              if (volume > 0) {
                setPrevVolume(volume); // Guarda el volumen actual
                setVolume(0);
                if (audioRef.current) audioRef.current.volume = 0;
              } else {
                setVolume(prevVolume); // Restaura el volumen anterior
                if (audioRef.current) audioRef.current.volume = prevVolume;
              }
            }}>
              { theme === "theme-mewtwo" ? <img src={audioRef.current && audioRef.current.volume > 0 ? "assets/volumeb.png" : "assets/mutedb.png"} alt="volume" /> : <img src={audioRef.current && audioRef.current.volume > 0 ? "assets/volume.png" : "assets/muted.png"} alt="volume" />}
            </button>
            {showVolume && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                style={{ position: "absolute", left: "50%", bottom: "40px", transform: "translateX(-50%)" }}
                onMouseEnter={() => setShowVolume(true)}
                onMouseLeave={() => setShowVolume(false)}
              />
            )}
          </div>
        </div>
        <div className="music-info">
          <div className={`scroll-title ${theme}`}>
            {currentTrack ? currentTrack.title : "Select a track"}
          </div>
        </div>
        <audio
          ref={audioRef}
          src={currentTrack ? currentTrack.src : ""}
          onEnded={handleNext}
        />
      </div>
      <NavigationMenu theme={theme} loading={loading} />
      <Routes>
        <Route path="/" element={<Home setIsPlaying={setIsPlaying} theme={theme} loading={loading} />} />
        <Route path="/about" element={<About theme={theme} />} />
        <Route path="/game" element={<Game setIsPlaying={setIsPlaying} theme={theme} />} />
        <Route path="/gamebattle" element={<GameBattle setIsPlaying={setIsPlaying} theme={theme} />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}}

export default App;