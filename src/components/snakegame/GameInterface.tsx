import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useInterval } from "../utils/useInterval";
import {
  SCALE,
  SPEED,
  DIRECTIONS,
  APPLE_START,
  CANVAS_SIZE,
  SNAKE_START,
} from "../utils/constants";

function GameInterface(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [startGame, setStartGame] = useState<boolean>(false);
  const [snake, setSnake] = useState<number[][]>(SNAKE_START);
  const [apple, setApple] = useState<number[]>(APPLE_START);
  const [direction, setDirection] = useState<[number, number]>([0, -1]);
  const [speed, setSpeed] = useState<number>(SPEED);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(
    parseInt(localStorage.getItem("highScore") || "0", 10)
  );

  useInterval(() => gameLoop(), speed);

  const endGame = () => {
    setSpeed(0);
    setStartGame(false);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score.toString());
    }
  };

  const moveSnake = (keyCode: number) => {
    if (keyCode >= 37 && keyCode <= 40) {
      const newDirection = DIRECTIONS[keyCode];
      if (newDirection) {
        const [newX, newY] = newDirection;
        const [currentX, currentY] = direction;
        if (newX !== -currentX && newY !== -currentY) {
          setDirection(newDirection);
        }
      }
    }
  };

  const createApple = () => {
    return [
      Math.floor(Math.random() * (CANVAS_SIZE[0] / SCALE)),
      Math.floor(Math.random() * (CANVAS_SIZE[1] / SCALE)),
    ];
  };

  const checkCollision = (
    piece: number[],
    snk: number[][] = snake
  ): boolean => {
    if (
      piece[0] * SCALE >= CANVAS_SIZE[0] ||
      piece[0] < 0 ||
      piece[1] * SCALE >= CANVAS_SIZE[1] ||
      piece[1] < 0
    )
      return true;
    
    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = (newSnake: number[][]): boolean => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      setApple(newApple);
      if (startGame) setScore(score + 1);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [
      snakeCopy[0][0] + direction[0],
      snakeCopy[0][1] + direction[1],
    ];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  const startSnkGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDirection([0, -1]);
    setSpeed(SPEED);
    setStartGame(true);
    setScore(0);
  };

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    if (context) {
      context.setTransform(SCALE, 0, 0, SCALE, 1, 1);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Draw the snake
      // context.fillStyle = "#818f12";
      // snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));

      // Draw apple
      // context.fillStyle = "#eb70ba";
      // context.fillRect(apple[0], apple[1], 0.9, 0.9);

      // Draw the snake with styling
      snake.forEach(([x, y], index) => {
        // Alternate colors for each segment
        context.fillStyle = index % 2 === 0 ? "#4CAF50" : "#8BC34A";

        // Draw the main rectangle
        context.fillRect(x, y, 1, 1);

        // Add a border to each segment
        context.strokeStyle = "#ffffff";
        context.lineWidth = 0.05;
        context.strokeRect(x, y, 1, 1);
      });

      // Create an off-screen canvas to render the emoji
      const offscreenCanvas = document.createElement("canvas");
      const offscreenContext = offscreenCanvas.getContext("2d");

      if (offscreenContext) {
        offscreenCanvas.width = 32;
        offscreenCanvas.height = 32;

        // Draw the emoji on the off-screen canvas
        offscreenContext.font = "32px serif";
        offscreenContext.textAlign = "center";
        offscreenContext.textBaseline = "middle";
        offscreenContext.fillText("🍎", 16, 16);

        // Draw the emoji from the off-screen canvas to the main canvas
        context.drawImage(offscreenCanvas, apple[0], apple[1], 1, 1);
      }
    }
  }, [snake, apple, startGame]);

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e: KeyboardEvent) => moveSnake(e?.keyCode)}
    >
      <div className="score_div">
        <div className="score_btn">
          High Score: <span>{highScore}</span>
        </div>
        <div className="score_btn">
          Score: <span>{score}</span>
        </div>
      </div>
      <div>
        {!startGame &&
          (score === 0 ? (
            <div className="start_section">
              <button
                className="start_btn"
                onClick={() => {
                  setStartGame(true);
                  startSnkGame();
                }}
              >
                Start 🐍 Game
              </button>
              <span>
                Instruction: Use arrow keys to move the snake (⬆️➡️⬇️⬅️)
              </span>
            </div>
          ) : (
            <button className="start_btn" onClick={startSnkGame}>
              Start Again
            </button>
          ))}
      </div>
      {startGame ? (
        <canvas
          className="game_board"
          ref={canvasRef}
          width={`${CANVAS_SIZE[0]}vw`}
          height={`${CANVAS_SIZE[1]}vh`}
        ></canvas>
      ) : (
        score > 0 && <div className="game_over">--- GAME OVER ---</div>
      )}
    </div>
  );
}

export default GameInterface;
