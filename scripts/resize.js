const canvas = document.getElementById('canvas');

const resizeCanvas = () => {
  const width = Math.round((window.innerWidth * 0.8) / 30) * 30;
  const height = Math.round((window.innerHeight * 0.8) / 30) * 30;

  if (width < 600 || height < 570) {
    canvas.width = width;
    canvas.height = height;
  }
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();