const ctx = document.getElementById('canvas').getContext('2d');

const size = 30;
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

drawSnake();
