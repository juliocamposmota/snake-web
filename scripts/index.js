import { generateRandomPosition, generateRandomRGBColor } from "./utils.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const size = 30;
const defaultPosition = { x: 270, y: 270 };

const food = {
  x: generateRandomPosition(canvas.width, size),
  y: generateRandomPosition(canvas.height, size),
  color: generateRandomRGBColor(),
};

let direction, loopId;
let snake = [defaultPosition];

const drawSnake = () => {
  ctx.fillStyle = "#999999";

  for (let i = 0; i < snake.length; i++) {
    if (i === snake.length - 1) {
      ctx.fillStyle = "#d1d1d1";
    }

    ctx.fillRect(snake[i].x, snake[i].y, size, size);
  }
}

const moveSnake = () => {
  const head = { ...snake[snake.length - 1] };

  switch (direction) {
    case 'UP': head.y -= size; break;
    case 'DOWN': head.y += size; break;
    case 'LEFT': head.x -= size; break;
    case 'RIGHT': head.x += size; break;
  }

  snake.push(head);
  snake.shift();
}

const drawGrid = () => {
  ctx.strokeStyle = "#232323";

  for (let x = 0; x < canvas.width; x += size) {
    ctx.beginPath();
    ctx.moveTo(x, 600);
    ctx.lineTo(x, 0);
    ctx.stroke();
  }

  for (let y = 0; y < canvas.width; y += size) {
    ctx.beginPath();
    ctx.moveTo(600, y);
    ctx.lineTo(0, y);
    ctx.stroke();
  }
}

const drawFood = () => {
  const { x, y, color } = food

  ctx.shadowColor = color
  ctx.shadowBlur = 6
  ctx.fillStyle = color
  ctx.fillRect(x, y, size, size)
  ctx.shadowBlur = 0
}

const gameLoop = () => {
  clearInterval(loopId)

  ctx.clearRect(0, 0, 600, 600);
  drawGrid();
  drawFood();
  moveSnake();
  drawSnake();

  loopId = setTimeout(() => {
    gameLoop()
  }, 300)
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp': direction = 'UP'; break;
    case 'ArrowDown': direction = 'DOWN'; break;
    case 'ArrowLeft': direction = 'LEFT'; break;
    case 'ArrowRight': direction = 'RIGHT'; break;
    default: break;
  }
})

gameLoop();
