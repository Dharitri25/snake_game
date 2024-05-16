import React, { useState } from "react";

function GameInterface() {
  let direction = { x: 0, y: 0 };
  let speed = 2;
  const [lastPaintTime, setLastPaintTime] = useState(0);

  function main(ctime: any) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
      return;
    }
    setLastPaintTime(ctime);
    gameEngine();
  }

  function gameEngine() {
    // display snake
    
  }

  window.requestAnimationFrame(main);
  return (
    <div>
      <div id="board" className="game_board"></div>
    </div>
  );
}

export default GameInterface;
