import React, { useEffect, useRef, useState } from 'react';
import '../App.css';

const GamePieces = ({ score, setScore, onGameOver, direction, setDirection }) => {
  const canvasRef = useRef();
  const [apple, setApple] = useState({ x: 180, y: 100 });
  const [snake, setSnake] = useState([
    { x: 100, y: 50 },
    { x: 95, y: 50 },
  ]);
  const [snake_speed, setSnakeSpeed] = useState(14); // State to manage snake speed

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawSnake = () => {
      snake.forEach((snakePart) => {
        ctx.beginPath();
        ctx.rect(snakePart.x, snakePart.y, 14, 14);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.closePath();
      });
    };

    const drawApple = () => {
      ctx.beginPath();
      ctx.rect(apple.x, apple.y, 14, 14);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();
    };

    const moveSnake = () => {
      if (direction) {
        setSnake((prevSnake) => {
          const newSnake = [...prevSnake];
          const snakeHead = { ...newSnake[0] };

          switch (direction) {
            case "UP":
              snakeHead.y -= snake_speed;
              break;
            case "DOWN":
              snakeHead.y += snake_speed;
              break;
            case "LEFT":
              snakeHead.x -= snake_speed;
              break;
            case "RIGHT":
              snakeHead.x += snake_speed;
              break;
            default:
              break;
          }

          // Move the body
          for (let i = newSnake.length - 1; i > 0; i--) {
            newSnake[i] = { ...newSnake[i - 1] };
          }

          // Update the head
          newSnake[0] = snakeHead;

          handleAppleCollision(newSnake);
          handleWallCollision(snakeHead);
          handleBodyCollision(newSnake);

          return newSnake;
        });
      }
    };

    const handleAppleCollision = (newSnake) => {
      const snakeHead = newSnake[0];
      const distance = Math.sqrt(
        (snakeHead.x - apple.x) ** 2 + (snakeHead.y - apple.y) ** 2
      );

      if (distance < 10) { // 14 is the size of the snake and apple squares
        setScore(prevScore => prevScore + 1); // Increment score by 1

        setApple({
          x: Math.floor((Math.random() * ((canvas.width - 10) / 14)) * 14),
          y: Math.floor((Math.random() * ((canvas.height - 10) / 14)) * 14)
        });

        // Increase speed by 1 for every 5 apples eaten
        if ((score + 1) % 5 === 0) {
          setSnakeSpeed(prevSpeed => prevSpeed + 1/2);
        }

        newSnake.push({
          x: newSnake[newSnake.length - 1].x,
          y: newSnake[newSnake.length - 1].y
        });
      }
    };

    const handleWallCollision = (snakeHead) => {
      if (snakeHead.x < 0 || snakeHead.x >= canvas.width || snakeHead.y < 0 || snakeHead.y >= canvas.height) {
        onGameOver("wall");
      }
    };

    const handleBodyCollision = (newSnake) => {
      const [head, ...body] = newSnake;
      if (body.some(part => part.x === head.x && part.y === head.y)) {
        onGameOver("body");
      }
    };

    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowRight":
          setDirection("RIGHT");
          break;
        case "ArrowLeft":
          setDirection("LEFT");
          break;
        case "ArrowUp":
          setDirection("UP");
          break;
        case "ArrowDown":
          setDirection("DOWN");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    const interval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      moveSnake();
      drawSnake();
      drawApple();
    }, 1000 / snake_speed); // Adjust interval based on snake_speed

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [apple, snake, direction, onGameOver, setScore, score, snake_speed]);

  return (
    <div>
      <canvas className="gameCanvas" ref={canvasRef} width={768} height={480} />
      <div className="controls">
        <div className="controls-row">
          <button onClick={() => setDirection("UP")}>&#8593;</button>
        </div>
        <div className="controls-row">
          <button onClick={() => setDirection("LEFT")}>&#8592;</button>
          <button onClick={() => setDirection("DOWN")}>&#8595;</button>
          <button onClick={() => setDirection("RIGHT")}>&#8594;</button>
        </div>
      </div>
    </div>
  );
};

export default GamePieces;
