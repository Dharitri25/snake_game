import React from "react";
import "./SnakeGame.css";
import GameInterface from "./GameInterface";

function SnakeGame() {
  return (
    <div>
      <div className="snake_nav">Welcome To Snake Game</div>
      <GameInterface />
    </div>
  );
}

export default SnakeGame;
