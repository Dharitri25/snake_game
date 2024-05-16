import React, { useState } from "react";
import "./SnakeGame.css";
import GameInterface from "./GameInterface";

function SnakeGame() {
  const [startGame, setStartGame] = useState(false);
  return (
    <div>
      <div className="snake_nav">Welcome To Snake Game</div>
      <div className="score_div">
        <div className="score_btn">
          High Score: <span>0</span>
        </div>
        <div className="score_btn">
          Score: <span>0</span>
        </div>
      </div>
      {startGame ? (
        <button className="start_btn">Pause</button>
      ) : (
        <button className="start_btn" onClick={() => setStartGame(true)}>
          Start 🐍 Game
        </button>
      )}
      {startGame && <GameInterface />}
    </div>
  );
}

export default SnakeGame;
