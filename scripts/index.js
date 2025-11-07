import { generateRandomPosition, generateRandomRGBColor } from "./utils.js";

const score = document.querySelector('.score-value');
const canvas = document.getElementById('canvas');
const playButton = document.querySelector('.button-play');
const menu = document.querySelector('.menu');
const menuScore = document.querySelector('.menu-score-value');

const size = 30;
const ctx = canvas.getContext('2d');
const defaultPosition = { x: 270, y: 270 };
const audio = new Audio("../assets/eat.mp3");

const food = {
  x: generateRandomPosition(canvas.width, size),
  y: generateRandomPosition(canvas.height, size),
  color: generateRandomRGBColor(),
  points: 10,
};

let isRunning = false;
let snake = [defaultPosition];
let canChangeDirection = true;
let direction, nextDirection, loopId;

const startGame = () => {
  if (isRunning) return;
  isRunning = true;
  direction = undefined;
  nextDirection = undefined;
  loopId = setTimeout(gameLoop, 50);
};

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
    ctx.moveTo(x, canvas.height);
    ctx.lineTo(x, 0);
    ctx.stroke();
  }

  for (let y = 0; y < canvas.height; y += size) {
    ctx.beginPath();
    ctx.moveTo(canvas.height, y);
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

const generateFood = () => {
  let x = generateRandomPosition(canvas.width, size);
  let y = generateRandomPosition(canvas.height, size);

  while (snake.some(segment => segment.x === x && segment.y === y)) {
    x = generateRandomPosition(canvas.width, size);
    y = generateRandomPosition(canvas.height, size);
  }

  food.x = x;
  food.y = y;
  food.color = generateRandomRGBColor();
};

const eatFood = () => {
  const head = snake[snake.length - 1];

  if (head.x === food.x && head.y === food.y) {
    snake.push(head);
    audio.play();
    score.textContent = Number(score.textContent) + food.points

    generateFood();
  }
}

const checkCollision = () => {
  const head = snake[snake.length - 1];
  const horizontalLimit = canvas.width - size;
  const verticalLimit = canvas.height - size;
  const neckIndex = snake.length - 2;

  const horizontalCollision = head.x < 0 || head.x > horizontalLimit;
  const verticalCollision = head.y < 0 || head.y > verticalLimit;

  const selfCollision = snake.find(((segment, index) =>{
    return index < neckIndex && segment.x === head.x && segment.y === head.y
  }))

  if (horizontalCollision || verticalCollision || selfCollision) {
    gameOver();
  }
}

const handlePlayAgain = () => {
  snake = [defaultPosition];
  direction = undefined;
  nextDirection = undefined;
  score.textContent = '0';
  menu.style.display = 'none';

  generateFood();
  startGame();
};

const gameLoop = () => {
  if (!isRunning) return;
  if (nextDirection) direction = nextDirection;

  if (loopId) {
    clearTimeout(loopId);
    loopId = null;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawFood();
  drawSnake();

  if (direction) {
    moveSnake();
    checkCollision();
    eatFood();
  }

  canChangeDirection = true;
  if (isRunning) loopId = setTimeout(gameLoop, 50);
};

const gameOver = () => {
  isRunning = false;
  direction = undefined;
  nextDirection = undefined;

  if (loopId) {
    clearTimeout(loopId);
    loopId = undefined;
  }

  menu.style.display = 'flex';
  menuScore.textContent = score.textContent;
};

document.addEventListener('keydown', ({ key }) => {
  if (key === "Enter") {
    handlePlayAgain();
    return;
  }

  if (!canChangeDirection) return;

  if (key == "ArrowRight" && direction != "LEFT") nextDirection  = "RIGHT";
  if (key == "ArrowLeft" && direction != "RIGHT") nextDirection  = "LEFT";
  if (key == "ArrowDown" && direction != "UP") nextDirection  = "DOWN";
  if (key == "ArrowUp" && direction != "DOWN") nextDirection  = "UP";

  canChangeDirection = false;
})

playButton.addEventListener('click', handlePlayAgain);

startGame();
