import React, { useEffect, useState } from 'react';
import GamePieces from './GamePieces';
import '../App.css';

const GameState = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("highScore")) || 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [collision, setCollisionType] = useState("");
  const [direction, setDirection] = useState(null);

  const handleGameOver = (type) => {
    setGameOver(true);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score.toString());
    }
    setCollisionType(type);
  };

  const handleResetGame = () => {
    setScore(0);
    setGameOver(false);
    setDirection(null);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver && e.key === "Enter") {
        handleResetGame();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameOver]);

  return (
    <div className="game-container">
      <div className="scoreboard">
        <p>Score: {score}</p>
        <p>High Score: {highScore}</p>
      </div>
      {gameOver && (
        <div className="game-over">
          <p>Game Over</p>
          <p>
            Cause of Death:{" "}
            {collision === "wall" ? "You hit the wall" : "You hit yourself"}
          </p>
          <p>Press Enter to reset the game</p>
        </div>
      )}
      {!gameOver && (
        <GamePieces
          score={score}
          setScore={setScore}
          onGameOver={handleGameOver}
          direction={direction}
          setDirection={setDirection}
        />
      )}
    </div>
  );
};

export default GameState;
