const ctx = document.getElementById('canvas').getContext('2d');

const size = 30;
const direction = 'RIGHT';
const defaultPosition = { x: 270, y: 270 };

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

const moveSnake = (direction) => {
  const head = { ...snake[snake.length - 1] };

  switch (direction) {
    case 'UP':
      head.y -= size;
      break;
    case 'DOWN':
      head.y += size;
      break;
    case 'LEFT':
      head.x -= size;
      break;
    case 'RIGHT':
      head.x += size;
      break;
  }

  snake.push(head);
  snake.shift();
}

setInterval(() => {
  ctx.clearRect(0, 0, 600, 600);
  moveSnake(direction);
  drawSnake();
}, 100);
