import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import shotSound from './assets/sounds/shoot.mp3';
import dieSound from './assets/sounds/die2.mp3';
import buttonSound from './assets/sounds/click-button.mp3';
import zombie from './assets/image/zombie.png'

function App() {
  const [zombiePosition, setZombiePosition] = useState({ top: '0%', left: '0%' });
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [gameOver, setGameOver] = useState(false)
  const [ShotsCounter, setShotsCounter] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(3000);
  const [showDetails, setShowDetails] = useState(false)



  const containerRef = useRef(null);
  const gameMapRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(moveZombie, speed);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        gameMapRef.current && gameMapRef.current.contains(event.target) &&
        !containerRef.current.contains(event.target)
      ) {
        setMissed(prevMissed => prevMissed + 1);
        if (missed + 1 >= 5) {
          setGameOver(true);

        }
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [missed]);

  const restartGame = () => {
    playbuttonSound();
    setGameOver(false);
    setScore(0);
    setMissed(0);
  }

  const moveZombie = () => {
    const randomTop = Math.random() * 100;
    const randomLeft = Math.random() * 100;
    setZombiePosition({
      top: `${randomTop}%`,
      left: `${randomLeft}%`
    });
  };

  const handleZombieClick = () => {
    setScore(prevScore => prevScore + 1);
    setShotsCounter(prevShots => prevShots + 1);
    if (missed > 0 && ShotsCounter + 1 >= 5) {
      setMissed(prevMissed => prevMissed - 1);
    }
    if (score > highScore) {
      updateHighScore(score)
    }
    if (score > 100) {
      setSpeed(500);
    } else if (score > 60) {
      setSpeed(1000);
    } else if (score > 35) {
      setSpeed(1500);
    } else if (score > 20) {
      setSpeed(2000);
    } else if (score > 10) {
      setSpeed(2500);
    }

    moveZombie();
    playDieSound();
  };

  const updateHighScore = (newscore) => {
    if (newscore > highScore) {
      setHighScore(newscore);
      localStorage.setItem('highScore', newscore);
    }
  };

  useEffect(() => {
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore));
    }else{
      setShowDetails(true)
      localStorage.setItem('highScore', 0);
    }
  }, []);

  useEffect(() => {

  }, [])

  const playShotSound = () => {
    const audio = new Audio(shotSound);
    audio.play();
  };

  const playDieSound = () => {
    const audio = new Audio(dieSound);
    audio.play();
  };

  const playbuttonSound = () => {
    const audio = new Audio(buttonSound);
    audio.play();
  };


  return (
    <>
      <div className=' min-h-[100vh] flex justify-center items-center py-auto flex-col'>
        <div className='flex gap-2 justify-between max-w-[900px] px-1 mb-1 w-full'>
          <div className='flex gap-4'>
            <button className="text-white bg-red-600 p-2 w-[40px] hover:bg-red-700 rounded-full" onClick={() => setShowDetails(true)}>i</button>
            <span className="text-white bg-red-600 p-2 rounded-md ">High Score: {highScore}</span>
          </div>
          <h2 className="text-4xl bg-white rounded-md px-2 border-red-600 border-2 font-bold text-red-600 amb-4 ">Zombie Killer</h2>
          <div className='flex gap-4'>
            <span className="text-white bg-red-600 p-2 rounded-md  ">Score: {score}</span>
            <span className="text-white bg-red-600 p-2 rounded-md">Missed: {missed}</span>

          </div>

        </div>
        {/* game map  */}
        <div
          ref={gameMapRef}
          className='bg-[#22d558] mx-4 max-w-[900px] h-[80vh] w-full container p-4 relative rounded-md border-2'
          onClick={playShotSound}>
          <span
            ref={containerRef}
            style={{ top: zombiePosition.top, left: zombiePosition.left }}
            className='zombie absolute '
            onClick={handleZombieClick}
          >
            <img className='h-auto w-[5rem]  z-20' src={zombie} alt="" />
          </span>
        </div>
      </div>
      {/* game over */}

      {gameOver &&
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-70 backdrop-blur-2xl z-50">
          <div className="relative bg-white p-10 px-[10rem]  rounded-lg shadow-lg text-center">
            <h2 className="text-5xl font-bold text-red-600 mb-4">Game Over</h2>
            <span className="block text-2xl mb-2">Your Score: {score}</span>
            <span className="block text-2xl mb-6">High Score: 75567</span>
            <button className="px-6 py-3 bg-red-600 text-white text-4xl font-semibold rounded-md hover:bg-red-700 transition duration-300 ease-in-out" onClick={restartGame}>Restart Game</button>
          </div>
        </div>}
      {showDetails &&
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-70 backdrop-blur-2xl z-50">
          <div className="relative bg-[#fff] p-10 px-[10rem] rounded-lg shadow-lg text-center w-[90%] mx-auto max-h-[90vh] overflow-y-auto">
            <h2 className="text-5xl font-bold text-red-600 mb-4">Zombie Killer</h2>
            <p className="text-lg text-gray-800 mb-8">
              Welcome to the thrilling world of Zombie Killer! Prepare yourself for an adrenaline-pumping adventure as you step into the shoes of a fearless zombie hunter.
            </p>
            <div className="text-left text-gray-800 mb-8">
              <h3 className="text-3xl font-semibold mb-4">Game Summary:</h3>
              <p className="mb-4">
                <span className="font-semibold">Introduction:</span> Zombie Killer is an action-packed browser game where players take on the role of a skilled zombie hunter. Armed with a weapon, players must aim and shoot at zombies that randomly appear on the screen. The game tests players' reflexes, accuracy, and endurance as they strive to achieve the highest score possible while avoiding missing shots.
              </p>
              <h3 className="text-3xl font-semibold mb-4">Rules:</h3>
              <ul className="list-disc pl-6">
                <li>Objective: Score as many points as possible by shooting zombies.</li>
                <li>Game Over: Endures when the player misses five shots in total.</li>
                <li>Scoring: Each successful shot on a zombie earns the player one point.</li>
                <li>Speed Increase: The game's pace escalates as the player's score rises, intensifying the challenge.</li>
                <li>High Score: The highest achieved score is recorded locally for bragging rights.</li>
              </ul>
              <h3 className="text-3xl font-semibold mb-4">How to Play:</h3>
              <ul className="list-disc pl-6">
                <li>Starting the Game: Load the game and get ready for action.</li>
                <li>Shooting Zombies: Click on zombies to eliminate them and earn points.</li>
                <li>Avoid Missing Shots: Missing five shots leads to game over.</li>
                <li>Speed Increase: Brace yourself for faster-paced gameplay as your score climbs.</li>
                <li>Game Over: Watch out! Missing five shots ends the game.</li>
              </ul>
            </div>
            <p className="text-lg text-gray-800 mb-8">
              Are you ready to take on the horde of undead and become the ultimate Zombie Killer? Don't hesitate any longer—grab your weapon, sharpen your reflexes, and let the hunt begin!
            </p>
            <button className="px-8 py-4 bg-red-600 text-white text-2xl font-semibold rounded-md hover:bg-red-700 transition duration-300 ease-in-out" onClick={() => setShowDetails(false)}>Close</button>
          </div>
        </div>


      }
    </>
  );
}

export default App;
