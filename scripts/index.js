import { generateRandomPosition, generateRandomRGBColor } from "./utils.js";

const menu = document.querySelector('.menu');
const canvas = document.getElementById('canvas');
const score = document.querySelector('.score-value');
const playButton = document.querySelector('.button-play');
const menuScore = document.querySelector('.menu-score-value');
const menuRecord = document.querySelector('.menu-score-record');
const mobileButtonUp = document.querySelector('.btn-control.up');
const mobileButtonDown = document.querySelector('.btn-control.down');
const mobileButtonLeft = document.querySelector('.btn-control.left');
const mobileButtonRight = document.querySelector('.btn-control.right');

const size = 30;
const ctx = canvas.getContext('2d');
const eatAudio = new Audio("../assets/eat.mp3");
const gameOverAudio = new Audio("../assets/game-over.mp3");
const startGameAudio = new Audio("../assets/start-game.mp3");

const defaultPosition = {
  x: Math.floor((canvas.width / size) / 2) * size,
  y: Math.floor((canvas.height / size) / 2) * size,
};

const food = {
  x: generateRandomPosition(canvas.width, size),
  y: generateRandomPosition(canvas.height, size),
  color: generateRandomRGBColor(),
  points: 10,
};

let isRunning = false;
let lastFrameTime = 0;
let gameSpeed = 300;
let snake = [defaultPosition];
let canChangeDirection = true;
let direction, nextDirection, loopId;

const startGame = () => {
  if (isRunning) return;
  isRunning = true;
  direction = undefined;
  nextDirection = undefined;
  requestAnimationFrame(gameLoop);
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
    ctx.moveTo(canvas.width, y);
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
    eatAudio.play();
    score.textContent = Number(score.textContent) + food.points

    if (gameSpeed > 20) {
      gameSpeed -= 20;
    }

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
  startGameAudio.play();
  snake = [defaultPosition];
  direction = undefined;
  nextDirection = undefined;
  score.textContent = '0';
  menu.style.display = 'none';
  gameSpeed = 300;

  generateFood();
  startGame();
};

const gameLoop = (timestamp) => {
  if (!isRunning) return;
  if (!lastFrameTime) lastFrameTime = timestamp;

  const delta = timestamp - lastFrameTime;

  if (delta > gameSpeed) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawFood();
    drawSnake();

    if (nextDirection) direction = nextDirection;

    moveSnake();
    checkCollision();
    eatFood();

    canChangeDirection = true;
    lastFrameTime = timestamp;
  }

  loopId = requestAnimationFrame(gameLoop);
};

const gameOver = () => {
  gameOverAudio.play();
  isRunning = false;
  direction = undefined;
  nextDirection = undefined;

  if (loopId) {
    cancelAnimationFrame(loopId);
    loopId = undefined;
  }

  const currentRecord = localStorage.getItem('julay-snake-record') || 0;

  if (Number(score.textContent) > Number(currentRecord)) {
    localStorage.setItem('julay-snake-record', score.textContent);
  }

  const newRecord = localStorage.getItem('julay-snake-record') || 0;

  menu.style.display = 'flex';
  menuRecord.textContent = newRecord;
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

mobileButtonUp.addEventListener('pointerdown', () => {
  if (!canChangeDirection) return;
  if (direction !== 'DOWN') nextDirection = 'UP';
  canChangeDirection = false;
});

mobileButtonDown.addEventListener('pointerdown', () => {
  if (!canChangeDirection) return;
  if (direction !== 'UP') nextDirection = 'DOWN';
  canChangeDirection = false;
});

mobileButtonLeft.addEventListener('pointerdown', () => {
  if (!canChangeDirection) return;
  if (direction !== 'RIGHT') nextDirection = 'LEFT';
  canChangeDirection = false;
});

mobileButtonRight.addEventListener('pointerdown', () => {
  if (!canChangeDirection) return;
  if (direction !== 'LEFT') nextDirection = 'RIGHT';
  canChangeDirection = false;
});

playButton.addEventListener('click', handlePlayAgain);

startGame();
