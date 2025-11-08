const canvas = document.getElementById('canvas');
const mobileControl = document.querySelector('.mobile-control');

const resizeCanvas = () => {
  const width = Math.round((window.innerWidth * 0.8) / 30) * 30;
  const height = Math.round(((window.innerHeight * 0.8) - mobileControl.offsetHeight) / 30) * 30;
  
  canvas.width = width;
  canvas.height = height;
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();